<?php
// タイムゾーン設定
date_default_timezone_set('Asia/Tokyo');

try {
    $db = new PDO('sqlite:meeting_room.db');
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // 全テーブルを削除
    $tables = ['reservation_group_relations', 'reservations', 'reservation_groups', 'tags', 'departments', 'users'];
    $droppedTables = [];
    $errors = [];
    
    foreach ($tables as $table) {
        try {
            $db->exec("DROP TABLE IF EXISTS $table");
            $droppedTables[] = $table;
        } catch (Exception $e) {
            $errors[] = "テーブル '$table' の削除でエラー: " . $e->getMessage();
        }
    }
    
    $success = "全テーブルを削除しました。削除されたテーブル: " . implode(', ', $droppedTables);
    
} catch (PDOException $e) {
    $error = 'データベース接続エラー: ' . $e->getMessage();
}
?>

<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>テーブル削除結果 - DB管理</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <h1>テーブル削除結果</h1>
        
        <?php if (isset($error)): ?>
            <div class="error-message">
                <h2>❌ エラー</h2>
                <p><?php echo htmlspecialchars($error); ?></p>
            </div>
        <?php endif; ?>
        
        <?php if (isset($success)): ?>
            <div class="success-message">
                <h2>✅ 成功</h2>
                <p><?php echo htmlspecialchars($success); ?></p>
            </div>
        <?php endif; ?>
        
        <?php if (isset($errors) && count($errors) > 0): ?>
            <div class="warning-message">
                <h2>⚠️ 警告</h2>
                <ul>
                    <?php foreach ($errors as $err): ?>
                        <li><?php echo htmlspecialchars($err); ?></li>
                    <?php endforeach; ?>
                </ul>
            </div>
        <?php endif; ?>
        
        <div class="section">
            <h2>削除されたテーブル一覧</h2>
            <?php if (isset($droppedTables) && count($droppedTables) > 0): ?>
                <div class="table-grid">
                    <?php foreach ($droppedTables as $table): ?>
                        <div class="table-card">
                            <h3><?php echo htmlspecialchars($table); ?></h3>
                            <div class="count">✅ 削除済み</div>
                        </div>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>
        </div>
        
        <div class="section">
            <h2>データベース確認</h2>
            <div class="info-grid">
                <div class="info-item">
                    <strong>データベースファイル:</strong> 
                    <?php echo file_exists('meeting_room.db') ? '存在' : '存在しない'; ?>
                </div>
                <div class="info-item">
                    <strong>ファイルサイズ:</strong> 
                    <?php echo file_exists('meeting_room.db') ? number_format(filesize('meeting_room.db') / 1024, 1) . ' KB' : 'N/A'; ?>
                </div>
            </div>
        </div>
        
        <div class="section">
            <h2>次のステップ</h2>
            <div class="buttons">
                <a href="create_tables.php" class="btn btn-primary">🏗️ テーブル作成</a>
                <a href="index.php" class="btn btn-secondary">🔙 DB管理に戻る</a>
            </div>
        </div>
        
        <div class="section">
            <h2>操作メニュー</h2>
            <div class="buttons">
                <a href="table_status.php" class="btn btn-secondary">📊 テーブル状況確認</a>
                <a href="../index.html" class="btn btn-link">🏠 メインページ</a>
            </div>
        </div>
    </div>
</body>
</html>