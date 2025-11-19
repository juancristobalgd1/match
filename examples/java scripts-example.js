import { match, _ , def } from "../src/match.js";



// ----------------------------------------
// HTTP Status Codes
// ----------------------------------------
const getStatus = (code) =>
  match(code).exhaustive()
    (200, "OK")
    (201, "Created")
    (404, "Not Found")
    (500, "Error")
    (def, "Unknown"); // Required in exhaustive mode!

console.log(getStatus(200)); // "OK"



// ----------------------------------------
// State Machine con exhaustive
// ----------------------------------------
const nextState = (state, event) =>
  match({ state, event }).exhaustive()
    ({ state: "idle", event: "start" }, "loading")
    ({ state: "loading", event: "success" }, "ready")
    ({ state: "loading", event: "error" }, "error")
    ({ state: "error", event: "retry" }, "loading")
    (def, state); // Fallback required

console.log(nextState("error", "retry")); // "loading"



// ----------------------------------------
// Redux con DEFAULT
// ----------------------------------------
const reducer = (state, action) =>
  match(action)
    ({ type: "ADD_TODO", payload: "$todo" }, 
     (b) => [...state, b.todo])
    ({ type: "REMOVE_TODO", payload: "$id" }, 
     (b) => state.filter(t => t.id !== b.id))
    (def, state); // More expressive than _

console.log(reducer(
  [{ id: 1, text: "Learn Match Pro" }],
  { type: "REMOVE_TODO", payload: { id: 2, text: "Build awesome apps" } }
));
// [{ id: 1, text: "Learn Match Pro" }, { id: 2, text: "Build awesome apps" }]