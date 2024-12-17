function createCredentialDropdown(credentials) {
  const dropdown = document.createElement("div");
  dropdown.style.position = "absolute";
  dropdown.style.background = "#fff";
  dropdown.style.border = "1px solid #ccc";
  dropdown.style.padding = "5px";
  dropdown.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)";
  dropdown.style.zIndex = 9999;

  credentials.forEach((cred, index) => {
    const item = document.createElement("div");
    item.textContent = `${cred.username}`;
    item.style.cursor = "pointer";
    item.style.padding = "5px";

    item.addEventListener("click", () => {
      autofillCredential(cred);
      dropdown.remove();
    });

    item.addEventListener("mouseover", () => {
      item.style.background = "#f0f0f0";
    });

    item.addEventListener("mouseout", () => {
      item.style.background = "#fff";
    });

    dropdown.appendChild(item);
  });

  return dropdown;
}

async function injectDropdown() {
  const { hostname } = window.location;
  const credentials = await getCredentials(hostname);
  if (credentials.length === 0) return;

  const passwordInput = document.querySelector("input[type='password']");
  if (passwordInput) {
    const rect = passwordInput.getBoundingClientRect();
    const dropdown = createCredentialDropdown(credentials);

    document.body.appendChild(dropdown);
    dropdown.style.top = `${rect.bottom + window.scrollY}px`;
    dropdown.style.left = `${rect.left + window.scrollX}px`;
  }
}

async function autofillCredential(credential) {
  const usernameField = document.querySelector("input[type='text']") || document.querySelector("input:not([type='password'])");
  const passwordField = document.querySelector("input[type='password']");
  if (usernameField) usernameField.value = credential.username;
  if (passwordField) passwordField.value = credential.password;
}

injectDropdown();