#include <Arduino.h>

const int LED_PIN = 2;

void setup() {
  Serial.begin(115200);
  delay(1000);

  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, LOW);

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

  if (command == "LED 1") {
    digitalWrite(LED_PIN, HIGH);
    Serial.println("OK LED");
    return;
  }

  if (command == "LED 0") {
    digitalWrite(LED_PIN, LOW);
    Serial.println("OK LED");
    return;
  }

  Serial.print("ERR UNKNOWN_COMMAND ");
  Serial.println(command);
}
