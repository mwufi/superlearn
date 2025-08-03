// Docs: https://www.instantdb.com/docs/modeling-data

import { i } from "@instantdb/react";

const _schema = i.schema({
  entities: {
    $files: i.entity({
      path: i.string().unique().indexed(),
      url: i.string(),
    }),
    $users: i.entity({
      email: i.string().unique().indexed().optional(),
    }),
    curricula: i.entity({
      title: i.string(),
      prompt: i.string(),
      createdAt: i.number(),
      updatedAt: i.number(),
    }),
    topics: i.entity({
      topicId: i.string(),
      title: i.string(),
      description: i.string(),
      order: i.number(),
    }),
    content: i.entity({
      overview: i.string().optional(),
      keyConcepts: i.json<string[]>().optional(),
      practicalExamples: i.json<string[]>().optional(),
      importantPoints: i.json<string[]>().optional(),
      exercises: i.json<string[]>().optional(),
      createdAt: i.number(),
    }),
  },
  links: {
    curriculumTopics: {
      forward: { on: "curricula", has: "many", label: "topics" },
      reverse: { on: "topics", has: "one", label: "curriculum" },
    },
    topicContent: {
      forward: { on: "topics", has: "one", label: "content" },
      reverse: { on: "content", has: "one", label: "topic" },
    },
    userCurricula: {
      forward: { on: "$users", has: "many", label: "curricula" },
      reverse: { on: "curricula", has: "one", label: "user" },
    },
  },
  rooms: {},
});

// This helps Typescript display nicer intellisense
type _AppSchema = typeof _schema;
interface AppSchema extends _AppSchema {}
const schema: AppSchema = _schema;

export type { AppSchema };
export default schema;
