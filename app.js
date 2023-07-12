const express = require("express");
const app = express();
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
require("dotenv").config();
var cors = require('cors');
const cookieParser = require("cookie-parser");
const errorHandler = require("./middleware/error");

//import ROUTES
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const jobTypeRoutes = require("./routes/jobTypeRoutes");
const jobRoute = require('./routes/jobsRoutes');

//db
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(()=>console.log("DB CONNECTED"))
.catch((err)=>console.log(err));

//middleware
app.use(morgan('dev'));
app.use(bodyParser.json({ limit: "5mb" }));
app.use(bodyParser.urlencoded({
    limit: " 5mb ",
    extended: true
}));
app.use(cookieParser());
app.use(cors());

//ROUTES MIDDLEWARE
// app.get('/', (req, res)=>{
//     res.send("Hello From Node JS")
// })
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', jobTypeRoutes);
app.use('/api', jobRoute);

//error middleware (custom error)
app.use(errorHandler);

//port
const port = process.env.PORT || 8000

//connection
app.listen(port, ()=>{
    console.log(port) ;
});