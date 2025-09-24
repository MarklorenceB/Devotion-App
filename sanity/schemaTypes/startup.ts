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

    // ✅ Reactions as numbers
    defineField({
      name: "reactions",
      title: "Reactions",
      type: "object",
      fields: [
        { name: "like", title: "Likes", type: "number", initialValue: 0 },
        { name: "love", title: "Love", type: "number", initialValue: 0 },
        { name: "pray", title: "Pray", type: "number", initialValue: 0 },
        { name: "wow", title: "Wow", type: "number", initialValue: 0 },
      ],
      initialValue: { like: 0, love: 0, pray: 0, wow: 0 },
    }),

    // Updated Comments array definition

    defineField({
      name: "comments",
      title: "Comments",
      type: "array",
      of: [
        {
          type: "object",
          name: "comment",
          title: "Comment",
          fields: [
            { name: "user", title: "User", type: "string" },
            { name: "avatar", title: "Avatar", type: "url" },
            { name: "message", title: "Message", type: "text" },
            { name: "createdAt", title: "Created At", type: "datetime" },
            {
              name: "reactions",
              title: "Reactions",
              type: "object",
              fields: [
                { name: "like", type: "number", initialValue: 0 },
                { name: "love", type: "number", initialValue: 0 },
                { name: "pray", type: "number", initialValue: 0 },
                { name: "wow", type: "number", initialValue: 0 },
              ],
              initialValue: { like: 0, love: 0, pray: 0, wow: 0 },
            },
          ],
        },
      ],
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
