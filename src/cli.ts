import {
  createInterface,
} from "node:readline/promises";

import {
  stdin as input,
  stdout as output,
} from "node:process";

import {
  GeminiPlanner,
} from "./gemini-planner.js";

import {
  SimulatorDevice,
} from "./devices/simulator.js";

import {
  Executor,
} from "./executor.js";

import {
  validatePlan,
  SafetyError,
} from "./safety.js";


const planner =
  new GeminiPlanner();


const device =
  new SimulatorDevice();


const executor =
  new Executor(
    device
  );


const rl =
  createInterface({
    input,
    output,
  });


console.log(`
🤖 PARLA CON TOBORINO
---------------------

Device:
${device.name}

Scrivi qualcosa che vuoi far fare al robot.

Esempi:

- accendi il led
- spegni il led
- porta il servo a 90 gradi
- saluta
- sembri felice
- attira la mia attenzione

Scrivi "exit" per uscire.
`);


while (true) {

  const command =
    (
      await rl.question(
        "tu > "
      )
    ).trim();


  if (!command) {
    continue;
  }


  if (
    command.toLowerCase()
    === "exit"
  ) {
    break;
  }


  try {

    console.log(
      "\n🧠 Planning...\n"
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
      "\n🛡️ Safety check...\n"
    );


    validatePlan(
      plan
    );


    console.log(
      "✅ Piano sicuro"
    );


    console.log(
      "\n⚙️ Esecuzione...\n"
    );


    await executor.execute(
      plan
    );


    console.log(
      "\n✅ Fatto!\n"
    );

  }

  catch (
    error
    ) {

    if (
      error instanceof
      SafetyError
    ) {

      console.error(
        "\n🛑 BLOCCATO DAL SAFETY LAYER"
      );


      console.error(
        `   ${error.message}\n`
      );


      continue;
    }


    if (
      error instanceof
      Error
    ) {

      console.error(
        "\n❌ Errore:"
      );


      console.error(
        `   ${error.message}\n`
      );


      continue;
    }


    console.error(
      "\n❌ Errore sconosciuto\n"
    );
  }
}


rl.close();

await device.close();
