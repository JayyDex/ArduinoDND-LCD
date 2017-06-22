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

int mux0array[16];
int mux1array[16];
int mux2array[16];

int numberOfLCD = 1;

void setup()
{
  Serial.begin(9600);
  /** Setup MUX Control Pins **/
  pinMode(CONTROL0, OUTPUT);
  pinMode(CONTROL1, OUTPUT);
  pinMode(CONTROL2, OUTPUT);
  pinMode(CONTROL3, OUTPUT);

  /** Setup Arduino **/
  Serial.println("Initialising....");
  for (int i=0; i<numberOfLCD; i++) {
    digitalWrite(CONTROL0, (i&15)>>3); 
    digitalWrite(CONTROL1, (i&7)>>2);  
    digitalWrite(CONTROL2, (i&3)>>1);  
    digitalWrite(CONTROL3, (i&1));
    lcd.init();
    lcd.begin(20, 4);
  }

  Serial.println("Initialisation Complete");
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

    messageController(cutMessage);
    lastMessage = message;
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
    senderQueue.push(recipient);
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
  int splitIndex = message.indexOf('-');
  if (splitIndex < 0) {
    return "";
  }
  String recipientList = message.substring(0, splitIndex);
  String cutMessage = message.substring(splitIndex+1);
  addRecipientToQueue(recipientList);
  return cutMessage;
}

int sendMessageToLCD(String message, String id, byte charCount) {
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
      
    Serial.print(message[charCount - 1]);
    //lcd.print(message[charCount - 1]);

    if (!message[charCount] || !(charCount % 80)) {
      stillProcessing = 0;
    }
    charCount += 1;
  }
  Serial.println("");
  return charCount;
}

int manySend(String message, byte charCount) {
  byte globalCharCount;
  
  while(!senderQueue.isEmpty()) {
    String recipient = senderQueue.pop();
    backupQueue.push(recipient);
    setMux(recipient.toInt());
    globalCharCount = sendMessageToLCD(message, recipient, charCount);
  }
  return globalCharCount;
}

void messageController(String message) {
  onAllLCD();

  byte charCount = 1;

  while (charCount < message.length() + 1) {
    charCount = manySend(message, charCount);
    Serial.println(charCount);
    delay(5000);
    recovery();
  }

  offAllLCD();
}

void recovery() {
  while(!backupQueue.isEmpty()) {
    String recipient = backupQueue.pop();
    senderQueue.push(recipient);
  }
}

void prepareLCD() {
  for(int i = 0; i < numberOfLCD; i++) {
    setMux(i);
    lcd.clear();
    lcd.setCursor(0,0);
  }
}

//void sendToManyLCD(String message) {
//  onAllLCD();
//  while(!senderQueue.isEmpty()) {
//    String recipient = senderQueue.pop();
//    setMux(recipient.toInt());
//
//    byte stillProcessing = 1;
//    byte charCount = 1;
//    int lineNumber = 0;
//    int lineCount = 0;
//
//    lcd.clear();
//    lcd.setCursor(0,0);
//
//    Serial.print("Owner " + recipient);
//    while(stillProcessing) {
//      lcd.backlight();
//      if (++lineCount > 20) {
//        lineNumber += 1;
//        lcd.setCursor(0,lineNumber);
//        lineCount = 1;
//      }
//      
//      Serial.print(message[charCount - 1]);
//      //lcd.print(message[charCount - 1]);
//      delay(10);
//
//      if (!message[charCount]) {
//        stillProcessing = 0;
//      }
//      charCount += 1;
//    }
//  }
//  delay(3000);
//  offAllLCD();
//}

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
