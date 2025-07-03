/**
 * メインアプリケーション
 */
import { renderSidebar, initSidebarAuthListener } from './components/sidebar.js';
import { renderMainContent, initMainContentAuthListener } from './components/mainContent.js';
import { authModal } from './components/modal/authModal.js';
import { configModal } from './components/modal/configModal.js';
import { groupEditModal } from './components/modal/groupEditModal.js';
import { reservationDetailModal } from './components/modal/reservationDetailModal.js';
import { reservationModal } from './components/modal/reservationModal.js';
import { setupModalDrag } from './utils/modalDrag.js';
import { initAuth, showMessage } from './utils/auth.js';

document.addEventListener('DOMContentLoaded', async () => {
    // 認証システムを最初に初期化
    await initAuth();
    
    // 認証状態変更リスナーを設定
    initSidebarAuthListener();
    initMainContentAuthListener();
    
    // UI コンポーネントを初期化
    renderSidebar();
    renderMainContent();

    authModal();
    configModal();
    groupEditModal();
    reservationDetailModal();
    reservationModal();

    initModalButtons();
    initModalOverlayClose();
    initDataActionButtons();
    initAuthHandlers();
});

// イベントリスナー設定
function initModalButtons() {
    // auth-modal表示
    const authBtn = document.getElementById('login-btn');
    if (authBtn) {
        authBtn.addEventListener('click', () => {
            showModal('auth-modal');
        });
    }

    // reservation-detail-modal表示
    // const reservationDetailBtn = document.getElementById('reservation-detail-modal-btn');
    // if (reservationDetailBtn) {
    //     reservationDetailBtn.addEventListener('click', () => {
    //         showModal('reservation-detail-modal');
    //     });
    // }

    // group-edit-modal表示
    // const groupEditBtn = document.getElementById('group-edit-modal-btn');
    // if (groupEditBtn) {
    //     groupEditBtn.addEventListener('click', () => {
    //         showModal('group-edit-modal');
    //     });
    // }

    // reservation-modal表示
    const reservationBtn = document.getElementById('new-reservation-btn');
    if (reservationBtn) {
        reservationBtn.addEventListener('click', () => {
            showModal('reservation-modal');
        });
    }

    // config-modal表示
    const configBtn = document.getElementById('config-btn');
    if (configBtn) {
        configBtn.addEventListener('click', () => {
            showModal('config-modal');
        });
    }

}

// モーダル表示関数
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        // ドラッグ機能を設定
        setupModalDrag(modal);
        // モーダルを表示
        modal.classList.add('show');
    }
}

// オーバーレイクリックでモーダルを閉じる初期化
function initModalOverlayClose() {
    // すべてのモーダルを取得
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            // クリックされたのがオーバーレイ自身（モーダル本体以外）なら閉じる
            if (e.target === modal) {
                modal.classList.remove('show');
            }
        });
    });
}



function initDataActionButtons() {
    const hideModalBtns = document.querySelectorAll('[data-action="hide-modal"]');

    hideModalBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const action = e.target.getAttribute('data-action');
            const modal = e.target.closest('.modal');
            if (modal) {
                modal.classList.remove('show');
            }
        });
    });
    
    console.log('data-action属性の初期化完了');
}

// 認証関連のイベントハンドラー初期化
function initAuthHandlers() {
    // ログインフォーム送信
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(loginForm);
            formData.append('action', 'login');
            
            try {
                const response = await fetch('api/auth.php', {
                    method: 'POST',
                    body: formData
                });
                
                const result = await response.json();
                
                if (result.success) {
                    showMessage('ログインしました', 'success');
                    document.getElementById('auth-modal').classList.remove('show');
                    
                    // 認証状態を更新（AuthStore経由でUIが自動更新される）
                    const { checkAuthStatus } = await import('./utils/auth.js');
                    await checkAuthStatus();
                    
                    // ログイン後にモーダルボタンを再初期化
                    initModalButtons();
                } else {
                    showMessage(result.message || 'ログインに失敗しました', 'error');
                }
            } catch (error) {
                console.error('ログインエラー:', error);
                showMessage('ログインに失敗しました', 'error');
            }
        });
    }

    // 新規登録フォーム送信
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(registerForm);
            formData.append('action', 'register');
            
            try {
                const response = await fetch('api/auth.php', {
                    method: 'POST',
                    body: formData
                });
                
                const result = await response.json();
                
                if (result.success) {
                    showMessage('ユーザー登録が完了しました', 'success');
                    // ログインフォームに切り替え
                    showLoginForm();
                } else {
                    showMessage(result.message || '登録に失敗しました', 'error');
                }
            } catch (error) {
                console.error('登録エラー:', error);
                showMessage('登録に失敗しました', 'error');
            }
        });
    }

    // フォーム切り替え
    const showRegisterLink = document.getElementById('show-register');
    if (showRegisterLink) {
        showRegisterLink.addEventListener('click', (e) => {
            e.preventDefault();
            showRegisterForm();
        });
    }

    const showLoginLink = document.getElementById('show-login');
    if (showLoginLink) {
        showLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            showLoginForm();
        });
    }

    // モーダル閉じるボタン
    const closeAuthModal = document.getElementById('close-auth-modal');
    if (closeAuthModal) {
        closeAuthModal.addEventListener('click', () => {
            document.getElementById('auth-modal').classList.remove('show');
        });
    }

    const cancelAuthBtn = document.getElementById('cancel-auth-btn');
    if (cancelAuthBtn) {
        cancelAuthBtn.addEventListener('click', () => {
            document.getElementById('auth-modal').classList.remove('show');
        });
    }

    const cancelRegisterBtn = document.getElementById('cancel-register-btn');
    if (cancelRegisterBtn) {
        cancelRegisterBtn.addEventListener('click', () => {
            document.getElementById('auth-modal').classList.remove('show');
        });
    }
}

// ログインフォーム表示
function showLoginForm() {
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('register-form').style.display = 'none';
    document.getElementById('auth-modal-title').textContent = 'ログイン';
}

// 新規登録フォーム表示
function showRegisterForm() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('register-form').style.display = 'block';
    document.getElementById('auth-modal-title').textContent = '新規登録';
}

// メッセージ表示関数（auth.jsから使用）
// showMessage 関数は auth.js に移動済み

