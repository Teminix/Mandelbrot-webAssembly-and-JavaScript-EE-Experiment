#include <iostream>
using namespace std;
double avgNums(int arr[], int len){
  double sum = 0;
  for(int i=0;i<len;i++) sum+=arr[i];
  return (sum/len);
}
bool mandelbrotCheck(double re, double im, int iterations){
  for(int i=0;i<iterations;i++){
    double tempRe = re;
    re = re*re - im*im;
    im = 2*tempRe*im;
    if(re*re + im*im > 4) return false;
  }
  return true;
}
void modifyArray(int array[],int len){
  for(int i=0;i<len;i++){
    array[i]+=1;
  }
}
int main(){
  int array1[] = {12,58,6,321};
  //
  for(int i=0;i<4;i++) cout << array1[i] << " ";
  cout << endl;
  modifyArray(array1,4);
  for(int i=0;i<4;i++) cout << array1[i] << " ";
  cout << endl;
  return 0;
}
