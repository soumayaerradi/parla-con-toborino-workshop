export type Action =
  | {
      type: "led_on";
    }
  | {
      type: "led_off";
    }
  | {
      type: "move_servo";
      angle: number;
      durationMs: number;
    }
  | {
      type: "wait";
      durationMs: number;
    };


export type RobotPlan = {
  summary: string;
  steps: Action[];
};
