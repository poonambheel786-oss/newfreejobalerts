// src/lib/guide-data.ts

export interface GuideInfo {
  title: string;
  subtitle: string;
  overview: string;
  majorBoards: { name: string; fullForm: string; role: string }[];
  eligibilityHighlights: string[];
  selectionStages: string[];
  preparationTips: string[];
  faqs: { q: string; a: string }[];
}

export const categoryGuides: Record<string, GuideInfo> = {
  "bank-jobs": {
    title: "Public Sector & Commercial Bank Jobs in India",
    subtitle: "Complete Career Guide for Bank PO, Clerk, SO & Regional Rural Bank Recruitments",
    overview: "Banking is one of the most sought-after career avenues in India, offering competitive pay scales under the Bipartite Settlement, fast promotional hierarchies, and structured annual recruitment cycles. Recruitment in public sector banks (PSBs) is conducted primarily by the Institute of Banking Personnel Selection (IBPS) and State Bank of India (SBI), alongside regulatory bodies like RBI, NABARD, and SEBI.",
    majorBoards: [
      { name: "IBPS", fullForm: "Institute of Banking Personnel Selection", role: "Conducts common recruitment for 11 Public Sector Banks (PO, Clerk, Specialist Officer, RRB)." },
      { name: "SBI", fullForm: "State Bank of India", role: "Independently recruits Probationary Officers, Junior Associates (Clerk), and Specialist Officers." },
      { name: "RBI", fullForm: "Reserve Bank of India", role: "Recruits Grade B Officers and Assistants for national monetary and banking governance." },
      { name: "NABARD & SEBI", fullForm: "National Bank for Agriculture & Rural Development / SEBI", role: "Recruits Grade A & B Assistant Managers for rural and financial market regulation." }
    ],
    eligibilityHighlights: [
      "Clerk & PO: Bachelor's degree in any discipline from a recognized University.",
      "Specialist Officer (SO): Professional degree (B.Tech / MCA for IT, MBA/PGDM for Marketing/HR, Law Degree for Law Officer, CA/ICWA for Finance).",
      "Age Limit: 20–28 years for Clerks; 20–30 years for PO (Age relaxations: OBC +3 yrs, SC/ST +5 yrs, PwBD +10 yrs).",
      "Local Language Proficiency: Mandatory for clerical cadres in the applying state."
    ],
    selectionStages: [
      "Preliminary Exam: Objective screening test (Quantitative Aptitude, Reasoning Ability, English Language) with sectional timers.",
      "Mains Exam: Advanced objective test + Descriptive test (Letter & Essay typing for PO/Officers).",
      "Group Exercise & Interview: For PO/Officer cadres (No interviews for Clerical posts).",
      "Document Verification & Pre-employment Medical Check."
    ],
    preparationTips: [
      "Master Vedic Maths and shortcut calculation tricks to maximize speed in Quantitative Aptitude.",
      "Practice high-level Seating Arrangement and Floor/Box Puzzles daily under strict sectional countdowns.",
      "Read business and financial news daily from sources like The Economic Times or RBI Bulletins for the General & Financial Awareness paper.",
      "Attempt minimum 30 full-length mock tests before the exam date and analyze error patterns diligently."
    ],
    faqs: [
      {
        q: "Is there any negative marking in Banking Exams?",
        a: "Yes, 0.25 (1/4th) of the marks assigned to a question are deducted for every incorrect response across both Prelims and Mains."
      },
      {
        q: "What is the typical starting salary for a Bank PO?",
        a: "A newly recruited Bank PO in a Public Sector Bank receives a gross salary of approximately ₹65,000 to ₹75,000 per month including Basic Pay, DA, HRA, and Special Allowances."
      }
    ]
  },
  "railway-jobs": {
    title: "Indian Railways Recruitment & Career Guide",
    subtitle: "Guide to RRB NTPC, Group D (Level 1), ALP, Technicians & Junior Engineer Posts",
    overview: "Indian Railways is one of the largest employers in the world. Administered by the Railway Recruitment Control Board (RRCB) through 21 Railway Recruitment Boards (RRBs) and Railway Recruitment Cells (RRCs), railway jobs offer job security, railway passes, residential quarters, and medical facilities under the 7th Central Pay Commission.",
    majorBoards: [
      { name: "RRB", fullForm: "Railway Recruitment Boards (21 Zones)", role: "Recruits Non-Technical Popular Categories (NTPC), Assistant Loco Pilots (ALP), Technicians, and Junior Engineers." },
      { name: "RRC", fullForm: "Railway Recruitment Cells (16 Zones)", role: "Conducts recruitment for Level 1 (Group D - Track Maintainer, Pointsman, Helper) posts." }
    ],
    eligibilityHighlights: [
      "Level 1 (Group D): 10th Pass or ITI (NCVT/SCVT) or National Apprenticeship Certificate (NAC).",
      "ALP & Technicians: 10th Pass + ITI in relevant trade or Diploma/B.Tech in Engineering.",
      "NTPC Undergraduate Posts: 12th Pass (minimum 50% marks for general categories).",
      "NTPC Graduate Posts & JE: Bachelor's Degree / Diploma in Engineering.",
      "Age Limit: Typically 18 to 30/33/36 years with central reservation relaxations."
    ],
    selectionStages: [
      "Computer Based Test 1 (CBT-1): Screening examination testing Math, Reasoning, and General Science.",
      "Computer Based Test 2 (CBT-2): Advanced subject-specific / technical test.",
      "Computer Based Aptitude Test (CBAT) / Typing Skill Test: For Station Master, Traffic Assistant & Clerk posts.",
      "Physical Efficiency Test (PET): For Level 1 / Group D recruitments.",
      "Document Verification and Medical Fitness Examination."
    ],
    preparationTips: [
      "Focus heavily on NCERT Class 9th and 10th General Science (Physics, Chemistry, Biology) as it forms a major chunk of CBT-1.",
      "Practice previous 5 years' RRB question papers to understand repeating question themes and numerical difficulty levels.",
      "Ensure regular physical fitness training if applying for Level 1 or ALP posts requiring strict eyesight (A-1 medical standard) and running endurance."
    ],
    faqs: [
      {
        q: "What are the eyesight requirements for Railway ALP (Assistant Loco Pilot)?",
        a: "Candidates must have Distant Vision of 6/6, 6/6 without glasses (no fogging test) and must pass tests for Color Vision, Binocular Vision, Field of Vision, and Night Vision (Medical Standard A-1)."
      }
    ]
  },
  "teaching-jobs": {
    title: "Government Teaching Jobs & Eligibility Roadmap",
    subtitle: "Guide to PRT, TGT, PGT, CTET, KVS, NVS, DSSSB & State TET Examinations",
    overview: "Teaching in government schools, central educational institutions (KVS, NVS, EMRS), and state education departments is a highly respected career offering attractive UGC/7th CPC pay scales, school holidays, and public sector pensions/NPS.",
    majorBoards: [
      { name: "CBSE CTET", fullForm: "Central Teacher Eligibility Test", role: "National qualifying examination mandatory for teaching Class 1 to 8 in central schools." },
      { name: "KVS & NVS", fullForm: "Kendriya Vidyalaya Sangathan & Navodaya Vidyalaya Samiti", role: "Recruits Primary Teachers (PRT), Trained Graduate Teachers (TGT), and Post Graduate Teachers (PGT)." },
      { name: "DSSSB", fullForm: "Delhi Subordinate Services Selection Board", role: "Recruits teachers for Directorate of Education, Govt. of NCT of Delhi." },
      { name: "NTA UGC NET", fullForm: "National Testing Agency - University Grants Commission", role: "Qualifies candidates for Assistant Professorship and Junior Research Fellowship (JRF)." }
    ],
    eligibilityHighlights: [
      "Primary Teacher (PRT - Classes 1 to 5): 12th + D.El.Ed/B.El.Ed + CTET Paper 1 qualified.",
      "Trained Graduate Teacher (TGT - Classes 6 to 10): Bachelor's Degree in concerned subject + B.Ed + CTET Paper 2 qualified.",
      "Post Graduate Teacher (PGT - Classes 11 to 12): Master's Degree in concerned subject with minimum 50% marks + B.Ed.",
      "Assistant Professor: Master's Degree (55% marks) + UGC NET / CSIR NET qualified or Ph.D."
    ],
    selectionStages: [
      "Teacher Eligibility Test (TET / CTET): Mandatory qualifying benchmark.",
      "Written Competitive Examination: General awareness, pedagogical psychology, reasoning, language proficiency, and subject domain.",
      "Classroom Demonstration / Teaching Interview: Evaluation of pedagogy and communication skills.",
      "Document Verification."
    ],
    preparationTips: [
      "Deeply study Child Development & Pedagogy (CDP), focusing on theories of Piaget, Vygotsky, Kohlberg, and Bloom's Taxonomy.",
      "Thoroughly master NCERT textbooks from Class 6 to 12 for your specific teaching subject.",
      "Review the National Education Policy (NEP 2020) principles as modern exams frequently test pedagogical reforms."
    ],
    faqs: [
      {
        q: "Is CTET valid for lifetime?",
        a: "Yes, the National Council for Teacher Education (NCTE) has made the CTET qualifying certificate valid for a lifetime across all categories."
      }
    ]
  },
  "police-defence-jobs": {
    title: "Police, Para-Military & Armed Forces Career Guide",
    subtitle: "Guide to UPSC CDS/NDA, SSC GD, SSC CPO (Sub-Inspector), CAPF & State Police Forces",
    overview: "Careers in the Indian Armed Forces (Army, Navy, Air Force), Central Armed Police Forces (BSF, CRPF, CISF, ITBP, SSB), and State Police Departments offer pride, honor, uniform prestige, and comprehensive medical, canteen, and housing benefits.",
    majorBoards: [
      { name: "UPSC Defence", fullForm: "UPSC NDA & CDS Examinations", role: "Selects commissioned officers for the Indian Military Academy, Naval Academy, and Air Force Academy." },
      { name: "SSC CPO & GD", fullForm: "Staff Selection Commission Central Police Organisation & General Duty", role: "Recruits Sub-Inspectors in Delhi Police/CAPFs and Constables in Para-Military forces." },
      { name: "State Police Boards", fullForm: "State Police Recruitment Boards (e.g. UPPBPB, Rajasthan Police, Maharashtra Police)", role: "Recruits Constables, Head Constables, and Sub-Inspectors for state law and order." }
    ],
    eligibilityHighlights: [
      "Constable (GD): 10th Pass from recognized board (Age: 18–23 years).",
      "Sub-Inspector (SI): Bachelor's degree in any discipline (Age: 20–25 years).",
      "NDA (Officer): 12th Pass (Physics & Math for Air Force/Navy; Any stream for Army; Age: 16.5–19.5 years).",
      "CDS (Officer): Graduation (Age: 19–24 years)."
    ],
    selectionStages: [
      "Written Examination: Testing General Intelligence, General Knowledge, Elementary Mathematics, and English/Hindi.",
      "Physical Standard Test (PST): Height, chest measurement, and weight verification.",
      "Physical Efficiency Test (PET): Timed running (e.g., 5 km in 24 mins or 1.6 km in 6.5 mins), long jump, high jump.",
      "Detailed Medical Examination (DME) & SSB Interview (for Officers)."
    ],
    preparationTips: [
      "Begin physical endurance training 3-6 months prior to written results; build running stamina gradually.",
      "Practice push-ups and chest expansions daily to ensure meeting the mandatory 5 cm unexpanded-to-expanded chest rule.",
      "Keep standard photo ID proofs, category certificates, and domicile documents updated and valid."
    ],
    faqs: [
      {
        q: "What is the height requirement for male candidates in SSC GD?",
        a: "The standard height for male General/OBC/SC candidates is 170 cm, with relaxations down to 162.5 cm for ST candidates and hilly regions."
      }
    ]
  },
  "all-india-govt-jobs": {
    title: "All India Central Government Jobs Roadmap",
    subtitle: "Guide to UPSC Civil Services, SSC CGL, CHSL, MTS & Central Ministries",
    overview: "Central Government recruitments offer postings across ministries, executive departments, and public authorities under the central pay matrix. Candidates from any Indian state or union territory are eligible to apply under uniform central reservation norms.",
    majorBoards: [
      { name: "UPSC", fullForm: "Union Public Service Commission", role: "Conducts Civil Services (IAS/IPS/IFS), Engineering Services (IES), Combined Medical Services (CMS), and Central Armed Police Forces (CAPF AC)." },
      { name: "SSC", fullForm: "Staff Selection Commission", role: "Recruits thousands of Group B and C staff annually through CGL, CHSL, MTS, CPO, and Stenographer exams." },
      { name: "NTA", fullForm: "National Testing Agency", role: "Conducts centralized recruitment examinations for central universities and autonomous scientific councils." }
    ],
    eligibilityHighlights: [
      "MTS (Multi Tasking Staff): 10th Pass (Age: 18–25/27 years).",
      "CHSL (Combined Higher Secondary Level): 12th Pass (Age: 18–27 years).",
      "CGL (Combined Graduate Level): Bachelor's Degree in any discipline (Age: 18–30/32 years).",
      "UPSC Civil Services: Graduation in any stream (Age: 21–32 years with attempts policy)."
    ],
    selectionStages: [
      "Tier-I / Prelims: Objective screening test covering Quantitative Aptitude, English Comprehension, Reasoning, and General Awareness.",
      "Tier-II / Mains: Advanced objective / descriptive subject tests + Computer Proficiency Test (CPT) + Data Entry Speed Test (DEST).",
      "Document Verification & Final Merit List based on aggregate performance."
    ],
    preparationTips: [
      "Understand the updated SSC pattern which gives substantial weightage to General Awareness and Computer Knowledge in Tier-II.",
      "Solve at least 50 Previous Year Question (PYQ) sets from TCS-conducted shifts to familiarize with recurring question patterns.",
      "Practice English comprehension and grammar rules (active/passive voice, direct/indirect speech, cloze tests) systematically."
    ],
    faqs: [
      {
        q: "What is the in-hand salary for an SSC CGL 4600 Grade Pay post?",
        a: "For Level 7 (4600 GP - e.g. ASO, Inspector of Income Tax, GST Inspector), the starting gross salary in Tier X cities (like Delhi, Mumbai) is approximately ₹75,000 to ₹82,000 per month."
      }
    ]
  },
  "state-govt-jobs": {
    title: "State Government Recruitment Portals & Guidelines",
    subtitle: "Guide to State Public Service Commissions, Subordinate Boards & Local Cadres",
    overview: "State government jobs provide employment opportunities within your home state, ensuring cultural familiarity, state service seniority, and regional administrative impact.",
    majorBoards: [
      { name: "State PSCs", fullForm: "State Public Service Commissions (e.g. UPPSC, BPSC, RPSC, MPSC, TNPSC)", role: "Recruits State Administrative Officers (SDM, DSP, BDO, Tehsildar) and Assistant Engineers." },
      { name: "Subordinate Boards", fullForm: "State Subordinate Services Selection Boards (e.g. UPSSSC, RSMSSB, HSSC, UKSSSC)", role: "Recruits Junior Assistants, Patwaris, VDOs, Clerks, and Forest Guards." }
    ],
    eligibilityHighlights: [
      "Domicile Benefits: Reserved category candidates must possess valid state domicile certificates to claim quota benefits.",
      "State Language Test: Many states mandate passing a qualifying regional language paper (e.g., Marathi in MPSC, Tamil in TNPSC, Punjabi in PPSC, Hindi in UP/Rajasthan).",
      "Educational qualifications range from 10th/12th for clerical/field posts to Graduation for administrative officer cadres."
    ],
    selectionStages: [
      "State Preliminary Screening Test.",
      "State Mains Examination (including State History, Geography, Economy, and Culture papers).",
      "Interview / Personality Test for Gazetted positions.",
      "Regional Language Verification & Document Verification."
    ],
    preparationTips: [
      "Dedicate at least 40% of your study time to State General Knowledge (History, Geography, Heritage, Government Schemes, and Economic Survey of the State).",
      "Read regional daily newspapers to stay updated on state cabinet decisions, budget announcements, and local current events."
    ],
    faqs: [
      {
        q: "Can other state candidates apply for State Govt Jobs?",
        a: "Yes, candidates from other states can apply for open/general (unreserved) category vacancies in most state exams, provided they meet the local language criteria."
      }
    ]
  },
  "nursing-jobs": {
    title: "Government Nursing & Healthcare Recruitment Guide",
    subtitle: "Guide to AIIMS NORCET, ESIC Nursing Officer, State Health Missions (NHM) & Staff Nurse Vacancies",
    overview: "Government healthcare sector recruitments offer noble service opportunities with high compensation under the 7th CPC Level 7 (Basic ₹44,900) for Nursing Officers in premier central hospitals like AIIMS, ESIC, JIPMER, and Central Government Health Schemes (CGHS).",
    majorBoards: [
      { name: "AIIMS NORCET", fullForm: "Nursing Officer Recruitment Common Eligibility Test", role: "Centralized national examination for Nursing Officers across all AIIMS institutes in India." },
      { name: "ESIC & RRB Health", fullForm: "Employees' State Insurance Corporation & Railway Hospitals", role: "Recruits Nursing Officers, Pharmacists, and Lab Technicians." },
      { name: "NHM", fullForm: "National Health Mission (State Level)", role: "Recruits Community Health Officers (CHOs), ANMs, and Staff Nurses on regular/contractual basis." }
    ],
    eligibilityHighlights: [
      "B.Sc. (Hons.) Nursing / B.Sc. Nursing from an Indian Nursing Council recognized Institute OR",
      "Diploma in General Nursing Midwifery (GNM) with minimum 2 years' clinical experience in a 50+ bedded hospital.",
      "Mandatory registration as Nurse & Midwife with State / Indian Nursing Council.",
      "Age Limit: 18 to 30/35 years with permissible relaxations."
    ],
    selectionStages: [
      "Stage 1: Preliminary Examination (Nursing subject basics + General Awareness & Aptitude).",
      "Stage 2: Mains Examination (Clinical scenario-based nursing skills and practical patient management questions).",
      "Document Verification and Nursing Registration Cross-Check."
    ],
    preparationTips: [
      "Focus deeply on Medical-Surgical Nursing, Pharmacology, Obstetrics & Gynaecology (OBG), and Paediatric Nursing.",
      "Practice image-based questions and clinical protocol decision trees as NORCET heavily tests real-world nursing competencies.",
      "Review basic drug calculations, emergency resuscitation protocols, and infection control procedures."
    ],
    faqs: [
      {
        q: "What is the pay scale of an AIIMS Nursing Officer?",
        a: "AIIMS Nursing Officers are appointed at Pay Level 7 of the 7th CPC Matrix (Basic Pay ₹44,900), resulting in a starting gross salary of ₹75,000 to ₹85,000 per month."
      }
    ]
  },
  "engineering-jobs": {
    title: "Engineering Govt Jobs & PSU Recruitment Guide",
    subtitle: "Guide to GATE PSU Recruitment, SSC JE, IES / ESE, State AE/JE & DRDO/ISRO Scientist Positions",
    overview: "Engineering graduates and diploma holders can access high-paying Maharatna/Navratna PSU jobs (ONGC, IOCL, NTPC, BHEL), central engineering cadres (CPWD, MES, CWC via SSC JE & IES), and scientific research organizations (ISRO, DRDO, BARC).",
    majorBoards: [
      { name: "PSU Recruitment via GATE", fullForm: "Public Sector Undertakings (ONGC, IOCL, NTPC, HPCL, PGCIL)", role: "Recruits Graduate Engineer Trainees (GET) and Executive Trainees based on GATE scores." },
      { name: "SSC JE", fullForm: "Staff Selection Commission Junior Engineer", role: "Recruits Civil, Electrical, and Mechanical Junior Engineers for central infrastructure departments." },
      { name: "UPSC ESE / IES", fullForm: "Engineering Services Examination", role: "Selects Class-1 Gazetted Officers in Indian Railway Service of Engineers, Central Power Engineering Service, and Indian Defence Service of Engineers." }
    ],
    eligibilityHighlights: [
      "Junior Engineer (JE): Diploma or B.Tech/B.E. in Civil / Electrical / Mechanical Engineering.",
      "Assistant Engineer (AE) & PSU Executive: 4-Year B.Tech/B.E. Degree with minimum 60% aggregate (55% for SC/ST).",
      "Scientist/Engineer 'SC': B.Tech First Class (65%+ aggregate) in relevant engineering discipline."
    ],
    selectionStages: [
      "Written Technical Exam / GATE Score Shortlisting.",
      "Technical & HR Personal Interview (plus Group Discussions in PSUs).",
      "Medical Fitness Evaluation."
    ],
    preparationTips: [
      "Focus intensely on core technical fundamentals (Strength of Materials, Thermodynamics, Circuit Theory, RCC Design, Data Structures).",
      "Practice standard numerical questions and solve previous 10 years of GATE & IES question papers.",
      "Maintain a strong grasp on recent technological advancements in your domain for technical interviews."
    ],
    faqs: [
      {
        q: "What is the average CTC offered by Maharatna PSUs via GATE?",
        a: "Maharatna PSUs like ONGC, IOCL, and NTPC offer annual starting CTC packages ranging from ₹14 Lakhs to ₹22 Lakhs per annum."
      }
    ]
  },
  "agriculture-jobs": {
    title: "Agriculture & Allied Sector Government Jobs",
    subtitle: "Guide to IBPS AFO, State Agriculture Officers, FCI, IFFCO & ICAR Scientist Recruitments",
    overview: "With India's growing focus on agrarian modernization, government recruitments for B.Sc./M.Sc. Agriculture graduates across public sector banks (IBPS Agriculture Field Officer), Food Corporation of India (FCI), and State Krishi Vibhags offer high career stability.",
    majorBoards: [
      { name: "IBPS AFO", fullForm: "IBPS Specialist Officer (Agriculture Field Officer)", role: "Recruits agricultural finance specialists across 11 nationalized banks." },
      { name: "FCI", fullForm: "Food Corporation of India", role: "Recruits Assistant General Managers, Technical Managers, and Quality Control Officers." },
      { name: "ICAR & ASRB", fullForm: "Agricultural Scientists Recruitment Board", role: "Selects Agricultural Research Scientists (ARS) and Subject Matter Specialists." }
    ],
    eligibilityHighlights: [
      "4-year Degree in Agriculture / Horticulture / Animal Husbandry / Veterinary Science / Dairy Science / Forestry.",
      "Age Limit: 20 to 30 years for IBPS AFO; 18 to 35/40 years for State Agriculture Officer exams."
    ],
    selectionStages: [
      "Preliminary Qualifying Test (Aptitude, Reasoning, English).",
      "Professional Knowledge Mains Test (Agronomy, Soil Science, Horticulture, Plant Pathology, Entomology, Agricultural Economics).",
      "Personal Interview & Document Verification."
    ],
    preparationTips: [
      "Master standard agronomic principles, crop pest management, soil nutrient ratings, and NABARD priority sector lending norms.",
      "Study current government schemes such as PM-KISAN, PM Fasal Bima Yojana, and Soil Health Card guidelines."
    ],
    faqs: [
      {
        q: "Is 4-year B.Sc. Agriculture mandatory for IBPS AFO?",
        a: "Yes, IBPS requires a 4-year professional graduation degree in Agriculture or recognized allied sciences."
      }
    ]
  },
  "college-entrance-exams": {
    title: "National & State College Entrance Exams Guide",
    subtitle: "Information Hub for CUET, JEE, NEET, GATE, CAT & State Entrance Tests",
    overview: "Entrance examinations are the critical stepping stones for admission into India's premier public and autonomous educational institutions, including IITs, NITs, AIIMS, IIMs, and Central Universities.",
    majorBoards: [
      { name: "NTA", fullForm: "National Testing Agency", role: "Conducts CUET (UG & PG), JEE Main, NEET-UG, and UGC NET." },
      { name: "IITs / IISc", fullForm: "Indian Institutes of Technology & IISc Bangalore", role: "Conducts JEE Advanced, GATE, and JAM entrance examinations." },
      { name: "IIMs", fullForm: "Indian Institutes of Management", role: "Conducts Common Admission Test (CAT) for premier management admissions." }
    ],
    eligibilityHighlights: [
      "CUET UG / JEE / NEET: 12th Pass or appearing in final year with required stream subjects.",
      "CUET PG / CAT / GATE: Bachelor's degree in relevant discipline or appearing in final semester."
    ],
    selectionStages: [
      "National Computer Based Examination (CBT).",
      "Scorecard declaration & All India Rank (AIR) generation.",
      "Centralized Counselling (JoSAA, MCC, CSAS, CAP) and seat allotment."
    ],
    preparationTips: [
      "Align preparation strictly with the official NTA/Conducting institute syllabus.",
      "Practice mock tests in simulated CBT interface environments to overcome exam-day anxiety and manage sectional timings."
    ],
    faqs: [
      {
        q: "What is the marking scheme in CUET UG?",
        a: "In CUET UG, candidates receive +5 marks for every correct answer and -1 mark for every incorrect answer."
      }
    ]
  }
};

