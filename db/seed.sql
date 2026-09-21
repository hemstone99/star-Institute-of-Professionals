INSERT OR IGNORE INTO courses (slug,name,category,level,description,overview,modules,requirements,careers,duration,study_mode,intake,fees_note,examining_body,image,featured,published,display_order) VALUES
('cpa-foundation','CPA Foundation','Accounting & Finance','Professional (KASNEB)','Build a strong foundation in accounting, economics and business law.','A structured route for learners beginning professional accountancy studies.','Financial Accounting\nBusiness Mathematics\nEconomics\nCommunication Skills','KCSE or equivalent qualification.','Accounts assistant\nBookkeeping officer\nFinance clerk','6 months','Full-Time, Part-Time, Evening','January / May / September','Contact accounts office for the current fee structure.','KASNEB','/images/accounting.jpg',1,1,1),
('diploma-business-management','Diploma in Business Management','Management','Diploma','Develop practical skills for supervising people, projects and business operations.','The programme combines management theory with practical workplace skills.','Principles of Management\nEntrepreneurship\nHuman Resource Management\nMarketing','KCSE or equivalent.','Business administrator\nOperations supervisor\nEntrepreneur','2 years','Full-Time, Part-Time, Evening','January / May / September','Contact accounts office for the current fee structure.','KNEC','/images/training.jpg',1,1,2),
('certificate-information-technology','Certificate in Information Technology','ICT & Computing','Certificate','Gain essential computing, office productivity and digital skills.','A hands-on entry programme for learners starting an ICT career.','Computer Applications\nNetworking Fundamentals\nWeb Design\nDatabase Fundamentals','KCSE or equivalent.','ICT support assistant\nOffice systems operator\nJunior web assistant','1 year','Full-Time, Part-Time, Evening','January / May / September','Contact admissions for the current fee structure.','KNEC','/images/lab.jpg',1,1,3),
('cisco-ccna','Cisco CCNA','Cisco Network Academy','Professional (Cisco)','Learn networking fundamentals, routing, switching and network security.','Practical preparation for modern networking environments.','Network Fundamentals\nLAN Switching\nIP Routing\nNetwork Security','Basic computer literacy recommended.','Network support technician\nJunior network administrator','6 months','Full-Time, Part-Time, Weekend','Rolling intakes','Contact admissions for the current fee structure.','Cisco','/images/networking.jpg',0,1,4),
('beauty-therapy','Certificate in Beauty Therapy','Beauty & Cosmetology','Certificate','Learn professional beauty, skin care and salon practice.','Practical training designed for employment or entrepreneurship in the beauty industry.','Skin Care\nNail Technology\nMake-up\nSalon Practice','KCSE or equivalent.','Beauty therapist\nMake-up artist\nSalon entrepreneur','1 year','Full-Time, Part-Time','January / May / September','Contact admissions for the current fee structure.','TVET','/images/beauty.jpg',0,1,5),
('electrical-installation','Certificate in Electrical Installation','Engineering','Certificate','Build practical skills in safe domestic and commercial electrical installation.','A workshop-focused programme combining theory, safety and supervised practice.','Electrical Safety\nWiring Systems\nTesting and Maintenance\nRenewable Energy Basics','KCSE or equivalent.','Electrical installation assistant\nMaintenance technician','1 year','Full-Time, Part-Time','January / May / September','Contact admissions for the current fee structure.','TVET','/images/engineering.jpg',0,1,6);
DELETE FROM courses;
INSERT OR IGNORE INTO courses (slug,name,category,level,published,display_order) VALUES
('certified-public-accountant-cpa','Certified Public Accountant (CPA)','Accounting & Finance','Professional (KASNEB)',1,1),
('accounting-technicians-diploma-atd','Accounting Technicians Diploma (ATD)','Accounting & Finance','Professional (KASNEB)',1,2),
('certified-investment-financial-analysts-cifa','Certified Investment & Financial Analysts (CIFA)','Accounting & Finance','Professional (KASNEB)',1,3),
('certificate-accounting-management-skills-cams','Certificate in Accounting & Management Skills (CAMS)','Accounting & Finance','Professional (KASNEB)',1,4),
('certificate-in-business-management','Certificate in Business Management','Management','Certificate',1,5),
('diploma-in-business-management','Diploma in Business Management','Management','Diploma',1,6),
('sales-and-marketing','Sales and Marketing (Certificate & Diploma)','Management','Certificate',1,7),
('human-resource-management','Human Resource Management (Certificate & Diploma)','Management','Certificate',1,8),
('purchasing-and-supplies','Purchasing and Supplies (KISM & CIPS)','Management','Certificate',1,9),
('clearing-and-forwarding','Clearing and Forwarding (Certificate & Diploma)','Management','Certificate',1,10),
('diploma-in-maritime-management','Diploma in Maritime Management','Management','Diploma',1,11),
('information-technology','Information Technology (Certificate & Diploma)','ICT & Computing','Certificate',1,12),
('computer-packages','Computer Packages','ICT & Computing','Short Course',1,13),
('computer-networking','Computer Networking','ICT & Computing','Certificate',1,14),
('computer-repair-maintenance','Computer Repair & Maintenance','ICT & Computing','Certificate',1,15),
('web-and-software-development','Web and Software Development','ICT & Computing','Certificate',1,16),
('graphic-design','Graphic Design','ICT & Computing','Certificate',1,17),
('enterprise-resource-planning-erp','Enterprise Resource Planning (ERP)','ICT & Computing','Short Course',1,18),
('architectural-packages-autocad-archicad','Architectural Packages (AutoCAD & ArchiCAD)','ICT & Computing','Certificate',1,19),
('accounting-packages','Accounting Packages (QuickBooks, Sage, Pastel)','ICT & Computing','Short Course',1,20),
('ccna-cisco-certified-network-associate','CCNA (Cisco Certified Network Associate)','Cisco Network Academy','Professional (Cisco)',1,21),
('it-essentials','IT Essentials','Cisco Network Academy','Professional (Cisco)',1,22),
('networking-essentials','Networking Essentials','Cisco Network Academy','Professional (Cisco)',1,23),
('cybersecurity-operations-cyberops','CyberSecurity Operations (CyberOps)','Cisco Network Academy','Professional (Cisco)',1,24),
('cybersecurity-essentials','CyberSecurity Essentials','Cisco Network Academy','Professional (Cisco)',1,25),
('certificate-in-cosmetology','Certificate in Cosmetology','Beauty & Cosmetology','Certificate',1,26),
('diploma-in-cosmetology','Diploma in Cosmetology','Beauty & Cosmetology','Diploma',1,27),
('certificate-in-hairdressing-beauty-therapy','Certificate in Hairdressing & Beauty Therapy','Beauty & Cosmetology','Certificate',1,28),
('certificate-electrical-electronics-engineering','Certificate in Electrical & Electronics Engineering','Engineering','Certificate',1,29),
('diploma-electrical-electronics-engineering','Diploma in Electrical & Electronics Engineering','Engineering','Diploma',1,30),
('consultancy-corporate-training','Consultancy & Corporate Training','Consultancy & Training','Service',1,31);

