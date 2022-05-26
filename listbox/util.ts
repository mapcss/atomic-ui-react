import { joinChars } from "../util.ts";

export function getIdPrefix(id: string): string {
  return joinChars([id, "listbox", "option"], "-")!;
}
