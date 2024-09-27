import express from "express";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { stringToHash, varifyHash } from "bcrypt-inzi";

const SECRET = process.env.SECRET || "topsecret";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: 'http://localhost:5173', // Allow requests from your frontend
  credentials: true // Allow cookies to be sent with requests
}));

// app.use(cors());

const port = process.env.PORT || 5001;
const mongoURI = process.env.MONGODB_URI;

let productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: Number,
  category: String,
  description: String,
  createdOn: { type: Date, default: Date.now },
});
const productModel = mongoose.model("products", productSchema);

const userSchema = new mongoose.Schema({
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String, required: true },
  password: { type: String, required: true },

  createdOn: { type: Date, default: Date.now },
});
const userModel = mongoose.model("Users", userSchema);

app.post("/signup", async (req, res) => {
  let body = req.body;

  if (!body.firstName || !body.lastName || !body.email || !body.password) {
    return res.status(400).send({
      message: `Required fields missing, request example: 
                {
                    "firstName": "John",
                    "lastName": "Doe",
                    "email": "abc@abc.com",
                    "password": "12345"
                }`,
    });
  }

  req.body.email = req.body.email.toLowerCase();

  try {
    // Check if user already exists
    const user = await userModel.findOne({ email: body.email });
    
    if (user) {
      return res.status(400).send({
        message: "User already exists, please try a different email",
      });
    }

    // If user doesn't exist, hash password and create the user
    const hashString = await stringToHash(body.password);
    const newUser = await userModel.create({
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      password: hashString,
    });

    return res.status(201).send({ message: "User is created" });
  } catch (err) {
    console.log("Error: ", err);
    return res.status(500).send({ message: "Internal server error" });
  }
});


app.post("/login", async (req, res) => {
  const body = req.body;
  body.email = body.email.toLowerCase();

  if (!body.email || !body.password) {
    // Null check - undefined, "", 0, false, null, NaN
    return res.status(400).send(
      `Required fields missing, request example: 
                {
                    "email": "abc@abc.com",
                    "password": "12345"
                }`
    );
  }

  try {
    // Check if user exists
    const data = await userModel.findOne(
      { email: body.email },
      "firstName lastName email password"
    );

    console.log("data: ", data);

    if (data) {
      // User found
      const isMatched = await varifyHash(body.password, data.password);
      console.log("isMatched: ", isMatched);

      if (isMatched) {
        const token = jwt.sign(
          {
            _id: data._id,
            email: data.email,
            iat: Math.floor(Date.now() / 1000) - 30,
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
          },
          SECRET
        );

        console.log("token: ", token);

        res.cookie("Token", token, {
          maxAge: 86_400_000,
          httpOnly: true,
          // sameSite: true,
          // secure: true,
        });

        return res.send({
          message: "Login successful",
          profile: {
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            age: data.age,
            _id: data._id,
          },
        });
      } else {
        console.log("Password did not match");
        return res.status(401).send({ message: "Incorrect email or password" });
      }
    } else {
      // User does not exist
      console.log("User not found");
      return res.status(401).send({ message: "Incorrect email or password" });
    }
  } catch (err) {
    console.log("DB error: ", err);
    return res.status(500).send({ message: "Login failed, please try later" });
  }
});



app.post("/logout", (req, res) => {

    res.cookie('Token', '', {
        maxAge: 1,
        httpOnly: true
    });

    res.send({ message: "Logout successful" });
})


//                                  commented middleware
// app.use((req, res, next) => {
//   let token = req.cookies.Token;
//   console.log("token: ", token);

//   if (token) {
//     jwt.verify(token, SECRET, (err, decoded) => {
//       if (!err) {
//         console.log("decoded: ", decoded);
//         next();
//       } else {
//         console.log("jwt verify error: ", err);
//         res.status(401).send({ message: "Unauthorized access" });
//       }
//     });
//   } else {
//     res.status(401).send({ message: "Unauthorized access" });
//   }
// });

// middleware to check token
app.use((req, res, next) => {

    console.log("req.cookies: ", req.cookies);

    if (!req?.cookies?.Token) {
        res.status(401).send({
            message: "include http-only credentials with every request"
        })
        return;
    }

    jwt.verify(req.cookies.Token, SECRET, function (err, decodedData) {
        if (!err) {

            console.log("decodedData: ", decodedData);

            const nowDate = new Date().getTime() / 1000;

            if (decodedData.exp < nowDate) {

                res.status(401);
                res.cookie('Token', '', {
                    maxAge: 1,
                    httpOnly: true
                });
                res.send({ message: "token expired" })

            } else {

                console.log("token approved");

                req.body.token = decodedData
                next();
            }
        } else {
            res.status(401).send("invalid token")
        }
    });
});

