chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "autofill",
    title: "Autofill Login",
    contexts: ["editable"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "autofill") {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: autofillWithMasterPassword
    });
  }
});