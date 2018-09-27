const taobaoUsersManager = require('electron').remote.require('./js/node_modules/taobao-users-manager.js');
const session = require('electron').remote.session.fromPartition('star');
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
    if (window.location.host === 'login.taobao.com') {
        /*需要登录*/
        $('#J_Quick2Static').click();

        $('#J_SubmitStatic').click(() => {
            let userData = {};
            userData.username = $('#TPL_username_1').val();
            userData.password = $('#TPL_password_1').val();
            userData.cookies = null;
            tempStorage.setItem('taobao-login-data', userData)
            // window.location.href = "shoucang.taobao.com";
        });

        taobaoUsersManager.getCurrentUser((userData) => {
            if (userData !== undefined) {
                $('#TPL_username_1').val(userData.username);
                $('#TPL_password_1').val(userData.password);
            }
        });

    } else {
        taobaoUsersManager.getCurrentUser((userData) => {
            if (userData !== undefined) {
                session.cookies.get({}, (err, cookies) => {
                    userData.cookies = cookies;
                    taobaoUsersManager.addUser(userData);

                    if (window.location.host === 'item.taobao.com') {
                        if (tempStorage.getItem('is_quick_order_monitoring')) {
                            /*点击购买*/
                            let goodType = 0;
                            $('.J_TSaleProp').children('*').eq(goodType).click();
                            $('.J_LinkBuy')[0].click();
                        }
                    }
                });
            }

            if (tempStorage.getItem('is_quick_order_monitoring_')) {
                let orderButton = document.getElementsByClassName('go-btn')[0];
                if (orderButton) {
                    tempStorage.setItem('is_need_order', false);
                    console.log("下订单");
                    document.getElementsByClassName('go-btn')[0].click();
                }
            }
        });

    }
}
