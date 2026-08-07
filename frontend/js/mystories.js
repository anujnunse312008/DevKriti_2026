import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

import {
    collection,
    getDocs,
    query,
    where,
    orderBy,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

const storyGrid = document.querySelector(".story-grid");
const searchInput = document.getElementById("searchInput");
let allStories = [];

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
        allStories = [];

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

        snapshot.forEach((storyDoc) => {

            const story = storyDoc.data();
            allStories.push({
    id: storyDoc.id,
    ...story
});

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

    <button class="delete-btn">
    <i class="fa-solid fa-trash"></i> Delete
</button>

`;
const deleteBtn = card.querySelector(".delete-btn");
deleteBtn.addEventListener("click", async (e) => {

    e.stopPropagation();

    const confirmDelete = confirm(
        "Are you sure you want to delete this story?"
    );

    if (!confirmDelete) return;

    try {

        await deleteDoc(doc(db, "stories", storyDoc.id));

        card.remove();

        if (storyGrid.children.length === 0) {

            storyGrid.innerHTML = `

                <div class="story-card">

                    <h3>No Stories Yet</h3>

                    <p>Create your first AI story.</p>

                    <span>Start from the New Story page.</span>

                </div>

            `;

        }

        alert("Story deleted successfully!");

    }

    catch (error) {

        console.error(error);

        alert("Unable to delete story.");

    }

});
            card.addEventListener("click", () => {

    window.location.href = `story.html?id=${storyDoc.id}`;

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
function searchStories() {

    const searchText = searchInput.value.toLowerCase().trim();

    const cards = storyGrid.querySelectorAll(".story-card");

    cards.forEach((card, index) => {

        const story = allStories[index];

        const title = (story.title || "").toLowerCase();
        const genre = (story.genre || "").toLowerCase();

        if (
            title.includes(searchText) ||
            genre.includes(searchText)
        ) {

            card.style.display = "block";

        }

        else {

            card.style.display = "none";

        }

    });

}
searchInput.addEventListener("input", () => {

    searchStories();

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