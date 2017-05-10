// export default class Player {
//   constructor(values) {
//     this.name = values.name || '';
//     this.nationality = values.nationality || '';
//     this.language = values.language || '';
//     this.age = values.age || '';

//     this.weekly_wage = values.weekly_wage || '';
//     this.yearly_wage = values.yearly_wage || '';

//     this.position = values.position || '';
//     this.value = values.value || '';
//     this.experience = values.experience || '';
//     this.special_attributes = values.special_attributes || '';
//     this.market_value = values.market_value || '';
//     this.fitness = values.fitness || '';
//     this.team = values.team || '';

//     this.talent = values.talent || '';
//     this.scoring = values.scoring || '';
//     this.attack = values.attack || '';

//     this.endurance = values.endurance || '';
//     this.passing = values.passing || '';
//     this.midfield = values.midfield || '';

//     this.power = values.power || '';
//     this.dueling = values.dueling || '';
//     this.defense = values.defense || '';

//     this.speed = values.speed || '';
//     this.blocking = values.blocking || '';
//     this.goalkeeping = values.goalkeeping || '';

//     this.tactics = values.tactics || '';
//     this.flank = values.flank || '';

//     this.number_of_fixed_attribute_trainings = values.number_of_fixed_attribute_trainings || '';
//     this.next_fixed_training_cost = values.next_fixed_training_cost || '';
//     this.training_morale = values.training_morale || '';
//   }

// }

export const getExpScore = (total_exp, player_age) => {
  player_age = parseFloat(player_age);
  if (player_age < 15.01) {
    player_age = 15.01;
  }
  let exp = (25 - player_age) * 43000;
  let exp_score = 100 * (total_exp + exp) / 430000;
  return parseInt(exp_score);
};

export const getExpScore2 = (total_exp, player_age) => {
  player_age = parseFloat(player_age);
  if (player_age < 15.01) {
    player_age = 15.01;
  }
  let exp = (25 - player_age) * 46000;
  let exp_score = 100 * (total_exp + exp) / 460000;
  return parseInt(exp_score);
};

export const futureExp = (age, player, array, exp, talent, trainMultiple, trainAddition, skill) => {
  if (age <= parseInt(array[0])) {
    return '-';
  }
  let fexp = 0;
  if (skill >= 0) {
    fexp = parseInt(((age - parseInt(array[0])) * 52 - parseInt(array[1])) * talent * trainMultiple * (1 + trainAddition / 100) + exp + (age - parseInt(array[0]) - parseInt(array[1]) / 52) * 10900 * 1.25);
  } else {
    fexp = parseInt(((age - parseInt(array[0])) * 52 - parseInt(array[1])) * talent * trainMultiple * (1 + trainAddition / 100) + exp + (age - parseInt(array[0]) - parseInt(array[1]) / 52) * 10900);
  }
  return parseInt(fexp);
};

export const futurecExp = (age, player, array, exp, talent, trainMultiple, trainAddition, skill, number, per, title) => {
  number = parseFloat(number);
  if (age <= parseInt(array[0])) {
    return '-';
  }
  let fexp = 0;
  if (skill >= 0) {
    fexp = parseInt(((age - parseInt(array[0])) * 52 - parseInt(array[1])) * talent * trainMultiple * (1 + trainAddition / 100) + exp + (age - parseInt(array[0]) - parseInt(array[1]) / 52) * 10900 * 1.25);
  } else {
    fexp = parseInt(((age - parseInt(array[0])) * 52 - parseInt(array[1])) * talent * trainMultiple * (1 + trainAddition / 100) + exp + (age - parseInt(array[0]) - parseInt(array[1]) / 52) * 10900);
  }
  per = parseInt(per) / 100;
  let max = 0;
  let ratio = 1.0;
  let value = 1.0;
  switch (title) {
    case chrome.i18n.getMessage('player_scoring'):
      value = player.scoring;
      ratio = 1.037;
      value = (value * 20) / per;
      max = 11000;
      break;
    case chrome.i18n.getMessage('player_passing'):
      value = player.passing;
      ratio = 1.036;
      value = (value * 20) / per;
      max = 10000;
      break;
    case chrome.i18n.getMessage('player_dueling'):
      value = player.dueling;
      ratio = 1.036;
      value = (value * 20) / per;
      max = 10000;
      break;
    case chrome.i18n.getMessage('player_blocking'):
      value = player.blocking;
      ratio = 1.039;
      value = (value * 20) / (1 - (1 - per) / 3.7);
      max = 13000;
      break;
    case chrome.i18n.getMessage('player_tactics'):
      value = player.tactics;
      ratio = 1.036;
      value = value * 20;
      max = 10000;
      break;
    default:
      return false;
  }
  let cexp = fexp - exp;
  let basenum = 200;
  let i = 1;
  let jd = 0;
  value = Math.round(value);
  do {
    for (i; i < value; i++) {
      basenum = basenum * ratio;
    }
    if (basenum > max) {
      basenum = max;
    }
    jd = cexp / basenum;
    if (jd > 1) {
      let b = parseInt(basenum);
      cexp = cexp - b;
      value = value + 1;
    } else {
      break;
    }
  } while (true);
  let Matt = 0;
  if (age <= 21) {
    age = 21;
  }
  switch (age) {
    case 21:
      Matt = value * 0.05;
      break;
    case 22:
      Matt = value * 0.05 * 0.9887;
      break;
    case 23:
      Matt = value * 0.05 * 0.9713;
      break;
    case 24:
      Matt = value * 0.05 * 0.954;
      break;
    case 25:
      Matt = value * 0.05 * 0.9367;
      break;
    case 26:
      Matt = value * 0.05 * 0.9161;
      break;
    case 27:
      Matt = value * 0.05 * 0.8918;
      break;
    case 28:
      Matt = value * 0.05 * 0.8677;
      break;
    case 29:
      Matt = value * 0.05 * 0.8436;
      break;
    case 30:
      Matt = value * 0.05 * 0.8192;
      break;
    default:
      return false;
  }
  if (title === chrome.i18n.getMessage('player_blocking')) {
    Matt = (Matt + value * 0.05 * 2.7) / 3.7;
  }
  return Matt.toFixed(2);
};
