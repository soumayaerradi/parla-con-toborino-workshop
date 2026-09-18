import "dotenv/config";

import {
  GoogleGenAI,
} from "@google/genai";

import {
  z,
} from "zod";

import {
  RobotPlanSchema,
  type RobotPlan,
} from "./actions.js";


const SYSTEM_PROMPT = `
Sei il planning layer di un piccolo robot.

Il robot possiede ESCLUSIVAMENTE queste capacità:

- led_on: accende il LED
- led_off: spegne il LED
- move_servo: muove il servo a un angolo
- wait: aspetta


Devi trasformare il comando dell'utente
in un piano strutturato.


Il piano contiene:

- summary
- executionMode
- steps


executionMode in questo step è sempre "finite".


REGOLE:

1. Se il comando è esplicito,
eseguilo letteralmente.

"accendi il led"
→ led_on

"spegni il led"
→ led_off

"porta il servo a 90 gradi"
→ move_servo angle 90


2. Non aggiungere azioni non richieste
quando il comando è esplicito.


3. Per richieste astratte come:

"saluta"
"sembra felice"
"attira la mia attenzione"

interpreta l'intenzione e componi più azioni
utilizzando esclusivamente
le capacità disponibili.


4. Non inventare nuove capacità.


5. Non generare codice Arduino.


6. Mantieni i piani brevi.


7. durationMs rappresenta
il tempo del movimento o dell'attesa
espresso in millisecondi.


8. NON occuparti della sicurezza fisica.

Un altro componente del sistema
deciderà se il piano può essere eseguito.
`.trim();


export class GeminiPlanner {

  private readonly ai:
    GoogleGenAI;


  constructor() {

    const apiKey =
      process.env
        .GEMINI_API_KEY;


    if (
      !apiKey
    ) {

      throw new Error(
        "GEMINI_API_KEY non trovata nel file .env"
      );
    }


    this.ai =
      new GoogleGenAI({
        apiKey,
      });
  }


  async plan(
    command: string
  ): Promise<RobotPlan> {

    const model =
      process.env
        .GEMINI_WORKSHOP_MODEL ??
      "gemini-3.1-flash-lite";


    const response =
      await this.ai.models
        .generateContent({

          model,

          contents:
          command,

          config: {

            systemInstruction:
            SYSTEM_PROMPT,

            responseMimeType:
              "application/json",

            responseJsonSchema:
              z.toJSONSchema(
                RobotPlanSchema
              ),

            temperature:
              0,
          },
        });


    if (
      !response.text
    ) {

      throw new Error(
        "Gemini non ha restituito nessun piano"
      );
    }


    let raw:
      unknown;


    try {

      raw =
        JSON.parse(
          response.text
        );

    }
    catch {

      throw new Error(
        `Gemini ha restituito JSON non valido: ${response.text}`
      );
    }


    return RobotPlanSchema.parse(
      raw
    );
  }
}
