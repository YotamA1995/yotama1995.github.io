// Login page functionality
document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".form");
  const emailInput = document.querySelector('input[name="email"]');
  const passwordInput = document.querySelector('input[name="password"]');

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Create error message elements
  function createErrorElement(message) {
    const errorEl = document.createElement("span");
    errorEl.className = "field__error";
    errorEl.textContent = message;
    errorEl.style.color = "var(--myflix-red)";
    errorEl.style.fontSize = "0.85rem";
    errorEl.style.marginTop = "4px";
    return errorEl;
  }

  // Remove existing error messages
  function clearErrors() {
    document
      .querySelectorAll(".field__error")
      .forEach((error) => error.remove());
    document
      .querySelectorAll(".field")
      .forEach((field) => field.classList.remove("field--error"));
  }

  // Validate email field
  function validateEmail() {
    const value = emailInput.value.trim();
    const fieldContainer = emailInput.closest(".field");

    if (!value) {
      fieldContainer.classList.add("field--error");
      const errorEl = createErrorElement("Email is required");
      fieldContainer.appendChild(errorEl);
      return false;
    }

    if (!emailRegex.test(value)) {
      fieldContainer.classList.add("field--error");
      const errorEl = createErrorElement("Please enter a valid email address");
      fieldContainer.appendChild(errorEl);
      return false;
    }

    return true;
  }

  // Validate password field
  function validatePassword() {
    const value = passwordInput.value;
    const fieldContainer = passwordInput.closest(".field");

    if (!value) {
      fieldContainer.classList.add("field--error");
      const errorEl = createErrorElement("Password is required");
      fieldContainer.appendChild(errorEl);
      return false;
    }

    if (value.length < 6) {
      fieldContainer.classList.add("field--error");
      const errorEl = createErrorElement(
        "Password must be at least 6 characters"
      );
      fieldContainer.appendChild(errorEl);
      return false;
    }

    return true;
  }

  // Real-time validation
  emailInput.addEventListener("blur", function () {
    clearErrors();
    validateEmail();
  });

  passwordInput.addEventListener("blur", function () {
    clearErrors();
    validatePassword();
  });

  // Form submission
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    clearErrors();

    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();

    if (isEmailValid && isPasswordValid) {
      // Set auth flag in localStorage
      localStorage.setItem("auth", "true");

      // Redirect to profiles page
      window.location.href = "profiles.html";
    }
  });
});
