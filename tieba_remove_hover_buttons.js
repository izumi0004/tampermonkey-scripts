// ==UserScript==
// @name         去除贴吧引用和搜索按钮
// @author       izumi0004
// @namespace    https://github.com/izumi0004
// @version      0.0.1
// @description  去除选中文字后弹出的引用和搜索按钮
// @match        https://tieba.baidu.com/p/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @grant        none
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';

    // Select the node that will be observed for mutations
    var targetNode = document.body;

    // Options for the observer (which mutations to observe)
    var config = { attributes: true, childList: true, subtree: true };

    // Callback function to execute when mutations are observed
    var callback = function(mutationsList, observer) {
        for(var mutation of mutationsList) {
            if (mutation.type === 'childList') {
                var reposeButtons = document.querySelectorAll('.creativeplatform-wrap-word-repost-btn');
                for (var i = 0; i < reposeButtons.length; i++) {
                    reposeButtons[i].style.display = 'none';
                }
                var searchIcon = document.getElementById('selectsearch-icon');
                if (searchIcon) {
                    searchIcon.style.display = 'none';
                }
            }
        }
    };

    // Create an observer instance linked to the callback function
    var observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);
})();
