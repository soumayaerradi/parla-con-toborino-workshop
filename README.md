# Step 10 — Servo reale

Questo branch è **cumulativo**: contiene anche gli step precedenti.

La guida completa è in [`WORKSHOP.md`](WORKSHOP.md).

Indietro: `git switch step-9`  
Avanti: `git switch step-11`

## Obiettivo di questo step

Muovere un servo SG90 dal linguaggio naturale.

Collegamenti (setup del workshop):

```text
rosso   → 5V
marrone → GND
arancio → GPIO 13
```

Firmware: `SERVO_PIN = 13`  
Range consentito: `10° - 170°`

## Cosa provare

Dal Serial Monitor:

```text
SERVO 45
SERVO 90
SERVO 135
```

Chiudi il Serial Monitor, poi:

```bash
npx tsx src/cli.ts
```

```text
porta il servo a 90 gradi
saluta
```

## Cosa osservare

- il servo risponde ai comandi seriali
- `porta il servo a 90 gradi` funziona dalla CLI
- `saluta` genera una sequenza fisica, non un singolo comando hardware
