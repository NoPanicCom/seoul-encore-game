export function sumiRecipeForVisitor(id) {
  if (!Number.isSafeInteger(id) || id < 1) throw new RangeError('Invalid Sumi visitor id');
  return id % 2 === 0 ? 'chocolate' : 'strawberry';
}
