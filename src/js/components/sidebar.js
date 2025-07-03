/**
 * サイドバーコンポーネント
 */
export function renderSidebar() {
    const user = {
        name: '山田太郎',
        department: '営業部',
        role: 'user',
    };
    const isAdmin = user.role === 'admin';
    const isLogin = true;
    
    const sidebarHTML = `
        <div class="sidebar-content">
            <!-- サイドバーヘッダー -->
            <div class="sidebar-header">
                <h1 class="sidebar-title">
                    <a href="index.html">📅 会議室予約システム</a>
                </h1>
                <button type="button" id="hamburger-close-btn" class="hamburger-close-btn">
                    <span class="material-symbols-outlined">close</span>
                </button>
            </div>
            <!-- ユーザー情報セクション -->
            <div class="sidebar-section sidebar-user-info" id="sidebar-user-section">
                ${isLogin ? `
                <div class="sidebar-user-card">
                    <div class="sidebar-user-details">
                        <img src="src/images/person.svg" alt="" class="material-icon">
                        <span class="sidebar-user-name" id="sidebar-user-info">${user.name}</span>
                    </div>
                    <div class="sidebar-user-details">
                        <img src="src/images/groups.svg" alt="" class="material-icon">
                        <span id="sidebar-department-name">${user.department}</span>
                    </div>
                </div>
                <!-- テーマカラー設定 -->
                <div id="sidebar-theme-color-controls" class="sidebar-theme-colors">
                    <div class="sidebar-section-title">テーマカラー設定</div>
                    <div id="user-theme-color-setting" class="theme-color-setting">
                        <div class="theme-color-row">
                            <div class="theme-color-controls">
                                <button type="button" id="save-theme-color-btn" class="btn btn-small btn-primary">保存</button>
                                <button type="button" id="reset-theme-color-btn" class="theme-color-btn theme-color-btn-reset" onclick="resetThemeColors()">
                                    <img src="src/images/refresh.svg" alt="" class="material-icon">
                                    デフォルトに戻す
                                </button>
                            </div>
                        </div>
                        <div class="theme-color-info">
                            <span id="theme-color-source">デフォルトカラーを使用中</span>
                        </div>
                    </div>
                </div>
                ` : ''}
                
            </div>

            <!-- ナビゲーションセクション -->
            ${isLogin ? `
            <div class="sidebar-section">
                <button type="button" id="config-btn" class="sidebar-btn">
                    <img src="src/images/settings.svg" alt="" class="material-icon">
                    <span class="sidebar-btn-text">設定</span>
                </button>
                <button type="button" id="logout-btn" class="sidebar-btn">
                    <img src="src/images/logout.svg" alt="" class="material-icon">
                    <span class="sidebar-btn-text">ログアウト</span>
                </button>
            </div>
            ` : 
            `
             <div class="sidebar-section">
                <button type="button" id="login-btn" class="sidebar-btn">
                    <img src="src/images/login.svg" alt="" class="material-icon">
                    <span class="sidebar-btn-text">ログイン</span>
                </button>
            </div>
            `}
            <!-- 管理者セクション -->
            ${isAdmin ? `
            <div class="sidebar-section" id="admin-section">
                <div class="sidebar-section-title">管理</div>
                <button type="button" id="department-btn" class="sidebar-btn">
                    <img src="src/images/groups.svg" alt="" class="material-icon">
                    <span class="sidebar-btn-text">部署管理</span>
                </button>
                <button type="button" id="email-btn" class="sidebar-btn">
                    <span class="material-symbols-outlined">email</span>
                    <span class="sidebar-btn-text">メール設定</span>
                </button>
                <button type="button" id="export-btn" class="sidebar-btn">
                    <span class="material-symbols-outlined">download</span>
                    <span class="sidebar-btn-text">データ出力</span>
                </button>
                <button type="button" id="import-btn" class="sidebar-btn">
                    <span class="material-symbols-outlined">upload</span>
                    <span class="sidebar-btn-text">データ取込</span>
                </button>
            </div>
            ` : ''}
            ${isLogin ? '' : `
            <div class="sidebar-section sidebar-notice-secton" id="sidebar-notice">
                <div class="sidebar-section-title">💡お知らせ</div>
                <div class="sidebar-notice-content">
                    <div class="sidebar-notice-item">
                        <p>予約を作成するにはログインが必要です</p>
                    </div>
                </div>
            </div>
            `}
        </div>
    `;

    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        sidebar.innerHTML = sidebarHTML;
    }
}