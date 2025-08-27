// Auth guard
if (localStorage.getItem("auth") !== "true") {
  window.location.href = "login.html";
}

// Profiles data (should match profiles.html)
const profiles = [
  { id: 1, name: "John", avatar: "../images/avatar_1.png" },
  { id: 2, name: "Sarah", avatar: "../images/avatar_2.png" },
  { id: 3, name: "Kids", avatar: "../images/avatar_3.png" },
];

// Content catalog
const catalog = [
  {
    id: 1,
    name: "Stranger Things",
    year: 2016,
    genre: "Sci-Fi",
    likes: 1250,
  },
  { id: 2, name: "The Crown", year: 2016, genre: "Drama", likes: 892 },
  {
    id: 3,
    name: "Bridgerton",
    year: 2020,
    genre: "Romance",
    likes: 1567,
  },
  { id: 4, name: "Money Heist", year: 2017, genre: "Crime", likes: 2103 },
  {
    id: 5,
    name: "The Witcher",
    year: 2019,
    genre: "Fantasy",
    likes: 1834,
  },
  { id: 6, name: "Ozark", year: 2017, genre: "Crime", likes: 976 },
  { id: 7, name: "Dark", year: 2017, genre: "Sci-Fi", likes: 1432 },
  { id: 8, name: "Lupin", year: 2021, genre: "Crime", likes: 789 },
  {
    id: 9,
    name: "The Queen's Gambit",
    year: 2020,
    genre: "Drama",
    likes: 2234,
  },
  { id: 10, name: "Narcos", year: 2015, genre: "Crime", likes: 1876 },
];

let filteredCatalog = [...catalog];
let sortAscending = true;

