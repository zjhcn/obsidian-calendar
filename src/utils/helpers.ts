export function deepClone(obj: any) {
  if (obj === null) return null;
  let clone = Object.assign({}, obj);
  Object.keys(clone).forEach(
    (key) =>
      (clone[key] =
        typeof obj[key] === "object" ? deepClone(obj[key]) : obj[key])
  );
  if (Array.isArray(obj)) {
    clone.length = obj.length;
    return Array.from(clone);
  }
  return clone;
}

export const get = (from: any, ...selectors: string[]) =>
  from === undefined
    ? null
    : [...selectors].map((s) =>
        s
          .replace(/\[([^\[\]]*)\]/g, ".$1.")
          .split(".")
          .filter((t) => t !== "")
          .reduce((prev, cur) => prev && prev[cur], from)
      );

export function set(obj: any, path: string | string[], value: any) {
  path = Array.isArray(path)
    ? path
    : path.replace("[", ".").replace("]", "").split(".");
  let src = obj;
  path.forEach((key, index, array) => {
    if (index == path.length - 1) {
      src[key] = value;
    } else {
      if (!src.hasOwnProperty(key) || src[key] === null) {
        // if the key doesn't exist on object
        const next = array[index + 1];
        src[key] = String(Number(next)) === next ? [] : {}; // create a new object if next is item in array is not a number
      }
      src = src[key];
    }
  });
}

export function callExpression(code: string, params: Record<string, any>) {
  const keys = [];
  const values = [];
  for (const key in params) {
    keys.push(key);
    values.push(params[key]);
  }
  const fn = new Function(...keys, code);
  return fn(...values);
}
