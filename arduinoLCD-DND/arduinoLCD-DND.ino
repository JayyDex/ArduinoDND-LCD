#include <LiquidCrystal_I2C.h>
#include <QueueList.h>
#include <Wire.h> 
#include <math.h>

#define CONTROL0 5    
#define CONTROL1 4
#define CONTROL2 3
#define CONTROL3 2

LiquidCrystal_I2C lcd(0x38,20,4);

QueueList <int> senderQueue;
QueueList <int> backupQueue;

const word numChars = 255;
char receivedMessage[numChars];
char lastMessage[numChars];
boolean newData = false;

int mux0array[16];
int mux1array[16];
int mux2array[16];

int numberOfLCD = 2;

void setup()
{
  memset(&receivedMessage[0], 0, sizeof(receivedMessage));
  memset(&lastMessage[0], 0, sizeof(lastMessage));
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

  Serial.println("### Awaiting input ###");
}

void loop()
{    
  recvWithEndMarker();
  if (newData == true) {
    if (receivedMessage[0] == 'r' && lastMessage[0] != 0) {
      Serial.println("Repeating Message....");
      strncpy(receivedMessage, lastMessage, strlen(lastMessage));
    }
    int index = getOwnerList(receivedMessage);
    char subbuff[numChars];
    strncpy(subbuff, receivedMessage+(index+1), numChars-1);
    subbuff[numChars] = '\0';
    trim(subbuff);

    if(subbuff[0] && index != 0 && senderQueue.count() != 0) {
      Serial.print("Input: ");
      Serial.println(receivedMessage);
      Serial.print("Msg: ");
      Serial.println(subbuff);
      Serial.print("Sending to this many people: ");
      Serial.println(senderQueue.count());

      messageController(subbuff);
      
      strncpy(lastMessage, receivedMessage, strlen(receivedMessage));
      memset(&receivedMessage[0], 0, sizeof(receivedMessage));
    } else {
      Serial.println("Invalid MSG Input!!");
      Serial.println("Use Msg Format: {senderlist}-{message}, example: 1,2,3,4,5-HelloWorld");
    }

    emptyQueues();
    newData = false;
    Serial.println("\n### Awaiting input ###");
  }
}

void messageController(char* message) {
  onAllLCD();

  String msg = String(message);
  Serial.print("Controller: ");
  Serial.println(msg);

  uint8_t lineNumber = 0;
  int lineCount = ceil((double)msg.length()/20.0); // 20 chars per line

  // Declaration
  int* myArray = 0;
  int myArraySize = senderQueue.count();
  
  // Allocation (let's suppose size contains some value discovered at runtime,
  // e.g. obtained from some external source)
  if (myArray != 0) {
      myArray = (int*) realloc(myArray, myArraySize * sizeof(int));
  } else {
      myArray = (int*) malloc(myArraySize * sizeof(int));
  }

  for(int p = 0; p < myArraySize; p++) {
    myArray[p] = senderQueue.pop();
  }

  for(int g = 0; g < myArraySize; g++) {
    Serial.print("ID: ");
    Serial.println(myArray[g]);
  }

//
//  do {
//    
//  } while();

  
  scrollingText(msg);
  free(myArray);
  offAllLCD();
}

/**
 * Returns an int, indicating which line it's currently up to
 */
int scrollingText(String msg) {
  
}

/**
 * Get a list of users, and also take message out of message based
 * on unique identifier "-"
 */
int getOwnerList(char* message) {
  const char *ptr = strchr(message, '-');
  int index;
  if(ptr) {
    index = ptr - message;
  }
  char subbuff[numChars];
  memset(&subbuff[0], 0, sizeof(subbuff));
  strncpy(subbuff, message, index);
  subbuff[numChars] = '\0';
  trim(subbuff);
  String recipeintList = String(subbuff);
  if (message[0] == 'a') {
    for(int p = 0; p < numberOfLCD; p++) {
      senderQueue.push(p);
    }
  } else {
    /** Add People to send msg to queue**/
    recipeintList.trim();
//    Serial.println("Receipt: " + recipeintList);
    String remainingRecipients = recipeintList;
    while(remainingRecipients.length() > 0) {
      int recipientIndex = remainingRecipients.indexOf(',');
      if (recipientIndex == -1) {
        recipientIndex = 1;
      }
      String recipient = remainingRecipients.substring(0, recipientIndex);
      remainingRecipients = remainingRecipients.substring(recipientIndex+1);
      if (IsNumeric(recipient)) {
        senderQueue.push(recipient.toInt());
      }
    }
  }
//  Serial.println("End of recipient adding");
  return index;
}

void recovery() {
  while(!backupQueue.isEmpty()) {
    int recipient = backupQueue.pop();
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

void recvWithEndMarker() {
    static word ndx = 0;
    char endMarker = '\n';
    char rc;
    
    while (Serial.available() > 0 && newData == false) {
        rc = Serial.read();

        if (rc != endMarker) {
            receivedMessage[ndx] = rc;
            ndx++;
            if (ndx >= numChars) {
                ndx = numChars - 1;
            }
        }
        else {
            receivedMessage[ndx] = '\0'; // terminate the string
            ndx = 0;
            newData = true;
        }
    }
}

void trim(char *str)
{
    int i;
    int begin = 0;
    int end = strlen(str) - 1;

    while (isspace((unsigned char) str[begin]))
        begin++;

    while ((end >= begin) && isspace((unsigned char) str[end]))
        end--;

    // Shift all characters back to the start of the string array.
    for (i = begin; i <= end; i++)
        str[i - begin] = str[i];

    str[i - begin] = '\0'; // Null terminate string.
}

//void scrolling_text(String msg) {
//  uint8_t lineNumber = 0;
//  uint8_t lineCount = msg.length()/20; // 20 chars per line
//  
//    do {
//      lcd.setCursor(0,0);
//      lcd.print(msg.substring(lineNumber*20, (lineNumber+1)*20));
//      Serial.println(msg.substring(lineNumber*20, (lineNumber+1)*20));
//      lcd.setCursor(0,1);
//      lcd.print(msg.substring((lineNumber+1)*20, (lineNumber+2)*20));
//      Serial.println(msg.substring((lineNumber+1)*20, (lineNumber+2)*20));
//      lcd.setCursor(0,2);
//      lcd.print(msg.substring((lineNumber+2)*20, (lineNumber+3)*20));
//      Serial.println(msg.substring((lineNumber+2)*20, (lineNumber+3)*20));
//      lcd.setCursor(0,3);
//      lcd.print(msg.substring((lineNumber+3)*20, (lineNumber+4)*20));
//      Serial.println(msg.substring((lineNumber+3)*20, (lineNumber+4)*20));
//      lineNumber += 1;
//    } while(lineCount - lineNumber >= 4);
//}