export const stateGuides: Record<string, GuideInfo> = {
  "rajasthan": {
    title: "Rajasthan Government Jobs & Recruitment Portal",
    subtitle: "Guide to RPSC, RSMSSB, Rajasthan Police, High Court & REET Examinations",
    overview: "Rajasthan government recruitments offer numerous vacancies annually across administrative, educational, police, and clerical cadres. Major recruitment bodies include the Rajasthan Public Service Commission (RPSC) in Ajmer and Rajasthan Staff Selection Board (RSMSSB) in Jaipur.",
    majorBoards: [
      { name: "RPSC", fullForm: "Rajasthan Public Service Commission", role: "Recruits RAS/RTS officers, School Lecturers (1st Grade), Senior Teachers (2nd Grade), Assistant Professors, and Junior Legal Officers (JLO)." },
      { name: "RSMSSB", fullForm: "Rajasthan Staff Selection Board", role: "Recruits CET (Common Eligibility Test), Patwari, VDO, LDC/Junior Assistant, Forest Guard, and Informatic Assistants (IA)." },
      { name: "Rajasthan Police", fullForm: "Rajasthan Police Recruitment Board", role: "Recruits Police Constables and Sub-Inspectors." },
      { name: "HCRAJ", fullForm: "Rajasthan High Court Jodhpur", role: "Recruits Civil Judges, LDC, System Assistants, and Stenographers." }
    ],
    eligibilityHighlights: [
      "CET (Common Eligibility Test): Mandatory qualification for most RSMSSB Group C posts (both Graduate and 12th Senior Secondary levels).",
      "Rajasthan Domicile: Candidates with Bonafide Resident Certificate are eligible for state category reservations.",
      "General Knowledge: Strong emphasis on Rajasthan Art, Culture, History, Geography, Economy, and Schemology."
    ],
    selectionStages: [
      "Preliminary Screening / CET Score Cut-off shortlisting.",
      "Main Written Examination.",
      "Typing & Efficiency Test (for LDC/Stenographer posts) or Physical Efficiency Test (for Police/Forest posts).",
      "Document Verification and Final Merit List."
    ],
    preparationTips: [
      "Read standard references like Rajasthan Adhyayan (Classes 9 to 12) to build a solid foundation in state history and cultural heritage.",
      "Track the Rajasthan Sujas magazine monthly for updates on state government welfare schemes and budget allocations."
    ],
    faqs: [
      {
        q: "Is Rajasthan CET mandatory for all state government exams?",
        a: "RSMSSB has made CET mandatory for specific non-gazetted posts like Patwari, Junior Accountant, VDO, and LDC. RPSC exams and technical posts are exempted from CET."
      }
    ]
  },
  "uttar-pradesh": {
    title: "Uttar Pradesh Government Jobs & Recruitment Guide",
    subtitle: "Guide to UPPSC, UPSSSC (PET), UPPBPB (Police), and UP Super TET",
    overview: "Uttar Pradesh is one of India's largest employment providers in the public sector. Recruitments are carried out by UPPSC in Prayagraj for provincial civil services, UPSSSC in Lucknow for subordinate services via the Preliminary Eligibility Test (PET), and UPPBPB for state police forces.",
    majorBoards: [
      { name: "UPPSC", fullForm: "Uttar Pradesh Public Service Commission", role: "Conducts UP Combined State/Upper Subordinate Exam (PCS), RO/ARO (Review Officer), and Staff Nurse examinations." },
      { name: "UPSSSC", fullForm: "Uttar Pradesh Subordinate Services Selection Commission", role: "Conducts UP PET, Lekhpal, VDO (Gram Vikas Adhikari), Junior Assistant, and ANM recruitments." },
      { name: "UPPBPB", fullForm: "Uttar Pradesh Police Recruitment and Promotion Board", role: "Recruits UP Police Constables, Sub-Inspectors, and Firemen." }
    ],
    eligibilityHighlights: [
      "UPSSSC PET: Mandatory annual screening score card required to apply for all UPSSSC Group C main examinations.",
      "Age Relaxations: UP domicile SC/ST/OBC candidates receive up to 5 years age relaxation.",
      "Language: Proficient knowledge of Hindi in Devanagari script is mandatory."
    ],
    selectionStages: [
      "UP PET / UPPSC Prelims screening.",
      "Main Descriptive / Objective Examination.",
      "Document Verification and Medical Check."
    ],
    preparationTips: [
      "Dedicate focused study to UP Special GK (History, Geography, Demographics, Folk Culture, and Industrial corridors like Defense Corridor and Expressways).",
      "Prepare general Hindi grammar thoroughly (Sandhi, Samas, Muhavare, Tatsam/Tadbhav) as it holds high marks weightage across UP exams."
    ],
    faqs: [
      {
        q: "What is the validity of UPSSSC PET Scorecard?",
        a: "The UPSSSC PET scorecard is valid for 1 year from the date of result declaration."
      }
    ]
  },
  "bihar": {
    title: "Bihar Government Jobs & Recruitment Guide",
    subtitle: "Guide to BPSC, BSSC, BPSSC (Bihar Police SI), and CSBC Constables",
    overview: "Bihar offers vast public sector vacancies through the Bihar Public Service Commission (BPSC), Bihar Staff Selection Commission (BSSC), Bihar Police Subordinate Services Commission (BPSSC), and Central Selection Board of Constable (CSBC).",
    majorBoards: [
      { name: "BPSC", fullForm: "Bihar Public Service Commission", role: "Conducts Integrated Combined Competitive Exam (CCE), BPSC School Teacher (TRE), and Assistant Engineer exams." },
      { name: "BSSC", fullForm: "Bihar Staff Selection Commission", role: "Conducts CGL (Graduate Level) and Inter Level recruitments for Revenue Employees, Panchayat Sachiv, and Clerks." },
      { name: "BPSSC & CSBC", fullForm: "Bihar Police Recruitment Boards", role: "Recruits Bihar Police Daroga (SI) and Constables." }
    ],
    eligibilityHighlights: [
      "Educational qualification ranges from 10th/12th for Constables/Inter level to Graduation for BPSC Civil Services.",
      "Reservation benefits apply exclusively to permanent residents of Bihar carrying valid residential and caste certificates."
    ],
    selectionStages: [
      "Preliminary Examination.",
      "Main Examination.",
      "Physical Efficiency Test (for Police/Excise cadres) or Interview (for BPSC Officer posts).",
      "Document Verification."
    ],
    preparationTips: [
      "Deeply study Bihar History (ancient Magadha, Mauryan Empire, Buddhism, freedom struggle in Champaran) and Bihar Economic Survey data.",
      "Master General Science and Current Affairs as they form over 45% of questions in BPSC Prelims."
    ],
    faqs: [
      {
        q: "Is negative marking applicable in BPSC CCE Prelims?",
        a: "Yes, BPSC applies negative marking of 1/3rd (0.33) marks for every incorrect answer."
      }
    ]
  },
  "delhi-nct": {
    title: "Delhi NCT Government Jobs & DSSSB Guide",
    subtitle: "Guide to DSSSB, Delhi Police, DDA, and Municipal Corporation Vacancies",
    overview: "Delhi offers highly coveted public sector jobs in national capital administration, central departments, and municipal corporations, featuring 7th CPC central pay scales and metro city perks.",
    majorBoards: [
      { name: "DSSSB", fullForm: "Delhi Subordinate Services Selection Board", role: "Recruits Teachers (PRT, TGT, PGT), Special Educators, Junior Assistants (DASGrade IV), Patwari, and Nursing Staff for GNCTD." },
      { name: "DDA", fullForm: "Delhi Development Authority", role: "Recruits Assistant Accounts Officers, Sectional Officers (Horticulture), Patwaris, and Surveyors." },
      { name: "Delhi Police", fullForm: "Delhi Police (Recruited via SSC)", role: "Recruits Constables, Head Constables (AWO/TPO, Ministerial), and Sub-Inspectors." }
    ],
    eligibilityHighlights: [
      "OBC Certificate Criteria: For DSSSB, only OBC certificates issued by Govt. of NCT of Delhi are recognized for reservation; outsider OBC candidates are considered General.",
      "SC/ST candidates from any state in India are eligible for reservation benefits under central norms."
    ],
    selectionStages: [
      "Tier-I General Examination (General Awareness, Reasoning, Arithmetical Ability, Hindi & English).",
      "Tier-II Technical / Skill Test (Typing speed 35 wpm in English / 30 wpm in Hindi).",
      "Document Verification."
    ],
    preparationTips: [
      "Focus on equal preparation across all 5 sections of Tier-I as DSSSB does not allow jumping between sections until a section is submitted.",
      "Practice mock tests on online exam portals with strict 200 questions in 120 minutes time management."
    ],
    faqs: [
      {
        q: "What is the typing speed required for DSSSB Junior Assistant?",
        a: "Candidates must achieve a minimum speed of 35 words per minute in English or 30 words per minute in Hindi on computer."
      }
    ]
  }
};

