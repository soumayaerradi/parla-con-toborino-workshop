# Step 4 — Simulator + Executor

Questo branch è **cumulativo**: contiene anche gli step precedenti.

La guida completa è in [`WORKSHOP.md`](WORKSHOP.md).

Indietro: `git switch step-3`  
Avanti: `git switch step-5`

## Obiettivo di questo step

Eseguire il piano **senza hardware**.

```text
Gemini → RobotPlan → Executor → Device → Simulator
```

File: `src/device.ts`, `src/executor.ts`, `src/devices/simulator.ts`

## Cosa provare

```bash
npx tsx src/run-plan.ts "accendi il led"
npx tsx src/run-plan.ts "porta il servo a 90 gradi"
npx tsx src/run-plan.ts "saluta"
```

## Cosa osservare

- `Executor` parla solo con l'interfaccia `Device`
- `SimulatorDevice` implementa `Device` e stampa LED/servo sulla console
- il piano gira anche se l'ESP32 non è collegata

La business logic non deve dipendere direttamente dall'hardware.
