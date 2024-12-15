document.getElementById('save').addEventListener('click', () => {
  const url = document.getElementById('url').value;
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  if (url && username && password) {
    chrome.storage.sync.set({ [url]: { username, password } }, () => {
      alert('Credentials saved!');
    });
  } else {
    alert('Please fill in all fields.');
  }
});

document.getElementById('view-credentials').addEventListener('click', () => {
  chrome.tabs.create({ url: chrome.runtime.getURL('credentials.html') });
});
