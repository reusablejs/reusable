export const shallowCompare = (obj1, obj2) => {
  if ((!obj1 && obj2) || (obj1 && !obj2)) {
    return false;
  }
  if (!obj1 && !obj2) {
    return true;
  }
  const keys = [...Object.keys(obj1), ...Object.keys(obj2)];

   for (let key of keys) {
    if (obj1[key] !== obj2[key]) {
      return false;
    }
  }
  return true;
}
