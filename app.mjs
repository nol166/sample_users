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
await delay(5000);

// Step 1, run the query without an index
console.log("\nRunning range query");
rangeQuery();
await delay(5000);

// Step 2. create an index on dob
console.log("\nCreating DOB index");
createIndex({ dob: 1})
await delay(5000);

// Step 3. Run the range query again
console.log("\nRunning range query after DOB index was created");
rangeQuery();
await delay(5000);

// Step 4. Filter out non-active users
console.log("\nRunning equality plus range query to filter out non-active users");
eqRangeQuery()
await delay(5000)

