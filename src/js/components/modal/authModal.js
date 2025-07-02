export function authModal() {
    const authModalHTML = `
        <div class="modal-content auth-modal-content">
            <div class="modal-header">
                <h2 id="auth-modal-title">ログイン</h2>
                <button class="close-btn" id="close-auth-modal"><img src="src/images/close.svg" alt=""
                        class="material-icon"></button>
            </div>

            <!-- ログインフォーム -->
            <div id="login-form" class="auth-form">
                <form id="loginForm">
                    <div class="form-group">
                        <label for="login-email">メールアドレス</label>
                        <input type="email" id="login-email" name="email" required>
                    </div>
                    <div class="form-group">
                        <label for="login-password">パスワード</label>
                        <input type="password" id="login-password" name="password" required>
                    </div>
                    <div class="form-group checkbox-group">
                        <label class="checkbox-label">
                            <input type="checkbox" id="remember-me" name="remember_me" checked>
                            <span>ログイン状態を保持する</span>
                        </label>
                    </div>
                    <div class="modal-actions">
                        <button type="button" id="cancel-auth-btn" class="btn-secondary">キャンセル</button>
                        <button type="submit" class="btn-primary">ログイン</button>
                    </div>
                </form>
                <p class="form-switch">
                    【テストユーザー】<br>
                    メールアドレス：takahashi@example.com<br>
                    パスワード：takahashi123
                </p>
                <p class="form-switch">
                    【テスト管理者ユーザー】<br>
                    メールアドレス：admin@example.com<br>
                    パスワード：admin123
                </p>
                <p class="form-switch">
                    アカウントをお持ちでない方は
                    <a href="#" id="show-register">新規登録</a>
                </p>
            </div>

            <!-- 新規登録フォーム -->
            <div id="register-form" class="auth-form" style="display: none;">
                <form id="registerForm">
                    <div class="form-group">
                        <label for="register-name">氏名</label>
                        <input type="text" id="register-name" name="name" required>
                    </div>
                    <div class="form-group">
                        <label for="register-email">メールアドレス</label>
                        <input type="email" id="register-email" name="email" required>
                    </div>
                    <div class="form-group">
                        <label for="register-password">パスワード</label>
                        <input type="password" id="register-password" name="password" required>
                    </div>
                    <div class="form-group">
                        <label for="register-department">部署</label>
                        <input type="text" id="register-department" name="department">
                    </div>
                    <div class="modal-actions">
                        <button type="button" id="cancel-register-btn" class="btn-secondary">キャンセル</button>
                        <button type="submit" class="btn-primary">登録</button>
                    </div>
                </form>
                <p class="form-switch">
                    既にアカウントをお持ちの方は
                    <a href="#" id="show-login">ログイン</a>
                </p>
            </div>
        </div>
    `;

    const authModalElm = document.getElementById('auth-modal');
    if (authModalElm) {
        authModalElm.innerHTML = authModalHTML;
    }
}