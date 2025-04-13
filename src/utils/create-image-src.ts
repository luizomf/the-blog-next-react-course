export function createImageSrc(
  originalSrc: string,
  prefix = '/blog-ssg-nextjs',
  suffix = '',
) {
  return `${prefix}${originalSrc}${suffix}`;
}
