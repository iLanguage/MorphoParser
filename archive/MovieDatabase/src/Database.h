/*
 * Database.h
 *
 *  Created on: Jul 15, 2010
 *      Author: gina
 */

#ifndef DATABASE_H_
#define DATABASE_H_
#include <vector>
#include <map>
#include <set>
#include "Record.h"

using namespace std;
class Database {
private:
	//store records in a vector
	vector<Record*>  moveieDatabase;
	//create indexes on queryable items, using a map from string -> {set of vector indexes in teh db}
	map<int,set<int> > yearIndex;
	map<int, set<int> >::iterator yearIterator;
	/*timeIndex;
	actorIndex;
	ratingIndex;
	genreIndex;*/

public:
	void first();
	void next();
	void previous();
	void last();
	void current();

	//queries will look in index for the vector index and returns a set of hits
	void queryTime();
	void queryYear();
	void queryActor();
	void queryRating();
	void queryGenre();

	void buildYearIndex();

	void importRecords(char* filename);

	Database();
	virtual ~Database();
};

#endif /* DATABASE_H_ */
