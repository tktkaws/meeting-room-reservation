<?php
// タイムゾーン設定
date_default_timezone_set('Asia/Tokyo');

try {
    $db = new PDO('sqlite:meeting_room.db');
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // SQLファイルからテーブル構造を読み込み
    $schemaFile = 'meeting_room_reservation.sql';
    
    if (!file_exists($schemaFile)) {
        throw new Exception("スキーマファイル '$schemaFile' が見つかりません");
    }
    
    $schema = file_get_contents($schemaFile);
    
    if ($schema === false) {
        throw new Exception("スキーマファイルの読み込みに失敗しました");
    }
    
    // テーブル作成を実行
    $db->exec($schema);
    
    // 作成されたテーブルを確認
    $stmt = $db->prepare("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name");
    $stmt->execute();
    $createdTables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    
    $success = "テーブル作成が完了しました。作成されたテーブル数: " . count($createdTables);
    
} catch (PDOException $e) {
    $error = 'データベースエラー: ' . $e->getMessage();
} catch (Exception $e) {
    $error = 'エラー: ' . $e->getMessage();
}
?>

<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>テーブル作成結果 - DB管理</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <h1>テーブル作成結果</h1>
        
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
        
        <?php if (isset($createdTables) && count($createdTables) > 0): ?>
            <div class="section">
                <h2>作成されたテーブル一覧</h2>
                <div class="table-grid">
                    <?php foreach ($createdTables as $table): ?>
                        <div class="table-card">
                            <h3><?php echo htmlspecialchars($table); ?></h3>
                            <div class="count">🏗️ 作成済み</div>
                        </div>
                    <?php endforeach; ?>
                </div>
            </div>
            
            <div class="section">
                <h2>テーブル構造確認</h2>
                <?php foreach ($createdTables as $table): ?>
                    <div class="table-info">
                        <h3>📋 <?php echo htmlspecialchars($table); ?></h3>
                        <?php
                        try {
                            $stmt = $db->prepare("PRAGMA table_info($table)");
                            $stmt->execute();
                            $columns = $stmt->fetchAll();
                            
                            if (count($columns) > 0) {
                                echo '<table class="structure-table">';
                                echo '<tr><th>カラム名</th><th>データ型</th><th>NOT NULL</th><th>デフォルト値</th><th>PRIMARY KEY</th></tr>';
                                
                                foreach ($columns as $column) {
                                    echo '<tr>';
                                    echo '<td><strong>' . htmlspecialchars($column['name']) . '</strong></td>';
                                    echo '<td>' . htmlspecialchars($column['type']) . '</td>';
                                    echo '<td>' . ($column['notnull'] ? '✅' : '❌') . '</td>';
                                    echo '<td>' . htmlspecialchars($column['dflt_value'] ?? '') . '</td>';
                                    echo '<td>' . ($column['pk'] ? '🔑' : '') . '</td>';
                                    echo '</tr>';
                                }
                                echo '</table>';
                            }
                        } catch (Exception $e) {
                            echo '<div class="error-message">テーブル情報取得エラー: ' . htmlspecialchars($e->getMessage()) . '</div>';
                        }
                        ?>
                    </div>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>
        
        <div class="section">
            <h2>データベース情報</h2>
            <div class="info-grid">
                <div class="info-item">
                    <strong>データベースファイル:</strong> 
                    <?php echo file_exists('meeting_room.db') ? '存在' : '存在しない'; ?>
                </div>
                <div class="info-item">
                    <strong>ファイルサイズ:</strong> 
                    <?php echo file_exists('meeting_room.db') ? number_format(filesize('meeting_room.db') / 1024, 1) . ' KB' : 'N/A'; ?>
                </div>
                <div class="info-item">
                    <strong>テーブル数:</strong> 
                    <?php echo isset($createdTables) ? count($createdTables) : 0; ?>
                </div>
                <div class="info-item">
                    <strong>作成日時:</strong> 
                    <?php echo date('Y-m-d H:i:s'); ?>
                </div>
            </div>
        </div>
        
        <div class="section">
            <h2>次のステップ</h2>
            <div class="buttons">
                <a href="csv_import.php" class="btn btn-primary">📥 CSV取り込み</a>
                <a href="table_status.php" class="btn btn-secondary">📊 テーブル状況確認</a>
            </div>
        </div>
        
        <div class="section">
            <h2>操作メニュー</h2>
            <div class="buttons">
                <a href="index.php" class="btn btn-secondary">🔙 DB管理に戻る</a>
                <a href="../index.html" class="btn btn-link">🏠 メインページ</a>
            </div>
        </div>
    </div>
</body>
</html>