import css from '../styles/index.styl';
import routerPath from './url-mappings.json';

//TODO: generate prefix url
const paths = location.pathname.split('/');
const prefixUrl = location.origin + '/' + paths[1] + '/' + paths[2];
const btnKeys = ['train', 'youth', 'scout', 'friendlies', 'bsquad'];
const elemContent = document.getElementById('content');
const elemLinks = document.createElement('div');

btnKeys.forEach(key => {
  const link = document.createElement('a');
  link.href = prefixUrl + routerPath[key];
  link.innerText = chrome.i18n.getMessage(key);
  link.className = 'link';
  elemLinks.appendChild(link);
});
elemContent.insertBefore(elemLinks, elemContent.firstChild);
