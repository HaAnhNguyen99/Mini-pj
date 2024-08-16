const path = 'http://127.0.0.1:3000/Frontend/';
// const API = 'https://66b83ef23ce57325ac76b541.mockapi.io/courses/';

const url = window.location.href;
const parsedUrl = new URL(url);
const baseUrl = `${parsedUrl.origin}/`;
