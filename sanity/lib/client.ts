import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "../env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // ✅ Read-only, fast
});

// ✅ Authenticated client for writes
export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  token: process.env.SANITY_WRITE_TOKEN, // must be set in .env.local
  useCdn: false,
});
