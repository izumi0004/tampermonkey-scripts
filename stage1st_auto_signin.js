// ==UserScript==
// @name         s1自动签到
// @author       izumi0004
// @namespace    https://github.com/izumi0004
// @version      0.0.1
// @description  s1自动签到，支持电脑版和手机版
// @match        https://stage1st.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=stage1st.com
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';

    const isMobile = () => {
        const params = new URLSearchParams(window.location.search);
        return params.get('mobile') === '2';
    };

    function autoSignIn() {
        if (!isMobile()) {
            doSignIn(document);
        } else {
            GM_xmlhttpRequest({
                method: 'GET',
                url: 'https://stage1st.com/2b/forum.php?mobile=no',
                annoymous: true,
                headers: {
                    'Cookie': document.cookie,
                },
                onload: (response) => {
                    if (response.status === 200) {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(response.responseText, 'text/html');
                        doSignIn(doc);
                    } else {
                        console.error('访问桌面版出错', response.statusText);
                    }
                },
                onerror: (error) => {
                    console.error('访问桌面版出错', error);
                }
            });
        }
    }

    function doSignIn(doc) {
        const link = doc.querySelector('a[href*="study_daily_attendance-daily_attendance.html"]');
        if (link?.href) {
            console.log('发现签到链接：', link.href);
            fetch(link.href, {
                method: 'GET',
                credentials: 'include'
            }).then(response => {
                if (response.ok) {
                    console.log('签到成功');
                } else {
                    console.error('签到失败');
                }
            }).catch(error => {
                console.error('签到出错', error);
            });
        }
    }

    if (!isMobile()) {
        // hide the sign-in link and separator
        const style = document.createElement('style');
        style.textContent = `
            a[href*="study_daily_attendance-daily_attendance.html"],
            a[href*="study_daily_attendance-daily_attendance.html"] + span.pipe {
                display: none !important;
            }
        `;
        document.head.appendChild(style);
    }

    window.addEventListener('DOMContentLoaded', () => {
        autoSignIn();
    });
})();