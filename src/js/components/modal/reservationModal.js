export function reservationModal() {
    const reservationModalHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2 id="modal-title">新規予約</h2>
                <button class="close-btn" id="close-modal"><img src="src/images/close.svg" alt=""
                        class="material-icon"></button>
            </div>
            <form id="reservation-form">
                <div class="form-group">
                    <label for="reservation-title">タイトル <span class="char-counter"
                            id="title-counter">0/50</span></label>
                    <input type="text" id="reservation-title" name="title" required maxlength="50">
                </div>
                <div class="form-group">
                    <label for="reservation-description">説明 <span class="char-counter"
                            id="description-counter">0/400</span></label>
                    <textarea id="reservation-description" name="description" rows="3" maxlength="400"></textarea>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="reservation-date">日付</label>
                        <input type="date" id="reservation-date" name="date" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="start-hour">開始時間</label>
                        <div class="time-select-group">
                            <select id="start-hour" name="start_hour" required>
                                <option value="9">9</option>
                                <option value="10">10</option>
                                <option value="11">11</option>
                                <option value="12">12</option>
                                <option value="13">13</option>
                                <option value="14">14</option>
                                <option value="15">15</option>
                                <option value="16">16</option>
                                <option value="17">17</option>
                            </select>
                            <span class="time-separator">時</span>
                            <select id="start-minute" name="start_minute" required>
                                <option value="0">00</option>
                                <option value="15">15</option>
                                <option value="30">30</option>
                                <option value="45">45</option>
                            </select>
                            <span class="time-separator">分</span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="end-hour">終了時間</label>
                        <div class="time-select-group">
                            <select id="end-hour" name="end_hour" required>
                                <option value="9">9</option>
                                <option value="10">10</option>
                                <option value="11">11</option>
                                <option value="12">12</option>
                                <option value="13">13</option>
                                <option value="14">14</option>
                                <option value="15">15</option>
                                <option value="16">16</option>
                                <option value="17">17</option>
                                <option value="18">18</option>
                            </select>
                            <span class="time-separator">時</span>
                            <select id="end-minute" name="end_minute" required>
                                <option value="0">00</option>
                                <option value="15">15</option>
                                <option value="30">30</option>
                                <option value="45">45</option>
                            </select>
                            <span class="time-separator">分</span>
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <label>繰り返し設定</label>
                    <div class="radio-group">
                        <label class="radio-label">
                            <input type="radio" id="recurring-no" name="is_recurring" value="no" checked>
                            繰り返さない
                        </label>
                        <label class="radio-label">
                            <input type="radio" id="recurring-yes" name="is_recurring" value="yes">
                            繰り返す
                        </label>
                    </div>
                </div>
                <div id="recurring-options" style="display: none;">
                    <div class="form-group">
                        <label for="repeat-type">繰り返しパターン</label>
                        <select id="repeat-type" name="repeat_type">
                            <option value="daily">毎日</option>
                            <option value="weekly" selected>毎週</option>
                            <option value="biweekly">隔週</option>
                            <option value="monthly">毎月</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="repeat-end-date">終了日</label>
                        <input type="date" id="repeat-end-date" name="repeat_end_date">
                    </div>
                    <div class="form-group">
                        <div id="recurring-preview" style="display: none;">
                            <label>作成される予約一覧</label>
                            <div id="recurring-dates-list" class="recurring-dates-preview">
                                <!-- 予約日一覧がここに表示される -->
                            </div>
                        </div>
                    </div>
                </div>

                <div class="modal-actions">
                    <button type="button" id="cancel-btn" class="btn-secondary">キャンセル</button>
                    <button type="submit" class="btn-primary">保存</button>
                </div>
            </form>
        </div>
    `;

    const  reservationModalElm = document.getElementById('reservation-modal');
    if ( reservationModalElm) {
         reservationModalElm.innerHTML = reservationModalHTML;
    }
    
}