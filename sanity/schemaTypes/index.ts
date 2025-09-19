import { type SchemaTypeDefinition } from "sanity";

import { author } from "@/sanity/schemaTypes/author";
import { startup } from "@/sanity/schemaTypes/startup";
import { post } from "./post";
import { category } from "./category";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [author, startup, post, category],
};
