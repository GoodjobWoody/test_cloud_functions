// Dependencies
const { onRequest } = require("firebase-functions/v2/https");
const { getFirestore } = require("firebase-admin/firestore");

// The getResume Cloud Function
const getResume = async (req, res) => {
  // Check for HTTP GET method
  if (req.method !== "GET") {
    res.status(405).send("Method Not Allowed");
    return;
  }

  // Grab the resumeId from the request query
  const id = req.query.resumeId;

  try {
    // Retrieve the resume from Firestore using the Firebase Admin SDK.
    const doc = await getFirestore().collection("resume").doc(id).get();

    // Check if the document exists
    if (!doc.exists) {
      res.status(404).send("Resume Not Found");
      return;
    }

    // Send back the retrieved resume data
    res.json(doc.data());
  } catch (error) {
    // Handle any errors that occurred during Firestore interaction
    res.status(500).send("Error retrieving resume from Firestore.");
  }
};

// Export the function
module.exports = getResume;
