/* ==========================================================================
   UniCalc - Universities Grading System Database
   ========================================================================== */

window.UNIVERSITIES = {
  general_10: {
    name: "General 10-Point Scale",
    desc: "Standard choice-based credit grading system used by many universities globally.",
    maxGpa: 10,
    formulaText: "Percentage = CGPA × 9.5",
    convertToPct: (cgpa) => cgpa * 9.5,
    convertToGpa: (pct) => pct / 9.5,
    getGradeFromMarks: (marks) => {
      if (marks >= 90) return { letter: "O", points: 10 };
      if (marks >= 80) return { letter: "A+", points: 9 };
      if (marks >= 70) return { letter: "A", points: 8 };
      if (marks >= 60) return { letter: "B+", points: 7 };
      if (marks >= 50) return { letter: "B", points: 6 };
      if (marks >= 45) return { letter: "C", points: 5 };
      if (marks >= 40) return { letter: "D", points: 4 };
      return { letter: "F", points: 0 };
    },
    grades: [
      { letter: "O", points: 10, desc: "Outstanding (>=90%)" },
      { letter: "A+", points: 9, desc: "Excellent (80-89%)" },
      { letter: "A", points: 8, desc: "Very Good (70-79%)" },
      { letter: "B+", points: 7, desc: "Good (60-69%)" },
      { letter: "B", points: 6, desc: "Above Average (50-59%)" },
      { letter: "C", points: 5, desc: "Average (45-49%)" },
      { letter: "D", points: 4, desc: "Pass (40-44%)" },
      { letter: "F", points: 0, desc: "Fail (<40%)" }
    ]
  },
  lpu: {
    name: "Lovely Professional University (LPU)",
    desc: "Uses a relative grading pattern where grade boundaries are computed based on class performance.",
    maxGpa: 10,
    formulaText: "Percentage = CGPA × 10",
    convertToPct: (cgpa) => cgpa * 10,
    convertToGpa: (pct) => pct / 10,
    getGradeFromMarks: (marks) => {
      if (marks >= 90) return { letter: "O", points: 10 };
      if (marks >= 80) return { letter: "A+", points: 9 };
      if (marks >= 70) return { letter: "A", points: 8 };
      if (marks >= 60) return { letter: "B+", points: 7 };
      if (marks >= 50) return { letter: "B", points: 6 };
      if (marks >= 45) return { letter: "C", points: 5 };
      if (marks >= 40) return { letter: "D", points: 4 };
      if (marks >= 30) return { letter: "E", points: 0 };
      return { letter: "F", points: 0 };
    },
    grades: [
      { letter: "O", points: 10, desc: "Outstanding (>=90%)" },
      { letter: "A+", points: 9, desc: "Excellent (80-89%)" },
      { letter: "A", points: 8, desc: "Very Good (70-79%)" },
      { letter: "B+", points: 7, desc: "Good (60-69%)" },
      { letter: "B", points: 6, desc: "Above Average (50-59%)" },
      { letter: "C", points: 5, desc: "Average (45-49%)" },
      { letter: "D", points: 4, desc: "Marginal (40-44%)" },
      { letter: "E", points: 0, desc: "Reappear (30-39%)" },
      { letter: "F", points: 0, desc: "Fail (<30%)" }
    ]
  },
  cu: {
    name: "Chandigarh University (CU)",
    desc: "Employs relative grading for regular programs and converts CGPA to percentage using standard 9.5 factor.",
    maxGpa: 10,
    formulaText: "Percentage = CGPA × 9.5",
    convertToPct: (cgpa) => cgpa * 9.5,
    convertToGpa: (pct) => pct / 9.5,
    getGradeFromMarks: (marks) => {
      if (marks >= 90) return { letter: "A+", points: 10 };
      if (marks >= 80) return { letter: "A", points: 9 };
      if (marks >= 70) return { letter: "B+", points: 8 };
      if (marks >= 60) return { letter: "B", points: 7 };
      if (marks >= 55) return { letter: "C+", points: 6 };
      if (marks >= 50) return { letter: "C", points: 5 };
      if (marks >= 40) return { letter: "D", points: 4 };
      return { letter: "F", points: 0 };
    },
    grades: [
      { letter: "A+", points: 10, desc: "Outstanding (>=90%)" },
      { letter: "A", points: 9, desc: "Excellent (80-89%)" },
      { letter: "B+", points: 8, desc: "Very Good (70-79%)" },
      { letter: "B", points: 7, desc: "Good (60-69%)" },
      { letter: "C+", points: 6, desc: "Above Average (55-59%)" },
      { letter: "C", points: 5, desc: "Average (50-54%)" },
      { letter: "D", points: 4, desc: "Marginal / Pass (40-49%)" },
      { letter: "F", points: 0, desc: "Fail (<40%)" }
    ]
  },
  aktu: {
    name: "Dr. A.P.J. Abdul Kalam Technical University (AKTU)",
    desc: "Standard Choice Based Credit System (CBCS) grading scale with AKTU's official linear percentage formula.",
    maxGpa: 10,
    formulaText: "Percentage = (CGPA × 10) - 7.5",
    convertToPct: (cgpa) => Math.max(0, (cgpa * 10) - 7.5),
    convertToGpa: (pct) => (pct + 7.5) / 10,
    getGradeFromMarks: (marks) => {
      if (marks >= 90) return { letter: "O", points: 10 };
      if (marks >= 80) return { letter: "A+", points: 9 };
      if (marks >= 70) return { letter: "A", points: 8 };
      if (marks >= 60) return { letter: "B+", points: 7 };
      if (marks >= 50) return { letter: "B", points: 6 };
      if (marks >= 45) return { letter: "C", points: 5 };
      if (marks >= 40) return { letter: "P", points: 4 };
      return { letter: "F", points: 0 };
    },
    grades: [
      { letter: "O", points: 10, desc: "Outstanding (>=90%)" },
      { letter: "A+", points: 9, desc: "Excellent (80-89%)" },
      { letter: "A", points: 8, desc: "Very Good (70-79%)" },
      { letter: "B+", points: 7, desc: "Good (60-69%)" },
      { letter: "B", points: 6, desc: "Above Average (50-59%)" },
      { letter: "C", points: 5, desc: "Average (45-49%)" },
      { letter: "P", points: 4, desc: "Pass (40-44%)" },
      { letter: "F", points: 0, desc: "Fail (<40%)" }
    ]
  },
  du: {
    name: "Delhi University (DU)",
    desc: "Uses a UGC-aligned 10-point scale for undergraduate and postgraduate courses under CBCS guidelines.",
    maxGpa: 10,
    formulaText: "Percentage = CGPA × 9.5",
    convertToPct: (cgpa) => cgpa * 9.5,
    convertToGpa: (pct) => pct / 9.5,
    getGradeFromMarks: (marks) => {
      if (marks >= 90) return { letter: "O", points: 10 };
      if (marks >= 80) return { letter: "A+", points: 9 };
      if (marks >= 70) return { letter: "A", points: 8 };
      if (marks >= 60) return { letter: "B+", points: 7 };
      if (marks >= 50) return { letter: "B", points: 6 };
      if (marks >= 45) return { letter: "C", points: 5 };
      if (marks >= 40) return { letter: "D", points: 4 };
      return { letter: "F", points: 0 };
    },
    grades: [
      { letter: "O", points: 10, desc: "Outstanding (>=90%)" },
      { letter: "A+", points: 9, desc: "Excellent (80-89%)" },
      { letter: "A", points: 8, desc: "Very Good (70-79%)" },
      { letter: "B+", points: 7, desc: "Good (60-69%)" },
      { letter: "B", points: 6, desc: "Above Average (50-59%)" },
      { letter: "C", points: 5, desc: "Average (45-49%)" },
      { letter: "D", points: 4, desc: "Pass (40-44%)" },
      { letter: "F", points: 0, desc: "Fail (<40%)" }
    ]
  },
  mu: {
    name: "Mumbai University (MU)",
    desc: "Uses the general 10-point grading system. Converts CGPI to percentage using official 2018 circular formula.",
    maxGpa: 10,
    formulaText: "Percentage = 7.25 × CGPA + 11",
    convertToPct: (cgpa) => cgpa > 0 ? (7.25 * cgpa) + 11 : 0,
    convertToGpa: (pct) => pct > 0 ? (pct - 11) / 7.25 : 0,
    getGradeFromMarks: (marks) => {
      if (marks >= 80) return { letter: "O", points: 10 };
      if (marks >= 70) return { letter: "A+", points: 9 };
      if (marks >= 60) return { letter: "A", points: 8 };
      if (marks >= 55) return { letter: "B+", points: 7 };
      if (marks >= 50) return { letter: "B", points: 6 };
      if (marks >= 45) return { letter: "C", points: 5 };
      if (marks >= 40) return { letter: "D", points: 4 };
      return { letter: "F", points: 0 };
    },
    grades: [
      { letter: "O", points: 10, desc: "Outstanding (>=80%)" },
      { letter: "A+", points: 9, desc: "Excellent (70-79%)" },
      { letter: "A", points: 8, desc: "Very Good (60-69%)" },
      { letter: "B+", points: 7, desc: "Good (55-59%)" },
      { letter: "B", points: 6, desc: "Above Average (50-54%)" },
      { letter: "C", points: 5, desc: "Average (45-49%)" },
      { letter: "D", points: 4, desc: "Pass (40-44%)" },
      { letter: "F", points: 0, desc: "Fail (<40%)" }
    ]
  },
  vtu: {
    name: "Visvesvaraya Technological University (VTU)",
    desc: "Standard 10-point credit system for engineering colleges across Karnataka, subtracting 0.75 for percentage.",
    maxGpa: 10,
    formulaText: "Percentage = (CGPA - 0.75) × 10",
    convertToPct: (cgpa) => Math.max(0, (cgpa - 0.75) * 10),
    convertToGpa: (pct) => (pct / 10) + 0.75,
    getGradeFromMarks: (marks) => {
      if (marks >= 90) return { letter: "O", points: 10 };
      if (marks >= 80) return { letter: "A+", points: 9 };
      if (marks >= 70) return { letter: "A", points: 8 };
      if (marks >= 60) return { letter: "B+", points: 7 };
      if (marks >= 50) return { letter: "B", points: 6 };
      if (marks >= 45) return { letter: "C", points: 5 };
      if (marks >= 40) return { letter: "P", points: 4 };
      return { letter: "F", points: 0 };
    },
    grades: [
      { letter: "O", points: 10, desc: "Outstanding (>=90%)" },
      { letter: "A+", points: 9, desc: "Excellent (80-89%)" },
      { letter: "A", points: 8, desc: "Very Good (70-79%)" },
      { letter: "B+", points: 7, desc: "Good (60-69%)" },
      { letter: "B", points: 6, desc: "Above Average (50-59%)" },
      { letter: "C", points: 5, desc: "Average (45-49%)" },
      { letter: "P", points: 4, desc: "Pass (40-44%)" },
      { letter: "F", points: 0, desc: "Fail (<40%)" }
    ]
  },
  anna: {
    name: "Anna University",
    desc: "10-point grading system used by affiliated engineering colleges in Tamil Nadu.",
    maxGpa: 10,
    formulaText: "Percentage = CGPA × 10",
    convertToPct: (cgpa) => cgpa * 10,
    convertToGpa: (pct) => pct / 10,
    getGradeFromMarks: (marks) => {
      if (marks >= 91) return { letter: "O", points: 10 };
      if (marks >= 81) return { letter: "A+", points: 9 };
      if (marks >= 71) return { letter: "A", points: 8 };
      if (marks >= 61) return { letter: "B+", points: 7 };
      if (marks >= 50) return { letter: "B", points: 6 };
      return { letter: "U", points: 0 };
    },
    grades: [
      { letter: "O", points: 10, desc: "Outstanding (91-100%)" },
      { letter: "A+", points: 9, desc: "Excellent (81-90%)" },
      { letter: "A", points: 8, desc: "Very Good (71-80%)" },
      { letter: "B+", points: 7, desc: "Good (61-70%)" },
      { letter: "B", points: 6, desc: "Average (50-60%)" },
      { letter: "U", points: 0, desc: "Re-appearance (<50%)" }
    ]
  },
  sppu: {
    name: "Savitribai Phule Pune University (SPPU)",
    desc: "Uses Choice Based Credit System. Custom percentage conversion is computed using standard 8.8 multiplier.",
    maxGpa: 10,
    formulaText: "Percentage = CGPA × 8.8",
    convertToPct: (cgpa) => cgpa * 8.8,
    convertToGpa: (pct) => pct / 8.8,
    getGradeFromMarks: (marks) => {
      if (marks >= 90) return { letter: "O", points: 10 };
      if (marks >= 80) return { letter: "A+", points: 9 };
      if (marks >= 70) return { letter: "A", points: 8 };
      if (marks >= 60) return { letter: "B+", points: 7 };
      if (marks >= 55) return { letter: "B", points: 6 };
      if (marks >= 50) return { letter: "C", points: 5 };
      if (marks >= 40) return { letter: "P", points: 4 };
      return { letter: "F", points: 0 };
    },
    grades: [
      { letter: "O", points: 10, desc: "Outstanding (>=90%)" },
      { letter: "A+", points: 9, desc: "Excellent (80-89%)" },
      { letter: "A", points: 8, desc: "Very Good (70-79%)" },
      { letter: "B+", points: 7, desc: "Good (60-69%)" },
      { letter: "B", points: 6, desc: "Above Average (55-59%)" },
      { letter: "C", points: 5, desc: "Average (50-54%)" },
      { letter: "P", points: 4, desc: "Pass (40-49%)" },
      { letter: "F", points: 0, desc: "Fail (<40%)" }
    ]
  },
  general_4: {
    name: "General US 4-Point Scale",
    desc: "Standard 4.0 GPA scale used commonly in US universities and colleges.",
    maxGpa: 4,
    formulaText: "Percentage = (GPA / 4.0) × 100",
    convertToPct: (cgpa) => (cgpa / 4) * 100,
    convertToGpa: (pct) => (pct / 100) * 4,
    getGradeFromMarks: (marks) => {
      if (marks >= 93) return { letter: "A", points: 4.0 };
      if (marks >= 90) return { letter: "A-", points: 3.7 };
      if (marks >= 87) return { letter: "B+", points: 3.3 };
      if (marks >= 83) return { letter: "B", points: 3.0 };
      if (marks >= 80) return { letter: "B-", points: 2.7 };
      if (marks >= 77) return { letter: "C+", points: 2.3 };
      if (marks >= 73) return { letter: "C", points: 2.0 };
      if (marks >= 70) return { letter: "C-", points: 1.7 };
      if (marks >= 67) return { letter: "D+", points: 1.3 };
      if (marks >= 60) return { letter: "D", points: 1.0 };
      return { letter: "F", points: 0.0 };
    },
    grades: [
      { letter: "A", points: 4.0, desc: "Excellent (93-100%)" },
      { letter: "A-", points: 3.7, desc: "Outstanding (90-92%)" },
      { letter: "B+", points: 3.3, desc: "Very Good (87-89%)" },
      { letter: "B", points: 3.0, desc: "Good (83-86%)" },
      { letter: "B-", points: 2.7, desc: "Above Average (80-82%)" },
      { letter: "C+", points: 2.3, desc: "Average (77-79%)" },
      { letter: "C", points: 2.0, desc: "Satisfactory (73-76%)" },
      { letter: "C-", points: 1.7, desc: "Marginal (70-72%)" },
      { letter: "D+", points: 1.3, desc: "Poor (67-69%)" },
      { letter: "D", points: 1.0, desc: "Minimal Pass (60-66%)" },
      { letter: "F", points: 0.0, desc: "Fail (<60%)" }
    ]
  }
};
