INSERT INTO departments (department_name)
VALUES ("Finance"),
       ("Fleet"),
       ("Compliance"),
       ("Recruitment"),
       ("Operations");

INSERT INTO roles (title, salary, department_id)
VALUES ("CFO", 40000, 1), -- 1
       ("Accountant", 25000, 1), -- 2
       ("Auditor", 25000, 1), -- 3
       ("Fleet Operations Specialist", 30000, 2), -- 4
       ("Transport", 25000, 2), -- 5
       ("Fleet Manager", 35000, 2), -- 6
       ("Compliance Officer", 30000, 3), -- 7
       ("Compliance Assistant", 25000, 3), -- 8
       ("Human Resources", 27000, 4), -- 9
       ("Recruiter", 25000, 4), -- 10
       ("On-Site Manager", 30000, 5), -- 11
       ("Supervisor", 25000, 5), -- 12
       ("Lead Driver", 20000, 5), -- 13
       ("Area Manager", 35000, 5); -- 14

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Edward", "Byrne", 1, null), -- 1, CFO
       ("Aditya", "Mcintosh", 2, 1), -- 2, Accountant
       ("Liberty", "Reyes", 3, 1), -- 3, Auditor
       ("Khail", "Mcbride", 3, 1), -- 4, Auditor
       ("Oliwia", "Spencer", 4, null), -- 5, Fleet Operations Specialist
       ("Keaton", "Lopez", 5, null), -- 6, Transport
       ("Alan", "Brooks", 6, null), -- 7, Fleet Manager
       ("Brandon", "Stewart", 7, null), -- 8, Compliance Officer
       ("Kristina", "Duke", 8, 8), -- 9, Compliance Assistant
       ("Huda", "Manning", 8, 8), -- 10, Compliance Assistant
       ("Roman", "Brock", 9, null), -- 11, Human Resources
       ("Cara", "Solomon", 10, null), -- 12, Recruiter
       ("Bianca", "Hartman", 10, null), -- 13, Recruiter
       ("Robbie", "Mora", 10, null), -- 14, Recruiter
       ("Liliana", "Durham", 14, null), -- 15, Area Manager
       ("Tamsin", "Knox", 11, 15), -- 16, On-Site Manager
       ("Aysha", "Spence", 11, 15), -- 17, On-Site Manager
       ("Lucas", "Reyes", 11, 15), -- 18, On-Site Manager
       ("Mustafa", "Brown", 11, 15), -- 19, On-Site Manager
       ("Jasmin", "Morrow", 11, 15), -- 20, On-Site Manager
       ("Halima", "Little", 12, 18); -- 21, Supervisor