///////////////////////product///////////////////////

app.post("/product", async (req, res) => {
  const body = req.body;
  if (!body.name || !body.price || !body.category || !body.description) {
    res.status(400).send(`Required parameter missing. Example request body:
        {
            "name": "value",
            "price": "value",
            "category": "value",
            "description": "value"
        }`);
    return;
  }

  try {
    const saved = await productModel.create({
      name: body.name,
      price: body.price,
      category: body.category,
      description: body.description,
    });
    console.log(saved);
    res.send({
      message: "Your product is saved",
      data: saved,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: "Server error",
    });
  }
});

app.get("/products", async (req, res) => {
  try {
    const data = await productModel.find({}).sort({ _id: -1 }).exec();

    res.send({
      message: "Here is your product list",
      data: data,
    });
  } catch (e) {
    console.error(e);
    res.status(500).send({
      message: "Server error",
    });
  }
});

app.get("/product/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const data = await productModel.findOne({ _id: id }).exec();
    if (data) {
      res.send({
        message: "Here is your product",
        data: data,
      });
    } else {
      res.status(404).send({
        message: "Product not found",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: "Server error",
    });
  }
});

app.put("/product/:id", async (req, res) => {
  const id = req.params.id;
  const body = req.body;

  if (!body.name || !body.price || !body.category || !body.description) {
    res.status(400).send(`Required parameter missing. Example request body:
        {
            "name": "value",
            "price": "value",
            "category": "value",
            "description": "value"
        }`);
    return;
  }

  try {
    const data = await productModel
      .findByIdAndUpdate(
        id,
        {
          name: body.name,
          price: body.price,
          category: body.category,
          description: body.description,
        },
        { new: true }
      )
      .exec();

    console.log("Updated:", data);
    res.send({
      message: "Product is updated successfully",
      data: data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Server error",
    });
  }
});

app.delete("/products", async (req, res) => {
  try {
    await productModel.deleteMany({});
    res.send({
      message: "All Products have been deleted successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: "Server error",
    });
  }
});

app.delete("/product/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const deletedData = await productModel.deleteOne({ _id: id }).exec();
    console.log("Deleted:", deletedData);
    if (deletedData.deletedCount !== 0) {
      res.send({
        message: "Product has been deleted successfully",
      });
    } else {
      res.send({
        message: "No Product found with this id: " + id,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: "Server error",
    });
  }
});

app.put("/product/:id", async (req, res) => {
  const id = req.params.id;
  const body = req.body;

  if (!body.name || !body.price || !body.category || !body.description) {
    res.status(400).send(`Required parameter missing. Example request body:
        {
            "name": "value",
            "price": "value",
            "category": "value",
            "description": "value"
        }`);
    return;
  }

  try {
    const data = await productModel
      .findByIdAndUpdate(
        id,
        {
          name: body.name,
          price: body.price,
          category: body.category,
          description: body.description,
        },
        { new: true }
      )
      .exec();

    console.log("Updated:", data);
    res.send({
      message: "Product is updated successfully",
      data: data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Server error",
    });
  }
});

app.get("/weather", (req, res) => {
  console.log(`${req.ip} is asking for weather`);

  res.send({
    city: "Karachi",
    temp_c: 26,
    humidity: 72,
    max_temp_c: 31,
    min_temp_c: 19,
  });
});

const __dirname = path.resolve();

app.get("/", express.static(path.join(__dirname, "/web/dist/index.html")));
app.use("/", express.static(path.join(__dirname, "/web/dist")));
app.use("/", express.static(path.join(__dirname, "/web")));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

mongoose.connect(mongoURI);

// MongoDB connected/disconnected events
mongoose.connection.on("connected", () => {
  console.log("Mongoose is connected");
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose is disconnected");
  process.exit(1);
});

mongoose.connection.on("error", (err) => {
  console.log("Mongoose connection error:", err);
  process.exit(1);
});

process.on("SIGINT", () => {
  console.log("App is terminating");
  mongoose.connection.close(() => {
    console.log("Mongoose default connection closed");
    process.exit(0);
  });
});
