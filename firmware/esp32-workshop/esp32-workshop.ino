#include <Arduino.h>
#include <ESP32Servo.h>

const int LED_PIN = 2;
const int SERVO_PIN = 13;

Servo servo;

void setup() {
  Serial.begin(115200);
  delay(1000);

  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, LOW);

  servo.setPeriodHertz(50);
  servo.attach(SERVO_PIN, 500, 2400);
  servo.write(90);

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

  if (command.startsWith("SERVO ")) {
    int angle = command.substring(6).toInt();

    if (angle < 10 || angle > 170) {
      Serial.println("ERR SERVO_RANGE");
      return;
    }

    servo.write(angle);

    Serial.print("OK SERVO ");
    Serial.println(angle);

    return;
  }

  Serial.print("ERR UNKNOWN_COMMAND ");
  Serial.println(command);
}
