import { match, _ } from "../src/match.js";

const tests = [
  () => match(2).case[1] -> "no"[2] -> "sí"[_] -> "def" === "sí",
  () => match({role:"admin"}).case[{role:"admin"}] -> "ok"[_] -> "no" === "ok",
  () => match({name:"Ana"}).case[{name:$n}] -> n === "Ana",
];

console.log(tests.every((fn, i) => (console.log(`Test ${i+1}: ${fn()?"OK":"FAIL"}`), fn())) ? "ALL TESTS PASS" : "FAIL");
