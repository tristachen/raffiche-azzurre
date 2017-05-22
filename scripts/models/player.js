import * as request from '../utils/request.js';
import * as playerDOM from '../helpers/player-dom.js';

export default class Player {
  constructor(options = {}) {
    if (options.url) {
      const matches = options.url.match(/player-\d*/i);
      this.id = (matches && matches[0]) || '';
    }
    this.url = options.url;

    //personal info
    this.name               = '';
    this.nationality        = '';
    this.language           = '';
    this.team               = '';
    this.position           = '';
    this.special_attributes = '';
    this.fitness            = ''; //energy
    this.note               = '';
    this.age                = ''; // 幾歲，幾周(0.0)
    this.age_string         = ''; // 幾歲，幾周
    this.age_years          = 0; // 32
    this.age_weeks          = 0; // 2
    this.age_factor         = 0.0; // 0.1
    this.age_number         = 0.0; // 32.4
    this.born               = 0; //青年中心 or 信用點 所創建出來的

    //fixed features
    this.bonus_fixed_feature = 0.0;
    this.talent              = 0.0;
    this.endurance           = 0.0;
    this.power               = 0.0;
    this.speed               = 0.0;

    //trainable features
    this.main_feature      = 0.0;
    this.main_feature_name = '';
    this.scoring           = 0.0;
    this.passing           = 0.0;
    this.dueling           = 0.0;
    this.blocking          = 0.0;
    this.tactics           = 0.0;

    //experience
    this.position_exp = 0;
    this.attack       = 0;
    this.midfield     = 0;
    this.defense      = 0;
    this.goalkeeping  = 0;
    this.flank        = ''; //left/middle/right

    //training info
    this.value          = ''; //30歲以前有最大最小值, 30歲以後為固定值
    this.min_value      = 0.0;
    this.max_value      = 0.0;
    this.experience     = 0;
    this.property_score = 0;
    this.total_exp1     = 0;
    this.total_exp2     = 0;
    this.player_score1  = 0;
    this.player_score2  = 0;
    this.exp_score1     = 0;
    this.exp_score2     = 0;
    this.training_grade = 0;
    this.number_of_fixed_attribute_trainings = 0;
    this.next_fixed_training_cost            = 0.0;
    this.training_morale                     = '';

    //market info
    this.weekly_wage       = 0;
    this.yearly_wage       = 0;
    this.market_value      = 0;
    this.bid_price         = 0;
    this.premium_rate      = 0.0;
    this.transfer_deadline = '';
  }

  fetch() {
    return request.get(this.url).then(doc => {
      this.parse(doc.querySelector('div.center'));
    });
  }

  parse(el) {
    const info = playerDOM.parse(el);
    Object.keys(info).forEach(key => this[key] = info[key]);
    this.computeInfo();
  }

  getTrainingCoefficient(version, type) {
    let value = this[type],
        max = 0,
        ratio = 1.0;
    switch (type) {
      case 'scoring':
        value = (value * 20) / this.age_factor;
        max = version === 2 ? 11000 : 14000;
        ratio = 1.037;
        break;
      case 'passing':
        value = (value * 20) / this.age_factor;
        max = version === 2 ? 10000 : 13000;
        ratio = 1.036;
        break;
      case 'dueling':
        value = (value * 20) / this.age_factor;
        max = version === 2 ? 10000 : 13000;
        ratio = 1.036;
        break;
      case 'tactics':
        value = value * 20;
        max = version === 2 ? 10000 : 13000;
        ratio = 1.036;
        break;
      case 'blocking':
        value = version === 2 ? (value * 20) / Math.pow(this.age_factor, 1 / 4) : (value * 20) / (1 - (1 - this.age_factor) / 3.7);
        max = version === 2 ? 13000 : 16000;
        ratio = 1.039;
        break;
      default:
        return false;
    }
    return { value, max, ratio };
  }

