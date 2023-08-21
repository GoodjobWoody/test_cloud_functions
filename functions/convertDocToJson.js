// Dependencies
const { onRequest } = require("firebase-functions/v2/https");
const { OpenAI } = require("openai");
require("dotenv").config();

// The convertDocToJson Cloud Function
const convertDocToJson = async (req, res) => {
  // Check for HTTP POST method
  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
    return;
  }

  const resumeContent = req.body;
  const jsonFormat = {
    name: "string",
    contact: {
      phone: "string",
      email: "string",
      location: "string",
      linkedin: "string",
    },
    highlights: ["string"],
    workExperience: [
      {
        company: "string",
        position: "string",
        location: "string",
        startDate: "string",
        endDate: "string",
        responsibilities: ["string"],
      },
    ],
    projectExperience: [
      {
        company: "string",
        position: "string",
        location: "string",
        startDate: "string",
        endDate: "string",
        responsibilities: ["string"],
      },
    ],
    education: [
      {
        university: "string",
        location: "string",
        degree: "string",
        startDate: "string",
        endDate: "string",
      },
    ],
    referencesAvailable: "boolean",
  };
  const promptResumeContentFormatToJson =
    "Convert the resume content to following Json format. " +
    JSON.stringify(jsonFormat);

  const openai = new OpenAI({
    apiKey: process.env["OPENAI_API_KEY"],
  });

  const inputMessage =
    "This is the resume content. " +
    JSON.stringify(resumeContent) +
    ". This is the target Json format. " +
    JSON.stringify(jsonFormat);

  try {
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: promptResumeContentFormatToJson },
        { role: "user", content: inputMessage },
      ],
      model: "gpt-3.5-turbo",
    });

    // Send back the response from OpenAI API
    res.json({ result: completion.choices[0].message.content });
  } catch (error) {
    // Handle any errors that occurred during OpenAI API interaction
    res.status(500).send("Error interacting with OpenAI API.");
  }
};

// Export the function
module.exports = convertDocToJson;
