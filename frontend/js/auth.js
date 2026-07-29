import { auth } from "./firebase.js";

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";



// ---------------- REGISTER ----------------

const registerForm = document.getElementById("registerForm");


if (registerForm) {

    registerForm.addEventListener("submit", async function (e) {

        e.preventDefault();


        const name = document.getElementById("name").value.trim();

        const email = document.getElementById("email").value.trim();

        const password = document.getElementById("password").value;



        try {

            const userCredential = await createUserWithEmailAndPassword(

                auth,
                email,
                password

            );


            await updateProfile(userCredential.user, {

                displayName: name

            });


            alert("Registration Successful!");


            window.location.href = "login.html";


        }

        catch (error) {

            alert(error.message);

        }

    });

}



// ---------------- LOGIN ----------------

const loginForm = document.getElementById("loginForm");


if (loginForm) {

    loginForm.addEventListener("submit", async function (e) {

        e.preventDefault();


        const email = document.getElementById("email").value.trim();

        const password = document.getElementById("password").value;



        try {

            await signInWithEmailAndPassword(

                auth,
                email,
                password

            );


            alert("Login Successful!");


            window.location.href = "dashboard.html";


        }

        catch (error) {

            alert(error.message);

        }

    });

}