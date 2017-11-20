const { test } = require("ava");
const { instantiate } = require("../src/wasm");
const { wrap } = require("../src/wrap");

test.beforeEach(async (t) => {
  t.context.i = await instantiate("./hello-wasm.wasm");
});

test(`It's WASM time`, (t) => {
  const time = wrap(t.context.i.exports, "time", [], "CStr");
  t.deepEqual(time(), "Es ist fünf vor Zwölf!!");
});

test(`2 + 2 = 42`, (t) => {
  const add = wrap(t.context.i.exports, "add", ["i32", "i32"], "i32");
  t.deepEqual(add(2, 2), 42);
  t.deepEqual(add(1.1, 1.1), 42);
});

test(`Hello Jan-Erik`, (t) => {
  const hi = wrap(t.context.i.exports, "hi", ["CStr"], "CStr");
  t.deepEqual(hi("Jan-Erik"), "Jan-Erik");
});

test(`Hello UTF-8!`, (t) => {
  const hi = wrap(t.context.i.exports, "hi", ["CStr"], "CStr");
  t.deepEqual(hi("G̸rü͢ß ͟Got͠t͡!"), "G̸rü͢ß ͟Got͠t͡!");
});

test(`sha1`, (t) => {
  const digest = wrap(t.context.i.exports, "digest", ["CStr"], "CStr");
  t.deepEqual(digest("foobar"), "8843d7f92416211de9ebb963ff4ce28125932878");
});

test(`string slice`, (t) => {
  const time = wrap(t.context.i.exports, "time_str", [], "&str");
  t.deepEqual(time(), "Es ist fünf vor Zwölf!!!");
});

test(`owned string`, (t) => {
  const time = wrap(t.context.i.exports, "time_string", [], "String");
  t.deepEqual(time(), "Es ist fünf vor Zwölf!");
});

test(`slices and Vecs`, (t) => {
  const digest = wrap(t.context.i.exports, "digest_bytes", ["&[u8]"], "Vec<u8>");
  t.deepEqual(digest(new Uint8Array([0x00, 0x00, 0x00, 0x00])),
    new Uint8Array([13, 37, 42, 42]));
});
