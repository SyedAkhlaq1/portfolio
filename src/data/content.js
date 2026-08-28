// Single source of truth for all portfolio content.
// Derived from Syed Akhlaq Hussain's resume.

export const profile = {
  name: 'Syed Akhlaq Hussain',
  role: 'Full Stack Developer',
  focus: 'Computer Networks & Information Security',
  location: 'Hyderabad, Telangana, India',
  email: 'akhlaqhussain3011@gmail.com',
  linkedin: 'https://www.linkedin.com/in/syed-akhlaq-hussain-0a76411b4',
  github: 'https://github.com/SyedAkhlaq1',
  resume: 'Syed-Akhlaq-Hussain-Resume.pdf',
  summary:
    'Efficient Full-Stack Web Developer skilled in optimizing application performance and delivering clean, high-quality code. Experienced with modern web technologies and frameworks such as React and Flask, with strong expertise in Python for server-side development. A detail-oriented professional with an MTech in Computer Networks & Information Security, passionate about building secure, scalable applications and continuously improving technical solutions.',
  availability: 'Open to full-stack & security engineering roles',
}

// Short keyword strip used in the scrolling marquee.
export const marquee = [
  'Full Stack',
  'React',
  'Flask',
  'Python',
  'Java',
  'MySQL',
  'Two-Factor Auth',
  'Ensemble Learning',
  'Explainable AI',
  'Intrusion Detection',
  'Session Security',
  'Computer Networks',
  'Information Security',
  'Clean Code',
]

export const stats = [
  { value: '10+', label: 'Months in industry, trainee to intern' },
  { value: '3', label: 'Shipped projects, dissertation to CRUD' },
  { value: 'MTech', label: 'Computer Networks & Information Security' },
  { value: '3', label: 'Frameworks in daily use' },
]

export const skillGroups = [
  {
    title: 'Languages',
    items: ['Python', 'Java', 'SQL'],
  },
  {
    title: 'Web',
    items: ['HTML', 'CSS', 'JavaScript', 'Responsive UI'],
  },
  {
    title: 'Frameworks & Libraries',
    items: ['React', 'Flask'],
  },
  {
    title: 'Data',
    items: ['MySQL', 'SQL modelling', 'CRUD APIs'],
  },
  {
    title: 'Security & Networking',
    items: [
      'Email-based 2FA / OTP',
      'SHA-256 password hashing',
      'Session security',
      'Secure client–server comms',
      'Computer networks fundamentals',
    ],
  },
  {
    title: 'Practice',
    items: ['Performance optimization', 'Clean, maintainable code', 'Version control', 'Real-time project modules'],
  },
]

export const experience = [
  {
    kind: 'Experience',
    role: 'Full-Stack Web Developer — Trainee → Intern',
    org: 'ExcelR EdTech Pvt. Ltd, AI Variant',
    place: 'Hyderabad, India',
    period: '03/2024 — 12/2024',
    points: [
      'Developed and enhanced UI components using HTML, CSS, JavaScript and React.',
      "Contributed to the Employee Management System project — developed the application's front-end and implemented employee CRUD operations.",
    ],
  },
  {
    kind: 'Training',
    role: 'Full Stack Java Developer',
    org: 'QSpiders — Software Training Institute',
    place: 'Hyderabad, India',
    period: '07/2023 — 03/2024',
    points: [
      'Intensive hands-on training across front-end, back-end and database integration with real-time project modules.',
      'Technical competencies: HTML, CSS, JavaScript, React, Core Java, Advanced Java, OOP, SQL and full-stack web application development.',
    ],
  },
]

