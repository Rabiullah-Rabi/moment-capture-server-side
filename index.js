const express = require("express");
const app = express();
app.use(express.json());
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require('mongodb');
app.use(cors());
require("dotenv").config();
const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("api is running");
});

//mongDB configuration
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.o9ekdiy.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    const serviceCollection = client
      .db("moment-capture")
      .collection("services");
    app.get("/services", async (req, res) => {
      const cursor = serviceCollection.find({});
      const services = await cursor.toArray();
      res.send({services });
    });
  } finally {
  }
}
run();

app.listen(port, () => {
  console.log("server is running on port", port);
});
