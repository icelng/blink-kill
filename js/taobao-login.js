const taobaoUsersManager = require('electron').remote.require('./js/node_modules/taobao-users-manager.js');
const session = require('electron').remote.session.fromPartition('taobao-login');
const tempStorage = require('electron').remote.require('./js/node_modules/temp-storage.js');
const {ipcRenderer} = require('electron');

document.addEventListener("DOMContentLoaded", function(event) {
    var script = document.createElement("script");
    script.src = "https://code.jquery.com/jquery-2.1.4.min.js";
    script.onload = script.onreadystatechange = function() {
        $(document).ready(function() {
            main();
        });
    };
    document.body.appendChild(script);
});

function main() {
    console.log('Hello world!!');
    console.log('Current domain is: ' + document.domain);
    console.log('Current host is: ' + window.location.host);
    console.log('Current href is: ' + window.location.href);

    if (window.location.host === 'login.taobao.com') {
        $('#J_Quick2Static').click();

        $('#J_SubmitStatic').click(() => {
            let userData = {};
            userData.username = $('#TPL_username_1').val();
            userData.password = $('#TPL_password_1').val();
            userData.cookies = null;
            tempStorage.setItem('taobao-login-data', userData)
        });
    } else if (window.location.host === 'i.taobao.com') {
        /*登录成功*/
        let userData = tempStorage.getItem('taobao-login-data');
        session.cookies.get({domain: '.taobao.com'}, (err, cookies) => {
            userData.cookies = cookies;
            taobaoUsersManager.addUser(userData);
            ipcRenderer.sendToHost('login-succeed');
        });
    }
}
