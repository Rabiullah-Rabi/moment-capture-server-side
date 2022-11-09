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
      const services = await cursor.sort({inserted_date: -1}).toArray();
      res.send({ services });
    });
    //Serve 3 for home services
    app.get("/servicesHome", async (req, res) => {
      const cursor = serviceCollection.find({});
      const services = await cursor.sort({inserted_date: -1}).limit(3).toArray();
      res.send({ services });
    });
    //Serve service details
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const service = await serviceCollection.findOne({ _id: ObjectId(id)});
      res.send({ service });
    });

    //api for ADD a Service
    app.post("/services", async (req, res) => {
      const service = req.body;
      const result = await serviceCollection.insertOne(service);
      res.send(result);
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
      const result = await cursor.sort({review_date: -1}).toArray();
      res.send(result);
    });
    //serve a review
    app.get("/review/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const review = await reviewCollection.findOne(query);
      res.send(review);
    });
    //reviews of a  Service
    app.get("/reviews/:id", async (req, res) => {
      const id = req.params.id;
      const cursor = reviewCollection.find({ service: id });
      const result = await cursor.sort({review_date: -1}).toArray();
      res.send(result);
    });
    //reviews of a  user
    app.get("/reviewsbyuser/:id", async (req, res) => {
      const id = req.params.id;
      const cursor = reviewCollection.find({ userId: id });
      const result = await cursor.sort({review_date: -1}).toArray();
      res.send(result);
    });
    //Delete review by user
    app.delete("/reviews/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await reviewCollection.deleteOne(query);
      res.send(result);
    });
    //Update review by user
    app.patch("/reviews/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const review = req.body;
      const updatedReview = {
        $set: {
          reviewMessage: review.reviewMessage,
          rating: review.rating,
        },
      };
      const result = await reviewCollection.updateOne(query, updatedReview);
      res.send(result);
    });
  } finally {
  }
}
run();

app.listen(port, () => {
  console.log("server is running on port", port);
});
