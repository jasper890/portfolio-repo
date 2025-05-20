/**
 * Creates skill cards and adds them to the DOM
 * @param {Array} skills - Array of skill objects
 */
export function createSkillCards(skills) {
  const appContainer = document.getElementById("app");

  skills.forEach((skill, index) => {
    // Create card with delayed animation
    setTimeout(() => {
      const card = createSkillCard(skill);
      appContainer.appendChild(card);

      // Animate the progress circle after card appears
      setTimeout(() => {
        animateProgress(card, skill.percentage);
      }, 300);
    }, index * 200); // Stagger the card appearances
  });
}

/**
 * Creates a single skill card element
 * @param {Object} skill - Skill data object
 * @returns {HTMLElement} - The created card element
 */
function createSkillCard(skill) {
  const card = document.createElement("div");
  card.className = "skill-card";

  // Set up HTML structure
  card.innerHTML = `
    <img src="${skill.image}" alt="${skill.title}" class="skill-card-image">
    <div class="skill-card-content">
      <div class="progress-circle-container">
        <svg class="progress-circle" viewBox="0 0 100 100">
          <circle 
            class="progress-circle-bg" 
            cx="50" cy="50" r="46"
          ></circle>
          <circle 
            class="progress-circle-value ${skill.level}" 
            cx="50" cy="50" r="46"
            data-percentage="${skill.percentage}"
          ></circle>
        </svg>
        <div class="progress-percentage">0%</div>
      </div>
      <h3 class="skill-title">${skill.title}</h3>
      <p class="skill-description">${skill.description}</p>
      <div class="skill-level">${capitalizeFirstLetter(skill.level)}</div>
    </div>
  `;

  // Add event listeners
  card.addEventListener("mouseenter", () => {
    const circle = card.querySelector(".progress-circle-value");
    const percentage = parseInt(circle.getAttribute("data-percentage"));
    animateProgress(card, percentage, 0.5); // Quick refresh animation on hover
  });

  return card;
}

/**
 * Animates the progress circle to show the percentage
 * @param {HTMLElement} card - The skill card element
 * @param {number} percentage - The percentage to animate to
 * @param {number} duration - Animation duration in seconds (default: 1.5)
 */
function animateProgress(card, percentage, duration = 1.5) {
  const circle = card.querySelector(".progress-circle-value");
  const percentageText = card.querySelector(".progress-percentage");
  const circumference = 2 * Math.PI * 46; // 2πr where r=46

  // Calculate the offset based on percentage
  const offset = circumference - (percentage / 100) * circumference;

  // Update the stroke dashoffset to create the progress effect
  circle.style.transition = `stroke-dashoffset ${duration}s ease`;
  circle.style.strokeDasharray = `${circumference}`;
  circle.style.strokeDashoffset = offset;

  // Animate the percentage text
  let startValue = parseInt(percentageText.textContent) || 0;
  const endValue = percentage;
  const duration_ms = duration * 1000;
  const startTime = performance.now();

  function updateNumber(timestamp) {
    const progress = Math.min((timestamp - startTime) / duration_ms, 1);
    const currentValue = Math.floor(
      startValue + progress * (endValue - startValue)
    );
    percentageText.textContent = `${currentValue}%`;

    if (progress < 1) {
      requestAnimationFrame(updateNumber);
    }
  }

  requestAnimationFrame(updateNumber);
}

/**
 * Capitalizes the first letter of a string
 * @param {string} string - The string to capitalize
 * @returns {string} - The capitalized string
 */
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
