// Story authors supply both languages together, including the result of each choice.
export const t = (ru, tr) => ({ru, tr});
export const find = (prompt, items, answer, success) => ({kind:'find', prompt, items, answer, success});
export const order = (prompt, items, success) => ({kind:'order', prompt, items, success});
export const dial = (prompt, target, success) => ({kind:'dial', prompt, target, success});
export const cue = (prompt, action, success) => ({kind:'cue', prompt, action, success});
export const end = (choice, result) => ({choice, result});
export const story = (id, host, title, opening, tasks, question, endings) =>
  ({id, host, title, opening, tasks, question, endings});
