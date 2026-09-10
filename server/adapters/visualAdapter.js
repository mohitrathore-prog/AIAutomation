/**
 * Conceptual Solution Visuals & UI Mockup Adapter
 * Renders executive-grade conceptual interface mockups
 * Clearly watermarked: "Illustrative conceptual design — not an actual production interface or vendor screenshot."
 */

class VisualAdapter {
  /**
   * Generates interactive conceptual HTML/SVG mockup based on use case category
   * @param {string} useCaseId Use case identifier
   * @returns {string} HTML snippet for rendering
   */
  generateConceptualMockup(useCaseId = "") {
    const disclaimerBanner = `
      <div style="background-color: #fef3c7; border: 1px solid #fde68a; border-radius: 6px; padding: 8px 12px; margin-bottom: 12px; display: flex; align-items: center; gap: 8px; font-size: 11px; color: #92400e; font-weight: 500;">
        <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20" style="flex-shrink: 0;"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
        <span><strong>Illustrative conceptual design</strong> — not an actual production interface or vendor screenshot.</span>
      </div>
    `;

    // 1. AP Automation & Invoice Processing Mockup
    if (useCaseId.includes("ap") || useCaseId.includes("invoice") || useCaseId.includes("fin")) {
      return `
        ${disclaimerBanner}
        <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); font-family: Inter, sans-serif; overflow: hidden;">
          <!-- Top Application Bar -->
          <div style="background: #0f172a; color: #ffffff; padding: 10px 16px; display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <span style="background: #2563eb; color: #fff; font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 4px;">AP COMMAND</span>
              <span style="font-size: 12px; font-weight: 600;">Automated Invoice Triage & 3-Way Match</span>
            </div>
            <div style="display: flex; gap: 8px; font-size: 11px;">
              <span style="background: #1e293b; padding: 3px 8px; border-radius: 4px; color: #94a3b8;">Batch #2026-0814</span>
              <span style="background: #059669; padding: 3px 8px; border-radius: 4px; color: #fff; font-weight: 600;">88% Straight-Through</span>
            </div>
          </div>
          <!-- Body Split: Document Viewer (Left) & Extracted Ledger Form (Right) -->
          <div style="display: grid; grid-template-columns: 1fr 1.2fr; gap: 16px; padding: 16px; background: #f8fafc;">
            <!-- Left: Scanned Invoice Preview with Bounding Box Highlights -->
            <div style="background: #ffffff; border: 1px solid #cbd5e1; border-radius: 6px; padding: 14px; position: relative;">
              <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #f1f5f9; padding-bottom: 8px; margin-bottom: 10px;">
                <span style="font-size: 11px; font-weight: 700; color: #475569;">INCOMING SUPPLIER PDF</span>
                <span style="font-size: 10px; color: #059669; background: #ecfdf5; padding: 2px 6px; border-radius: 3px; font-weight: 600;">OCR Confidence: 97.4%</span>
              </div>
              <div style="font-size: 11px; color: #1e293b; line-height: 1.6; border: 1px dashed #94a3b8; padding: 10px; border-radius: 4px; background: #fafafa;">
                <div style="font-weight: 700; font-size: 13px; margin-bottom: 4px;">ACME INDUSTRIAL LOGISTICS LTD</div>
                <div>Invoice #: <span style="background: #fef08a; padding: 1px 4px; border-radius: 2px;">INV-2026-98122</span></div>
                <div>PO Ref: <span style="background: #bfdbfe; padding: 1px 4px; border-radius: 2px;">PO-884102</span></div>
                <div>Date: 2026-02-12</div>
                <div style="margin-top: 10px; border-top: 1px solid #e2e8f0; padding-top: 6px;">
                  <div>Line 1: 50x Industrial Bearings @ $45.00 = $2,250.00</div>
                  <div>Line 2: Freight Handling = $150.00</div>
                  <div style="font-weight: 700; margin-top: 4px;">Total Amount: <span style="background: #bbf7d0; padding: 1px 4px; border-radius: 2px;">$2,400.00 USD</span></div>
                </div>
              </div>
              <div style="margin-top: 8px; font-size: 10px; color: #64748b; text-align: center;">
                Source File: supplier_inv_98122.pdf (Received via Inbound EDI / Mailbox)
              </div>
            </div>

            <!-- Right: Deterministic 3-Way Match Verification Form -->
            <div style="background: #ffffff; border: 1px solid #cbd5e1; border-radius: 6px; padding: 14px;">
              <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #f1f5f9; padding-bottom: 8px; margin-bottom: 10px;">
                <span style="font-size: 11px; font-weight: 700; color: #475569;">SAP S/4HANA PO VERIFICATION</span>
                <span style="font-size: 10px; color: #2563eb; background: #eff6ff; padding: 2px 6px; border-radius: 3px; font-weight: 600;">Rule Engine: MATCHED</span>
              </div>
              
              <!-- Match Checklist -->
              <div style="display: flex; flex-direction: column; gap: 8px; font-size: 11px;">
                <div style="display: flex; justify-content: space-between; padding: 6px; background: #f1f5f9; border-radius: 4px;">
                  <span>Vendor Master (VEND-00192)</span>
                  <span style="color: #059669; font-weight: 600;">✓ Verified (Tax ID Matched)</span>
                </div>
                <div style="display: flex; justify-content: space-between; padding: 6px; background: #f1f5f9; border-radius: 4px;">
                  <span>Purchase Order Line Price</span>
                  <span style="color: #059669; font-weight: 600;">✓ Within 0% Variance ($45.00/unit)</span>
                </div>
                <div style="display: flex; justify-content: space-between; padding: 6px; background: #f1f5f9; border-radius: 4px;">
                  <span>Goods Receipt (GR-55102)</span>
                  <span style="color: #059669; font-weight: 600;">✓ 50 Units Received at Dock</span>
                </div>
              </div>

              <!-- Action Bar -->
              <div style="margin-top: 14px; display: flex; gap: 8px;">
                <button style="background: #059669; color: #ffffff; border: none; padding: 6px 12px; border-radius: 4px; font-size: 11px; font-weight: 600; cursor: default;">Post to ERP Ledger</button>
                <button style="background: #f1f5f9; color: #475569; border: 1px solid #cbd5e1; padding: 6px 12px; border-radius: 4px; font-size: 11px; cursor: default;">Route to AP Lead</button>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    // 2. Legal Contract Intelligence Interface Mockup
    if (useCaseId.includes("leg") || useCaseId.includes("contract")) {
      return `
        ${disclaimerBanner}
        <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); font-family: Inter, sans-serif; overflow: hidden;">
          <div style="background: #1e1b4b; color: #ffffff; padding: 10px 16px; display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <span style="background: #7c3aed; color: #fff; font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 4px;">LEGAL INTELLIGENCE</span>
              <span style="font-size: 12px; font-weight: 600;">Vendor MSA Deviation Reviewer (Human-In-The-Loop)</span>
            </div>
            <span style="background: #f59e0b; color: #fff; font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 4px;">MANDATORY ATTORNEY SIGN-OFF</span>
          </div>
          <div style="padding: 16px; background: #f8fafc; display: grid; grid-template-columns: 1.2fr 1fr; gap: 14px;">
            <div style="background: #ffffff; border: 1px solid #cbd5e1; border-radius: 6px; padding: 12px; font-size: 11px; line-height: 1.6;">
              <div style="font-weight: 700; color: #0f172a; margin-bottom: 6px;">Vendor Draft: Clause 14.2 (Limitation of Liability)</div>
              <p style="background: #fee2e2; padding: 8px; border-left: 3px solid #ef4444; border-radius: 3px; color: #7f1d1d;">
                "In no event shall Vendor be liable for any indirect, punitive, or consequential damages, and total liability shall be capped at $5,000 USD regardless of breach severity."
              </p>
              <div style="color: #b91c1c; font-weight: 600; font-size: 10px; margin-top: 4px;">⚠ HIGH RISK: Deviates from corporate standard playbook ($5k cap vs 12 months fees paid).</div>
            </div>
            <div style="background: #ffffff; border: 1px solid #cbd5e1; border-radius: 6px; padding: 12px; font-size: 11px;">
              <div style="font-weight: 700; color: #0f172a; margin-bottom: 6px;">Recommended Redline (Playbook Fallback #2)</div>
              <p style="background: #f0fdf4; padding: 8px; border-left: 3px solid #22c55e; border-radius: 3px; color: #14532d;">
                "Except for breaches of confidentiality or gross negligence, Vendor liability shall be capped at twelve (12) months of fees paid under this Agreement."
              </p>
              <div style="margin-top: 10px; display: flex; gap: 8px;">
                <button style="background: #2563eb; color: #fff; border: none; padding: 5px 10px; border-radius: 4px; font-size: 10px; font-weight: 600;">Apply Redline to Word</button>
                <button style="background: #f1f5f9; color: #334155; border: 1px solid #cbd5e1; padding: 5px 10px; border-radius: 4px; font-size: 10px;">Edit Manually</button>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    // 3. IT Service Desk Triage & Password Reset Mockup (Default)
    return `
      ${disclaimerBanner}
      <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); font-family: Inter, sans-serif; overflow: hidden;">
        <div style="background: #0f172a; color: #ffffff; padding: 10px 16px; display: flex; justify-content: space-between; align-items: center;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="background: #0284c7; color: #fff; font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 4px;">SERVICE HUB</span>
            <span style="font-size: 12px; font-weight: 600;">IT Service Desk Automated Self-Service & Ticket Deflection</span>
          </div>
          <span style="background: #059669; color: #fff; font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 4px;">100% AUTOMATED SSPR</span>
        </div>
        <div style="padding: 16px; background: #f8fafc; display: flex; flex-direction: column; gap: 10px; font-size: 11px;">
          <div style="background: #ffffff; border: 1px solid #cbd5e1; border-radius: 6px; padding: 12px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
              <span style="font-weight: 700; color: #0f172a;">Inbound Request: Self-Service Password Reset (SSPR)</span>
              <span style="color: #059669; font-weight: 600;">Status: Completed (&lt; 45s)</span>
            </div>
            <div style="color: #475569;">Requester: john.doe@enterprise.com | Department: Commercial Sales | Authenticator: Microsoft Authenticator FIDO2</div>
            <div style="margin-top: 8px; padding: 6px 10px; background: #ecfdf5; border-radius: 4px; color: #065f46; font-size: 10px;">
              ✓ Cryptographic identity verified -> Entra ID Graph API executed reset -> ServiceNow ticket #INC-88910 auto-closed. Zero human helpdesk labor required.
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

module.exports = new VisualAdapter();
