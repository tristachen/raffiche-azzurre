/*

request.get('htxx', {
  data
})
*/

const request = (url, options) => {
  return fetch(url, options);
};

export const get = (url, options) => {
  return request(url, { method: 'GET', credentials: 'include', ...options });
};

export const post = (url, options) => {
  return request(url, { method: 'POST', credentials: 'include', ...options });
};
