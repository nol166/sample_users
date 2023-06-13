import { MongoClient } from "mongodb";

// connection string env
import "dotenv/config";
import { rangeQuery, createIndex, delay, dropIndexes, eqRangeQuery } from "./helpers.mjs";
const uri = process.env.MDB_URI;

const client = new MongoClient(uri);
export const usersCollection = client.db("indexing2").collection("users");

// Step 0 - drop indexes
console.log("\nDropping indexes");
dropIndexes()
await delay(3000);

// Step 1, run the query without an index
console.log("\nRunning range query");
await delay(3000);
rangeQuery();
await delay(5000);

// Step 2. create an index on dob
console.log("\nCreating DOB index");
await delay(3000);
createIndex({ dob: 1})
await delay(5000);

// Step 3. Run the range query again
console.log("\nRunning range query after DOB index was created");
await delay(3000);
rangeQuery();
await delay(5000);
console.log("totalDocsExamined fell from 4 to 3, because MDB used an index to go directly to the documents it needed, skipping the one whose dob is out of range")
await delay(5000);

// Step 4. Eq plus range - Filter out non-active users
console.log("\nRunning equality plus range query to filter out non-active users");
await delay(3000);
eqRangeQuery()
await delay(5000)
console.log("The nReturned has fallen to 2, but the total keys and docs scanned are still 3")
await delay(2500);
console.log("MongoDB scanned the dob index from 1988 to 1990 which includes both active and the one inactive user")
await delay(2500);
console.log("MongoDB couldn't filter this one until it examined the document itself")
await delay(5000);

// TODO: check if this is needed - temp measure because it won't choose this index
console.log("\nDropping indexes");
dropIndexes();
await delay(3000);

// Step 5 - Create compound index - Get the idea index back (all numbers the same)
console.log("\nCreating new index on { dob: 1, inactive : 1 }");
await delay(3000);
createIndex({ dob: 1, inactive: 1 })
await delay(5000);

// Step 6 - Run the query again
console.log("\nRunning equality plus range query now that we have a compound index");
await delay(3000);
eqRangeQuery()
await delay(5000)
console.log("This is better. totalDocumentsExamined has dropped from 3 to 2, but the number of keys scanned is still 3")
await delay(2500);
console.log("MDB scanned the range { dob: 1988, inactive: false } to { dob: 1990, inactive: false }")
await delay(5000);
console.log("This includes the { dob: 1989, inactive: true } doc")
await delay(3000);
console.log("When scanned, MDB saw it pointed to a inactive user and skipped it w/o inspecting the doc");
await delay(3000);
console.log("Therefore causing the keys examined to remain the same, but docs to fall to 2");
await delay(5000);

// Step 7 - Fix the order of the index
console.log("\nLet's fix the order of the indexed fields. The previous order was wrong");
await delay(3000);
console.log("\nEquality tests should be before range!");
await delay(3000);
console.log("\nCreating index with the values flipped { inactive: 1, dob : 1 }");
await delay(3000);
createIndex({ inactive: 1, dob: 1 });
await delay(5000);

// Step 6 - Run the query again
console.log("\nRunning equality plus range query with optimally ordered index");
await delay(3000);
eqRangeQuery()
await delay(5000)




