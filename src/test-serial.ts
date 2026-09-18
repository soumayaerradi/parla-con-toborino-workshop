import {
  createDevice,
} from "./create-device.js";


console.log(
  "🧪 Test seriale (PING)...\n"
);


try {

  const device =
    await createDevice();


  console.log(
    `\n🤖 Device: ${device.name}\n`
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
