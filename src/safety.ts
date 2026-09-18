import type {
  Action,
  RobotPlan,
} from "./actions.js";


export class SafetyError
  extends Error {

  constructor(
    message: string
  ) {

    super(
      message
    );

    this.name =
      "SafetyError";
  }
}


const MIN_SERVO_ANGLE =
  10;

const MAX_SERVO_ANGLE =
  170;

const MAX_ACTIONS =
  10;

const MAX_WAIT_MS =
  3000;

const MAX_SERVO_DURATION_MS =
  3000;


function validateAction(
  action: Action
): void {

  switch (
    action.type
    ) {

    case "move_servo": {

      if (
        action.angle <
        MIN_SERVO_ANGLE ||
        action.angle >
        MAX_SERVO_ANGLE
      ) {

        throw new SafetyError(
          `Servo angle ${action.angle}° is outside the safe range ${MIN_SERVO_ANGLE}°-${MAX_SERVO_ANGLE}°.`
        );
      }


      if (
        action.durationMs <
        0 ||
        action.durationMs >
        MAX_SERVO_DURATION_MS
      ) {

        throw new SafetyError(
          `Servo duration ${action.durationMs}ms is not allowed. Maximum: ${MAX_SERVO_DURATION_MS}ms.`
        );
      }


      return;
    }


    case "wait": {

      if (
        action.durationMs <
        0 ||
        action.durationMs >
        MAX_WAIT_MS
      ) {

        throw new SafetyError(
          `Wait duration ${action.durationMs}ms is not allowed. Maximum: ${MAX_WAIT_MS}ms.`
        );
      }


      return;
    }


    case "led_on":
    case "led_off":
      return;
  }
}


export function validatePlan(
  plan: RobotPlan
): RobotPlan {

  if (
    plan.steps.length === 0
  ) {

    throw new SafetyError(
      "The plan contains no actions."
    );
  }


  if (
    plan.steps.length >
    MAX_ACTIONS
  ) {

    throw new SafetyError(
      `The plan contains ${plan.steps.length} actions. Maximum allowed: ${MAX_ACTIONS}.`
    );
  }


  for (
    const action
    of plan.steps
    ) {

    validateAction(
      action
    );
  }


  return plan;
}
