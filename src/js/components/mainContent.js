/**
 * メインコンテンツコンポーネント
 */
import { renderCalendar, switchView, navigateDate, goToToday } from '../renderCalender.js';

export function renderMainContent() {
    const isLogin = true;
    const mainContentHTML = `
        <!-- ツールバー -->
        <div class="toolbar">
            <!-- モバイル用ハンバーガーボタン -->
            <button type="button" id="mobile-hamburger-btn" class="mobile-hamburger-btn">
                <span class="material-symbols-outlined">menu</span>
            </button>
            <div class="view-options">
                <button id="month-view" class="btn-view">月</button>
                <button id="week-view" class="btn-view">週</button>
                <button id="list-view" class="btn-view">リスト</button>
            </div>
            <div class="view-controls">
                <button id="today-btn" class="btn-today">今日</button>
                <button id="prev-btn" class="btn-icon">‹</button>
                <button id="next-btn" class="btn-icon">›</button>
                <span id="current-period"></span>
            </div>
            ${isLogin ? `
            <button id="new-reservation-btn" class="btn-primary btn-new-reservation">新規予約</button>
            ` : ''}
        </div>
        <!-- カレンダー表示エリア -->
        <div class="main-container" id="main-container"></div>
    `;


    const mainContent = document.getElementById('main-content');
    if (mainContent) {
        mainContent.innerHTML = mainContentHTML;
        initializeViewButtons();
        renderCalendar();
    }
}

// ビュー切り替えボタンの初期化
function initializeViewButtons() {
    // ビュー切り替えボタン
    document.getElementById('month-view')?.addEventListener('click', () => switchView('month'));
    document.getElementById('week-view')?.addEventListener('click', () => switchView('week'));
    document.getElementById('list-view')?.addEventListener('click', () => switchView('list'));
    // ナビゲーションボタン
    document.getElementById('today-btn')?.addEventListener('click', goToToday);
    document.getElementById('prev-btn')?.addEventListener('click', () => navigateDate(-1));
    document.getElementById('next-btn')?.addEventListener('click', () => navigateDate(1));
    
    // 初期状態でmonth-viewをactiveに設定
    document.getElementById('month-view')?.classList.add('active');
}