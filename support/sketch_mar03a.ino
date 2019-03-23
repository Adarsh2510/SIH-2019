void setup(){
  Serial.begin(9600);
}
int rN;
//int f = Serial.parseInt();

void loop(){
  delay(1000);
  //Serial.write(44); // send a byte with the value 45
  rN = random(80,100);
  //Serial.println(f);
  Serial.println(rN);
  //int bytesSent = Serial.write("\nhello"); //send the string "hello" and return the length of the string.
}
