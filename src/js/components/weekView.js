/**
 * 週間ビューコンポーネント
 */
import { getWeekStart, getWeekEnd, formatDate, isSameDay, generateTimeSlots } from '../utils/dateUtils.js';

// 週表示
export async function renderWeekView(container, currentDate, reservations, getCurrentDate) {
    const weekStart = getWeekStart(currentDate);
    const weekEnd = getWeekEnd(currentDate);
    const timeSlots = generateTimeSlots();
    
    let html = '<div class="week-view">';
    html += '<div class="week-grid">';
    
    // ヘッダー行
    html += '<div class="week-header-row">';
    html += '<div class="week-time-header"></div>';
    
    for (let dayIndex = 0; dayIndex < 5; dayIndex++) {
        const date = new Date(weekStart);
        date.setDate(date.getDate() + dayIndex);
        const dayNames = ['月', '火', '水', '木', '金'];
        const isToday = isSameDay(date, getCurrentDate());
        
        // 平日のみ表示なので祝日判定不要
        html += `<div class="week-day-header ${isToday ? 'today' : ''}">
            <div class="day-name">${dayNames[dayIndex]}</div>
            <div class="day-date"><span>${date.getDate()}</span></div>
        </div>`;
    }
    html += '</div>';
    
    // コンテンツグリッド
    html += '<div class="week-content-grid">';
    
    // 時間軸カラム
    html += '<div class="week-time-column">';
    timeSlots.forEach(timeSlot => {
        const isHourMark = timeSlot.endsWith(':00') || timeSlot.endsWith(':30');
        html += `<div class="week-time-label ${isHourMark ? 'hour-mark' : ''}">${timeSlot}</div>`;
    });
    html += '</div>';
    
    // 各日のカラム
    for (let dayIndex = 0; dayIndex < 5; dayIndex++) {
        const date = new Date(weekStart);
        date.setDate(date.getDate() + dayIndex);
        const dateStr = formatDate(date);
        const today = getCurrentDate();
        today.setHours(0, 0, 0, 0);
        const isPastDate = date < today;
        
        // 平日のみ表示なので全日予約可能
        html += `<div class="week-day-column">`;
        
        // 時間セル
        timeSlots.forEach((timeSlot, timeIndex) => {
            html += `<div class="week-cell ${isPastDate ? 'past' : ''}" 
                         data-date="${dateStr}" 
                         data-time="${timeSlot}"
                         data-slot-index="${timeIndex}"
                         onclick="selectWeekTimeSlot('${dateStr}', '${timeSlot}')">
                    </div>`;
        });
        
        // その日の予約を配置
        const dayReservations = getDayReservations(date, reservations);
        dayReservations.forEach(reservation => {
            const reservationHtml = createReservationComponent(reservation, timeSlots, getCurrentDate);
            html += reservationHtml;
        });
        
        // 今日の場合は現在時刻ラインを追加
        const isToday = isSameDay(date, getCurrentDate());
        if (isToday) {
            const currentTimeLine = createCurrentTimeLine(getCurrentDate);
            if (currentTimeLine) {
                html += currentTimeLine;
            }
        }
        
        html += '</div>';
    }
    
    html += '</div>';
    html += '</div>';
    html += '</div>';
    container.innerHTML = html;
    
    // カレンダー描画完了後にテーマカラーを適用
    setTimeout(() => {
        if (typeof applyDepartmentThemeColors === 'function') {
            applyDepartmentThemeColors();
        }
    }, 50);
}

// 週間ビューの予約配置を更新する関数
export function updateWeekViewReservations(currentDate, currentView, reservations, getCurrentDate) {
    if (currentView !== 'week') return;
    
    const weekViewContainer = document.querySelector('.week-view');
    if (!weekViewContainer) return;
    
    // 現在の予約要素をすべて削除
    const existingReservations = weekViewContainer.querySelectorAll('.week-reservation');
    existingReservations.forEach(el => el.remove());
    
    // 予約を再配置
    const timeSlots = generateTimeSlots();
    const weekStart = getWeekStart(currentDate);
    
    for (let i = 0; i < 5; i++) {
        const date = new Date(weekStart);
        date.setDate(date.getDate() + i);
        
        const dayReservations = getDayReservations(date, reservations);
        const dayColumn = weekViewContainer.querySelector(`.week-day-column:nth-child(${i + 2})`); // ヘッダー列分+1
        
        if (dayColumn) {
            dayReservations.forEach(reservation => {
                const reservationHtml = createReservationComponent(reservation, timeSlots, getCurrentDate);
                if (reservationHtml) {
                    dayColumn.insertAdjacentHTML('beforeend', reservationHtml);
                }
            });
        }
    }
    
    // テーマカラーを再適用
    setTimeout(() => {
        if (typeof applyDepartmentThemeColors === 'function') {
            applyDepartmentThemeColors();
        }
    }, 10);
}

