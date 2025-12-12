-- Insert Users (Students and Super-Admins)
INSERT INTO users (email, first_name, last_name, role, created_at, updated_at) VALUES
('iishita_be22@thapar.edu', 'Ishita', 'Garg', 'student', NOW(), NOW()),
('ggulati_be22@thapar.edu', 'Garvit', 'Gulati', 'student', NOW(), NOW()),
('athakur1_be22@thapar.edu', 'Aditya', 'Thakur', 'student', NOW(), NOW()),
('ggovinda_be22@thapar.edu', 'Govind', 'SkySik', 'student', NOW(), NOW()),
('ksingla1_be22@thapar.edu', 'Keshav', 'Singla', 'student', NOW(), NOW()),
('ishita11.ishu@gmail.com', 'Ishita', 'Garg', 'super-admin', NOW(), NOW()),
('ggulati872@gmail.com', 'Gulati', 'Gulati', 'super-admin', NOW(), NOW()),
('ad.2barwal@gmail.com', 'Aditya', 'Thakur', 'admin', NOW(), NOW()),
('govind.skysik@gmail.com', 'Govind', 'SkySik', 'super-admin', NOW(), NOW()),
('studytime3214@gmail.com', 'Keshav', 'Singla', 'super-admin', NOW(), NOW());

-- Insert Super-Admins
INSERT INTO super_admins (user, created_at, updated_at) VALUES
('ishita11.ishu@gmail.com', NOW(), NOW()),
('ggulati872@gmail.com', NOW(), NOW()),
('ad.2barwal@gmail.com', NOW(), NOW()),
('govind.skysik@gmail.com', NOW(), NOW()),
('studytime3214@gmail.com', NOW(), NOW());

-- Insert Branches
INSERT INTO branches (code, name) VALUES
('CSE', 'Computer Science and Engineeringggg'),
('ENC', 'electronics and communication'),
('ECE', 'Electronics and Communication Engineering');
('ME', 'Mechanical Engineering'),
('CE', 'Civil Engineering'),
('EE', 'Electrical Engineering');
('CE', 'Civil Engineering'),
('EE', 'Electrical Engineering');
('CIVIL', 'Civil Engineering'),
('EEE', 'Electrical and Electronics Engineering');

-- Insert Students
INSERT INTO students (roll_number, user, grad_year, program, course, cgpa, subjects_failed, 
                      class10_score_type, class10_score, class10_board, 
                      class12_score_type, class12_score, class12_board, 
                      date_of_birth, branch_code, is_placed, is_spr, is_sic, 
                      created_at, updated_at) 
VALUES
('120210001', 'iishita_be22@thapar.edu', 2025, 'ug', 'be', 8.5, 0, 
 'percentage', 95, 'CBSE', 
 'percentage', 92, 'CBSE', 
 '2003-04-15', 'CSE', false, false, false, 
 NOW(), NOW()),

('120210002', 'ggulati_be22@thapar.edu', 2025, 'ug', 'be', 8.2, 1, 
 'cgpa', 9.2, 'ICSE', 
 'cgpa', 9.0, 'ICSE', 
 '2003-08-10', 'CSE', false, false, false, 
 NOW(), NOW()),

('120210003', 'athakur1_be22@thapar.edu', 2025, 'ug', 'be', 8.0, 0, 
 'percentage', 90, 'CBSE', 
 'percentage', 88, 'CBSE', 
 '2003-07-22', 'ECE', false, false, false, 
 NOW(), NOW()),

('120210004', 'ggovinda_be22@thapar.edu', 2025, 'ug', 'be', 7.9, 1, 
 'cgpa', 8.5, 'ICSE', 
 'cgpa', 8.2, 'ICSE', 
 '2003-09-15', 'CSE', false, false, false, 
 NOW(), NOW()),

('120210005', 'ksingla1_be22@thapar.edu', 2025, 'ug', 'be', 8.3, 0, 
 'percentage', 92, 'CBSE', 
 'percentage', 89, 'CBSE', 
 '2003-06-10', 'ECE', false, false, false, 
 NOW(), NOW());
