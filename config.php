<?php
$host = 'localhost';
$dbname = 'meettrack';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Database connection failed: " . $e->getMessage());
}

// Start session if not already started
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Authentication check function
function isAuthenticated() {
    return isset($_SESSION['user_id']);
}

// Redirect if not authenticated
function requireAuth() {
    if (!isAuthenticated()) {
        header('Location: login.php');
        exit;
    }
}

// Get current user
function getCurrentUser($pdo) {
    if (!isAuthenticated()) return null;
    $stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
    $stmt->execute([$_SESSION['user_id']]);
    return $stmt->fetch(PDO::FETCH_ASSOC);
}

// Role-based permission check
function hasPermission($user, $section, $action = 'view') {
    // $section: e.g. 'inventory', 'loss', 'coldstorage', 'users', 'settings', 'orders', 'dashboard'
    // $action: 'view', 'edit', 'order', etc.
    if (!$user || !isset($user['role'])) return false;
    $role = $user['role'];
    // Admin: all access
    if ($role === 'admin') return true;
    // Vendor: can view everything and order products only
    if ($role === 'vendor') {
        if ($section === 'orders' && $action === 'order') return true;
        if (in_array($section, ['dashboard', 'inventory', 'loss', 'coldstorage'])) return $action === 'view';
        return false;
    }
    // Firm: can control all inventory and loss
    if ($role === 'firm') {
        if (in_array($section, ['inventory', 'loss', 'dashboard'])) return true;
        return $section === 'orders' && $action === 'view';
    }
    // Coldstorage Manager: only coldstorage temperature set/condition update
    if ($role === 'coldstorage_manager') {
        return $section === 'coldstorage';
    }
    // Wholeseller: access every section except coldstorage, inventory, users, settings
    if ($role === 'wholeseller') {
        if (in_array($section, ['coldstorage', 'inventory', 'users', 'settings'])) return false;
        return true;
    }
    return false;
}
?>