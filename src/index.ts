import * as fs from "fs";
import * as path from "path";
import * as Chai from "chai";
import { getCallerFileName, exists, replaceExtension } from "nicer-fs";
import { readJson, writeJson, updateSnapshot } from "./utils";

/* tslint:disable ban-types */

export interface ChaiExtender extends Chai.ChaiStatic {
  Assertion: {
    addMethod(name: string, cb: Function): void;
  };
}

const matcher = () => {
  const callerFile = getCallerFileName();
  if (callerFile === undefined) {
    throw new Error("Could not determine caller filename");
  }

  const dir = path.dirname(callerFile);
  const filename = path.basename(callerFile);
  const snapFile = path.join(dir, "__snapshots__", filename + ".json");

  return (chai: ChaiExtender) => {
    chai.Assertion.addMethod("toMatchSnapshot", compareSnaps(chai, snapFile));
    (chai.assert as any).snapshot = compareSnaps(chai, snapFile);
  };
};

export function compareSnaps(chai: ChaiExtender, snapFile: string) {
  const caller = getCallerFileName();
  if (caller === undefined) {
    throw new Error("Could not determine current file");
  }

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
      toMatchSnapshot(name: string): Chai.Assertion;
    }

    interface Assert {
      snapshot(name: string, actual: any, update?: boolean): Chai.Assertion;
    }
  }
}
