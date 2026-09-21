export type FieldType = 'text' | 'textarea' | 'tall' | 'select' | 'checkbox' | 'number' | 'date' | 'datetime' | 'image';

export type Field = {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: string[];
  hint?: string;
  placeholder?: string;
};

export type Resource = {
  endpoint: string;
  title: string;
  singular: string;
  columns: { key: string; label: string; badge?: boolean }[];
  fields: Field[];
};

const CATS = ['Accounting & Finance', 'Management', 'ICT & Computing', 'Cisco Network Academy', 'Beauty & Cosmetology', 'Engineering', 'Consultancy & Training'];
const LEVELS = ['Certificate', 'Diploma', 'Higher Diploma', 'Professional (KASNEB)', 'Professional (Cisco)', 'Professional (KISM)', 'Short Course', 'Service'];

export const RESOURCES: Record<string, Resource> = {
  courses: {
    endpoint: '/api/courses', title: 'Courses', singular: 'Course',
    columns: [{ key: 'name', label: 'Name' }, { key: 'category', label: 'School', badge: true }, { key: 'level', label: 'Level' }, { key: 'published', label: 'Status', badge: true }],
    fields: [
      { key: 'name', label: 'Course Name', type: 'text', required: true },
      { key: 'slug', label: 'URL Slug', type: 'text', hint: 'Auto-generated from name if left blank.' },
      { key: 'category', label: 'School', type: 'select', required: true, options: CATS },
      { key: 'level', label: 'Level', type: 'select', options: LEVELS },
      { key: 'description', label: 'Short Description', type: 'textarea', required: true },
      { key: 'overview', label: 'Full Overview', type: 'tall' },
      { key: 'modules', label: 'Modules / Objectives (one per line)', type: 'tall' },
      { key: 'requirements', label: 'Entry Requirements (one per line)', type: 'tall' },
      { key: 'careers', label: 'Career Paths (one per line)', type: 'tall' },
      { key: 'duration', label: 'Duration', type: 'text', placeholder: 'e.g. 6 months' },
      { key: 'study_mode', label: 'Study Modes', type: 'text', placeholder: 'e.g. Full-Time, Part-Time, Evening, eLearning' },
      { key: 'intake', label: 'Intake', type: 'text', placeholder: 'e.g. January / May / September' },
      { key: 'fees_note', label: 'Fees Note', type: 'text', hint: 'Never invent amounts — reference the official fee structure or “Contact accounts office”.' },
      { key: 'examining_body', label: 'Examining / Certifying Body', type: 'text', placeholder: 'e.g. KASNEB' },
      { key: 'image', label: 'Image URL', type: 'image' },
      { key: 'featured', label: 'Featured on homepage', type: 'checkbox' },
      { key: 'published', label: 'Published', type: 'checkbox' },
      { key: 'display_order', label: 'Display Order', type: 'number' },
    ],
  },
  news: {
    endpoint: '/api/news', title: 'News', singular: 'Article',
    columns: [{ key: 'title', label: 'Title' }, { key: 'category', label: 'Category', badge: true }, { key: 'published_at', label: 'Date' }, { key: 'published', label: 'Status', badge: true }],
    fields: [
      { key: 'title', label: 'Title', type: 'text', required: true },
      { key: 'slug', label: 'URL Slug', type: 'text' },
      { key: 'category', label: 'Category', type: 'select', options: ['Announcements', 'Intakes', 'Results', 'Campus', 'Events', 'General'] },
      { key: 'excerpt', label: 'Excerpt', type: 'textarea' },
      { key: 'body', label: 'Body (blank line = new paragraph)', type: 'tall' },
      { key: 'image', label: 'Image URL', type: 'image' },
      { key: 'published_at', label: 'Publish Date', type: 'datetime' },
      { key: 'featured', label: 'Featured', type: 'checkbox' },
      { key: 'published', label: 'Published', type: 'checkbox' },
    ],
  },
  events: {
    endpoint: '/api/events', title: 'Events', singular: 'Event',
    columns: [{ key: 'title', label: 'Title' }, { key: 'event_date', label: 'Date' }, { key: 'location', label: 'Venue' }, { key: 'published', label: 'Status', badge: true }],
    fields: [
      { key: 'title', label: 'Title', type: 'text', required: true },
      { key: 'slug', label: 'URL Slug', type: 'text' },
      { key: 'description', label: 'Short Description', type: 'textarea' },
      { key: 'body', label: 'Full Details (blank line = new paragraph)', type: 'tall' },
      { key: 'image', label: 'Image URL', type: 'image' },
      { key: 'event_date', label: 'Start Date & Time', type: 'datetime' },
      { key: 'end_date', label: 'End Date & Time', type: 'datetime' },
      { key: 'location', label: 'Venue', type: 'text', placeholder: 'e.g. Maganjo House, Mombasa' },
      { key: 'registration_info', label: 'Registration Info', type: 'textarea' },
      { key: 'published', label: 'Published', type: 'checkbox' },
    ],
  },
  faqs: {
    endpoint: '/api/faqs', title: 'FAQs', singular: 'FAQ',
    columns: [{ key: 'question', label: 'Question' }, { key: 'category', label: 'Topic', badge: true }, { key: 'published', label: 'Status', badge: true }],
    fields: [
      { key: 'question', label: 'Question', type: 'text', required: true },
      { key: 'answer', label: 'Answer', type: 'textarea', required: true },
      { key: 'category', label: 'Topic', type: 'select', options: ['Courses', 'Applications', 'Requirements', 'Intakes', 'Fees', 'Study Modes', 'Location & Contact', 'eLearning', 'Graduation'] },
      { key: 'published', label: 'Published', type: 'checkbox' },
      { key: 'display_order', label: 'Display Order', type: 'number' },
    ],
  },
  staff: {
    endpoint: '/api/staff', title: 'Staff', singular: 'Staff Member',
    columns: [{ key: 'name', label: 'Name' }, { key: 'title', label: 'Title' }, { key: 'published', label: 'Status', badge: true }],
    fields: [
      { key: 'name', label: 'Full Name', type: 'text', required: true },
      { key: 'title', label: 'Title / Role', type: 'text', placeholder: 'e.g. Lecturer — Accounting' },
      { key: 'qualifications', label: 'Qualifications', type: 'textarea' },
      { key: 'subjects', label: 'Subjects Taught', type: 'textarea' },
      { key: 'experience', label: 'Experience', type: 'text', placeholder: 'e.g. 15 Years' },
      { key: 'photo', label: 'Photo URL', type: 'image' },
      { key: 'published', label: 'Published', type: 'checkbox' },
      { key: 'display_order', label: 'Display Order', type: 'number' },
    ],
  },
  gallery: {
    endpoint: '/api/gallery', title: 'Gallery', singular: 'Photo',
    columns: [{ key: 'title', label: 'Title' }, { key: 'category', label: 'Category', badge: true }, { key: 'published', label: 'Status', badge: true }],
    fields: [
      { key: 'title', label: 'Title', type: 'text', required: true },
      { key: 'image', label: 'Image URL', type: 'image', required: true },
      { key: 'category', label: 'Category', type: 'select', options: ['Campus', 'Classrooms', 'Laboratories', 'Library', 'Events', 'Students'] },
      { key: 'caption', label: 'Caption', type: 'text' },
      { key: 'published', label: 'Published', type: 'checkbox' },
      { key: 'display_order', label: 'Display Order', type: 'number' },
    ],
  },
  documents: {
    endpoint: '/api/documents', title: 'Documents', singular: 'Document',
    columns: [{ key: 'title', label: 'Title' }, { key: 'category', label: 'Type', badge: true }, { key: 'published', label: 'Status', badge: true }],
    fields: [
      { key: 'title', label: 'Title', type: 'text', required: true },
      { key: 'file_url', label: 'File URL', type: 'text', required: true, placeholder: '/downloads/filename.pdf' },
      { key: 'category', label: 'Type', type: 'select', options: ['Brochure', 'Fee Structure', 'Form', 'Policy', 'Other'] },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'file_size', label: 'File Size Label', type: 'text', placeholder: 'e.g. 1.2 MB' },
      { key: 'published', label: 'Published', type: 'checkbox' },
      { key: 'display_order', label: 'Display Order', type: 'number' },
    ],
  },
  announcements: {
    endpoint: '/api/announcements', title: 'Announcements', singular: 'Announcement',
    columns: [{ key: 'title', label: 'Title' }, { key: 'created_at', label: 'Created' }, { key: 'published', label: 'Status', badge: true }],
    fields: [
      { key: 'title', label: 'Title', type: 'text', required: true },
      { key: 'message', label: 'Message', type: 'textarea', required: true },
      { key: 'link', label: 'Link (optional)', type: 'text', placeholder: 'e.g. /admissions' },
      { key: 'published', label: 'Published', type: 'checkbox' },
    ],
  },
  testimonials: {
    endpoint: '/api/testimonials', title: 'Testimonials', singular: 'Testimonial',
    columns: [{ key: 'name', label: 'Name' }, { key: 'role', label: 'Role' }, { key: 'published', label: 'Status', badge: true }],
    fields: [
      { key: 'name', label: 'Name', type: 'text', required: true },
      { key: 'role', label: 'Role / Programme', type: 'text', placeholder: 'e.g. CPA Student' },
      { key: 'quote', label: 'Quote', type: 'textarea', required: true, hint: 'Only publish genuine testimonials with the student\'s consent.' },
      { key: 'published', label: 'Published', type: 'checkbox' },
      { key: 'display_order', label: 'Display Order', type: 'number' },
    ],
  },
};

export const STOCK_IMAGES = [
  '/images/hero.jpg', '/images/about.jpg', '/images/lab.jpg', '/images/library.jpg',
  '/images/classroom.jpg', '/images/training.jpg', '/images/campus.jpg', '/images/graduation.jpg',
  '/images/accounting.jpg', '/images/networking.jpg', '/images/beauty.jpg', '/images/engineering.jpg',
];