document.addEventListener("DOMContentLoaded", function () {
  const greetingEl = document.querySelector(".nav__greeting");
  const searchInput = document.getElementById("q"); // Use existing nav search
  const sortToggle = document.getElementById("sortToggle");
  const logoutBtn = document.getElementById("logoutBtn");
  const catalogGrid = document.getElementById("catalogGrid");
  const profilesList = document.getElementById("profilesList");
  const avatarBtn = document.querySelector(".avatar-btn img");

  // Get current profile
  const profileId = localStorage.getItem("profileId");
  let currentProfile = profiles.find((p) => p.id == profileId);

  // If no profile selected or invalid profile, default to first profile
  if (!currentProfile) {
    currentProfile = profiles[0];
    localStorage.setItem("profileId", currentProfile.id);
  }

  // Set greeting and avatar based on selected profile
  greetingEl.textContent = `Hello, ${currentProfile.name}`;
  avatarBtn.src = currentProfile.avatar;
  avatarBtn.alt = currentProfile.name;

  // Render profiles in the dropdown panel
  function renderProfilesPanel() {
    profilesList.innerHTML = "";
    profiles.forEach((profile) => {
      const profileItem = document.createElement("li");
      profileItem.className = `panel__item ${
        profile.id == currentProfile.id ? "panel__item--active" : ""
      }`;
      profileItem.innerHTML = `
        <img class="panel__avatar" src="${profile.avatar}" alt="${
        profile.name
      }" />
        <span>${profile.name}</span>
        ${
          profile.id == currentProfile.id
            ? '<span class="current-indicator">✓</span>'
            : ""
        }
      `;

      // Add click handler for profile switching
      profileItem.addEventListener("click", function () {
        if (profile.id != currentProfile.id) {
          // Switch to this profile
          localStorage.setItem("profileId", profile.id);
          currentProfile = profile;

          // Update UI
          greetingEl.textContent = `Hello, ${currentProfile.name}`;
          avatarBtn.src = currentProfile.avatar;
          avatarBtn.alt = currentProfile.name;

          // Re-render the profiles panel
          renderProfilesPanel();

          // Close the panel
          window.location.hash = "#";
        }
      });

      profilesList.appendChild(profileItem);
    });
  }

  // Initial render of profiles panel
  renderProfilesPanel();

  // Close panels when clicking outside
  document.addEventListener("click", function (e) {
    const panels = document.querySelectorAll(".panel");
    const isClickOnIcon = e.target.closest(".icon-btn, .avatar-btn");
    const isClickOnPanel = e.target.closest(".panel");
    const isClickOnCloseBtn = e.target.closest(".panel__close");

    // If clicked on a close button, let it handle the closing
    if (isClickOnCloseBtn) {
      return;
    }

    // If clicked on an icon/avatar button, let it handle opening the panel
    if (isClickOnIcon) {
      return;
    }

    // If clicked outside any panel and not on an icon, close all panels
    if (!isClickOnPanel) {
      window.location.hash = "#";
    }
  });

  // Close panels when pressing ESC key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      window.location.hash = "#";
    }
  });

  // Get saved likes from localStorage
  function getSavedLikes(contentId) {
    return (
      parseInt(localStorage.getItem(`likes:${contentId}`)) ||
      catalog.find((item) => item.id === contentId)?.likes ||
      0
    );
  }

  // Save likes to localStorage
  function saveLikes(contentId, likes) {
    localStorage.setItem(`likes:${contentId}`, likes.toString());
  }

  // Create content card
  function createContentCard(item) {
    const currentLikes = getSavedLikes(item.id);

    const card = document.createElement("div");
    card.className = "content-card";
    card.innerHTML = `
      <div class="content-card__info">
        <h3 class="content-card__title">${item.name}</h3>
        <div class="content-card__meta">
          <span class="content-card__year">${item.year}</span>
          <span class="content-card__genre">${item.genre}</span>
        </div>
        <div class="content-card__actions">
          <button class="like-btn" data-content-id="${item.id}">
            <span class="like-icon">❤️</span>
            <span class="like-count">${currentLikes}</span>
          </button>
        </div>
      </div>
    `;

    // Add like button functionality
    const likeBtn = card.querySelector(".like-btn");
    const likeCount = card.querySelector(".like-count");

    likeBtn.addEventListener("click", function () {
      const newLikes = getSavedLikes(item.id) + 1;
      saveLikes(item.id, newLikes);
      likeCount.textContent = newLikes;

      // Animation
      likeBtn.classList.add("liked");
      setTimeout(() => likeBtn.classList.remove("liked"), 300);
    });

    return card;
  }

  // Render catalog
  function renderCatalog() {
    catalogGrid.innerHTML = "";
    filteredCatalog.forEach((item) => {
      const card = createContentCard(item);
      catalogGrid.appendChild(card);
    });
  }

  // Search functionality
  function performSearch(closePanel = false) {
    const searchTerm = searchInput.value.toLowerCase().trim();
    filteredCatalog = catalog.filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm) ||
        item.genre.toLowerCase().includes(searchTerm) ||
        item.year.toString().includes(searchTerm)
    );
    applySorting();
    renderCatalog();

    // Only close the search panel when explicitly requested
    if (closePanel) {
      window.location.hash = "#";
    }
  }

  // Live search as user types (keep panel open)
  searchInput.addEventListener("input", function () {
    performSearch(false); // Don't close panel during live search
  });

  // Handle search button click in the nav panel (close after search)
  const searchBtn = document.querySelector(".panel__body .btn");
  if (searchBtn) {
    searchBtn.addEventListener("click", function (e) {
      e.preventDefault();
      performSearch(true); // Close panel after button click
    });
  }

  // Handle Enter key in search input (close after search)
  searchInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      performSearch(true); // Close panel after Enter key
    }
  });

  // Sort functionality
  function applySorting() {
    filteredCatalog.sort((a, b) => {
      if (sortAscending) {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });
  }

  sortToggle.addEventListener("click", function () {
    sortAscending = !sortAscending;
    this.textContent = sortAscending ? "Sort A→Z" : "Sort Z→A";
    applySorting();
    renderCatalog();
  });

  // Logout functionality
  logoutBtn.addEventListener("click", function () {
    // Log current localStorage state for debugging
    console.log(
      "Before logout - localStorage keys:",
      Object.keys(localStorage)
    );

    // Clear only authentication and user session data
    localStorage.removeItem("auth");
    localStorage.removeItem("profileId");
    // Note: Likes data is preserved across sessions

    // Log what was cleared
    console.log("Logout cleanup completed. Cleared items:", {
      auth: true,
      profileId: true,
      likesPreserved: true,
    });
    console.log("After logout - localStorage keys:", Object.keys(localStorage));

    // Close the profile panel before redirecting
    window.location.hash = "#";
    window.location.href = "login.html";
  });

  // Initial render
  applySorting();
  renderCatalog();
});
