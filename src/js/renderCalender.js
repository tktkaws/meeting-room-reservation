/**
 * カレンダーレンダリング
 */
import { renderMonthView } from './components/monthView.js';
import { renderWeekView, updateWeekViewReservations } from './components/weekView.js';
import { renderListView } from './components/listView.js';
import { getWeekStart, getWeekEnd } from './utils/dateUtils.js';
import { getJapanTime } from './utils/time-utils.js';
import { saveCurrentView } from './utils/ui-utils.js';

// カレンダー表示機能の変数
let currentView = 'month';
let currentDate = getJapanTime();
let reservations = [];
let allFutureReservations = [];

// ビュー表示処理
export async function renderCalendar() {
    const mainContainer = document.getElementById('main-container');
    if (!mainContainer) return;
    
    if (currentView === 'month') {
        await renderMonthView(mainContainer, currentDate, reservations, getJapanTime);
    } else if (currentView === 'week') {
        await renderWeekView(mainContainer, currentDate, reservations, getJapanTime);
    } else if (currentView === 'list') {
        renderListView(mainContainer, allFutureReservations, getJapanTime);
    }
    
    updateCurrentPeriod();
}

// ビュー切り替え処理
export async function switchView(view) {
    currentView = view;
    saveCurrentView(view);
    updateActiveButton(view);
    
    // データ読み込み（必要に応じて）
    await loadViewData(view);
    
    // ビューを再描画
    await renderCalendar();
}

// アクティブボタンの更新
function updateActiveButton(view) {
    document.querySelectorAll('.btn-view').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`${view}-view`)?.classList.add('active');
}

// ビュー用データの読み込み
async function loadViewData(view) {
    if (view === 'list') {
        // リスト表示の場合は今日以降の全予約データを読み込み
        // await loadAllFutureReservations();
    } else {
        // 月間・週間ビューの場合は現在の期間の予約データを読み込み
        await loadReservations();
    }
}

// 今日に移動
export async function goToToday() {
    currentDate = getJapanTime();
    await loadViewData(currentView);
    await renderCalendar();
}

// id="current-period"の表示を更新
function updateCurrentPeriod() {
    const periodElement = document.getElementById('current-period');
    if (!periodElement) {
        console.error('current-period element not found');
        return;
    }
    
    if (currentView === 'month') {
        periodElement.textContent = `${currentDate.getFullYear()}年 ${currentDate.getMonth() + 1}月`;
    } else if (currentView === 'week') {
        const weekStart = getWeekStart(currentDate);
        const weekEnd = getWeekEnd(currentDate);
        const startMonth = weekStart.getMonth() + 1;
        const startDay = weekStart.getDate();
        const endMonth = weekEnd.getMonth() + 1;
        const endDay = weekEnd.getDate();
        
        if (startMonth === endMonth) {
            periodElement.textContent = `${currentDate.getFullYear()}年 ${startMonth}月 ${startDay}日 - ${endDay}日`;
        } else {
            periodElement.textContent = `${currentDate.getFullYear()}年 ${startMonth}月${startDay}日 - ${endMonth}月${endDay}日`;
        }
    } else if (currentView === 'list') {
        // リスト表示の場合は今日以降の予約を表示していることを示す
        const today = new Date();
        periodElement.textContent = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日以降の予約`;
    }
}

// ナビゲーション
export async function navigateDate(direction) {
    if (currentView === 'month') {
        currentDate.setMonth(currentDate.getMonth() + direction);
    } else if (currentView === 'week') {
        currentDate.setDate(currentDate.getDate() + (direction * 7));
    } else if (currentView === 'list') {
        // リスト表示では日付ナビゲーションは不要（常に今日以降を表示）
        return;
    }
    await loadViewData(currentView);
    await renderCalendar();
}





// 予約データ読み込み
async function loadReservations() {
    try {
        // console.log('loadReservations');
        // const monthStart = getMonthStart(currentDate);
        // const monthEnd = getMonthEnd(currentDate);
        // const startDate = formatDate(getWeekdayStart(new Date(monthStart)));
        // const endDate = formatDate(getWeekdayEnd(new Date(monthEnd)));
        
        // console.log('予約データを読み込み中:', startDate, 'から', endDate);
        
        // const response = await fetch(`api/reservations.php?start_date=${startDate}&end_date=${endDate}`);
        // const result = await response.json();
        
        // console.log('読み込み結果:', result);
        
        // if (result.reservations) {
        //     reservations = result.reservations;
        //     console.log('予約データ:', reservations.length, '件');
        // } else {
        //     reservations = [];
        //     console.log('予約データが空です');
        // }
    } catch (error) {
        console.error('予約データ読み込みエラー:', error);
        showMessage('予約データの読み込みに失敗しました', 'error');
        reservations = [];
    }
}

// 状態変数のゲッター・セッター
export function getCurrentView() {
    return currentView;
}

export function getCurrentDate() {
    return currentDate;
}

export function getReservations() {
    return reservations;
}

export function setReservations(data) {
    reservations = data;
}

export function getAllFutureReservations() {
    return allFutureReservations;
}

export function setAllFutureReservations(data) {
    allFutureReservations = data;
}


