#include <Arduino.h>

void setup() {
  Serial.begin(115200);
  delay(1000);
  Serial.println("TOBORINO_READY");
}

void loop() {
  if (!Serial.available()) return;

  String command = Serial.readStringUntil('\n');
  command.trim();

  if (command.length() == 0) return;

  if (command == "PING") {
    Serial.println("PONG");
    return;
  }

  Serial.print("ERR UNKNOWN_COMMAND ");
  Serial.println(command);
}
