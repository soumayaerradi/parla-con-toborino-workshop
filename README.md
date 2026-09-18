# Step 6 — Safety Layer

Questo branch è **cumulativo**: contiene anche gli step precedenti.

La guida completa è in [`WORKSHOP.md`](WORKSHOP.md).

Indietro: `git switch step-5`  
Avanti: `git switch step-7`

## Obiettivo di questo step

Separare il planning dalla sicurezza.

```text
User → LLM → Plan → Safety → Executor
```

File: `src/safety.ts`

Policy del workshop:

```text
servo: 10° - 170°
wait: massimo 3000 ms
servo duration: massimo 3000 ms
numero massimo di azioni: 10
```

## Cosa provare

```bash
npx tsx src/cli.ts
```

Poi:

```text
porta il servo a 900 gradi
aspetta 10 secondi
accendi il led
```

## Cosa osservare

- 900° viene **bloccato** dal Safety Layer
- 10 secondi vengono **bloccati** (il modello può scrivere `10000 ms`, la policy permette massimo `3000 ms`)
- dopo un errore di safety **nessuna azione** viene eseguita
- `accendi il led` passa ancora

> The LLM proposes. The system decides.
>
> La sicurezza non è una frase nel prompt. È codice deterministico.
