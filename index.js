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
const fileUpload = require('express-fileupload')

// database
const connectDB = require("./db");

// routers imports
const authRouter = require('./routes/auth')
const userRouter = require('./routes/userRoutes')
const productRouter = require('./routes/productRoutes')

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
app.use(express.static('./public'))
app.use(fileUpload())

// route
app.get("/", (req, res) => {
  res.send("e-commerce-api");
});

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/user', userRouter)
app.use('/api/v1/product', productRouter)

{
  /**MIDDLEWARE */
}

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

{
  /**APP SERVER */
}

const port = process.env.PORT || 8000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, console.log(`Server is listening on port ${port}...`));
  } catch (error) {
    console.log("start error :", error);
  }
};

start();
