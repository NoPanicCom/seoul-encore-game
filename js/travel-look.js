import { studioMemberId, studioTravelSelection } from './studio.js';
import { drawArticulatedFrame } from './world-engine.js';
const longBottoms = new Set(['orbit-bottom-3', 'orbit-bottom-4', 'pulse-bottom-4', 'rouge-bottom-3']);
export function travelLook(memberName) {
    const member = studioMemberId(memberName);
    if (!member)
        return null;
    const selection = studioTravelSelection(member);
    return resolveLook(member, selection);
}
export function resolveLook(member, selection) {
    if (!selection)
        return { asset: `world/hero-${member}`, pieces: [] };
    if (selection.kind === 'mix') {
        const base = selection.pieces.some(piece => longBottoms.has(piece)) ? 'mix-pants' : 'mix';
        return { asset: `travel/${member}-${base}`, pieces: selection.pieces.map(piece => `travel/${piece}`) };
    }
    const variant = selection.kind === 'set' ? `set-${selection.id}` : selection.id;
    return { asset: `travel/${member}-${variant}`, pieces: [] };
}
export function concertCostume(member) {
    const look = travelLook(member);
    if (!look || look.asset.startsWith('world/'))
        return '';
    return dressedFigure(look);
}
export function dressedFigure(look, outer = '') {
    return `<span class="worn-look" data-costume="${look.asset}">${[look.asset, ...look.pieces].map(asset => `<img src="art/${asset}.webp" alt="">`).join('')}${outer}</span>`;
}
async function loadLayer(asset) {
    const image = new Image();
    image.src = `art/${asset}.webp`;
    await image.decode();
    return image;
}
export async function loadTravelLook(look) {
    const [base, pieces] = await Promise.all([loadLayer(look.asset), Promise.all(look.pieces.map(loadLayer))]);
    // The base world portraits have a 17 px head inset and an 11 px foot inset.
    const worldPortrait = look.asset.startsWith('world/hero-');
    return { base, pieces, sourceTop: worldPortrait ? 17 : 0, sourceHeight: worldPortrait ? 382 : base.naturalHeight };
}
/** Draw at the same foot anchor in both the street and the photo booth. */
export function drawTravelLook(context, look, x, y, height, facing = 1) {
    const { base, pieces, sourceTop, sourceHeight } = look;
    const width = height * base.naturalWidth / sourceHeight;
    context.save();
    context.translate(x, y);
    context.scale(facing, 1);
    context.drawImage(base, 0, sourceTop, base.naturalWidth, sourceHeight, -width / 2, -height, width, height);
    for (const piece of pieces)
        context.drawImage(piece, -width / 2, -height, width, height);
    context.restore();
}
const walkingLayers = new WeakMap();
export function drawWalkingTravelLook(context, look, height, direction, gait) {
    const facing = direction === 'west' ? -1 : 1;
    if (gait.strength === 0) {
        drawTravelLook(context, look, 0, 0, height, facing);
        return;
    }
    const { base, pieces, sourceHeight, sourceTop } = look;
    let image = base;
    let y = sourceTop;
    if (pieces.length > 0) {
        let layers = walkingLayers.get(look);
        if (!layers) {
            layers = context.canvas.ownerDocument.createElement('canvas');
            layers.width = base.naturalWidth;
            layers.height = sourceHeight;
            const costume = layers.getContext('2d');
            if (!costume)
                throw new Error('The walking costume requires a 2D canvas');
            costume.drawImage(base, 0, sourceTop, layers.width, sourceHeight, 0, 0, layers.width, sourceHeight);
            for (const piece of pieces)
                costume.drawImage(piece, 0, 0, layers.width, sourceHeight);
            walkingLayers.set(look, layers);
        }
        image = layers;
        y = 0;
    }
    const width = height * base.naturalWidth / sourceHeight;
    context.save();
    context.scale(facing, 1);
    drawArticulatedFrame(context, image, { x: 0, y, width: base.naturalWidth, height: sourceHeight }, { x: -width / 2, y: -height, width, height }, gait, direction === 'west' || direction === 'east', 0.67);
    context.restore();
}
