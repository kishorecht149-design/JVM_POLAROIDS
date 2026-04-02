

const firebaseConfig = {
  apiKey: "AIzaSyA1i1pR_glUOeCU0juW8ChVYHYfliKxRGI",
  authDomain: "jvm-polaroids.firebaseapp.com",
  projectId: "jvm-polaroids"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

window.currentUser = null;

// ✅ AUTO LOGIN (RUNS ON EVERY PAGE)
auth.onAuthStateChanged(user => {
    if (user) {
        window.currentUser = user;

        // SAVE LOGIN (IMPORTANT)
        localStorage.setItem("user", JSON.stringify({
            email: user.email
        }));

        updateNavbar(user);
    } else {
        window.currentUser = null;
        localStorage.removeItem("user");
    }
});

// ✅ LOGIN
function loginUser() {
    auth.signInWithPopup(provider);
}

// ✅ LOGOUT
function logoutUser() {
    auth.signOut().then(() => {
        // clear UI instantly
        window.currentUser = null;
        localStorage.removeItem("user");

        // refresh page
        location.reload();
    });
}

// ✅ NAVBAR UPDATE (GLOBAL)
function updateNavbar(user) {
    const nav = document.querySelector(".navbar div:last-child");
    if (!nav) return;

    // prevent duplicate
    if (document.getElementById("profileBox")) return;

    let profile = document.createElement("div");
    profile.id = "profileBox";
    profile.style.marginLeft = "10px";
    profile.style.cursor = "pointer";

    profile.innerHTML = `
        <div style="
            width:30px;height:30px;border-radius:50%;
            background:black;color:white;
            display:flex;align-items:center;justify-content:center;
            font-size:12px;">
            ${user.email[0].toUpperCase()}
        </div>

        <div id="dropdown" style="
            display:none;position:absolute;right:20px;top:60px;
            background:white;padding:10px;border-radius:10px;
            box-shadow:0 5px 20px rgba(0,0,0,0.1);font-size:12px;">
            
            <p>${user.email}</p>
            <button onclick="logoutUser()" style="
                padding:5px 10px;border:none;background:black;
                color:white;border-radius:6px;cursor:pointer;">
                Logout
            </button>
        </div>
    `;

    profile.onclick = () => {
        let d = document.getElementById("dropdown");
        d.style.display = d.style.display === "block" ? "none" : "block";
    };

    nav.appendChild(profile);

    // ❌ REMOVE SIGNUP BUTTON
    let btn = document.getElementById("loginBtn");
    if (btn) btn.remove();
}