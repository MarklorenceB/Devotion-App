import { client } from "@/sanity/lib/client";
import imageUrlBuilder from "@sanity/image-url";

// Sanity image builder
const builder = imageUrlBuilder(client);

export function urlForImage(source: any) {
  return builder.image(source).url();
}
