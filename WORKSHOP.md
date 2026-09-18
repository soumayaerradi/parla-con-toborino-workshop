# Parla con Toborino
## Dal linguaggio naturale al mondo fisico con un LLM

Tutorial del workshop.

L'obiettivo non è far generare codice Arduino a un LLM, ma costruire una piccola architettura affidabile in cui:

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

Questo repository è organizzato in branch progressivi. Ogni branch rappresenta uno step del workshop ed è cumulativo: `step-2` contiene anche ciò che è stato costruito in `step-1`, `step-3` contiene gli step precedenti, e così via.

---

# 0. Prima di iniziare

Non serve essere esperti. I primi step girano **solo sul computer**, senza robot. Arduino e l'ESP32 servono dalla parte finale (`step-8`).

## Se parti da zero

| Termine | In una frase |
|---|---|
| **LLM** | Un modello di linguaggio (qui [Gemini](https://ai.google.dev/gemini-api/docs)): gli scrivi in italiano e lui risponde. |
| **API key** | Una password personale che autorizza il nostro programma a chiamare Gemini. Non va condivisa né committata. |
| **Node.js** | Il programma che esegue JavaScript/TypeScript sul computer, fuori dal browser. |
| **npm** | Il gestore di librerie di Node. Arriva insieme a Node.js. |
| **Git** | Lo strumento per scaricare il progetto e passare da uno step all'altro (`git switch step-1`). |
| **branch** | Una versione del progetto. `step-3` contiene anche `step-1` e `step-2`. |
| **`.env`** | Un file locale con i segreti (la API key). Resta sul tuo computer. |
| **Arduino IDE** | Il programma per caricare il firmware sulla scheda ESP32. |
| **ESP32** | La schedina USB del kit. Per i primi step puoi ignorarla: c'è un simulatore. |

## Cosa scaricare

Installa questi programmi **prima** del workshop, se puoi.

1. **Node.js 20+** (consigliato LTS 22 o 24)  
   Download: [https://nodejs.org/en/download](https://nodejs.org/en/download)  
   Scegli la versione **LTS**. `npm` è incluso: non serve un installer separato.

2. **Git**  
   Download: [https://git-scm.com/downloads](https://git-scm.com/downloads)  
   Su macOS, se `git --version` chiede gli strumenti di sviluppo, accetta e installa.

3. **Un editor**  
   [VS Code](https://code.visualstudio.com/) oppure [Cursor](https://cursor.com/). Qualsiasi editor va bene.

4. **Chiave Gemini** (obbligatoria, è gratis con un account Google)  
   Creala qui: [https://aistudio.google.com/apikey](https://aistudio.google.com/apikey)  
   Guida ufficiale: [Using Gemini API keys](https://ai.google.dev/gemini-api/docs/api-key)

5. **Arduino IDE** (solo se hai l'ESP32; serve da `step-8`)  
   Download: [https://www.arduino.cc/en/software](https://www.arduino.cc/en/software)  
   Prendi **Arduino IDE 2**, non la versione legacy 1.8.  
   Poi installa il supporto ESP32: [Installing Arduino ESP32](https://docs.espressif.com/projects/arduino-esp32/en/latest/installing.html)

Controlla che tutto sia nel PATH:

```bash
node -v
npm -v
git --version
```

`node -v` deve stampare `v20` o superiore (meglio `v22` / `v24`).

### Come creare la API key Gemini

1. Apri [Google AI Studio — API keys](https://aistudio.google.com/apikey).
2. Accedi con un account Google.
3. Se è la prima volta, accetta i termini: Studio può creare da solo un progetto e una chiave.
4. Altrimenti clicca **Create API key**.
5. Copia la chiave. La incollerai in `.env` come `GEMINI_API_KEY=...`.
6. Non condividerla in chat, screenshot o commit.

Se la pagina chiede un progetto Google Cloud, puoi usarne uno esistente o lasciar creare quello predefinito.

## Hardware

Opzionale. Per la parte finale del workshop useremo:

- ESP32 WROOM
- LED onboard dell'ESP32 oppure LED esterno
- servo SG90
- cavo USB **dati** (non un cavo solo-ricarica)

Firmware e cablaggio: più avanti. Sul branch `main` trovi anche `docs/HARDWARE.md`.

Nel setup usato durante il workshop:

```text
LED onboard → GPIO 2
Servo signal → GPIO 13
Servo VCC → 5V
Servo GND → GND
```

> Se usi una board diversa, verifica il pinout prima di copiare i GPIO.

Per caricare il firmware, in Arduino IDE:

1. Installa l'[Arduino IDE 2](https://www.arduino.cc/en/software).
2. Aggiungi le board ESP32 (Boards Manager → cerca `esp32` di Espressif), vedi la [guida Espressif](https://docs.espressif.com/projects/arduino-esp32/en/latest/installing.html).
3. Libreria **ESP32Servo**: *Sketch → Include Library → Manage Libraries…* → cerca `ESP32Servo`.
4. Board: **ESP32 Dev Module**. Upload Speed: **115200**.

---

# 1. Clonare il repository

```bash
git clone <URL_REPOSITORY>
cd parla-con-toborino
npm install
```

Crea poi il file `.env` partendo da `.env.example`:

```bash
cp .env.example .env
```

e inserisci la tua chiave (da [aistudio.google.com/apikey](https://aistudio.google.com/apikey)):

```env
GEMINI_API_KEY=LA_TUA_API_KEY
GEMINI_WORKSHOP_MODEL=gemini-3.1-flash-lite

DEVICE=simulator
SERIAL_PORT=/dev/cu.usbserial-210
SERIAL_BAUD=115200
```

Non committare mai `.env`.

Il repository deve contenere:

```gitignore
node_modules
.env
```

---

# Come usare i branch

Per passare a uno step:

```bash
git switch step-1
```

Poi:

```bash
npm install
```

se quello step introduce nuove dipendenze.

Per vedere cosa è cambiato rispetto allo step precedente:

```bash
git diff step-1..step-2
```

Questo è molto utile se sei rimasto indietro durante il workshop.

Ogni branch contiene anche un `README.md` breve con:

- obiettivo di questo step
- cosa provare
- cosa osservare

`WORKSHOP.md` resta la guida completa.

---

# Mappa degli step

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
| `step-11` | Soluzione finale robusta: comandi astratti + retry + safety |

`main` contiene la soluzione finale.

---

# STEP 1 — Prima chiamata a Gemini

```bash
git switch step-1
```

## Obiettivo

Verificare la parte più semplice:

```text
TypeScript
   ↓
Gemini
   ↓
testo
```

In questo step non controlliamo ancora alcun hardware.

Installazione:

```bash
npm install
```

Avvio:

```bash
npx tsx src/gemini-test.ts
```

Output atteso:

```text
Ciao Toborino!
```

## Concetto

Prima di costruire un agente bisogna verificare la dependency esterna isolatamente.

Se questo step non funziona, non ha senso fare debug di servo, ESP32 o seriale.

### Checkpoint

- [ ] La API key viene letta
- [ ] Gemini risponde
- [ ] TypeScript parte correttamente

---

# STEP 2 — Definiamo cosa il robot può fare

```bash
git switch step-2
```

## Obiettivo

Definire un piccolo vocabolario di capability.

Il robot **non** sa fare qualsiasi cosa. Sa soltanto:

```text
led_on
led_off
move_servo
wait
```

File principale:

```text
src/actions.ts
```

Schema concettuale:

```ts
type Action =
  | { type: "led_on" }
  | { type: "led_off" }
  | {
      type: "move_servo";
      angle: number;
      durationMs: number;
    }
  | {
      type: "wait";
      durationMs: number;
    };
```

## Perché?

Non vogliamo che il modello inventi capability inesistenti.

L'LLM deve lavorare dentro un insieme di azioni che il nostro sistema conosce.

> Prima di chiedere al modello cosa fare, definiamo cosa **può** fare.

### Checkpoint

- [ ] Esiste uno schema delle azioni
- [ ] Il vocabolario è limitato
- [ ] L'hardware non è ancora coinvolto

---

# STEP 3 — Structured Output

```bash
git switch step-3
```

## Obiettivo

Passare da una risposta libera dell'LLM a un contratto strutturato.

Input:

```text
accendi il led
```

Output desiderato:

```json
{
  "summary": "Accendo il LED.",
  "executionMode": "finite",
  "steps": [
    {
      "type": "led_on"
    }
  ]
}
```

File principali:

```text
src/actions.ts
src/gemini-planner.ts
```

## Concetto

Structured output significa:

- sappiamo che forma deve avere la risposta;
- possiamo validarla;
- possiamo convertirla in oggetti TypeScript;
- non dobbiamo parsare frasi inventate dal modello.

Ma attenzione:

> **Structured output non significa safety.**

Un JSON perfettamente valido può contenere:

```json
{
  "type": "move_servo",
  "angle": 900,
  "durationMs": 500
}
```

È strutturalmente corretto, ma fisicamente non lo è.

### Checkpoint

- [ ] Il modello restituisce JSON
- [ ] Il JSON passa attraverso Zod
- [ ] `accendi il led` diventa `led_on`

---

# STEP 4 — Simulator + Executor

```bash
git switch step-4
```

## Obiettivo

Eseguire il piano senza avere hardware collegato.

Architettura:

```text
Gemini
  ↓
RobotPlan
  ↓
Executor
  ↓
Device
  ↓
Simulator
```

File principali:

```text
src/device.ts
src/executor.ts
src/devices/simulator.ts
```

## Perché un simulatore?

Perché vogliamo poter sviluppare anche se:

- l'ESP32 non è collegata;
- un partecipante ha problemi hardware;
- la porta seriale è occupata;
- siamo ancora nella prima parte del workshop.

La business logic non deve dipendere direttamente dall'hardware.

### Checkpoint

- [ ] `Executor` conosce `Device`
- [ ] `SimulatorDevice` implementa `Device`
- [ ] Il piano può essere eseguito senza ESP32

---

# STEP 5 — CLI interattiva

```bash
git switch step-5
```

## Obiettivo

Arrivare alla prima pipeline completa, ancora simulata.

Avvio:

```bash
npx tsx src/cli.ts
```

Prova:

```text
accendi il led
```

poi:

```text
porta il servo a 90 gradi
```

e infine:

```text
saluta
```

Per `saluta` il modello deve interpretare un'intenzione astratta e comporre più capability.

## Punto importante

`saluta` **non** è un comando hardware.

È un'intenzione.

L'LLM ha valore proprio qui: traduce una richiesta ad alto livello in una sequenza di azioni consentite.

### Checkpoint

- [ ] Il prompt viene scritto nella CLI
- [ ] Gemini crea il piano
- [ ] L'Executor lo esegue sul simulator
- [ ] `saluta` produce più di una capability

---

# STEP 6 — Safety Layer

```bash
git switch step-6
```

## Obiettivo

Separare il planning dalla sicurezza.

Nuovo flusso:

```text
User
 ↓
LLM
 ↓
Plan
 ↓
Safety
 ↓
Executor
```

File:

```text
src/safety.ts
```

Policy del workshop:

```text
servo: 10° - 170°
wait: massimo 3000 ms
servo duration: massimo 3000 ms
numero massimo di azioni: 10
```

## Test 1

```text
porta il servo a 900 gradi
```

Il piano deve essere bloccato dal Safety Layer.

## Test 2

```text
aspetta 10 secondi
```

Il modello capisce correttamente `10000 ms`, ma la policy permette massimo `3000 ms`.

## Concetto

> **The LLM proposes. The system decides.**

La sicurezza non è una frase nel prompt.

La sicurezza è codice deterministico.

### Checkpoint

- [ ] 900° viene bloccato
- [ ] 10 secondi vengono bloccati
- [ ] Nessuna azione viene eseguita dopo un errore di safety

---

# STEP 7 — Finite vs Continuous

```bash
git switch step-7
```

## Il problema

Prova:

```text
continua a salutare senza fermarti
```

Una prima implementazione potrebbe produrre una sequenza finita e poi fermarsi.

Questo JSON è valido, ma non rappresenta veramente la richiesta.

Introduciamo quindi:

```ts
executionMode:
  | "finite"
  | "continuous";
```

Ora il modello può rappresentare correttamente l'intenzione continua.

Il Safety Layer però rifiuta l'esecuzione continua:

```text
🛑 BLOCCATO DAL SAFETY LAYER
Continuous execution is not allowed.
```

Prova invece:

```text
saluta 3 volte
```

Questo è un comando finito e può essere eseguito.

## Concetto chiave

```text
VALID JSON
   ≠
CORRECT INTENT
   ≠
SAFE ACTION
```

### Checkpoint

- [ ] `senza fermarti` → `continuous`
- [ ] `continuous` viene bloccato
- [ ] un numero finito di ripetizioni può passare

---

# STEP 8 — TypeScript → ESP32 via seriale

```bash
git switch step-8
```

## Obiettivo

Sostituire `SimulatorDevice` con `SerialDevice` senza modificare Planner, Safety o Executor.

Protocollo:

```text
PING
→ PONG

LED 1
→ OK LED

LED 0
→ OK LED

SERVO 90
→ OK SERVO 90
```

File:

```text
src/devices/serial.ts
src/create-device.ts
src/test-serial.ts
```

`.env`:

```env
DEVICE=serial
SERIAL_PORT=/dev/cu.usbserial-210
SERIAL_BAUD=115200
```

> La porta seriale sul tuo computer potrebbe avere un nome diverso.

Test:

```bash
npx tsx src/test-serial.ts
```

Output atteso:

```text
🔌 Connessione a /dev/cu.usbserial-210 @ 115200 baud...
✅ Porta seriale aperta
➡️ ESP32: PING
⬅️ ESP32: PONG
🤖 ESP32 pronta
```

## Attenzione

Chiudi il Serial Monitor di Arduino prima di avviare Node.

Se ricevi:

```text
Resource busy
```

controlla:

```bash
lsof /dev/cu.usbserial-210
```

### Checkpoint

- [ ] Node apre la seriale
- [ ] invia `PING`
- [ ] ESP32 risponde `PONG`

---

# STEP 9 — LED reale

```bash
git switch step-9
```

## Obiettivo

La prima azione dal linguaggio naturale al mondo fisico.

Firmware:

```text
firmware/esp32-workshop/esp32-workshop.ino
```

Per la board usata nel workshop:

```text
LED_PIN = 2
```

Prima verifica manualmente dal Serial Monitor:

```text
LED 1
LED 0
```

Quando funziona, chiudi il Serial Monitor.

Avvia:

```bash
npx tsx src/cli.ts
```

e scrivi:

```text
accendi il led
```

Pipeline:

```text
"accendi il led"
        ↓
Gemini
        ↓
{ type: "led_on" }
        ↓
Safety
        ↓
Executor
        ↓
SerialDevice
        ↓
LED 1
        ↓
ESP32
        ↓
LED ON
```

Poi prova:

```text
spegni il led
```

### Checkpoint

- [ ] LED controllabile dal Serial Monitor
- [ ] LED controllabile dalla CLI
- [ ] la frase naturale arriva davvero all'hardware

---

# STEP 10 — Servo reale

```bash
git switch step-10
```

## Collegamenti SG90

Nel setup del workshop:

```text
rosso   → 5V
marrone → GND
arancio → GPIO 13
```

> I colori possono cambiare a seconda del servo: controlla sempre il datasheet.

Firmware:

```text
SERVO_PIN = 13
```

Range consentito:

```text
10° - 170°
```

Test manuale:

```text
SERVO 45
SERVO 90
SERVO 135
```

Poi chiudi il Serial Monitor e avvia:

```bash
npx tsx src/cli.ts
```

Prova:

```text
porta il servo a 90 gradi
```

e poi:

```text
saluta
```

### Checkpoint

- [ ] Servo risponde ai comandi seriali
- [ ] `porta il servo a 90 gradi` funziona
- [ ] `saluta` genera una sequenza fisica

---

# STEP 11 — Soluzione finale robusta

```bash
git switch step-11
```

Questo step contiene la versione completa del workshop.

## Retry Gemini

Un modello remoto può rispondere con errori temporanei, ad esempio:

```text
503 UNAVAILABLE
429 RESOURCE_EXHAUSTED
```

Il planner utilizza retry con exponential backoff:

```text
500 ms
1000 ms
2000 ms
```

Il modello è una dependency esterna e va trattato come tale.

## Comandi da provare

### Espliciti

```text
accendi il led
spegni il led
porta il servo a 90 gradi
```

### Astratti

```text
saluta
sembra felice
attira la mia attenzione
```

### Da bloccare

```text
porta il servo a 900 gradi
aspetta 10 secondi
continua a salutare senza fermarti
```

### Finito ma composto

```text
saluta 3 volte
```

---

# Architettura finale

```text
                 USER
                  │
                  ▼
          Natural Language
                  │
                  ▼
            Gemini Planner
                  │
                  ▼
            RobotPlan / Zod
                  │
                  ▼
             Safety Layer
                  │
                  ▼
               Executor
                  │
                  ▼
                Device
              /        \
             /          \
      Simulator       Serial
                         │
                         ▼
                       ESP32
                      /     \
                    LED     Servo
```

---

# File principali

```text
src/
├── actions.ts
├── gemini-planner.ts
├── safety.ts
├── executor.ts
├── device.ts
├── create-device.ts
├── cli.ts
└── devices/
    ├── simulator.ts
    └── serial.ts

firmware/
└── esp32-workshop/
    └── esp32-workshop.ino
```

---

# Troubleshooting

## `Resource busy, cannot open ...`

La porta seriale è occupata.

Chiudi Arduino Serial Monitor.

Su macOS:

```bash
lsof /dev/cu.usbserial-210
```

## ESP32 non effettua l'upload

Se l'upload fallisce ad alta velocità, imposta in Arduino IDE:

```text
Tools
→ Upload Speed
→ 115200
```

## `esbuild` darwin-x64 / darwin-arm64

Prova:

```bash
rm -rf node_modules
npm install
```

## Gemini 503

Errore temporaneo lato provider. Il progetto finale implementa retry automatico.

## Gemini 429

Hai raggiunto un limite di quota/rate limit.

---

# Come capire dove si è rotto qualcosa

Segui sempre la pipeline:

```text
1. Gemini risponde?
2. Il piano è valido?
3. Safety lo approva?
4. Executor viene eseguito?
5. Serial port è aperta?
6. ESP32 risponde?
7. LED/servo reagiscono?
```

Non fare debug di tutto contemporaneamente.

---

# Se sei rimasto indietro

Non cercare di copiare velocemente tutto dalla schermata.

Vai direttamente allo step successivo già pronto:

```bash
git switch step-X
```

Esempio:

```bash
git switch step-6
npm install
npx tsx src/cli.ts
```

Poi continua da lì con il gruppo.

---

# Se sei più veloce

Puoi provare a estendere il progetto.

Idee:

1. aggiungi una nuova capability;
2. aggiungi una nuova regola di safety;
3. modifica il comportamento di `saluta`;
4. introduci un nuovo metadata nel piano;
5. aggiungi una modalità `preview`;
6. crea un nuovo `Device` senza modificare Planner ed Executor.

---

# Cosa portarsi a casa

Il punto del workshop non è il servo.

Il punto è il pattern:

```text
INTENT
  ↓
LLM PLANNING
  ↓
STRUCTURED CONTRACT
  ↓
DETERMINISTIC VALIDATION
  ↓
EXECUTION
  ↓
PHYSICAL EFFECT
```

Lo stesso schema può essere applicato a robotica, IoT, smart home, automazione industriale e sistemi agentici con azioni reali.

Tre idee da ricordare:

> **The LLM proposes. The system decides.**

> **Structured output is a contract, not a safety mechanism.**

> **The model never talks directly to the hardware.**

---

# Fine

Se sei arrivato qui, hai costruito una pipeline completa:

```text
linguaggio naturale
→ LLM
→ structured output
→ safety
→ executor
→ seriale
→ ESP32
→ LED + servo
```

E soprattutto hai separato chiaramente l'intelligenza probabilistica dal controllo deterministico.
