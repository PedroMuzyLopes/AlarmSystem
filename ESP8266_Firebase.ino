//
// Copyright 2015 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//

// FirebaseDemo_ESP8266 is a sample that demo the different functions
// of the FirebaseArduino API.

#include <ESP8266WiFi.h>
#include <FirebaseArduino.h>

// Set these to run example.
#define FIREBASE_HOST "alarmsystem-3b2b1-default-rtdb.firebaseio.com"
#define FIREBASE_AUTH "JCMGpG2JHuHJ858hKMssBPZDJErpReEixcidNZ4g"
#define WIFI_SSID "ZTE_2.4G_TuwE7X"
#define WIFI_PASSWORD "eSyCDX7A"

String values,sensor_data;

void setup() {
  Serial.begin(9600);

  delay(1000);
  
  // connect to wifi.
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("conectando...");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(500);
  }
  Serial.println();
  Serial.print("conectado: ");
  Serial.println(WiFi.localIP());
  
  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
}

int n = 0;

void loop() {

  bool Sr =false;
 
  while(Serial.available()){
    
        //get sensor data from serial put in sensor_data
        sensor_data=Serial.readString(); 
        Sr=true;    
        
    }
  
delay(1000);

  if(Sr==true){  
    
  values=sensor_data;
  
  //get comma indexes from values variable
  int fristCommaIndex = values.indexOf(',');
  int secondCommaIndex = values.indexOf(',', fristCommaIndex+1);
  
  //get sensors data from values variable by  spliting by commas and put in to variables  
  String mq2_value = values.substring(0, fristCommaIndex);
  String lm35_value = values.substring(fristCommaIndex+1, secondCommaIndex);


  //store mq2 sensor data as string in firebase 
  Firebase.setString("mq2_value",mq2_value);
   delay(10);
  //store lm35 data as string in firebase 
  Firebase.setString("lm35_value",lm35_value);
   delay(10);
  
  //store previous sensors data as string in firebase
  
  Firebase.pushString("previous_mq2_value",mq2_value);
   delay(10);
  Firebase.pushString("previous_lm35_value",lm35_value);
  
  
  delay(1000);
  
  if (Firebase.failed()) {  
      return;
  }
  
}
}
