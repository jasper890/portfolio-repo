# Chapter 5: GitHub Contributions Fetch

Welcome back! In the previous chapter, [Gemini API Communication](04_gemini_api___communication.md), we learned how our website talks to an external AI service (Google Gemini) to power the chatbot, sending conversation history and receiving responses. We saw that connecting to services outside our website requires specific methods, like using the `fetch` API to send and receive data in a structured way.

Now, we're going to apply a similar idea, but to a different external service: GitHub! Specifically, we want to connect to GitHub's API to get information about the owner of the portfolio and display it on the page.

## What is GitHub Contributions Fetch?

GitHub is a popular platform where developers store and manage their code projects. It also publicly tracks a developer's activity, like how often they contribute to projects (creating code, fixing bugs, etc.). This activity is often shown as a grid of squares on a developer's profile page.

The **GitHub Contributions Fetch** concept is about using code to automatically retrieve this kind of public information from GitHub and show it directly on your portfolio website.

In our project, the goal is to get the *total number of contributions* a user has made to public and private repositories over the last year and display this number on the "About" section of the portfolio. It's like putting a little live stat from your GitHub profile right there on your own site!

## Why Display GitHub Contributions?

For a developer's portfolio, showing recent activity is a great way to:

*   **Demonstrate Engagement:** It proves you're actively coding and involved in projects.
*   **Show Consistency:** A high contribution count over the year shows consistent effort.
*   **Provide a Metric:** It gives visitors a quick, visible sign of your productivity.

Instead of just saying "I code a lot," you can show a number fetched directly from a trusted source like GitHub.

## How Do We Get Data from GitHub?

Just like with the Gemini API, we need a way for our website's code to "talk" to GitHub's systems. GitHub provides an **API** (Application Programming Interface) for this purpose. They offer different ways to access data, but for asking for specific, structured information like contribution counts, their **GraphQL API** is often the most efficient.

Think of GraphQL as a way to **ask for exactly what you need**. Instead of a traditional API where you might request a general "user data" endpoint and get a large package of information you have to sort through, with GraphQL, you write a specific *query* that says, "Just give me the total contributions for this user this year."

To use the GitHub API, especially for anything beyond very basic public data, you typically need to authenticate yourself. This is done using a **Personal Access Token (PAT)**. A PAT is like a special password you generate in your GitHub account settings that gives programs (like our website's script) permission to access certain parts of your GitHub data on your behalf.

## The Process: From Page Load to Display

Here's a simplified flow of what happens when someone visits the page with the About section that includes the contribution count:

```mermaid
sequenceDiagram
    participant Browser
    participant script.js (about.js)
    participant GitHub GraphQL API

    Browser->>script.js: Page loads, runs about.js script
    script.js->>script.js: Prepares GraphQL query (asking for total contributions)
    script.js->>script.js: Adds authentication token (PAT)
    script.js->>GitHub GraphQL API: Sends POST request with query and token (via fetch)
    Note over script.js: Waits for GitHub API response...
    GitHub GraphQL API->>GitHub GraphQL API: Processes query, looks up user data
    GitHub GraphQL API-->>script.js: Sends JSON response with contribution total
    script.js->>script.js: Receives response data
    script.js->>script.js: Extracts total number from JSON
    script.js->>Browser: Finds HTML element for contributions
    script.js->>Browser: Updates text content of the element
    Browser-->>User: User sees contribution count on the page
```

This diagram illustrates the steps: the browser runs our script, which crafts a request with a specific question (the GraphQL query) and proof of identity (the PAT), sends it to GitHub, receives the answer, and then updates the page content with the information.

## Implementing the Fetch (`about.js`)

Let's look at the code snippet from the `about.js` file responsible for this. It uses the same `fetch` function we saw in Chapter 4, but targets the GitHub GraphQL API.

First, setting up the token and the fetch call structure:

```javascript
// --- File: about.js ---

const token = "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"; // !!! Replace with YOUR PAT !!!

fetch("https://api.github.com/graphql", {
  method: "POST", // We are sending data (the query)
  headers: {
    "Content-Type": "application/json", // Telling GitHub we're sending JSON
    Authorization: `Bearer ${token}`, // Sending our authentication token
  },
  body: JSON.stringify({
    // The GraphQL query goes here
    query: ` ... `, // Query defined in the next snippet
  }),
})
  // ... rest of the fetch chain
```

*   `const token = "...";`: This line stores your **Personal Access Token**. **Important:** The token shown here is just an example placeholder. **You MUST replace this with your actual GitHub PAT** for the code to work. Ensure your PAT has the necessary scope (e.g., `public_repo` or `read:user`) to read user data. For a public portfolio, be cautious about directly embedding PATs like this; environment variables or server-side fetching are more secure for private data, but for a public total, this is simpler for demonstration.
*   `fetch("https://api.github.com/graphql", { ... });`: This starts the request using the `fetch` API, targeting GitHub's GraphQL endpoint.
*   `method: "POST"`: GraphQL requests are typically sent using the POST method because they include a request body (the query).
*   `headers: { ... }`:
    *   `"Content-Type": "application/json"`: Tells the server (GitHub) that the data we're sending in the body is in JSON format.
    *   `Authorization: `Bearer ${token}`: This is how we send the PAT. It's a standard way to send tokens, prefixed with `Bearer `. Replace `${token}` with the variable holding your actual token.
*   `body: JSON.stringify({ ... })`: The data sent with the POST request.
    *   `JSON.stringify(...)`: Converts our JavaScript object into a JSON string.
    *   `{ query: ` ... ` }`: The GitHub GraphQL API expects the actual query string to be the value of a key named `query` in the JSON body.

Next, let's look at the GraphQL query itself, which is the `...` part inside the `query` string:

```javascript
// --- File: about.js (part of the query string) ---

query: `
  query { // Declare we are performing a query operation
    user(login: "jasper890") { // Request data for a specific user (replace 'jasper890' with your GitHub username)
      contributionsCollection { // Look into their contributions data
        contributionCalendar { // Specifically the data for the contribution calendar (usually the last year)
          totalContributions // Ask for the total number of contributions
        }
      }
    }
  }
`,
```

*   `query { ... }`: This is the basic structure of a GraphQL query.
*   `user(login: "jasper890")`: We're asking for data about a specific user, identified by their login (GitHub username). **You'll need to replace `"jasper890"` with your actual GitHub username** for this to fetch *your* contributions.
*   `contributionsCollection { ... }`: Inside the user data, we want to look at their contributions information.
*   `contributionCalendar { ... }`: Within the contributions, we are interested in the data related to the contribution calendar graph. This typically covers the last 365 days.
*   `totalContributions`: Finally, inside the calendar data, we specify that we only want the `totalContributions` value.

This query tells GitHub's API precisely the piece of information we need.

Finally, handling the response and updating the page:

```javascript
// --- File: about.js (continuing the fetch chain) ---

}) // Ends the fetch call configuration object
  .then((response) => {
    // Check if the request was successful
    if (!response.ok) {
        throw new Error(`GitHub API responded with status: ${response.status}`);
    }
    // Convert the response body from JSON to a JavaScript object
    return response.json();
  })
  .then((data) => {
    // Check if the response contains valid data and navigate to the total contributions
    const total = data?.data?.user?.contributionsCollection?.contributionCalendar?.totalContributions;

    if (total === undefined || total === null) {
         throw new Error("Could not find totalContributions in GitHub response.");
    }

    // Find the HTML element where we want to display the count
    const contributionElement = document.getElementById("contribution-count");

    if (contributionElement) {
        // Update the text content of that element
        contributionElement.textContent = `Total Contributions This Year: ${total}`;
    } else {
        console.error("HTML element #contribution-count not found!");
    }

  })
  .catch((error) => {
    // Handle any errors that occurred during the fetch or processing
    console.error("Error fetching contributions:", error);
    // Display an error message on the page
    const contributionElement = document.getElementById("contribution-count");
    if (contributionElement) {
       contributionElement.textContent = "Unable to load contributions.";
    }
  });
