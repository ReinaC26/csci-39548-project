const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai'); 
const Quest = require('../models/Quest'); 
const router = express.Router(); 

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const ResponseSchema = {
    type: "object",
    properties: {
        distance: { type: "string" },
        duration: { type: "string" },
        startLocation: { type: "string" },
        endLocation: { type: "string" },
        description: { 
            type: "string", 
            description: "A highly detailed, 2 paragraphs step-by-step guide including landmarks and specific directions." 
        },
        questGoal: { 
            type: "string", 
            description: "A specific and rewarding final task for the user to perform based on the properties." 
        }
    },
    required: ["distance", "duration", "startLocation", "endLocation", "description", "questGoal"]
};

router.post('/', async (req, res) => {
    const { distance, duration, startLocation, endLocation, description } = req.body;

    try {
        const model = genAI.getGenerativeModel({ 
            model: 'gemini-2.0-flash-exp'
        });

        const prompt = `
        You are a Quest Generator AI. Generate a detailed, step-by-step quest, including an interesting Quest Goal.
        The output must follow the provided JSON schema. The generated quest should be safe, engaging and suitable for anyone.

            Inputs:
            - Max Distance: ${distance}
            - Max Duration: ${duration}
            - Start Location: ${startLocation || 'Any interesting starting point, provide the specific address'}
            - End Location: ${endLocation || 'A final destination, provide the specific address'}
            - Theme: "${description}"

            IMPORTANT INSTRUCTIONS:
                For the "distance" and "duration" field:
                    1. Ensure the distance does not exceed the provided maximum distance.
                    2. Ensure the duration does not exceed the provided maximum duration.
                    3. If the duration user enter isn't possible within the distance, adjust the duration to fit a realistic pace 
                    and provide a notice for user to understand.

                For the "description" field:
                    1. Write it as a narrative journey (e.g., "Walk past the old clock tower and look for the hidden alley...").
                    2. Incorporate specific landmarks, architectural details, or "hidden gems" related to the theme.
                    3. Break the journey into clear phases: the beginning, the middle transition, and the approach to the destination.
                    4. Match the tone to the user's theme if they add any (e.g., spooky, historical, or academic).
                    5. Total length should be around 2 descriptive paragraphs.
        `;

        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: ResponseSchema,
            },
        });

        const questData = JSON.parse(result.response.text());

        // save to database
        const newQuest = new Quest({
            distance: questData.distance,
            duration: questData.duration,
            startLocation: questData.startLocation,
            endLocation: questData.endLocation,
            description: questData.description,
            questGoal: questData.questGoal
        });

        const savedQuest = await newQuest.save();
        
        res.json(savedQuest);

    } catch (error) {
        console.error("Gemini API Error:", error);
        res.status(500).json({ error: "Failed to generate quest." });
    }
});

module.exports = router;