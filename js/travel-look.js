import { studioMemberId, studioTravelSelection } from './studio.js';
const longBottoms = new Set(['orbit-bottom-3', 'orbit-bottom-4', 'pulse-bottom-4', 'rouge-bottom-3']);
export function travelLook(memberName) {
    const member = studioMemberId(memberName);
    if (!member)
        return null;
    const selection = studioTravelSelection(member);
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
    return `<span class="worn-look" data-costume="${look.asset}">${[look.asset, ...look.pieces].map(asset => `<img src="art/${asset}.webp" alt="">`).join('')}</span>`;
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
