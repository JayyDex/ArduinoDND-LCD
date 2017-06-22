#include <StringSplitter.h>
#include <LiquidCrystal_I2C.h>
#include <QueueList.h>
#include <Wire.h> 

#define CONTROL0 5    
#define CONTROL1 4
#define CONTROL2 3
#define CONTROL3 2

LiquidCrystal_I2C lcd(0x38,20,4);

QueueList <String> senderQueue;
QueueList <String> backupQueue;
String lastMessage;
StringSplitter *splitter;

int mux0array[16];
int mux1array[16];
int mux2array[16];

int numberOfLCD = 10;

void setup()
{
  Serial.begin(9600);
  /** Setup MUX Control Pins **/
  pinMode(CONTROL0, OUTPUT);
  pinMode(CONTROL1, OUTPUT);
  pinMode(CONTROL2, OUTPUT);
  pinMode(CONTROL3, OUTPUT);

  /** Setup Arduino **/
  Serial.print("Initialising.... ");
  for (int i=0; i<numberOfLCD; i++) {
    digitalWrite(CONTROL0, (i&15)>>3); 
    digitalWrite(CONTROL1, (i&7)>>2);  
    digitalWrite(CONTROL2, (i&3)>>1);  
    digitalWrite(CONTROL3, (i&1));
    lcd.init();
    lcd.begin(20, 4);
  }

  Serial.print("Initialisation Complete\n\n");
  infoPrint();
} 

void infoPrint() {
  Serial.println("########## HOW TO USE ##########");
  Serial.println("Msg Format: {senderlist}-{message}, example: 1,2,3,4,5-HelloWorld");
  Serial.println("r-HelloWorld, 'r' Replay last msg sent");
  Serial.println("a-HelloWorld, 'a' Send message to all LCD\n");

  Serial.println("Awaiting input......");
}

void loop()
{    
  if (Serial.available() > 0) {
    String message = Serial.readString();
    String copy = message.substring(0);
    
    char specialCase = copy.charAt(0);
    if (specialCase == 'r') {
      Serial.println("Repeat msg");
      message = lastMessage;
    }
    String cutMessage = getOwnerList(message);
    cutMessage.trim();

    Serial.println(cutMessage);

    if (cutMessage == "") {
      Serial.println("Invalid input, please use format {senderList}-{message}\n");
      Serial.println("Awaiting input......");
    } else {
      Serial.println(message);
      messageController(cutMessage);
      lastMessage = message;
      Serial.print('\n');
      Serial.println("Awaiting input......");
    }
    emptyQueues();
    delete splitter;
    splitter = NULL;
  }
}

/**
 * Recursive Function - Basically a nicer nested for-loop.
 * Used to parse users out of message and place into queue for
 * multi-message sending
 */
void addRecipientToQueue(String recipeintList) {
  int recipientIndex = recipeintList.indexOf(',');
  String recipient = recipeintList.substring(0, recipientIndex);
  String remainingRecipients = recipeintList.substring(recipientIndex+1);
  if (IsNumeric(recipient)) {
    if (recipient.toInt() < numberOfLCD) {
      senderQueue.push(recipient);
    } else {
      Serial.println("Invalid LCD address " + String(recipient) + ", please enter value less than or equal to " + String(numberOfLCD));
    }
  }
  if (remainingRecipients.length() > 0 && recipientIndex > 0) {
    addRecipientToQueue(remainingRecipients);
  }
}

/**
 * Get a list of users, and also take message out of message based
 * on unique identifier "-"
 */
String getOwnerList(String message) {
  splitter = new StringSplitter(message, '-', 2);
  String item = splitter->getItemAtIndex(1);

  if (!splitter) {
    return "";
  }
  
//  int splitIndex = message.indexOf('-');
//  if (splitIndex < 0) {
//    return "";
//  }

  String recipientList = splitter->getItemAtIndex(0);
  String cutMessage = splitter->getItemAtIndex(1);

  char specialCase = message.charAt(0);
  if (specialCase == 'a') {
    for(int p = 0; p < numberOfLCD; p++) {
      senderQueue.push(String(p));
    }
  } else {
    addRecipientToQueue(recipientList);
  }
  return cutMessage;
}

byte sendMessageToLCD(String message, String id, byte charCount) {
//  char charBuf[message.length()+1];
//  message.toCharArray(charBuf, message.length()+1);
  
  //Serial.println("Input char: " + String(charCount));
  byte stillProcessing = 1;
  int lineNumber = 0;
  int lineCount = 0;

  lcd.clear();
  lcd.setCursor(0,0);

  Serial.print(id + ":");
  while(stillProcessing) {
    lcd.backlight();
    if (++lineCount > 20) {
      lineNumber += 1;
      lcd.setCursor(0,lineNumber);
      lineCount = 1;
    }
      
    //Serial.print(message[charCount - 1]);
    lcd.print(message[charCount - 1]);

    if (charCount % 80 == 0) {
     // Serial.println(charCount);
      //Serial.println("1st");
      stillProcessing = 0;
    }

    if (!message[charCount]) {
      //Serial.println("Error is happening with this char");
      //Serial.println(message[charCount]);
      //Serial.println("2nd");
      stillProcessing = 0;
      return -1;
    }
    charCount += 1;
  }
  Serial.println("");
  return charCount;
}

