import * as playerDOM from '../helpers/player-dom.js';

export default class Player {
  constructor(el) {
    const doms = playerDOM.parse(el);
    Object.keys(doms).forEach(key => this[key] = doms[key]);


    // this.name = values.name || '';
    // this.nationality = values.nationality || '';
    // this.language = values.language || '';
    // this.age = values.age || '';

    // this.weekly_wage = values.weekly_wage || '';
    // this.yearly_wage = values.yearly_wage || '';

    // this.position = values.position || '';
    // this.value = values.value || '';
    // this.experience = values.experience || '';
    // this.special_attributes = values.special_attributes || '';
    // this.market_value = values.market_value || '';
    // this.fitness = values.fitness || '';
    // this.team = values.team || '';

    // this.talent = values.talent || '';
    // this.scoring = values.scoring || '';
    // this.attack = values.attack || '';

    // this.endurance = values.endurance || '';
    // this.passing = values.passing || '';
    // this.midfield = values.midfield || '';

    // this.power = values.power || '';
    // this.dueling = values.dueling || '';
    // this.defense = values.defense || '';

    // this.speed = values.speed || '';
    // this.blocking = values.blocking || '';
    // this.goalkeeping = values.goalkeeping || '';

    // this.tactics = values.tactics || '';
    // this.flank = values.flank || '';



    this.setMainSkill();
    // this.number_of_fixed_attribute_trainings = values.number_of_fixed_attribute_trainings || '';
    // this.next_fixed_training_cost = values.next_fixed_training_cost || '';
    // this.training_morale = values.training_morale || '';
    return this;
  }

  //TODO: calc
  getEx(value, per, type, isNewPlayer) {
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

  getEx2(value, per, type) {
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
  };

  getTotalEx(scoring, passing, dueling, tactics, blocking, per) {
    return parseInt(this.getEx(blocking, per, 'blocking') + this.getEx(dueling, per, 'dueling') + this.getEx(passing, per, 'passing') + this.getEx(scoring, per, 'scoring') + this.getEx(tactics, per, 'tactics'));
  };

  getTotalEx2(scoring, passing, dueling, tactics, blocking, per) {
    return parseInt(this.getEx2(blocking, per, 'blocking') + this.getEx2(dueling, per, 'dueling') + this.getEx2(passing, per, 'passing') + this.getEx2(scoring, per, 'scoring') + this.getEx2(tactics, per, 'tactics'));
  };

  getPlayerScore(total_exp, player_age, talent_value, stamina_value, strength_value, speed_value, position) {
    var property_score = this.getPropertyScore(talent_value, stamina_value, strength_value, speed_value);
    var exp_score = this.getExpScore(total_exp, player_age);
    var score = parseFloat(exp_score) * parseFloat(property_score) / 100;
    score = parseInt(score);
    return parseInt(score);
  };

  getPlayerScore2(totalExp, player_age, talent_value, stamina_value, strength_value, speed_value, position, is_obj) {
    var property_score = this.getPropertyScore(talent_value, stamina_value, strength_value, speed_value, position);
    var exp_score = this.getExpScore(totalExp, player_age);
    this.score = parseFloat(exp_score) * parseFloat(property_score) / 100;
    this.score = parseInt(this.score);
    this.train_grade = this.getTrainGrade(totalExp, player_age, talent_value);
    return !!!is_obj ? parseInt(this.score) : { score: this.score, property_score: property_score, exp_score: exp_score, train_grade: this.train_grade };
  };

  getPlayerScore3(totalExp, player_age, talent_value, stamina_value, strength_value, speed_value, position, is_obj) {
    var property_score = this.getPropertyScore(talent_value, stamina_value, strength_value, speed_value, position);
    var exp_score = this.getExpScore2(totalExp, player_age);
    this.score = parseFloat(exp_score) * parseFloat(property_score) / 100;
    this.score = parseInt(this.score);
    this.train_grade = this.getTrainGrade(totalExp, player_age, talent_value);
    return !!!is_obj ? parseInt(this.score) : { score: this.score, property_score: property_score, exp_score: exp_score, train_grade: this.train_grade };
  };
  getPropertyScore(talent_value, stamina_value, strength_value, speed_value, position) {
    var property_score = parseFloat(talent_value) * 1.5 + parseFloat(stamina_value) + parseFloat(speed_value);
    if (position !== '守門員') {
      property_score += parseFloat(strength_value);
    } else {
      property_score += 4.4;
    }
    property_score = property_score * 100 / 20.6;
    return parseInt(property_score);
  };

  getExpScore(total_exp, player_age) {
    player_age = parseFloat(player_age);
    if (player_age < 15.01) {
      player_age = 15.01;
    }
    var exp = (25 - player_age) * 43000;
    var exp_score = 100 * (total_exp + exp) / 430000;
    return parseInt(exp_score);
  };

  getExpScore2(total_exp, player_age) {
    player_age = parseFloat(player_age);
    if (player_age < 15.01) {
      player_age = 15.01;
    }
    var exp = (25 - player_age) * 46000;
    var exp_score = 100 * (total_exp + exp) / 460000;
    return parseInt(exp_score);
  };

  getTrainGrade(totalExp, player_age, talent_value) {
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
      if (i > 107) {grade = 9;}
      else if (i > 95) {grade = 8;}
      else if (i > 83) {grade = 7;}
      else if (i > 71) {grade = 6;}
      else {grade = 5;}
    } else if (totalExp > 6 * exp + exp22) { grade = 10; } else if (totalExp < 6 * exp + exp22) {
      var exp1 = 5 * exp11 + (age2 - 5) * exp23 + age3 * exp42;
      var i = parseInt((totalExp - exp1) / (talent_value * (52 * age2 + age3)));
      if (i > 107) {grade = 9;}
      else if (i > 95) {grade = 8;}
      else if (i > 83) {grade = 7;}
      else if (i > 71) {grade = 6;}
      else {grade = 5;}
    }

    return parseInt(grade);
    //  return parseFloat(grade);
  };

