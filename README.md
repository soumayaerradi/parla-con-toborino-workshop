# Step 2 — Capability del robot

Questo branch è **cumulativo**: contiene anche lo step 1.

La guida completa è in [`WORKSHOP.md`](WORKSHOP.md).

Indietro: `git switch step-1`  
Avanti: `git switch step-3`

## Obiettivo di questo step

Definire il vocabolario delle azioni. Il robot **non** sa fare qualsiasi cosa. Sa soltanto:

```text
led_on
led_off
move_servo
wait
```

File: `src/actions.ts`

## Cosa provare

Apri `src/actions.ts` e confrontalo con la chiamata libera dello step 1.

```bash
npx tsx src/gemini-test.ts
```

funziona ancora: non abbiamo ancora collegato il modello a questo vocabolario.

## Cosa osservare

- esiste uno schema TypeScript delle azioni
- il vocabolario è chiuso: niente pin, PWM o sketch Arduino
- l'hardware non è ancora coinvolto

> Prima di chiedere al modello cosa fare, definiamo cosa **può** fare.
