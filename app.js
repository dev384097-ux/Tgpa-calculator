/* ==========================================================================
   UniCalc - Main Application Controller
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // --- Check Database and Chart Engine availability ---
  const UNIVERSITIES = window.UNIVERSITIES || {};
  const renderTrendsChart = window.renderTrendsChart;
  const clearTrendsChart = window.clearTrendsChart;

  // --- Initialize Lucide Icons ---
  try {
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  } catch (e) {
    console.warn("Lucide icons CDN failed to load:", e);
  }

  // --- State Variables ---
  let currentUniversityKey = 'general_10';
  let activeTab = 'sgpa'; // 'sgpa', 'cgpa', 'converter'
  let cgpaMode = 'sem'; // 'sem', 'raw'
  let latestGpaResult = 0;
  let latestCreditsResult = 0;
  
  // --- DOM Elements ---
  const universitySelect = document.getElementById('university-select');
  const themeToggle = document.getElementById('theme-toggle');
  const themePaletteSelect = document.getElementById('theme-palette-select');
  
  const welcomeScreen = document.getElementById('welcome-screen');
  const welcomeUnivCards = document.querySelectorAll('.welcome-univ-card');
  
  const univNameEl = document.getElementById('univ-name');
  const univDescEl = document.getElementById('univ-desc');
  const univFormulaEl = document.getElementById('univ-formula');
  const gradingScaleTbody = document.getElementById('grading-scale-tbody');
  
  const tabSgpa = document.getElementById('tab-sgpa');
  const tabCgpa = document.getElementById('tab-cgpa');
  const tabConverter = document.getElementById('tab-converter');
  
  const panelSgpa = document.getElementById('panel-sgpa');
  const panelCgpa = document.getElementById('panel-cgpa');
  const panelConverter = document.getElementById('panel-converter');
  
  const subjectsContainer = document.getElementById('subjects-container');
  const addSubjectBtn = document.getElementById('add-subject-btn');
  const clearSgpaBtn = document.getElementById('clear-sgpa');
  const calculateSgpaBtn = document.getElementById('calculate-sgpa-btn');
  
  const cgpaSemSection = document.getElementById('cgpa-sem-section');
  const cgpaRawSection = document.getElementById('cgpa-raw-section');
  const semestersContainer = document.getElementById('semesters-container');
  const addSemesterBtn = document.getElementById('add-semester-btn');
  const calculateCgpaBtn = document.getElementById('calculate-cgpa-btn');
  const calculateCgpaRawBtn = document.getElementById('calculate-cgpa-raw-btn');
  const cgpaModeSemBtn = document.getElementById('cgpa-mode-sem');
  const cgpaModeRawBtn = document.getElementById('cgpa-mode-raw');
  
  // Raw Inputs
  const prevCgpaInput = document.getElementById('prev-cgpa');
  const prevCreditsInput = document.getElementById('prev-credits');
  const currSgpaInput = document.getElementById('curr-sgpa');
  const currCreditsInput = document.getElementById('curr-credits');
  
  // Converter
  const convGpaInput = document.getElementById('conv-gpa-input');
  const convGpaMaxLabel = document.getElementById('conv-gpa-max');
  const convPercentageResult = document.getElementById('conv-percentage-result');
  const convPctInput = document.getElementById('conv-pct-input');
  const convGpaResult = document.getElementById('conv-gpa-result');
  
  // Dashboard Results
  const gaugeProgress = document.getElementById('gauge-progress');
  const scoreDisplayVal = document.getElementById('score-display-val');
  const scoreDisplayMax = document.getElementById('score-display-max');
  const calcModeBadge = document.getElementById('calc-mode-badge');
  const totalCreditsVal = document.getElementById('total-credits-val');
  const pctVal = document.getElementById('pct-val');
  const ratingVal = document.getElementById('rating-val');
  const honorVal = document.getElementById('honor-val');
  
  const downloadPdfBtn = document.getElementById('download-pdf-btn');
  const exportCsvBtn = document.getElementById('export-csv-btn');
  const chartCardWrapper = document.getElementById('chart-card-wrapper');
  const trendsCanvas = document.getElementById('trends-chart');
  const calculationWarning = document.getElementById('calculation-warning');
  
  // Accordions
  const accordionHeaders = document.querySelectorAll('.accordion-header');

  // --- Accordion Event Handling ---
  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const isOpen = item.classList.contains('open');
      
      // Close other accordions
      document.querySelectorAll('.accordion-item').forEach(otherItem => {
        otherItem.classList.remove('open');
        otherItem.querySelector('.accordion-content').style.maxHeight = null;
      });
      
      if (!isOpen) {
        item.classList.add('open');
        const content = item.querySelector('.accordion-content');
        content.style.maxHeight = content.scrollHeight + "px";
      }
    });
  });

  // --- Onboarding Welcome Selector ---
  const changeUnivBtn = document.getElementById('change-univ-btn');
  const closeWelcomeBtn = document.getElementById('close-welcome-btn');

  if (changeUnivBtn) {
    changeUnivBtn.addEventListener('click', () => {
      welcomeScreen.classList.remove('fade-out');
    });
  }

  if (closeWelcomeBtn) {
    closeWelcomeBtn.addEventListener('click', () => {
      welcomeScreen.classList.add('fade-out');
    });
  }

  welcomeUnivCards.forEach(card => {
    card.addEventListener('click', () => {
      const selectedUniv = card.dataset.univ;
      universitySelect.value = selectedUniv;
      loadUniversityProfile(selectedUniv);
      welcomeScreen.classList.add('fade-out');
    });
  });

  // --- Theme & Palette Switcher System ---
  // Load saved theme preferences
  const savedTheme = localStorage.getItem('theme') || 'dark';
  const savedPalette = localStorage.getItem('palette') || 'cyberpunk';
  
  document.documentElement.setAttribute('data-theme', savedTheme);
  document.documentElement.setAttribute('data-palette', savedPalette);
  
  if (themePaletteSelect) {
    themePaletteSelect.value = savedPalette;
    themePaletteSelect.addEventListener('change', (e) => {
      const palette = e.target.value;
      document.documentElement.setAttribute('data-palette', palette);
      localStorage.setItem('palette', palette);
      // Recalculate to redraw trend chart and gauge with new theme colors
      calculate();
    });
  }

  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    // Redraw trends chart to reflect dark/light text or grid changes
    calculate();
  });

  // --- University Loader ---
  function loadUniversityProfile(key) {
    const u = UNIVERSITIES[key];
    if (!u) return;

    currentUniversityKey = key;
    univNameEl.textContent = u.name;
    univDescEl.textContent = u.desc;
    univFormulaEl.textContent = u.formulaText;
    
    // Max scale adjustments
    scoreDisplayMax.textContent = `/ ${u.maxGpa.toFixed(2)}`;
    convGpaMaxLabel.textContent = `/ ${u.maxGpa}`;
    convGpaInput.setAttribute('max', u.maxGpa);

    // Build grading scale references
    gradingScaleTbody.innerHTML = '';
    u.grades.forEach(g => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${g.letter}</strong></td>
        <td>${g.desc}</td>
        <td>${g.points.toFixed(u.maxGpa === 4 ? 1 : 0)}</td>
      `;
      gradingScaleTbody.appendChild(tr);
    });

    // Rebuild Grades inside row models
    resolveAllSgpaGrades();
    
    // Set dashboard to stale instead of calculation
    markResultsStale();
  }

  // --- Tab Navigation System ---
  function switchTab(tabId) {
    activeTab = tabId;
    
    // Update active tab button style
    [tabSgpa, tabCgpa, tabConverter].forEach(btn => btn.classList.remove('active'));
    [tabSgpa, tabCgpa, tabConverter].forEach(btn => btn.setAttribute('aria-selected', 'false'));
    
    // Hide all panels
    [panelSgpa, panelCgpa, panelConverter].forEach(panel => panel.classList.remove('active'));
    
    let activeBtn, activePanel;
    if (tabId === 'sgpa') {
      activeBtn = tabSgpa;
      activePanel = panelSgpa;
      calcModeBadge.textContent = 'SGPA';
      chartCardWrapper.classList.add('hidden');
    } else if (tabId === 'cgpa') {
      activeBtn = tabCgpa;
      activePanel = panelCgpa;
      calcModeBadge.textContent = 'CGPA';
      if (cgpaMode === 'sem') {
        chartCardWrapper.classList.remove('hidden');
      }
    } else {
      activeBtn = tabConverter;
      activePanel = panelConverter;
      calcModeBadge.textContent = 'Conv';
      chartCardWrapper.classList.add('hidden');
    }
    
    activeBtn.classList.add('active');
    activeBtn.setAttribute('aria-selected', 'true');
    activePanel.classList.add('active');
    
    markResultsStale();
  }

  tabSgpa.addEventListener('click', () => switchTab('sgpa'));
  tabCgpa.addEventListener('click', () => switchTab('cgpa'));
  tabConverter.addEventListener('click', () => switchTab('converter'));

  // --- CGPA Calculation Mode Switcher ---
  function switchCgpaMode(mode) {
    cgpaMode = mode;
    if (mode === 'sem') {
      cgpaModeSemBtn.classList.add('btn-toggle-active');
      cgpaModeRawBtn.classList.remove('btn-toggle-active');
      cgpaSemSection.classList.remove('hidden');
      cgpaRawSection.classList.add('hidden');
      if (activeTab === 'cgpa') {
        chartCardWrapper.classList.remove('hidden');
      }
    } else {
      cgpaModeSemBtn.classList.remove('btn-toggle-active');
      cgpaModeRawBtn.classList.add('btn-toggle-active');
      cgpaSemSection.classList.add('hidden');
      cgpaRawSection.classList.remove('hidden');
      chartCardWrapper.classList.add('hidden');
    }
    markResultsStale();
  }

  cgpaModeSemBtn.addEventListener('click', () => switchCgpaMode('sem'));
  cgpaModeRawBtn.addEventListener('click', () => switchCgpaMode('raw'));

  // --- Dynamic SGPA Form Builders ---
  function createSubjectRow(name = '', credits = 3, marksVal = '') {
    const row = document.createElement('div');
    row.className = 'subject-row';
    row.dataset.gradePoints = '';
    row.dataset.letterGrade = '';

    row.innerHTML = `
      <div class="form-group">
        <input type="text" class="form-control subject-name-input" placeholder="e.g. Mathematics" value="${name}">
      </div>
      <div class="form-group">
        <input type="number" class="form-control subject-credits-input" placeholder="Credits" min="0.5" max="20" step="0.5" value="${credits}">
      </div>
      <div class="form-group">
        <input type="number" class="form-control subject-marks-input" placeholder="Marks" min="0" max="100" value="${marksVal}">
      </div>
      <div class="form-group" style="align-items: center; justify-content: center; display: flex;">
        <span class="grade-badge">-</span>
      </div>
      <button class="btn-danger-icon delete-subject-row" aria-label="Delete Row">
        <i data-lucide="trash"></i>
      </button>
    `;
    
    const marksInput = row.querySelector('.subject-marks-input');
    const creditsInput = row.querySelector('.subject-credits-input');
    const gradeBadge = row.querySelector('.grade-badge');

    function resolveGrade() {
      const u = UNIVERSITIES[currentUniversityKey];
      const marks = parseFloat(marksInput.value);

      if (isNaN(marks) || marks < 0) {
        row.dataset.gradePoints = '';
        row.dataset.letterGrade = '';
        gradeBadge.textContent = '-';
        gradeBadge.className = 'grade-badge';
        return;
      }

      // Cap marks at 100
      const cappedMarks = Math.min(100, Math.max(0, marks));
      if (marks !== cappedMarks) marksInput.value = cappedMarks;

      const resolved = u.getGradeFromMarks(cappedMarks);
      row.dataset.gradePoints = resolved.points;
      row.dataset.letterGrade = resolved.letter;
      gradeBadge.textContent = `${resolved.letter} (${resolved.points})`;
      
      // Update badge class based on grade points
      gradeBadge.className = 'grade-badge';
      if (resolved.points >= 9.0) {
        gradeBadge.classList.add('grade-high');
      } else if (resolved.points >= 7.0) {
        gradeBadge.classList.add('grade-mid');
      } else if (resolved.points >= 4.0) {
        gradeBadge.classList.add('grade-low');
      } else {
        gradeBadge.classList.add('grade-fail');
      }
    }

    marksInput.addEventListener('input', resolveGrade);
    
    // Bind change listener for immediate visual updates (marking results stale)
    row.querySelectorAll('input').forEach(input => {
      input.addEventListener('input', markResultsStale);
    });

    // Delete button logic
    row.querySelector('.delete-subject-row').addEventListener('click', () => {
      row.style.animation = 'slideRowIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) reverse';
      setTimeout(() => {
        row.remove();
        markResultsStale();
      }, 180);
    });

    subjectsContainer.appendChild(row);

    // Initial resolve
    if (marksVal !== '') {
      resolveGrade();
    }

    try {
      if (typeof lucide !== 'undefined') {
        lucide.createIcons({ node: row });
      }
    } catch (e) {
      console.warn("Lucide icon generation failed on row:", e);
    }
  }

  function resolveAllSgpaGrades() {
    const rows = subjectsContainer.querySelectorAll('.subject-row');
    rows.forEach(row => {
      const marksInput = row.querySelector('.subject-marks-input');
      const gradeBadge = row.querySelector('.grade-badge');
      const marks = parseFloat(marksInput.value);
      const u = UNIVERSITIES[currentUniversityKey];

      if (!isNaN(marks) && marks >= 0) {
        const resolved = u.getGradeFromMarks(marks);
        row.dataset.gradePoints = resolved.points;
        row.dataset.letterGrade = resolved.letter;
        gradeBadge.textContent = `${resolved.letter} (${resolved.points})`;
        
        gradeBadge.className = 'grade-badge';
        if (resolved.points >= 9.0) {
          gradeBadge.classList.add('grade-high');
        } else if (resolved.points >= 7.0) {
          gradeBadge.classList.add('grade-mid');
        } else if (resolved.points >= 4.0) {
          gradeBadge.classList.add('grade-low');
        } else {
          gradeBadge.classList.add('grade-fail');
        }
      }
    });
  }

  // --- Dynamic Semester Form Builders ---
  function createSemesterRow(semNum, sgpa = '', credits = 20) {
    const row = document.createElement('div');
    row.className = 'semester-row';
    row.dataset.semNum = semNum;

    row.innerHTML = `
      <div class="sem-label">Semester ${semNum}</div>
      <div class="form-group">
        <input type="number" class="form-control sem-sgpa-input" placeholder="SGPA" min="0" max="${UNIVERSITIES[currentUniversityKey].maxGpa}" step="0.01" value="${sgpa}">
      </div>
      <div class="form-group">
        <input type="number" class="form-control sem-credits-input" placeholder="Credits" min="0.5" step="0.5" value="${credits}">
      </div>
      <button class="btn-danger-icon delete-semester-row" aria-label="Delete Semester Row">
        <i data-lucide="trash"></i>
      </button>
    `;

    row.querySelectorAll('input').forEach(input => {
      input.addEventListener('input', markResultsStale);
    });

    row.querySelector('.delete-semester-row').addEventListener('click', () => {
      row.style.animation = 'slideRowIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) reverse';
      setTimeout(() => {
        row.remove();
        reorderSemesterLabels();
        markResultsStale();
      }, 180);
    });

    semestersContainer.appendChild(row);
    try {
      if (typeof lucide !== 'undefined') {
        lucide.createIcons({ node: row });
      }
    } catch (e) {
      console.warn("Lucide icon generation failed on row:", e);
    }
  }

  function reorderSemesterLabels() {
    const rows = semestersContainer.querySelectorAll('.semester-row');
    rows.forEach((row, index) => {
      const semNum = index + 1;
      row.dataset.semNum = semNum;
      row.querySelector('.sem-label').textContent = `Semester ${semNum}`;
    });
  }

  // Bind change listeners to raw inputs
  [prevCgpaInput, prevCreditsInput, currSgpaInput, currCreditsInput].forEach(input => {
    input.addEventListener('input', markResultsStale);
  });

  addSubjectBtn.addEventListener('click', () => {
    createSubjectRow();
    markResultsStale();
  });

  addSemesterBtn.addEventListener('click', () => {
    const nextSemNum = semestersContainer.querySelectorAll('.semester-row').length + 1;
    createSemesterRow(nextSemNum);
    markResultsStale();
  });

  clearSgpaBtn.addEventListener('click', () => {
    subjectsContainer.innerHTML = '';
    // Pre-populate 4 empty rows
    for(let i=0; i<4; i++) createSubjectRow();
    markResultsStale();
  });

  // --- Standalone Converter Calculations ---
  convGpaInput.addEventListener('input', () => {
    const val = parseFloat(convGpaInput.value);
    const u = UNIVERSITIES[currentUniversityKey];
    if (isNaN(val) || val < 0) {
      convPercentageResult.textContent = '0.00%';
      return;
    }
    const cappedVal = Math.min(val, u.maxGpa);
    if(val > u.maxGpa) convGpaInput.value = u.maxGpa;
    const pct = u.convertToPct(cappedVal);
    convPercentageResult.textContent = `${pct.toFixed(2)}%`;
  });

  convPctInput.addEventListener('input', () => {
    const val = parseFloat(convPctInput.value);
    const u = UNIVERSITIES[currentUniversityKey];
    if (isNaN(val) || val < 0) {
      convGpaResult.textContent = '0.00';
      return;
    }
    const cappedVal = Math.min(val, 100);
    if(val > 100) convPctInput.value = 100;
    const gpa = u.convertToGpa(cappedVal);
    convGpaResult.textContent = gpa.toFixed(2);
  });

  // --- Mark Results Stale ---
  function markResultsStale() {
    scoreDisplayVal.style.opacity = '0.35';
    pctVal.style.opacity = '0.35';
    totalCreditsVal.style.opacity = '0.5';
    ratingVal.style.opacity = '0.5';
    honorVal.style.opacity = '0.5';
  }

  // --- Real-time Calculations Core ---
  function calculate() {
    const u = UNIVERSITIES[currentUniversityKey];
    let finalGpa = 0;
    let totalCredits = 0;
    let detailsArrayForChart = [];

    if (activeTab === 'sgpa') {
      const rows = subjectsContainer.querySelectorAll('.subject-row');
      let totalGradePoints = 0;

      rows.forEach(row => {
        const credVal = parseFloat(row.querySelector('.subject-credits-input').value);
        const gradePointVal = parseFloat(row.dataset.gradePoints);

        if (!isNaN(credVal) && credVal > 0 && !isNaN(gradePointVal)) {
          totalGradePoints += (credVal * gradePointVal);
          totalCredits += credVal;
        }
      });

      if (totalCredits > 0) {
        finalGpa = totalGradePoints / totalCredits;
      }
    } 
    else if (activeTab === 'cgpa') {
      if (cgpaMode === 'sem') {
        const rows = semestersContainer.querySelectorAll('.semester-row');
        let totalGradePoints = 0;
        let cumulativePoints = 0;
        let cumulativeCredits = 0;

        rows.forEach((row, idx) => {
          const sgpaVal = parseFloat(row.querySelector('.sem-sgpa-input').value);
          const credVal = parseFloat(row.querySelector('.sem-credits-input').value);

          if (!isNaN(sgpaVal) && sgpaVal >= 0 && !isNaN(credVal) && credVal > 0) {
            totalGradePoints += (sgpaVal * credVal);
            totalCredits += credVal;
            
            // Collect coordinates for the progress chart
            cumulativePoints += (sgpaVal * credVal);
            cumulativeCredits += credVal;
            detailsArrayForChart.push({
              sem: idx + 1,
              sgpa: sgpaVal,
              cgpa: cumulativePoints / cumulativeCredits
            });
          }
        });

        if (totalCredits > 0) {
          finalGpa = totalGradePoints / totalCredits;
        }
        
        // Render custom Canvas progress chart
        if (detailsArrayForChart.length > 0 && typeof renderTrendsChart === 'function') {
          renderTrendsChart(trendsCanvas, detailsArrayForChart, u.maxGpa);
        } else if (typeof clearTrendsChart === 'function') {
          clearTrendsChart(trendsCanvas);
        }
      } 
      else {
        // Raw Summary Mode
        const prevCgpa = parseFloat(prevCgpaInput.value);
        const prevCreds = parseFloat(prevCreditsInput.value);
        const currSgpa = parseFloat(currSgpaInput.value);
        const currCreds = parseFloat(currCreditsInput.value);

        let totalPoints = 0;

        if (!isNaN(prevCgpa) && !isNaN(prevCreds) && prevCreds >= 0) {
          totalPoints += (prevCgpa * prevCreds);
          totalCredits += prevCreds;
        }

        if (!isNaN(currSgpa) && !isNaN(currCreds) && currCreds >= 0) {
          totalPoints += (currSgpa * currCreds);
          totalCredits += currCreds;
        }

        if (totalCredits > 0) {
          finalGpa = totalPoints / totalCredits;
        }
      }
    } 
    else {
      const val = parseFloat(convGpaInput.value);
      if (!isNaN(val)) {
        finalGpa = Math.min(val, u.maxGpa);
      }
      totalCredits = 0;
    }

    latestGpaResult = finalGpa;
    latestCreditsResult = totalCredits;

    updateDashboard(finalGpa, totalCredits, u);
  }

  // --- Calculate Trigger with loading animation ---
  function triggerCalculationAnimation() {
    // Show Loading state inside the gauge
    scoreDisplayVal.textContent = '...';
    scoreDisplayVal.style.opacity = '1';
    pctVal.style.opacity = '1';
    totalCreditsVal.style.opacity = '1';
    ratingVal.style.opacity = '1';
    honorVal.style.opacity = '1';

    // Reset gauge dashboard ring rotation
    gaugeProgress.style.strokeDashoffset = '314.159';

    // Disable calculate buttons briefly
    const buttons = [calculateSgpaBtn, calculateCgpaBtn, calculateCgpaRawBtn];
    buttons.forEach(btn => { if(btn) btn.disabled = true; });

    setTimeout(() => {
      calculate();

      // smooth numeric ticking count animation
      const targetGpa = latestGpaResult;
      let currentTick = 0;
      const duration = 300; // ms
      const interval = 16; // ~60fps
      const steps = duration / interval;
      const increment = targetGpa / steps;

      const tickTimer = setInterval(() => {
        currentTick += increment;
        if (currentTick >= targetGpa) {
          clearInterval(tickTimer);
          scoreDisplayVal.textContent = targetGpa.toFixed(2);
        } else {
          scoreDisplayVal.textContent = currentTick.toFixed(2);
        }
      }, interval);

      buttons.forEach(btn => { if(btn) btn.disabled = false; });
    }, 500);
  }

  // Bind calculate button listeners
  calculateSgpaBtn.addEventListener('click', triggerCalculationAnimation);
  calculateCgpaBtn.addEventListener('click', triggerCalculationAnimation);
  calculateCgpaRawBtn.addEventListener('click', triggerCalculationAnimation);

  // --- Update Dashboard Outputs & Gauge ---
  function updateDashboard(gpa, credits, univ) {
    scoreDisplayVal.textContent = gpa.toFixed(2);
    totalCreditsVal.textContent = credits.toFixed(credits % 1 === 0 ? 0 : 1);
    
    const pct = univ.convertToPct(gpa);
    pctVal.textContent = `${pct.toFixed(2)}%`;

    const circumference = 314.159;
    const percentageFilled = Math.min(Math.max(gpa / univ.maxGpa, 0), 1);
    const dashOffset = circumference - (percentageFilled * circumference);
    
    gaugeProgress.style.strokeDasharray = `${circumference}`;
    gaugeProgress.style.strokeDashoffset = `${dashOffset}`;

    let rating = "-";
    let honors = "No";
    
    if (gpa > 0) {
      if (calculationWarning) calculationWarning.classList.remove('hidden');
      if (univ.maxGpa === 10) {
        if (gpa >= 9.0) {
          rating = "Outstanding";
          honors = "Yes (First Class with Distinction)";
          gaugeProgress.style.stroke = "var(--secondary)";
        } else if (gpa >= 7.5) {
          rating = "First Class (Dist.)";
          honors = "Yes (Honours Eligible)";
          gaugeProgress.style.stroke = "var(--success)";
        } else if (gpa >= 6.5) {
          rating = "First Class";
          honors = "No";
          gaugeProgress.style.stroke = "var(--primary)";
        } else if (gpa >= 5.0) {
          rating = "Second Class";
          honors = "No";
          gaugeProgress.style.stroke = "var(--warning)";
        } else if (gpa >= 4.0) {
          rating = "Pass Class";
          honors = "No";
          gaugeProgress.style.stroke = "var(--warning)";
        } else {
          rating = "Re-appear / Fail";
          honors = "No";
          gaugeProgress.style.stroke = "var(--danger)";
        }
      } else {
        if (gpa >= 3.5) {
          rating = "Outstanding (Cum Laude)";
          honors = "Yes (Dean's List)";
          gaugeProgress.style.stroke = "var(--secondary)";
        } else if (gpa >= 3.0) {
          rating = "Very Good";
          honors = "Yes";
          gaugeProgress.style.stroke = "var(--success)";
        } else if (gpa >= 2.0) {
          rating = "Satisfactory";
          honors = "No";
          gaugeProgress.style.stroke = "var(--primary)";
        } else {
          rating = "Academic Probation";
          honors = "No";
          gaugeProgress.style.stroke = "var(--danger)";
        }
      }
    } else {
      gaugeProgress.style.stroke = "var(--divider)";
      if (calculationWarning) calculationWarning.classList.add('hidden');
    }
    
    ratingVal.textContent = rating;
    honorVal.textContent = honors;
  }

  // --- PDF Transcript Generating Tool ---
  downloadPdfBtn.addEventListener('click', () => {
    const u = UNIVERSITIES[currentUniversityKey];
    
    // 1. Populate print area elements
    document.getElementById('print-date').textContent = `Generated on: ${new Date().toLocaleDateString()}`;
    document.getElementById('print-univ-name').textContent = u.name;
    document.getElementById('print-calc-mode').textContent = activeTab.toUpperCase();
    document.getElementById('print-score-val').textContent = `${latestGpaResult.toFixed(2)} / ${u.maxGpa.toFixed(2)}`;
    document.getElementById('print-score-pct').textContent = `${u.convertToPct(latestGpaResult).toFixed(2)}%`;
    document.getElementById('print-total-credits').textContent = latestCreditsResult.toFixed(1);
    document.getElementById('print-rating').textContent = ratingVal.textContent;
    document.getElementById('print-honours').textContent = honorVal.textContent;

    // 2. Build the print table
    const thead = document.getElementById('print-table-thead');
    const tbody = document.getElementById('print-table-tbody');
    thead.innerHTML = '';
    tbody.innerHTML = '';

    if (activeTab === 'sgpa') {
      thead.innerHTML = `
        <tr>
          <th>Subject/Course Name</th>
          <th>Credits</th>
          <th>Marks</th>
          <th>Resolved Grade</th>
        </tr>
      `;

      const rows = subjectsContainer.querySelectorAll('.subject-row');
      let rowCount = 0;
      rows.forEach(row => {
        const nameVal = row.querySelector('.subject-name-input').value.trim() || 'Unnamed Course';
        const credVal = row.querySelector('.subject-credits-input').value;
        const marksVal = row.querySelector('.subject-marks-input').value;
        const letter = row.dataset.letterGrade || '-';
        const points = row.dataset.gradePoints || '0';

        if (credVal !== '' && marksVal !== '') {
          rowCount++;
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td>${nameVal}</td>
            <td>${parseFloat(credVal).toFixed(1)}</td>
            <td>${marksVal}</td>
            <td>${letter} (${points})</td>
          `;
          tbody.appendChild(tr);
        }
      });

      if (rowCount === 0) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align: center;">No subject rows entered.</td></tr>`;
      }
    } 
    else if (activeTab === 'cgpa') {
      if (cgpaMode === 'sem') {
        thead.innerHTML = `
          <tr>
            <th>Semester</th>
            <th>SGPA Score</th>
            <th>Credits Registered</th>
          </tr>
        `;

        const rows = semestersContainer.querySelectorAll('.semester-row');
        let rowCount = 0;
        rows.forEach(row => {
          const semLabelVal = row.querySelector('.sem-label').textContent;
          const sgpaVal = row.querySelector('.sem-sgpa-input').value;
          const credVal = row.querySelector('.sem-credits-input').value;

          if (sgpaVal !== '' && credVal !== '') {
            rowCount++;
            const tr = document.createElement('tr');
            tr.innerHTML = `
              <td>${semLabelVal}</td>
              <td>${parseFloat(sgpaVal).toFixed(2)}</td>
              <td>${parseFloat(credVal).toFixed(1)}</td>
            `;
            tbody.appendChild(tr);
          }
        });

        if (rowCount === 0) {
          tbody.innerHTML = `<tr><td colspan="3" style="text-align: center;">No semesters entered.</td></tr>`;
        }
      } 
      else {
        thead.innerHTML = `
          <tr>
            <th>Assessment Segment</th>
            <th>Academic Score</th>
            <th>Weightage (Credits)</th>
          </tr>
        `;
        
        tbody.innerHTML = `
          <tr>
            <td>Prior Semesters (Acc.)</td>
            <td>${parseFloat(prevCgpaInput.value || 0).toFixed(2)}</td>
            <td>${parseFloat(prevCreditsInput.value || 0).toFixed(1)}</td>
          </tr>
          <tr>
            <td>Current Semester (Term)</td>
            <td>${parseFloat(currSgpaInput.value || 0).toFixed(2)}</td>
            <td>${parseFloat(currCreditsInput.value || 0).toFixed(1)}</td>
          </tr>
        `;
      }
    }

    // 3. Trigger print popup
    window.print();
  });

  // --- Export Data to CSV ---
  exportCsvBtn.addEventListener('click', () => {
    const u = UNIVERSITIES[currentUniversityKey];
    let csvContent = "data:text/csv;charset=utf-8,";
    
    csvContent += `UniCalc Academic Performance Report\n`;
    csvContent += `University System,${u.name}\n`;
    csvContent += `Calculation Type,${activeTab.toUpperCase()}\n`;
    csvContent += `GPA Score,${latestGpaResult.toFixed(2)} / ${u.maxGpa.toFixed(2)}\n`;
    csvContent += `Percentage Equivalent,${u.convertToPct(latestGpaResult).toFixed(2)}%\n`;
    csvContent += `Total Credits,${latestCreditsResult.toFixed(1)}\n`;
    csvContent += `Academic Standing,${ratingVal.textContent}\n\n`;

    if (activeTab === 'sgpa') {
      csvContent += "Subject/Course,Credits,Marks,Resolved Grade\n";
      const rows = subjectsContainer.querySelectorAll('.subject-row');
      rows.forEach(row => {
        const nameVal = row.querySelector('.subject-name-input').value.trim() || 'Unnamed Course';
        const credVal = row.querySelector('.subject-credits-input').value;
        const marksVal = row.querySelector('.subject-marks-input').value;
        const letter = row.dataset.letterGrade || '-';
        const points = row.dataset.gradePoints || '0';
        
        if (credVal !== '' && marksVal !== '') {
          const cleanedName = nameVal.replace(/"/g, '""');
          csvContent += `"${cleanedName}",${credVal},${marksVal},"${letter} (${points})"\n`;
        }
      });
    } 
    else if (activeTab === 'cgpa') {
      if (cgpaMode === 'sem') {
        csvContent += "Semester,SGPA,Credits\n";
        const rows = semestersContainer.querySelectorAll('.semester-row');
        rows.forEach(row => {
          const semLabelVal = row.querySelector('.sem-label').textContent;
          const sgpaVal = row.querySelector('.sem-sgpa-input').value;
          const credVal = row.querySelector('.sem-credits-input').value;
          
          if (sgpaVal !== '' && credVal !== '') {
            csvContent += `"${semLabelVal}",${sgpaVal},${credVal}\n`;
          }
        });
      } 
      else {
        csvContent += "Segment,Score,Credits\n";
        csvContent += `Prior semesters,${prevCgpaInput.value || 0},${prevCreditsInput.value || 0}\n`;
        csvContent += `Current semester,${currSgpaInput.value || 0},${currCreditsInput.value || 0}\n`;
      }
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `unicalc_gpa_report_${currentUniversityKey}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });

  // --- Initial Setup and Pre-population ---
  universitySelect.addEventListener('change', (e) => {
    loadUniversityProfile(e.target.value);
  });

  // Pre-populate SGPA table with 5 empty rows with default placeholder marks
  const placeHolders = [
    { name: 'Mathematics I', credits: 4, marks: 88 },
    { name: 'Physics Lab', credits: 1.5, marks: 92 },
    { name: 'Computer Programming', credits: 3, marks: 82 },
    { name: 'Engineering Graphics', credits: 2.5, marks: 74 },
    { name: 'Professional English', credits: 2, marks: 85 }
  ];
  for (let i = 0; i < 5; i++) {
    createSubjectRow(placeHolders[i].name, placeHolders[i].credits, placeHolders[i].marks);
  }

  // Pre-populate CGPA semesters
  for (let i = 1; i <= 4; i++) {
    createSemesterRow(i, '', 20);
  }

  // Resize listener for trends canvas chart redrawing
  window.addEventListener('resize', () => {
    if (activeTab === 'cgpa' && cgpaMode === 'sem') {
      calculate();
    }
  });

  // Note: loadUniversityProfile will set dashboard to stale. Let's trigger a first load calculation after the onboarding selection.
  // By default, since they need to select on onboarding, we load default general_10, but the welcome modal will cover it.
  loadUniversityProfile(currentUniversityKey);
  
  // Calculate initially so there is a starting score if they skip onboarding or load first time
  calculate();
});
