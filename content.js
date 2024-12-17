chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.action === "fillForm") {
    const inputPassword = prompt("Enter your master password to autofill:");
    if (!inputPassword) return;

    const isVerified = await verifyMasterPassword(inputPassword);
    if (!isVerified) {
      alert("Incorrect master password.");
      sendResponse({ success: false });
      return;
    }

    const { hostname } = window.location;
    const credentials = await getCredentials(hostname);

    if (credentials.length > 0) {
      const usernameField = document.querySelector("input[type='text']") || document.querySelector("input:not([type='password'])");
      const passwordField = document.querySelector("input[type='password']");

      if (usernameField) usernameField.value = credentials[0].username;
      if (passwordField) passwordField.value = credentials[0].password;

      alert("Credentials autofilled!");
      sendResponse({ success: true });
    } else {
      alert("No credentials saved for this site.");
      sendResponse({ success: false });
    }
  }
});

async function verifyMasterPassword(inputPassword) {
  const storedData = await chrome.storage.local.get("masterPasswordHash");
  const storedHash = storedData.masterPasswordHash;

  if (!storedHash) {
    alert("No master password set. Please set one.");
    return false;
  }

  const inputHash = await hash(inputPassword);
  return inputHash === storedHash;
}

async function hash(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function getCredentials(hostname) {
  const savedData = await chrome.storage.local.get("credentials");
  const credentials = savedData.credentials || [];
  return credentials.filter((entry) => entry.hostname === hostname);
}
