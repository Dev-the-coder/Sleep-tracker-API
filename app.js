const express = require("express");
const bodyParser = require("body-parser");
const ExpressError = require("./util/exressError.js");

const PORT = 8000;
const app = express();

const sleepRoutes = require("./routes/sleep.route.js");

app.use(bodyParser.json());
app.use("/", sleepRoutes);

app.all("*", (req, res, next) => {
  next(new ExpressError("API not found !", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  return res.status(statusCode).json({ error: message });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;
