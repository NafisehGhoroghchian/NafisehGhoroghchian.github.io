// Base-aware URL helper, so the same source works at / and at /resume/.
const base = import.meta.env.BASE_URL;

export function href(path = '/'): string {
  const left = base.endsWith('/') ? base.slice(0, -1) : base;
  const right = path.startsWith('/') ? path : `/${path}`;
  return `${left}${right}` || '/';
}
