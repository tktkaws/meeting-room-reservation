export function groupEditModal() {
    const groupEditModalHTML = `
        <div class="modal-content large-modal">
            <div class="modal-header">
                <h2>全ての繰り返し予約を編集</h2>
                <button class="close-btn" id="close-group-edit-modal"><img src="src/images/close.svg" alt=""
                        class="material-icon"></button>
            </div>
            <form id="group-edit-form">
                <div class="group-edit-content">
                    <div class="group-basic-info">
                        <div class="form-group">
                            <label for="group-title">タイトル <span class="char-counter"
                                    id="group-title-counter">0/50</span></label>
                            <input type="text" id="group-title" name="title" required maxlength="50">
                        </div>
                        <div class="form-group">
                            <label for="group-description">説明 <span class="char-counter"
                                    id="group-description-counter">0/400</span></label>
                            <textarea id="group-description" name="description" rows="3" maxlength="400"></textarea>
                        </div>
                    </div>

                    <div class="group-time-info">
                        <div class="time-form-row">
                            <div class="form-group">
                                <label for="group-start-hour">開始時間</label>
                                <div class="time-select-group">
                                    <select id="group-start-hour" name="start_hour">
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
                                    <select id="group-start-minute" name="start_minute">
                                        <option value="0">00</option>
                                        <option value="15">15</option>
                                        <option value="30">30</option>
                                        <option value="45">45</option>
                                    </select>
                                    <span class="time-separator">分</span>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="group-end-hour">終了時間</label>
                                <div class="time-select-group">
                                    <select id="group-end-hour" name="end_hour">
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
                                    <select id="group-end-minute" name="end_minute">
                                        <option value="0">00</option>
                                        <option value="15">15</option>
                                        <option value="30">30</option>
                                        <option value="45">45</option>
                                    </select>
                                    <span class="time-separator">分</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="group-reservations">
                        <h3>繰り返し予約一覧</h3>
                        <div id="group-reservations-list">
                            <!-- 動的に生成される予約リスト -->
                        </div>
                    </div>
                </div>

                <div class="modal-actions">
                    <button type="button" id="group-cancel-btn" class="btn-secondary">キャンセル</button>
                    <button type="submit" class="btn-primary">すべて更新</button>
                </div>
            </form>
        </div>
    `;
    
    const groupEditModalElm = document.getElementById('group-edit-modal');
    if (groupEditModalElm) {
        groupEditModalElm.innerHTML = groupEditModalHTML;
    }
}