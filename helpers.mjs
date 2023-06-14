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
  const eqRangeQueryResult = await usersCollection
    .find({ dob: { $gte: new Date("1988"), $lte: new Date("1990") }, inactive: false })
    .explain("executionStats");
  const { executionStats } = eqRangeQueryResult;
  console.log(executionStats);
  console.log("done");
};

/**
 * Run equality range and sort query optionally with a hint
 * @param {obj} hint index specification document (eg. { inactive: 1, score: 1 })
 * @returns {void} Logs data to the console
 */
export const eqRangeSortQuery = async (hint) => {
  // Run equality , range and sort query
  // Now that we hae the perfect index to find active accounts with dob 1988 - 90 ...
  // the last step is to sort them by score, with the highest at the top
  // db.users.find({ dob:{ $gte: new Date("1988"), $lte: new Date("1990") }, inactive: false }.sort( { score: -1 } )
  let eqRangeSortQueryResult
  if (hint) {
    eqRangeSortQueryResult = await usersCollection
      .find({ dob: { $gte: new Date("1988"), $lte: new Date("1990") }, inactive: false })
      .sort({ score: -1 })
      .hint(hint)
      .explain('executionStats')
  } else {
    eqRangeSortQueryResult = await usersCollection
      .find({
        dob: { $gte: new Date("1988"), $lte: new Date("1990") },
        inactive: false,
      })
      .sort({ score: -1 })
      .explain("executionStats");
  }

  const { executionStats, queryPlanner } = eqRangeSortQueryResult;
  console.log((" === queryPlanner.winningPlan: ==="))
  console.log(queryPlanner.winningPlan);
  console.log(" === executionStats: ===");
  console.log(executionStats);
  console.log("done");
};

