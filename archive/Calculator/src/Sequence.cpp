/*
 * Sequence.cpp
 *
 *  Created on: Jun 1, 2010
 *      Author: gina
 */

#include "Sequence.h"
#include <string>
#include <iostream>
#include <sstream>
using namespace std;

Sequence::Sequence(char* characterInput){
	size= init(characterInput);

	if (trace) cout<<"Size is "<<size<<endl;
}
Sequence::Sequence(const Sequence & source){
	if(trace) cout<<"Copying a sequence to a new object: "<<source.originalString<<endl;

	size=source.size;
	originalString=source.originalString;
	negative=source.negative;
	store = new int[size];

	//deep copying
	for(int i=0; i<size; i++){
		store[i]=source.store[i];
		if(trace)cout<<"Deep copying "<<source.store[i]<<" to "<<store[i]<<endl;
	}

}
Sequence& Sequence::operator =(const Sequence & source){
	if (trace) cout<<"Assigning from an existing sequence to another existing sequence"<<endl;

	//avoid self assignment
	if (this != &source){
		size=source.size;
		originalString=source.originalString;
		negative=source.negative;
		delete[] store;

		store = new int[size];

			//deep copying
			for(int i=0; i<size; i++){
				store[i]=source.store[i];
				if(trace)cout<<"Deep copying "<<source.store[i]<<" to "<<store[i]<<endl;
			}
	}
	return *this;  //return the pointer to this object
}

int Sequence::init(char* characterInput){
	negative = false;
	originalString = characterInput;

	//For grading purposes turn trace on to follow the procedure of turning an character string into the internal data structure
	bool trace=true;


	size = strlen(characterInput);//TBD: make a function to find the end of a char*
	int originalSize =size;
	if (trace)cout<<"Creating a Sequence using input:  "<< characterInput<<" of size "<<size<<endl;


	int leadingTrashCount = 0;
	/*
	 * read negative character
	 */
	if (characterInput[0] == '-')
	{
		negative=true;
		leadingTrashCount++;
		size--;
		if (trace)cout<<"its a negative number, size is now "<<size<<endl;
	}else{
		negative=false;
	}

	/*
	 * Remove leading zeros
	 */
	while(characterInput[leadingTrashCount] == '0')
	{

		leadingTrashCount++;//look at the next one
		size--;
		if (trace) cout<<"this leading zero is being ignored, size is now "<<size<<endl;
	}
	store = new int[size];
	if (trace)cout <<"Memory was allocated here is the reference: "<< &store <<endl;

	/*
	 * Put remaining integers into the store
	 */
	int temp=0;
	for(int i=leadingTrashCount; i<originalSize; i++){
		char tempChar = characterInput[i];
		int charAsInt = tempChar - '0';
		if (trace) cout<< charAsInt<<" these values should match " <<tempChar<<endl;
		store[temp]=charAsInt;
		temp++;
		//cout<<top;
	}

	if(trace)cout<<"Size is "<<size<<endl;

	return size;//size didnt seem to remain set after control leaves the init function.
}

Sequence::Sequence() {
	// TODO Auto-generated constructor stub

}

Sequence::~Sequence() {
	delete[] store;
	// TODO Auto-generated destructor stub
}

char* Sequence::getAsString(){
	if (trace) cout<<"Size is "<<size<<endl;
	/*
	 * if( size < 0)
			throw std::string("The size is negative, something is wrong.");
	    else
	        asString = new char[size];


	if(negative)
		asString[0]='-';
	for(int i=0; i<size; i++){

		asString[i+1] = 'x';
	}
	asString[size+2]='\0';
	*/
	return "xxx";
}

int Sequence::getSize(){
	return size;
}

char* Sequence::getOriginalString(){
	return originalString;  //does this give the pointer?
}


int Sequence::cStringLength ( const char* input){
	int i =0;
	//go through the input looking for the string termination character.
	while (input[i] != '\0');
		i++;
	return i;
}
