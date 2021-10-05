//Bibliotecas necessárias
#include <SoftwareSerial.h>
#include <ArduinoJson.h> //***IMPORTANTE!!! Versão da biblioteca 5.13.12

// (5=Rx e 6=Tx)
SoftwareSerial arduEsp(5, 6);

int SensorMQ2 = A0;//PINO UTILIZADO PELO SENSOR DE GÁS MQ-2
int val;
int Buzzer = 8;
int SensorLM35 = A1;//PINO UTILIZADO PELO SENSOR DE TEMPERATURA LM35
int leitura_sensor = 300;//DEFININDO UM VALOR LIMITE (NÍVEL DE GÁS NORMAL)

//*****Variáveis de suporte

float temp;
float gas;

void setup() {
  pinMode(SensorMQ2, INPUT); //DEFINE O PINO COMO ENTRADA
  pinMode(Buzzer, OUTPUT);
  Serial.begin(9600);

 //Início do Serial criado 
  arduEsp.begin(9600);
  delay(1000);

  
}

void loop() {
  //***** Criando um objeto Json para migrar os dados
  StaticJsonBuffer<1000> jsonBuffer;
  JsonObject& data = jsonBuffer.createObject();

  //Retorno do void com os valores dos sensores
  Sensor_t();
  Sensor_g();


  //****Aqui estamos criando variáveis para os objetos
  data["gases"] = gas;
  data["temperatura"] = temp; 

  //Aqui, enviamo os dados do arduino para o Esp via Serial
  data.printTo(arduEsp);
  jsonBuffer.clear();

  delay(1000);
}

void Sensor_t() {

 
  
  val = analogRead(SensorLM35);  
  float mv = ( val/1024.0)*5000;
  temp = (mv/10)-14;
  
  Serial.print("Temperature: ");
  Serial.println(temp);

}


void Sensor_g() {
  int valor_analogico =analogRead(SensorMQ2); //VARIÁVEL RECEBE O VALOR LIDO NO PINO ANALÓGICO
  if (valor_analogico > leitura_sensor){//SE VALOR LIDO NO PINO ANALÓGICO FOR MAIOR QUE O VALOR LIMITE, FAZ 
     gas =  valor_analogico;
     Serial.print("Sensor gas: ");
    Serial.println(gas);
    //Serial.println("ALERTA");
    digitalWrite(Buzzer, HIGH); //ATIVA O BUZZER E O MESMO EMITE O SINAL SONORO
  }else{ //SENÃO, FAZ
    digitalWrite(Buzzer, LOW); //ATIVA O BUZZER E O MESMO EMITE O SINAL SONORO
   gas =  valor_analogico;
   Serial.print("Sensor gas: ");
  Serial.println(gas);
  }
 
}