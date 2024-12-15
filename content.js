chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'autofill') {
    const { username, password } = request.credentials;
    document.querySelectorAll('input[type="text"], input[type="email"]').forEach(input => {
      if (input.value === '') {
        input.value = username;
      }
    });
    document.querySelectorAll('input[type="password"]').forEach(input => {
      if (input.value === '') {
        input.value = password;
      }
    });
  }
});

chrome.runtime.sendMessage({ action: 'getCredentials', url: window.location.href }, (response) => {
  if (response && response.credentials) {
    chrome.runtime.sendMessage({ action: 'autofill', credentials: response.credentials });
  }
});

document.querySelectorAll('form').forEach(form => {
  form.addEventListener('submit', (event) => {
    const username = form.querySelector('input[type="text"], input[type="email"]').value;
    const password = form.querySelector('input[type="password"]').value;
    if (username && password) {
      chrome.storage.sync.set({ [window.location.href]: { username, password } }, () => {
        console.log('Credentials saved!');
      });
    }
  });
});