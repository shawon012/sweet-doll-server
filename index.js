const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lczeaqj.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
async function run() {
    try {
      // Connect the client to the server	(optional starting in v4.7)
      await client.connect();

      const productCollection = client.db('sweetDoll').collection('products')
      const myProductCollection = client.db('sweetDoll').collection('myProducts')

        // all products
      app.get('/products', async(req, res) =>{
        const cursor = productCollection.find();
        const result = await cursor.toArray();
        res.send(result)
      })

    //   single product
    app.get('/products/:id', async(req, res) =>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const options = {
            projection: {toyName:1, sellerName:1, sellerEmail:1, price:1, rating:1, availableQuantity:1, detailDescription:1}
        }
        const result = await productCollection.findOne(query, options)
        res.send(result)
    })

    // post method on products
    app.post('/products', async(req, res) =>{
        const product = req.body;
        const result = await productCollection.insertOne(product);
        res.send(result);
    })

    // update one product
    app.put('/products/:id', async(req, res) =>{
        const id = req.params.id;
        const filter = {_id: new ObjectId(id)}
        const options = {upsert: true};
        const updatedProduct = req.body;
        const product ={
            $set: {
                toyName:updatedProduct.toyName, 
                sellerName:updatedProduct.sellerName, 
                sellerEmail:updatedProduct.sellerEmail, 
                price:updatedProduct.price, 
                rating:updatedProduct.rating, 
                availableQuantity:updatedProduct.availableQuantity, 
                detailDescription:updatedProduct.detailDescription
            }
        }
        const result = await productCollection.updateOne(filter, product, options)
        res.send(result)
    })

    

      // Send a ping to confirm a successful connection
      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
      // Ensures that the client will close when you finish/error
    //   await client.close();
    }
  }
  run().catch(console.dir);

  app.get('/', (req, res) =>{
    res.send('My DoooL Shop will open soon')
  })

  app.listen(port, () =>{
    console.log('Shop will open soon')
  })