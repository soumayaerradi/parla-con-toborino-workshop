import {
  createDevice,
} from "./create-device.js";

import {
  sleep,
} from "./device.js";


console.log(
  "🧪 Test dispositivo (senza LLM)...\n"
);


try {

  const device =
    await createDevice();


  console.log(
    `\n🤖 Device: ${device.name}\n`
  );


  console.log(
    "LED ON"
  );

  await device.setLed(
    true
  );

  await sleep(
    400
  );


  console.log(
    "LED OFF"
  );

  await device.setLed(
    false
  );

  await sleep(
    200
  );


  await device.setServo(
    45,
    400
  );

  await device.setServo(
    135,
    400
  );

  await device.setServo(
    90,
    400
  );


  await device.close();


  console.log(
    "\n🏁 Test completato"
  );

}

catch (
  error
) {

  console.error(
    "\n❌ Test fallito"
  );

  if (
    error instanceof Error
  ) {

    console.error(
      error.message
    );
  }

  process.exit(1);
}
