export function configModal() {
    const configModalHTML = `
        <div class="modal-content large-modal">
            <div class="modal-header">
                <h2>ユーザー設定</h2>
                <button class="close-btn" id="close-config-modal"><img src="src/images/close.svg" alt=""
                        class="material-icon"></button>
            </div>
            <div class="config-content">
                <!-- プロフィール設定 -->
                <div class="config-section">
                    <h3>プロフィール設定</h3>
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

                <!-- パスワード変更 -->
                <div class="config-section">
                    <h3>パスワード変更</h3>
                    <form id="password-change-form" class="config-form">
                        <div class="form-group">
                            <label for="current-password">現在のパスワード <span class="required">*</span></label>
                            <input type="password" id="current-password" name="current_password" required
                                placeholder="現在のパスワードを入力">
                        </div>

                        <div class="form-group">
                            <label for="new-password">新しいパスワード <span class="required">*</span></label>
                            <input type="password" id="new-password" name="new_password" required
                                placeholder="新しいパスワードを入力（6文字以上）" minlength="6">
                        </div>

                        <div class="form-group">
                            <label for="confirm-password">新しいパスワード（確認） <span class="required">*</span></label>
                            <input type="password" id="confirm-password" name="confirm_password" required
                                placeholder="新しいパスワードを再度入力">
                        </div>

                        <div class="form-actions">
                            <button type="submit" id="change-password-btn" class="btn btn-primary">パスワードを変更</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    const configModalElm = document.getElementById('config-modal');
    if (configModalElm) {
        configModalElm.innerHTML = configModalHTML;
    }
}