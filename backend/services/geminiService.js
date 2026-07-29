require("dotenv").config();

const OpenAI = require("openai");

const client = new OpenAI({

    apiKey: process.env.OPENROUTER_API_KEY,

    baseURL: "https://openrouter.ai/api/v1"

});

async function generateStory(data) {

    let promptText = "";

    // ---------- START STORY ----------

    if (data.action === "start") {

        promptText = `
You are an interactive story writer.

Story Genre:
${data.genre}

Story Tone:
${data.tone}

Story Idea:
${data.prompt}

Instructions:

- Write ONLY the first scene.
- Maximum 250 words.
- Introduce the setting and main characters.
- Do NOT finish the story.
- End with a small suspense, mystery, decision or cliffhanger.
- Do NOT write "Scene 1".
`;

    }

    // ---------- CONTINUE STORY ----------

    else if (data.action === "continue") {

        promptText = `
Continue this story.

Story so far:

${data.story}

Instructions:

- Continue naturally.
- Respect every edit made by the user.
- Write ONLY one new scene.
- Maximum 250 words.
- Do NOT summarize previous scenes.
- End with another interesting cliffhanger.
`;

    }

    // ---------- REGENERATE ----------

    else if (data.action === "regenerate") {

        promptText = `
Rewrite ONLY the latest scene.

Story:

${data.story}

Instructions:

- Keep every previous scene exactly the same.
- Rewrite only the newest scene.
- Maximum 250 words.
- Keep the same writing style and tone.
`;

    }

    // ---------- FINISH STORY ----------

    else if (data.action === "finish") {

        promptText = `
Finish this story.

Story so far:

${data.story}

Instructions:

- Write ONLY the final scene.
- Resolve every major conflict.
- Give the reader a satisfying ending.
- Do NOT introduce another cliffhanger.
- Maximum 350 words.
`;

    }

    const response = await client.chat.completions.create({

        model: "openrouter/free",

        messages: [

            {
                role: "user",
                content: promptText
            }

        ]

    });

    return response.choices[0].message.content;

}

module.exports = generateStory;