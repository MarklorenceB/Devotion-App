import { createClient } from "next-sanity";
import { projectId, dataset, apiVersion, token } from "@/sanity/env";

export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token,
});
