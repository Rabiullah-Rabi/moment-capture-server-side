const express = require("express");
const app = express();
app.use(express.json());
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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
    const reviewCollection = client.db("moment-capture").collection("reviews");

    //Serve all services
    app.get("/services", async (req, res) => {
      const cursor = serviceCollection.find({});
      const services = await cursor.toArray();
      res.send({ services });
    });
    //Serve 3 for home services
    app.get("/servicesHome", async (req, res) => {
      const cursor = serviceCollection.find({});
      const services = await cursor.limit(3).toArray();
      res.send({ services });
    });
    //Serve service details
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const service = await serviceCollection.findOne({ _id: ObjectId(id) });
      res.send({ service });
    });

    //api for post review
    app.post("/review", async (req, res) => {
      const review = req.body;
      const result = await reviewCollection.insertOne(review);
      res.send(result);
    });
    //Serve all reviews
    app.get("/reviews", async (req, res) => {
      const cursor = reviewCollection.find({});
      const result = await cursor.toArray();
      res.send(result);
    });
    //review of a  Service 
    app.get('/reviews/:id', async (req, res) => { 
      const id = req.params.id;
      const cursor = reviewCollection.find({ service: id });
      const result = await cursor.toArray();
      res.send(result);
    })
  } finally {
  }
}
run();

app.listen(port, () => {
  console.log("server is running on port", port);
});