// Generic fallback generator for all other states to guarantee 100% comprehensive coverage without thin pages
export function getStateGuide(stateName: string, stateSlug: string): GuideInfo {
  if (stateGuides[stateSlug]) {
    return stateGuides[stateSlug];
  }

  const cleanName = stateName.replace(/-/g, " ");
  return {
    title: `${cleanName} Government Jobs & Recruitment Portal`,
    subtitle: `Complete Overview of State Public Service Commission & Subordinate Services in ${cleanName}`,
    overview: `${cleanName} public sector employment notifications offer competitive pay under state/central pay commissions, career growth opportunities, and job security across state administrative departments, police departments, health missions, and educational institutions.`,
    majorBoards: [
      { name: "State PSC", fullForm: `${cleanName} Public Service Commission`, role: `Recruits Class-1 and Class-2 State Administrative Officers, Lecturers, and Technical Engineers in ${cleanName}.` },
      { name: "State Selection Board", fullForm: `${cleanName} Subordinate Services Selection Board`, role: `Conducts centralized recruitments for Group C and D posts, Clerks, Patwaris, and Field Staff.` },
      { name: "State Police Board", fullForm: `${cleanName} Police Recruitment Board`, role: `Recruits Police Constables, Head Constables, and Sub-Inspectors across districts.` }
    ],
    eligibilityHighlights: [
      `Candidates holding Bonafide/Domicile certificates of ${cleanName} are eligible to claim state category reservation benefits.`,
      `Knowledge of regional language and state culture is required for clerical and administrative roles.`,
      `Educational criteria range from 10th/12th for field cadres to Bachelor's/Master's degrees for officer positions.`
    ],
    selectionStages: [
      "Preliminary Written / Screening Examination.",
      "Main Examination / Practical Technical Test.",
      "Physical Efficiency Test (for Uniformed Services) or Typing Test (for Clerical roles).",
      "Document Verification and Medical Check."
    ],
    preparationTips: [
      `Study ${cleanName} State GK (History, Geography, Economy, Demographics, and District profiles).`,
      "Practice previous 5 years' question papers from state commission examinations to identify frequently tested concepts.",
      "Track daily regional news and government gazette circulars for updates on reservation norms and exam dates."
    ],
    faqs: [
      {
        q: `How can candidates from other states apply for ${cleanName} Govt Jobs?`,
        a: `Candidates from other Indian states can apply under the Unreserved / General Category for open vacancies in ${cleanName}, subject to meeting the required educational and regional language qualifications.`
      }
    ]
  };
}

