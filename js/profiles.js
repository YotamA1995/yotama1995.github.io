// Auth guard - check if user is authenticated
if (localStorage.getItem("auth") !== "true") {
  window.location.href = "login.html";
}

// Profiles data
const profiles = [
  { id: 1, name: "John", avatar: "../images/avatar_1.png" },
  { id: 2, name: "Sarah", avatar: "../images/avatar_2.png" },
  { id: 3, name: "Kids", avatar: "../images/avatar_3.png" },
];

document.addEventListener("DOMContentLoaded", function () {
  const profilesGrid = document.querySelector(".profiles-grid");
  const logoutBtn = document.querySelector(".btn--logout");

  // Clear existing profiles and render from data
  const existingProfiles = profilesGrid.querySelectorAll(
    ".profile-card:not(.profile-card--add)"
  );
  existingProfiles.forEach((profile) => profile.remove());

  // Render profiles dynamically
  profiles.forEach((profile) => {
    const profileCard = document.createElement("article");
    profileCard.className = "profile-card";
    profileCard.setAttribute("data-profile-id", profile.id);

    profileCard.innerHTML = `
      <div class="profile-card__avatar">
        <img
          src="${profile.avatar}"
          alt="${profile.name}"
          class="profile-card__image"
        />
      </div>
      <input
        type="text"
        value="${profile.name}"
        class="profile-card__name-input"
        readonly
      />
    `;

    // Insert before the "Add Profile" card
    const addProfileCard = profilesGrid.querySelector(".profile-card--add");
    profilesGrid.insertBefore(profileCard, addProfileCard);

    // Add click handler for profile selection
    profileCard.addEventListener("click", function () {
      localStorage.setItem("profileId", profile.id);
      window.location.href = "feed.html";
    });
  });

  // Logout functionality
  logoutBtn.addEventListener("click", function () {
    // Clear only authentication and user session data
    localStorage.removeItem("auth");
    localStorage.removeItem("profileId");
    // Note: Likes data is preserved across sessions

    window.location.href = "login.html";
  });
});
