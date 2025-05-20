document.addEventListener("DOMContentLoaded", function () {
  const toggleButton = document.getElementById("modeToggle");
  const body = document.body;
  const logo = document.getElementById("logo");
  const logo2 = document.getElementById("logo2");

  if (localStorage.getItem("theme") === "light") {
    body.classList.add("light-mode");
    toggleButton.textContent = "🌙";
  } else {
    toggleButton.textContent = "☀️";
  }

  toggleButton.addEventListener("click", function () {
    body.classList.toggle("light-mode");

    if (body.classList.contains("light-mode")) {
      localStorage.setItem("theme", "light");
      toggleButton.textContent = "🌙";
      logo.src = "Images/jrn-lightmode.png";
      logo2.src = "Images/jrn-lightmode.png"; // Light mode logo
    } else {
      localStorage.setItem("theme", "dark");
      toggleButton.textContent = "☀️";
      logo.src = "Images/jrn-dark.png";
      logo2.src = "Images/jrn-dark.png"; // Light mode logo
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const buttons = document.querySelectorAll("[dref]"); // Select all buttons with dref attribute
  const preElements = document.querySelectorAll(".preEmpty"); // Select all <pre> elements

  buttons.forEach((button) => {
    button.addEventListener("click", function () {
      // Remove 'visible' class from all <pre> elements
      preElements.forEach((pre) => {
        pre.classList.remove("visible");
      });

      // Get the target <pre> element and add 'visible' class
      const targetPre = document.getElementById(
        "pre" + button.getAttribute("dref")
      );
      if (targetPre) {
        targetPre.classList.add("visible");
      }
    });
  });
});

const modal = document.getElementById("imageModal");
const modalImg = document.getElementById("modalImage");
const galleryItems = document.querySelectorAll(".gallery-item img");
const aboutItems = document.querySelectorAll(".about-item img");

galleryItems.forEach((img) => {
  img.addEventListener("click", () => {
    modal.classList.add("active");
    modalImg.src = img.src;
  });
});
aboutItems.forEach((img) => {
  img.addEventListener("click", () => {
    modal.classList.add("active");
    modalImg.src = img.src;
  });
});

function closeModal() {
  modal.classList.remove("active");
}

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    closeModal();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeModal();
  }
});

const token = "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"; // Replace with your PAT

fetch("https://api.github.com/graphql", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    query: `
        query {
          user(login: "jasper890") {
            contributionsCollection {
              contributionCalendar {
                totalContributions
              }
            }
          }
        }
      `,
  }),
})
  .then((response) => response.json())
  .then((data) => {
    const total =
      data.data.user.contributionsCollection.contributionCalendar
        .totalContributions;
    document.getElementById(
      "contribution-count"
    ).textContent = `Total Contributions This Year: ${total}`;
  })
  .catch((error) => {
    console.error("Error fetching contributions:", error);
    document.getElementById("contribution-count").textContent =
      "Unable to load contributions.";
  });