byte manySend(String message, byte charCount) {
  byte globalCharCount;
  
  while(!senderQueue.isEmpty()) {
    String recipient = senderQueue.pop();
    backupQueue.push(recipient);
    setMux(recipient.toInt());
    globalCharCount = sendMessageToLCD(message, recipient, charCount);
  }
  //Serial.println("Pos:" + String(globalCharCount));
  return globalCharCount;
}

void callFunction(String message, uint8_t lineCount, uint8_t x) {
  
}

void messageController(String message) {
  onAllLCD();
  if (senderQueue.isEmpty()) {
    return;
  }

  //0,1,2,3,4

  //Go through 0-4 (Send 1st line)
  //Do again (0-4) send 2nd line

  uint8_t x = 0;
  uint8_t lineCount;

  while(!senderQueue.isEmpty()) {
    String recipient = senderQueue.pop();
    setMux(recipient.toInt());
    lineCount = scrolling_text(message, x);
  }
  delay(3000);
  
//  byte charCount = 1;
//  Serial.print("Sending msg...");
//  //Serial.println(message.length());
//  while (charCount < message.length() + 1) {
//    charCount = manySend(message, charCount);
//    delay(5000);
//    recovery();
//  }
//  if (charCount == -1) {
//    Serial.print("ERR: Please don't copy/paste\n");
//  } else {
//    Serial.print(" - Message Sent!!\n");
//  }
  emptyQueues();
  offAllLCD();
}

void recovery() {
  while(!backupQueue.isEmpty()) {
    String recipient = backupQueue.pop();
    senderQueue.push(recipient);
  }
}

void emptyQueues() {
  while(!backupQueue.isEmpty()) {
    backupQueue.pop();
  }
  while(!senderQueue.isEmpty()) {
    senderQueue.pop();
  }
}

void prepareLCD() {
  for(int i = 0; i < numberOfLCD; i++) {
    setMux(i);
    lcd.clear();
    lcd.setCursor(0,0);
  }
}

void offAllLCD() {
  for(int i = 0; i < numberOfLCD; i++) {
    setMux(i);
    lcd.clear();
    lcd.noBacklight();  
  }
}

void onAllLCD() {
  for(int i = 0; i < numberOfLCD; i++) {
    setMux(i);
    lcd.clear();
    lcd.backlight();  
  }
}

void setMux(int x) {
  digitalWrite(CONTROL0, (x&15)>>3); 
  digitalWrite(CONTROL1, (x&7)>>2);  
  digitalWrite(CONTROL2, (x&3)>>1);  
  digitalWrite(CONTROL3, (x&1));
}

//NOT MY CODE BELOW: HELPER METHODS THAT DO GENERAL PROBLEMS//
boolean IsNumeric(String str) {
    unsigned int stringLength = str.length();
    if (stringLength == 0) {
        return false;
    }
    boolean seenDecimal = false;
    for(unsigned int i = 0; i < stringLength; ++i) {
        if (isDigit(str.charAt(i))) {
            continue;
        }
        if (str.charAt(i) == '.') {
            if (seenDecimal) {
                return false;
            }
            seenDecimal = true;
            continue;
        }
        return false;
    }
    return true;
}

uint8_t scrolling_text(String msg, uint8_t x) {
  lcd.backlight();
  uint8_t lineNumber = x;
  uint8_t lineCount = msg.length()/20; // 20 chars per line
  
    do {
      lcd.setCursor(0,0);
      lcd.print(msg.substring(lineNumber*20, (lineNumber+1)*20));
      Serial.println(msg.substring(lineNumber*20, (lineNumber+1)*20));
      lcd.setCursor(0,1);
      lcd.print(msg.substring((lineNumber+1)*20, (lineNumber+2)*20));
      Serial.println(msg.substring((lineNumber+1)*20, (lineNumber+2)*20));
      lcd.setCursor(0,2);
      lcd.print(msg.substring((lineNumber+2)*20, (lineNumber+3)*20));
      Serial.println(msg.substring((lineNumber+2)*20, (lineNumber+3)*20));
      lcd.setCursor(0,3);
      lcd.print(msg.substring((lineNumber+3)*20, (lineNumber+4)*20));
      Serial.println(msg.substring((lineNumber+3)*20, (lineNumber+4)*20));
      lineNumber += 1;
    } while(lineCount - lineNumber >= 4);
    return lineCount;
}