DELETE FROM news WHERE slug IN ('september-intake-now-open', 'student-success-stories', 'new-computer-lab');
INSERT OR IGNORE INTO news (slug,title,category,excerpt,body,image,published_at,featured,published) VALUES
('september-intake-now-open','September Intake Applications Now Open','Intakes','Applications are open for the next intake across our professional programmes.','Applications are now open for the September intake. Visit the admissions office or use our online application form to reserve your place.\n\nOur admissions team can help you select a programme, understand entry requirements and plan your study mode.','/images/hero.jpg','2026-08-15T09:00:00Z',1,1),
('student-success-stories','Building Career Confidence Through Practical Learning','Campus','How practical learning helps our students prepare for the workplace.','Our trainers combine classroom instruction with practical exercises, guided projects and career-focused advice.','/images/classroom.jpg','2026-07-20T09:00:00Z',0,1),
('new-computer-lab','New Computer Lab Resources Available','Announcements','Students can now access expanded computer lab resources on campus.','The institute has expanded its computer lab resources to support ICT, Cisco and digital skills programmes.','/images/lab.jpg','2026-06-10T09:00:00Z',0,1);

DELETE FROM events WHERE slug IN ('september-open-day', 'career-guidance-clinic');
INSERT OR IGNORE INTO events (slug,title,description,body,image,event_date,end_date,location,registration_info,published) VALUES
('september-open-day','September Open Day','Meet our trainers, tour the campus and get programme guidance.','Join us for an open day at Maganjo House. Bring your academic documents for an admissions consultation.','/images/campus.jpg','2026-09-26T09:00:00Z','2026-09-26T13:00:00Z','Maganjo House, Nyerere Avenue, Mombasa','Register at the admissions office or call +254 704 978 271.',1),
('career-guidance-clinic','Career Guidance Clinic','Get help choosing a course and planning your next step.','Our admissions and training team will be available for one-on-one guidance.','/images/training.jpg','2026-10-10T09:00:00Z','2026-10-10T13:00:00Z','Star Institute campus','Free walk-in session.',1);

DELETE FROM faqs WHERE question IN ('Which programmes does Star Institute offer?','Can I study part-time or in the evening?','How do I apply?','Where is the campus located?');
INSERT OR IGNORE INTO faqs (question,answer,category,display_order) VALUES
('Which programmes does Star Institute offer?','We offer programmes in Accounting & Finance, Management, ICT & Computing, Cisco Networking, Beauty & Cosmetology, Engineering and Consultancy & Training.','Courses',1),
('Can I study part-time or in the evening?','Yes. Many programmes offer full-time, part-time, evening, weekend or eLearning options. Confirm the available mode with admissions.','Study Modes',2),
('How do I apply?','Use the online Apply Now form or visit our Mombasa campus. Our admissions team will guide you through programme selection and requirements.','Applications',3),
('Where is the campus located?','We are at Maganjo House, 3rd and 4th Floors, Nyerere Avenue, Mombasa, Kenya.','Location & Contact',4);

