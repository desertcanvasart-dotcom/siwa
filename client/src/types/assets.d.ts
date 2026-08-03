// Vite's client types only cover lowercase image extensions; the
// attached_assets library has camera files in uppercase (also added to
// assetsInclude in vite.config.ts).
declare module "*.JPG" {
  const src: string;
  export default src;
}
declare module "*.JPEG" {
  const src: string;
  export default src;
}
declare module "*.PNG" {
  const src: string;
  export default src;
}
declare module "*.HEIC" {
  const src: string;
  export default src;
}
