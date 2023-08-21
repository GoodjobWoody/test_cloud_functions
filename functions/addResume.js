// Dependencies
const { onRequest } = require("firebase-functions/v2/https");
const { getFirestore } = require("firebase-admin/firestore");

// The addResume Cloud Function
const addResume = async (req, res) => {
  // Check for HTTP POST method
  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
    return;
  }

  // Grab the text parameter from the request body for POST
  const original = req.body;

  try {
    // Push the new message into Firestore using the Firebase Admin SDK.
    const writeResult = await getFirestore()
      .collection("resume")
      .add({ original: original });

    // Send back a message that we've successfully written the message
    res.json({ result: `Resume with ID: ${writeResult.id} added.` });
  } catch (error) {
    // Handle any errors that occurred during Firestore interaction
    res.status(500).send("Error adding resume to Firestore.");
  }
};

// Export the function
module.exports = addResume;
