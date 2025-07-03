/**
 * 認証情報管理ユーティリティ
 */

// グローバル認証情報ストア
window.AuthStore = {
    user: {
        id: null,
        name: '',
        email: '',
        department_id: null,
        role: ''
    },
    isLogin: false,
    isAdmin: false,
    isLoading: false,
    
    // リスナー管理
    listeners: [],
    
    // 状態変更通知
    notifyListeners() {
        this.listeners.forEach(listener => {
            try {
                listener(this);
            } catch (error) {
                console.error('AuthStore listener error:', error);
            }
        });
    },
    
    // リスナー追加
    addListener(callback) {
        this.listeners.push(callback);
        // 現在の状態で即座にコールバック実行
        callback(this);
    },
    
    // リスナー削除
    removeListener(callback) {
        const index = this.listeners.indexOf(callback);
        if (index > -1) {
            this.listeners.splice(index, 1);
        }
    },
    
    // 認証情報を更新
    updateAuthInfo(authData) {
        const wasLogin = this.isLogin;
        const wasAdmin = this.isAdmin;
        
        if (authData.logged_in && authData.user) {
            this.user = {
                id: authData.user.id,
                name: authData.user.name || '',
                email: authData.user.email || '',
                department_id: authData.user.department_id || null,
                role: authData.user.role || 'user'
            };
            this.isLogin = true;
            this.isAdmin = authData.user.role === 'admin';
        } else {
            this.user = {
                id: null,
                name: '',
                email: '',
                department_id: null,
                role: ''
            };
            this.isLogin = false;
            this.isAdmin = false;
        }
        
        // 状態が変更された場合のみ通知
        if (wasLogin !== this.isLogin || wasAdmin !== this.isAdmin) {
            this.notifyListeners();
        }
    },
    
    // 認証情報をクリア
    clearAuthInfo() {
        this.user = {
            id: null,
            name: '',
            email: '',
            department_id: null,
            role: ''
        };
        this.isLogin = false;
        this.isAdmin = false;
        this.notifyListeners();
    }
};

/**
 * 認証状態をサーバーから取得
 */
export async function checkAuthStatus() {
    try {
        window.AuthStore.isLoading = true;
        
        const response = await fetch('api/auth.php', {
            method: 'GET',
            credentials: 'same-origin'
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        // 認証情報を更新
        window.AuthStore.updateAuthInfo(result.data || result);
        
        return {
            success: true,
            data: window.AuthStore
        };
        
    } catch (error) {
        console.error('認証状態チェックエラー:', error);
        window.AuthStore.clearAuthInfo();
        
        return {
            success: false,
            error: error.message
        };
    } finally {
        window.AuthStore.isLoading = false;
    }
}

/**
 * ログアウト処理
 */
export async function logout() {
    try {
        const formData = new FormData();
        formData.append('action', 'logout');
        
        const response = await fetch('api/auth.php', {
            method: 'POST',
            body: formData,
            credentials: 'same-origin'
        });
        
        const result = await response.json();
        
        if (result.success) {
            window.AuthStore.clearAuthInfo();
            showMessage('ログアウトしました', 'success');
            return true;
        } else {
            showMessage(result.message || 'ログアウトに失敗しました', 'error');
            return false;
        }
        
    } catch (error) {
        console.error('ログアウトエラー:', error);
        showMessage('ログアウトに失敗しました', 'error');
        return false;
    }
}

/**
 * 認証が必要な処理のためのガード関数
 */
export function requireAuth(callback) {
    if (window.AuthStore.isLogin) {
        callback();
    } else {
        showMessage('ログインが必要です', 'warning');
        // ログインモーダルを表示
        const authModal = document.getElementById('auth-modal');
        if (authModal) {
            authModal.classList.add('show');
        }
    }
}

/**
 * 管理者権限が必要な処理のためのガード関数
 */
export function requireAdmin(callback) {
    if (window.AuthStore.isLogin && window.AuthStore.isAdmin) {
        callback();
    } else if (window.AuthStore.isLogin) {
        showMessage('管理者権限が必要です', 'error');
    } else {
        showMessage('ログインが必要です', 'warning');
        // ログインモーダルを表示
        const authModal = document.getElementById('auth-modal');
        if (authModal) {
            authModal.classList.add('show');
        }
    }
}

/**
 * ユーザー情報取得（便利関数）
 */
export function getCurrentUser() {
    return window.AuthStore.user;
}

/**
 * ログイン状態取得（便利関数）
 */
export function isLoggedIn() {
    return window.AuthStore.isLogin;
}

/**
 * 管理者権限取得（便利関数）
 */
export function isAdmin() {
    return window.AuthStore.isAdmin;
}

/**
 * 部署名取得（便利関数）
 */
export function getDepartmentName(departmentId = null) {
    const id = departmentId || window.AuthStore.user.department_id;
    const departments = {
        1: '取締役',
        2: '総務管理部', 
        3: '営業開発推進部',
        4: '制作部'
    };
    return departments[id] || '未設定';
}

/**
 * メッセージ表示関数（他のファイルでも使用可能）
 */
export function showMessage(message, type = 'info') {
    const messageDiv = document.getElementById('message');
    if (messageDiv) {
        messageDiv.textContent = message;
        messageDiv.className = `message ${type}`;
        messageDiv.style.display = 'block';
        
        // 3秒後に非表示
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 3000);
    }
}

/**
 * 初期化処理（アプリ起動時に実行）
 */
export async function initAuth() {
    console.log('認証システム初期化中...');
    await checkAuthStatus();
    console.log('認証システム初期化完了:', window.AuthStore);
}