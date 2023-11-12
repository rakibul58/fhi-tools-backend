const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = process.env.mongoDB_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function connectToMongoDB() {
  try {
      await client.connect();
      console.log('Connected to MongoDB Atlas');
  } catch (error) {
      console.error('Error connecting to MongoDB Atlas:', error);
  }
}

connectToMongoDB();

module.exports = client;
