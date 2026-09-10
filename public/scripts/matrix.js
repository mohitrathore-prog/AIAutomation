/**
 * Interactive 2x2 Opportunity Matrix Renderer
 * Plots opportunities across Business Value (Y) vs Implementation Readiness/Complexity (X)
 * Quadrants: Quick Wins, Strategic, Tactical, Explore
 */

window.OpportunityMatrix = {
  render(containerId, points = [], onPointClick = null) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!points || points.length === 0) {
      container.innerHTML = `<div style="text-align: center; padding: 40px; color: #64748b;">No opportunity data available to plot matrix.</div>`;
      return;
    }

    const width = 800;
    const height = 480;
    const padding = 60;
    const plotWidth = width - padding * 2;
    const plotHeight = height - padding * 2;

    // Build SVG
    let svg = `
      <svg viewBox="0 0 ${width} ${height}" style="width: 100%; height: auto; font-family: Inter, sans-serif; user-select: none;">
        <defs>
          <filter id="node-shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity="0.15"/>
          </filter>
        </defs>

        <!-- Canvas Background -->
        <rect width="${width}" height="${height}" rx="8" fill="#ffffff" stroke="#e2e8f0" stroke-width="1"/>

        <!-- 4 Quadrant Backgrounds -->
        <!-- Top Left: Strategic -->
        <rect x="${padding}" y="${padding}" width="${plotWidth / 2}" height="${plotHeight / 2}" fill="#f5f3ff" opacity="0.6"/>
        <!-- Top Right: Quick Wins -->
        <rect x="${padding + plotWidth / 2}" y="${padding}" width="${plotWidth / 2}" height="${plotHeight / 2}" fill="#ecfdf5" opacity="0.6"/>
        <!-- Bottom Left: Explore -->
        <rect x="${padding}" y="${padding + plotHeight / 2}" width="${plotWidth / 2}" height="${plotHeight / 2}" fill="#fffbeb" opacity="0.6"/>
        <!-- Bottom Right: Tactical -->
        <rect x="${padding + plotWidth / 2}" y="${padding + plotHeight / 2}" width="${plotWidth / 2}" height="${plotHeight / 2}" fill="#eff6ff" opacity="0.6"/>

        <!-- Quadrant Labels -->
        <text x="${padding + 16}" y="${padding + 28}" fill="#5b21b6" font-size="12" font-weight="700" letter-spacing="0.5">STRATEGIC (High Value, Complex)</text>
        <text x="${width - padding - 16}" y="${padding + 28}" fill="#047857" font-size="12" font-weight="700" text-anchor="end" letter-spacing="0.5">QUICK WINS (High Value, High Readiness)</text>
        <text x="${padding + 16}" y="${height - padding - 16}" fill="#92400e" font-size="12" font-weight="700" letter-spacing="0.5">EXPLORE (Early-Stage / Evaluate)</text>
        <text x="${width - padding - 16}" y="${height - padding - 16}" fill="#1d4ed8" font-size="12" font-weight="700" text-anchor="end" letter-spacing="0.5">TACTICAL (Moderate Value, Manageable)</text>

        <!-- Center Crosshairs -->
        <line x1="${padding}" y1="${padding + plotHeight / 2}" x2="${width - padding}" y2="${padding + plotHeight / 2}" stroke="#cbd5e1" stroke-width="1.5" stroke-dasharray="4,4"/>
        <line x1="${padding + plotWidth / 2}" y1="${padding}" x2="${padding + plotWidth / 2}" y2="${height - padding}" stroke="#cbd5e1" stroke-width="1.5" stroke-dasharray="4,4"/>

        <!-- Axis Labels -->
        <text x="${width / 2}" y="${height - 18}" fill="#334155" font-size="12" font-weight="700" text-anchor="middle">IMPLEMENTATION READINESS &amp; SPEED &rarr;</text>
        <text x="18" y="${height / 2}" fill="#334155" font-size="12" font-weight="700" text-anchor="middle" transform="rotate(-90 18 ${height / 2})">BUSINESS VALUE &amp; IMPACT &rarr;</text>

        <!-- Plot Nodes -->
        <g id="matrix-nodes">
    `;

    points.forEach((pt, index) => {
      // Map x (0-100) to SVG coords
      const cx = padding + (pt.x / 100) * plotWidth;
      // Map y (0-100) to SVG coords (inverted so 100 is top)
      const cy = height - padding - (pt.y / 100) * plotHeight;

      const isAi = pt.aiNecessity === "Yes";
      const isHybrid = pt.solutionType?.includes("Hybrid") || pt.solutionType?.includes("Assisted");
      const color = isAi ? "#7c3aed" : isHybrid ? "#0284c7" : "#059669";
      const label = pt.name.length > 22 ? pt.name.substring(0, 20) + "..." : pt.name;

      svg += `
        <g class="matrix-node-point" data-id="${pt.id}" style="cursor: pointer;" transform="translate(${cx}, ${cy})">
          <circle cx="0" cy="0" r="9" fill="${color}" stroke="#ffffff" stroke-width="2" filter="url(#node-shadow)"/>
          <text x="12" y="4" fill="#0f172a" font-size="10" font-weight="600" opacity="0.9">${label}</text>
          <title>${pt.name} (${pt.solutionType})&#10;Business Value: ${pt.y}/100&#10;Readiness: ${pt.x}/100&#10;Priority: ${pt.priority}</title>
        </g>
      `;
    });

    svg += `
        </g>
      </svg>
      <div style="display: flex; justify-content: center; gap: 20px; margin-top: 12px; font-size: 11px; color: #475569; font-weight: 500;">
        <div style="display: flex; align-items: center; gap: 6px;"><span style="width: 10px; height: 10px; border-radius: 50%; background: #059669; display: inline-block;"></span> Automation / Rules</div>
        <div style="display: flex; align-items: center; gap: 6px;"><span style="width: 10px; height: 10px; border-radius: 50%; background: #0284c7; display: inline-block;"></span> AI-Assisted Hybrid</div>
        <div style="display: flex; align-items: center; gap: 6px;"><span style="width: 10px; height: 10px; border-radius: 50%; background: #7c3aed; display: inline-block;"></span> Advanced AI / Agentic</div>
      </div>
    `;

    container.innerHTML = svg;

    // Attach click listeners to points
    if (onPointClick) {
      const nodes = container.querySelectorAll('.matrix-node-point');
      nodes.forEach(n => {
        n.addEventListener('click', () => {
          const id = n.getAttribute('data-id');
          onPointClick(id);
        });
      });
    }
  }
};
