import { passes } from './story.js';
export const beatCount = 12;
export const beatMs = 650;
export const windowMs = 180;
export function beatAt(elapsed) {
    const index = Math.round(elapsed / beatMs) - 1;
    if (index < 0 || index >= beatCount)
        return null;
    return Math.abs(elapsed - (index + 1) * beatMs) <= windowMs ? index : null;
}
export function cardIds(raw) {
    return [...new Set((raw ?? '').split(',').filter(id => Object.prototype.hasOwnProperty.call(passes, id)))];
}
