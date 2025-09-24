// @/sanity/lib/client.ts
import { createClient } from "@sanity/client";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  useCdn: false, // Must be false for write operations
  token: process.env.SANITY_API_TOKEN || process.env.SANITY_WRITE_TOKEN, // Use either token
  apiVersion: process.env.SANITY_API_VERSION || "2023-01-01",
});

// Export a read-only client for public operations (optional)
export const clientRead = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  useCdn: true, // Can use CDN for read operations
  apiVersion: process.env.SANITY_API_VERSION || "2023-01-01",
});
