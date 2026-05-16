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
//Working code with payment button 
/*
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

app.get("/create-order", async (req, res) => {
  try {
    const order = await razorpay.orders.create({
      amount: currentAmount, // 👈 dynamic
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    });

    res.json(order);

  } catch (err) {
    console.error(err);
    res.status(500).send("Error");
  }
});
*/
////////////////////////////////working best
// //Daynamic Payment on website through ESP32 
// const express = require("express");
// const Razorpay = require("razorpay");

// const app = express();

// app.use(express.json());
// app.use(express.static("public"));

// let currentAmount = 0;

// // ✅ ONLY ONE set-amount route
// app.post("/set-amount", (req, res) => {
//   const { amount } = req.body;

//   if (!amount) {
//     return res.status(400).send("Amount missing");
//   }

//   currentAmount = amount;

//   console.log("Amount set by ESP32:", currentAmount);
//   res.send("OK");
// });

// // ✅ ADD THIS (VERY IMPORTANT)
// app.get("/get-amount", (req, res) => {
//   res.json({ amount: currentAmount });
// });

// const razorpay = new Razorpay({
//   key_id: "rzp_live_SWEsQPmLnQN0Ha",
//   key_secret: "4J4RxWVSWpoeNd30Pk5PhU43",
// });

// // ✅ Create order
// app.get("/create-order", async (req, res) => {
//   console.log("Using amount:", currentAmount);

//   const order = await razorpay.orders.create({
//     amount: currentAmount,
//     currency: "INR",
//     receipt: "receipt_" + Date.now(),
//   });

//   res.json(order);
// });

// app.listen(process.env.PORT || 3000, () =>
//   console.log("Server running")
// );

// Dynamic Payment on website through ESP32

const express = require("express");
const Razorpay = require("razorpay");

const app = express();

app.use(express.json());
app.use(express.static("public"));

// =====================================================
// VARIABLES
// =====================================================
let currentAmount = 0;
let paymentStatus = "PENDING";

// =====================================================
// SET AMOUNT FROM ESP32
// =====================================================
app.post("/set-amount", (req, res) => {

  const { amount } = req.body;

  if (!amount) {
    return res.status(400).send("Amount missing");
  }

  currentAmount = amount;

  // Reset payment status whenever new amount comes
  paymentStatus = "PENDING";

  console.log("Amount set by ESP32:", currentAmount);

  res.send("OK");
});

// =====================================================
// GET CURRENT AMOUNT
// =====================================================
app.get("/get-amount", (req, res) => {

  res.json({
    amount: currentAmount
  });
});

// =====================================================
// PAYMENT STATUS API FOR ESP32
// =====================================================
app.get("/payment-status", (req, res) => {

  res.send(paymentStatus);
});

// =====================================================
// RESET AMOUNT API
// =====================================================
app.get("/reset-amount", (req, res) => {

  currentAmount = 0;
  paymentStatus = "PENDING";

  console.log("System Reset");

  res.send("RESET DONE");
});

// =====================================================
// RAZORPAY
// =====================================================
const razorpay = new Razorpay({
  key_id: "rzp_live_SWEsQPmLnQN0Ha",
  key_secret: "4J4RxWVSWpoeNd30Pk5PhU43",
});

// =====================================================
// CREATE ORDER
// =====================================================
app.get("/create-order", async (req, res) => {

  try {

    console.log("Using amount:", currentAmount);

    const order = await razorpay.orders.create({

      amount: currentAmount,
      currency: "INR",
      receipt: "receipt_" + Date.now(),

    });

    res.json(order);

  } catch (error) {

    console.log(error);

    res.status(500).send("Order creation failed");
  }
});

// =====================================================
// PAYMENT SUCCESS CALLBACK
// =====================================================
app.post("/payment-success", (req, res) => {

  paymentStatus = "PAID";

  console.log("PAYMENT SUCCESS");

  res.send("Payment Status Updated");
});

// =====================================================
// SERVER START
// =====================================================
app.listen(process.env.PORT || 3000, () => {

  console.log("Server running");
});
