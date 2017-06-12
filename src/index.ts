import * as fs from "fs";
import * as path from "path";
import * as Chai from "chai";
import { exists, replaceExtension } from "nicer-fs";
import { readJson, writeJson, updateSnapshot } from "./utils";

/* tslint:disable ban-types */

export interface ChaiExtender extends Chai.ChaiStatic {
  Assertion: {
    addMethod(name: string, cb: Function): void;
  };
}

const matcher = (currentFile: string) => {
  const dir = path.dirname(currentFile);
  const filename = path.basename(currentFile);
  const snapFile = path.join(dir, "__snapshots__", filename + ".json");

  return (chai: ChaiExtender) => {
    chai.Assertion.addMethod("toMatchSnapshot", compareSnaps(chai, snapFile));
    chai.assert.snapshot = compareSnaps(chai, snapFile);
  };
};

export function compareSnaps(chai: ChaiExtender, snapFile: string) {
  return <T>(name: string, actual: T, update: boolean = false) => {
    const data = readJson(snapFile);
    if (
      data === undefined ||
      update ||
      (data !== undefined && data[name] === undefined)
    ) {
      writeJson(snapFile, { [name]: actual });
    } else {
      const expected = data[name];
      if (actual !== null && typeof actual === "object") {
        chai.assert.deepEqual(actual, expected);
      } else {
        chai.assert.equal(actual, expected);
      }
    }

    updateSnapshot(snapFile, { [name]: actual });
  };
}

export default matcher;

/* tslint:disable */
declare global {
  namespace Chai {
    interface Assertion {
      toMatchSnapshot(name: string): void;
    }

    interface Assert {
      snapshot<T>(name: string, actual: T, update?: boolean): void;
    }
  }
}
