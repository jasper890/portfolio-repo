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
