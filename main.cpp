#include <stdint.h>
#include <string>
#include <emscripten.h>
using namespace std;
extern "C" { // This is important for compiling C++ code because of name mangling
  bool mandelbrotCheck(double re, double im, int iterations, int threshold = 2){ // Function for checkign if coordinates are in mandelbrot set or not
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
  void encodeMandelbrot( // Function for encoding the mandelbrot set
    uint8_t *imageData, // HTML Canvas data array Unsigned 8 bit integer where every four pixels have RGBA values like : Red, Green, Blue, Alpha
    int len, // Lenght of the data
    int width,  // Width of HTML Canvas [1920]
    int height, // Height of HTML Canvas [1080]
    double xStart, double yStart, double xEnd, double yEnd, // Coordinates of render parameters
    int iterations=20, // Mandelbrot iterations
    int threshold=2 // Mandelbrot threshold(By default, it's 2)
  ) {
    uint8_t *index; // Index pointer which represents the index in the Data Array
    uint8_t *endPoint = imageData+len; // Buffer index end
    int i=0; // Iteration variable for debugging
    index=imageData; // Setting the pointer
    double dx = (xEnd-xStart)/(double)width; // Size of each horizontal coordinate
    double dy = (yStart-yEnd)/(double)height; // Size of each vertical coordinate
    double xCoord = xStart; // Setting the render parameter x
    double yCoord = yStart; // Setting the render parameter y
    for(int yPixel = 0; yPixel < height; yPixel++){ // For loop iterating each y pixel
      xCoord = xStart; // Resetting the x coordinate every step
      for(int xPixel = 0; xPixel < width; xPixel++){ // For loop for iterating each x pixel
        if(mandelbrotCheck(xCoord,yCoord,iterations,2)){ // If coordinates are in the mandelbrot set, color black (RGB = 0,0,0)
          *index = 0;index++; // Red
          *index = 0;index++; // Blue
          *index = 0;index++; // Green
        } else { // If coordinates are not in the mandelbrot set, color white (RGB = 255,255,255)
          *index = 255;index++;
          *index = 255;index++;
          *index = 255;index++;
        }
        *index = 255;index++; // Setting alpha to max for each
        xCoord += dx; // Increment x coordinate
      }
      yCoord -= dy; // Decerement y coordinate
    }
  }}
