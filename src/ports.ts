import {
  SerialPort,
} from "serialport";


const ports =
  await SerialPort.list();


if (
  ports.length === 0
) {

  console.log(
    "Nessuna porta seriale trovata."
  );

  console.log(
    "Controlla il cavo USB (deve essere un cavo dati, non solo ricarica)."
  );

  process.exit(0);
}


console.log(
  "Porte seriali disponibili:\n"
);


for (
  const port
  of ports
) {

  console.log(
    `  ${port.path}`
  );

  if (
    port.manufacturer
  ) {

    console.log(
      `    manufacturer: ${port.manufacturer}`
    );
  }

  if (
    port.serialNumber
  ) {

    console.log(
      `    serial: ${port.serialNumber}`
    );
  }

  console.log("");
}


console.log(
  "Copia il path in SERIAL_PORT nel file .env"
);
