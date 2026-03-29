/*
const express = require("express");
const Razorpay = require("razorpay");

const app = express();
app.use(express.json());

// Razorpay instance
const razorpay = new Razorpay({
  key_id: "rzp_live_SWEsQPmLnQN0Ha",
  key_secret: "4J4RxWVSWpoeNd30Pk5PhU43",
});

// Test route (fixes "Cannot GET /")
app.get("/", (req, res) => {
  res.send("Server is running");
});

app.use(express.static("public"));

// 👉 STEP 2: Create Order API
app.get("/create-order", async (req, res) => {
  try {
    const options = {
      amount: 1000, // ₹10 (in paise)
      currency: "INR",
      receipt: "receipt_1",
    };

    const order = await razorpay.orders.create(options);
    res.json(order);

  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating order");
  }
});

// Start server
const PORT = process.env.PORT || process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const path = require("path");

app.use(express.static(path.join(__dirname, "index.html")));

app.post("/webhook", express.json(), (req, res) => {
  const event = req.body;

  if (event.event === "payment.captured") {
    console.log("✅ Payment Successful");

    // 👉 NEXT: trigger ESP32 here
  }

  res.sendStatus(200);
});

*/
const express = require("express");
const Razorpay = require("razorpay");

const app = express();
app.use(express.json());

// 👉 THIS LINE IS THE FIX
app.use(express.static("public"));

const razorpay = new Razorpay({
  key_id: "rzp_live_SWEsQPmLnQN0Ha",
  key_secret: "4J4RxWVSWpoeNd30Pk5PhU43",
});

// Create order
app.get("/create-order", async (req, res) => {
  const order = await razorpay.orders.create({
    amount: 1000,
    currency: "INR",
    receipt: "receipt_1",
  });

  res.json(order);
});

const PORT = process.env.PORT || process.env.PORT;
app.listen(PORT, () => console.log("Server running"));
