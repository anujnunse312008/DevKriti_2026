import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged,
    updateProfile,
    updatePassword,
    EmailAuthProvider,
    reauthenticateWithCredential
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

import {
    doc,
    getDoc,
    setDoc
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

const profileForm = document.getElementById("profileForm");

const fullName = document.getElementById("fullName");
const email = document.getElementById("email");
const bio = document.getElementById("bio");

const currentPassword = document.getElementById("currentPassword");
const newPassword = document.getElementById("newPassword");
const confirmPassword = document.getElementById("confirmPassword");

let currentUser = null;

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        window.location.href = "login.html";
        return;

    }

    currentUser = user;

    fullName.value = user.displayName || "";

    email.value = user.email || "";

    const docRef = doc(db, "users", user.uid);

    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {

        bio.value = docSnap.data().bio || "";

    }

});
profileForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    try {
        if (newPassword.value !== "" || confirmPassword.value !== "") {

    if (currentPassword.value.trim() === "") {

        alert("Please enter your current password.");
        return;

    }

    if (newPassword.value !== confirmPassword.value) {

        alert("New passwords do not match.");
        return;

    }

    if (newPassword.value.length < 6) {

        alert("Password must be at least 6 characters long.");
        return;

    }

}
        await updateProfile(currentUser, {

            displayName: fullName.value.trim()

        });
        if (newPassword.value !== "") {

    const credential = EmailAuthProvider.credential(

        currentUser.email,
        currentPassword.value

    );

    await reauthenticateWithCredential(

        currentUser,
        credential

    );

    await updatePassword(

        currentUser,
        newPassword.value

    );

}

        await setDoc(

            doc(db, "users", currentUser.uid),

            {

                bio: bio.value.trim()

            },

            {

                merge: true

            }

        );
        console.log("Display Name:", currentUser.displayName);
console.log("Bio Saved:", bio.value);
        alert("Profile updated successfully!");

    }

    catch (error) {

        console.error(error);

        alert(error.message);

    }

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