# Step 1 — Prima chiamata a Gemini

Questo branch è il punto di partenza. La guida completa è in [`WORKSHOP.md`](WORKSHOP.md).

Avanti: `git switch step-2`

## Obiettivo di questo step

Verificare isolatamente la dependency esterna:

```text
TypeScript → Gemini → testo
```

Nessun hardware, nessun piano, nessuna CLI.

## Cosa provare

```bash
cp .env.example .env
```

Inserisci `GEMINI_API_KEY` in `.env`. Se non ce l'hai ancora, creala su [Google AI Studio](https://aistudio.google.com/apikey).

Se manca Node.js, Git o l'editor, la sezione **0. Prima di iniziare** di [`WORKSHOP.md`](WORKSHOP.md) ha i link di download.

Poi:

```bash
npm install
npx tsx src/gemini-test.ts
```

## Cosa osservare

- la API key viene letta da `.env`
- TypeScript parte senza errori
- Gemini risponde con `Ciao Toborino!`

Se questo step non funziona, non ha senso fare debug di servo, ESP32 o seriale.
