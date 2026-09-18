import {
  GeminiPlanner,
} from "./gemini-planner.js";


const command =
  process.argv
    .slice(2)
    .join(" ")
    .trim() ||
  "accendi il led";


const planner =
  new GeminiPlanner();


console.log(
  `\n🧠 Planning: "${command}"\n`
);


const plan =
  await planner.plan(
    command
  );


console.log(
  "📋 Piano:"
);


console.dir(
  plan,
  {
    depth: null,
  }
);
