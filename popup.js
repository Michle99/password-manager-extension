document.getElementById("set-master-password").addEventListener("click", async () => {
  const password = prompt("Set your master password:");
  if (!password) return;

  const hashedPassword = await hash(password);
  await chrome.storage.local.set({ masterPasswordHash: hashedPassword });
  alert("Master password set successfully!");
});

async function hash(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function searchCredentials(query) {
  const savedData = await chrome.storage.local.get("credentials");
  const credentials = savedData.credentials || [];
  return credentials.filter((cred) => cred.hostname.toLowerCase().includes(query));
}

document.getElementById("search").addEventListener("input", async (e) => {
  const query = e.target.value.toLowerCase();
  const results = await searchCredentials(query);
  displayCredentials(results);
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