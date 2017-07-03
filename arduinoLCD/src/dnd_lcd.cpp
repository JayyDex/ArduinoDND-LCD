/** Library import **/
#include <Arduino.h>
#include <LinkedList.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <StandardCplusplus.h>

/** Prototype function declarations **/
void recvWithStartEndMarkers();
void setMux(int x);

/** Definitions and global variables **/
#define CONTROL0 5
#define CONTROL1 4
#define CONTROL2 3
#define CONTROL3 2

//Array to manage MUX chip
int mux0array[16];
int mux1array[16];
int mux2array[16];

//LCD code management
int numberOfLCD = 10;
LiquidCrystal_I2C lcd(0x38,20,4);

//List storing who to send MSG to
LinkedList<int> myLinkedList = LinkedList<int>();

//Serial input
const byte numChars = 250;
char receivedChars[numChars];   // an array to store the received data
boolean newData = false;

void setup() {
  Serial.begin(9600);
  Serial.println("<Arduino is ready>");
}

void loop() {
  recvWithStartEndMarkers();
  if (newData == true) {
    Serial.println(receivedChars);
    newData = false;
  }
}

void recvWithStartEndMarkers() {
    static boolean recvInProgress = false;
    static byte ndx = 0;
    char startMarker = '<';
    char endMarker = '>';
    char rc;

    while (Serial.available() > 0 && newData == false) {
        rc = Serial.read();

        if (recvInProgress == true) {
            if (rc != endMarker) {
                receivedChars[ndx] = rc;
                ndx++;
                if (ndx >= numChars) {
                    ndx = numChars - 1;
                }
            }
            else {
                receivedChars[ndx] = '\0'; // terminate the string
                recvInProgress = false;
                ndx = 0;
                newData = true;
            }
        }

        else if (rc == startMarker) {
            recvInProgress = true;
        }
    }
}

void setMux(int x) {
  digitalWrite(CONTROL0, (x&15)>>3);
  digitalWrite(CONTROL1, (x&7)>>2);
  digitalWrite(CONTROL2, (x&3)>>1);
  digitalWrite(CONTROL3, (x&1));
}