  futureExp(age, player, array, exp, talent, trainMultiple, trainAddition, skill) {
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
  }

  futurecExp(age, player, array, exp, talent, trainMultiple, trainAddition, skill, number, per, title) {
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
  }

  setMainSkill() {
    //TODO: if age is xxx years (0%) ?
    const age = this.age.match(/\d+/g);
    this.age_string = this.age.match(/(.*)\(.*\)/)[1];
    this.age = parseFloat((parseInt(age[0], 10) + parseInt(age[1], 10) / 52).toFixed(2));
    this.age_array = [age[0], age[1]];
    this.age_percent = parseInt(age[2], 10);
    this.training_morale = this.training_morale ? this.training_morale.match(/\((.*)\)/)[1] : 0;


    this.total_exp = this.getTotalEx(this.scoring, this.passing, this.dueling, this.tactics, this.blocking, this.age_percent);
    this.player_score = this.getPlayerScore(this.total_exp, this.age, this.talent, this.endurance, this.power, this.speed, this.position);
    this.property_score = this.getPropertyScore(this.talent, this.endurance, this.power, this.speed, this.position);
    this.exp1 = this.exp_score = this.getExpScore(this.total_exp, this.age);
    //======
    this.exp2 = this.getExpScore2(this.total_exp, this.age);
    this.total_exp2 = this.getTotalEx2(this.scoring, this.passing, this.dueling, this.tactics, this.blocking, this.age_percent);
    let age_t = (parseInt(this.age_array[0]) + this.age_array[1] / 52.0).toFixed(2);
    // const ps = getPlayerScore3(this.total_exp2, this.age, this.talent, this.endurance, this.power, this.speed, this.position, true);
    this.expscore1 = this.getPlayerScore2(this.total_exp2, this.age, this.talent, this.endurance, this.power, this.speed, this.position, true).exp_score;
    // this = {
    //   ...this,
    //   ...ps
    // };
    this.player_score2 = chrome.i18n.getMessage('player_score2_value').format(this.train_grade, this.score, this.property_score, this.exp_score);


    switch (this.position) {
      case chrome.i18n.getMessage('position_attack'):
        this.position_exp = this.attack;
        this.main_fixed_feature = this.speed; //TODO: why
        this.main_trainable_feature = this.scoring;
        this.position_skill_name = chrome.i18n.getMessage('player_scoring');
        break;
      case chrome.i18n.getMessage('position_midfield'):
        this.position_exp = this.midfield;
        this.main_fixed_feature = this.power;
        this.main_trainable_feature = this.passing;
        this.position_skill_name = chrome.i18n.getMessage('player_passing');
        break;
      case chrome.i18n.getMessage('position_defense'):
        this.position_exp = this.defense;
        this.main_fixed_feature = this.power;
        this.main_trainable_feature = this.dueling;
        this.position_skill_name = chrome.i18n.getMessage('player_dueling');
        break;
      case chrome.i18n.getMessage('position_goalkeeping'):
        this.position_exp = this.goalkeeping;
        this.main_fixed_feature = this.speed;
        this.main_trainable_feature = this.blocking;
        this.position_skill_name = chrome.i18n.getMessage('player_blocking');
        break;
    }
  }
}


// export getExpScore = (total_exp, player_age) {
//   player_age = parseFloat(player_age);
//   if (player_age < 15.01) {
//     player_age = 15.01;
//   }
//   let exp = (25 - player_age) * 43000;
//   let exp_score = 100 * (total_exp + exp) / 430000;
//   return parseInt(exp_score);
// };

