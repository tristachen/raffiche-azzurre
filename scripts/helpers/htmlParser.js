import Player from '../models/player.js';
import * as utils from '../utils/common.js';

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
    return el.firstChild.textContent.trim();
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

const parse = (el, parser, format) => {
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

const getEx2 = (value, per, type) => {
  per = parseInt(per) / 100;
  var max = 0;
  switch (type) {
    case 'scoring':
      var ratio = 1.037;
      value = (value * 20) / per;
      max = 11000;
      break;
    case 'passing':
      var ratio = 1.036;
      value = (value * 20) / per;
      max = 10000;
      break;
    case 'dueling':
      var ratio = 1.036;
      value = (value * 20) / per;
      max = 10000;
      break;
    case 'tactics':
      var ratio = 1.036;
      value = value * 20;
      max = 10000;
      break;
    case 'blocking':
      var ratio = 1.039;
      value = (value * 20) / Math.pow(per, 1 / 4);
      max = 13000;
      break;
    default:
      return false;
  }
  //    alert(type+'->'+value);
  let sum, basenum;
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
}

const getTotalEx = (scoring, passing, dueling, tactics, blocking, per) => {
  return parseInt(getEx(blocking, per, 'blocking') + getEx(dueling, per, 'dueling') + getEx(passing, per, 'passing') + getEx(scoring, per, 'scoring') + getEx(tactics, per, 'tactics'));
};

const getTotalEx2 = (scoring, passing, dueling, tactics, blocking, per) => {
  return parseInt(getEx2(blocking, per, 'blocking') + getEx2(dueling, per, 'dueling') + getEx2(passing, per, 'passing') + getEx2(scoring, per, 'scoring') + getEx2(tactics, per, 'tactics'));
};

const getPlayerScore = (total_exp, player_age, talent_value, stamina_value, strength_value, speed_value, position) => {
  var property_score = getPropertyScore(talent_value, stamina_value, strength_value, speed_value);
  var exp_score = getExpScore(total_exp, player_age);
  var score = parseFloat(exp_score) * parseFloat(property_score) / 100;
  score = parseInt(score);
  return parseInt(score);
};

const getPlayerScore2 = (totalExp, player_age, talent_value, stamina_value, strength_value, speed_value, position, is_obj) => {
  var property_score = getPropertyScore(talent_value, stamina_value, strength_value, speed_value, position);
  var exp_score = getExpScore(totalExp, player_age);
  var score = parseFloat(exp_score) * parseFloat(property_score) / 100;
  score = parseInt(score);
  var train_grade = getTrainGrade(totalExp, player_age, talent_value);
  return !!!is_obj ? parseInt(score) : { score: score, property_score: property_score, exp_score: exp_score, train_grade: train_grade };
};

const getPlayerScore3 = (totalExp, player_age, talent_value, stamina_value, strength_value, speed_value, position, is_obj) => {
  var property_score = getPropertyScore(talent_value, stamina_value, strength_value, speed_value, position);
  var exp_score = getExpScore2(totalExp, player_age);
  var score = parseFloat(exp_score) * parseFloat(property_score) / 100;
  score = parseInt(score);
  var train_grade = getTrainGrade(totalExp, player_age, talent_value);
  return !!!is_obj ? parseInt(score) : { score: score, property_score: property_score, exp_score: exp_score, train_grade: train_grade };
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

const getExpScore2 = (total_exp, player_age) => {
  player_age = parseFloat(player_age);
  if (player_age < 15.01) {
    player_age = 15.01;
  }
  var exp = (25 - player_age) * 46000;
  var exp_score = 100 * (total_exp + exp) / 460000;
  return parseInt(exp_score);
};
const getTrainGrade = (totalExp, player_age, talent_value) => {
  player_age = parseFloat(player_age);
  var age = player_age - 15;
  var age1 = player_age - 16;
  var age2 = parseInt(age1);
  var age3 = parseInt((age1 - age2) * 53);
  var exp = talent_value * 120 * 52 + 9000 + 900;
  var exp11 = 9000 + 900;
  var exp12 = talent_value * 108 * 52 + 9000 + 900;
  var exp21 = talent_value * 120 * 52 + 10000 + 900;
  var exp22 = parseInt(player_age - 21) * exp21;
  var exp23 = 10000 + 900;
  var exp33 = parseInt(age) * exp + age3 * talent_value * 120;
  var exp41 = parseInt(exp11 / 52);
  var exp42 = parseInt(exp23 / 52);
  var grade;
  if (player_age < 15) { grade = 11; } else if (player_age < 16 && totalExp >= (age * 53) * talent_value * 120) { grade = 10; } else if (player_age < 16 && totalExp < (age * 53) * talent_value * 120) { grade = 9; } else if (player_age < 17 && totalExp >= exp33) { grade = 10; } else if (player_age < 17 && totalExp < exp33 && totalExp >= (age1 * 53) * talent_value * 108) { grade = 9; } else if (player_age < 17 && totalExp < exp33 && totalExp < (age1 * 53) * talent_value * 108) { grade = 8; } else if (player_age < 21 && totalExp >= exp33) { grade = 10; } else if (player_age < 21 && totalExp < exp33) {
    var exp1 = age2 * exp11 + age3 * exp41;
    var exp2 = totalExp - exp1;
    var i = parseInt(exp2 / (talent_value * (52 * age2 + age3)));
    if (i > 107) grade = 9;
    else if (i > 95) grade = 8;
    else if (i > 83) grade = 7;
    else if (i > 71) grade = 6;
    else grade = 5;
  } else if (totalExp > 6 * exp + exp22) { grade = 10; } else if (totalExp < 6 * exp + exp22) {
    var exp1 = 5 * exp11 + (age2 - 5) * exp23 + age3 * exp42;
    var i = parseInt((totalExp - exp1) / (talent_value * (52 * age2 + age3)));
    if (i > 107) grade = 9;
    else if (i > 95) grade = 8;
    else if (i > 83) grade = 7;
    else if (i > 71) grade = 6;
    else grade = 5;
  }

  return parseInt(grade);
  //  return parseFloat(grade);
}

export default el => {
  let elMap = generateElementMap(el),
        playerInfo = {};

  playerInfo.name = getFirstText(el.querySelector('h2'));
  parserSettings.forEach(setting => {
    const key = 'player_' + setting.key,
          i18nKey = chrome.i18n.getMessage(key);
    if (elMap[i18nKey]) {
      playerInfo[setting.key] = parse(elMap[i18nKey], setting.parser, setting.format);
    }
  });

  //TODO: if age is xxx years (0%) ?
  const age = playerInfo.age.match(/\d+/g);
  playerInfo.age_string = playerInfo.age.match(/(.*)\(.*\)/)[1];
  playerInfo.age = parseFloat((parseInt(age[0], 10) + parseInt(age[1], 10) / 52).toFixed(2));
  playerInfo.age_array = [age[0], age[1]];
  playerInfo.age_percent = parseInt(age[2], 10);
  playerInfo.training_morale = playerInfo.training_morale.match(/\((.*)\)/)[1];

  switch (playerInfo.position) {
    case chrome.i18n.getMessage('position_attack'):
      playerInfo.position_exp = playerInfo.attack;
      playerInfo.main_fixed_feature = playerInfo.speed; //TODO: why
      playerInfo.main_trainable_feature = playerInfo.scoring;
      playerInfo.position_skill_name = chrome.i18n.getMessage('player_scoring');
      break;
    case chrome.i18n.getMessage('position_midfield'):
      playerInfo.position_exp = playerInfo.midfield;
      playerInfo.main_fixed_feature = playerInfo.power;
      playerInfo.main_trainable_feature = playerInfo.passing;
      playerInfo.position_skill_name = chrome.i18n.getMessage('player_passing');
      break;
    case chrome.i18n.getMessage('position_defense'):
      playerInfo.position_exp = playerInfo.defense;
      playerInfo.main_fixed_feature = playerInfo.power;
      playerInfo.main_trainable_feature = playerInfo.dueling;
      playerInfo.position_skill_name = chrome.i18n.getMessage('player_dueling');
      break;
    case chrome.i18n.getMessage('position_goalkeeping'):
      playerInfo.position_exp = playerInfo.goalkeeping;
      playerInfo.main_fixed_feature = playerInfo.speed;
      playerInfo.main_trainable_feature = playerInfo.blocking;
      playerInfo.position_skill_name = chrome.i18n.getMessage('player_blocking');
      break;
  }

  playerInfo.total_exp = getTotalEx(playerInfo.scoring, playerInfo.passing, playerInfo.dueling, playerInfo.tactics, playerInfo.blocking, playerInfo.age_percent);
  playerInfo.player_score = getPlayerScore(playerInfo.total_exp, playerInfo.age, playerInfo.talent, playerInfo.endurance, playerInfo.power, playerInfo.speed, playerInfo.position);
  playerInfo.property_score = getPropertyScore(playerInfo.talent, playerInfo.endurance, playerInfo.power, playerInfo.speed, playerInfo.position);
  playerInfo.exp1 = playerInfo.exp_score = getExpScore(playerInfo.total_exp, playerInfo.age);
  //======
  playerInfo.exp2 = getExpScore2(playerInfo.total_exp, playerInfo.age);
  playerInfo.total_exp2 = getTotalEx2(playerInfo.scoring, playerInfo.passing, playerInfo.dueling, playerInfo.tactics, playerInfo.blocking, playerInfo.age_percent);
  let age_t = (parseInt(playerInfo.age_array[0]) + playerInfo.age_array[1] / 52.0).toFixed(2);
  const ps = getPlayerScore3(playerInfo.total_exp2, playerInfo.age, playerInfo.talent, playerInfo.endurance, playerInfo.power, playerInfo.speed, playerInfo.position, true);
  playerInfo.expscore1 = getPlayerScore2(playerInfo.total_exp2, playerInfo.age, playerInfo.talent, playerInfo.endurance, playerInfo.power, playerInfo.speed, playerInfo.position, true).exp_score;
  playerInfo = {
    ...playerInfo,
    ...ps
  };
  playerInfo.player_score2 = chrome.i18n.getMessage('player_score2_value').format(playerInfo.train_grade, playerInfo.score, playerInfo.property_score, playerInfo.exp_score);
  return playerInfo;
};
