require("dotenv").config();

const OpenAI = require("openai");

const client = new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: "https://openrouter.ai/api/v1"
});

async function generateStory(data) {

    let promptText = "";
    let temperature = 0.8;

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
- Return ONLY the story scene.
`;

        temperature = 0.8;
    }

    // ---------- CONTINUE STORY ----------

    else if (data.action === "continue") {

        promptText = `
Continue this story.

Story so far:

${data.story}

Instructions:

- Continue naturally from the story.
- Respect every event and edit already present.
- Write ONLY one new scene.
- Maximum 250 words.
- Do NOT rewrite or summarize previous scenes.
- Introduce new development, action, conflict, discovery, or decision.
- End with an interesting cliffhanger.
- Return ONLY the new scene.
`;

        temperature = 0.8;
    }

    // ---------- REGENERATE ----------

    else if (data.action === "regenerate") {

        promptText = `
You are regenerating a story scene.

The following text is the CURRENT SCENE that must be replaced:

${data.story}

Generate a COMPLETELY DIFFERENT VERSION of this scene.

The replacement must:

- Be genuinely different, NOT a paraphrase.
- Keep the same characters, world, genre, and overall tone.
- Preserve important continuity and facts established in the current scene.
- Change the main events and actions.
- Change the conflict, discovery, decision, or development.
- Use different dialogue.
- Use different descriptions.
- Use different sentence structures and wording.
- Do NOT copy or lightly reword sentences from the original.
- Do NOT follow the same sequence of events as the original scene.
- Do NOT merely replace a few words.
- Do NOT summarize the original scene.
- Maximum 250 words.
- Return ONLY the new replacement scene.

The reader should feel that this is an alternate version of what happened, not the same scene rewritten.
`;

        // Higher variation specifically for regeneration.
        temperature = 1.1;
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
- Do NOT summarize the story.
- Maximum 350 words.
- Return ONLY the final scene.
`;

        temperature = 0.8;
    }

    else {

        throw new Error("Invalid story action.");

    }

    const response = await client.chat.completions.create({

        model: "openrouter/free",

        temperature: temperature,

        messages: [
            {
                role: "user",
                content: promptText
            }
        ]

    });

    const story = response?.choices?.[0]?.message?.content;

    if (!story) {
        throw new Error("No story was returned by OpenRouter.");
    }

    return story.trim();
}

module.exports = generateStory;