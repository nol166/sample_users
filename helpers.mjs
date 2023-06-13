import { usersCollection } from "./app.mjs";

export const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export const createIndex = async (obj) => {
  const result = await usersCollection.createIndex(obj);
  console.log(result);
  console.log("done");
};

export const dropIndexes = async () => {
  const result = await usersCollection.dropIndexes();
  console.log(result);
  console.log("done dropping indexes");
}

export const rangeQuery = async () => {
  // Run range query first without an index and show explain output
  // We'll start with a simple range query for users with dob from 1988 to 1990:
  // db.users.find({ dob:{ $gte: new Date("1988"), $lte: new Date("1990") }})
  const rangeQueryResult = await usersCollection
    .find({ dob: { $gte: new Date("1988"), $lte: new Date("1990") } })
    .explain("executionStats");
  const { executionStats } = rangeQueryResult;
  console.log(executionStats);
  console.log("done");
};

export const eqRangeQuery = async () => {
  // Run equality plus range query
  // When would keys examined be greater than nReturned?
  // It's when MDB had to examine some index keys pointing to documents that don't match the query.
  // For example, let's filter out non-active users:
  // db.users.find({ dob:{ $gte: new Date("1988"), $lte: new Date("1990") }, inactive: false })
  const rangeQueryResult = await usersCollection
    .find({ dob: { $gte: new Date("1988"), $lte: new Date("1990") }, inactive: false })
    .explain("executionStats");
  const { executionStats } = rangeQueryResult;
  console.log(executionStats);
  console.log("done");
};
