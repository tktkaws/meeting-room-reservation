/**
 * モーダルドラッグ機能
 * モーダルをドラッグ可能にするためのユーティリティ
 */

// ドラッグ状態管理変数
let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;
let modalStartX = 0;
let modalStartY = 0;
let isEventListenersAdded = false;

/**
 * ドラッグ機能を設定する関数
 * @param {HTMLElement} modal - ドラッグ機能を追加するモーダル要素
 */
export function setupModalDrag(modal) {
    // グローバルイベントリスナーを一度だけ設定
    if (!isEventListenersAdded) {
        addGlobalEventListeners();
        isEventListenersAdded = true;
    }
    
    const modalHeader = getModalHeader(modal);
    if (!modalHeader) return;
    
    const modalContent = getModalContent(modal);
    
    // モーダルを画面中央に配置
    positionModalCenter(modal);
    
    // モーダル閉じる監視を設定
    setupModalCloseHandler(modal);
    
    // ドラッグ機能を設定
    setupDragHandlers(modalHeader, modalContent);
}

/**
 * モーダルヘッダーを取得
 * @param {HTMLElement} modal - モーダル要素
 * @returns {HTMLElement|null} モーダルヘッダー要素
 */
function getModalHeader(modal) {
    return modal.querySelector('.modal-header') || modal.querySelector('h3') || modal.querySelector('h2');
}

/**
 * モーダルコンテンツを取得
 * @param {HTMLElement} modal - モーダル要素
 * @returns {HTMLElement} モーダルコンテンツ要素
 */
function getModalContent(modal) {
    return modal.querySelector('.modal-content') || modal.querySelector('.modal-dialog') || modal;
}

/**
 * モーダルを画面中央に配置
 * @param {HTMLElement} modal - 配置するモーダル要素
 */
function positionModalCenter(modal) {
    const modalContent = getModalContent(modal);
    
    // モーダルを一時的に表示して寸法を取得
    const originalDisplay = modal.style.display;
    modal.style.display = 'flex';
    modal.style.visibility = 'hidden';
    
    const rect = modalContent.getBoundingClientRect();
    const centerX = (window.innerWidth - rect.width) / 2;
    const centerY = (window.innerHeight - rect.height) / 2;
    
    // 画面外に出ないよう制限
    const x = Math.max(20, Math.min(centerX, window.innerWidth - rect.width - 20));
    const y = Math.max(20, Math.min(centerY, window.innerHeight - rect.height - 20));
    
    modalContent.style.position = 'absolute';
    modalContent.style.left = `${x}px`;
    modalContent.style.top = `${y}px`;
    
    // 表示状態を復元
    modal.style.display = originalDisplay;
    modal.style.visibility = 'visible';
}

/**
 * ドラッグハンドラーを設定
 * @param {HTMLElement} modalHeader - モーダルヘッダー要素
 * @param {HTMLElement} modalContent - モーダルコンテンツ要素
 */
function setupDragHandlers(modalHeader, modalContent) {
    // ヘッダーにドラッグカーソルを設定
    modalHeader.style.cursor = 'move';
    modalHeader.style.userSelect = 'none';
    
    // 既存のイベントリスナーを削除
    modalHeader.removeEventListener('mousedown', handleMouseDown);
    
    // ドラッグ開始ハンドラー
    function handleMouseDown(e) {
        if (e.target.tagName === 'BUTTON' || e.target.closest('button')) return;
        
        isDragging = true;
        dragStartX = e.clientX;
        dragStartY = e.clientY;
        
        const rect = modalContent.getBoundingClientRect();
        modalStartX = rect.left;
        modalStartY = rect.top;
        
        modalContent.style.cursor = 'grabbing';
        modalHeader.style.cursor = 'grabbing';
        modalContent.style.transition = 'none';
        modalContent.style.userSelect = 'none';
        
        e.preventDefault();
    }
    
    modalHeader.addEventListener('mousedown', handleMouseDown);
}

/**
 * モーダル閉じる監視を設定
 * @param {HTMLElement} modal - 監視するモーダル要素
 */
function setupModalCloseHandler(modal) {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const hasShowClass = modal.classList.contains('show');
                if (!hasShowClass) {
                    resetModalPosition(modal);
                }
            }
        });
    });
    
    observer.observe(modal, {
        attributes: true,
        attributeFilter: ['class']
    });
    
    modal._positionObserver = observer;
}

/**
 * モーダルの位置情報をリセット
 * @param {HTMLElement} modal - リセットするモーダル要素
 */
function resetModalPosition(modal) {
    const modalContent = getModalContent(modal);
    if (modalContent) {
        modalContent.style.left = '';
        modalContent.style.top = '';
        modalContent.style.position = '';
    }
}

/**
 * グローバルイベントリスナーを追加
 */
function addGlobalEventListeners() {
    // ドラッグ中の処理
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleWindowResize);
}

/**
 * マウス移動ハンドラー
 * @param {MouseEvent} e - マウスイベント
 */
function handleMouseMove(e) {
    if (!isDragging) return;
    
    const deltaX = e.clientX - dragStartX;
    const deltaY = e.clientY - dragStartY;
    
    updateModalPosition(deltaX, deltaY);
}

/**
 * マウスアップハンドラー
 */
function handleMouseUp() {
    if (!isDragging) return;
    
    isDragging = false;
    
    const activeModal = document.querySelector('.modal.show');
    if (activeModal) {
        const modalContent = getModalContent(activeModal);
        const modalHeader = getModalHeader(activeModal);
        
        modalContent.style.cursor = '';
        if (modalHeader) modalHeader.style.cursor = 'move';
        modalContent.style.transition = '';
        modalContent.style.userSelect = '';
    }
}

/**
 * キーダウンハンドラー（ESCキー対応）
 * @param {KeyboardEvent} e - キーボードイベント
 */
function handleKeyDown(e) {
    if (e.key === 'Escape') {
        const activeModal = document.querySelector('.modal.show');
        if (activeModal) {
            activeModal.classList.remove('show');
        }
    }
}

/**
 * ウィンドウリサイズハンドラー
 */
function handleWindowResize() {
    const activeModal = document.querySelector('.modal.show');
    if (!activeModal) return;
    
    const modalContent = getModalContent(activeModal);
    const rect = modalContent.getBoundingClientRect();
    const maxX = window.innerWidth - rect.width;
    const maxY = window.innerHeight - rect.height;
    
    let currentX = parseInt(modalContent.style.left) || 0;
    let currentY = parseInt(modalContent.style.top) || 0;
    
    currentX = Math.max(0, Math.min(currentX, maxX));
    currentY = Math.max(0, Math.min(currentY, maxY));
    
    modalContent.style.left = `${currentX}px`;
    modalContent.style.top = `${currentY}px`;
}

/**
 * モーダル位置を更新
 * @param {number} deltaX - X軸の移動量
 * @param {number} deltaY - Y軸の移動量
 */
function updateModalPosition(deltaX, deltaY) {
    const newX = modalStartX + deltaX;
    const newY = modalStartY + deltaY;
    
    const activeModal = document.querySelector('.modal.show');
    if (!activeModal) return;
    
    const modalContent = getModalContent(activeModal);
    const modalRect = modalContent.getBoundingClientRect();
    
    // 画面外に出ないよう制限
    const maxX = window.innerWidth - modalRect.width;
    const maxY = window.innerHeight - modalRect.height;
    
    const constrainedX = Math.max(0, Math.min(newX, maxX));
    const constrainedY = Math.max(0, Math.min(newY, maxY));
    
    modalContent.style.left = `${constrainedX}px`;
    modalContent.style.top = `${constrainedY}px`;
}