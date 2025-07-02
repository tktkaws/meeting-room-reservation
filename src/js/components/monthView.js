/**
 * 月間ビューコンポーネント
 */
import { getMonthStart, getMonthEnd, getWeekdayStart, getWeekdayEnd, formatDate, isSameDay } from '../utils/dateUtils.js';

// 月表示（平日のみ）
export async function renderMonthView(container, currentDate, reservations, getCurrentDate) {
    const monthStart = getMonthStart(currentDate);
    const monthEnd = getMonthEnd(currentDate);
    const calendarStart = getWeekdayStart(new Date(monthStart));
    const calendarEnd = getWeekdayEnd(new Date(monthEnd));
    
    let html = '<div class="month-view">';
    
    // ヘッダー
    const weekdays = ['月', '火', '水', '木', '金'];
    weekdays.forEach(day => {
        html += `<div class="calendar-header">${day}</div>`;
    });
    
    // 日付セル
    let currentDay = new Date(calendarStart);
    while (currentDay <= calendarEnd) {
        if (currentDay.getDay() >= 1 && currentDay.getDay() <= 5) {
            // 現在の日付のコピーを作成（参照問題を回避）
            const displayDate = new Date(currentDay);
            const dayReservations = getDayReservations(displayDate, reservations);
            const isToday = isSameDay(displayDate, getCurrentDate());
            const isCurrentMonth = displayDate.getMonth() === currentDate.getMonth();
            const today = getCurrentDate();
            today.setHours(0, 0, 0, 0);
            const isPastDate = displayDate < today;
            
            // 平日のみ表示なので全日予約可能
            const isAvailable = true;
            
            html += `
                <div class="calendar-day ${isToday ? 'today' : ''} ${!isCurrentMonth ? 'other-month' : ''} ${isPastDate ? 'past' : ''}" 
                     data-date="${formatDate(displayDate)}" 
                     onclick="selectDate('${formatDate(displayDate)}')">
                    <div class="day-number">
                        <span>${displayDate.getDate()}</span>
                    </div>
                    <div class="reservations">
                        ${dayReservations.map(res => {
                            const isPast = new Date(res.end_datetime) < getCurrentDate();
                            const canEdit = res.can_edit ? 'editable' : '';
                            const departmentClass = res.department ? `dept--${String(res.department).padStart(2, '0')}` : 'dept--00';
                            return `
                            <div class="reservation-item ${res.group_id ? 'recurring' : ''} ${isPast ? 'past' : ''} ${canEdit} ${departmentClass}" onclick="event.stopPropagation(); showReservationDetail(${res.id})" title="${res.title} (${res.start_datetime.split(' ')[1].substring(0,5)}-${res.end_datetime.split(' ')[1].substring(0,5)})${res.group_id ? ' - 繰り返し予約' : ''}">
                                <div class="reservation-time">${res.start_datetime.split(' ')[1].substring(0,5)}-${res.end_datetime.split(' ')[1].substring(0,5)}</div>
                                <div class="reservation-title">${res.title}</div>
                            </div>
                        `;}).join('')}
                    </div>
                </div>
            `;
        }
        // 日付を1日進める（新しいDateオブジェクトを作成）
        currentDay = new Date(currentDay.getTime() + 24 * 60 * 60 * 1000);
    }
    
    html += '</div>';
    container.innerHTML = html;
    
    // カレンダー描画完了後にテーマカラーを適用
    setTimeout(() => {
        if (typeof applyDepartmentThemeColors === 'function') {
            applyDepartmentThemeColors();
        }
    }, 50);
}

// 指定日の予約を取得
function getDayReservations(date, reservations) {
    const dateStr = formatDate(date);
    return reservations.filter(res => res.date === dateStr);
}