```

*   `.then((response) => { ... })`: This part runs when the `fetch` request finishes and we get a `response` object back from GitHub.
    *   `if (!response.ok)`: Checks if the HTTP status code is successful (like 200). If not, it throws an error, which will be caught by the `.catch()` block.
    *   `return response.json();`: Reads the response body, assumes it's JSON, and parses it into a JavaScript object. This also returns a Promise, so the next `.then()` waits for this to complete.
*   `.then((data) => { ... })`: This part runs when the JSON data from the response is successfully parsed into the `data` JavaScript object.
    *   `const total = data?.data?.user?.contributionsCollection?.contributionCalendar?.totalContributions;`: This line navigates through the nested structure of the `data` object (which matches the structure we requested in our GraphQL query) to find the `totalContributions` value. The `?.` is "optional chaining" - a safe way to access properties, returning `undefined` if any part of the path doesn't exist, preventing errors.
    *   It includes checks (`if (total === undefined || total === null)`) to ensure the data was found as expected.
    *   `const contributionElement = document.getElementById("contribution-count");`: Finds the specific HTML element on the page (likely a `<p>` or `<div>`) where we want to show the number. You need to make sure you have an element with this `id` in your HTML (`index.html`).
    *   `contributionElement.textContent = `...`: Updates the text inside that HTML element to display the fetched `total`.
*   `.catch((error) => { ... })`: This part runs if anything goes wrong during the fetch or the `.then()` steps (e.g., network issue, invalid token, GitHub API error, data not found).
    *   `console.error(...)`: Logs the error to the browser's developer console, which is helpful for debugging.
    *   It tries to find the contribution element again and updates its text to an error message, so the user knows something went wrong instead of just seeing a blank space.

By combining these pieces, the `about.js` script makes a secure request to the GitHub GraphQL API when the "About" section loads, retrieves the specific data requested by the query (the total contributions), and updates the web page dynamically with that number.

## Conclusion

In this chapter, we explored **GitHub Contributions Fetch**. We learned how to use the `fetch` API to communicate with an external service (GitHub's GraphQL API), how to authenticate using a Personal Access Token (PAT), and how to craft a specific GraphQL query to ask for exactly the data we need (total contributions for a user). We also saw how to process the JSON response received from the API and update an HTML element on our page dynamically with the fetched data. This demonstrates another way we can pull live, external information into our static portfolio site.

Now that we've seen how to fetch a single number from an API, let's look at handling and displaying more structured data, like a list of skills. In the next chapter, we'll dive into [Skill Data & Display](06_skill_data___display_.md).

---

<sub><sup>Generated by [AI Codebase Knowledge Builder](https://github.com/The-Pocket/Tutorial-Codebase-Knowledge).</sup></sub> <sub><sup>**References**: [[1]](https://github.com/jasper890/portfolio-repo/blob/792af8364fb0f758e482ba1a7b7a882cfb0a3832/about.js)</sup></sub>
