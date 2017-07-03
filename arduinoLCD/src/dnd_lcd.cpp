/** Library import **/
#include <Arduino.h>
#include <LinkedList.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <StandardCplusplus.h>

/** Definitions and global variables **/
#define CONTROL0 5
#define CONTROL1 4
#define CONTROL2 3
#define CONTROL3 2

int mux0array[16];
int mux1array[16];
int mux2array[16];

int numberOfLCD = 10;
LiquidCrystal_I2C lcd(0x38,20,4);
LinkedList<int> myLinkedList = LinkedList<int>();

void setup() {
  Serial.begin(9600);
}

void loop() {
  double math = ceil(2.3);
  Serial.println(math);

  Serial.println("Hello World");
  delay(5000);
}

void setMux(int x) {
  digitalWrite(CONTROL0, (x&15)>>3);
  digitalWrite(CONTROL1, (x&7)>>2);
  digitalWrite(CONTROL2, (x&3)>>1);
  digitalWrite(CONTROL3, (x&1));
}
