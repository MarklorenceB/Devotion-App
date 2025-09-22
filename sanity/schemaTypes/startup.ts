import { defineField, defineType } from "sanity";

export const startup = defineType({
  name: "startup",
  title: "Startup",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "url",
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "pitch", title: "Pitch", type: "text" }),
    defineField({
      name: "views",
      title: "Views",
      type: "number",
      initialValue: 0,
    }),

    // ✅ reactions as arrays of usernames
    defineField({
      name: "reactions",
      title: "Reactions",
      type: "object",
      fields: [
        defineField({
          name: "like",
          title: "Likes",
          type: "array",
          of: [{ type: "string" }],
          initialValue: [],
        }),
        defineField({
          name: "love",
          title: "Love",
          type: "array",
          of: [{ type: "string" }],
          initialValue: [],
        }),
        defineField({
          name: "pray",
          title: "Pray",
          type: "array",
          of: [{ type: "string" }],
          initialValue: [],
        }),
        defineField({
          name: "wow",
          title: "Wow",
          type: "array",
          of: [{ type: "string" }],
          initialValue: [],
        }),
      ],
      initialValue: {
        like: [],
        love: [],
        pray: [],
        wow: [],
      },
    }),

    defineField({
      name: "author",
      title: "Author",
      type: "reference",
      to: [{ type: "author" }],
      validation: (Rule) => Rule.required(),
    }),
  ],
});
