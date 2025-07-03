<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>会議室予約システム - DB管理</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <h1>会議室予約システム - データベース管理</h1>
        
        <div class="section">
            <h2>データベース操作</h2>
            <div class="buttons">
                <a href="drop_tables.php" class="btn" style="background: #e74c3c; color: white;" onclick="return confirm('⚠️ 全テーブルを削除します。この操作は元に戻せません。よろしいですか？')">
                    🗑️ テーブル削除
                </a>
                <a href="create_tables.php" class="btn" style="background: #f39c12; color: white;">
                    🏗️ テーブル作成
                </a>
                <a href="table_status.php" class="btn btn-secondary">
                    📊 テーブル状況確認
                </a>
            </div>
        </div>

        <div class="section">
            <h2>CSVデータ取り込み</h2>
            <form action="csv_import.php" method="post" enctype="multipart/form-data" class="csv-form">
                <div class="form-group">
                    <label for="table_name">取り込み先テーブル:</label>
                    <select id="table_name" name="table_name" required>
                        <option value="">選択してください</option>
                        <option value="users">ユーザー (users)</option>
                        <option value="departments">部署 (departments)</option>
                        <option value="tags">タグ (tags)</option>
                        <option value="reservations">予約 (reservations)</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="csv_file">CSVファイル:</label>
                    <input type="file" id="csv_file" name="csv_file" accept=".csv" required>
                    <small class="help-text">※UTF-8エンコードのCSVファイルを選択してください</small>
                </div>
                
                <div class="form-group">
                    <label>
                        <input type="checkbox" name="clear_table" value="1">
                        取り込み前にテーブルをクリア
                    </label>
                </div>
                
                <button type="submit" class="btn btn-success">📥 CSV取り込み実行</button>
            </form>
        </div>

        <div class="section">
            <h2>現在のテーブル状況</h2>
            <div id="table-summary">
                <?php
                try {
                    $db = new PDO('sqlite:meeting_room.db');
                    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                    
                    $tables = ['users', 'departments', 'tags', 'reservations', 'reservation_groups', 'reservation_group_relations'];
                    
                    echo '<div class="table-grid">';
                    foreach ($tables as $table) {
                        try {
                            $stmt = $db->prepare("SELECT COUNT(*) as count FROM $table");
                            $stmt->execute();
                            $result = $stmt->fetch();
                            $count = $result['count'];
                            
                            echo '<div class="table-card">';
                            echo '<h3>' . $table . '</h3>';
                            echo '<div class="count">' . number_format($count) . '件</div>';
                            echo '</div>';
                        } catch (Exception $e) {
                            echo '<div class="table-card error">';
                            echo '<h3>' . $table . '</h3>';
                            echo '<div class="count">エラー</div>';
                            echo '</div>';
                        }
                    }
                    echo '</div>';
                    
                } catch (Exception $e) {
                    echo '<div class="error-message">データベース接続エラー: ' . htmlspecialchars($e->getMessage()) . '</div>';
                }
                ?>
            </div>
        </div>

        <div class="section">
            <h2>最新の予約データ</h2>
            <div class="recent-data">
                <?php
                try {
                    $stmt = $db->prepare("
                        SELECT r.*, u.name as user_name, t.name as tag_name 
                        FROM reservations r 
                        LEFT JOIN users u ON r.user_id = u.id 
                        LEFT JOIN tags t ON r.tag_id = t.id
                        ORDER BY r.created_at DESC 
                        LIMIT 10
                    ");
                    $stmt->execute();
                    $reservations = $stmt->fetchAll();
                    
                    if (count($reservations) > 0) {
                        echo '<table class="data-table">';
                        echo '<tr>';
                        echo '<th>ID</th><th>タイトル</th><th>予約者</th><th>タグ</th><th>日時</th>';
                        echo '</tr>';
                        
                        foreach ($reservations as $reservation) {
                            echo '<tr>';
                            echo '<td>' . $reservation['id'] . '</td>';
                            echo '<td>' . htmlspecialchars($reservation['title']) . '</td>';
                            echo '<td>' . htmlspecialchars($reservation['user_name'] ?? '未設定') . '</td>';
                            echo '<td>' . htmlspecialchars($reservation['tag_name'] ?? '未設定') . '</td>';
                            echo '<td>' . $reservation['date'] . ' ' . substr($reservation['start_time'], 11, 5) . '</td>';
                            echo '</tr>';
                        }
                        echo '</table>';
                    } else {
                        echo '<p class="no-data">予約データがありません</p>';
                    }
                    
                } catch (Exception $e) {
                    echo '<div class="error-message">データ取得エラー: ' . htmlspecialchars($e->getMessage()) . '</div>';
                }
                ?>
            </div>
        </div>

        <div class="section">
            <h2>リンク</h2>
            <div class="links">
                <a href="../index.html" class="btn btn-link">🏠 メインページに戻る</a>
                <a href="table_status.php" class="btn btn-link">📋 詳細テーブル状況</a>
            </div>
        </div>
    </div>
</body>
</html>