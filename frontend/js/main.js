// =============================
// StoryForge AI
// Main JavaScript
// =============================

console.log("StoryForge AI Loaded Successfully");

// Smooth scrolling for landing page

document.querySelectorAll('a[href^="#"]').forEach(anchor => {

    anchor.addEventListener("click", function (e) {

        e.preventDefault();

        const target = document.querySelector(this.getAttribute("href"));

        if(target){

            target.scrollIntoView({

                behavior:"smooth"

            });

        }

    });

});