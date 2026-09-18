import {
  SerialPort,
} from "serialport";

import {
  ReadlineParser,
} from "@serialport/parser-readline";

import type {
  Device,
} from "../device.js";

import {
  sleep,
} from "../device.js";


export class SerialDevice
  implements Device {

  readonly name =
    "Toborino ESP32";

  private readonly port:
    SerialPort;

  private readonly parser:
    ReadlineParser;


  private constructor(
    port: SerialPort,
    parser: ReadlineParser
  ) {
    this.port = port;
    this.parser = parser;
  }


  static async connect(
    path: string,
    baudRate = 115200
  ): Promise<SerialDevice> {

    console.log(
      `🔌 Connessione a ${path} @ ${baudRate} baud...`
    );


    const port =
      new SerialPort({
        path,
        baudRate,
        autoOpen: false,
      });


    const parser =
      port.pipe(
        new ReadlineParser({
          delimiter: "\n",
        })
      );


    await new Promise<void>(
      (
        resolve,
        reject
      ) => {

        port.open(
          (error) => {

            if (error) {
              reject(
                error
              );

              return;
            }

            resolve();
          }
        );
      }
    );


    console.log(
      "✅ Porta seriale aperta"
    );


    /*
     * Molte ESP32 effettuano un reset
     * quando viene aperta la porta seriale.
     *
     * Aspettiamo che la board completi il boot.
     */
    await sleep(
      1500
    );


    const device =
      new SerialDevice(
        port,
        parser
      );


    /*
     * Verifichiamo immediatamente
     * che la board risponda.
     */
    await device.ping();


    console.log(
      "🤖 ESP32 pronta"
    );


    return device;
  }


  private async request(
    command: string,
    expectedResponse: string,
    timeoutMs = 2000
  ): Promise<string> {

    return new Promise(
      (
        resolve,
        reject
      ) => {

        let finished =
          false;


        const cleanup =
          () => {

            clearTimeout(
              timeout
            );

            this.parser.off(
              "data",
              onData
            );
          };


        const onData =
          (
            rawData: string
          ) => {

            const message =
              rawData.trim();


            if (!message) {
              return;
            }


            console.log(
              `⬅️ ESP32: ${message}`
            );


            /*
             * Potrebbero arrivare messaggi
             * come TOBORINO_READY durante
             * il boot.
             *
             * Aspettiamo solo quello
             * che ci interessa.
             */
            if (
              message.startsWith(
                expectedResponse
              )
            ) {

              if (
                finished
              ) {
                return;
              }


              finished =
                true;

              cleanup();

              resolve(
                message
              );
            }
          };


        const timeout =
          setTimeout(
            () => {

              if (
                finished
              ) {
                return;
              }


              finished =
                true;

              cleanup();


              reject(
                new Error(
                  `Timeout waiting for "${expectedResponse}" after command "${command}"`
                )
              );
            },
            timeoutMs
          );


        this.parser.on(
          "data",
          onData
        );


        console.log(
          `➡️ ESP32: ${command}`
        );


        this.port.write(
          `${command}\n`,
          (error) => {

            if (
              error
            ) {

              if (
                finished
              ) {
                return;
              }


              finished =
                true;

              cleanup();

              reject(
                error
              );
            }
          }
        );
      }
    );
  }


  private async ping():
    Promise<void> {

    await this.request(
      "PING",
      "PONG"
    );
  }


  async setLed(
    state: boolean
  ): Promise<void> {

    await this.request(
      state
        ? "LED 1"
        : "LED 0",

      "OK LED"
    );
  }


  async setServo(
    angle: number,
    durationMs = 500
  ): Promise<void> {

    await this.request(
      `SERVO ${angle}`,
      "OK SERVO"
    );


    /*
     * L'ESP32 riceve solo la posizione.
     *
     * durationMs rappresenta quanto
     * lasciamo al movimento prima
     * dell'azione successiva.
     */
    if (
      durationMs > 0
    ) {
      await sleep(
        durationMs
      );
    }
  }


  async close():
    Promise<void> {

    if (
      !this.port.isOpen
    ) {
      return;
    }


    await new Promise<void>(
      (
        resolve,
        reject
      ) => {

        this.port.close(
          (error) => {

            if (
              error
            ) {

              reject(
                error
              );

              return;
            }

            resolve();
          }
        );
      }
    );


    console.log(
      "🔌 Porta seriale chiusa"
    );
  }
}
