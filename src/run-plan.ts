import {
  GeminiPlanner,
} from "./gemini-planner.js";

import {
  SimulatorDevice,
} from "./devices/simulator.js";

import {
  Executor,
} from "./executor.js";


const command =
  process.argv
    .slice(2)
    .join(" ")
    .trim() ||
  "accendi il led";


const planner =
  new GeminiPlanner();


const device =
  new SimulatorDevice();


const executor =
  new Executor(
    device
  );


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


console.log(
  "\n⚙️ Esecuzione...\n"
);


await executor.execute(
  plan
);


await device.close();
