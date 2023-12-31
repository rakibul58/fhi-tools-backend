const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
const errorHandler = require("./middleware/errorHandler");
const testRoutes = require("./routes/v1/test.route");
const organizationRoutes = require("./routes/v1/organization.route");


app.get('/', (req, res) => {
    res.send('Hello world')
})


app.use(cors());
app.use(express.json());
app.use(express.static('front'));
app.use(errorHandler);


// Attach your routes after the error handler
app.use("/api/v1/test", testRoutes);
app.use("/api/v1/organizations", organizationRoutes);


app.get("/", (req, res) => {
  res.send("Experiment Labs server is running");
});


app.all("*", (req, res) => {
  res.send("No route found.");
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});


process.on("unhandledRejection", (error) => {
  console.log(error.name, error.message);
  app.close(() => {
    process.exit(1);
  });
});