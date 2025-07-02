export function reservationDetailModal() {
    const reservationDetailModalHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>予約詳細</h2>
                <div class="detail-actions" id="detail-actions">
                    <!-- 編集ボタンは権限に応じて動的に追加 -->
                </div>
                <button class="close-btn" id="close-detail-modal"><img src="src/images/close.svg" alt=""
                        class="material-icon"></button>
            </div>
            <div class="detail-content">
                <div class="detail-section">
                    <div class="detail-item">
                        <label>日付</label>
                        <span id="detail-date"></span>
                    </div>
                    <div class="detail-item">
                        <label>時間</label>
                        <span id="detail-time"></span>
                    </div>
                    <div class="detail-item">
                        <label>タイトル</label>
                        <span id="detail-title"></span>
                    </div>
                    <div class="detail-item">
                        <label>予約者</label>
                        <span id="detail-user"></span>
                    </div>
                    <div class="detail-item">
                        <label>説明</label>
                        <span id="detail-description"></span>
                    </div>
                </div>

                <div id="recurring-section" class="detail-section" style="display: none;">
                    <div class="recurring-section-header">
                        <h3>繰り返し予約情報</h3>
                        <div class="recurring-detail-actions" id="recurring-detail-actions">
                            <!-- 繰り返し予約用の編集・削除ボタン -->
                        </div>
                    </div>
                    <div id="group-reservations">
                        <div id="group-list"></div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    
    const  reservationDetailModalElm = document.getElementById('reservation-detail-modal');
    if ( reservationDetailModalElm) {
         reservationDetailModalElm.innerHTML = reservationDetailModalHTML;
    }
}