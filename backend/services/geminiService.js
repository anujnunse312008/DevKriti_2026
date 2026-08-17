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

    const response = await client.chat.completions.create({

        model: "nvidia/nemotron-3-ultra-550b-a55b:free",

        temperature: 1.0,

        messages: [

            {
                role: "system",
                content: `
You are a story-writing engine.

Your task is to replace the supplied story scene with a genuinely different alternate version.

Rules:

- The supplied text is the current scene that must be replaced.
- NEVER ask the user to provide the scene.
- NEVER say that you need the scene.
- NEVER explain what you are doing.
- Do NOT merely paraphrase the original.
- Change the major events and actions.
- Change the immediate conflict, discovery, decision, or development.
- Use different dialogue.
- Use different descriptions and sentence structures.
- Keep the same main characters.
- Keep the same story world and setting.
- Keep the same genre and overall tone.
- Preserve important continuity from the original scene.
- Do not introduce unrelated characters, settings, or stories.
- Do not reuse the same sequence of events.
- Maximum 250 words.
- Return ONLY the replacement scene.
`
            },

            {
                role: "user",
                content: `
<<<CURRENT_SCENE_TO_REPLACE>>>

${data.story}

<<<END_CURRENT_SCENE_TO_REPLACE>>>
`
            }

        ]

    });

    const story = response?.choices?.[0]?.message?.content;

    if (!story) {
        throw new Error("No story was returned by OpenRouter.");
    }

    return story.trim();
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