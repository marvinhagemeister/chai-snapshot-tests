import * as chai from "chai";
import * as path from "path";
import { remove } from "nicer-fs";
import snapshots from "../index";

chai.use(snapshots());
const t = chai.assert;

describe("snapshots", () => {
  beforeEach(async () => remove(path.join(__dirname, "__snapshots__")));

  it("should snapshot a string", () => {
    t.snapshot("foo", "test-foo");
    t.throws(() => t.snapshot("foo", "test2"));
    t.snapshot("foo", "test-foo2", true);
    t.snapshot("foo", "test-foo2");
  });

  it("should snapshot a multiline string", () => {
    t.snapshot("str_multi", "Hello\nWorld");
    t.throws(() => t.snapshot("str_multi", "Hello\nWorld2"));
    t.snapshot("str_multi", "Hello\nWorld2", true);
    t.snapshot("str_multi", "Hello\nWorld2");
  });

  it("should snapshot a number", () => {
    t.snapshot("bar", 1);
    t.throws(() => t.snapshot("bar", 2));
    t.snapshot("bar", 2, true);
    t.snapshot("bar", 2);
  });

  it("should snapshot an object", () => {
    t.snapshot("obj", { foo: "bar" });
    t.throws(() => t.snapshot("obj", { foo: "bar", boof: null }));
    t.snapshot("obj", { foo: "bar", boof: null }, true);
    t.snapshot("obj", { foo: "bar", boof: null });
  });

  it("should add toMatchSnapshot to expect", () => {
    t.equal(typeof chai.expect("foo").toMatchSnapshot, "function");
  });

  it("should add snapshot to assert", () => {
    t.equal(typeof chai.assert.snapshot, "function");
  });
});
