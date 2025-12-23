const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5002;

// Only requests from this address are accepted
const allowedOrigins = process.env.CLIENT_URL 
  ? process.env.CLIENT_URL.split(",").map(url => url.trim()) 
  : [];

// MIDDLEWARE
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.error(`Blocked by CORS: ${origin}`); 
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
// Increase payload size limit
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// MONGODB.
mongoose
  .connect(process.env.MONGODB_URI)

  .then(() => console.log("Yayyyy hi mongodb wooo"))
  .catch((err) => console.error("AHHHhhhhh something went wrong boooo ", err));

// We test the routes in this household!@!!!!!!!!
app.get("/", (req, res) => {
  res.json({ message: "WE HAVE A BACKEND FOLKS!!!!!!!!!" });
});

// API ROUTES TBD
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/quests", require("./routes/quests"));
app.use("/api/feedback", require("./routes/feedback"));

//error handeling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ message: "boooooooo somethings wrong", error: err.message });
});

app.use('/uploads', express.static('uploads'));


// 404
app.use((req, res) => {
  res.status(404).json({ message: "BOO 404" });
});
app.listen(PORT, () => {
  console.log(`server up and runnnnninggggggggggggg on ${PORT}`);
});


module.exports = app;
