# Step 5 — CLI interattiva

Questo branch è **cumulativo**: contiene anche gli step precedenti.

La guida completa è in [`WORKSHOP.md`](WORKSHOP.md).

Indietro: `git switch step-4`  
Avanti: `git switch step-6`

## Obiettivo di questo step

Arrivare alla prima pipeline completa, ancora simulata.

```text
CLI → Gemini → Piano → Executor → Simulator
```

## Cosa provare

```bash
npx tsx src/cli.ts
```

Poi, uno alla volta:

```text
accendi il led
porta il servo a 90 gradi
saluta
```

Scrivi `exit` per uscire.

## Cosa osservare

- il prompt viene scritto nella CLI
- Gemini crea il piano
- l'Executor lo esegue sul simulator
- `saluta` **non** è un comando hardware: è un'intenzione, e produce più di una capability

Non c'è ancora un Safety Layer: un piano strutturalmente valido viene eseguito così com'è.
