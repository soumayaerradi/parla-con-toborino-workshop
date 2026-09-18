import { z } from "zod";

export const ActionSchema =
  z.discriminatedUnion(
    "type",
    [
      z.object({
        type: z.literal("move_servo"),
        angle: z.number().int(),
        durationMs: z.number().int(),
      }),

      z.object({
        type: z.literal("led_on"),
      }),

      z.object({
        type: z.literal("led_off"),
      }),

      z.object({
        type: z.literal("wait"),
        durationMs: z.number().int(),
      }),
    ]
  );


export const RobotPlanSchema =
  z.object({

    summary:
      z.string(),

    executionMode:
      z.literal(
        "finite"
      ),

    steps:
      z.array(
        ActionSchema
      ),
  });


export type Action =
  z.infer<
    typeof ActionSchema
  >;


export type RobotPlan =
  z.infer<
    typeof RobotPlanSchema
  >;
