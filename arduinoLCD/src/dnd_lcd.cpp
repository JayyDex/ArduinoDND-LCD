/** Library import **/
#include <Arduino.h>
#include <LinkedList.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <StandardCplusplus.h>
#include <string>
#include <vector>
#include <iterator>
#include <algorithm>
#include <functional>
#include <cctype>
#include <locale>
#include <sstream>
#include <iostream>

/** Prototype function declarations **/
void recvWithStartEndMarkers();
void setMux(int x);
const char* c_str();
void routeDecider(int sequence);
void breakMessage(const char* rawMsg);
static inline std::string &trim(std::string &s);
void split(const std::string& s, char seperator);
bool is_number(const std::string& s);
void messageController();

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
LinkedList<int> multicastList = LinkedList<int>();

//Serial input
const byte numChars = 250;
char receivedChars[numChars];   // an array to store the received data
std::string backUp;
boolean newData = false;

//Msg parts of input
std::string receiverPart;
std::string msgPart;

void setup() {
  Serial.begin(9600);
  Serial.println("<Arduino is ready>");
}

void loop() {
  recvWithStartEndMarkers();
  if (newData == true) {
    int sequence = 0;
    if (receivedChars[0] == 'r') {
      if (backUp.empty() == 1) {
        //Means there is no Msg to Repeat
        Serial.println("ERROR: There is no repeatable msg");
        sequence = -1;
      } else {
        sequence = 1;
        breakMessage(backUp.c_str());
      }
    } else {
      breakMessage(receivedChars);
    }
    routeDecider(sequence);
    multicastList.clear();
    newData = false;
  }
}

//Mainly for debugging, but routes to either repeat or normal
void routeDecider(int sequence) {

  Serial.println("Inside List");
  for (int g = 0; g < multicastList.size(); g++) {
    Serial.print(multicastList.get(g));
  }
  Serial.println("");
  Serial.println(receiverPart.c_str());
  Serial.println(msgPart.c_str());

  switch(sequence) {
    case 0:
      //Normal Route
      Serial.println("Normal Route");
      backUp = receivedChars;
      messageController();
      break;
    case 1:
      //Repeat Previous Msg
      Serial.println("Repeat Route");
      messageController();
      break;
    default:
      Serial.println("Invalid Route");
      break;
  }
}

//Sends the message to the coressponding receivers
void messageController() {

}

//Breaks the input to a list of receivers, and the message
void breakMessage(const char* rawMsg) {
  std::string CppString = rawMsg;
  std::size_t pos = CppString.find("-");

  receiverPart = CppString.substr(0,pos);
  msgPart = CppString.substr(pos+1);
  trim(receiverPart);
  trim(msgPart);

  if(receiverPart.c_str()[0] == 'a') {
    for(int i = 0; i < numberOfLCD; i++) {
      multicastList.add(i);
    }
  } else {
    split(receiverPart, ',');
  }
}

//Controller to handle MUX ouput, 0-15 are valid inputs
void setMux(int x) {
  digitalWrite(CONTROL0, (x&15)>>3);
  digitalWrite(CONTROL1, (x&7)>>2);
  digitalWrite(CONTROL2, (x&3)>>1);
  digitalWrite(CONTROL3, (x&1));
}

/**
Other people code below, mainly helper functions, some modified
**/

//Handle serial input, using markers "<>" for start/end
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

//Trim string from start
static inline std::string &ltrim(std::string &s) {
    s.erase(s.begin(), std::find_if(s.begin(), s.end(),
            std::not1(std::ptr_fun<int, int>(std::isspace))));
    return s;
}

//Trim string from end
static inline std::string &rtrim(std::string &s) {
    s.erase(std::find_if(s.rbegin(), s.rend(),
            std::not1(std::ptr_fun<int, int>(std::isspace))).base(), s.end());
    return s;
}

//Trim string from both ends
static inline std::string &trim(std::string &s) {
    return ltrim(rtrim(s));
}


//Tokenise string by ',', and add to multi-cast list (Modified)
void split(const std::string& s, char seperator) {
    std::string::size_type prev_pos = 0, pos = 0;
    while((pos = s.find(seperator, pos)) != std::string::npos)
    {
        std::string substring( s.substr(prev_pos, pos-prev_pos));
        if (is_number(substring)) {
          int value = std::strtol(substring.c_str(), NULL, 10);
          multicastList.add(value);
        }
        prev_pos = ++pos;
    }
    std::string lastSubString( s.substr(prev_pos, pos-prev_pos));
    if (is_number(lastSubString)) {
      int lastValue = std::strtol(lastSubString.c_str(), NULL, 10);
      multicastList.add(lastValue);
    }
}

//Check if a C++ std::string is a valid number
bool is_number(const std::string& s)
{
    std::string::const_iterator it = s.begin();
    while (it != s.end() && std::isdigit(*it)) ++it;
    return !s.empty() && it == s.end();
}
