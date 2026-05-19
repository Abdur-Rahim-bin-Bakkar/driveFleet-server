const dns = require("node:dns")
dns.setServers(["1.1.1.1", "8.8.8.8"]);
require("dotenv").config()

const express = require('express')
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express()
const port = process.env.PORT || 5000;

app.use(express.json())
app.use(cors())

const uri = process.env.MONGO_DB_URI;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const run = async () => {
    try {

        await client.connect();

        const cardb = client.db('cardb')
        const carCollection = cardb.collection('carcollection')


        await client.db("admin").command({ ping: 1 });
        console.log('pink the deployment')

        app.get('/all-cars', async (req, res) => {
            const result = await carCollection.find().toArray()
            res.send(result)
            console.log(result, 'this is result')
        })
        app.get('/available-cars', async (req, res) => {
            const result = await carCollection.find({availabilityStatus:'Available'}).limit(6).toArray()
            res.send(result)
            console.log(result, 'this is result')
        })
    }
    finally {
        // client.close()
    }

}
run().catch(console.dir)


app.get('/', (req, res) => {
    res.send('hi')
})






app.listen(port, () => {
    console.log(`server is running or port${port}`)
})