-- Users table
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user', -- 'user' or 'admin'
    department_id INTEGER DEFAULT 1,
    default_tag_id INTEGER DEFAULT 1,
    email_notification_type INTEGER DEFAULT 2, -- 1: 予約変更通知, 2: 送信しない
    tag_colors TEXT, -- JSON format: {"1": "#4299E1", "2": "#48BB78", "3": "#ED8936", "4": "#9F7AEA", "5": "#38B2AC"}
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES departments(id),
    FOREIGN KEY (default_tag_id) REFERENCES tags(id)
);

-- Departments table
CREATE TABLE departments (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tags table
CREATE TABLE tags (
    id INTEGER PRIMARY KEY,
    user_id INTEGER,
    name TEXT NOT NULL UNIQUE,
    color TEXT DEFAULT '#718096',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Reservations table
CREATE TABLE reservations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    tag_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    group_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (tag_id) REFERENCES tags(id),
    FOREIGN KEY (group_id) REFERENCES reservation_groups(id)
);

-- Reservation groups table (for recurring reservations)
CREATE TABLE reservation_groups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    repeat_type TEXT NOT NULL, -- 'daily', 'weekly', 'monthly'
    repeat_interval INTEGER DEFAULT 1,
    start_date DATE NOT NULL,
    end_date DATE,
    days_of_week TEXT, -- comma-separated days for weekly repeats
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE reservation_group_relations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    reserve_id INTEGER NOT NULL,
    group_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reserve_id) REFERENCES reservations(id) ON DELETE CASCADE,
    FOREIGN KEY (group_id) REFERENCES reservation_groups(id) ON DELETE CASCADE,
    UNIQUE(reserve_id, group_id)
);



