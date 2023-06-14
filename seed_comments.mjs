import { MongoClient } from "mongodb";

// connection string env
import "dotenv/config";
const uri = process.env.MDB_URI;

const client = new MongoClient(uri);
const userDocs = [
  {
    _id: ObjectId("6488bcfe84b99e26917f78b1"),
    dob: ISODate("1987-01-01T00:00:00.000Z"),
    username: "testAccount",
    inactive: false,
    score: 800,
  },
  {
    _id: ObjectId("6488bcfe84b99e26917f78b2"),
    dob: ISODate("1988-01-01T00:00:00.000Z"),
    username: "exampleUser",
    inactive: false,
    score: 700,
  },
  {
    _id: ObjectId("6488bcfe84b99e26917f78b3"),
    dob: ISODate("1989-01-01T00:00:00.000Z"),
    username: "coolperson",
    inactive: true,
    score: 998,
  },
  {
    _id: ObjectId("6488bcfe84b99e26917f78b4"),
    dob: ISODate("1990-01-01T00:00:00.000Z"),
    username: "randomGuy",
    inactive: false,
    score: 500,
  },
];

const dropDatabase = async () => {
  try {
    await client.connect();
    const createdDb = client.db("indexing2");
    const result = await createdDb.dropDatabase();
    console.log(
      result === true ? "Dropped db" : "Something went wrong with the drop"
    );
  } catch (e) {
    console.error(e);
  }
};

const insertSampleDocuments = async (docs) => {
  try {
    await client.connect();
    const collection = client.db("indexing2").collection("users");
    const result = await collection.insertMany(docs);
    console.log(result);
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
};

dropDatabase();
insertSampleDocuments(userDocs);
