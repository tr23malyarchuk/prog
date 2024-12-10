<?php
// Параметри підключення до бази даних
$host = 'localhost';
$dbname = 'ecolog';
$username = 'root'; // Ваше ім'я користувача MySQL
$password = 'Kondratets@222#54'; // Ваш пароль MySQL

// Підключення до бази даних
try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Помилка підключення до бази даних: " . $e->getMessage());
}

// Отримання даних з форми
$production = $_POST['production'];
$substance = $_POST['substance'];
$rBi = $_POST['rBi'];
$rBnorm = $_POST['rBnorm'];
$qv = $_POST['qv'];
$T = $_POST['T'];
$year = $_POST['year'];
$mi = $_POST['mi'];

// Запит на вставку даних в таблицю
$sql = "INSERT INTO emissions_atmos_lab4 (production, substance, rBi, rBnorm, qv, T, year, mi) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

$stmt = $pdo->prepare($sql);

// Виконання запиту з переданими параметрами
if ($stmt->execute([$production, $substance, $rBi, $rBnorm, $qv, $T, $year, $mi])) {
    echo "Дані успішно збережено!";
} else {
    echo "Помилка при збереженні даних.";
}
?>
