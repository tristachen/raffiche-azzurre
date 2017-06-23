const getStringFormatPlaceHolderRegEx = placeHolderIndex => {
  return new RegExp('({)?\\{' + placeHolderIndex + '\\}(?!})', 'gm');
};

const cleanStringFormatResult = txt => {
  if (txt === null) {
    return '';
  }
  return txt.replace(getStringFormatPlaceHolderRegEx('\\d+'), '');
};

String.prototype.format = function() {
  let txt = this.toString();
  for (let i = 0; i < arguments.length; i++) {
    let exp = getStringFormatPlaceHolderRegEx(i);
    txt = txt.replace(exp, (arguments[i] === null ? '' : arguments[i]));
  }
  return cleanStringFormatResult(txt);
};

export const createButton = (text, onclick, options) => {
  const btn = document.createElement('button');
  btn.textContent = text;
  btn.onclick = onclick;
  return btn;
};

export const getRandom = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};
