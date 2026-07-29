require("dotenv").config();

const http = require("http");
const storyRoute = require("./routes/storyRoute");

const server = http.createServer((request, response) => {

    // CORS
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    response.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (request.method === "OPTIONS") {
        response.writeHead(204);
        response.end();
        return;
    }

    if (request.method === "GET" && request.url === "/") {

        response.writeHead(200, {
            "Content-Type": "text/plain"
        });

        response.end("Welcome to StoryForge AI");

    }

    else if (request.method === "POST" && request.url === "/generate") {

        storyRoute(request, response);

    }

    else {

        response.writeHead(404, {
            "Content-Type": "text/plain"
        });

        response.end("404 Not Found");

    }

});

server.listen(3000, () => {
    console.log("Server Running On Port 3000");
});