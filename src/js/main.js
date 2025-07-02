/**
 * メインアプリケーション
 */
import { renderSidebar } from './components/sidebar.js';
import { renderMainContent } from './components/mainContent.js';
import { authModal } from './components/modal/authModal.js';
import { configModal } from './components/modal/configModal.js';
import { groupEditModal } from './components/modal/groupEditModal.js';
import { reservationDetailModal } from './components/modal/reservationDetailModal.js';
import { reservationModal } from './components/modal/reservationModal.js';
import { setupModalDrag } from './utils/modalDrag.js';


document.addEventListener('DOMContentLoaded', () => {
    renderSidebar();
    renderMainContent();

    authModal();
    configModal();
    groupEditModal();
    reservationDetailModal();
    reservationModal();

    initModalButtons();
    initModalOverlayClose();
});

// イベントリスナー設定
function initModalButtons() {
    // reservation-detail-modal表示
    const reservationDetailBtn = document.getElementById('reservation-detail-modal-btn');
    if (reservationDetailBtn) {
        reservationDetailBtn.addEventListener('click', () => {
            showModal('reservation-detail-modal');
        });
    }

    // group-edit-modal表示
    const groupEditBtn = document.getElementById('group-edit-modal-btn');
    if (groupEditBtn) {
        groupEditBtn.addEventListener('click', () => {
            showModal('group-edit-modal');
        });
    }

    // reservation-modal表示
    const reservationBtn = document.getElementById('reservation-modal-btn');
    if (reservationBtn) {
        reservationBtn.addEventListener('click', () => {
            showModal('reservation-modal');
        });
    }

    // auth-modal表示
    const authBtn = document.getElementById('auth-modal-btn');
    if (authBtn) {
        authBtn.addEventListener('click', () => {
            showModal('auth-modal');
        });
    }

    // config-modal表示
    const configBtn = document.getElementById('config-modal-btn');
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

