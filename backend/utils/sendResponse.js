function sendResponse(response, statusCode, data, contentType = "application/json") {

    response.writeHead(statusCode, {
        "Content-Type": contentType,
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
    });

    response.end(
        typeof data === "string"
            ? data
            : JSON.stringify(data)
    );

}

module.exports = sendResponse;