  getTrainingExp(type, version) {
    let per = this.age_factor,
        value = this[type],
        max = 0,
        ratio = 1.0,
        sum = 200,
        basenum = 200;
    let trainingCoefficient = this.getTrainingCoefficient(version, type);
    value = trainingCoefficient.value;
    max = trainingCoefficient.max;
    ratio = trainingCoefficient.ratio;

    for (let i = 1; i < value; i++) {
      basenum = basenum * ratio;
      let expCost = basenum;
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

  getTotalExp(version) {
    const trainingKeys = ['scoring', 'passing', 'dueling', 'blocking', 'tactics'];
    const sum = trainingKeys.reduce((sum, curr) => {
      return sum += this.getTrainingExp(curr, version);
    }, 0);
    return ~~sum;
  }

  getExpScore(version, options = {}) {
    let total_exp = options.total_exp || this.total_exp2,
        age_number = options.age_number || this.age_number,
        coefficient = version === 2 ? 46000 : 43000;
    if (age_number < 15.01) {
      age_number = 15.01;
    }
    let exp = (25 - age_number) * coefficient,
        exp_score = 100 * (total_exp + exp) / (coefficient * 10);
    return ~~exp_score;
  }

  getPropertyScore() {
    let score = this.talent * 1.5 + this.endurance + this.speed;
    if (this.position !== chrome.i18n.getMessage('position_goalkeeping')) {
      score += this.power;
    } else {
      score += 4.4;
    }
    score = score * 100 / 20.6;
    return ~~score;
  }

  getPlayerScore(version) {
    let exp_score = this.getExpScore(version);
    let property_score = this.getPropertyScore();
    let score = exp_score * property_score / 100.0;
    return ~~score;
  }

  getTrainingGrade() {
    let age = this.age_number - 15,
        age1 = this.age_number - 16,
        age2 = parseInt(age1),
        age3 = parseInt((age1 - age2) * 53),
        exp = this.talent * 120 * 52 + 9000 + 900,
        exp11 = 9000 + 900,
        exp12 = this.talent * 108 * 52 + 9000 + 900,
        exp21 = this.talent * 120 * 52 + 10000 + 900,
        exp22 = parseInt(this.age_number - 21) * exp21,
        exp23 = 10000 + 900,
        exp33 = parseInt(age) * exp + age3 * this.talent * 120,
        exp41 = parseInt(exp11 / 52),
        exp42 = parseInt(exp23 / 52),
        grade = 0;

    if (this.age_number < 15) {
      grade = 11;
    } else if (this.age_number < 16 && this.total_exp2 >= (age * 53) * this.talent * 120) {
      grade = 10;
    } else if (this.age_number < 16 && this.total_exp2 < (age * 53) * this.talent * 120) {
      grade = 9;
    } else if (this.age_number < 17 && this.total_exp2 >= exp33) {
      grade = 10;
    } else if (this.age_number < 17 && this.total_exp2 < exp33 && this.total_exp2 >= (age1 * 53) * this.talent * 108) {
      grade = 9;
    } else if (this.age_number < 17 && this.total_exp2 < exp33 && this.total_exp2 < (age1 * 53) * this.talent * 108) {
      grade = 8;
    } else if (this.age_number < 21 && this.total_exp2 >= exp33) {
      grade = 10;
    } else if (this.age_number < 21 && this.total_exp2 < exp33) {
      let exp1 = age2 * exp11 + age3 * exp41;
      let exp2 = this.total_exp2 - exp1;
      let i = parseInt(exp2 / (this.talent * (52 * age2 + age3)));
      if (i > 107) {
        grade = 9;
      } else if (i > 95) {
        grade = 8;
      } else if (i > 83) {
        grade = 7;
      } else if (i > 71) {
        grade = 6;
      } else {
        grade = 5;
      }
    } else if (this.total_exp2 > 6 * exp + exp22) {
      grade = 10;
    } else if (this.total_exp2 < 6 * exp + exp22) {
      let exp1 = 5 * exp11 + (age2 - 5) * exp23 + age3 * exp42;
      let i = parseInt((this.total_exp2 - exp1) / (this.talent * (52 * age2 + age3)));
      if (i > 107) {
        grade = 9;
      } else if (i > 95) {
        grade = 8;
      } else if (i > 83) {
        grade = 7;
      } else if (i > 71) {
        grade = 6;
      } else {
        grade = 5;
      }
    }
    return grade;
  }

  getFutureTotalExp(futureAgeYears, trainer_multiple, trainer_bonus) {
    const BONUS_SPECIAL_ATTRIBUTE = chrome.i18n.getMessage('special_attributes_hardworking');
    let exp = 0;
    if (this.special_attributes.indexOf(BONUS_SPECIAL_ATTRIBUTE) >= 0) {
      exp = parseInt(
        ((futureAgeYears - this.age_years) * 52 - this.age_weeks) *
        this.talent * trainer_multiple *
        (1 + trainer_bonus / 100) + this.total_exp1 +
        ((futureAgeYears - this.age_years) - this.age_weeks / 52) * 10900 * 1.25
      );
    } else {
      exp = parseInt(
        ((futureAgeYears - this.age_years) * 52 - this.age_weeks) *
        this.talent * trainer_multiple *
        (1 + trainer_bonus / 100) + this.total_exp1 +
        ((futureAgeYears - this.age_years) - this.age_weeks / 52) * 10900
      );
    }
    return ~~exp;
  }

  getFutureMainFeature(futureAgeYears, futureTotalExp) {
    let trainingCoefficient = this.getTrainingCoefficient(2, this.main_feature_name),
        max = trainingCoefficient.max,
        ratio = trainingCoefficient.ratio,
        value = trainingCoefficient.value,
        cexp = futureTotalExp - this.total_exp1,
        basenum = 200,
        i = 1,
        jd = 0;

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

    let main_feature = 0;
    if (futureAgeYears <= 21) {
      futureAgeYears = 21;
    }
    switch (futureAgeYears) {
      case 21: main_feature = value * 0.05; break;
      case 22: main_feature = value * 0.05 * 0.9887; break;
      case 23: main_feature = value * 0.05 * 0.9713; break;
      case 24: main_feature = value * 0.05 * 0.9540; break;
      case 25: main_feature = value * 0.05 * 0.9367; break;
      case 26: main_feature = value * 0.05 * 0.9161; break;
      case 27: main_feature = value * 0.05 * 0.8918; break;
      case 28: main_feature = value * 0.05 * 0.8677; break;
      case 29: main_feature = value * 0.05 * 0.8436; break;
      case 30: main_feature = value * 0.05 * 0.8192; break;
      default: return false;
    }
    if (this.main_feature_name === 'blocking') {
      main_feature = (main_feature + value * 0.05 * 2.7) / 3.7;
    }
    return Math.round(main_feature * 100) / 100.0;
  }

  parseAge() {
    const age_array = this.age.match(/\d+/g);
    this.age_string = this.age.match(/(.*)\(.*\)/)[1].trim();
    this.age_years = parseInt(age_array[0], 10);
    this.age_weeks = parseInt(age_array[1], 10);
    this.age_factor = parseFloat(age_array[2]) / 100.0;
    this.age_number = Math.round((this.age_years + this.age_weeks / 52) * 100) / 100.0;
  }

  assignPositionFeature(position, bonus_fixed_feature, main_feature) {
    this.position_exp        = this[position];
    this.bonus_fixed_feature = this[bonus_fixed_feature];
    this.main_feature        = this[main_feature];
    this.main_feature_name   = main_feature;
  }

  computeInfo() {
    this.parseAge();

    this.property_score = this.getPropertyScore();
    this.total_exp1     = this.getTotalExp(1);
    this.total_exp2     = this.getTotalExp(2);
    this.player_score1  = this.getPlayerScore(1);
    this.player_score2  = this.getPlayerScore(2);
    this.exp_score1     = this.getExpScore(1);
    this.exp_score2     = this.getExpScore(2);
    this.score1         = chrome.i18n.getMessage('player_score1_format').format(this.format('total_exp1'), this.format('player_score1'), this.format('exp_score1'));
    this.score2         = chrome.i18n.getMessage('player_score2_format').format(this.format('total_exp2'), this.format('player_score2'), this.format('exp_score2'));
    this.training_grade = this.getTrainingGrade();

    switch (this.position) {
      case chrome.i18n.getMessage('position_attack'):
        this.assignPositionFeature('attack', 'speed', 'scoring');
        break;
      case chrome.i18n.getMessage('position_midfield'):
        this.assignPositionFeature('midfield', 'power', 'passing');
        break;
      case chrome.i18n.getMessage('position_defense'):
        this.assignPositionFeature('defense', 'power', 'dueling');
        break;
      case chrome.i18n.getMessage('position_goalkeeping'):
        this.assignPositionFeature('goalkeeping', 'speed', 'blocking');
        break;
    }
  }

  format(key) {
    let result = this[key] || '';
    switch(key) {
      case 'age_number':
      case 'bonus_fixed_feature':
      case 'talent':
      case 'endurance':
      case 'power':
      case 'speed':
      case 'main_feature':
      case 'scoring':
      case 'passing':
      case 'dueling':
      case 'blocking':
      case 'tactics':
        result = new Intl.NumberFormat(navigator.language, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }).format(result);
        break;

      case 'age_factor':
      case 'premium_rate':
        result = new Intl.NumberFormat(navigator.language, {
          style: 'percent'
        }).format(result);
        break;

      case 'position_exp':
      case 'attack':
      case 'midfield':
      case 'defense':
      case 'goalkeeping':
      case 'experience':
      case 'property_score':
      case 'total_exp1':
      case 'total_exp2':
      case 'player_score1':
      case 'player_score2':
      case 'exp_score1':
      case 'exp_score2':
        result = new Intl.NumberFormat(navigator.language).format(result);
        break;

      case 'weekly_wage':
      case 'yearly_wage':
      case 'market_value':
      case 'bid_price':
        result = '¥ ' + new Intl.NumberFormat(navigator.language).format(result);
        break;

      default:
        result = this[key];
        break;
    }
    return result;
  }
}
