chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getCredentials') {
    chrome.storage.sync.get([request.url], (result) => {
      if (result[request.url]) {
        sendResponse({ credentials: result[request.url] });
      } else {
        sendResponse({});
      }
    });
    return true; 
  }
});