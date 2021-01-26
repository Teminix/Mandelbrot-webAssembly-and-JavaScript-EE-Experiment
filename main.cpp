// // #include <iostream>
// #include <emscripten.h>
// EMSCRIPTEN_KEEPALIVE
// int Add(int num1, int num2) {
//   return num1+num2;
#include <stdint.h>
#include <string>
// #include <iostream>
#include <emscripten.h>
using namespace std;
extern "C" {

  int sum(int x, int y) {
    return x+y;
  }
  bool mandelbrotCheck(double re, double im, int iterations, int threshold = 2){
    double reCopy = re;
    double imCopy = im;
    for(int i=0;i<iterations;i++){
      double tempRe = re;
      re = re*re - im*im + reCopy;
      im = 2*tempRe*im + imCopy;
      if(re*re + im*im > threshold*threshold) return false;
    }
    return true;
  }
  int modifyArray(uint8_t *buf, int len){
    uint8_t *item;
    uint8_t *end = buf + len;
    for(item=buf;item<end;){
      *item=100;item++; // Red
      *item=100;item++; // Green
      *item=100;item++; // Blue
      *item=255;item++; // Alpha
    }
    return 0;
  }
  void encodeMandelbrot(uint8_t *imageData,int len,int width, int height, double xStart, double yStart, double xEnd, double yEnd, int iterations=20,int threshold=2) {
    uint8_t *index;
    uint8_t *endPoint = imageData+len;
    int i=0;
    index=imageData;
    double dx = (xEnd-xStart)/(double)width;
    double dy = (yStart-yEnd)/(double)height;
    double xCoord = xStart;
    double yCoord = yStart;
    for(int yPixel=0;yPixel<height;yPixel++){
      xCoord = xStart;
      for(int xPixel=0;xPixel<width;xPixel++){
        if(mandelbrotCheck(xCoord,yCoord,20,2)){
          *index=0;index++; // Red
          *index=0;index++; // Blue
          *index=0;index++; // Green
        } else {
          *index=255;index++;
          *index=255;index++;
          *index=255;index++;
        }
        *index=255;index++; // Alpha
        xCoord += dx;
      }
      yCoord-=dy;
    }
    // return to_string(mandelbrotCheck(xStart,yStart,20));
  }}

// double avgNums(int arr[], int len){
//   double sum = 0;
//   for(int i=0;i<len;i++) sum+=arr[i];
//   return (sum/len);
// }
// bool mandelbrotCheck(double re, double im, int iterations, int threshold = 2){
//   for(int i=0;i<iterations;i++){
//     double tempRe = re;
//     re = re*re - im*im;
//     im = 2*tempRe*im;
//     if(re*re + im*im > threshold*threshold) return false;
//   }
//   return true;
// }
// bool test(){
//   return true;
// }
// void modifyArray(int array[],int len){
//   for(int i=0;i<len;i++){
//     array[i]+=1;
//   }
// }
// int main(){
  // int array1[] = {12,58,6,321};
  // //
  // for(int i=0;i<4;i++) cout << array1[i] << " ";
  // cout << endl;
  // modifyArray(array1,4);
  // for(int i=0;i<4;i++) cout << array1[i] << " ";
  // cout << endl;
  // return 0;
  // cout << mandelbrotCheck(0.25,0.25,20);
  // return 0;
//   return 21;
// }
