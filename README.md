# Parla con Toborino

Dal linguaggio naturale al mondo fisico con un LLM.

```text
Linguaggio naturale
        ↓
      LLM
        ↓
 Piano strutturato
        ↓
   Safety Layer
        ↓
     Executor
        ↓
      Device
   ┌────┴────┐
Simulator   ESP32
              ↓
         LED + Servo
```

> **The LLM proposes. The system decides.**

Il modello **non** genera codice Arduino e **non** parla con l'hardware. Propone un piano. Codice TypeScript deterministico decide se può girare.

## Da dove iniziare

La guida dei partecipanti è [`WORKSHOP.md`](WORKSHOP.md).

Il repository è organizzato in **branch progressivi**. Ogni branch è uno step funzionante e cumulativo: se resti indietro, salta allo step successivo invece di copiare a mano.

| Branch | Obiettivo |
|---|---|
| `step-1` | Collegarsi a Gemini e ottenere una prima risposta |
| `step-2` | Definire il vocabolario delle azioni |
| `step-3` | Ottenere un piano strutturato dall'LLM |
| `step-4` | Eseguire il piano su un simulatore |
| `step-5` | Costruire la CLI interattiva |
| `step-6` | Aggiungere il Safety Layer |
| `step-7` | Distinguere piani finiti e continui |
| `step-8` | Collegare TypeScript ed ESP32 via seriale |
| `step-9` | Accendere un LED reale con linguaggio naturale |
| `step-10` | Muovere un servo reale |
| `step-11` | Soluzione robusta: comandi astratti + retry + safety |
| `main` | Soluzione finale (questo branch) |

Ogni `step-*` ha un `README.md` breve: obiettivo, cosa provare, cosa osservare.

```bash
git switch step-1
```

Per vedere il delta:

```bash
git diff step-1..step-2
```

## Setup

Se non hai mai usato Node, Git o Gemini, parti da **[`WORKSHOP.md` — Prima di iniziare](WORKSHOP.md#0-prima-di-iniziare)**.

| Cosa | Dove |
|---|---|
| Node.js LTS (include `npm`) | [nodejs.org/en/download](https://nodejs.org/en/download) |
| Git | [git-scm.com/downloads](https://git-scm.com/downloads) |
| Editor | Qualsiasi editor va bene. |
| API key Gemini (account Google) | [aistudio.google.com/apikey](https://aistudio.google.com/apikey) |
| Arduino IDE 2 (solo con ESP32) | [arduino.cc/en/software](https://www.arduino.cc/en/software) |

Il kit fisico è un extra: tutto gira in simulatore.

```bash
cp .env.example .env
npm install
```

Apri `.env` e incolla la chiave copiata da AI Studio:

```env
DEVICE=simulator
GEMINI_API_KEY=la-tua-chiave
GEMINI_WORKSHOP_MODEL=gemini-3.1-flash-lite
```

Poi:

```bash
npx tsx src/cli.ts
```

| Percorso | Comando |
|---|---|
| CLI | `npm run dev` |
| Smoke test senza AI | `npm run test-device` |
| Elenco porte USB | `npm run ports` |
| Prima chiamata Gemini | `npx tsx src/gemini-test.ts` |

## Le tre barriere

1. **Structured Output** — Gemini deve restituire JSON che passa `RobotPlanSchema`.
2. **Safety policy** — `validatePlan` rifiuta piani infiniti, troppe azioni, angoli e attese fuori range.
3. **Firmware** — l'ESP32 accetta solo `PING`, `LED 0|1`, `SERVO <angolo>` e rifiuta di nuovo gli angoli fuori da 10°–170°.

## Mappa del codice

```text
src/
  cli.ts                 ingresso: "tu > " → piano → safety → execute
  gemini-test.ts         step 1: prima chiamata a Gemini
  actions.ts             vocabolario Zod (led / servo / wait)
  gemini-planner.ts      Gemini + JSON schema + retry
  safety.ts              policy deterministica
  executor.ts            traduce il piano in chiamate Device
  device.ts              interfaccia: setLed / setServo
  create-device.ts       DEVICE=simulator | serial
  devices/simulator.ts   log su console
  devices/serial.ts      protocollo USB verso l'ESP32
  ports.ts               elenca le porte seriali
  test-serial.ts         smoke test senza LLM
firmware/esp32-workshop/ firmware minimale LED + servo
```

## Per chi presenta

| File | Uso |
|---|---|
| [`docs/CHEATSHEET.md`](docs/CHEATSHEET.md) | filo della demo in sala |
| [`docs/WORKSHOP_PLAN.md`](docs/WORKSHOP_PLAN.md) | piano dei 120 minuti |
| [`docs/HARDWARE.md`](docs/HARDWARE.md) | kit ESP32 |
| [`exercises/PROMPTS.md`](exercises/PROMPTS.md) | prompt da copiare |
