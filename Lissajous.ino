//==================================================
// Ver1.00
// SSD1315 OLED リサージュデモ
// U8g2ライブラリ使用
//==================================================

#include <Arduino.h>
#include <U8g2lib.h>
#include <Wire.h>
#include <math.h>

// SSD1315（動かなければSSD1306版へ変更）
U8G2_SSD1312_128X64_NONAME_F_HW_I2C
  u8g2(U8G2_R0, U8X8_PIN_NONE);
const int CX = 64;
const int CY = 32;
const int RX = 61;
const int RY = 29;

float phase = 0.0;

void setup() {
  u8g2.begin();
  u8g2.print("Hello World!");
  delay(2000);
}

void loop() {

  u8g2.clearBuffer();

  const int POINTS = 180;

  int px = 0;
  int py = 0;

  for (int i = 0; i <= POINTS; i++) {

    float t = TWO_PI * i / POINTS;

    // 8の字（1:2）
    float x = sin(t);
    float y = sin(2 * t + phase);

    // 全画面へ拡大
    int sx = CX + x * RX;
    int sy = CY + y * RY;

    if (i > 0)
      u8g2.drawLine(px, py, sx, sy);

    px = sx;
    py = sy;
  }

  u8g2.sendBuffer();

  phase += 0.20;      // 回転速度 org:0.03

  delay(25);
}