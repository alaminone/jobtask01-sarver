const express = require('express')
const app = express()
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());
// jobtask01
// IJSXFWBw5kECklbe



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ufduuil.mongodb.net/?retryWrites=true&w=majority`;

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

    const taskDatabase = client.db('taskDB');
    const taskCollection = taskDatabase.collection('per-task');
    const userCollection = taskDatabase.collection('login-user');

    /**
     * ! get method
     */

    app.get('/tasks/:email', async (request, response) => {
      const email = request.params.email;
      const query = { loggedInUserEmail: email };
      const result = await taskCollection.find(query).toArray();
      response.status(200).send(result);
    });

    app.get('/tasks/item/:id', async (request, response) => {
      const id = request.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await taskCollection.findOne(query);
      response.status(200).send(result);
    });

    app.get('/ongoing', async (request, response) => {
      const result = await taskCollection.find({ status: 'ongoing' }).toArray();
      response.status(200).send(result);
    });

    app.get('/created', async (request, response) => {
      const result = await taskCollection.find({ status: 'created' }).toArray();
      response.status(200).send(result);
    });

    app.get('/completed', async (request, response) => {
      const result = await taskCollection
        .find({ status: 'completed' })
        .toArray();
      response.status(200).send(result);
    });

    app.get('/users', async (request, response) => {
      const result = await userCollection.find().toArray();
      response.status(200).send(result);
    });

    app.get('/users/per/:email', async (request, response) => {
      const email = request.params.email;
      const query = { email: email };
      const result = await userCollection.findOne(query);
      response.status(200).send(result);
    });

    /**
     * ! post method
     */
    app.post('/tasks', async (request, response) => {
      const task = request.body;
      const result = await taskCollection.insertOne(task);
      response.status(200).send(result);
    });

    app.post('/users', async (request, response) => {
      const users = request.body;
      const result = await userCollection.insertOne(users);
      response.status(200).send(result);
    });

    /**
     * ! patch method
     */

    app.patch('/tasks/:id', async (request, response) => {
      const id = request.params.id;
      const query = { _id: new ObjectId(id) };
      const updatedDoc = {
        $set: { status: request.body.status },
      };
      const result = await taskCollection.updateOne(query, updatedDoc);
      response.status(200).send(result);
    });

    /**
     * ! delete method
     */

    app.delete('/tasks/:id', async (request, response) => {
      const id = request.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await taskCollection.deleteOne(query);
      response.status(200).send(result);
    });
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('successfully connected')
})

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
