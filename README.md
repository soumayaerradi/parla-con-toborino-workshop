# Step 8 — TypeScript → ESP32 via seriale

Questo branch è **cumulativo**: contiene anche gli step precedenti.

La guida completa è in [`WORKSHOP.md`](WORKSHOP.md).

Indietro: `git switch step-7`  
Avanti: `git switch step-9`

## Obiettivo di questo step

Sostituire `SimulatorDevice` con `SerialDevice` **senza** modificare Planner, Safety o Executor.

Protocollo:

```text
PING → PONG
```

File: `src/devices/serial.ts`, `src/create-device.ts`, `src/test-serial.ts`

## Cosa provare

In `.env`:

```env
DEVICE=serial
SERIAL_PORT=/dev/cu.usbserial-210
SERIAL_BAUD=115200
```

La porta sul tuo computer potrebbe avere un nome diverso: `npx tsx src/ports.ts`

Flashare `firmware/esp32-workshop/esp32-workshop.ino`, **chiudere** il Serial Monitor, poi:

```bash
npm install
npx tsx src/test-serial.ts
```

Se non hai l'ESP32, lascia `DEVICE=simulator` e osserva che Planner/Safety/Executor non cambiano.

## Cosa osservare

- Node apre la seriale
- invia `PING`
- l'ESP32 risponde `PONG`

Se ricevi `Resource busy`, la porta è occupata (di solito il Serial Monitor).
