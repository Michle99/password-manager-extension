document.getElementById("search").addEventListener("input", async (e) => {
  const query = e.target.value.toLowerCase();
  const savedData = await chrome.storage.local.get("credentials");
  const credentials = savedData.credentials || [];
  const filtered = credentials.filter((cred) => cred.hostname.toLowerCase().includes(query));

  displayCredentials(filtered);
});

function displayCredentials(credentials) {
  const container = document.getElementById("credential-list");
  container.innerHTML = "";

  credentials.forEach((cred) => {
    const item = document.createElement("div");
    item.classList.add("credential-item");
    item.textContent = `${cred.hostname} - ${cred.username}`;
    container.appendChild(item);
  });
}

// Initial load
chrome.storage.local.get("credentials", (data) => {
  displayCredentials(data.credentials || []);
});
