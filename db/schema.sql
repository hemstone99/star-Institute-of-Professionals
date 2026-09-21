PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS courses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  level TEXT DEFAULT '',
  description TEXT DEFAULT '',
  overview TEXT DEFAULT '',
  modules TEXT DEFAULT '',
  requirements TEXT DEFAULT '',
  careers TEXT DEFAULT '',
  duration TEXT DEFAULT '',
  study_mode TEXT DEFAULT '',
  intake TEXT DEFAULT '',
  fees_note TEXT DEFAULT '',
  examining_body TEXT DEFAULT '',
  image TEXT DEFAULT '',
  featured INTEGER NOT NULL DEFAULT 0,
  published INTEGER NOT NULL DEFAULT 1,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS news (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  category TEXT DEFAULT 'General',
  excerpt TEXT DEFAULT '',
  body TEXT DEFAULT '',
  image TEXT DEFAULT '',
  published_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  featured INTEGER NOT NULL DEFAULT 0,
  published INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  body TEXT DEFAULT '',
  image TEXT DEFAULT '',
  event_date TEXT,
  end_date TEXT,
  location TEXT DEFAULT '',
  registration_info TEXT DEFAULT '',
  published INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS faqs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT DEFAULT 'General',
  published INTEGER NOT NULL DEFAULT 1,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS staff (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  title TEXT DEFAULT '',
  qualifications TEXT DEFAULT '',
  subjects TEXT DEFAULT '',
  experience TEXT DEFAULT '',
  photo TEXT DEFAULT '',
  published INTEGER NOT NULL DEFAULT 1,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS gallery (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  image TEXT NOT NULL,
  category TEXT DEFAULT 'Campus',
  caption TEXT DEFAULT '',
  published INTEGER NOT NULL DEFAULT 1,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS documents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  file_url TEXT NOT NULL,
  category TEXT DEFAULT 'Other',
  description TEXT DEFAULT '',
  file_size TEXT DEFAULT '',
  published INTEGER NOT NULL DEFAULT 1,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS announcements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT DEFAULT '',
  published INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS testimonials (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  role TEXT DEFAULT '',
  quote TEXT NOT NULL,
  published INTEGER NOT NULL DEFAULT 1,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS applications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  id_number TEXT DEFAULT '', dob TEXT DEFAULT '', gender TEXT DEFAULT '', address TEXT DEFAULT '',
  academic_level TEXT DEFAULT '', school TEXT DEFAULT '', grade TEXT DEFAULT '', course_id INTEGER,
  course_slug TEXT DEFAULT '', course_name TEXT DEFAULT '', study_mode TEXT DEFAULT '', guardian_name TEXT DEFAULT '',
  guardian_phone TEXT DEFAULT '', documents_note TEXT DEFAULT '', status TEXT NOT NULL DEFAULT 'new',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL, email TEXT NOT NULL, phone TEXT DEFAULT '', subject TEXT DEFAULT '', message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'unread', created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS graduation_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL, email TEXT NOT NULL, phone TEXT NOT NULL, course TEXT DEFAULT '', completion_year TEXT DEFAULT '',
  notes TEXT DEFAULT '', status TEXT NOT NULL DEFAULT 'new', created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY, value TEXT NOT NULL DEFAULT '', updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS admin_users (
  id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT NOT NULL UNIQUE, password_hash TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS admin_tokens (
  token TEXT PRIMARY KEY, username TEXT NOT NULL, expires_at TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_courses_published ON courses(published, featured, display_order);
CREATE INDEX IF NOT EXISTS idx_news_published ON news(published, published_at);
CREATE INDEX IF NOT EXISTS idx_events_published ON events(published, event_date);
CREATE INDEX IF NOT EXISTS idx_applications_created ON applications(created_at);
CREATE INDEX IF NOT EXISTS idx_messages_created ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_graduation_created ON graduation_requests(created_at);

INSERT OR IGNORE INTO admin_users (username, password_hash) VALUES ('admin', '240be518fabd272d6f8a2e9c392a231f8c2b8bdf0f6f0d5d7c1a9e6b7c3d2f1a');
-- The seed script replaces this development-only hash with SHA-256(admin123).

-- For a new database, run seed.sql after this schema file.

-- End of schema.
