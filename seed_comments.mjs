import { MongoClient } from "mongodb";

// connection string env
import "dotenv/config";
const uri = process.env.MDB_URI;

const client = new MongoClient(uri);
const userDocs = [
  {
    dob: new Date("1987"),
    username: "jmac",
    isActive: false,
    score: 800,
  },
  {
    dob: new Date("1988"),
    username: "exampleUser",
    isActive: true,
    score: 700,
  },
  {
    dob: new Date("1989"),
    username: "coolperson",
    isActive: true,
    score: 998,
  },
  {
    dob: new Date("1990"),
    username: "randomGuy",
    isActive: true,
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
