import express from "express";
import cors from "cors";
import OpenAI from "openai";
import dotenv from "dotenv";
import { buildPrompt } from "./helpers.js";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// // Define the schema for the response format
// const responseSchema = z.object({
//   weeks: z.array(
//     z.object({
//       weekNumber: z.number(),
//       totalMileage: z.number(),
//       runs: z.array(
//         z.object({
//           day: z.enum(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]),
//           type: z.enum(["Easy Run", "Long Run", "Tempo Run", "Speed Work", "Recovery Run", "Race"]),
//           distance: z.number(),
//           description: z.string(),
//         })
//       ),
//     })
//   ),
// });

app.post("/generate-plan", async (req, res) => {
  const prompt = buildPrompt(req.body);

  try {
    console.log("Generating plan...");

    let fullContent = '';
    let isComplete = false;
    let messages = [{ role: "user", content: prompt }];

    while (!isComplete) {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: messages,
        temperature: 0.1
      });

      const content = response.choices[0]?.message?.content || '';
      fullContent += content;

      // Check if the response is complete
      if (response.choices[0]?.finish_reason === "length") {
        // Add the last message to continue the conversation
        messages.push({ role: "assistant", content: content });
      } else {
        isComplete = true;
      }
    }

    // Manually parse the full content
    let parsedContent;
    try {
      const cleanedContent = fullContent.replace(/\\n/g, "").replace(/\\t/g, "").replace(/\\"/g, '"').replace(/\//g, "");
      parsedContent = JSON.parse(cleanedContent);
    } catch (parseError) {
      throw new Error("Failed to parse response content as JSON");
    }

    res.json(parsedContent);

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to generate plan" });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));