const dns = require("node:dns")
dns.setServers(["1.1.1.1", "8.8.8.8"]);
require("dotenv").config()

const express = require('express')
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { createRemoteJWKSet, jwtVerify } = require("jose-cjs");

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
const jwks = createRemoteJWKSet(
    new URL(`${process.env.CLIENT_URL}/api/auth/jwks`)
)
const verifyToken = async (req, res, next) => {
    const authHeader = req.headers.authorization
    if (!authHeader) {
        return res.status(401).json({ message: "Unauthorization" })
    }
    const token = authHeader.split(" ")[1]
    console.log(token, 'uporer token')
    if (!token) {
        return res.status(401).json({ message: "Unauthorization" })
    }
    try {

        const { payload } = await jwtVerify(token, jwks)
        next()
    }
    catch (error) {
           return res.status(401).json({ message: "Unauthorization" })
    }
}

const run = async () => {
    try {

        // await client.connect();

        const cardb = client.db('cardb')
        const carCollection = cardb.collection('carcollection')
        const bookingsCollection = cardb.collection('bookingscollection')


        // await client.db("admin").command({ ping: 1 });
        // console.log('pink the deployment')

        //all cars
        app.get('/all-cars', async (req, res) => {

            const search = req.query.search || "";
            const carType = req.query.carType || "";
            // console.log(search,'this is search')

            let query = {};

            // ✅ Search by car name
            if (search) {
                query.carName = {
                    $regex: search,
                    $options: "i"
                };
            }

            // ✅ Filter by car type
            if (carType) {
                query.carType = {
                    $in: [carType]
                };
            }

            const result = await carCollection.find(query).toArray();
            // console.log(result,'etai khujchilam')

            res.send(result);
        });
        //available cars
        app.get('/available-cars', async (req, res) => {
            const result = await carCollection.find({ availabilityStatus: 'Available' }).limit(6).toArray()
            res.send(result)
            // console.log(result, 'this is result')
        })
        //details
        app.get('/car/:id',verifyToken, async (req, res) => {
            const id = req.params.id;
            const result = await carCollection.findOne({ _id: new ObjectId(id) })
            // con/sole.log(result)
            res.send(result)

        })

        //post booking cars
        app.post('/bookings', async (req, res) => {

            const carData = req.body;

            // save booking data
            const result = await bookingsCollection.insertOne(carData)

            // console.log(result, 'post result')

            // update or create bookUser field
            await carCollection.updateOne(
                {
                    _id: new ObjectId(carData.carId)
                },
                {
                    $inc: {
                        bookUser: 1
                    }
                },
                {
                    upsert: false
                }
            )

            res.send({
                success: true,
                result
            })

        })






        app.patch('/bookings/:id', async (req, res) => {

            const carId = req.params.id



            const result = await carCollection.updateOne(
                { _id: new ObjectId(carId) },
                {
                    $inc: {
                        bookUser: 1
                    }
                }
            )

            res.send({
                success: true,
                message: "Book count updated",
                result
            })


        })





        // get booking cars
        app.get('/bookings/:userId', verifyToken, async (req, res) => {
            const userId = await req.params.userId
            console.log(req.headers.authorization, 'ki ')
            const result = await bookingsCollection.find({ userId: userId }).toArray()
            // console.log(result)
            res.send(result)
        })



        app.post('/add-car', async (req, res) => {
            const carData = req.body;
            const result = await carCollection.insertOne(carData)
            console.log(result)
            res.send(result)
        })
        app.get('/add-car/:userId',verifyToken, async (req, res) => {
            const userId = req.params.userId
            const result = await carCollection.find({ userId: userId }).toArray()
            res.send(result)
        })
        app.patch('/add-car/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            console.log(query)
            const result = await carCollection.updateOne(query, {
                $set: {
                    imageURL: req.body.imageURL,
                    availabilityStatus: req.body.availabilityStatus,
                    pickupLocation: req.body.pickupLocation,
                    description: req.body.description,
                    carType: req.body.carType,
                    dailyRentPrice: req.body.dailyRentPrice


                }
            })
            res.send(result)
            console.log(result, 'this is my rsulsf safhas fsf as')
        })


        app.delete('/add-car/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = carCollection.deleteOne(query)
            res.send({ message: 'delete successfully' })
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