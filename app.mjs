import { MongoClient } from "mongodb";

// connection string env
import "dotenv/config";
import { rangeQuery, createIndex, delay, dropIndexes, eqRangeQuery, eqRangeSortQuery } from "./helpers.mjs";
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
console.log("\nThis is better. totalDocumentsExamined has dropped from 3 to 2, but the number of keys scanned is still 3")
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
console.log("Equality tests should be before range!");
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
console.log("\nOrder matters in compound indexes. When we make the { inactive:1, dob:1} index ...");
await delay(3000);
console.log("We can go right to the section of the index with active accounts");
await delay(3000);
console.log(".. then we can do a range scan from dob 1988 to 1990");
await delay(5000);

// Step 7 - eq, range, sort - last step is to sort them by score
console.log("\nLet's run the query with a sort to see what index it uses");
await delay(3000);
eqRangeSortQuery()
await delay(5000)
console.log("\nIn this case, we can see that the winning plan was SORT");
await delay(3000)
console.log("The nReturned, totalDocsExamined, and totalKeysExamined are all equal, which is good, however ...")
await delay(3000)
console.log("The index passed the values that matched the filter to the sort stage, then ...");
await delay(3000);
console.log("MongoDB had to batch up the results in memory, sort them, and then return them")
await delay(3000)
console.log("\nThis is bad for a number of reasons:");
console.table(['costs cpu and ram', 'dumps results onto the network at the same time', 'in-memory sorts have a limit of 32mb (problematic with large datasets)'])
await delay(7500);

// Step 8 - avoiding in memory sort
console.log('\nHow can we avoid an in-memory sort?')
await delay(3000);
console.log('We would like an index that where MDB can jump to the active accounts ...')
await delay(3000);
console.log('Then sort those documents in order from highest score to the lowest')
await delay(3000);
console.log('To do that we will try creating an index { inactive: 1, score: 1 }\n')
await delay(5000);
createIndex({ inactive: 1, score: 1 });
await delay(5000);

// step 9 - hint the index
console.log('\nMDB will not consider this index because it will require a higher number of total documents scanned ...')
await delay(5000);
console.log("The query optimizer won't consider sorting efficiency when choosing an index")
await delay(3000);
console.log("To nudge MDB in the right direction, we can hint at this index when running the query:")
await delay(5000);
eqRangeSortQuery({ inactive: 1, score: 1});

console.log('\nNow the number of documents examined has risen to three, but our in memory sort is no longer happening')
await delay(5000);

console.log('\nMDB walks through the {inactive:1, score:1} index in reverse, getting the scores in the right order')
await delay(5000);
console.log('Then MDB checks each doc to make sure the DOB is in range')
await delay(5000);

// step 10 - add the dob to the index
console.log('\nSo we solved the blocking sort, but raised the number of keys scanned')
await delay(5000);
console.log("We can't reduce the number of keys scanned, but can we reduce the number of objects/docs scanned?")
await delay(5000);
console.log("Let's add the dob to the index so MDB doesn't have to get it from each document")
await delay(5000);

console.log('\nCreating an index for { inactive: 1, score: 1, dob: 1 }')
await delay(5000);
createIndex({ inactive: 1, score: 1, dob: 1 });
await delay(5000);

// step 10 - hint the index (with dob)
console.log('\nMDB will again not consider this index, so we will hint it')
await delay(5000);
eqRangeSortQuery({ inactive: 1, score: 1, dob: 1});

console.log("\n This is as good as it gets. MDB follows a similar plan as before")
await delay(3000);
console.log(".. traversing the { inactive: 1, score: 1, dob: 1 } index backward so it finds scores in the right order.")
await delay(3000);
console.log("Now the totalDocsExamined is only 2, because MDB can tell from the index entry alone that the user with dob 1989 isn't a match.")
await delay(3000);

// Step 11 - conclusion
console.log("\nIn summary, the idea method for creating compound indexes is:");
console.table([
  "equality tests, then ..",
  "sort fields (add the same sort order as your query)",
  "and finally, range filters (fields with the least distinct values first)",
]);

await delay(5000);
console.log("\nOmit equality or range fields if they are not selective");
await delay(3000);
console.log("As a rule of thumb, if it doesn't filter out at least 90% of documents, you might be better off omitting it")
await delay(3000);
console.log("Thats it!")















