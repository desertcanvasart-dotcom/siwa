/** Admin-chosen image or video (decided by file extension). */
export function BackgroundMedia({ src, className }: { src: string; className: string }) {
  if (/\.(mp4|webm|mov|ogg)(\?.*)?$/i.test(src)) {
    return <video className={className} src={src} autoPlay muted loop playsInline />;
  }
  return <img className={className} src={src} alt="" loading="lazy" />;
}
