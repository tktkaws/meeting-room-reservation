export function configModal() {
    const configModalHTML = `
        <div class="modal-content large-modal">
            <div class="modal-header">
                <h2>ユーザー設定</h2>
                <button class="close-btn" id="close-modal"><img src="src/images/close.svg" alt=""
                        class="material-icon"></button>
            </div>
            <div class="config-content">
                <form id="user-config-form" class="config-form">
                        <div class="form-group">
                            <label for="user-name">名前 <span class="required">*</span></label>
                            <input type="text" id="user-name" name="name" required placeholder="氏名を入力してください"
                                maxlength="100">
                        </div>

                        <div class="form-group">
                            <label for="user-email">メールアドレス <span class="required">*</span></label>
                            <input type="email" id="user-email" name="email" required placeholder="email@example.com"
                                maxlength="255">
                        </div>

                        <div class="form-group">
                            <label for="user-department">部署</label>
                            <select id="user-department" name="department">
                                <!-- 部署データが動的に読み込まれます -->
                            </select>
                        </div>

                        <div class="form-group">
                            <label for="email-notification-type">メール通知設定</label>
                            <select id="email-notification-type" name="email_notification_type">
                                <option value="1">予約変更通知</option>
                                <option value="2">送信しない</option>
                            </select>
                            <small class="form-help">予約の変更時にメールで通知するか選択してください</small>
                        </div>
                        <div class="form-actions">
                            <button type="submit" id="save-btn" class="btn btn-primary">設定を保存</button>
                        </div>
                    </form>
            </div>
        </div>
    `;
    
    const configModalElm = document.getElementById('config-modal');
    if (configModalElm) {
        configModalElm.innerHTML = configModalHTML;
    }
}