// 指定日の予約を取得
function getDayReservations(date, reservations) {
    const dateStr = formatDate(date);
    return reservations.filter(res => res.date === dateStr);
}


// 動的な高さを取得する関数
function getWeekTimeHeaderHeight() {
    // 画面高さから動的に計算（CSSと同じロジック）
    const viewportHeight = window.innerHeight;
    const availableHeight = viewportHeight - 200; // ヘッダーやマージン分を除外
    const calculatedHeight = availableHeight / 37; // 37スロット分
    const minHeight = 20; // 最小高さ
    
    return Math.max(minHeight, calculatedHeight);
}

// 時間形式を正規化する関数（HH:MM形式に統一）
function normalizeTimeFormat(timeString) {
    // "HH:MM:SS" または "H:MM" → "HH:MM"
    const timePart = timeString.split(':');
    const hour = timePart[0].padStart(2, '0');
    const minute = timePart[1].padStart(2, '0');
    return `${hour}:${minute}`;
}

// 予約コンポーネントを作成
function createReservationComponent(reservation, timeSlots, getCurrentDate) {
    const rawStartTime = reservation.start_datetime.split(' ')[1].substring(0, 5);
    const rawEndTime = reservation.end_datetime.split(' ')[1].substring(0, 5);
    
    // 時間形式を正規化
    const startTime = normalizeTimeFormat(rawStartTime);
    const endTime = normalizeTimeFormat(rawEndTime);
    
    // 開始時間のスロットインデックスを取得
    const startSlotIndex = timeSlots.indexOf(startTime);
    if (startSlotIndex === -1) {
        console.warn(`時間スロットが見つかりません: ${startTime}`, {
            rawStartTime,
            normalizedStartTime: startTime,
            availableSlots: timeSlots.slice(0, 5) // デバッグ用に最初の5スロットを表示
        });
        return '';
    }
    
    // 予約の継続時間（分）を計算
    const startMinutes = timeToMinutes(startTime);
    const endMinutes = timeToMinutes(endTime);
    const durationMinutes = endMinutes - startMinutes;
    
    // 動的な高さを取得
    const cellHeight = getWeekTimeHeaderHeight();
    
    // 高さを計算（15分 = 1セル分）
    const height = ((durationMinutes / 15) * cellHeight) - 4;

    
    // 開始位置を計算
    // 動的なセル高さに基づいて位置を計算
    const topPosition = startSlotIndex * cellHeight; // セル位置 + マージン
    
    // 継続時間に応じて表示内容を変更
    let displayContent = '';
    if (durationMinutes <= 15) {
        // 15分の場合：タイトルのみ
        displayContent = `${reservation.title}`;
    } else if (durationMinutes <= 30) {
        // 30分の場合：時間とタイトル
        displayContent = `<div class="reservation-time">${startTime}～${endTime}</div><div class="reservation-title">${reservation.title}</div>`;
    } else {
        // 45分以上の場合：時間、タイトル、予約者
        displayContent = `<div class="reservation-time">${startTime}～${endTime}</div><div class="reservation-title">${reservation.title}</div><div class="reservation-user">${reservation.user_name || '予約者不明'}</div>`;
    }

    const isPast = new Date(reservation.end_datetime) < getCurrentDate();
    const canEdit = reservation.can_edit ? 'editable' : '';
    const departmentClass = reservation.department ? `dept--${String(reservation.department).padStart(2, '0')}` : 'dept--00';
    
    return `<div class="week-reservation ${reservation.group_id ? 'recurring' : ''} ${isPast ? 'past' : ''} ${canEdit} ${departmentClass}" 
                 style="top: ${topPosition}px; height: ${height}px;"
                 onclick="showReservationDetail(${reservation.id})"
                 title="${reservation.title} (${startTime}-${endTime})${reservation.group_id ? ' - 繰り返し予約' : ''}">
                ${displayContent}
            </div>`;
}

// 時間を分に変換
function timeToMinutes(timeString) {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
}

// 現在時刻ラインを作成
function createCurrentTimeLine(getCurrentDate) {
    const now = getCurrentDate();
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();

    // 営業時間外の場合は表示しない
    if (currentHours < 9 || currentHours >= 18) {
        return null;
    }

    // 現在時刻を15分単位に調整
    const totalMinutes = (currentHours - 9) * 60 + currentMinutes;
    const slotIndex = Math.floor(totalMinutes / 15);
    const slotOffset = (totalMinutes % 15) / 15;

    // 動的なセル高さを取得
    const cellHeight = getWeekTimeHeaderHeight();

    // 位置を計算（cellHeight per slot + offset）
    const position = slotIndex * cellHeight + (slotOffset * cellHeight);

    return `<div class="current-time-line" style="top: ${position}px;">
                <div class="current-time-marker"></div>
            </div>`;
}

