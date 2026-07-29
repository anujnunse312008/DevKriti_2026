import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

import {
    collection,
    getDocs,
    query,
    where
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";


// ---------------- SEARCH ----------------

const search = document.querySelector(".topbar input");

if (search) {

    search.addEventListener("keyup", () => {

        console.log("Searching:", search.value);

    });

}


// ---------------- ELEMENTS ----------------

const welcomeUser = document.getElementById("welcomeUser");

const storyList = document.getElementById("storyList");

const newStoryBtn = document.querySelector(".btn-primary");


// ---------------- LOAD USER ----------------

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        window.location.href = "login.html";

        return;

    }


    if (user.displayName) {

        welcomeUser.textContent = `Welcome Back, ${user.displayName} 👋`;

    }

    else {

        welcomeUser.textContent = "Welcome Back 👋";

    }


    await loadStories(user.uid);

});


// ---------------- LOAD STORIES ----------------

async function loadStories(uid) {

    storyList.innerHTML = "<p>Loading stories...</p>";


    const q = query(

        collection(db, "stories"),

        where("uid", "==", uid)

    );


    const snapshot = await getDocs(q);


    storyList.innerHTML = "";


    if (snapshot.empty) {

        storyList.innerHTML = `

        <div class="story-card">

            <h3>No Stories Yet</h3>

            <p>Create your first AI story.</p>

        </div>

        `;

        return;

    }


    snapshot.forEach((doc) => {

        const story = doc.data();


        const card = document.createElement("div");


        card.className = "story-card";


        card.innerHTML = `

            <h3>${story.title}</h3>

            <p>${story.genre}</p>

        `;


        card.onclick = () => {

            window.location.href = `story.html?id=${doc.id}`;

        };


        storyList.appendChild(card);

    });

}


// ---------------- NEW STORY ----------------

if (newStoryBtn) {

    newStoryBtn.addEventListener("click", () => {

        window.location.href = "story.html?new=true";

    });

}