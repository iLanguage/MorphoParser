/*
 * LargeInt.cpp
 *
 *  Created on: Jun 1, 2010
 *      Author: gina
 */

#include "LargeInt.h"
#include <string>
#include <iostream>
#include "Sequence.h"
using namespace std;

LargeInt::LargeInt(char* characterInput):value(characterInput){

	if (trace)cout<<"Creating a largeint"<<endl;
	//if declared here rather than above in intialization list, the result is a local variable which is pretty useless.
	//Sequence value2(characterInput);
}

void LargeInt::Add( LargeInt &input){
	int temp = input.getSize();
	if (trace) cout<<endl<<"Checking the size of the accumulator..."<<getSize()<<
			"\nChecking the size of the input...\t\t"<<input.getSize()<<endl;
	if (trace) cout<<endl<<"Checking the originalstring of the accumulator..."<<getOriginalString()<<
				"\nChecking the originalstring of the input...\t\t"<<input.getOriginalString()<<endl;

	char* holder = value.getAsString();
	char* anotherHolder = input.value.getAsString();
	if (trace) cout<<"Adding \n " <<holder<<endl<<"+"<<anotherHolder<<endl;


	int maxsize = 0;
	Sequence x;
	Sequence y;
	//copy the values of the two operands into holders x (longer) and y (shorter)
	if ( input.getSize() > getSize() ){
		if (trace) cout<<"The input is longer than the accumulator."<<endl;
		maxsize = input.getSize();
		 x = input.value;
		 y = value;
	}else {
		if (trace) cout<< "The accumulator is longer than the input."<<endl;
		maxsize = getSize();
		 x = value;
		 y = input.value;
	}


	Sequence result(x.getSize()+1);

	int carry=0;
	//for the places starting at zero, going until the size of the smaller operand
	for(int i=1; i<=y.getSize();i++){
		if (trace) cout<<"Adding "<<x.getElement(x.getSize()-i)<< " to "<<y.getElement(y.getSize()-i)<<endl;
			carry = x.getElement(x.getSize()-i)+y.getElement(y.getSize()-i);
			if(carry>baseSystem){
				if (trace) cout<<"In this base system ("<<baseSystem<<") The addition of "<<x.getElement(x.getSize()-i)<<"+"<<y.getElement(y.getSize()-i)<<" results in a carry, here is the value: "<<carry<<endl;
				int plusOne = x.getElement(x.getSize()-i)+1;
				x.setElement(x.getSize()-i+1,plusOne);//equivalent to x.store[size-i+1]+=1; //add 1 to the higher place in the x, to be used in the next itteration of addition
				result.setElement(result.getSize()-i, carry-baseSystem);//equivalent of result.store[size-i]=carry-baseSystem; //remove the base system from the carry eg, if the carry is 13 and base is 10, then its 13-13=3

			}else{
				result.setElement(result.getSize()-i, carry);
			}
			if(trace) cout<<"This is the new value in the "<<i-1<<" place: "<<result.getElement(result.getSize()-i)<<endl;
	}


	holder = result.getAsString();
	cout<<"Addition Completed, result: "<<holder<<" For some reason it doesnt print. "<<endl<<endl;//TBD make it print, something with the way im making a cstring



}//end add

LargeInt::LargeInt() {
	// TODO Auto-generated constructor stub

}

LargeInt::~LargeInt() {


	// TODO Auto-generated destructor stub
}

int LargeInt::getSize(){
	return value.getSize();

}

char* LargeInt::getOriginalString(){
	return value.getOriginalString();
}

char* LargeInt::getAsStringy(){
	return value.getAsString();
}
