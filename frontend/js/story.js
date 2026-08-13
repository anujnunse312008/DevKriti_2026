import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

import {
    collection,
    addDoc,
    updateDoc,
    doc,
    getDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";


const startStoryBtn = document.getElementById("startStoryBtn");
const continueBtn = document.getElementById("continueBtn");
const regenerateBtn = document.getElementById("regenerateBtn");
const endStoryBtn = document.getElementById("endStoryBtn");
const dashboardBtn = document.getElementById("dashboardBtn");

const title = document.getElementById("title");
const prompt = document.getElementById("prompt");
const genre = document.getElementById("genre");
const tone = document.getElementById("tone");

const storyArea = document.getElementById("storyArea");
const lastScene = document.getElementById("lastScene");
const loading = document.getElementById("loading");


continueBtn.disabled = true;
regenerateBtn.disabled = true;
endStoryBtn.disabled = true;


let currentUser = null;
let storyId = null;


const params = new URLSearchParams(window.location.search);
const existingStoryId = params.get("id");


onAuthStateChanged(auth, async (user) => {

    if (!user) {

        window.location.href = "login.html";
        return;

    }

    currentUser = user;

    if (existingStoryId) {

        await loadStory(existingStoryId);

    }

});


dashboardBtn.addEventListener("click", () => {

    window.location.href = "dashboard.html";

});


async function loadStory(id) {

    try {

        const docRef = doc(db, "stories", id);

        const snapshot = await getDoc(docRef);

        if (!snapshot.exists()) {

            alert("Story not found.");

            window.location.href = "mystories.html";

            return;

        }

        const story = snapshot.data();

        storyId = id;

        title.value = story.title || "";

        prompt.value = story.prompt || "";

        genre.value = story.genre || "Fantasy";

        tone.value = story.tone || "Serious";

        storyArea.value = story.content || "";

        lastScene.value = "";

        continueBtn.disabled = false;
        regenerateBtn.disabled = false;
        endStoryBtn.disabled = false;

    }

    catch (error) {

        console.error(error);

        alert("Unable to load story.");

    }

}


function startLoading(message) {

    loading.innerHTML = "⏳ " + message;

    startStoryBtn.disabled = true;
    continueBtn.disabled = true;
    regenerateBtn.disabled = true;
    endStoryBtn.disabled = true;

    startStoryBtn.textContent = "Please Wait...";
    continueBtn.textContent = "Please Wait...";
    regenerateBtn.textContent = "Please Wait...";
    endStoryBtn.textContent = "Please Wait...";

}


function stopLoading() {

    loading.innerHTML = "✅ Done";

    startStoryBtn.textContent = "Start Story";
    continueBtn.textContent = "Continue Story";
    regenerateBtn.textContent = "Regenerate Scene";
    endStoryBtn.textContent = "Finish Story";

    startStoryBtn.disabled = false;
    continueBtn.disabled = false;
    regenerateBtn.disabled = false;
    endStoryBtn.disabled = false;

    setTimeout(() => {

        loading.innerHTML = "";

    }, 1500);

}


async function saveStory() {

    if (!currentUser) return;

    if (!storyId) {

        const docRef = await addDoc(collection(db, "stories"), {

            uid: currentUser.uid,

            title: title.value.trim(),

            prompt: prompt.value.trim(),

            genre: genre.value,

            tone: tone.value,

            content: storyArea.value,

            createdAt: serverTimestamp(),

            updatedAt: serverTimestamp()

        });

        storyId = docRef.id;

    }

    else {

        await updateDoc(doc(db, "stories", storyId), {

            title: title.value.trim(),

            prompt: prompt.value.trim(),

            genre: genre.value,

            tone: tone.value,

            content: storyArea.value,

            updatedAt: serverTimestamp()

        });

    }

}


async function sendRequest(action) {

    if (action === "start") {

        if (prompt.value.trim() === "") {

            alert("Please enter a story idea.");

            return;

        }

        startLoading("Creating your first scene...");

    }

    else if (action === "continue") {

        startLoading("Writing next scene...");

    }

    else if (action === "regenerate") {

        startLoading("Regenerating latest scene...");

    }

    else {

        startLoading("Writing the ending...");

    }


    try {

        const response = await fetch(
            "https://devkriti-2026.onrender.com/generate",
            {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify({

                    action,

                    title: title.value,

                    prompt: prompt.value,

                    genre: genre.value,

                    tone: tone.value,

                    story: action === "regenerate"
    ? lastScene.value
    : storyArea.value

                })

            }
        );


        const data = await response.json();


        if (!data.story) {

            alert(data.error || "Something went wrong.");

            stopLoading();

            return;

        }


        if (action === "start") {

            storyArea.value = data.story;

            lastScene.value = data.story;

            continueBtn.disabled = false;

            regenerateBtn.disabled = false;

            endStoryBtn.disabled = false;

        }

        else if (action === "continue") {

            storyArea.value += "\n\n" + data.story;

            lastScene.value = data.story;

        }

        else if (action === "regenerate") {

            storyArea.value = storyArea.value.replace(
                lastScene.value,
                data.story
            );

            lastScene.value = data.story;

        }

        else if (action === "finish") {

            storyArea.value += "\n\n" + data.story;

            lastScene.value = data.story;

            continueBtn.disabled = true;

            regenerateBtn.disabled = true;

            endStoryBtn.disabled = true;

            loading.innerHTML = "🎉 Story Completed";

        }


        await saveStory();

    }

    catch (error) {

        console.error(error);

        alert("Unable to connect to server.");

    }

    finally {

        stopLoading();

    }

}


startStoryBtn.addEventListener("click", () => {

    sendRequest("start");

});


continueBtn.addEventListener("click", () => {

    sendRequest("continue");

});


regenerateBtn.addEventListener("click", () => {

    sendRequest("regenerate");

});


endStoryBtn.addEventListener("click", () => {

    sendRequest("finish");

});


// ==========================
// Mobile Sidebar
// ==========================

const menuBtn = document.getElementById("menuBtn");

const sidebar = document.querySelector(".sidebar");

const overlay = document.getElementById("sidebarOverlay");


if (menuBtn) {

    menuBtn.addEventListener("click", () => {

        sidebar.classList.toggle("show-sidebar");

        overlay.classList.toggle("show");

    });

}


if (overlay) {

    overlay.addEventListener("click", () => {

        sidebar.classList.remove("show-sidebar");

        overlay.classList.remove("show");

    });

}


const menuItems = document.querySelectorAll(".sidebar li");


menuItems.forEach(item => {

    item.addEventListener("click", () => {

        sidebar.classList.remove("show-sidebar");

        overlay.classList.remove("show");

    });

});