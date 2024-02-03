const  express =require ("express");
const connectToMongo =require ("./database.js");
connectToMongo();
const dotenv= require("dotenv") ;
const userRouter = require("./routes/userRoute.js");
const authRouter= require ("./routes/authRoute.js");
const  listingRouter= require ("./routes/listingRoute.js");

const cors = require('cors');




const app = express();
app.use(cors());
app.use(express.json());
const multer = require('multer')


app.listen(7000, () => {
  console.log("Server is runnig on port 7000!!!");
});

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);


app.use('/uploads', express.static('uploads'));
