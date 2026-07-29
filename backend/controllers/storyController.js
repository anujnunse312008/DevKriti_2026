const sendResponse = require("../utils/sendResponse");
const generateStoryWithAI = require("../services/geminiService");

function handleGenerateStory(request, response) {

    let body = "";

    request.on("data", (chunk) => {

        body += chunk.toString();

    });

    request.on("end", async () => {

        try {

            const data = JSON.parse(body);

            const story = await generateStoryWithAI({

                action: data.action,

                prompt: data.prompt,

                genre: data.genre,

                tone: data.tone,

                story: data.story

            });

            sendResponse(response, 200, {

                story: story

            });

        }

        catch (error) {

            console.error(error);

            sendResponse(response, 500, {

                error: "Failed to generate story."

            });

        }

    });

}

module.exports = handleGenerateStory;