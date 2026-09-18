# Step 7 — Finite vs Continuous

Questo branch è **cumulativo**: contiene anche gli step precedenti.

La guida completa è in [`WORKSHOP.md`](WORKSHOP.md).

Indietro: `git switch step-6`  
Avanti: `git switch step-8`

## Obiettivo di questo step

Rappresentare correttamente l'intenzione continua, e farla **rifiutare** dal Safety Layer.

```ts
executionMode: "finite" | "continuous"
```

Un JSON valido non è automaticamente un'intenzione corretta, né un'azione sicura.

## Cosa provare

```bash
npx tsx src/cli.ts
```

```text
continua a salutare senza fermarti
saluta 3 volte
```

## Cosa osservare

- `senza fermarti` → `executionMode: "continuous"` e un ciclo **minimo**, non 50 ripetizioni
- `continuous` viene bloccato:

```text
🛑 BLOCCATO DAL SAFETY LAYER
Continuous execution is not allowed.
```

- `saluta 3 volte` è finito e può essere eseguito

```text
VALID JSON  ≠  CORRECT INTENT  ≠  SAFE ACTION
```
