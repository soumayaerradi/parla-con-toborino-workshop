import type { Device } from "../device.js";
import { sleep } from "../device.js";

export class SimulatorDevice implements Device {
  readonly name = "Toborino Simulator";

  private ledState = false;

  private servoAngle = 90;

  async setLed(
    state: boolean
  ): Promise<void> {
    this.ledState = state;

    console.log(
      `💡 LED -> ${state ? "ON" : "OFF"}`
    );
  }

  async setServo(
    targetAngle: number,
    durationMs = 500
  ): Promise<void> {

    console.log(
      `🦾 SERVO ${this.servoAngle}° -> ${targetAngle}° (${durationMs}ms)`
    );

    if (durationMs > 0) {
      await sleep(durationMs);
    }

    this.servoAngle = targetAngle;
  }

  async close(): Promise<void> {
    console.log(
      "\n🔌 Simulator closed"
    );
  }
}
