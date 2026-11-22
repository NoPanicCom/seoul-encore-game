const epsilon = 0.000001;
const defaultSpeed = 318;
const defaultRadius = 60;
const interactionPulseMs = 720;
const zero = { x: 0, y: 0 };
const standing = { phase: 0, strength: 0 };
const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));
const cross = (a, b) => a.x * b.y - a.y * b.x;
const difference = (a, b) => ({ x: a.x - b.x, y: a.y - b.y });
const interpolate = (a, b, t) => ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
function inRect(point, rect) {
    return point.x >= rect.x && point.x <= rect.x + rect.width
        && point.y >= rect.y && point.y <= rect.y + rect.height;
}
function polygonOf(region) {
    const points = 'width' in region
        ? [
            { x: region.x, y: region.y },
            { x: region.x + region.width, y: region.y },
            { x: region.x + region.width, y: region.y + region.height },
            { x: region.x, y: region.y + region.height },
        ]
        : region;
    if (points.length < 3 || points.some(({ x, y }) => !Number.isFinite(x) || !Number.isFinite(y))) {
        throw new RangeError('A world region must contain at least three finite points');
    }
    const edges = [];
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    let twiceArea = 0;
    let previous = points[points.length - 1];
    if (!previous)
        throw new RangeError('A world region cannot be empty');
    for (const point of points) {
        edges.push([previous, point]);
        twiceArea += cross(previous, point);
        minX = Math.min(minX, point.x);
        minY = Math.min(minY, point.y);
        maxX = Math.max(maxX, point.x);
        maxY = Math.max(maxY, point.y);
        previous = point;
    }
    if (Math.abs(twiceArea) <= epsilon)
        throw new RangeError('A world region must have an area');
    return { edges, bounds: { x: minX, y: minY, width: maxX - minX, height: maxY - minY } };
}
function inPolygon(point, polygon) {
    if (!inRect(point, polygon.bounds))
        return false;
    let inside = false;
    for (const [a, b] of polygon.edges) {
        if (point.x >= Math.min(a.x, b.x) && point.x <= Math.max(a.x, b.x)
            && point.y >= Math.min(a.y, b.y) && point.y <= Math.max(a.y, b.y)
            && Math.abs(cross(difference(b, a), difference(point, a))) <= epsilon)
            return true;
        if ((a.y > point.y) !== (b.y > point.y)
            && point.x < a.x + (b.x - a.x) * (point.y - a.y) / (b.y - a.y))
            inside = !inside;
    }
    return inside;
}
function boundaryTimes(start, end, polygon) {
    const minX = Math.min(start.x, end.x);
    const minY = Math.min(start.y, end.y);
    const { x, y, width, height } = polygon.bounds;
    if (Math.max(start.x, end.x) < x || minX > x + width
        || Math.max(start.y, end.y) < y || minY > y + height)
        return [];
    const times = [];
    const segment = difference(end, start);
    const squaredLength = segment.x ** 2 + segment.y ** 2;
    for (const [a, b] of polygon.edges) {
        const edge = difference(b, a);
        const offset = difference(a, start);
        const denominator = cross(segment, edge);
        if (Math.abs(denominator) > epsilon) {
            const t = cross(offset, edge) / denominator;
            const u = cross(offset, segment) / denominator;
            if (t >= -epsilon && t <= 1 + epsilon && u >= -epsilon && u <= 1 + epsilon) {
                times.push(clamp(t, 0, 1));
            }
        }
        else if (Math.abs(cross(offset, segment)) <= epsilon) {
            const first = (offset.x * segment.x + offset.y * segment.y) / squaredLength;
            const projection = (edge.x * segment.x + edge.y * segment.y) / squaredLength;
            const last = first + projection;
            if (Math.max(first, last) >= 0 && Math.min(first, last) <= 1) {
                times.push(clamp(first, 0, 1), clamp(last, 0, 1));
            }
        }
    }
    return times;
}
/** The world geometry describes legal foot positions. Obstacle edges are solid. */
export function createWorldNavigation(layout, cellSize = 20) {
    const { width, height } = layout;
    if ([width, height, cellSize].some(value => !Number.isFinite(value) || value <= 0)) {
        throw new RangeError('World dimensions and path grid size must be positive and finite');
    }
    const floor = polygonOf(layout.walkable);
    const walls = layout.obstacles.map(polygonOf);
    const world = { x: 0, y: 0, width, height };
    const canStand = (point) => inRect(point, world) && inPolygon(point, floor) && walls.every(wall => !inPolygon(point, wall));
    function canTravel(start, end) {
        if (!canStand(start) || !canStand(end))
            return false;
        if (distance(start, end) <= epsilon)
            return true;
        if (walls.some(wall => boundaryTimes(start, end, wall).length > 0))
            return false;
        const crossings = [0, ...boundaryTimes(start, end, floor), 1].sort((a, b) => a - b);
        let previous = 0;
        for (const crossing of crossings) {
            if (!inPolygon(interpolate(start, end, (previous + crossing) / 2), floor))
                return false;
            previous = crossing;
        }
        return true;
    }
    const columns = Math.ceil(width / cellSize);
    const rows = Math.ceil(height / cellSize);
    const grid = Array.from({ length: rows * columns }, (_, index) => {
        const x = Math.min(width, (index % columns + 0.5) * cellSize);
        const y = Math.min(height, (Math.floor(index / columns) + 0.5) * cellSize);
        const point = { x, y };
        return canStand(point) ? point : null;
    });
    function routeTo(start, target) {
        if (!canStand(start) || !Number.isFinite(target.x) || !Number.isFinite(target.y))
            return [];
        if (canTravel(start, target))
            return [target];
        const cost = new Float64Array(grid.length).fill(Infinity);
        const scores = new Float64Array(grid.length).fill(Infinity);
        const parents = new Int32Array(grid.length).fill(-1);
        const open = new Set();
        const standableTarget = canStand(target);
        const startColumn = Math.min(columns - 1, Math.floor(start.x / cellSize));
        const startRow = Math.min(rows - 1, Math.floor(start.y / cellSize));
        const nearby = cellSize * 2.5;
        for (let row = Math.max(0, startRow - 2); row <= Math.min(rows - 1, startRow + 2); row++) {
            for (let column = Math.max(0, startColumn - 2); column <= Math.min(columns - 1, startColumn + 2); column++) {
                const index = row * columns + column;
                const point = grid[index];
                if (point && canTravel(start, point)) {
                    cost[index] = distance(start, point);
                    scores[index] = cost[index] + distance(point, target);
                    open.add(index);
                }
            }
        }
        let closest = -1;
        let closestDistance = distance(start, target);
        let reachedTarget = false;
        while (open.size > 0) {
            let index = -1;
            let lowest = Infinity;
            for (const candidate of open) {
                const score = scores[candidate] ?? Infinity;
                if (score < lowest) {
                    lowest = score;
                    index = candidate;
                }
            }
            const point = grid[index];
            if (!point)
                break;
            open.delete(index);
            const remaining = distance(point, target);
            if (remaining < closestDistance) {
                closest = index;
                closestDistance = remaining;
            }
            if (standableTarget && remaining <= nearby && canTravel(point, target)) {
                closest = index;
                reachedTarget = true;
                break;
            }
            const column = index % columns;
            const row = Math.floor(index / columns);
            for (let nextRow = Math.max(0, row - 1); nextRow <= Math.min(rows - 1, row + 1); nextRow++) {
                for (let nextColumn = Math.max(0, column - 1); nextColumn <= Math.min(columns - 1, column + 1); nextColumn++) {
                    const nextIndex = nextRow * columns + nextColumn;
                    const next = grid[nextIndex];
                    if (!next || nextIndex === index)
                        continue;
                    const nextCost = (cost[index] ?? Infinity) + distance(point, next);
                    if (nextCost >= (cost[nextIndex] ?? Infinity) || !canTravel(point, next))
                        continue;
                    cost[nextIndex] = nextCost;
                    scores[nextIndex] = nextCost + distance(next, target);
                    parents[nextIndex] = index;
                    open.add(nextIndex);
                }
            }
        }
        const rawPath = reachedTarget ? [target] : [];
        while (closest >= 0) {
            const point = grid[closest];
            if (!point)
                break;
            rawPath.push(point);
            closest = parents[closest] ?? -1;
        }
        rawPath.reverse();
        // Remove grid turns wherever the player can see the next waypoint directly.
        const path = [];
        let from = start;
        let index = 0;
        while (index < rawPath.length) {
            let next = rawPath.length - 1;
            while (next > index) {
                const point = rawPath[next];
                if (point && canTravel(from, point))
                    break;
                next--;
            }
            const point = rawPath[next];
            if (!point)
                break;
            path.push(point);
            from = point;
            index = next + 1;
        }
        return path;
    }
    return { canStand, canTravel, routeTo };
}
export function worldCamera(world, viewport, focus) {
    const scale = Math.max(viewport.width / world.width, viewport.height / world.height);
    const visibleWidth = viewport.width / scale;
    const visibleHeight = viewport.height / scale;
    return {
        scale,
        x: clamp(focus.x - visibleWidth / 2, 0, Math.max(0, world.width - visibleWidth)),
        y: clamp(focus.y - visibleHeight / 2, 0, Math.max(0, world.height - visibleHeight)),
    };
}
export function cameraToWorld(point, camera) {
    return { x: point.x / camera.scale + camera.x, y: point.y / camera.scale + camera.y };
}
export function worldToCamera(point, camera) {
    return { x: (point.x - camera.x) * camera.scale, y: (point.y - camera.y) * camera.scale };
}
export function hitWorldHotspot(point, hotspots, enabled) {
    let hit;
    for (const hotspot of hotspots) {
        if (enabled(hotspot.id) && inRect(point, hotspot.hitbox)
            && (!hit || hotspot.position.y >= hit.position.y))
            hit = hotspot;
    }
    return hit;
}
function inRange(point, hotspot, navigation) {
    return distance(point, hotspot.approach) <= (hotspot.radius ?? defaultRadius)
        && navigation.canTravel(point, hotspot.approach);
}
const movementKeys = {
    ArrowLeft: { x: -1, y: 0 }, KeyA: { x: -1, y: 0 },
    ArrowRight: { x: 1, y: 0 }, KeyD: { x: 1, y: 0 },
    ArrowUp: { x: 0, y: -1 }, KeyW: { x: 0, y: -1 },
    ArrowDown: { x: 0, y: 1 }, KeyS: { x: 0, y: 1 },
};
function directionOf(movement) {
    if (Math.abs(movement.x) >= Math.abs(movement.y))
        return movement.x > 0 ? 'east' : 'west';
    return movement.y > 0 ? 'south' : 'north';
}
function strideLength(performer) {
    return Math.max(64, performer.height * 1.28);
}
/** A two-step cycle. Distance advances the phase, including under analog input. */
function advanceGait(gait, traveled, performer, dt) {
    if (traveled <= epsilon)
        return gait.strength === 0 ? gait : { phase: gait.phase, strength: 0 };
    const amount = traveled / strideLength(performer);
    const speed = traveled / dt / (performer.speed ?? defaultSpeed);
    const strength = gait.strength + (clamp(speed * 1.75, 0, 1) - gait.strength) * (1 - Math.exp(-23 * dt));
    return { phase: (gait.phase + amount) % 1, strength };
}
/** Bend the legs below the knee while keeping clothing above the joint attached. */
export function drawArticulatedFrame(ctx, image, source, target, gait, profile, kneeRatio) {
    const knee = Math.floor(source.height * kneeRatio);
    const legHeight = target.height * (source.height - knee) / source.height;
    const jointY = target.y + target.height - legHeight;
    const swing = Math.sin(gait.phase * Math.PI * 2) * gait.strength;
    ctx.drawImage(image, source.x, source.y, source.width, knee, target.x, target.y, target.width, jointY - target.y);
    // Draw the lifted leg first so the planted foot has priority where they cross in profile.
    const first = swing >= 0 ? -1 : 1;
    for (const side of [first, -first]) {
        const step = -side * swing;
        const lift = Math.max(0, step) * 0.24;
        const width = target.width / 2;
        const sourceWidth = source.width / 2;
        const offset = side === -1 ? 0 : 1;
        ctx.save();
        ctx.translate(target.x + width * offset, jointY);
        ctx.transform(1, 0, step * (profile ? 0.26 : 0.06), 1 - lift, 0, 0);
        ctx.drawImage(image, source.x + sourceWidth * offset, source.y + knee, sourceWidth, source.height - knee, 0, 0, width, legHeight);
        ctx.restore();
    }
}
function sheetViewport(sheet, size, row, column, lift) {
    const { frameWidth, frameHeight, anchor } = sheet;
    return {
        source: { x: column * frameWidth, y: row * frameHeight, width: frameWidth, height: frameHeight },
        target: { ...size, x: -size.width * (anchor ? anchor.x / frameWidth : 0.5),
            y: -size.height * (anchor ? anchor.y / frameHeight : 1) - lift },
    };
}
function drawSheetFrame(ctx, image, sheet, size, row, column, lift = 0) {
    const { source, target } = sheetViewport(sheet, size, row, column, lift);
    ctx.drawImage(image, source.x, source.y, source.width, source.height, target.x, target.y, target.width, target.height);
}
function drawShadow(ctx, point, width) {
    ctx.fillStyle = '#100b24';
    ctx.beginPath();
    ctx.ellipse(point.x, point.y + 2, width * 0.31, width * 0.09, 0, 0, Math.PI * 2);
    ctx.globalAlpha = 0.32;
    ctx.fill();
    ctx.globalAlpha = 1;
}
function drawWalkingShadow(ctx, width, facing, swing, contact) {
    const profile = facing === 'east' || facing === 'west';
    const forward = facing === 'west' ? -1 : 1;
    ctx.fillStyle = '#100b24';
    ctx.globalAlpha = 0.19 + contact * 0.08;
    ctx.beginPath();
    ctx.ellipse(0, 3, width * (profile ? 0.29 : 0.23), width * 0.075, 0, 0, Math.PI * 2);
    ctx.fill();
    for (const side of [-1, 1]) {
        const footX = width * (profile ? side * (0.05 + contact * 0.06) * forward : side * 0.074);
        const footY = 2 + (profile ? side * 0.5 : side * swing * width * 0.035);
        ctx.globalAlpha = 0.25 - Math.max(0, -side * swing) * 0.16;
        ctx.beginPath();
        ctx.ellipse(footX, footY, width * 0.082, width * 0.033, 0, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.globalAlpha = 1;
}
function drawSparkle(ctx, point, radius, pulse) {
    ctx.save();
    ctx.translate(point.x, point.y - pulse * 4);
    ctx.fillStyle = '#2a204a';
    ctx.globalAlpha = 0.86;
    ctx.beginPath();
    ctx.arc(0, 0, radius * 1.42, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#fff5bb';
    ctx.beginPath();
    ctx.moveTo(0, -radius);
    ctx.lineTo(radius * 0.28, -radius * 0.28);
    ctx.lineTo(radius, 0);
    ctx.lineTo(radius * 0.28, radius * 0.28);
    ctx.lineTo(0, radius);
    ctx.lineTo(-radius * 0.28, radius * 0.28);
    ctx.lineTo(-radius, 0);
    ctx.lineTo(-radius * 0.28, -radius * 0.28);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}
function drawHeart(ctx, position, progress) {
    ctx.save();
    ctx.translate(position.x, position.y - 36 * progress);
    ctx.globalAlpha = Math.min(1, (1 - progress) * 3);
    ctx.fillStyle = '#ffa6dc';
    ctx.strokeStyle = '#412248';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 10);
    ctx.bezierCurveTo(-38, -12, -13, -29, 0, -14);
    ctx.bezierCurveTo(13, -29, 38, -12, 0, 10);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
}
export function createWorldEngine(options) {
    const { canvas, scene, joystick, companion } = options;
    const doc = canvas.ownerDocument;
    const canvasContext = canvas.getContext('2d', { alpha: false });
    if (!canvasContext || !doc.defaultView) {
        throw new Error('The world requires a canvas attached to a browser document');
    }
    const ctx = canvasContext;
    const view = doc.defaultView;
    const navigation = createWorldNavigation(scene);
    if (!navigation.canStand(scene.spawn))
        throw new RangeError('The world spawn must be on walkable ground');
    if (companion && (!navigation.canStand(companion.spawn)
        || !Number.isFinite(companion.followDistance) || companion.followDistance < 0)) {
        throw new RangeError('A companion needs a walkable spawn and a nonnegative follow distance');
    }
    const hotspots = [...scene.hotspots].sort((a, b) => a.position.y - b.position.y);
    const hotspotById = new Map(hotspots.map(hotspot => [hotspot.id, hotspot]));
    if (hotspotById.size !== hotspots.length || hotspots.some(hotspot => !navigation.canStand(hotspot.approach))) {
        throw new RangeError('World hotspots require unique IDs and walkable approach points');
    }
    const previousTouch = canvas.style.touchAction;
    const previousJoystickTouch = joystick?.base.style.touchAction ?? '';
    const previousThumbTranslate = joystick?.thumb.style.translate ?? '';
    canvas.style.touchAction = 'none';
    if (joystick)
        joystick.base.style.touchAction = 'none';
    const events = new AbortController();
    const listener = { signal: events.signal };
    const assets = new Map();
    const hotspotImages = new Map();
    const reducedMotion = view.matchMedia('(prefers-reduced-motion: reduce)');
    const disabledHotspots = new Set();
    const pressed = new Set();
    const pulses = new Map();
    let position = scene.spawn;
    let camera = worldCamera(scene, scene, position);
    let viewport = scene;
    let pixelsPerCssPixel = 1;
    let frame = null;
    let previousTime = null;
    let destroyed = false;
    let paused = false;
    let player = options.player;
    let facing = 'south';
    let gait = standing;
    let companionPosition = companion?.spawn ?? scene.spawn;
    let companionFacing = 'south';
    let companionGait = standing;
    let companionRoute = [];
    let companionTarget = scene.spawn;
    let route = [];
    let activeHotspot = null;
    let highlighted = null;
    let nearby = null;
    let tap = null;
    let joystickId = null;
    let joystickVector = zero;
    function loadImage(url) {
        const cached = assets.get(url);
        if (cached)
            return cached;
        const img = doc.createElement('img');
        img.addEventListener('load', scheduleFrame, listener);
        img.addEventListener('error', () => options.onAssetError?.(url), listener);
        assets.set(url, img);
        img.src = url;
        return img;
    }
    const background = loadImage(scene.background);
    let playerImage = loadImage(player.image);
    const companionImage = companion ? loadImage(companion.image) : null;
    for (const hotspot of hotspots) {
        if (hotspot.image)
            hotspotImages.set(hotspot.id, loadImage(hotspot.image));
    }
    function resize() {
        const { width, height } = canvas.getBoundingClientRect();
        if (width <= 0 || height <= 0)
            return;
        viewport = { width, height };
        pixelsPerCssPixel = clamp(view.devicePixelRatio, 1, 2);
        const backingWidth = Math.max(1, Math.round(width * pixelsPerCssPixel));
        const backingHeight = Math.max(1, Math.round(height * pixelsPerCssPixel));
        if (canvas.width !== backingWidth)
            canvas.width = backingWidth;
        if (canvas.height !== backingHeight)
            canvas.height = backingHeight;
        camera = worldCamera(scene, viewport, position);
        scheduleFrame();
    }
    const enabled = (id) => !disabledHotspots.has(id);
    function updateProximity() {
        let closest = null;
        let nearestDistance = Infinity;
        for (const hotspot of hotspots) {
            const gap = distance(position, hotspot.approach);
            if (enabled(hotspot.id) && gap < nearestDistance && inRange(position, hotspot, navigation)) {
                closest = hotspot.id;
                nearestDistance = gap;
            }
        }
        if (closest !== nearby) {
            nearby = closest;
            options.onProximityChange?.(nearby);
        }
    }
    function cancelRoute() {
        route = [];
        activeHotspot = null;
    }
    function clearInput() {
        pressed.clear();
        tap = null;
        clearJoystick();
        gait = standing;
        companionGait = standing;
    }
    function available() {
        return !destroyed && !paused && !doc.hidden;
    }
    function walkTo(point) {
        if (!available())
            return false;
        activeHotspot = null;
        route = navigation.routeTo(position, point);
        return route.length > 0;
    }
    function moveToHotspot(id) {
        if (!available() || !enabled(id))
            return false;
        const hotspot = hotspotById.get(id);
        if (!hotspot)
            return false;
        if (inRange(position, hotspot, navigation)) {
            cancelRoute();
            options.onInteract(id);
            return true;
        }
        if (!walkTo(hotspot.approach))
            return false;
        activeHotspot = id;
        return true;
    }
    function interact() {
        return nearby !== null && moveToHotspot(nearby);
    }
    function manualDirection() {
        let { x, y } = joystickVector;
        for (const key of pressed) {
            const vector = movementKeys[key];
            if (vector) {
                x += vector.x;
                y += vector.y;
            }
        }
        const magnitude = Math.max(1, Math.hypot(x, y));
        return { x: x / magnitude, y: y / magnitude };
    }
    function advanceRoute(budget) {
        let traveled = 0;
        while (budget > 0) {
            const waypoint = route[0];
            if (!waypoint)
                break;
            const length = distance(position, waypoint);
            if (length > epsilon)
                facing = directionOf(difference(waypoint, position));
            if (length > budget) {
                position = interpolate(position, waypoint, budget / length);
                return traveled + budget;
            }
            position = waypoint;
            route.shift();
            budget -= length;
            traveled += length;
        }
        return traveled;
    }
    function walkManually(direction, amount) {
        cancelRoute();
        const x = position.x + direction.x * amount;
        const y = position.y + direction.y * amount;
        const candidates = [{ x, y }, { x, y: position.y }, { x: position.x, y }];
        for (const point of candidates) {
            const traveled = distance(position, point);
            if (traveled > epsilon && navigation.canTravel(position, point)) {
                facing = directionOf(difference(point, position));
                position = point;
                return traveled;
            }
        }
        return 0;
    }
    function updateCompanion(dt) {
        if (!companion)
            return;
        const gap = distance(companionPosition, position);
        let waypoint;
        let remaining;
        if (navigation.canTravel(companionPosition, position)) {
            companionRoute = [];
            waypoint = position;
            remaining = Math.max(0, gap - companion.followDistance);
        }
        else {
            if (!companionRoute.length || distance(companionTarget, position) >= 28) {
                companionTarget = position;
                companionRoute = navigation.routeTo(companionPosition, companionTarget);
            }
            waypoint = companionRoute[0];
            remaining = waypoint ? distance(companionPosition, waypoint) : 0;
        }
        const travel = Math.min(remaining, (companion.speed ?? defaultSpeed) * dt);
        companionGait = advanceGait(companionGait, travel, companion, dt);
        if (!waypoint || travel <= epsilon)
            return;
        const length = distance(companionPosition, waypoint);
        companionFacing = directionOf(difference(waypoint, companionPosition));
        companionPosition = interpolate(companionPosition, waypoint, travel / length);
        if (travel >= length - epsilon)
            companionRoute.shift();
    }
    function update(dt) {
        const direction = manualDirection();
        const budget = (player.speed ?? defaultSpeed) * dt;
        const traveled = Math.hypot(direction.x, direction.y) > epsilon
            ? walkManually(direction, budget) : advanceRoute(budget);
        const previousPhase = gait.phase;
        gait = advanceGait(gait, traveled, player, dt);
        const nextContact = (previousPhase + traveled / strideLength(player)) * 2;
        if (Math.floor(nextContact) > Math.floor(previousPhase * 2)) {
            options.onStep?.();
        }
        updateCompanion(dt);
        updateProximity();
        if (activeHotspot && route.length === 0) {
            const id = activeHotspot;
            activeHotspot = null;
            const hotspot = hotspotById.get(id);
            if (hotspot && available() && enabled(id) && inRange(position, hotspot, navigation))
                options.onInteract(id);
        }
        const target = worldCamera(scene, viewport, position);
        const weight = reducedMotion.matches ? 1 : 1 - Math.exp(-11 * dt);
        camera = {
            scale: target.scale,
            x: camera.x + (target.x - camera.x) * weight,
            y: camera.y + (target.y - camera.y) * weight,
        };
    }
    function drawPerformer(context, performer, image, point, direction, motion) {
        const { sheet, draw } = performer;
        const depth = 0.86 + point.y / scene.height * 0.22;
        const width = performer.width * depth;
        const height = performer.height * depth;
        const pose = reducedMotion.matches ? standing : motion;
        const animate = pose.strength > 0;
        if (!draw && (!image.complete || image.naturalWidth === 0))
            return;
        const profile = direction === 'west' || direction === 'east';
        const lean = direction === 'west' ? -1 : direction === 'east' ? 1 : 0;
        context.save();
        context.translate(point.x, point.y);
        const angle = pose.phase * Math.PI * 2;
        const swing = Math.sin(angle) * pose.strength;
        const sway = Math.cos(angle) * pose.strength;
        const contact = 1 - Math.abs(swing);
        drawWalkingShadow(context, width, direction, swing, contact);
        if (animate) {
            context.translate(height * (sway * 0.009 + lean * 0.003), -height * Math.abs(swing) * 0.02);
            context.rotate(sway * 0.016 + lean * pose.strength * 0.018);
            context.scale(1 + pose.strength * 0.008 * contact, 1 - pose.strength * 0.012 * contact);
        }
        const size = { width, height };
        if (draw) {
            draw(context, size, direction, pose);
        }
        else if (sheet) {
            const mirrorFrom = direction === 'east' ? 'west' : direction === 'west' ? 'east' : null;
            const ownRow = sheet.rows[direction];
            const mirroredRow = mirrorFrom ? sheet.rows[mirrorFrom] : undefined;
            const row = ownRow ?? mirroredRow ?? sheet.rows.south ?? 0;
            if (ownRow === undefined && (mirroredRow !== undefined || direction === 'east'))
                context.scale(-1, 1);
            const step = animate ? sheet.walkColumns[Math.floor(pose.phase * sheet.walkColumns.length)] : undefined;
            const column = step ?? sheet.idleColumn;
            if (animate && sheet.articulated && direction !== 'south') {
                const { source, target } = sheetViewport(sheet, size, row, column, 0);
                drawArticulatedFrame(context, image, source, target, pose, profile, 0.72);
            }
            else {
                drawSheetFrame(context, image, sheet, size, row, column);
            }
        }
        else {
            if (direction === 'west')
                context.scale(-1, 1);
            context.drawImage(image, -width / 2, -height, width, height);
        }
        context.restore();
    }
    function drawHotspot(context, hotspot, now) {
        const image = hotspotImages.get(hotspot.id);
        const end = pulses.get(hotspot.id);
        const progress = end === undefined ? 1 : clamp(1 - (end - now) / interactionPulseMs, 0, 1);
        const bounce = !reducedMotion.matches && progress < 1 ? Math.sin(progress * Math.PI) * 16 : 0;
        const { position: point, sheet, size } = hotspot;
        if (image?.complete && image.naturalWidth > 0 && size) {
            drawShadow(context, point, size.width);
            if (sheet) {
                const step = progress < 1 && !reducedMotion.matches
                    ? sheet.walkColumns[Math.floor(progress * sheet.walkColumns.length)]
                    : undefined;
                context.save();
                context.translate(point.x, point.y);
                drawSheetFrame(context, image, sheet, size, sheet.rows.south ?? 0, step ?? sheet.idleColumn, bounce);
                context.restore();
            }
            else {
                context.drawImage(image, point.x - size.width / 2, point.y - size.height - bounce, size.width, size.height);
            }
        }
        if (progress < 1) {
            const top = size ? point.y - size.height : hotspot.hitbox.y;
            drawHeart(context, { x: point.x, y: top - 8 }, reducedMotion.matches ? 0 : progress);
        }
        else if (end !== undefined) {
            pulses.delete(hotspot.id);
        }
    }
    function render(context, now) {
        context.setTransform(pixelsPerCssPixel, 0, 0, pixelsPerCssPixel, 0, 0);
        context.fillStyle = '#20162f';
        context.fillRect(0, 0, viewport.width + 1, viewport.height + 1);
        context.scale(camera.scale, camera.scale);
        context.translate(-camera.x, -camera.y);
        if (background.complete && background.naturalWidth > 0) {
            context.drawImage(background, 0, 0, scene.width, scene.height);
        }
        const destination = route[route.length - 1];
        if (destination) {
            context.fillStyle = '#362957b3';
            context.strokeStyle = '#ffe3a7';
            context.lineWidth = 2.5;
            context.beginPath();
            context.ellipse(destination.x, destination.y, 22, 10, 0, 0, Math.PI * 2);
            context.fill();
            context.stroke();
        }
        const actors = [{
                performer: player, image: playerImage, point: position, direction: facing, motion: gait,
            }];
        if (companion && companionImage) {
            actors.push({
                performer: companion, image: companionImage, point: companionPosition, direction: companionFacing,
                motion: companionGait,
            });
            actors.sort((a, b) => a.point.y - b.point.y);
        }
        function drawActor(actor) {
            drawPerformer(context, actor.performer, actor.image, actor.point, actor.direction, actor.motion);
        }
        let actor = actors.shift();
        for (const hotspot of hotspots) {
            while (actor && hotspot.position.y >= actor.point.y) {
                drawActor(actor);
                actor = actors.shift();
            }
            drawHotspot(context, hotspot, now);
        }
        if (actor)
            drawActor(actor);
        actors.forEach(drawActor);
        const hint = highlighted ? hotspotById.get(highlighted) : undefined;
        if (hint && enabled(hint.id)) {
            drawSparkle(context, { x: hint.marker?.x ?? hint.position.x, y: (hint.marker?.y ?? hint.hitbox.y) + 8 }, Math.max(13, 10 / camera.scale), reducedMotion.matches ? 0 : Math.sin(now / 200));
        }
    }
    function tick(now) {
        frame = null;
        if (destroyed || doc.hidden)
            return;
        const dt = previousTime === null ? 0 : Math.min(0.045, (now - previousTime) / 1000);
        previousTime = now;
        if (!paused && dt > 0)
            update(dt);
        if (destroyed)
            return;
        render(ctx, now);
        options.onFrame?.();
        if (!paused || pulses.size > 0)
            scheduleFrame();
        else
            previousTime = null;
    }
    function scheduleFrame() {
        if (!destroyed && !doc.hidden && frame === null)
            frame = view.requestAnimationFrame(tick);
    }
    function onTapStart(event) {
        if (!available() || tap || event.button !== 0)
            return;
        event.preventDefault();
        canvas.setPointerCapture(event.pointerId);
        tap = { id: event.pointerId, x: event.clientX, y: event.clientY };
    }
    function onTapEnd(event) {
        if (tap?.id !== event.pointerId)
            return;
        const start = tap;
        tap = null;
        if (!available() || distance(start, { x: event.clientX, y: event.clientY }) > 12)
            return;
        const { left, top, width, height } = canvas.getBoundingClientRect();
        const pointer = { x: event.clientX - left, y: event.clientY - top };
        if (!inRect(pointer, { x: 0, y: 0, width, height }))
            return;
        const point = cameraToWorld(pointer, camera);
        const hotspot = hitWorldHotspot(point, hotspots, enabled);
        if (hotspot)
            moveToHotspot(hotspot.id);
        else
            walkTo(point);
    }
    function clearTap(event) {
        if (tap?.id === event.pointerId)
            tap = null;
    }
    function resetJoystickPosition() {
        joystickVector = zero;
        if (joystick)
            joystick.thumb.style.translate = previousThumbTranslate;
    }
    function clearJoystick() {
        const pointer = joystickId;
        joystickId = null;
        resetJoystickPosition();
        if (joystick && pointer !== null && joystick.base.hasPointerCapture(pointer)) {
            joystick.base.releasePointerCapture(pointer);
        }
    }
    function aimJoystick(event) {
        if (!joystick || joystickId !== event.pointerId || !available())
            return;
        const { left, top, width, height } = joystick.base.getBoundingClientRect();
        const reach = Math.max(1, Math.min(width, height) * 0.35);
        const x = event.clientX - left - width / 2;
        const y = event.clientY - top - height / 2;
        const length = Math.hypot(x, y);
        if (length < reach * 0.13) {
            resetJoystickPosition();
            return;
        }
        const divisor = Math.max(reach, length);
        joystickVector = { x: x / divisor, y: y / divisor };
        joystick.thumb.style.translate = `${joystickVector.x * reach}px ${joystickVector.y * reach}px`;
        cancelRoute();
    }
    function holdJoystick(event) {
        if (!joystick || joystickId !== null || !available() || event.button !== 0)
            return;
        event.preventDefault();
        joystickId = event.pointerId;
        joystick.base.setPointerCapture(event.pointerId);
        aimJoystick(event);
    }
    function releaseJoystick(event) {
        if (joystickId === event.pointerId)
            clearJoystick();
    }
    function keyDown(event) {
        if (!available() || event.altKey || event.ctrlKey || event.metaKey)
            return;
        const target = doc.activeElement;
        if (target?.closest('input, textarea, select, [contenteditable="true"]'))
            return;
        const key = event.code || event.key;
        if (movementKeys[key]) {
            event.preventDefault();
            pressed.add(key);
            cancelRoute();
        }
        else if (!event.repeat && (key === 'KeyE'
            || (key === 'Enter' && (target === canvas || !target?.closest('button, a, [role="button"]'))))) {
            if (interact())
                event.preventDefault();
        }
    }
    function keyUp(event) {
        pressed.delete(event.code || event.key);
    }
    function suspendFrame() {
        if (frame !== null)
            view.cancelAnimationFrame(frame);
        frame = null;
        previousTime = null;
    }
    function visibilityChanged() {
        clearInput();
        if (doc.hidden)
            suspendFrame();
        else
            scheduleFrame();
    }
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();
    canvas.addEventListener('pointerdown', onTapStart, listener);
    canvas.addEventListener('pointerup', onTapEnd, listener);
    canvas.addEventListener('pointercancel', clearTap, listener);
    canvas.addEventListener('lostpointercapture', clearTap, listener);
    joystick?.base.addEventListener('pointerdown', holdJoystick, listener);
    joystick?.base.addEventListener('pointermove', aimJoystick, listener);
    joystick?.base.addEventListener('pointerup', releaseJoystick, listener);
    joystick?.base.addEventListener('pointercancel', releaseJoystick, listener);
    joystick?.base.addEventListener('lostpointercapture', releaseJoystick, listener);
    view.addEventListener('keydown', keyDown, listener);
    view.addEventListener('keyup', keyUp, listener);
    view.addEventListener('blur', clearInput, listener);
    doc.addEventListener('visibilitychange', visibilityChanged, listener);
    updateProximity();
    scheduleFrame();
    return {
        destroy() {
            if (destroyed)
                return;
            destroyed = true;
            suspendFrame();
            events.abort();
            observer.disconnect();
            clearInput();
            canvas.style.touchAction = previousTouch;
            if (joystick)
                joystick.base.style.touchAction = previousJoystickTouch;
        },
        setPaused(value) {
            if (paused === value || destroyed)
                return;
            paused = value;
            clearInput();
            cancelRoute();
            suspendFrame();
            scheduleFrame();
        },
        walkTo,
        interact,
        moveToHotspot,
        setAppearance(appearance) {
            if (destroyed)
                return;
            player = appearance;
            playerImage = loadImage(appearance.image);
            scheduleFrame();
        },
        setHotspotImage(id, url) {
            if (destroyed || !hotspotById.has(id))
                return;
            if (url)
                hotspotImages.set(id, loadImage(url));
            else
                hotspotImages.delete(id);
            scheduleFrame();
        },
        setHotspotEnabled(id, value) {
            if (destroyed || !hotspotById.has(id))
                return;
            if (value)
                disabledHotspots.delete(id);
            else
                disabledHotspots.add(id);
            if (!value && activeHotspot === id)
                cancelRoute();
            updateProximity();
            scheduleFrame();
        },
        setHighlightedHotspot(id) {
            highlighted = id;
            scheduleFrame();
        },
        pulseHotspot(id) {
            if (destroyed || !hotspotById.has(id))
                return;
            pulses.set(id, view.performance.now() + interactionPulseMs);
            scheduleFrame();
        },
        getHotspotScreenPosition(id) {
            const hotspot = hotspotById.get(id);
            return hotspot ? worldToCamera(hotspot.marker ?? { x: hotspot.position.x, y: hotspot.hitbox.y }, camera) : null;
        },
        getTargetHotspot: () => activeHotspot,
        getPosition: () => ({ ...position }),
        getCompanionPosition: () => companion ? { ...companionPosition } : null,
        getCamera: () => ({ ...camera }),
    };
}
