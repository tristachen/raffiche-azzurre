/*
 * playerDOM.parse();
 */

import Player from '../models/player.js';
import * as utils from '../utils/common.js';
import * as request from '../utils/request.js';

const parserSettings = [
  { key: 'nationality' },
  { key: 'language' },
  { key: 'age' },

  { key: 'weekly_wage', format: 'money' },
  { key: 'yearly_wage', format: 'money' },

  { key: 'position' },
  { key: 'value' }, //TODO: 有可能為固定值, 也可能有上下限: 10-20 這樣的格式
  { key: 'experience' },
  { key: 'special_attributes', parser: 'multiline' },  //TODO: special-parser
  { key: 'market_value', format: 'money' },
  { key: 'fitness', parser: 'first-attr-title' },
  { key: 'team', parser: 'last-text' },

  { key: 'talent' },
  { key: 'scoring' },
  { key: 'attack' },

  { key: 'endurance' },
  { key: 'passing' },
  { key: 'midfield' },

  { key: 'power' },
  { key: 'dueling' },
  { key: 'defense' },

  { key: 'speed' },
  { key: 'blocking' },
  { key: 'goalkeeping' },

  { key: 'tactics' },
  { key: 'flank' },

  { key: 'number_of_fixed_attribute_trainings' },
  { key: 'next_fixed_training_cost' },
  { key: 'training_morale' }
];

const getFirstText = el => {
  if (el && el.firstChild) {
    if (el.firstChild.textContent) {
      return el.firstChild.textContent.trim();
    } else {
      return el.firstChild.getAttribute('title').trim();
    }
  }
};

const getFirstTitleAttribute = el => {
  return el.firstChild.getAttribute('title').trim();
};

const getLastText = el => {
  return el.lastChild.textContent.trim();
};

const getMultiline = el => {
  return [].map.call(el.querySelectorAll('span'), el => el.textContent);
};

const formatToMoney = str => {
  return str.replace(/\D+/g, '');
};

const generateElementMap = el => {
  const elMap = {};

  el.querySelectorAll('th').forEach(th => {
    const key = getFirstText(th),
          td = th.nextElementSibling;
    if (key && td) {
      elMap[key] = td;
    } else {
      /* do nothing */
    }
  });

  return elMap;
};

const parsese = (el, parser, format) => {
  let value = '';
  switch (parser) {
    case 'first-attr-title': value = getFirstTitleAttribute(el); break;
    case 'last-text'       : value = getLastText(el); break;
    case 'multiline'       : value = getMultiline(el); break;
    default                : value = getFirstText(el); break;
  }
  switch (format) {
    case 'money': value = formatToMoney(value); break;
    default: /* do nothing */ break;
  }
  return value;
};

export const parse = el => {
  let elMap = generateElementMap(el),
        playerInfo = {};

  playerInfo.name = getFirstText(el.querySelector('h2'));
  parserSettings.forEach(setting => {
    const key = 'player_' + setting.key,
          i18nKey = chrome.i18n.getMessage(key);
    if (elMap[i18nKey]) {
      playerInfo[setting.key] = parsese(elMap[i18nKey], setting.parser, setting.format);
    }
  });
  return playerInfo;
};
