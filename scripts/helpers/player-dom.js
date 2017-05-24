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

  { key: 'weekly_wage', format: 'number' },
  { key: 'yearly_wage', format: 'number' },

  { key: 'position' },
  { key: 'value' },
  { key: 'experience', format: 'number' },
  { key: 'special_attributes', parser: 'multiline' },
  { key: 'market_value', format: 'number' },
  { key: 'bid_price', format: 'number' },
  { key: 'fitness', parser: 'first-attr-title' },
  { key: 'team', parser: 'last-text' },

  { key: 'talent', format: 'number' },
  { key: 'scoring', format: 'number' },
  { key: 'attack', format: 'number' },

  { key: 'endurance', format: 'number' },
  { key: 'passing', format: 'number' },
  { key: 'midfield', format: 'number' },

  { key: 'power', format: 'number' },
  { key: 'dueling', format: 'number' },
  { key: 'defense', format: 'number' },

  { key: 'speed', format: 'number' },
  { key: 'blocking', format: 'number' },
  { key: 'goalkeeping', format: 'number' },

  { key: 'tactics', format: 'number' },
  { key: 'flank' },

  { key: 'number_of_fixed_attribute_trainings', format: 'number' },
  { key: 'next_fixed_training_cost', format: 'percent' },
  { key: 'training_morale', format: 'morale' }
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

const formatToNumber = str => {
  return parseFloat(str.replace(/[^\d\.]+/g, ''));
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

export const parseDOM = (el, key) => {
  let value = '';
  const setting = parserSettings.find(s => s.key === key),
        parser = setting.parser,
        format = setting.format;
  switch (parser) {
    case 'first-attr-title': value = getFirstTitleAttribute(el); break;
    case 'last-text'       : value = getLastText(el); break;
    case 'multiline'       : value = getMultiline(el); break;
    default                : value = getFirstText(el); break;
  }
  switch (format) {
    case 'money'  : value = formatToNumber(value); break;
    case 'number' : value = formatToNumber(value); break;
    case 'percent': value = parseFloat(value) / 100.0; break;
    case 'morale' : value = value.match(/\((.*)\)/)[1]; break;
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
      playerInfo[setting.key] = parseDOM(elMap[i18nKey], setting.key);
    }
  });
  return playerInfo;
};
