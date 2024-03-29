{
  /**IMPORT */
}

// core imports
require("dotenv").config();
require('express-async-errors')

// app imports
const express = require("express");
const app = express();
const morgan = require('morgan')
const cookieParser = require('cookie-parser')

// database
const connectDB = require("./db");

// routers imports
const authRouter = require('./routes/auth')

// middleware
const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require("./middleware/error-handler");

{
  /**ROUTES */
}
// configs
app.use(morgan('tiny'))
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET))

// route
app.get("/", (req, res) => {
  res.send("e-commerce-api");
});

app.use('/api/v1/auth', authRouter)

{
  /**MIDDLEWARE */
}

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

{
  /**APP SERVER */
}

const port = process.env.PORT || 7000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, console.log(`Server is listening on port ${port}...`));
  } catch (error) {
    console.log("start error :", error);
  }
};

start();
