import Player from '../models/player.js';

const parserSettings = [
  { key: 'nationality' },
  { key: 'language' },
  { key: 'age' },

  { key: 'weekly_wage', format: 'money' },
  { key: 'yearly_wage', format: 'money' },

  { key: 'position' },
  { key: 'value' }, //TODO: 有可能為固定值, 也可能有上下限: 10-20 這樣的格式
  { key: 'experience' },
  { key: 'special_attributes' },  //TODO: special-parser
  { key: 'market_value', format: 'money' },
  { key: 'fitness', parser: 'first-attr-title' },
  { key: 'club', parser: 'last-text' },

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
  return el.firstChild.textContent.trim();
};

const getFirstTitleAttribute = el => {
  return el.firstChild.getAttribute('title').trim();
};

const getLastText = el => {
  return el.lastChild.textContent.trim();
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

const parse = (el, parser, format) => {
  let value = '';
  switch (parser) {
    case 'first-attr-title': value = getFirstTitleAttribute(el); break;
    case 'last-text'       : value = getLastText(el); break;
    default                : value = getFirstText(el); break;
  }
  switch (format) {
    case 'money': value = formatToMoney(value); break;
    default: /* do nothing */ break;
  }
  return value;
};



//TODO: calc
const getEx = (value, per, type, isNewPlayer) => {
  per = parseInt(per) / 100;
  var max = 0;
  var ratio = 1.0;

  switch (type) {
    case 'scoring':
      ratio = 1.037;
      value = (value * 20) / per;
      max = 14000;
      break;
    case 'passing':
      ratio = 1.036;
      value = (value * 20) / per;
      max = 13000;
      break;
    case 'dueling':
      ratio = 1.036;
      value = (value * 20) / per;
      max = 13000;
      break;
    case 'tactics':
      ratio = 1.036;
      value = value * 20;
      max = 13000;
      break;
    case 'blocking':
      var ratio = 1.039;
      value = (value * 20) / (1 - (1 - per) / 3.7);
      max = 16000;
      break;
    default:
      return false;
  }
  if (isNewPlayer) {
    max = max - 3000;
  }
  let sum;
  let basenum;
  sum = basenum = 200;
  for (var i = 1; i < value; i++) {
    basenum = basenum * ratio;
    var expCost = basenum;
    if (i >= value - 1) {
      expCost = basenum * (value - i);
    }
    if (expCost > max) {
      expCost = max;
    }
    sum += expCost;
  }
  return sum;
};

const getTotalEx = (scoring, passing, dueling, tactics, blocking, per) => {
  return parseInt(getEx(blocking, per, 'blocking') + getEx(dueling, per, 'dueling') + getEx(passing, per, 'passing') + getEx(scoring, per, 'scoring') + getEx(tactics, per, 'tactics'));
};

const getPlayerScore = (total_exp, player_age, talent_value, stamina_value, strength_value, speed_value, position) => {
  var property_score = getPropertyScore(talent_value, stamina_value, strength_value, speed_value);
  var exp_score = getExpScore(total_exp, player_age);
  var score = parseFloat(exp_score) * parseFloat(property_score) / 100;
  score = parseInt(score);
  return parseInt(score);
};

const getPropertyScore = (talent_value, stamina_value, strength_value, speed_value, position) => {
  var property_score = parseFloat(talent_value) * 1.5 + parseFloat(stamina_value) + parseFloat(speed_value);
  if (position !== '守門員') {
    property_score += parseFloat(strength_value);
  } else {
    property_score += 4.4;
  }
  property_score = property_score * 100 / 20.6;
  return parseInt(property_score);
};

const getExpScore = (total_exp, player_age) => {
  player_age = parseFloat(player_age);
  if (player_age < 15.01) {
    player_age = 15.01;
  }
  var exp = (25 - player_age) * 43000;
  var exp_score = 100 * (total_exp + exp) / 430000;
  return parseInt(exp_score);
};






export default el => {
  const elMap = generateElementMap(el),
        playerInfo = {};

  playerInfo.name = getFirstText(el.querySelector('h2'));
  parserSettings.forEach(setting => {
    const key = 'player_' + setting.key,
          i18nKey = chrome.i18n.getMessage(key);
    playerInfo[setting.key] = parse(elMap[i18nKey], setting.parser, setting.format);
  });

  //TODO: if age is xxx years (0%) ?
  const age = playerInfo.age.match(/\d+/g);
  playerInfo.ageString = playerInfo.age;
  playerInfo.age = parseFloat((parseInt(age[0], 10) + parseInt(age[1], 10) / 52).toFixed(2));
  playerInfo.agePercent = parseInt(age[2], 10);

  switch (playerInfo.position) {
    case chrome.i18n.getMessage('position_attack'):
      playerInfo.positionExp = playerInfo.attack;
      playerInfo.mainFixedFeature = playerInfo.speed; //TODO: why
      playerInfo.mainTrainableFeature = playerInfo.scoring;
      break;
    case chrome.i18n.getMessage('position_midfield'):
      playerInfo.positionExp = playerInfo.midfield;
      playerInfo.mainFixedFeature = playerInfo.power;
      playerInfo.mainTrainableFeature = playerInfo.passing;
      break;
    case chrome.i18n.getMessage('position_defense'):
      playerInfo.positionExp = playerInfo.defense;
      playerInfo.mainFixedFeature = playerInfo.power;
      playerInfo.mainTrainableFeature = playerInfo.dueling;
      break;
    case chrome.i18n.getMessage('position_goalkeeping'):
      playerInfo.positionExp = playerInfo.goalkeeping;
      playerInfo.mainFixedFeature = playerInfo.speed;
      playerInfo.mainTrainableFeature = playerInfo.blocking;
      break;
  }

  console.log(playerInfo)

  playerInfo.total_exp = getTotalEx(playerInfo.scoring, playerInfo.passing, playerInfo.dueling, playerInfo.tactics, playerInfo.blocking, playerInfo.agePercent);
  playerInfo.player_score = getPlayerScore(playerInfo.total_exp, playerInfo.age, playerInfo.talent, playerInfo.endurance, playerInfo.power, playerInfo.speed, playerInfo.position);
  playerInfo.property_score = getPropertyScore(playerInfo.talent, playerInfo.endurance, playerInfo.power, playerInfo.speed, playerInfo.position);
  playerInfo.exp_score = getExpScore(playerInfo.total_exp, playerInfo.age);

  return playerInfo;
};
