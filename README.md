# Step 3 — Structured output

Questo branch è **cumulativo**: contiene anche gli step precedenti.

La guida completa è in [`WORKSHOP.md`](WORKSHOP.md).

Indietro: `git switch step-2`  
Avanti: `git switch step-4`

## Obiettivo di questo step

Passare da una risposta libera dell'LLM a un contratto strutturato.

```text
"accendi il led"
        ↓
Gemini + Zod
        ↓
RobotPlan
```

File: `src/actions.ts`, `src/gemini-planner.ts`

## Cosa provare

```bash
npm install
npx tsx src/plan-test.ts "accendi il led"
```

Poi prova anche:

```bash
npx tsx src/plan-test.ts "saluta"
```

## Cosa osservare

- il modello restituisce JSON, non una frase
- il JSON passa attraverso Zod (`RobotPlanSchema`)
- `accendi il led` diventa `{ type: "led_on" }`
- `saluta` **non** è una capability: il modello la decompone usando solo le azioni consentite

> Structured output è un contratto sulla forma. Non è ancora safety.
