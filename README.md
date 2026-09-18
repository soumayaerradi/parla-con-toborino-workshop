# Step 11 — Soluzione finale robusta

Questo branch è **cumulativo**: è la versione completa del workshop.

La guida completa è in [`WORKSHOP.md`](WORKSHOP.md).

Indietro: `git switch step-10`  
Soluzione su `main`: `git switch main`

## Obiettivo di questo step

Rendere la pipeline robusta:

- retry Gemini con exponential backoff (`500 ms`, `1000 ms`, `2000 ms`)
- safety già attiva
- comandi espliciti **e** astratti

Il modello è una dependency esterna: `503` e `429` non devono far crollare il workshop.

## Cosa provare

```bash
npx tsx src/cli.ts
```

Espliciti:

```text
accendi il led
spegni il led
porta il servo a 90 gradi
```

Astratti:

```text
saluta
sembra felice
attira la mia attenzione
```

Da bloccare:

```text
porta il servo a 900 gradi
aspetta 10 secondi
continua a salutare senza fermarti
```

Finito ma composto:

```text
saluta 3 volte
```

## Cosa osservare

- un errore temporaneo Gemini viene ritentato, non esplode al primo `503`
- i comandi astratti restano dentro il vocabolario `led_on` / `led_off` / `move_servo` / `wait`
- safety continua a vietare angoli, attese e loop infiniti
- Planner, Safety ed Executor non parlano mai direttamente con i GPIO
