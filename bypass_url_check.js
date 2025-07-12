// ==UserScript==
// @name         绕过链接检查
// @author       izumi0004
// @namespace    https://github.com/izumi0004
// @version      0.0.1
// @description  从QQ等程序打开链接时绕过链接检查，直接访问目标链接。
// @match        https://c.pc.qq.com/*
// @grant        none
// @license      MIT
// ==/UserScript==

(function () {
    'use strict';

    switch (window.location.hostname) {
        case 'c.pc.qq.com':
            const params = new URLSearchParams(window.location.search);
            const url = params.get('url');

            if (url) {
                const decodedUrl = decodeURIComponent(url);
                const targetUrl = new URL(decodedUrl);

                window.location.replace(targetUrl.href);
            }
            break;
    }

})();