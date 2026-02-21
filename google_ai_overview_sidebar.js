// ==UserScript==
// @name         谷歌AI结果侧栏显示
// @author       izumi0004
// @namespace    https://github.com/izumi0004
// @version      0.0.1
// @description  将谷歌搜索结果中的AI概览移至侧栏显示
// @match        https://www.google.com/search*
// @match        https://www.google.com.*/search*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @license      MIT
// ==/UserScript==

(function () {
    'use strict';

    function moveAIOverview() {
        // Find the AI Overview Header
        const headers = Array.from(document.querySelectorAll('h1, h2'));
        const aiHeader = headers.find(h => {
            return ['AI overview', 'AI 概览'].includes(h.textContent);
        });

        if (!aiHeader) return;

        // Find the container block to move
        let aiBlock = null;
        let current = aiHeader;

        while (current) {
            const parent = current.parentElement;

            // Case 1: Child of a block within #rcnt (main content container)
            if (parent?.parentElement?.id === 'rcnt') {
                aiBlock = current;
                break;
            }
            // Case 2: Child of a block within #rso (search results container)
            if (parent?.parentElement?.id === 'rso') {
                aiBlock = current;
                break;
            }
            current = parent;
        }

        if (!aiBlock) {
            console.warn('AI Overview block not found for header:', aiHeader);
            return;
        }
        if (aiBlock.getAttribute('data-ai-moved') === 'true') {
            // Already moved
            return;
        }

        // Reset display to fit the sidebar
        current = aiHeader.parentElement;
        do {
            if (window.getComputedStyle(current).display === 'grid') {
                current.style.display = 'block';
            }
            current = current.parentElement;
        } while (current !== aiBlock);

        // Find or create Sidebar (#rhs)
        let rhs = document.getElementById('rhs');
        if (!rhs) {
            const rcnt = document.getElementById('rcnt');
            if (!rcnt) {
                console.warn('#rcnt not found, cannot insert sidebar');
                return;
            }

            rhs = document.createElement('div');
            rhs.id = 'rhs';
            rhs.style.gridColumn = 'span 7 / -2';
            rcnt.appendChild(rhs);
        }

        // Move the AI block to the sidebar
        rhs.insertBefore(aiBlock, rhs.firstChild);
        aiBlock.setAttribute('data-ai-moved', 'true');

        // Inject style for the moved AI block
        if (document.getElementById('ai-sidebar-styles')) return;
        const style = document.createElement('style');
        style.id = 'ai-sidebar-styles';
        style.textContent = `
            /* Force all children to respect the container width */
            #rhs [data-ai-moved] * {
                max-width: 100% !important;
            }

            /* Hide the #rhs-col container of source cards */
            #rhs [data-ai-moved] [data-container-id="rhs-col"] {
                display: none !important;
            }
            /* Hide "Dive deeper" and sharing buttons */
            #rhs [data-ai-moved] [data-container-id="footer-placeholder"] {
                display: none !important;
            }
            #rhs [data-ai-moved] [data-subtree="dfa"] {
                display: none !important;
            }
        `;
        document.head.appendChild(style);

        expandAIOverview();
    }

    function expandAIOverview() {
        // Expand AI overview block using the "Show More" button
        const buttons = Array.from(document.querySelectorAll('div[role="button"]'));
        const showMoreBtn = buttons.find(btn => {
            return ['Show more AI Overview', '显示更多 AI 概览'].includes(btn.getAttribute('aria-label'));
        });
        if (showMoreBtn) {
            showMoreBtn.click();
        }
    }

    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', moveAIOverview);
    } else {
        moveAIOverview();
    }

    const observer = new MutationObserver((mutations) => {
        expandAIOverview();
    });
    observer.observe(document.body, { childList: true, subtree: true });

})();
