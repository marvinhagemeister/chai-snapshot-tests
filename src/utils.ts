import * as fs from "fs";
import * as path from "path";
import * as mkdirp from "mkdirp";

export function readJson(file: string): Record<string, any> | undefined {
  try {
    return JSON.parse(fs.readFileSync(file, { flag: "r", encoding: "utf8" }));
  } catch (err) {
    return undefined;
  }
}

export function writeJson(file: string, data: Record<string, any>): void {
  mkdirp.sync(path.dirname(file));
  return fs.writeFileSync(file, JSON.stringify(data, null, "  "), {
    encoding: "utf8",
  });
}
