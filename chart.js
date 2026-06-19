/* ==========================================================================
   UniCalc - Canvas-based Custom Trends Charting Engine
   ========================================================================= */

window.renderTrendsChart = function(canvas, data, maxGpa) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Set high-DPI resolution rendering
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = 280 * dpr;
  ctx.scale(dpr, dpr);

  const width = rect.width;
  const height = 280;
  
  // Clear canvas
  ctx.clearRect(0, 0, width, height);

  // Styling constants
  const padding = { top: 40, right: 30, bottom: 40, left: 50 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  
  // Drawing Grid Lines & Axis
  ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--divider').trim() || 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 1;
  ctx.font = '500 11px Inter, sans-serif';
  ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-muted').trim() || '#64748b';

  // Draw Y grid lines and labels (0 to Max GPA in steps)
  const ySteps = 4;
  for (let i = 0; i <= ySteps; i++) {
    const gpaTick = (maxGpa / ySteps) * i;
    const y = padding.top + chartHeight - (gpaTick / maxGpa) * chartHeight;
    
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(width - padding.right, y);
    ctx.stroke();

    ctx.fillText(gpaTick.toFixed(1), padding.left - 25, y + 4);
  }

  // Coordinates converter
  const getX = (index, total) => {
    if (total <= 1) return padding.left + chartWidth / 2;
    return padding.left + (index / (total - 1)) * chartWidth;
  };
  
  const getY = (val) => {
    return padding.top + chartHeight - (val / maxGpa) * chartHeight;
  };

  // Draw X axis labels (Semesters)
  data.forEach((d, idx) => {
    const x = getX(idx, data.length);
    ctx.beginPath();
    ctx.moveTo(x, padding.top);
    ctx.lineTo(x, padding.top + chartHeight + 5);
    ctx.stroke();
    
    ctx.textAlign = 'center';
    ctx.fillText(`Sem ${d.sem}`, x, padding.top + chartHeight + 20);
  });

  // Helper to draw lines
  const drawLine = (key, strokeColor, areaGradientColor, isDashed = false) => {
    ctx.beginPath();
    if (isDashed) ctx.setLineDash([4, 4]);
    else ctx.setLineDash([]);
    
    data.forEach((d, idx) => {
      const x = getX(idx, data.length);
      const y = getY(d[key]);
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });

    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 3;
    ctx.stroke();

    // Area Fill Underneath
    if (!isDashed && data.length > 1) {
      ctx.beginPath();
      ctx.moveTo(getX(0, data.length), padding.top + chartHeight);
      data.forEach((d, idx) => {
        ctx.lineTo(getX(idx, data.length), getY(d[key]));
      });
      ctx.lineTo(getX(data.length - 1, data.length), padding.top + chartHeight);
      ctx.closePath();

      const grad = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartHeight);
      grad.addColorStop(0, areaGradientColor);
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.fill();
    }

    // Draw markers on dots
    data.forEach((d, idx) => {
      const x = getX(idx, data.length);
      const y = getY(d[key]);
      
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Draw text values above dots
      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-primary').trim() || '#f8fafc';
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(d[key].toFixed(2), x, y - 10);
    });
  };

  const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '#6366f1';
  const secondaryColor = getComputedStyle(document.documentElement).getPropertyValue('--secondary').trim() || '#d946ef';

  // Draw SGPA (Dashed line) and CGPA (Solid Line)
  drawLine('sgpa', secondaryColor, 'rgba(217, 70, 239, 0.12)', true);
  drawLine('cgpa', primaryColor, 'rgba(99, 102, 241, 0.15)', false);

  // Draw Legend
  ctx.setLineDash([]);
  ctx.textAlign = 'left';
  ctx.font = '600 11px Inter, sans-serif';
  
  // SGPA Legend
  ctx.strokeStyle = secondaryColor;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(padding.left + 5, 18);
  ctx.lineTo(padding.left + 25, 18);
  ctx.stroke();
  ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim() || '#94a3b8';
  ctx.fillText("Term SGPA/TGPA", padding.left + 30, 21);

  // CGPA Legend
  ctx.strokeStyle = primaryColor;
  ctx.beginPath();
  ctx.moveTo(padding.left + 150, 18);
  ctx.lineTo(padding.left + 170, 18);
  ctx.stroke();
  ctx.fillText("Cumulative CGPA", padding.left + 175, 21);
};

window.clearTrendsChart = function(canvas) {
  const ctx = canvas.getContext('2d');
  if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
};
