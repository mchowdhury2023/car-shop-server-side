const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.psdu9fg.mongodb.net/?retryWrites=true&w=majority`;

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
       // await client.connect();

        const productCollection = client.db('BrandShopDB').collection('products');

        //testimonial collection
        const testimonialCollection = client.db('BrandShopDB').collection('testimonials');


        // Get unique brands
        app.get('/brands', async (req, res) => {
            const cursor = productCollection.aggregate([
                {
                    $group: {
                        _id: "$brandName",
                        photo: { $first: "$photo" } 
                    }
                }
            ]);
            const result = await cursor.toArray();
            res.send(result);
        });

        //get all products of a specific brand
        app.get('/products/byBrand/:brandName', async (req, res) => {
            const brand = req.params.brandName;
            const query = { brandName: brand };
            const products = await productCollection.find(query).toArray();
            res.send(products);
        });
        


        app.get('/products', async (req, res) => {
            const cursor = productCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        //get top five products
        app.get('/top5products', async (req, res) => {
            const limit = Number(req.query.limit) || 0;
            const cursor = productCollection.find().sort({price: -1}).limit(limit); // sort in descending order of price
            const result = await cursor.toArray();
            res.send(result);
        });

        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await productCollection.findOne(query);
            res.send(result);
        })

        app.put('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updatedProduct = req.body;
            const product = {
                $set: {
                    brandName: updatedProduct.brandName,
                    modelName: updatedProduct.modelName,
                    year: updatedProduct.year,
                    type: updatedProduct.type,
                    price: updatedProduct.price,
                    rating: updatedProduct.rating,
                    details: updatedProduct.details,
                    photo: updatedProduct.photo
                }
            }
            const result = await productCollection.updateOne(query, product, options);
            res.send(result);
        })

        app.post('/products', async (req, res) => {
            const newProduct = req.body;
            console.log(newProduct);
            const result = await productCollection.insertOne(newProduct);
            res.send(result);
        })

        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await productCollection.deleteOne(query);
            res.send(result);
        })

        //get all testimonials
        app.get('/testimonials', async (req, res) => {
            const cursor = testimonialCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        });
    
        //post all testimonial

        app.post('/testimonials', async (req, res) => {
            const newTestimonial = req.body;
            const result = await testimonialCollection.insertOne(newTestimonial);
            res.send(result);
        });

        //cart collection
        const cartCollection = client.db('BrandShopDB').collection('carts');
        
        //get all cart products
        app.get('/cart', async (req, res) => {
            const cursor = cartCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        });
    
        //post all products to cart

        app.post('/cart', async (req, res) => {
            const newTestimonial = req.body;
            const result = await cartCollection.insertOne(newTestimonial);
            res.send(result);
        });

        app.delete('/cart/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await cartCollection.deleteOne(query);
            res.send(result);
        })


        // Send a ping to confirm a successful connection
       // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");


    } finally {
        // Ensures that the client will close when you finish/error
        //await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('brand Shop server is running');
})

app.listen(port, () => {
    console.log(`Brand Shop Server is running on port: ${port}`);
})