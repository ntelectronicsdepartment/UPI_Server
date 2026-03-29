const express = require("express");
const app = express();

app.use(express.json());

// ?? Store payment status (temporary, in-memory)
let paymentStatus = {};

// ?? Webhook endpoint (from Razorpay / Cashfree)
app.post("/webhook", (req, res) => {
    const data = req.body;

    console.log("Webhook received:", data);

    // Example condition (depends on gateway format)
    if (data.status === "paid" || data.event === "payment.captured") {
        const machine_id = "ATM01"; // you can map using order_id

        paymentStatus[machine_id] = true;
        console.log("Payment marked SUCCESS");
    }

    res.sendStatus(200);
});

// ?? ESP32 will call this
app.get("/check_payment", (req, res) => {
    const machine_id = req.query.machine_id;

    if (paymentStatus[machine_id]) {
        // reset after use
        paymentStatus[machine_id] = false;

        return res.json({
            payment: true
        });
    }

    res.json({
        payment: false
    });
});

const Razorpay = require("razorpay");

const razorpay = new Razorpay({
  key_id: "rzp_live_SWEsQPmLnQN0Ha",
  key_secret: "4J4RxWVSWpoeNd30Pk5PhU43",
});

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

// ?? Start server
const PORT = process.env.PORT || process.env.PORT;

app.listen(PORT, () => {
    console.log("Server running on port", PORT);
});

app.get("/", (req, res) => {
  res.send(`
    <h1>Medical Dispensing Machine</h1>
    <p>Server is running successfully ✅</p>
  `);
});
