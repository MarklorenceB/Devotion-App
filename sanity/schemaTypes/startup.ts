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
    defineField({
      name: "pitch",
      title: "Pitch",
      type: "text", // ⛔ changed from "markdown" (use plugin if you want markdown)
    }),
    defineField({
      name: "views",
      title: "Views",
      type: "number",
      initialValue: 0,
    }),
    defineField({
      name: "reactions",
      title: "Reactions",
      type: "object",
      fields: [
        defineField({
          name: "like",
          title: "Likes",
          type: "number",
          initialValue: 0,
          validation: (Rule) => Rule.min(0),
        }),
        defineField({
          name: "love",
          title: "Love",
          type: "number",
          initialValue: 0,
          validation: (Rule) => Rule.min(0),
        }),
        defineField({
          name: "pray",
          title: "Pray",
          type: "number",
          initialValue: 0,
          validation: (Rule) => Rule.min(0),
        }),
        defineField({
          name: "wow",
          title: "Wow",
          type: "number",
          initialValue: 0,
          validation: (Rule) => Rule.min(0),
        }),
      ],
      initialValue: {
        like: 0,
        love: 0,
        pray: 0,
        wow: 0,
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
