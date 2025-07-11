const form = document.querySelector(".login-form");

form.addEventListener("submit", async (e) => {
  e.preventDefault(); // empêche l'envoi classique

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const loginData = {
    email: email,
    password: password,
  };

  try {
    const response = await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("token", data.token); // ✅ sauvegarde du token
      window.location.href = "index.html"; // ✅ redirection vers la page d’accueil
    } else {
      displayError("E-mail ou mot de passe incorrect");
    }
  } catch (error) {
    console.error("Erreur réseau :", error);
    displayError("Erreur de connexion au serveur");
  }
});

// 👉 Fonction pour afficher un message d’erreur
function displayError(message) {
  let errorMsg = document.querySelector(".error-message");
  if (!errorMsg) {
    errorMsg = document.createElement("p");
    errorMsg.classList.add("error-message");
    form.appendChild(errorMsg);
  }
  errorMsg.textContent = message;
  errorMsg.style.color = "red";
  errorMsg.style.textAlign = "center";
  errorMsg.style.marginTop = "10px";
}