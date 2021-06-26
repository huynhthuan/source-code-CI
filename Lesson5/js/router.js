import { getCurrentUser } from './ultils.js';

var root = null;
var useHash = true; // Defaults to: false
var hash = '#!project'; // Defaults to: '#'

window.router = new Navigo(root, useHash, hash);

let $main = document.querySelector('#main .container');

window.router
    .on('/login', function () {
        if (getCurrentUser()) {
            router.navigate('/');
        } else {
            $main.innerHTML = '<login-screen></login-screen>';
        }
    })
    .resolve();

window.router
    .on('/register', function () {
        if (getCurrentUser()) {
            router.navigate('/');
        } else {
            $main.innerHTML = '<register-screen></register-screen>';
        }
    })
    .resolve();

window.router
    .on('/', function () {
        if (getCurrentUser()) {
            $main.innerHTML = '<index-screen></index-screen>';
        } else {
            router.navigate('/login');
        }
    })
    .resolve();

window.router
    .on('/chat', function () {
        if (getCurrentUser()) {
            $main.innerHTML = '<chat-screen></chat-screen>';
        } else {
            router.navigate('/login');
        }
    })
    .resolve();

window.router.notFound(function () {
    $main.innerHTML = 'không tìm thấy trang này';
});
