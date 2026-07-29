import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

import {
    collection,
    getDocs,
    query,
    where,
    orderBy
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

const storyGrid = document.querySelector(".story-grid");

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        window.location.href = "login.html";
        return;

    }

    await loadStories(user.uid);

});

async function loadStories(uid) {

    storyGrid.innerHTML = "<p>Loading stories...</p>";

    try {

        const q = query(

            collection(db, "stories"),

            where("uid", "==", uid),

            orderBy("updatedAt", "desc")

        );

        const snapshot = await getDocs(q);

        storyGrid.innerHTML = "";

        if (snapshot.empty) {

            storyGrid.innerHTML = `

                <div class="story-card">

                    <h3>No Stories Yet</h3>

                    <p>Create your first AI story.</p>

                    <span>Start from the New Story page.</span>

                </div>

            `;

            return;

        }

        snapshot.forEach((doc) => {

            const story = doc.data();

            let updated = "Recently";

            if (story.updatedAt) {

                updated = story.updatedAt.toDate().toLocaleDateString();

            }

            const card = document.createElement("div");

            card.className = "story-card";

            card.innerHTML = `

                <h3>${story.title || "Untitled Story"}</h3>

                <p>${story.genre}</p>

                <span>Last Updated: ${updated}</span>

            `;

            card.addEventListener("click", () => {

    window.location.href = `story.html?id=${doc.id}`;

});

            storyGrid.appendChild(card);

        });

    }

    catch (error) {

        console.error(error);

        storyGrid.innerHTML = `

            <div class="story-card">

                <h3>Error</h3>

                <p>Unable to load your stories.</p>

            </div>

        `;

    }

}