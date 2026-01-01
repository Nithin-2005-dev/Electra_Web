export const SubjectData = [
  {
    semester: 1,
    title: "Foundation in Science & Programming",
    totalCredits: 27,
    subjects: [
      { name: "Chemistry", code: "CH-101", type: "Theory", credits: 4 },
      { name: "Mathematics I", code: "MA-101", type: "Theory", credits: 4 },
      { name: "Introduction to Programming", code: "CS-101", type: "Theory", credits: 4 },
      { name: "Basic Electronics", code: "EC-101", type: "Theory", credits: 4 },
      { name: "Environmental Science & Engineering", code: "CE-102", type: "Theory", credits: 3 },

      { name: "Chemistry Laboratory", code: "CH-111", type: "Lab", credits: 2 },
      { name: "Programming Laboratory", code: "CS-111", type: "Lab", credits: 2 },
      { name: "Basic Electronics Laboratory", code: "EC-111", type: "Lab", credits: 2 },
      { name: "Workshop Practice", code: "ME-111", type: "Lab", credits: 2 },
    ],
  },

  {
    semester: 2,
    title: "Engineering Fundamentals",
    totalCredits: 28,
    subjects: [
      { name: "Physics", code: "PH-101", type: "Theory", credits: 4 },
      { name: "Mathematics II", code: "MA-102", type: "Theory", credits: 4 },
      { name: "Engineering Mechanics", code: "ME-101", type: "Theory", credits: 4 },
      { name: "Basic Electrical Engineering", code: "EE-101", type: "Theory", credits: 4 },
      { name: "Communicative English", code: "HS-101", type: "Theory", credits: 3 },
      { name: "Engineering Graphics & Design", code: "CE-101", type: "Theory+Lab", credits: 3 },

      { name: "Physics Laboratory", code: "PH-111", type: "Lab", credits: 2 },
      { name: "Basic Electrical Engineering Laboratory", code: "EE-111", type: "Lab", credits: 2 },
      { name: "Language Laboratory", code: "HS-111", type: "Lab", credits: 2 },
    ],
  },

  {
    semester: 3,
    title: "Core Electrical Foundations",
    totalCredits: 29,
    subjects: [
      { name: "Signals and Systems", code: "EE-201", type: "Theory", credits: 4 },
      { name: "Mathematics III", code: "MA-201", type: "Theory", credits: 4 },
      { name: "Analog Electronics", code: "EE-202", type: "Theory", credits: 4 },
      { name: "Energy Science and Technology", code: "EE-203", type: "Theory", credits: 3 },
      { name: "Measuring Instruments & Measurements", code: "EE-204", type: "Theory", credits: 4 },
      { name: "Electromagnetic Field Theory", code: "EE-205", type: "Theory", credits: 4 },

      { name: "Programming & Simulation Lab", code: "EE-211", type: "Lab", credits: 2 },
      { name: "Measurement Laboratory", code: "EE-212", type: "Lab", credits: 2 },
      { name: "Analog Electronics Laboratory", code: "EC-226", type: "Lab", credits: 2 },
    ],
  },

  {
    semester: 4,
    title: "Machines, Circuits & Computing",
    totalCredits: 28,
    subjects: [
      { name: "Electrical Machines I", code: "EE-206", type: "Theory", credits: 4 },
      { name: "Power Systems I", code: "EE-207", type: "Theory", credits: 4 },
      { name: "Digital Electronics", code: "EE-208", type: "Theory", credits: 4 },
      { name: "Circuit Theory", code: "EE-209", type: "Theory", credits: 4 },
      { name: "Microprocessors & Microcontrollers", code: "EE-210", type: "Theory", credits: 3 },
      { name: "Programming & Data Structures", code: "CS-221", type: "Theory", credits: 3 },

      { name: "Circuit Theory Lab", code: "EE-213", type: "Lab", credits: 2 },
      { name: "Microprocessor Lab", code: "EE-214", type: "Lab", credits: 2 },
      { name: "Digital Electronics Lab", code: "EE-215", type: "Lab", credits: 2 },
    ],
  },

  {
    semester: 5,
    title: "Control, Machines & Signal Processing",
    totalCredits: 27,
    subjects: [
      { name: "Control Systems", code: "EE-301", type: "Theory", credits: 4 },
      { name: "Power Systems II", code: "EE-302", type: "Theory", credits: 4 },
      { name: "Electrical Machines II", code: "EE-303", type: "Theory", credits: 4 },
      { name: "Power Electronics", code: "EE-304", type: "Theory", credits: 4 },
      { name: "Digital Signal Processing", code: "EE-305", type: "Theory", credits: 3 },

      { name: "Electrical Machine Lab I", code: "EE-311", type: "Lab", credits: 2 },
      { name: "Power System Lab I", code: "EE-312", type: "Lab", credits: 2 },
      { name: "Control System Lab", code: "EE-313", type: "Lab", credits: 2 },
      { name: "Signal Processing Lab", code: "EE-314", type: "Lab", credits: 2 },
    ],
  },

  {
    semester: 6,
    title: "Advanced Power & Control",
    totalCredits: 27,
    subjects: [
      { name: "Switchgear & Protection", code: "EE-306", type: "Theory", credits: 4 },
      { name: "Industrial Drives", code: "EE-307", type: "Theory", credits: 4 },
      { name: "Analog & Digital Communication", code: "EC-327", type: "Theory", credits: 3 },
      { name: "Modern Control Systems", code: "EE-308", type: "Theory", credits: 4 },

      { name: "Professional Core Elective I", code: "EE-3XX", type: "Elective", credits: 3 },
      { name: "Open Elective I", code: "OE-3XX", type: "Elective", credits: 3 },

      { name: "Electrical Machine Lab II", code: "EE-315", type: "Lab", credits: 2 },
      { name: "Power System Lab II", code: "EE-316", type: "Lab", credits: 2 },
      { name: "Power Electronics & Drives Lab", code: "EE-317", type: "Lab", credits: 2 },
    ],
  },

  {
    semester: 7,
    title: "Industry Exposure & Specialization",
    totalCredits: 19,
    subjects: [
      { name: "Instrumentation", code: "EE-401", type: "Theory", credits: 4 },
      { name: "Business Management", code: "MS-401", type: "Theory", credits: 3 },

      { name: "Professional Core Elective II", code: "EE-4XX", type: "Elective", credits: 3 },
      { name: "Open Elective II", code: "OE-4XX", type: "Elective", credits: 3 },

      { name: "Industrial Training (6 weeks)", code: "EE-497", type: "Training", credits: 2 },
      { name: "Project I", code: "EE-498", type: "Project", credits: 4 },
    ],
  },

  {
    semester: 8,
    title: "Final Specialization & Capstone",
    totalCredits: 15,
    subjects: [
      { name: "Professional Core Elective III", code: "EE-4XX", type: "Elective", credits: 3 },
      { name: "Managerial Economics", code: "HS-401", type: "Theory", credits: 3 },
      { name: "Open Elective III", code: "OE-4XX", type: "Elective", credits: 3 },
      { name: "Project II", code: "EE-499", type: "Project", credits: 6 },
    ],
  },
];
