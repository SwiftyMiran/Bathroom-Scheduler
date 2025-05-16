// Load environment variables from .env file
require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");

const port = process.env.PORT || 1530;

// Middleware
app.use(
  cors({
    origin: true, // Reflects the request origin, suitable for local network development
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    optionsSuccessStatus: 200,
  })
);
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "public")));

// Middleware to save the IP address of each request
app.use((req, res, next) => {
  req.requestIp =
    req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;
  next();
});

// Middleware to clean up old reservations (older than 7 days)
app.use(async (req, res, next) => {
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  await Reservation.deleteMany({ endTime: { $lt: oneWeekAgo } });
  next();
});

// MongoDB Connection - Using MongoDB Atlas cloud database
const db_password = process.env.DB_PASSWORD || "HMSprojekt"; // For better security, use environment variable

const mongoURI = `mongodb+srv://HMSprojekt:${db_password}@cluster0.dluxwle.mongodb.net/bathroom-scheduler?retryWrites=true&w=majority&appName=Cluster0`;

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB Atlas successfully");
  })
  .catch((err) => {
    console.error("MongoDB Atlas connection failed:", err.message);
    process.exit(1);
  });

// Create Schema for bathroom reservations
const reservationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  reason: { type: String },
  createdAt: { type: Date, default: Date.now },
  ip: { type: String }, // Save the IP address
});

// Create Model
const Reservation = mongoose.model("Reservation", reservationSchema);

// API Routes
// Get all reservations
app.get("/api/reservations", async (req, res) => {
  try {
    const reservations = await Reservation.find().sort({ startTime: 1 });
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new reservation
app.post("/api/reservations", async (req, res) => {
  try {
    const { name, startTime, endTime, reason } = req.body;
    const start = new Date(startTime);
    const end = new Date(endTime);
    const now = new Date();
    // Prevent reservation in the past
    if (start < now) {
      return res.status(400).json({ error: "Cannot reserve for a past time." });
    }
    // Enforce max 15 minutes
    if ((end - start) / (1000 * 60) > 15) {
      return res
        .status(400)
        .json({ error: "Reservation cannot exceed 15 minutes." });
    }
    // Check for overlapping reservations
    const overlapping = await Reservation.findOne({
      $or: [
        { startTime: { $lt: end }, endTime: { $gt: start } },
        { startTime: { $eq: start } },
        { endTime: { $eq: end } },
      ],
    });

    if (overlapping) {
      return res
        .status(400)
        .json({ error: "This time slot is already reserved" });
    }

    const newReservation = new Reservation({
      name,
      startTime: start,
      endTime: end,
      reason,
      ip: req.requestIp, // Save the requester's IP
    });

    await newReservation.save();
    res.status(201).json(newReservation);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get a specific reservation
app.get("/api/reservations/:id", async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ error: "Reservation not found" });
    }
    res.json(reservation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a reservation
app.put("/api/reservations/:id", async (req, res) => {
  try {
    const { name, startTime, endTime, reason } = req.body;

    // Check for overlapping reservations (excluding this one)
    const overlapping = await Reservation.findOne({
      _id: { $ne: req.params.id },
      $or: [
        { startTime: { $lt: endTime }, endTime: { $gt: startTime } },
        { startTime: { $eq: startTime } },
        { endTime: { $eq: endTime } },
      ],
    });

    if (overlapping) {
      return res
        .status(400)
        .json({ error: "This time slot is already reserved" });
    }

    const updatedReservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      { name, startTime, endTime, reason },
      { new: true, runValidators: true }
    );

    if (!updatedReservation) {
      return res.status(404).json({ error: "Reservation not found" });
    }

    res.json(updatedReservation);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a reservation
app.delete("/api/reservations/:id", async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ error: "Reservation not found" });
    }
    // Check if the IP matches
    if (reservation.ip !== req.requestIp) {
      return res.status(403).json({
        error:
          "You are not allowed to delete this reservation from this device.",
      });
    }
    await Reservation.findByIdAndDelete(req.params.id);
    res.json({ message: "Reservation deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start the server
app.listen(port, "0.0.0.0", () => {
  console.log(`Bathroom Scheduler API running on http://localhost:${port}`);
  console.log(
    "Accessible on your local network at http://" +
      require("os")
        .networkInterfaces()
        ["en0"]?.find((i) => i.family === "IPv4")?.address +
      ":" +
      port
  );
});
