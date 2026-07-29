const handleGenerateStory = require("../controllers/storyController");

function storyRoute(request, response) {

    handleGenerateStory(request, response);

}

module.exports = storyRoute;