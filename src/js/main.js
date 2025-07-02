/**
 * メインアプリケーション
 */
import { renderSidebar } from './components/sidebar.js';
import { renderMainContent } from './components/mainContent.js';

document.addEventListener('DOMContentLoaded', () => {
    renderSidebar();
    renderMainContent();
});
