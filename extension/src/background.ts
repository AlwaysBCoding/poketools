import { browser, Tabs } from 'webextension-polyfill-ts';

console.log(`background script is running: 434`);

const sendMessageToActiveTab = (action: string, content: string, callback?: (response: any) => void) => {
  browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
    if (tabs[0]?.id !== undefined) {
      browser.tabs.sendMessage(tabs[0].id, { action: action, content: content }).then(callback);
    }
  })
}

const handleUpdated = async (tabId: number, changeInfo: Tabs.OnUpdatedChangeInfoType, tabs: Tabs.Tab): Promise<void> => {

  if (changeInfo.url) {
    sendMessageToActiveTab('urlChange', changeInfo.url);
  }

}

browser.runtime.onMessage.addListener((message, sender) => {
  if (message.action === 'battleLogChange') {
    console.log(`GOT BATTLE LOG CHANGE`);
    console.log(message.url);
    console.log(message.content);
  }
});

const initializeListeners = () => {
  browser.tabs.onUpdated.addListener(handleUpdated);
}

initializeListeners();
