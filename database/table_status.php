<?php
// タイムゾーン設定
date_default_timezone_set('Asia/Tokyo');

try {
    $db = new PDO('sqlite:meeting_room.db');
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // テーブル一覧を取得
    $tables = ['users', 'departments', 'tags', 'reservations', 'reservation_groups', 'reservation_group_relations'];
    $tableData = [];
    
    foreach ($tables as $table) {
        try {
            // レコード数を取得
            $stmt = $db->prepare("SELECT COUNT(*) as count FROM $table");
            $stmt->execute();
            $count = $stmt->fetch()['count'];
            
            // テーブル構造を取得
            $stmt = $db->prepare("PRAGMA table_info($table)");
            $stmt->execute();
            $columns = $stmt->fetchAll();
            
            // 最新データを取得
            $stmt = $db->prepare("SELECT * FROM $table ORDER BY ROWID DESC LIMIT 3");
            $stmt->execute();
            $records = $stmt->fetchAll();
            
            $tableData[$table] = [
                'count' => $count,
                'columns' => $columns,
                'records' => $records
            ];
        } catch (Exception $e) {
            $tableData[$table] = [
                'error' => $e->getMessage(),
                'count' => 0,
                'columns' => [],
                'records' => []
            ];
        }
    }
    
} catch (Exception $e) {
    $dbError = $e->getMessage();
}
?>

<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>テーブル状況 - DB管理</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <h1>テーブル状況詳細</h1>
        
        <?php if (isset($dbError)): ?>
            <div class="error-message">
                <h2>❌ データベース接続エラー</h2>
                <p><?php echo htmlspecialchars($dbError); ?></p>
            </div>
        <?php else: ?>
            
            <div class="section">
                <h2>テーブル概要</h2>
                <div class="table-overview">
                    <?php foreach ($tableData as $tableName => $data): ?>
                        <div class="table-summary-card">
                            <h3><?php echo htmlspecialchars($tableName); ?></h3>
                            <?php if (isset($data['error'])): ?>
                                <div class="error">❌ エラー: <?php echo htmlspecialchars($data['error']); ?></div>
                            <?php else: ?>
                                <div class="count">📊 <?php echo number_format($data['count']); ?>件</div>
                                <div class="columns">🗂️ <?php echo count($data['columns']); ?>カラム</div>
                            <?php endif; ?>
                        </div>
                    <?php endforeach; ?>
                </div>
            </div>
            
            <?php foreach ($tableData as $tableName => $data): ?>
                <?php if (!isset($data['error'])): ?>
                    <div class="section">
                        <h2>📋 <?php echo htmlspecialchars($tableName); ?> テーブル</h2>
                        
                        <div class="table-info">
                            <div class="info-grid">
                                <div class="info-item">
                                    <strong>レコード数:</strong> <?php echo number_format($data['count']); ?>件
                                </div>
                                <div class="info-item">
                                    <strong>カラム数:</strong> <?php echo count($data['columns']); ?>個
                                </div>
                            </div>
                        </div>
                        
                        <h3>カラム構造</h3>
                        <table class="structure-table">
                            <tr>
                                <th>カラム名</th>
                                <th>データ型</th>
                                <th>NOT NULL</th>
                                <th>デフォルト値</th>
                                <th>PRIMARY KEY</th>
                            </tr>
                            <?php foreach ($data['columns'] as $column): ?>
                                <tr>
                                    <td><strong><?php echo htmlspecialchars($column['name']); ?></strong></td>
                                    <td><?php echo htmlspecialchars($column['type']); ?></td>
                                    <td><?php echo $column['notnull'] ? '✅' : '❌'; ?></td>
                                    <td><?php echo htmlspecialchars($column['dflt_value'] ?? ''); ?></td>
                                    <td><?php echo $column['pk'] ? '🔑' : ''; ?></td>
                                </tr>
                            <?php endforeach; ?>
                        </table>
                        
                        <?php if (count($data['records']) > 0): ?>
                            <h3>最新データ (最大3件)</h3>
                            <div class="table-scroll">
                                <table class="data-table">
                                    <tr>
                                        <?php foreach (array_keys($data['records'][0]) as $column): ?>
                                            <?php if (is_string($column)): ?>
                                                <th><?php echo htmlspecialchars($column); ?></th>
                                            <?php endif; ?>
                                        <?php endforeach; ?>
                                    </tr>
                                    <?php foreach ($data['records'] as $record): ?>
                                        <tr>
                                            <?php foreach ($record as $key => $value): ?>
                                                <?php if (is_string($key)): ?>
                                                    <td><?php echo htmlspecialchars($value ?? ''); ?></td>
                                                <?php endif; ?>
                                            <?php endforeach; ?>
                                        </tr>
                                    <?php endforeach; ?>
                                </table>
                            </div>
                        <?php else: ?>
                            <div class="no-data">
                                <p>📭 データがありません</p>
                            </div>
                        <?php endif; ?>
                    </div>
                <?php endif; ?>
            <?php endforeach; ?>
            
            <div class="section">
                <h2>データベース統計情報</h2>
                <div class="stats">
                    <?php
                    $totalRecords = 0;
                    $totalTables = 0;
                    foreach ($tableData as $data) {
                        if (!isset($data['error'])) {
                            $totalRecords += $data['count'];
                            $totalTables++;
                        }
                    }
                    ?>
                    <div class="stat-item">
                        <div class="stat-number"><?php echo $totalTables; ?></div>
                        <div class="stat-label">テーブル数</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number"><?php echo number_format($totalRecords); ?></div>
                        <div class="stat-label">総レコード数</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number"><?php echo file_exists('meeting_room.db') ? number_format(filesize('meeting_room.db') / 1024, 1) : '0'; ?></div>
                        <div class="stat-label">DB サイズ (KB)</div>
                    </div>
                </div>
            </div>
            
        <?php endif; ?>
        
        <div class="section">
            <h2>操作メニュー</h2>
            <div class="buttons">
                <a href="index.php" class="btn btn-secondary">🔙 DB管理に戻る</a>
                <a href="javascript:location.reload()" class="btn btn-secondary">🔄 更新</a>
                <a href="../index.html" class="btn btn-link">🏠 メインページ</a>
            </div>
        </div>
    </div>
</body>
</html>