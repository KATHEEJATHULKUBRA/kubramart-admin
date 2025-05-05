/**
 * Kubra Market Admin - Easy Login Script
 * Copy and paste this entire script into your browser console when on the /auth page
 */

(function () {
  // Admin credentials
  const credentials = {
    username: "admin",
    password: "admin123",
  };

  // Find the form inputs and fill them
  const usernameInput = document.querySelector('input[placeholder="admin"]');
  const passwordInput = document.querySelector('input[type="password"]');
  const loginButton = document.querySelector('button[type="submit"]');

  if (usernameInput && passwordInput && loginButton) {
    // Simulate typing
    usernameInput.value = credentials.username;
    passwordInput.value = credentials.password;

    // Trigger events to activate the form
    usernameInput.dispatchEvent(new Event("input", { bubbles: true }));
    passwordInput.dispatchEvent(new Event("input", { bubbles: true }));

    // Submit the form
    loginButton.click();

    console.log("Login credentials applied! Logging in...");
  } else {
    console.error(
      "Could not find login form elements. Make sure you are on the /auth page.",
    );
  }
})();
