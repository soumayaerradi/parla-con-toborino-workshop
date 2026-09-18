export interface Device {
  readonly name: string;

  setLed(state: boolean): Promise<void>;

  setServo(
    angle: number,
    durationMs?: number
  ): Promise<void>;

  close(): Promise<void>;
}

export const sleep = (
  ms: number
): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};
