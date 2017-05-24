import React from '../utils/react-like.js';
import * as utils from '../utils/common.js';

export const PROP_KEYS = [
  'talent',
  'scoring',
  'endurance',
  'passing',
  'power',
  'dueling',
  'speed',
  'blocking',
  'tactics',
  'special_attributes',
  'main_feature',
  'total_exp2',
  'player_score2',
  'premium_rate',
  'born'
];

const appendCheckList = (target, localStorageKey) => {
  const el = (
    <div>
      <div></div>
      <button id='btnCheck'>{chrome.i18n.getMessage('label_ok')}</button>
    </div>
  );

  PROP_KEYS.forEach(key => {
    const elCheck = (
      <span>
        <input type='checkbox' name='items[]' value={key}/>
        {chrome.i18n.getMessage('player_' + key)}
      </span>
    );
    el.firstChild.appendChild(elCheck);
  });

  let keys = localStorage.getItem(localStorageKey);
  keys = keys ? JSON.parse(keys) : [];
  keys.forEach(key => {
    const input = el.querySelector('input[value={0}]'.format(key));
    if (input) {
      input.checked = true;
    }
  });

  el.querySelector('#btnCheck').onclick = e => {
    const selected = document.querySelectorAll('input[name*=items]:checked');
    keys = [].map.call(selected, el => el.value);
    localStorage.setItem(localStorageKey, JSON.stringify(keys));
    location.reload();
  };
  target.parentElement.insertBefore(el, target);
};

export default appendCheckList;
