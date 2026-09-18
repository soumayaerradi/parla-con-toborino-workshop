# Step 9 — LED reale

Questo branch è **cumulativo**: contiene anche gli step precedenti.

La guida completa è in [`WORKSHOP.md`](WORKSHOP.md).

Indietro: `git switch step-8`  
Avanti: `git switch step-10`

## Obiettivo di questo step

La prima azione dal linguaggio naturale al mondo fisico.

```text
"accendi il led" → Gemini → led_on → Safety → Executor → SerialDevice → LED 1 → ESP32 → LED ON
```

Firmware: `firmware/esp32-workshop/esp32-workshop.ino`  
`LED_PIN = 2`

## Cosa provare

1. Flashare il firmware.
2. Dal Serial Monitor: `LED 1` poi `LED 0`.
3. Chiudere il Serial Monitor.
4. In `.env`: `DEVICE=serial` e la porta corretta.
5. Avviare:

```bash
npx tsx src/cli.ts
```

```text
accendi il led
spegni il led
```

## Cosa osservare

- il LED è controllabile dal Serial Monitor
- la stessa cosa arriva dalla CLI, passando per piano e safety
- la frase naturale arriva davvero all'hardware