// export const getExpScore2 = (total_exp, player_age) => {
//   player_age = parseFloat(player_age);
//   if (player_age < 15.01) {
//     player_age = 15.01;
//   }
//   let exp = (25 - player_age) * 46000;
//   let exp_score = 100 * (total_exp + exp) / 460000;
//   return parseInt(exp_score);
// };

// export const futureExp = (age, player, array, exp, talent, trainMultiple, trainAddition, skill) => {
//   if (age <= parseInt(array[0])) {
//     return '-';
//   }
//   let fexp = 0;
//   if (skill >= 0) {
//     fexp = parseInt(((age - parseInt(array[0])) * 52 - parseInt(array[1])) * talent * trainMultiple * (1 + trainAddition / 100) + exp + (age - parseInt(array[0]) - parseInt(array[1]) / 52) * 10900 * 1.25);
//   } else {
//     fexp = parseInt(((age - parseInt(array[0])) * 52 - parseInt(array[1])) * talent * trainMultiple * (1 + trainAddition / 100) + exp + (age - parseInt(array[0]) - parseInt(array[1]) / 52) * 10900);
//   }
//   return parseInt(fexp);
// };

// export const futurecExp = (age, player, array, exp, talent, trainMultiple, trainAddition, skill, number, per, title) => {
//   number = parseFloat(number);
//   if (age <= parseInt(array[0])) {
//     return '-';
//   }
//   let fexp = 0;
//   if (skill >= 0) {
//     fexp = parseInt(((age - parseInt(array[0])) * 52 - parseInt(array[1])) * talent * trainMultiple * (1 + trainAddition / 100) + exp + (age - parseInt(array[0]) - parseInt(array[1]) / 52) * 10900 * 1.25);
//   } else {
//     fexp = parseInt(((age - parseInt(array[0])) * 52 - parseInt(array[1])) * talent * trainMultiple * (1 + trainAddition / 100) + exp + (age - parseInt(array[0]) - parseInt(array[1]) / 52) * 10900);
//   }
//   per = parseInt(per) / 100;
//   let max = 0;
//   let ratio = 1.0;
//   let value = 1.0;
//   switch (title) {
//     case chrome.i18n.getMessage('player_scoring'):
//       value = player.scoring;
//       ratio = 1.037;
//       value = (value * 20) / per;
//       max = 11000;
//       break;
//     case chrome.i18n.getMessage('player_passing'):
//       value = player.passing;
//       ratio = 1.036;
//       value = (value * 20) / per;
//       max = 10000;
//       break;
//     case chrome.i18n.getMessage('player_dueling'):
//       value = player.dueling;
//       ratio = 1.036;
//       value = (value * 20) / per;
//       max = 10000;
//       break;
//     case chrome.i18n.getMessage('player_blocking'):
//       value = player.blocking;
//       ratio = 1.039;
//       value = (value * 20) / (1 - (1 - per) / 3.7);
//       max = 13000;
//       break;
//     case chrome.i18n.getMessage('player_tactics'):
//       value = player.tactics;
//       ratio = 1.036;
//       value = value * 20;
//       max = 10000;
//       break;
//     default:
//       return false;
//   }
//   let cexp = fexp - exp;
//   let basenum = 200;
//   let i = 1;
//   let jd = 0;
//   value = Math.round(value);
//   do {
//     for (i; i < value; i++) {
//       basenum = basenum * ratio;
//     }
//     if (basenum > max) {
//       basenum = max;
//     }
//     jd = cexp / basenum;
//     if (jd > 1) {
//       let b = parseInt(basenum);
//       cexp = cexp - b;
//       value = value + 1;
//     } else {
//       break;
//     }
//   } while (true);
//   let Matt = 0;
//   if (age <= 21) {
//     age = 21;
//   }
//   switch (age) {
//     case 21:
//       Matt = value * 0.05;
//       break;
//     case 22:
//       Matt = value * 0.05 * 0.9887;
//       break;
//     case 23:
//       Matt = value * 0.05 * 0.9713;
//       break;
//     case 24:
//       Matt = value * 0.05 * 0.954;
//       break;
//     case 25:
//       Matt = value * 0.05 * 0.9367;
//       break;
//     case 26:
//       Matt = value * 0.05 * 0.9161;
//       break;
//     case 27:
//       Matt = value * 0.05 * 0.8918;
//       break;
//     case 28:
//       Matt = value * 0.05 * 0.8677;
//       break;
//     case 29:
//       Matt = value * 0.05 * 0.8436;
//       break;
//     case 30:
//       Matt = value * 0.05 * 0.8192;
//       break;
//     default:
//       return false;
//   }
//   if (title === chrome.i18n.getMessage('player_blocking')) {
//     Matt = (Matt + value * 0.05 * 2.7) / 3.7;
//   }
//   return Matt.toFixed(2);
// };