export function getCategoryGuide(categorySlug: string, categoryName: string): GuideInfo {
  if (categoryGuides[categorySlug]) {
    return categoryGuides[categorySlug];
  }

  const cleanName = categoryName.replace(/-/g, " ");
  return {
    title: `${cleanName} - Government Recruitment & Career Guide`,
    subtitle: `Eligibility, Exam Patterns, Pay Scales & Preparation Roadmap for ${cleanName}`,
    overview: `Explore comprehensive notifications, vacancy distributions, eligibility criteria, and exam updates for ${cleanName} across central ministries, state departments, and public sector organizations.`,
    majorBoards: [
      { name: "Central Recruitment Commissions", fullForm: "UPSC, SSC, NTA & National Boards", role: "Conducts national-level entrance and competitive selection tests." },
      { name: "State Recruitment Boards", fullForm: "State PSCs & Subordinate Boards", role: "Recruits state-level administrative, technical, and executive personnel." }
    ],
    eligibilityHighlights: [
      "Educational qualification verified against official gazette notification.",
      "Standard age relaxations applicable for reserved categories (OBC, SC, ST, PwBD, Ex-Servicemen).",
      "Computer literacy and subject domain certification where prescribed."
    ],
    selectionStages: [
      "Written / Computer Based Screening Test.",
      "Skill Test / Interview / Physical Test (as per post rules).",
      "Document Verification & Final Merit List."
    ],
    preparationTips: [
      "Review the detailed syllabus and weightage for your target exam.",
      "Practice mock tests in time-bound conditions and analyze weak areas systematically.",
      "Refer exclusively to official department portals for authentic notification updates."
    ],
    faqs: [
      {
        q: `How frequently are ${cleanName} notifications updated on NewFreeJobAlert?`,
        a: `Our editorial team tracks official gazettes, employment news, and department websites daily to publish verified updates within minutes of release.`
      }
    ]
  };
}
