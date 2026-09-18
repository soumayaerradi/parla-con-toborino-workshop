import "dotenv/config";

import type {
  Device,
} from "./device.js";

import {
  SimulatorDevice,
} from "./devices/simulator.js";

import {
  SerialDevice,
} from "./devices/serial.js";


export async function createDevice():
  Promise<Device> {

  const mode =
    process.env.DEVICE ??
    "simulator";


  if (
    mode === "simulator"
  ) {

    console.log(
      "🧪 Device: Simulator"
    );

    return new SimulatorDevice();
  }


  if (
    mode === "serial"
  ) {

    const path =
      process.env
        .SERIAL_PORT;


    if (!path) {

      throw new Error(
        "SERIAL_PORT non configurata nel file .env"
      );
    }


    const baudRate =
      Number(
        process.env
          .SERIAL_BAUD ??
        115200
      );


    return SerialDevice.connect(
      path,
      baudRate
    );
  }


  throw new Error(
    `DEVICE non supportato: ${mode}`
  );
}