DELETE FROM staff WHERE name IN (
	'Admissions & Training Team', 'Student Support Office', 'Collince Gworo', 'Haroon Wafula',
	'Isaac Shem Omunzi', 'Kassim Masoud', 'Moses Kiilu', 'Mwenda William',
	'Obuya Agapitous', 'Peter Kimilu', 'Peter Muriithi', 'Richard Nyambok'
);

INSERT OR IGNORE INTO staff (name,title,qualifications,subjects,experience,photo,display_order) VALUES
('Collince Gworo','Lecturer','Professional teaching qualifications','Accounting and Finance','Experienced educator','/images/staff/collince-gworo.png',1),
('Haroon Wafula','Lecturer','Professional teaching qualifications','Business and Management','Experienced educator','/images/staff/haroon-wafula.png',2),
('Isaac Shem Omunzi','Lecturer','Professional teaching qualifications','ICT and Computing','Experienced educator','/images/staff/isaac-shem-omunzi.png',3),
('Kassim Masoud','Lecturer','Professional teaching qualifications','Accounting and Finance','Experienced educator','/images/staff/kassim-masoud.png',4),
('Moses Kiilu','Lecturer','Professional teaching qualifications','Engineering and Technical Studies','Experienced educator','/images/staff/moses-kiilu.png',5),
('Mwenda William','Lecturer','Professional teaching qualifications','Business and Management','Experienced educator','/images/staff/mwenda-william.png',6),
('Obuya Agapitous','Lecturer','Professional teaching qualifications','ICT and Computing','Experienced educator','/images/staff/obuya-agapitous.png',7),
('Peter Kimilu','Lecturer','Professional teaching qualifications','Engineering and Technical Studies','Experienced educator','/images/staff/peter-kimilu.png',8),
('Peter Muriithi','Lecturer','Professional teaching qualifications','Accounting and Finance','Experienced educator','/images/staff/peter-muriithi.png',9),
('Richard Nyambok','Lecturer','Professional teaching qualifications','Business and Management','Experienced educator','/images/staff/richard-nyambok.png',10);

DELETE FROM gallery WHERE title IN ('Our Campus','Learning in the Lab','Collaborative Classroom','Graduation Day');
INSERT OR IGNORE INTO gallery (title,image,category,caption,display_order) VALUES
('Our Campus','/images/campus.jpg','Campus','A welcoming city-centre learning environment.',1),
('Learning in the Lab','/images/lab.jpg','Laboratories','Practical ICT and computing sessions.',2),
('Collaborative Classroom','/images/classroom.jpg','Classrooms','Students learning together with trainer support.',3),
('Graduation Day','/images/graduation.jpg','Events','Celebrating student achievement.',4);

DELETE FROM documents WHERE file_url IN ('/downloads/CPA-ATD-FEES-STRUCTURE.pdf','/downloads/MANAGEMENT-FEE-STRUCTURE.pdf','/downloads/BEAUTY-COSMETOLOGY-FEE-STRUCTURE.pdf','/downloads/STAR-BROCHURE-2024.pdf');
INSERT OR IGNORE INTO documents (title,file_url,category,description,file_size,display_order) VALUES
('CPA & ATD Fee Structure','/downloads/CPA-ATD-FEES-STRUCTURE.pdf','Fee Structure','Official CPA and ATD fee schedule. Confirm current fees with the accounts office before payment.','PDF',1),
('Management Programmes Fee Structure','/downloads/MANAGEMENT-FEE-STRUCTURE.pdf','Fee Structure','Official Management programmes fee schedule. Confirm current fees with the accounts office before payment.','PDF',2),
('Beauty & Cosmetology Fee Structure','/downloads/BEAUTY-COSMETOLOGY-FEE-STRUCTURE.pdf','Fee Structure','Official Beauty & Cosmetology fee schedule. Confirm current fees with the accounts office before payment.','PDF',3),
('Star Institute Brochure 2024','/downloads/STAR-BROCHURE-2024.pdf','Brochure','The official institute brochure — programmes, campus and student life overview.','PDF',4);

DELETE FROM announcements WHERE title = 'September intake now open';
INSERT OR IGNORE INTO announcements (title,message,link,published) VALUES ('September intake now open','Applications are open across selected programmes.','/apply',1);
DELETE FROM testimonials WHERE name IN ('Amina Hassan','Brian Mwangi');
INSERT OR IGNORE INTO testimonials (name,role,quote,display_order) VALUES ('Amina Hassan','CPA Student','The trainers made difficult topics practical and gave me confidence to continue my professional studies.',1),('Brian Mwangi','ICT Graduate','The hands-on sessions helped me build skills I can use in the workplace.',2);

INSERT OR IGNORE INTO site_settings (key,value) VALUES ('admissions_email','starinstitute.msa@gmail.com'),('admissions_phone','+254 704 978 271');
