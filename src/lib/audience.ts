export type Audience = "b2c" | "b2b";

export function parseAudience(value: unknown): Audience {
  return value === "b2b" ? "b2b" : "b2c";
}
