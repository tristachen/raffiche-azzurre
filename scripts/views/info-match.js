if (location.href.search('fixture') < 0) {
  const SELECTOR_RESULTS = '.notes > ul > li';
  const SELECTOR_INSERT_TARGET = '.middle';

  const elResults = document.querySelectorAll(SELECTOR_RESULTS);

  if (elResults.length > 1) {
    const insertTarget = document.querySelector(SELECTOR_INSERT_TARGET);
    const container = document.createElement('div');
    const btnResult = document.createElement('button');
    btnResult.textContent = chrome.i18n.getMessage('spoiler');
    btnResult.onclick = e => document.querySelector(SELECTOR_RESULTS).click();
    container.appendChild(btnResult);
    insertTarget.insertBefore(container, insertTarget.firstChild);
  }
}

