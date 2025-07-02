/*
  ESP8266 Blink Test
  - Blinks the on-board LED (GPIO2) every second.
  - Prints LED state to Serial at 115200 baud.
*/

#define LED_PIN 2           // On-board LED is on GPIO2 (active‑low)
 
void setup() {
  Serial.begin(115200);    // Initialize serial for status messages
  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, HIGH); // Ensure LED is off at startup
}

void loop() {
  // Turn LED on (LOW because it's active‑low)
  digitalWrite(LED_PIN, LOW);
  Serial.println("LED ON");
  delay(1000);
  
  // Turn LED off (HIGH)
  digitalWrite(LED_PIN, HIGH);
  Serial.println("LED OFF");
  delay(1000);
}
