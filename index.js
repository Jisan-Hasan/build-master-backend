const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;

const cors = require("cors");

// middleware
app.use(cors());
app.use(express.json());

// mongodb connection
const uri = process.env.mongo_uri;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
});

// all api here
const run = async () => {
    try {
        const db = client.db("build-master");
        const categoryCollection = db.collection("category");
        const productCollection = db.collection("product");

        // get product by category
        app.get("/products/:category", async (req, res) => {
            const { category } = req.params;

            const products = await productCollection
                .find({ category })
                .toArray();

            res.send(products);
        });

        // get all category
        app.get("/category", async (req, res) => {
            const categories = await categoryCollection.find({}).toArray();
            res.send(categories);
        });

        // get all products
        app.get("/products", async (req, res) => {
            const products = await productCollection.find({}).toArray();
            res.send(products);
        });

        // get single product by id
        app.get("/product/:id", async (req, res) => {
            const { id } = req.params;
            const product = await productCollection.findOne({
                _id: new ObjectId(id),
            });
            res.send(product);
        });

        // get featured product
        app.get("/featuredProducts", async (req, res) => {
            const featuredProduct = await productCollection
                .find({ isFeatured: true })
                .toArray();
            res.send(featuredProduct);
        });

        // get featured product
        app.get("/featuredCategories", async (req, res) => {
            const featuredCategories = await categoryCollection
                .find({ isFeatured: true })
                .toArray();
            res.send(featuredCategories);
        });
    } finally {
    }
};

run().catch((err) => console.log(err));

app.get("/", (req, res) => {
    res.send("Hello");
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
