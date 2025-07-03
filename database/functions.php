<?php
/**
 * データベース管理用共通関数
 */

// タイムゾーン設定
date_default_timezone_set('Asia/Tokyo');

/**
 * データベース接続を取得
 */
function getDatabase() {
    try {
        $db = new PDO('sqlite:meeting_room.db');
        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $db->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        return $db;
    } catch (PDOException $e) {
        throw new Exception('データベース接続エラー: ' . $e->getMessage());
    }
}

/**
 * テーブル一覧を取得
 */
function getTableList() {
    return ['users', 'departments', 'tags', 'reservations', 'reservation_groups', 'reservation_group_relations'];
}

/**
 * テーブルのレコード数を取得
 */
function getTableRecordCount($db, $tableName) {
    try {
        $stmt = $db->prepare("SELECT COUNT(*) as count FROM $tableName");
        $stmt->execute();
        $result = $stmt->fetch();
        return $result['count'];
    } catch (Exception $e) {
        return 0;
    }
}

/**
 * テーブル構造を取得
 */
function getTableStructure($db, $tableName) {
    try {
        $stmt = $db->prepare("PRAGMA table_info($tableName)");
        $stmt->execute();
        return $stmt->fetchAll();
    } catch (Exception $e) {
        return [];
    }
}

/**
 * テーブルの最新データを取得
 */
function getLatestRecords($db, $tableName, $limit = 5) {
    try {
        $stmt = $db->prepare("SELECT * FROM $tableName ORDER BY ROWID DESC LIMIT ?");
        $stmt->execute([$limit]);
        return $stmt->fetchAll();
    } catch (Exception $e) {
        return [];
    }
}

/**
 * CSVファイルをパース
 */
function parseCsvFile($filePath) {
    $data = [];
    
    if (!file_exists($filePath)) {
        throw new Exception('CSVファイルが見つかりません');
    }
    
    $handle = fopen($filePath, 'r');
    if (!$handle) {
        throw new Exception('CSVファイルを開けません');
    }
    
    // BOMを除去
    $bom = fread($handle, 3);
    if ($bom !== "\xEF\xBB\xBF") {
        fseek($handle, 0);
    }
    
    // ヘッダー行を取得
    $headers = fgetcsv($handle);
    if (!$headers) {
        fclose($handle);
        throw new Exception('CSVヘッダーが読み込めません');
    }
    
    // データ行を取得
    while (($row = fgetcsv($handle)) !== FALSE) {
        // 列数を調整
        $row = array_pad($row, count($headers), '');
        $row = array_slice($row, 0, count($headers));
        $data[] = array_combine($headers, $row);
    }
    
    fclose($handle);
    return $data;
}

/**
 * HTMLエスケープ
 */
function h($str) {
    return htmlspecialchars($str ?? '', ENT_QUOTES, 'UTF-8');
}

/**
 * 数値をフォーマット
 */
function formatNumber($num) {
    return number_format($num);
}

/**
 * ファイルサイズをフォーマット
 */
function formatFileSize($size) {
    $units = ['B', 'KB', 'MB', 'GB'];
    $unit = 0;
    
    while ($size >= 1024 && $unit < count($units) - 1) {
        $size /= 1024;
        $unit++;
    }
    
    return round($size, 1) . ' ' . $units[$unit];
}

/**
 * 日時をフォーマット
 */
function formatDateTime($datetime) {
    if (empty($datetime)) {
        return '';
    }
    
    try {
        $date = new DateTime($datetime);
        return $date->format('Y-m-d H:i:s');
    } catch (Exception $e) {
        return $datetime;
    }
}

/**
 * 日付をフォーマット
 */
function formatDate($date) {
    if (empty($date)) {
        return '';
    }
    
    try {
        $dateObj = new DateTime($date);
        return $dateObj->format('Y-m-d');
    } catch (Exception $e) {
        return $date;
    }
}

/**
 * テーブル名の日本語名を取得
 */
function getTableDisplayName($tableName) {
    $names = [
        'users' => 'ユーザー',
        'departments' => '部署',
        'tags' => 'タグ',
        'reservations' => '予約',
        'reservation_groups' => '予約グループ',
        'reservation_group_relations' => '予約グループ関連'
    ];
    
    return $names[$tableName] ?? $tableName;
}

/**
 * エラーメッセージを表示
 */
function displayError($message) {
    echo '<div class="error-message">';
    echo '<h2>❌ エラー</h2>';
    echo '<p>' . h($message) . '</p>';
    echo '</div>';
}

/**
 * 成功メッセージを表示
 */
function displaySuccess($message) {
    echo '<div class="success-message">';
    echo '<h2>✅ 成功</h2>';
    echo '<p>' . h($message) . '</p>';
    echo '</div>';
}

/**
 * 警告メッセージを表示
 */
function displayWarning($message) {
    echo '<div class="warning-message">';
    echo '<h2>⚠️ 警告</h2>';
    echo '<p>' . h($message) . '</p>';
    echo '</div>';
}

/**
 * テーブルが存在するかチェック
 */
function tableExists($db, $tableName) {
    try {
        $stmt = $db->prepare("SELECT name FROM sqlite_master WHERE type='table' AND name=?");
        $stmt->execute([$tableName]);
        return $stmt->fetch() !== false;
    } catch (Exception $e) {
        return false;
    }
}

/**
 * SQLクエリを実行して結果を取得
 */
function executeQuery($db, $sql, $params = []) {
    try {
        $stmt = $db->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    } catch (Exception $e) {
        throw new Exception('クエリ実行エラー: ' . $e->getMessage());
    }
}

/**
 * 安全なファイル名を生成
 */
function generateSafeFileName($originalName) {
    $info = pathinfo($originalName);
    $name = preg_replace('/[^a-zA-Z0-9_-]/', '_', $info['filename']);
    $extension = isset($info['extension']) ? '.' . $info['extension'] : '';
    
    return $name . '_' . date('Y-m-d_H-i-s') . $extension;
}

/**
 * バックアップファイルを作成
 */
function createBackup() {
    $sourceFile = 'meeting_room.db';
    $backupDir = 'backups';
    
    if (!file_exists($sourceFile)) {
        throw new Exception('データベースファイルが見つかりません');
    }
    
    if (!is_dir($backupDir)) {
        mkdir($backupDir, 0755, true);
    }
    
    $backupFile = $backupDir . '/meeting_room_backup_' . date('Y-m-d_H-i-s') . '.db';
    
    if (!copy($sourceFile, $backupFile)) {
        throw new Exception('バックアップファイルの作成に失敗しました');
    }
    
    return $backupFile;
}

/**
 * ログを記録
 */
function writeLog($message, $level = 'INFO') {
    $logFile = 'logs/database.log';
    $logDir = dirname($logFile);
    
    if (!is_dir($logDir)) {
        mkdir($logDir, 0755, true);
    }
    
    $timestamp = date('Y-m-d H:i:s');
    $logEntry = "[$timestamp] [$level] $message" . PHP_EOL;
    
    file_put_contents($logFile, $logEntry, FILE_APPEND | LOCK_EX);
}
?>