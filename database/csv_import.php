<?php
// タイムゾーン設定
date_default_timezone_set('Asia/Tokyo');

// CSVインポート処理
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $tableName = $_POST['table_name'] ?? '';
    $clearTable = isset($_POST['clear_table']) && $_POST['clear_table'] == '1';
    
    if (empty($tableName) || !isset($_FILES['csv_file'])) {
        $error = 'テーブル名またはCSVファイルが指定されていません。';
    } else {
        try {
            $db = new PDO('sqlite:meeting_room.db');
            $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            
            // アップロードされたファイルを処理
            $csvFile = $_FILES['csv_file'];
            
            if ($csvFile['error'] !== UPLOAD_ERR_OK) {
                throw new Exception('ファイルアップロードエラー');
            }
            
            // CSVファイルを読み込み
            $handle = fopen($csvFile['tmp_name'], 'r');
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
                throw new Exception('CSVヘッダーが読み込めません');
            }
            
            // テーブルをクリア（オプション）
            if ($clearTable) {
                $db->exec("DELETE FROM $tableName");
                $success[] = "テーブル「$tableName」をクリアしました。";
            }
            
            // データ挿入用のSQL文を準備
            $placeholders = str_repeat('?,', count($headers));
            $placeholders = rtrim($placeholders, ',');
            $sql = "INSERT INTO $tableName (" . implode(',', $headers) . ") VALUES ($placeholders)";
            $stmt = $db->prepare($sql);
            
            $insertCount = 0;
            $errorCount = 0;
            $errors = [];
            
            // データ行を処理
            while (($row = fgetcsv($handle)) !== FALSE) {
                try {
                    // 列数を調整
                    $row = array_pad($row, count($headers), '');
                    $row = array_slice($row, 0, count($headers));
                    
                    $stmt->execute($row);
                    $insertCount++;
                } catch (Exception $e) {
                    $errorCount++;
                    $errors[] = "行 " . ($insertCount + $errorCount + 1) . ": " . $e->getMessage();
                    
                    // エラーが多すぎる場合は停止
                    if ($errorCount >= 10) {
                        $errors[] = "エラーが多すぎるため処理を停止しました。";
                        break;
                    }
                }
            }
            
            fclose($handle);
            
            $success[] = "CSV取り込み完了: $insertCount 件挿入";
            if ($errorCount > 0) {
                $success[] = "エラー: $errorCount 件";
            }
            
        } catch (Exception $e) {
            $error = 'インポートエラー: ' . $e->getMessage();
        }
    }
}
?>

<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CSV取り込み結果 - DB管理</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <h1>CSV取り込み結果</h1>
        
        <?php if (isset($error)): ?>
            <div class="error-message">
                <h2>❌ エラー</h2>
                <p><?php echo htmlspecialchars($error); ?></p>
            </div>
        <?php endif; ?>
        
        <?php if (isset($success)): ?>
            <div class="success-message">
                <h2>✅ 成功</h2>
                <?php foreach ($success as $msg): ?>
                    <p><?php echo htmlspecialchars($msg); ?></p>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>
        
        <?php if (isset($errors) && count($errors) > 0): ?>
            <div class="warning-message">
                <h2>⚠️ エラー詳細</h2>
                <ul>
                    <?php foreach ($errors as $err): ?>
                        <li><?php echo htmlspecialchars($err); ?></li>
                    <?php endforeach; ?>
                </ul>
            </div>
        <?php endif; ?>
        
        
        <?php if (isset($success)): ?>
            <div class="section">
                <h2>取り込み後のテーブル状況</h2>
                <?php
                try {
                    $stmt = $db->prepare("SELECT COUNT(*) as count FROM $tableName");
                    $stmt->execute();
                    $result = $stmt->fetch();
                    echo '<p>テーブル「' . htmlspecialchars($tableName) . '」の現在のレコード数: <strong>' . number_format($result['count']) . '件</strong></p>';
                    
                    // 最新のデータを表示
                    $stmt = $db->prepare("SELECT * FROM $tableName ORDER BY ROWID DESC LIMIT 5");
                    $stmt->execute();
                    $records = $stmt->fetchAll();
                    
                    if (count($records) > 0) {
                        echo '<h3>最新の5件</h3>';
                        echo '<table class="data-table">';
                        
                        // ヘッダー
                        echo '<tr>';
                        foreach (array_keys($records[0]) as $column) {
                            if (is_string($column)) {
                                echo '<th>' . htmlspecialchars($column) . '</th>';
                            }
                        }
                        echo '</tr>';
                        
                        // データ行
                        foreach ($records as $record) {
                            echo '<tr>';
                            foreach ($record as $key => $value) {
                                if (is_string($key)) {
                                    echo '<td>' . htmlspecialchars($value ?? '') . '</td>';
                                }
                            }
                            echo '</tr>';
                        }
                        echo '</table>';
                    }
                } catch (Exception $e) {
                    echo '<div class="error-message">データ取得エラー: ' . htmlspecialchars($e->getMessage()) . '</div>';
                }
                ?>
            </div>
        <?php endif; ?>
        
        <div class="section">
            <h2>操作メニュー</h2>
            <div class="buttons">
                <a href="index.php" class="btn btn-secondary">🔙 DB管理に戻る</a>
                <a href="table_status.php" class="btn btn-secondary">📊 テーブル状況確認</a>
                <a href="../index.html" class="btn btn-link">🏠 メインページ</a>
            </div>
        </div>
    </div>
</body>
</html>