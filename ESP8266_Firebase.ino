//Bibliotecas necessárias
#include <SoftwareSerial.h>
#include <ArduinoJson.h>

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


// Variáveis de apoio
String temp_s;
String gas_s;
//2 = Rx e 3 = Tx
SoftwareSerial espArdu(D6, D5);


void setup() {
  
  Serial.begin(9600);

  //PARTE DO SEU CÓDIGO
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

  //----------
  espArdu.begin(9600);
  while (!Serial) continue; // Aqui, o código espera o comando serial
}

void loop() {
  
  StaticJsonBuffer<1000> jsonBuffer;
  JsonObject& data = jsonBuffer.parseObject(espArdu);

  if (data == JsonObject::invalid()) {
    Serial.println("Conexão falou, verifique as ligações entres esp e arduino");
    jsonBuffer.clear();
    return;
   
  }
//PARTE DO SEU CODIGO COM AS DEVIDAS CORREÇÕES
    Firebase.setString("mq2_value",gas_s);
   delay(10);
  //store lm35 data as string in firebase 
  Firebase.setString("lm35_value",temp_s);
   delay(10);
  
  if (Firebase.failed()) {  
      return;
  }
  //-----------------
 
  Serial.print("Gas recebido:  ");
  float gas = data["gases"];
  gas_s = gas;
  Serial.println(gas);
  Serial.print("Temperatura Recebida do arduino:  ");
  float temp = data["temperatura"];
  temp_s= temp;
  Serial.println(temp);
  Serial.println("-----------------------------------------");
}