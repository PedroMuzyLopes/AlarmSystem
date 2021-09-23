int SensorMQ2 = 0;//PINO UTILIZADO PELO SENSOR DE GÁS MQ-2
int val;
int SensorLM35 = 1;//PINO UTILIZADO PELO SENSOR DE TEMPERATURA LM35

String valores;

int leitura_sensor = 300;//DEFININDO UM VALOR LIMITE (NÍVEL DE GÁS NORMAL)

void setup(){
pinMode(SensorMQ2, INPUT); //DEFINE O PINO COMO ENTRADA
Serial.begin(9600);//INICIALIZA A SERIAL
}
void loop(){

  valores= (get_gases()+','+get_temperatura());
    delay(1000);
    // removed any buffered previous serial data.
    Serial.flush();
    delay(1000);
    // sent sensors data to serial (sent sensors data to ESP8266)
    Serial.print(valores);
    delay(2000);
}

String get_temperatura(){
  val = analogRead(SensorLM35);
  float mv = ( val/1024.0)*5000;
  float cel = (mv/10)-14;
  
  return String(cel);
}

String get_gases(){
  int valor_analogico = analogRead(SensorMQ2); //VARIÁVEL RECEBE O VALOR LIDO NO PINO ANALÓGICO
  if (valor_analogico > leitura_sensor){//SE VALOR LIDO NO PINO ANALÓGICO FOR MAIOR QUE O VALOR LIMITE, FAZ 
    //Serial.println("ALERTA");
    //digitalWrite(Buzzer, HIGH); //ATIVA O BUZZER E O MESMO EMITE O SINAL SONORO
  }else{ //SENÃO, FAZ
    //digitalWrite(Buzzer, LOW); //ATIVA O BUZZER E O MESMO EMITE O SINAL SONORO
  }
 
  return String(valor_analogico);
}
