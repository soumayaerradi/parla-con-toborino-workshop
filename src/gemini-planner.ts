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


executionMode può essere:

- finite
- continuous


USA executionMode = "finite"
quando il comando ha una durata o un numero
di azioni finito.

Esempi:

"accendi il led"
→ finite

"saluta"
→ finite

"saluta 3 volte"
→ finite

"porta il servo a 90 gradi"
→ finite


USA executionMode = "continuous"
quando l'utente chiede esplicitamente
un comportamento senza fine o continuo.

Esempi:

"continua a salutare senza fermarti"
→ continuous

"fallo per sempre"
→ continuous

"continua a muoverti"
→ continuous

"non smettere mai"
→ continuous


IMPORTANTE:

Se executionMode è "continuous",
NON devi simulare la continuità
creando tante azioni duplicate.

Devi produrre solamente
il ciclo minimo necessario
a rappresentare il comportamento.

Esempio:

"continua a salutare senza fermarti"

può diventare:

executionMode: continuous

steps:
- move_servo 45
- move_servo 135


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


9. Non trasformare un comando continuo
in un numero arbitrario di ripetizioni.

Se l'utente chiede qualcosa
senza fine,
usa executionMode = continuous.
`.trim();


const sleep = (
  ms: number
): Promise<void> =>
  new Promise(
    resolve =>
      setTimeout(
        resolve,
        ms
      )
  );


function getErrorMessage(
  error: unknown
): string {

  if (
    error instanceof Error
  ) {
    return error.message;
  }

  return String(
    error
  );
}


function isRetryableError(
  error: unknown
): boolean {

  const message =
    getErrorMessage(
      error
    );


  return (
    message.includes(
      '"code":503'
    ) ||
    message.includes(
      '"code":429'
    ) ||
    message.includes(
      "UNAVAILABLE"
    ) ||
    message.includes(
      "RESOURCE_EXHAUSTED"
    )
  );
}


async function withRetry<T>(
  operation: () => Promise<T>,
  maxAttempts = 4
): Promise<T> {

  let lastError:
    unknown;


  for (
    let attempt = 1;
    attempt <= maxAttempts;
    attempt++
  ) {

    try {

      return await operation();

    }
    catch (
      error
      ) {

      lastError =
        error;


      if (
        !isRetryableError(
          error
        )
      ) {
        throw error;
      }


      if (
        attempt ===
        maxAttempts
      ) {
        throw error;
      }


      const delayMs =
        500 *
        Math.pow(
          2,
          attempt - 1
        );


      console.log(
        `⚠️ Gemini temporaneamente non disponibile. Retry ${attempt}/${maxAttempts} tra ${delayMs}ms...`
      );


      await sleep(
        delayMs
      );
    }
  }


  throw lastError;
}


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
      await withRetry(
        () =>
          this.ai.models
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
            }),

        4
      );


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
