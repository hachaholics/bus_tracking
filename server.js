const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require("cors");

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors())

// Routes
const authRoute = require('./routes/authRoute');
const statusRoute = require('./routes/statusRoute');
const routeRoutes = require("./routes/routeRoutes");
const chatBotRoute = require("./routes/chatBotRoute");

app.use("/api/chatbot", chatBotRoute); 


app.use("/api/route", routeRoutes);
app.use('/api/auth', authRoute);
app.use('/api/status', statusRoute);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// mongoose.connect(process.env.MONGO_URI)
//   .then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
//   .catch(err => console.error(err));