require("dotenv").config();

const http = require("http");
const storyRoute = require("./routes/storyRoute");

const PORT = process.env.PORT || 3000;
const HOST = "0.0.0.0";

const server = http.createServer((request, response) => {

    // CORS
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    response.setHeader("Access-Control-Allow-Headers", "Content-Type");

    // Handle preflight requests
    if (request.method === "OPTIONS") {

        response.writeHead(204);
        response.end();

        return;
    }

    // Health check
    if (request.method === "GET" && request.url === "/") {

        response.writeHead(200, {
            "Content-Type": "text/plain"
        });

        response.end("Welcome to StoryForge AI");

    }

    // Story generation
    else if (request.method === "POST" && request.url === "/generate") {

        storyRoute(request, response);

    }

    // Unknown route
    else {

        response.writeHead(404, {
            "Content-Type": "text/plain"
        });

        response.end("404 Not Found");
    }
});

server.listen(PORT, HOST, () => {

    console.log(`Server Running On ${HOST}:${PORT}`);

});