/**
 * リストビューコンポーネント
 */
import { isSameDay } from '../utils/dateUtils.js';

// リスト表示
export function renderListView(container, futureReservations, getCurrentDate) {
    // 全ての今日以降の予約をソート
    const sortedReservations = futureReservations.sort((a, b) => {
        // 日付と開始時間でソート
        const dateA = new Date(a.start_datetime);
        const dateB = new Date(b.start_datetime);
        return dateA - dateB;
    });
    
    let html = '<div class="list-view">';
    
    
    if (sortedReservations.length === 0) {
        html += '<div class="list-empty">今日以降の予約はありません</div>';
    } else {
        // 固定ヘッダー
        html += '<div class="list-header-fixed">';
        html += '<div class="list-header-item">日付</div>';
        html += '<div class="list-header-item">時間</div>';
        html += '<div class="list-header-item list-title">タイトル</div>';
        html += '<div class="list-header-item list-department">部署</div>';
        html += '<div class="list-header-item list-user">予約者</div>';
        html += '</div>';
        
        // スクロール可能なリストコンテナ
        html += '<div class="list-content-scrollable">';
        
        sortedReservations.forEach(res => {
            const date = new Date(res.date);
            const dayOfWeek = ['日', '月', '火', '水', '木', '金', '土'][date.getDay()];
            const formattedDate = `${date.getMonth() + 1}/${date.getDate()}(${dayOfWeek})`;
            const startTime = res.start_datetime.split(' ')[1].substring(0,5);
            const endTime = res.end_datetime.split(' ')[1].substring(0,5);
            const timeRange = `${startTime}-${endTime}`;
            const titleWithIcon = `${res.title}`;
            
            // 今日の日付かどうかをチェック
            const today = getCurrentDate();
            const isToday = isSameDay(date, today);
            
            // 過去の予約かどうかをチェック
            const isPast = new Date(res.end_datetime) < today;
            
            // 編集可能な予約の場合は予約者名に✏️アイコンを追加
            const canEdit = res.can_edit ? 'editable' : '';
            
            html += `
                <div class="list-item ${isToday ? 'today' : ''} ${isPast ? 'past' : ''}" onclick="showReservationDetail(${res.id})" data-reservation-id="${res.id}">
                    <div class="list-item-cell list-date">${formattedDate}</div>
                    <div class="list-item-cell list-time">${timeRange}</div>
                    <div class="list-item-cell list-title">${titleWithIcon}</div>
                    <div class="list-item-cell list-department">${res.department_name || '未設定'}</div>
                    <div class="list-item-cell list-user ${canEdit}">${res.user_name}</div>
                </div>
            `;
        });
        
        html += '</div>'; // list-content-scrollable end
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

