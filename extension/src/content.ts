import { browser } from 'webextension-polyfill-ts';

const observerConfig = {
  childList: true,
  attributes: true,
  characterData: true,
  subtree: true
}

const observer = new MutationObserver((mutationsList) => {
  const battleLog = document.querySelector('.battle-log');
  if (battleLog) {
    const htmlContent = battleLog.innerHTML;
    const currentURL = window.location.href;
    browser.runtime.sendMessage({ action: 'battleLogChange', content: htmlContent, url: currentURL });
  }
})

const observeBattleLog = () => {
  const battleLog = document.querySelector('.battle-log');
  if (battleLog) {
    observer.observe(battleLog, observerConfig);
  }
}

// Initial Observation
observeBattleLog();

browser.runtime.onMessage.addListener((request, sender) => {
  if (request.action === 'urlChange') {
    if(request.content.includes('https://play.pokemonshowdown.com/battle-')) {
      observeBattleLog();
    }
  }
})
