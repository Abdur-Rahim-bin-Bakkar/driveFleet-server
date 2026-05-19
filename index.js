const dns = require("node:dns")
dns.setServers(["1.1.1.1", "8.8.8.8"]);
require("dotenv").config()

const express = require('express')
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

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
        const bookingsCollection = cardb.collection('bookingscollection')


        await client.db("admin").command({ ping: 1 });
        console.log('pink the deployment')

        //all cars
        app.get('/all-cars', async (req, res) => {
            const result = await carCollection.find().toArray()
            res.send(result)
            // console.log(result, 'this is result')
        })
        //available cars
        app.get('/available-cars', async (req, res) => {
            const result = await carCollection.find({ availabilityStatus: 'Available' }).limit(6).toArray()
            res.send(result)
            console.log(result, 'this is result')
        })
        //details
        app.get('/car/:id', async (req, res) => {
            const id = req.params.id;
            const result = await carCollection.findOne({ _id: new ObjectId(id) })
            console.log(result)
            res.send(result)

        })

        //post booking cars
        app.post('/bookings', async (req, res) => {
            const carData = req.body;
            const result = await bookingsCollection.insertOne(carData)
            console.log(result, 'post result')
            res.send(result)

        })
        //get booking cars
        // app.get('/bookings/:userId', async (req, res) => {
        //     const result = await bookingsCollection.find(req.params.userId)
        //     console.log(result)
        //     res.send(req)
        // })
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