export const projects = [
  {
    index: '01',
    title:
      'Enhanced Intrusion Detection in IoT Networks: Leveraging Ensemble Learning and Explainable AI for Robust Security',
    blurb:
      'MTech dissertation — a Flask web app that classifies live IoT network traffic into 12 attack types in real time, backed by an ensemble ML model with Explainable AI.',
    stack: ['Python', 'Flask', 'scikit-learn', 'SHAP / LIME', 'MySQL'],
    tags: ['Research', 'Security', 'Machine Learning'],
    points: [
      'Trained and benchmarked eight classifiers (KNN, SVM, Decision Tree, Gradient Boost, XGBoost, Random Forest, Extra Trees, LightGBM) on the RT-IoT2022 dataset.',
      'Built the detection pipeline — XGBoost feature selection, SMOTEENN class balancing, and a soft-voting ensemble of Random Forest, Extra Trees and LightGBM — reaching 99.9% accuracy, precision, recall and F1.',
      'Integrated SHAP and LIME so every prediction ships with a per-feature explanation and confidence score.',
      'Wrapped the model in a Flask app with MySQL-backed user auth, a traffic-feature input form, real-time prediction and an analytics dashboard.',
      'Work published in the International Journal of Engineering Research and Science & Technology (IJERST), 2026.',
    ],
  },
  {
    index: '02',
    title: 'Secure Two-Factor Authentication (2FA) Login System',
    blurb:
      'A hardened login system with email-based OTP verification, from registration through password reset.',
    stack: ['HTML', 'CSS', 'Python (Flask)', 'MySQL'],
    tags: ['Security', 'Backend', 'Auth'],
    points: [
      'Email-based OTP verification layered on top of username / password sign-in.',
      'User registration with email verification, SHA-256 password hashing and session security.',
      'OTP generation, validation, resend-OTP and email-driven password reset.',
      'MySQL-backed user store with secured communication between front-end and back-end.',
    ],
  },
  {
    index: '03',
    title: 'Employee Management System',
    blurb:
      'A React application for managing employee records with a full create / read / update / delete workflow.',
    stack: ['HTML', 'CSS', 'JavaScript', 'React'],
    tags: ['Frontend', 'React', 'CRUD'],
    points: [
      'Full CRUD operations over employee information.',
      'Intuitive UI components for adding, editing, viewing and deleting records.',
      'Efficient state management with React Hooks for smooth, predictable updates.',
      'Reduces manual record-keeping and streamlines day-to-day workflow.',
    ],
  },
]

export const projectFilters = ['All', 'Research', 'Security', 'Frontend', 'Backend']

export const education = [
  {
    degree: 'Master of Technology (MTech)',
    field: 'Computer Networks and Information Security',
    org: 'Shadan College of Engineering & Technology — Jawaharlal Nehru Technological University, Hyderabad',
    period: '2024 — 2026',
  },
  {
    degree: 'Minor',
    field: 'Computer Science and Advanced Technologies',
    org: 'Indian Institute of Technology Mandi — IIT Mandi',
    period: '2024 — 2025',
  },
  {
    degree: 'Bachelor of Engineering (BE)',
    field: 'Electronics and Communication Engineering',
    org: 'Methodist College of Engineering & Technology — Osmania University, Hyderabad',
    period: '2019 — 2023',
  },
  {
    degree: 'Intermediate (MPC)',
    field: 'Mathematics, Physics & Chemistry',
    org: 'Sri Chaitanya Junior College, Hyderabad — Telangana State Board of Intermediate Education',
    period: '2017 — 2019',
  },
  {
    degree: 'Secondary School Certificate (SSC)',
    field: 'Class 10',
    org: 'Little Flower High School, Hyderabad — Telangana State Board of Secondary Education',
    period: '2017',
  },
]

export const certifications = [
  { name: 'The Complete Web Development Bootcamp', issuer: 'Udemy' },
  { name: 'Python Essentials', issuer: 'Cisco' },
]

export const achievements = [
  {
    title: 'Core Member — Google Developer Student Clubs (GDSC), MCET',
    detail: 'Helped organise campus tech events and developer workshops.',
  },
  {
    title: 'Hackathon Participant',
    detail: 'Team-based problem solving across multiple hackathons.',
  },
  {
    title: 'Event Anchor — College Events',
    detail: 'Hosted technical and cultural events; public speaking and coordination.',
  },
]
