const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

app.use(express.json());

// Routes
const authRoute = require('./routes/authRoute');
const statusRoute = require('./routes/statusRoute');
const routeRoutes = require("./routes/routeRoutes");

app.use("/api/route", routeRoutes);
app.use('/api/auth', authRoute);
app.use('/api/status', statusRoute);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
  .catch(err => console.error(err));