import "style.css";
import { createSkillCards } from "skillCard.js";

document.querySelector("#app").innerHTML = "";

// Define skill data
const skills = [
  {
    id: 1,
    title: "HTML",
    description: "Building structured and semantic web pages",
    image:
      "https://images.pexels.com/photos/270404/pexels-photo-270404.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    percentage: 90,
    level: "advanced",
  },
  {
    id: 2,
    title: "CSS",
    description: "Styling and responsive web design",
    image:
      "https://images.pexels.com/photos/270404/pexels-photo-270404.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    percentage: 85,
    level: "advanced",
  },
  {
    id: 3,
    title: "JavaScript",
    description: "Interactive web development and DOM manipulation",
    image:
      "https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    percentage: 80,
    level: "intermediate",
  },
];

// Create skill cards
createSkillCards(skills);
