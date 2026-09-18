import type {
  Action,
  RobotPlan,
} from "./actions.js";

import type {
  Device,
} from "./device.js";

import {
  sleep,
} from "./device.js";

export class Executor {
  constructor(
    private readonly device: Device
  ) {}

  private async executeAction(
    action: Action
  ): Promise<void> {
    switch (action.type) {
      case "led_on": {
        await this.device.setLed(
          true
        );

        return;
      }

      case "led_off": {
        await this.device.setLed(
          false
        );

        return;
      }

      case "move_servo": {
        await this.device.setServo(
          action.angle,
          action.durationMs
        );

        return;
      }

      case "wait": {
        console.log(
          `⏳ WAIT -> ${action.durationMs}ms`
        );

        await sleep(
          action.durationMs
        );

        return;
      }
    }
  }

  async execute(
    plan: RobotPlan
  ): Promise<void> {
    for (
      const action
      of plan.steps
      ) {
      await this.executeAction(
        action
      );
    }
  }
}
