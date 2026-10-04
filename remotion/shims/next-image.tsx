/**
 * `next/image` for the Remotion bundle, which renders outside Next.js. The
 * film reuses components that draw marks with `next/image`; here a static
 * import is a plain URL (webpack's asset module) rather than Next's
 * `{ src, width, height }`, so both shapes are accepted and drawn as an <img>.
 */
type Source = string | { src: string };

export default function Image({
  src,
  alt,
  className,
  style,
}: {
  src: Source;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  [prop: string]: unknown;
}) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={typeof src === "string" ? src : src.src} alt={alt} className={className} style={style} />;
}
