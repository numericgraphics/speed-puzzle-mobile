import * as json from "@/assets/json/queries.json";

export function getRandomQuery(): string {
  return json?.queries[Math.floor(Math.random() * json?.queries.length)];
}
