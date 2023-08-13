// Listen for tabs being updated
chrome.tabs.onUpdated.addListener((
  tabId: number,
  changeInfo: chrome.tabs.TabChangeInfo,
  tab: chrome.tabs.Tab
) => {
  if (changeInfo.status === 'complete') {
    console.log(`Tab with ID: ${tabId} has been updated`);
  }
});

console.log('Background script is running');
