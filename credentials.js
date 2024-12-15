document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.sync.get(null, (items) => {
      const tableBody = document.getElementById('credentials-table');
      for (const url in items) {
        const { username, password } = items[url];
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${url}</td>
          <td>${username}</td>
          <td>${password}</td>
        `;
        tableBody.appendChild(row);
      }
    });
});  