/**
 * Enterprise AI Solution Generator - Application Controller (app.js)
 * Manages state, routing, localization, theme toggle, role views, form wizard, file uploader, and audit trail.
 */

// Global State Object
const AppState = {
  currentView: "dashboard",
  theme: "dark",
  language: "en",
  activeRole: "Architect",
  blueprints: [],
  activeBlueprint: null,
  uploadedFiles: [],
  auditLogs: []
};

// Localization resources (i18n)
const Localization = {
  en: {
    menu_dashboard: "Dashboard",
    menu_discovery: "Guided Discovery",
    menu_upload: "Document Upload",
    menu_blueprint: "Active Blueprint",
    menu_saved: "Saved Blueprints",
    menu_audit: "Audit Trail",
    header_role: "View As:",
    dash_total_cases: "Total Use Cases Discovered",
    dash_avg_readiness: "Avg AI Readiness",
    dash_avg_complexity: "Avg Complexity",
    dash_projected_roi: "Projected Savings",
    dash_welcome_title: "Discover Enterprise AI Use Cases",
    dash_welcome_desc: "Accelerate your organization's AI adoption. Complete a structured business assessment or upload workflow documents (SOPs, contract templates, system logs) to dynamically generate production-ready AI solution blueprints complete with target architectures and Gantt roadmaps.",
    dash_btn_guided: "Start Guided Form",
    dash_btn_upload: "Upload Documents",
    dash_dept_dist: "Department Distribution",
    dash_recent_blueprints: "Recent Discovered Blueprints",
    table_department: "Department",
    table_use_case: "Use Case Recommendation",
    table_roi: "Est. Annual Savings",
    table_complexity: "Complexity",
    table_readiness: "AI Readiness",
    table_date: "Generated Date",
    table_actions: "Actions",
    table_timestamp: "Timestamp",
    table_user: "User Role",
    table_action: "Action Event",
    table_target: "Target Asset",
    table_status: "Status",
    wiz_step_1: "Context",
    wiz_step_2: "Process",
    wiz_step_3: "Systems",
    wiz_step_4: "Governance",
    wiz_step1_title: "1. Organization & Business Context",
    wiz_step2_title: "2. Problem & Process Boundaries",
    wiz_step3_title: "3. Technology Infrastructure & Data Assets",
    wiz_step4_title: "4. Governance, Timelines, & Constraints",
    form_company_name: "Company Name",
    form_industry: "Industry Sector",
    form_company_size: "Company Size (Employees)",
    form_revenue: "Annual Revenue Range",
    form_department: "Department",
    form_domain: "Domain / Function Area",
    form_problem_statement: "Current Problem Statement",
    form_current_process: "Current As-Is Process Flow",
    form_desired_outcome: "Expected Desired Outcome",
    form_systems: "Existing Business Systems (Select all that apply)",
    form_pain_points: "Active Pain Points",
    form_data: "Available Core Data Formats",
    form_budget: "Target Implementation Budget",
    form_timeline: "Required Project Timeline",
    form_regulations: "Regulatory Standards & Compliance Frameworks",
    form_tech_stack: "Preferred Tech Stack (Optional)",
    form_roi_goals: "Expected ROI Target (Optional)",
    form_notes: "Additional Enterprise Notes",
    btn_back: "Back",
    btn_next: "Next",
    btn_cancel: "Cancel",
    upload_title: "Drop Enterprise Files",
    upload_desc: "Upload workflow documents, process maps, incident reports, SOPs, audit logs, or contracts. The AI Analysis Engine will parse file structures, perform OCR extraction, map entities, detect pain points, and output matching solution blueprints automatically.",
    upload_drag_text: "Drag & drop files here or click to browse",
    upload_parsing_console: "AI Extraction Pipeline Console",
    upload_btn_analyze: "Run AI Opportunity Scan",
    bp_meta_ind: "Industry:",
    bp_meta_date: "Generated:",
    bp_meta_timeline: "Project Timeline:",
    bp_btn_edit: "Edit Inputs",
    bp_btn_export: "Export Design",
    bp_gauge_readiness: "AI Readiness Score",
    bp_gauge_complexity: "Complexity Rating",
    bp_gauge_confidence: "Confidence Score",
    bp_roi_financials: "Estimated Financial ROI",
    bp_roi_invest: "Implementation Cost:",
    bp_roi_savings: "Annual Net Savings:",
    bp_roi_payback: "Payback Period:",
    bp_tab_summary: "1. Executive Summary",
    bp_tab_architecture: "2. Target Architecture",
    bp_tab_workflow: "3. Process Workflows",
    bp_tab_technical: "4. Tech Specifications",
    bp_tab_governance: "5. Governance & Risks",
    bp_tab_benchmarks: "6. Case Benchmarks",
    bp_sum_exec: "Executive Summary",
    bp_sum_problem: "Detailed Problem Statement",
    bp_sum_current: "Current State Assessment",
    bp_sum_systems: "Systems involved:",
    bp_sum_benefits: "Business Benefits",
    bp_arch_title: "Solution Target Architecture Diagram",
    bp_arch_desc: "Interactive end-to-end integration diagram. Click on any system component node (e.g. LLMs, vector database, or data source) to configure parameters, integration gateways, or vendor providers in real-time.",
    bp_flow_title: "Process Flow Optimization Map",
    bp_flow_desc: "Comparative process step view showing manual bottlenecks in the current state vs AI-enabled straight-through steps in the target design.",
    bp_flow_asis: "As-Is Process Workflow",
    bp_flow_tobe: "To-Be Optimized Workflow",
    bp_tech_data_req: "Data & Integration Requirements",
    bp_tech_sources: "Enterprise Data Sources",
    bp_tech_tools: "Target Technology Stack",
    bp_gov_roles: "Stakeholder Roles & Project Team",
    bp_gov_owners: "Business & Technical Owners:",
    bp_gov_team: "Recommended Project Delivery Team:",
    bp_gov_skills: "Required Core Technical Skillsets",
    bp_gov_risks: "Risk Mitigation Grid",
    bp_gov_compliance: "Regulatory Restrictions Mapped",
    bp_gov_roadmap: "Solution Implementation Gantt Roadmap",
    bp_bench_title: "Comparable Industry Benchmarks & Case Studies",
    bp_bench_desc: "Real-world deployment references from organizations in similar sectors, outlining key lessons and architectural guardrails.",
    audit_title: "Enterprise Compliance Audit Trail Logs",
    audit_desc: "Immutable logs tracking all blueprint modifications, exports, settings changes, and user accesses in compliance with SOC2 and internal control requirements.",
    export_modal_title: "Export Solution Design Blueprint",
    export_modal_desc: "Select target format to compile and export your solution blueprint. All exports include detailed target architectures, financial ROI breakdowns, and security mitigation matrices."
  },
  es: {
    menu_dashboard: "Tablero",
    menu_discovery: "Descubrimiento Guiado",
    menu_upload: "Carga de Documentos",
    menu_blueprint: "Plano Activo",
    menu_saved: "Planos Guardados",
    menu_audit: "Registro de Auditoría",
    header_role: "Ver como:",
    dash_total_cases: "Total de Casos Descubiertos",
    dash_avg_readiness: "Madurez IA Promedio",
    dash_avg_complexity: "Complejidad Promedio",
    dash_projected_roi: "Ahorros Proyectados",
    dash_welcome_title: "Descubrir Casos de Uso de IA Empresarial",
    dash_welcome_desc: "Acelere la adopción de IA en su organización. Complete una evaluación comercial estructurada o cargue documentos de flujo de trabajo para generar planos de soluciones de IA listos para producción.",
    dash_btn_guided: "Iniciar Formulario Guiado",
    dash_btn_upload: "Cargar Documentos",
    dash_dept_dist: "Distribución por Departamentos",
    dash_recent_blueprints: "Planos Descubiertos Recientes",
    table_department: "Departamento",
    table_use_case: "Recomendación de Caso",
    table_roi: "Ahorro Anual Estimado",
    table_complexity: "Complejidad",
    table_readiness: "Preparación IA",
    table_date: "Fecha de Generación",
    table_actions: "Acciones",
    table_timestamp: "Marca de Tiempo",
    table_user: "Rol de Usuario",
    table_action: "Evento de Acción",
    table_target: "Activo de Destino",
    table_status: "Estado",
    wiz_step_1: "Contexto",
    wiz_step_2: "Proceso",
    wiz_step_3: "Sistemas",
    wiz_step_4: "Gobernanza",
    wiz_step1_title: "1. Contexto de la Organización",
    wiz_step2_title: "2. Límites del Problema y Proceso",
    wiz_step3_title: "3. Infraestructura de TI y Datos",
    wiz_step4_title: "4. Gobernanza y Limitaciones",
    form_company_name: "Nombre de la Empresa",
    form_industry: "Sector Industrial",
    form_company_size: "Tamaño (Empleados)",
    form_revenue: "Rango de Ingresos Anuales",
    form_department: "Departamento",
    form_domain: "Área de Dominio / Función",
    form_problem_statement: "Declaración del Problema",
    form_current_process: "Flujo de Proceso As-Is",
    form_desired_outcome: "Resultado Esperado",
    form_systems: "Sistemas Existentes (Seleccione todos)",
    form_pain_points: "Puntos de Dolor Activos",
    form_data: "Formatos de Datos Disponibles",
    form_budget: "Presupuesto de Implementación",
    form_timeline: "Cronograma Requerido",
    form_regulations: "Estándares y Regulaciones",
    form_tech_stack: "Pila de Tecnología Preferida",
    form_roi_goals: "Objetivo de ROI Esperado",
    form_notes: "Notas Adicionales",
    btn_back: "Atrás",
    btn_next: "Siguiente",
    btn_cancel: "Cancelar",
    upload_title: "Arrastrar Archivos de la Empresa",
    upload_desc: "Cargue SOP, contratos, diagramas o registros. El motor de análisis de IA analizará estructuras, realizará OCR y extraerá entidades automáticamente.",
    upload_drag_text: "Arrastre los archivos aquí o haga clic para buscar",
    upload_parsing_console: "Consola de Extracción de IA",
    upload_btn_analyze: "Iniciar Escaneo de Oportunidades",
    bp_meta_ind: "Industria:",
    bp_meta_date: "Generado:",
    bp_meta_timeline: "Plazo de Proyecto:",
    bp_btn_edit: "Editar Datos",
    bp_btn_export: "Exportar Diseño",
    bp_gauge_readiness: "Puntuación de Preparación IA",
    bp_gauge_complexity: "Calificación de Complejidad",
    bp_gauge_confidence: "Puntuación de Confianza",
    bp_roi_financials: "ROI Financiero Estimado",
    bp_roi_invest: "Costo de Implementación:",
    bp_roi_savings: "Ahorro Neto Anual:",
    bp_roi_payback: "Periodo de Retorno:",
    bp_tab_summary: "1. Resumen Ejecutivo",
    bp_tab_architecture: "2. Arquitectura de Destino",
    bp_tab_workflow: "3. Flujos de Trabajo",
    bp_tab_technical: "4. Especificaciones",
    bp_tab_governance: "5. Gobernanza y Riesgos",
    bp_tab_benchmarks: "6. Casos de Referencia",
    bp_sum_exec: "Resumen Ejecutivo",
    bp_sum_problem: "Declaración del Problema",
    bp_sum_current: "Evaluación del Estado Actual",
    bp_sum_systems: "Sistemas involucrados:",
    bp_sum_benefits: "Beneficios Comerciales",
    bp_arch_title: "Diagrama de Arquitectura de la Solución",
    bp_arch_desc: "Haga clic en cualquier nodo para configurar parámetros e integraciones.",
    bp_flow_title: "Mapa de Optimización de Procesos",
    bp_flow_desc: "Comparación de cuellos de botella manuales actuales frente a flujos optimizados con IA.",
    bp_flow_asis: "Flujo de Proceso As-Is",
    bp_flow_tobe: "Flujo Optimizado con IA",
    bp_tech_data_req: "Requisitos de Datos e Integración",
    bp_tech_sources: "Fuentes de Datos Empresariales",
    bp_tech_tools: "Pila de Tecnologías de Destino",
    bp_gov_roles: "Roles y Equipo del Proyecto",
    bp_gov_owners: "Propietarios Comerciales y Técnicos:",
    bp_gov_team: "Equipo de Entrega de Proyecto:",
    bp_gov_skills: "Habilidades Técnicas Requeridas",
    bp_gov_risks: "Mitigación de Riesgos",
    bp_gov_compliance: "Regulaciones y Restricciones",
    bp_gov_roadmap: "Cronograma Gantt de Implementación",
    bp_bench_title: "Casos de Estudio de la Industria",
    bp_bench_desc: "Referencias reales de implementaciones similares y lecciones aprendidas.",
    audit_title: "Registro de Auditoría de Cumplimiento",
    audit_desc: "Registros inmutables que rastrean modificaciones de planos, exportaciones y accesos de usuarios.",
    export_modal_title: "Exportar Plano de Solución",
    export_modal_desc: "Seleccione el formato para descargar el diseño técnico y financiero."
  },
  de: {
    menu_dashboard: "Dashboard",
    menu_discovery: "Geführte Analyse",
    menu_upload: "Dokumenten-Upload",
    menu_blueprint: "Aktiver Entwurf",
    menu_saved: "Gespeicherte Entwürfe",
    menu_audit: "Audit-Trail",
    header_role: "Ansicht als:",
    dash_total_cases: "Erkannte Anwendungsfälle",
    dash_avg_readiness: "Durchschn. KI-Bereitschaft",
    dash_avg_complexity: "Durchschn. Komplexität",
    dash_projected_roi: "Projizierte Einsparungen",
    dash_welcome_title: "KI-Anwendungsfälle entdecken",
    dash_welcome_desc: "Beschleunigen Sie die KI-Einführung in Ihrem Unternehmen. Füllen Sie die strukturierte Bewertung aus oder laden Sie Dokumente hoch.",
    dash_btn_guided: "Geführtes Formular starten",
    dash_btn_upload: "Dokumente hochladen",
    dash_dept_dist: "Verteilung nach Abteilungen",
    dash_recent_blueprints: "Kürzlich erstellte Entwürfe",
    table_department: "Abteilung",
    table_use_case: "Empfohlener Anwendungsfall",
    table_roi: "Geschätzte Einsparungen",
    table_complexity: "Komplexität",
    table_readiness: "KI-Bereitschaft",
    table_date: "Erstellungsdatum",
    table_actions: "Aktionen",
    table_timestamp: "Zeitstempel",
    table_user: "Benutzerrolle",
    table_action: "Aktion",
    table_target: "Ziel-Asset",
    table_status: "Status",
    wiz_step_1: "Kontext",
    wiz_step_2: "Prozess",
    wiz_step_3: "Systeme",
    wiz_step_4: "Governance",
    wiz_step1_title: "1. Unternehmenskontext",
    wiz_step2_title: "2. Problem & Prozessgrenzen",
    wiz_step3_title: "3. IT-Infrastruktur & Daten",
    wiz_step4_title: "4. Governance & Einschränkungen",
    form_company_name: "Firmenname",
    form_industry: "Branche",
    form_company_size: "Mitarbeiteranzahl",
    form_revenue: "Jahresumsatz",
    form_department: "Abteilung",
    form_domain: "Fachbereich / Funktion",
    form_problem_statement: "Problemstellung",
    form_current_process: "Aktueller Prozess (As-Is)",
    form_desired_outcome: "Gewünschtes Ergebnis",
    form_systems: "Bestehende Systeme (Mehrfachauswahl)",
    form_pain_points: "Aktuelle Schwachstellen",
    form_data: "Verfügbare Datenformate",
    form_budget: "Implementierungsbudget",
    form_timeline: "Projektzeitplan",
    form_regulations: "Regulatorische Standards",
    form_tech_stack: "Bevorzugter Tech-Stack",
    form_roi_goals: "Erwarteter ROI",
    form_notes: "Zusätzliche Hinweise",
    btn_back: "Zurück",
    btn_next: "Weiter",
    btn_cancel: "Abbrechen",
    upload_title: "Dateien ablegen",
    upload_desc: "Laden Sie SOPs, Verträge oder Logs hoch. Die KI analysiert Strukturen und extrahiert Metriken.",
    upload_drag_text: "Dateien hier ablegen oder durchsuchen",
    upload_parsing_console: "KI-Extraktionskonsole",
    upload_btn_analyze: "KI-Scannen starten",
    bp_meta_ind: "Branche:",
    bp_meta_date: "Erstellt:",
    bp_meta_timeline: "Projektzeitraum:",
    bp_btn_edit: "Eingaben bearbeiten",
    bp_btn_export: "Entwurf exportieren",
    bp_gauge_readiness: "KI-Bereitschaftsindex",
    bp_gauge_complexity: "Komplexitätsbewertung",
    bp_gauge_confidence: "Konfidenzwert",
    bp_roi_financials: "Erwarteter ROI",
    bp_roi_invest: "Implementierungskosten:",
    bp_roi_savings: "Jährliche Einsparungen:",
    bp_roi_payback: "Amortisationszeit:",
    bp_tab_summary: "1. Management-Summary",
    bp_tab_architecture: "2. Ziel-Architektur",
    bp_tab_workflow: "3. Prozessabläufe",
    bp_tab_technical: "4. Spezifikationen",
    bp_tab_governance: "5. Governance & Risiken",
    bp_tab_benchmarks: "6. Benchmarks",
    bp_sum_exec: "Management-Summary",
    bp_sum_problem: "Detaillierte Problemstellung",
    bp_sum_current: "Aktueller Prozess",
    bp_sum_systems: "Beteiligte Systeme:",
    bp_sum_benefits: "Geschäftliche Vorteile",
    bp_arch_title: "Ziel-Architektur-Diagramm",
    bp_arch_desc: "Klicken Sie auf Komponenten, um Integrationsparameter zu ändern.",
    bp_flow_title: "Prozessoptimierungskarte",
    bp_flow_desc: "Vergleich von manuellen Engpässen zu KI-gestützten Abläufen.",
    bp_flow_asis: "As-Is-Prozess",
    bp_flow_tobe: "To-Be-Prozess (KI-optimiert)",
    bp_tech_data_req: "Daten- & Integrationsanforderungen",
    bp_tech_sources: "Unternehmensdatenquellen",
    bp_tech_tools: "Ziel-Tech-Stack",
    bp_gov_roles: "Stakeholder & Projektteam",
    bp_gov_owners: "Geschäftliche & Technische Owner:",
    bp_gov_team: "Projekt-Lieferteam:",
    bp_gov_skills: "Erforderliche technische Fähigkeiten",
    bp_gov_risks: "Risikomatrix",
    bp_gov_compliance: "Regulatorische Einschränkungen",
    bp_gov_roadmap: "Gantt-Projektzeitplan",
    bp_bench_title: "Branchen-Fallstudien",
    bp_bench_desc: "Praxisreferenzen und gewonnene Erkenntnisse.",
    audit_title: "Compliance-Audit-Trail",
    audit_desc: "Unveränderliche Protokolle zur SOC2-Konformität.",
    export_modal_title: "Lösungsentwurf exportieren",
    export_modal_desc: "Format für den technischen und finanziellen Bericht wählen."
  },
  ja: {
    menu_dashboard: "ダッシュボード",
    menu_discovery: "ガイド付き探索",
    menu_upload: "文書アップロード",
    menu_blueprint: "有効な設計書",
    menu_saved: "保存された設計書",
    menu_audit: "監査ログ",
    header_role: "権限表示:",
    dash_total_cases: "検出されたユースケース総数",
    dash_avg_readiness: "平均AI成熟度",
    dash_avg_complexity: "平均難易度",
    dash_projected_roi: "予測削減額",
    dash_welcome_title: "エンタープライズAIユースケース探索",
    dash_welcome_desc: "組織のAI導入を加速させます。アセスメントフォームに入力するか、業務プロセス文書をアップロードして、システム構成図やロードマップを含むAIソリューション設計書を自動生成します。",
    dash_btn_guided: "ガイド付きフォーム開始",
    dash_btn_upload: "文書をアップロード",
    dash_dept_dist: "部門別分布",
    dash_recent_blueprints: "最近作成された設計書",
    table_department: "部門",
    table_use_case: "推奨ユースケース",
    table_roi: "予測年間削減額",
    table_complexity: "難易度",
    table_readiness: "AI成熟度",
    table_date: "生成日",
    table_actions: "操作",
    table_timestamp: "タイムスタンプ",
    table_user: "役割",
    table_action: "実行イベント",
    table_target: "対象資産",
    table_status: "ステータス",
    wiz_step_1: "コンテキスト",
    wiz_step_2: "プロセス",
    wiz_step_3: "システム",
    wiz_step_4: "ガバナンス",
    wiz_step1_title: "1. 企業情報とビジネス要件",
    wiz_step2_title: "2. 課題とプロセス範囲",
    wiz_step3_title: "3. ITインフラとデータ資産",
    wiz_step4_title: "4. ガバナンスとスケジュール",
    form_company_name: "企業名",
    form_industry: "業界",
    form_company_size: "従業員数規模",
    form_revenue: "年間売上レンジ",
    form_department: "部門",
    form_domain: "対象ドメイン / 業務領域",
    form_problem_statement: "現状の課題ステートメント",
    form_current_process: "現状の業務プロセスフロー (As-Is)",
    form_desired_outcome: "期待する成果",
    form_systems: "既存のビジネスシステム (複数選択可)",
    form_pain_points: "主なペインポイント",
    form_data: "利用可能なデータ形式",
    form_budget: "目標導入予算",
    form_timeline: "必要なプロジェクト期間",
    form_regulations: "規制およびコンプライアンス枠組み",
    form_tech_stack: "優先テクノロジースタック (任意)",
    form_roi_goals: "期待するROI目標 (任意)",
    form_notes: "その他特記事項",
    btn_back: "戻る",
    btn_next: "次へ",
    btn_cancel: "キャンセル",
    upload_title: "文書のドラッグ＆ドロップ",
    upload_desc: "SOP、契約書、ログ等のファイルをアップロード。AI分析エンジンが自動的にOCRとテキスト解析を施し、適合するAIユースケースを提案します。",
    upload_drag_text: "ここにファイルをドロップするかクリックして選択してください",
    upload_parsing_console: "AIエンティティ解析コンソール",
    upload_btn_analyze: "AI機会検出を実行",
    bp_meta_ind: "業界:",
    bp_meta_date: "生成日:",
    bp_meta_timeline: "プロジェクト期間:",
    bp_btn_edit: "入力を編集",
    bp_btn_export: "設計書を書き出す",
    bp_gauge_readiness: "AI成熟度スコア",
    bp_gauge_complexity: "難易度評価",
    bp_gauge_confidence: "信頼度スコア",
    bp_roi_financials: "予測される投資ROI",
    bp_roi_invest: "導入コスト:",
    bp_roi_savings: "年間純削減額:",
    bp_roi_payback: "投資回収期間:",
    bp_tab_summary: "1. 要約",
    bp_tab_architecture: "2. ターゲット構成図",
    bp_tab_workflow: "3. 業務フロー",
    bp_tab_technical: "4. 技術仕様",
    bp_tab_governance: "5. ガバナンス＆リスク",
    bp_tab_benchmarks: "6. 事例ベンチマーク",
    bp_sum_exec: "要約",
    bp_sum_problem: "課題ステートメント",
    bp_sum_current: "現在のプロセスの評価",
    bp_sum_systems: "関連システム:",
    bp_sum_benefits: "もたらされるビジネス効果",
    bp_arch_title: "推奨ソリューションターゲットシステム構成図",
    bp_arch_desc: "構成図内のノード（LLM、ベクトルDB、API等）をクリックして、接続パラメータや製品を編集可能です。",
    bp_flow_title: "業務プロセス最適化マップ",
    bp_flow_desc: "現状の手作業ボトルネック（As-Is）と、AI最適化後（To-Be）の業務フローの比較。",
    bp_flow_asis: "現状の業務フロー (As-Is)",
    bp_flow_tobe: "AI最適化フロー (To-Be)",
    bp_tech_data_req: "データおよび連携要件",
    bp_tech_sources: "社内データソース",
    bp_tech_tools: "適用テクノロジースタック",
    bp_gov_roles: "関係者ロールおよびプロジェクト体制",
    bp_gov_owners: "ビジネス＆技術統括:",
    bp_gov_team: "推奨プロジェクト体制:",
    bp_gov_skills: "必要とされる技術スキルセット",
    bp_gov_risks: "リスク回避グリッド",
    bp_gov_compliance: "適用されるコンプライアンス要件",
    bp_gov_roadmap: "Gantt実装ロードマップ",
    bp_bench_title: "業界類似事例＆ベンチマーク",
    bp_bench_desc: "類似した業界や業務での成功事例と学んだ教訓のリスト。",
    audit_title: "コンプライアンス監査ログ",
    audit_desc: "SOC2監査および内部統制に準拠した、設計書の変更履歴、書き出し、アクセスの不変ログ。",
    export_modal_title: "設計書の書き出し",
    export_modal_desc: "書き出すファイル形式を選択して、構成図およびROI報告書をダウンロードしてください。"
  }
};

// Initialize event listeners when DOM loads
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initDropdowns();
  initWizard();
  initDocUpload();
  initViewSwitcher();
  initRoleSwitcher();
  initBlueprintTabs();
  initExportEngine();
  initOrchestrator();
  
  // Seed initial audit log and blueprints
  seedInitialData();
  
  // Render Dashboard
  renderDashboard();
});

// Seed some initial blueprints for empty state dashboard
function seedInitialData() {
  const seed = [
    {
      companyName: "Global Logistics Ltd",
      industry: "Logistics & Supply Chain",
      companySize: "1000-4999",
      revenue: "$100M - $500M",
      department: "Finance",
      domain: "Accounts Payable",
      systems: ["SAP", "Active Directory"],
      painPoints: ["manual_effort", "delays"],
      dataAvailable: ["Structured (Databases, CSV, SQL)", "Unstructured (PDF, Word Docs, Call Recordings, Images)"],
      timeline: "3 - 6 Months",
      regulations: ["GDPR (Europe Data Protection)"],
      date: "06/01/2026"
    },
    {
      companyName: "CareHealth Networks",
      industry: "Healthcare & Life Sciences",
      companySize: "5000-9999",
      revenue: "$500M - $1B",
      department: "Customer Service",
      domain: "Contact Center",
      systems: ["Salesforce", "Jira"],
      painPoints: ["manual_effort", "high_cost"],
      dataAvailable: ["Structured (Databases, CSV, SQL)", "Unstructured (PDF, Word Docs, Call Recordings, Images)"],
      timeline: "6 - 12 Months",
      regulations: ["HIPAA (Healthcare Portability & Accountability)"],
      date: "06/03/2026"
    }
  ];

  const stored = localStorage.getItem("enterprise_blueprints");
  if (stored) {
    AppState.blueprints = JSON.parse(stored);
  } else {
    // Generate full blueprints from seeds
    AppState.blueprints = seed.map(s => {
      const bp = generateBlueprint(s);
      bp.metadata.generatedAt = s.date; // keep seed dates
      return bp;
    });
    localStorage.setItem("enterprise_blueprints", JSON.stringify(AppState.blueprints));
  }

  // Seed audit logs
  const logsStored = localStorage.getItem("enterprise_audit_logs");
  if (logsStored) {
    AppState.auditLogs = JSON.parse(logsStored);
  } else {
    logAuditEvent("System Initialized", "Platform Core", "Success");
    logAuditEvent("Seed Data Ingested", "Database", "Success");
  }
}

// Write Audit Event Helper
function logAuditEvent(action, target, status = "Success") {
  const log = {
    timestamp: new Date().toLocaleString(),
    role: AppState.activeRole,
    action,
    target,
    status
  };
  AppState.auditLogs.unshift(log);
  if (AppState.auditLogs.length > 50) AppState.auditLogs.pop(); // Cap at 50 logs
  localStorage.setItem("enterprise_audit_logs", JSON.stringify(AppState.auditLogs));
  renderAuditLogs();
}

// Render Audit Logs
function renderAuditLogs() {
  const tbody = document.querySelector("#audit-logs-table tbody");
  if (!tbody) return;
  
  tbody.innerHTML = AppState.auditLogs.map(log => `
    <tr>
      <td>${log.timestamp}</td>
      <td><span class="badge ${getRoleBadgeClass(log.role)}">${log.role}</span></td>
      <td><strong>${log.action}</strong></td>
      <td><code>${log.target}</code></td>
      <td><span class="badge ${log.status === 'Success' ? 'badge-success' : 'badge-danger'}">${log.status}</span></td>
    </tr>
  `).join('');
}

function getRoleBadgeClass(role) {
  switch (role) {
    case "Architect": return "badge-primary";
    case "CISO": return "badge-danger";
    case "CFO": return "badge-success";
    case "Consultant": return "badge-warning";
    default: return "badge-secondary";
  }
}

// Dynamic Theme Handler
function initTheme() {
  const toggleBtn = document.getElementById("theme-toggle-btn");
  const icon = document.getElementById("theme-icon");
  
  const savedTheme = localStorage.getItem("app_theme") || "dark";
  AppState.theme = savedTheme;
  
  if (savedTheme === "light") {
    document.body.classList.add("light-mode");
    icon.className = "fa-solid fa-moon";
  }
  
  toggleBtn.addEventListener("click", () => {
    if (AppState.theme === "dark") {
      document.body.classList.add("light-mode");
      AppState.theme = "light";
      icon.className = "fa-solid fa-moon";
      logAuditEvent("Switched Theme", "Light Mode", "Success");
    } else {
      document.body.classList.remove("light-mode");
      AppState.theme = "dark";
      icon.className = "fa-solid fa-sun";
      logAuditEvent("Switched Theme", "Dark Mode", "Success");
    }
    localStorage.setItem("app_theme", AppState.theme);
  });
}

// Populate Taxonomy Dropdowns
function initDropdowns() {
  const indSelect = document.getElementById("industry-select");
  const deptSelect = document.getElementById("dept-select");
  const domSelect = document.getElementById("domain-select");
  const budgetSelect = document.getElementById("budget-select");
  const timelineSelect = document.getElementById("timeline-select");
  
  // Ingest from window.EnterpriseTaxonomy
  const tax = window.EnterpriseTaxonomy;
  if (!tax) return;

  // Industries
  indSelect.innerHTML = tax.industries.map(ind => `<option value="${ind}">${ind}</option>`).join('');
  
  // Budgets & Timelines
  budgetSelect.innerHTML = tax.budgets.map(b => `<option value="${b}">${b}</option>`).join('');
  timelineSelect.innerHTML = tax.timelines.map(t => `<option value="${t}">${t}</option>`).join('');

  // Departments & Domains
  const depts = Object.keys(tax.departments);
  deptSelect.innerHTML = depts.map(d => `<option value="${d}">${d}</option>`).join('');
  
  function updateDomains() {
    const activeDept = deptSelect.value;
    const domains = tax.departments[activeDept];
    domSelect.innerHTML = domains.map(dom => `<option value="${dom}">${dom}</option>`).join('') + `<option value="default">Other / Default Function</option>`;
  }
  
  deptSelect.addEventListener("change", updateDomains);
  updateDomains(); // initial load

  // Checkboxes for systems, pain points, data, and regulations
  const systemsBox = document.getElementById("systems-multiselect");
  systemsBox.innerHTML = tax.existingSystems.map(sys => `
    <label class="multiselect-item">
      <input type="checkbox" name="wizard-systems" value="${sys}"> ${sys}
    </label>
  `).join('');

  const painBox = document.getElementById("pain-points-multiselect");
  painBox.innerHTML = tax.painPoints.map(pain => `
    <label class="multiselect-item">
      <input type="checkbox" name="wizard-pain" value="${pain.id}"> ${pain.name}
    </label>
  `).join('');

  const dataBox = document.getElementById("data-multiselect");
  dataBox.innerHTML = tax.dataCategories.map(cat => `
    <label class="multiselect-item">
      <input type="checkbox" name="wizard-data" value="${cat}"> ${cat.split(' ')[0]}
    </label>
  `).join('');

  const regBox = document.getElementById("regulations-multiselect");
  regBox.innerHTML = tax.regulatoryConstraints.map(reg => `
    <label class="multiselect-item">
      <input type="checkbox" name="wizard-regulations" value="${reg}"> ${reg.split(' ')[0]}
    </label>
  `).join('');
}

// Router & Switcher
function initViewSwitcher() {
  const menuItems = document.querySelectorAll(".sidebar-menu .menu-item");
  
  menuItems.forEach(item => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const targetView = item.getAttribute("data-view");
      switchView(targetView);
    });
  });

  // Language selector
  const langSelect = document.getElementById("lang-select");
  langSelect.addEventListener("change", (e) => {
    AppState.language = e.target.value;
    translatePage();
    logAuditEvent("Changed Language", `Locale: ${AppState.language.toUpperCase()}`, "Success");
  });
}

function switchView(viewId) {
  // Toggle views
  const views = document.querySelectorAll(".page-view");
  views.forEach(v => v.classList.remove("active-view"));
  
  const targetView = document.getElementById(`${viewId}-view`);
  if (targetView) targetView.classList.add("active-view");

  // Toggle active menu class
  const menuItems = document.querySelectorAll(".sidebar-menu .menu-item");
  menuItems.forEach(item => {
    item.classList.remove("active");
    if (item.getAttribute("data-view") === viewId) {
      item.classList.add("active");
    }
  });

  AppState.currentView = viewId;
  
  // Set header title
  const titleEl = document.getElementById("current-view-title");
  const viewTitleKey = `menu_${viewId.replace('-viewer', '').replace('-wizard', '')}`;
  titleEl.innerHTML = Localization[AppState.language][viewTitleKey] || viewId.toUpperCase();
  
  // Special page renderings
  if (viewId === "dashboard") {
    renderDashboard();
  } else if (viewId === "saved-blueprints") {
    renderSavedGrid();
  } else if (viewId === "audit-trail") {
    renderAuditLogs();
  } else if (viewId === "orchestration") {
    renderOrchestration();
  }
}

// Role Switcher & Perspectives
function initRoleSwitcher() {
  const roleSelect = document.getElementById("role-select");
  const footerRole = document.getElementById("footer-role");
  const footerAvatar = document.getElementById("footer-avatar");
  
  roleSelect.addEventListener("change", (e) => {
    AppState.activeRole = e.target.value;
    footerRole.innerText = roleSelect.options[roleSelect.selectedIndex].text;
    
    // Customize avatar initials
    if (AppState.activeRole === "CFO") footerAvatar.innerText = "FB"; // Financial Buyer
    else if (AppState.activeRole === "CISO") footerAvatar.innerText = "SC"; // Security Officer
    else if (AppState.activeRole === "Consultant") footerAvatar.innerText = "MC"; // McKinsey Consultant
    else footerAvatar.innerText = "JD"; // John Doe Architect
    
    logAuditEvent("Changed Role Perspective", `Role: ${AppState.activeRole}`, "Success");
    
    // Re-apply perspective highlights on Active Blueprint
    if (AppState.activeBlueprint) {
      applyRolePerspective(AppState.activeBlueprint);
    }
  });
}

// CFO, CISO, Architect, and Consultant highlights
function applyRolePerspective(bp) {
  const role = AppState.activeRole;
  
  // Reset all borders/highlights first
  const activePane = document.querySelector(".tab-pane.active-pane");
  if (!activePane) return;
  
  // Remove existing alert boxes
  const existingAlert = document.getElementById("role-perspective-alert");
  if (existingAlert) existingAlert.remove();
  
  let alertHTML = "";
  
  if (role === "CFO") {
    alertHTML = `
      <div id="role-perspective-alert" class="card" style="border-left: 4px solid var(--success); background-color: rgba(16, 185, 129, 0.05); margin-bottom: 20px; animation: fadeIn 0.3s ease;">
        <h4 style="color: var(--success); font-size: 0.95rem; margin-bottom: 6px;"><i class="fa-solid fa-sack-dollar"></i> CFO Financial Perspective Highlight</h4>
        <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.4;">
          Priority financial analysis enabled. The estimated annual savings of <strong>${bp.roi.savings}</strong> provides a payback period of <strong>${bp.roi.payback}</strong> against an implementation threshold of <strong>${bp.roi.investment}</strong>.
        </p>
      </div>`;
  } else if (role === "CISO") {
    alertHTML = `
      <div id="role-perspective-alert" class="card" style="border-left: 4px solid var(--danger); background-color: rgba(239, 68, 68, 0.05); margin-bottom: 20px; animation: fadeIn 0.3s ease;">
        <h4 style="color: var(--danger); font-size: 0.95rem; margin-bottom: 6px;"><i class="fa-solid fa-shield-halved"></i> CISO Information Security Alert</h4>
        <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.4;">
          Security boundaries highlighted. Data compliance maps to <strong>${bp.regulations.join(', ') || 'Standard Controls'}</strong>. Risk assessments require prompt security gates at ingestion layers.
        </p>
      </div>`;
  } else if (role === "Consultant") {
    alertHTML = `
      <div id="role-perspective-alert" class="card" style="border-left: 4px solid var(--warning); background-color: rgba(245, 158, 11, 0.05); margin-bottom: 20px; animation: fadeIn 0.3s ease;">
        <h4 style="color: var(--warning); font-size: 0.95rem; margin-bottom: 6px;"><i class="fa-solid fa-chess-queen"></i> Business Consultant Strategic Insight</h4>
        <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.4;">
          Core metrics mapping. The business case addresses <strong>${bp.currentStateAssessment.painPointsList.join(', ')}</strong>. Expected success KPIs: <strong>${bp.businessBenefits[0]}</strong>.
        </p>
      </div>`;
  }
  
  if (alertHTML) {
    activePane.insertAdjacentHTML("afterbegin", alertHTML);
  }
}

// Form Wizard Logic
function initWizard() {
  let currentStep = 1;
  const nextBtn = document.getElementById("wiz-next-btn");
  const prevBtn = document.getElementById("wiz-prev-btn");
  
  nextBtn.addEventListener("click", () => {
    if (currentStep < 4) {
      currentStep++;
      updateStepView(currentStep);
    } else {
      // Final Submit
      submitGuidedForm();
    }
  });

  prevBtn.addEventListener("click", () => {
    if (currentStep > 1) {
      currentStep--;
      updateStepView(currentStep);
    }
  });

  function updateStepView(step) {
    currentStep = step;
    
    // Toggle form steps visibility
    const stepPanes = document.querySelectorAll(".wizard-content .step-pane");
    stepPanes.forEach(pane => pane.classList.remove("active-pane"));
    document.querySelector(`.wizard-content .step-pane[data-step="${step}"]`).classList.add("active-pane");

    // Toggle wizard indicators
    const stepIndicators = document.querySelectorAll(".wizard-steps .wizard-step");
    stepIndicators.forEach((ind, index) => {
      ind.classList.remove("active", "completed");
      if (index + 1 < step) {
        ind.classList.add("completed");
      } else if (index + 1 === step) {
        ind.classList.add("active");
      }
    });

    // Control buttons visibility/text
    prevBtn.style.visibility = step === 1 ? "hidden" : "visible";
    
    if (step === 4) {
      nextBtn.innerHTML = `<span>Generate Blueprint</span> <i class="fa-solid fa-wand-magic-sparkles"></i>`;
      nextBtn.className = "btn btn-gradient";
    } else {
      nextBtn.innerHTML = `<span>Next</span> <i class="fa-solid fa-arrow-right"></i>`;
      nextBtn.className = "btn btn-primary";
    }
  }
}

// Compile Guided form inputs and generate Solution
function submitGuidedForm() {
  const compName = document.getElementById("company-name").value.trim() || "Enterprise Client";
  const industry = document.getElementById("industry-select").value;
  const size = document.getElementById("company-size").value;
  const rev = document.getElementById("annual-revenue").value;
  const dept = document.getElementById("dept-select").value;
  const dom = document.getElementById("domain-select").value;
  
  const problem = document.getElementById("problem-statement").value.trim();
  const process = document.getElementById("current-process").value.trim();
  const outcome = document.getElementById("desired-outcome").value.trim();
  
  const systems = Array.from(document.querySelectorAll("input[name='wizard-systems']:checked")).map(el => el.value);
  const painPoints = Array.from(document.querySelectorAll("input[name='wizard-pain']:checked")).map(el => el.value);
  const data = Array.from(document.querySelectorAll("input[name='wizard-data']:checked")).map(el => el.value);
  const regulations = Array.from(document.querySelectorAll("input[name='wizard-regulations']:checked")).map(el => el.value);
  
  const budget = document.getElementById("budget-select").value;
  const timeline = document.getElementById("timeline-select").value;
  
  const preferredTechStack = document.getElementById("tech-stack-input").value.trim();
  const roiGoals = document.getElementById("roi-goals").value.trim();
  const additionalNotes = document.getElementById("additional-notes").value.trim();

  const inputData = {
    companyName: compName,
    industry,
    companySize: size,
    revenue: rev,
    department: dept,
    domain: dom,
    problemStatement: problem,
    currentProcess: process,
    desiredOutcome: outcome,
    systems,
    painPoints,
    dataAvailable: data,
    budget,
    timeline,
    regulations,
    preferredTechStack,
    roiGoals,
    additionalNotes
  };

  // Run generation through Agent Collaboration Pipeline animation
  runAgentPipelineAnimation(inputData, (blueprint) => {
    // Save to list
    AppState.blueprints.unshift(blueprint);
    localStorage.setItem("enterprise_blueprints", JSON.stringify(AppState.blueprints));
    
    logAuditEvent(`Generated Use Case Solution`, `${blueprint.metadata.department} - ${blueprint.title}`, "Success");
    
    // Display active blueprint
    openBlueprint(blueprint);
  });
}

// Document Upload Features
function initDocUpload() {
  const dropzone = document.getElementById("document-dropzone");
  const fileInput = document.getElementById("file-input-raw");
  const bulkBtn = document.getElementById("trigger-bulk-discovery");
  
  dropzone.addEventListener("click", () => fileInput.click());
  
  dropzone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropzone.classList.add("dragover");
  });

  dropzone.addEventListener("dragleave", () => {
    dropzone.classList.remove("dragover");
  });

  dropzone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropzone.classList.remove("dragover");
    handleFiles(e.dataTransfer.files);
  });

  fileInput.addEventListener("change", (e) => {
    handleFiles(e.target.files);
  });

  function handleFiles(files) {
    if (files.length === 0) return;
    
    Array.from(files).forEach(file => {
      AppState.uploadedFiles.push(file);
      renderFileItem(file);
      simulateConsoleScan(file.name);
    });

    bulkBtn.removeAttribute("disabled");
  }

  function renderFileItem(file) {
    const list = document.getElementById("uploaded-files-list");
    const id = "file-" + Math.random().toString(36).substr(2, 9);
    
    list.insertAdjacentHTML("beforeend", `
      <div class="file-item" id="${id}">
        <div class="file-details">
          <i class="fa-solid fa-file-invoice file-icon"></i>
          <div>
            <div style="font-size: 0.88rem; font-weight: 600;">${file.name}</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">${(file.size / 1024).toFixed(1)} KB</div>
          </div>
        </div>
        <button class="control-btn" style="border: none;" onclick="deleteFile('${id}')">
          <i class="fa-solid fa-trash-can" style="color: var(--danger);"></i>
        </button>
      </div>
    `);
  }

  bulkBtn.addEventListener("click", () => {
    runDocumentOpportunityScan();
  });
}

window.deleteFile = function(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
  AppState.uploadedFiles.pop();
  if (AppState.uploadedFiles.length === 0) {
    document.getElementById("trigger-bulk-discovery").setAttribute("disabled", "true");
  }
};

// Console logger simulation for OCR/NLP
function simulateConsoleScan(filename) {
  const consoleEl = document.getElementById("parsing-console-logs");
  if (!consoleEl) return;
  
  const stepDelay = 800;
  const steps = [
    `Ingested file "${filename}". Size: ${(Math.random() * 5 + 1).toFixed(1)}MB.`,
    `[OCR Engine] Performing dynamic layout scanning...`,
    `[NLP Engine] Extracting entities and organizational variables...`,
    `[Taxonomy Mapper] Domain classification complete: matching enterprise rules.`,
    `[Opportunity Finder] Proposed AI Solution detected. Ready for generation.`
  ];

  let current = 0;
  function printStep() {
    if (current < steps.length) {
      consoleEl.innerHTML += `<br><span style="color: var(--secondary);">&gt; ${steps[current]}</span>`;
      consoleEl.scrollTop = consoleEl.scrollHeight;
      current++;
      setTimeout(printStep, stepDelay);
    }
  }
  printStep();
  
  logAuditEvent("Ingested Document", filename, "Success");
}

// Run Opportunity Scan on Document
function runDocumentOpportunityScan() {
  if (AppState.uploadedFiles.length === 0) return;
  
  const consoleEl = document.getElementById("parsing-console-logs");
  consoleEl.innerHTML += `<br><span style="color: var(--success); font-weight: bold;">&gt; Initiating full business opportunity scan across uploaded assets...</span>`;
  consoleEl.scrollTop = consoleEl.scrollHeight;

  // Take the last file uploaded as target context
  const targetFile = AppState.uploadedFiles[AppState.uploadedFiles.length - 1];
  
  setTimeout(() => {
    // Generate mock text patterns depending on filename
    const simulatedDocText = `Document context for processing ${targetFile.name}. Outlining invoice delays, manual transcription audits, contract compliance GDPR risks, or IT outage incident tickets. systems used are SAP, Salesforce, workdays, ServiceNow.`;
    const extractedData = parseDocumentContent(simulatedDocText, targetFile.name);
    
    // compile blueprint through Agent Collaboration Pipeline animation
    runAgentPipelineAnimation(extractedData, (blueprint) => {
      // Save
      AppState.blueprints.unshift(blueprint);
      localStorage.setItem("enterprise_blueprints", JSON.stringify(AppState.blueprints));
      
      logAuditEvent(`Document Scan Generated Use Case`, `${blueprint.metadata.department} - ${blueprint.title}`, "Success");
      
      // Navigate and show blueprint
      openBlueprint(blueprint);
      
      // Clean uploads
      AppState.uploadedFiles = [];
      document.getElementById("uploaded-files-list").innerHTML = "";
      document.getElementById("trigger-bulk-discovery").setAttribute("disabled", "true");
    });
  }, 2000);
}

// Open and Render Selected Blueprint details
function openBlueprint(bp) {
  AppState.activeBlueprint = bp;
  
  // Show the Blueprint menu item in the sidebar
  const menuBp = document.getElementById("menu-blueprint-item");
  if (menuBp) menuBp.style.display = "block";
  
  // Switch view
  switchView("blueprint-viewer");

  // Render Blueprint Header details
  document.getElementById("bp-badge-dept").innerText = bp.metadata.department;
  document.getElementById("bp-badge-type").innerText = bp.aiType;
  document.getElementById("bp-title").innerText = bp.title;
  document.getElementById("bp-meta-industry").innerText = bp.metadata.industry;
  document.getElementById("bp-meta-date").innerText = bp.metadata.generatedAt;
  document.getElementById("bp-meta-timeline").innerText = bp.metadata.timeline;

  // Financial ROI details
  document.getElementById("bp-roi-investment").innerText = bp.roi.investment;
  document.getElementById("bp-roi-savings").innerText = bp.roi.savings;
  document.getElementById("bp-roi-payback").innerText = bp.roi.payback;

  // Render Score Gauges
  renderScoreGauge("gauge-readiness", bp.metadata.aiReadinessScore, 10, "var(--success)");
  renderScoreGauge("gauge-complexity", bp.metadata.complexityScore, 10, "var(--warning)");
  renderScoreGauge("gauge-confidence", bp.metadata.confidenceScore, 100, "var(--secondary)");
  
  document.getElementById("bp-gauge-readiness-desc").innerText = bp.metadata.aiReadinessScore >= 7 ? "High readiness framework." : "Requires technical preparation.";
  document.getElementById("bp-gauge-complexity-desc").innerText = bp.metadata.complexityScore >= 7 ? "Significant system architecture." : "Standard cloud integration.";
  document.getElementById("bp-gauge-confidence-desc").innerText = bp.metadata.confidenceScore >= 85 ? "High pattern correlation." : "Custom architecture check.";

  // Render Tab Content - Executive Summary
  document.getElementById("bp-sum-headline").innerText = bp.summary;
  document.getElementById("bp-sum-problem").innerText = bp.problemStatement;
  document.getElementById("bp-sum-current").innerText = bp.currentStateAssessment.description;
  
  // Systems chips
  const chipsContainer = document.getElementById("bp-sum-systems-chips");
  chipsContainer.innerHTML = bp.currentStateAssessment.existingSystems.map(sys => `<span class="chip"><i class="fa-solid fa-server" style="color: var(--secondary);"></i> ${sys}</span>`).join('');

  // Benefits list
  const benefitsList = document.getElementById("bp-sum-benefits-list");
  benefitsList.innerHTML = bp.businessBenefits.map(b => `<li>${b}</li>`).join('');

  // Tech specifications tab
  const dataTable = document.querySelector("#bp-tech-data-table tbody");
  dataTable.innerHTML = bp.dataRequirements.map(d => `
    <tr>
      <td><strong>${d.category}</strong></td>
      <td><span class="badge badge-primary">${d.type}</span></td>
      <td><code>${d.format}</code></td>
      <td>${d.purpose}</td>
    </tr>
  `).join('');

  const sourcesTable = document.querySelector("#bp-tech-sources-table tbody");
  sourcesTable.innerHTML = bp.dataSources.map(s => `
    <tr>
      <td><strong>${s.source}</strong></td>
      <td><span class="badge badge-success">${s.type}</span></td>
      <td>${s.desc}</td>
    </tr>
  `).join('');

  // Tech stack bullet items
  document.getElementById("bp-tech-ai-platforms").innerHTML = bp.techStack.aiPlatforms.map(i => `<li><i class="fa-solid fa-square-check" style="color: var(--secondary); margin-right: 6px;"></i> ${i}</li>`).join('');
  document.getElementById("bp-tech-llm-providers").innerHTML = bp.techStack.llmProviders.map(i => `<li><i class="fa-solid fa-robot" style="color: var(--accent); margin-right: 6px;"></i> ${i}</li>`).join('');
  document.getElementById("bp-tech-vector-db").innerHTML = bp.techStack.vectorDatabases.map(i => `<li><i class="fa-solid fa-database" style="color: var(--success); margin-right: 6px;"></i> ${i}</li>`).join('');
  document.getElementById("bp-tech-data-platforms").innerHTML = bp.techStack.dataPlatforms.map(i => `<li><i class="fa-solid fa-table-cells" style="color: var(--primary); margin-right: 6px;"></i> ${i}</li>`).join('');
  document.getElementById("bp-tech-cloud-platforms").innerHTML = bp.techStack.cloudPlatforms.map(i => `<li><i class="fa-solid fa-cloud" style="color: var(--warning); margin-right: 6px;"></i> ${i}</li>`).join('');
  document.getElementById("bp-tech-monitoring").innerHTML = bp.techStack.monitoringTools.map(i => `<li><i class="fa-solid fa-eye" style="color: var(--danger); margin-right: 6px;"></i> ${i}</li>`).join('');

  // Governance tab
  document.getElementById("bp-gov-stakeholders").innerHTML = bp.stakeholders.map(st => `<span class="chip"><i class="fa-solid fa-user-tie" style="color: var(--primary);"></i> ${st}</span>`).join('');
  document.getElementById("bp-gov-team-list").innerHTML = bp.teamStructure.map(t => `<li>${t}</li>`).join('');
  document.getElementById("bp-gov-skills-list").innerHTML = bp.skillsets.map(s => `<li>${s}</li>`).join('');
  
  document.getElementById("bp-risk-tech").innerText = bp.risks.technical;
  document.getElementById("bp-risk-ops").innerText = bp.risks.operational;
  document.getElementById("bp-risk-security").innerText = bp.risks.security;
  document.getElementById("bp-risk-compliance").innerText = bp.risks.compliance;

  document.getElementById("bp-gov-regulations-chips").innerHTML = bp.regulations.map(reg => `<span class="chip"><i class="fa-solid fa-scale-balanced" style="color: var(--danger);"></i> ${reg}</span>`).join('');

  // Sourcing & Benchmarks tab
  const benchmarksList = document.getElementById("bp-benchmarks-list");
  benchmarksList.innerHTML = bp.benchmarks.map(b => `
    <div class="card benchmark-card">
      <div class="benchmark-org">${b.org}</div>
      <p style="font-size: 0.88rem; line-height: 1.5; color: var(--text-secondary); margin-bottom: 8px;">${b.story}</p>
      <div style="font-size: 0.82rem; color: var(--text-primary);"><strong style="color: var(--warning);">Key Lesson:</strong> ${b.lessons}</div>
      <div class="benchmark-source"><i class="fa-solid fa-bookmark"></i> Citation: ${b.source}</div>
    </div>
  `).join('');

  // AI Consensus Tab Pane
  if (bp.consensus) {
    document.getElementById("bp-consensus-score").innerText = (bp.consensus.confidenceScore || 90) + "%";
    document.getElementById("bp-consensus-level").innerText = (bp.consensus.consensusLevel || "HIGH").toUpperCase();
    document.getElementById("bp-consensus-sources").innerText = bp.consensus.sourcesChecked || 5;

    const agreementsList = document.getElementById("bp-consensus-agreements");
    if (agreementsList) {
      agreementsList.innerHTML = bp.consensus.agreements.map(a => `<li>${a}</li>`).join('');
    }

    const disagreementsList = document.getElementById("bp-consensus-disagreements");
    if (disagreementsList) {
      disagreementsList.innerHTML = bp.consensus.disagreements.map(d => `<li>${d}</li>`).join('');
    }

    const draftsTable = document.querySelector("#bp-consensus-drafts-table tbody");
    if (draftsTable && bp.consensus.drafts) {
      draftsTable.innerHTML = bp.consensus.drafts.map(draft => `
        <tr>
          <td><strong>${draft.role}</strong></td>
          <td style="font-size: 0.82rem; color: var(--text-secondary);">${draft.openai}</td>
          <td style="font-size: 0.82rem; color: var(--text-secondary);">${draft.anthropic}</td>
          <td style="font-size: 0.82rem; color: var(--text-secondary);">${draft.google}</td>
          <td><span class="badge badge-success" style="font-size: 0.72rem; padding: 4px 6px;">${draft.consensus.length > 50 ? draft.consensus.slice(0, 47) + '...' : draft.consensus}</span></td>
        </tr>
      `).join('');
    }
  }

  // Solution Explainability & Logic
  if (bp.explainability) {
    document.getElementById("bp-explain-why").innerText = bp.explainability.whyThisRecommendation;

    const explainModels = document.getElementById("bp-explain-models");
    if (explainModels) {
      explainModels.innerHTML = bp.explainability.contributingModels.map(m => `
        <span class="chip" style="margin: 4px;"><i class="fa-solid fa-robot" style="color: var(--accent);"></i> ${m.name} (${m.weight})</span>
      `).join('');
    }

    const explainSources = document.getElementById("bp-explain-sources");
    if (explainSources) {
      explainSources.innerHTML = bp.explainability.sourcesUsed.map(s => `
        <span class="chip" style="margin: 4px;"><i class="fa-solid fa-bookmark" style="color: var(--secondary);"></i> ${s}</span>
      `).join('');
    }

    const assumptionsList = document.getElementById("bp-explain-assumptions");
    if (assumptionsList) {
      assumptionsList.innerHTML = bp.explainability.assumptions.map(a => `<li>${a}</li>`).join('');
    }

    const alternativesList = document.getElementById("bp-explain-alternatives");
    if (alternativesList) {
      alternativesList.innerHTML = bp.explainability.alternatives.map(a => `<li>${a}</li>`).join('');
    }
  }

  // Interactive flowcharts & processes rendering
  renderTargetArchitecture(bp);
  renderProcessComparison(bp);
  renderRoadmapGantt(bp);
  
  // Re-apply specific role highlights
  applyRolePerspective(bp);

  // Edit Inputs listener redirection
  document.getElementById("bp-edit-inputs-btn").onclick = () => {
    switchView("guided-wizard");
    // Pre-populate problem/processes
    document.getElementById("company-name").value = bp.metadata.companyName || "";
    document.getElementById("problem-statement").value = bp.problemStatement || "";
    document.getElementById("current-process").value = bp.currentStateAssessment.description || "";
    document.getElementById("desired-outcome").value = bp.metadata.desiredOutcome || "";
    document.getElementById("tech-stack-input").value = bp.metadata.preferredTechStack || "";
    document.getElementById("roi-goals").value = bp.metadata.roiGoals || "";
    document.getElementById("additional-notes").value = bp.metadata.additionalNotes || "";
    logAuditEvent("Clicked Edit Blueprint Inputs", bp.title, "Success");
  };

  // Initialize Presentation Slides
  AppState.currentSlideIndex = 0;
  initSlideDeckControls();
  renderSlidePreview();
}

// Blueprint Tab Swapper
function initBlueprintTabs() {
  const tabs = document.querySelectorAll(".blueprint-tabs .blueprint-tab");
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      // Toggle active class
      tabs.forEach(t => t.classList.remove("active-tab"));
      tab.classList.add("active-tab");

      // Toggle active pane
      const targetPane = tab.getAttribute("data-tab");
      const panes = document.querySelectorAll(".blueprint-panes .tab-pane");
      panes.forEach(pane => {
        pane.classList.remove("active-pane");
        if (pane.getAttribute("data-tab") === targetPane) {
          pane.classList.add("active-pane");
        }
      });
      
      // Re-trigger role perspective when tabs switch
      if (AppState.activeBlueprint) {
        applyRolePerspective(AppState.activeBlueprint);
      }
    });
  });
}

// Render Dashboard Details
function renderDashboard() {
  // Aggregate statistics
  const total = AppState.blueprints.length;
  document.getElementById("stat-total-cases").innerText = total;

  if (total > 0) {
    const avgReadiness = (AppState.blueprints.reduce((sum, b) => sum + b.metadata.aiReadinessScore, 0) / total).toFixed(1);
    const avgComplexity = (AppState.blueprints.reduce((sum, b) => sum + b.metadata.complexityScore, 0) / total).toFixed(1);
    const totalSavings = AppState.blueprints.reduce((sum, b) => {
      const numericSavings = parseInt(b.roi.savings.replace(/[^0-9]/g, '')) || 0;
      return sum + numericSavings;
    }, 0);

    document.getElementById("stat-avg-readiness").innerText = `${avgReadiness} / 10`;
    document.getElementById("stat-avg-complexity").innerText = `${avgComplexity} / 10`;
    document.getElementById("stat-projected-roi").innerText = `$${(totalSavings / 1000000).toFixed(2)}M`;
  } else {
    document.getElementById("stat-avg-readiness").innerText = "0 / 10";
    document.getElementById("stat-avg-complexity").innerText = "0 / 10";
    document.getElementById("stat-projected-roi").innerText = "$0.00M";
  }

  // Render recent blueprints table
  const tbody = document.querySelector("#recent-blueprints-table tbody");
  if (AppState.blueprints.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-secondary);">No blueprints discovered yet. Launch guided form or upload documents!</td></tr>`;
  } else {
    tbody.innerHTML = AppState.blueprints.slice(0, 5).map(bp => `
      <tr>
        <td><span class="badge badge-primary">${bp.metadata.department}</span></td>
        <td><strong>${bp.title}</strong><br><span style="font-size: 0.75rem; color: var(--text-secondary);">${bp.recommendedSolution.aiType}</span></td>
        <td style="color: var(--success); font-weight: bold;">${bp.roi.savings}</td>
        <td><span class="badge badge-warning">Score: ${bp.metadata.complexityScore}</span></td>
        <td><span class="badge badge-success">Score: ${bp.metadata.aiReadinessScore}</span></td>
        <td>${bp.metadata.generatedAt}</td>
        <td>
          <div style="display: flex; gap: 8px;">
            <button class="control-btn" style="width: 32px; height: 32px; border-radius: 6px;" title="View Blueprint" onclick="viewSpecificBlueprint('${bp.title}')">
              <i class="fa-solid fa-folder-open" style="font-size: 0.8rem; color: var(--secondary);"></i>
            </button>
            <button class="control-btn" style="width: 32px; height: 32px; border-radius: 6px;" title="Delete Blueprint" onclick="deleteBlueprint('${bp.title}')">
              <i class="fa-solid fa-trash-can" style="font-size: 0.8rem; color: var(--danger);"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  // Render Department distribution progress bars
  const deptContainer = document.getElementById("dept-chart-container");
  const deptsCounts = AppState.blueprints.reduce((acc, bp) => {
    acc[bp.metadata.department] = (acc[bp.metadata.department] || 0) + 1;
    return acc;
  }, {});

  const totalCases = Math.max(...Object.values(deptsCounts), 1);
  const deptsList = ["IT", "Human Resources", "Finance", "Legal", "Payroll", "Procurement", "Sales", "Marketing", "Customer Service", "Operations", "Risk & Compliance"];

  deptContainer.innerHTML = deptsList.map(dept => {
    const count = deptsCounts[dept] || 0;
    const pct = Math.round((count / totalCases) * 100);
    
    let barColor = "var(--primary)";
    if (dept === "Finance") barColor = "var(--success)";
    else if (dept === "IT") barColor = "var(--secondary)";
    else if (dept === "Risk & Compliance") barColor = "var(--danger)";
    else if (dept === "Customer Service") barColor = "var(--accent)";

    return `
      <div>
        <div style="display: flex; justify-content: space-between; font-size: 0.82rem; margin-bottom: 4px;">
          <span>${dept}</span>
          <strong>${count} Use Case${count !== 1 ? 's' : ''}</strong>
        </div>
        <div style="width: 100%; height: 8px; background-color: var(--border-color); border-radius: 4px; overflow: hidden;">
          <div style="width: ${pct}%; height: 100%; background-color: ${barColor}; transition: width 0.5s ease; border-radius: 4px;"></div>
        </div>
      </div>
    `;
  }).join('');
}

// Render Saved Blueprints Grid View
function renderSavedGrid() {
  const grid = document.getElementById("saved-blueprints-grid");
  
  if (AppState.blueprints.length === 0) {
    grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--text-secondary); padding: 40px;">No saved blueprints yet. Generate a design from the options on the dashboard.</div>`;
    return;
  }
  
  grid.innerHTML = AppState.blueprints.map(bp => `
    <div class="card" style="display: flex; flex-direction: column; justify-content: space-between; height: 100%;">
      <div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <span class="badge badge-primary">${bp.metadata.department}</span>
          <span style="font-size: 0.72rem; color: var(--text-muted);">${bp.metadata.generatedAt}</span>
        </div>
        <h4 style="font-size: 1.1rem; margin-bottom: 8px; color: var(--text-primary); font-family: var(--font-heading);">${bp.title}</h4>
        <p style="font-size: 0.8rem; color: var(--text-secondary); line-height: 1.4; margin-bottom: 16px;">${bp.summary.substring(0, 100)}...</p>
        
        <div style="display: flex; justify-content: space-between; border-top: 1px solid var(--border-color); padding-top: 12px; margin-top: 12px;">
          <div>
            <div style="font-size: 0.7rem; color: var(--text-muted);">Est. Savings</div>
            <strong style="color: var(--success); font-size: 0.88rem;">${bp.roi.savings}</strong>
          </div>
          <div>
            <div style="font-size: 0.7rem; color: var(--text-muted);">Readiness</div>
            <strong style="font-size: 0.88rem;">${bp.metadata.aiReadinessScore} / 10</strong>
          </div>
          <div>
            <div style="font-size: 0.7rem; color: var(--text-muted);">Complexity</div>
            <strong style="font-size: 0.88rem;">${bp.metadata.complexityScore} / 10</strong>
          </div>
        </div>
      </div>
      
      <div style="display: flex; justify-content: flex-end; gap: 8px; margin-top: 20px; border-top: 1px solid var(--border-color); padding-top: 12px;">
        <button class="btn btn-secondary" style="padding: 6px 12px; font-size: 0.8rem;" onclick="viewSpecificBlueprint('${bp.title}')">
          <i class="fa-solid fa-folder-open"></i> Open
        </button>
        <button class="btn btn-secondary" style="padding: 6px 12px; font-size: 0.8rem; color: var(--danger); border-color: rgba(239,68,68,0.2);" onclick="deleteBlueprint('${bp.title}')">
          <i class="fa-solid fa-trash-can"></i> Delete
        </button>
      </div>
    </div>
  `).join('');
}

window.viewSpecificBlueprint = function(title) {
  const bp = AppState.blueprints.find(b => b.title === title);
  if (bp) openBlueprint(bp);
};

window.deleteBlueprint = function(title) {
  if (confirm(`Are you sure you want to delete blueprint "${title}"?`)) {
    AppState.blueprints = AppState.blueprints.filter(b => b.title !== title);
    localStorage.setItem("enterprise_blueprints", JSON.stringify(AppState.blueprints));
    logAuditEvent("Deleted Blueprint", title, "Success");
    
    // Switch views or refresh
    if (AppState.activeBlueprint && AppState.activeBlueprint.title === title) {
      AppState.activeBlueprint = null;
      document.getElementById("menu-blueprint-item").style.display = "none";
      switchView("dashboard");
    } else {
      if (AppState.currentView === "dashboard") renderDashboard();
      else if (AppState.currentView === "saved-blueprints") renderSavedGrid();
    }
  }
};

// Export features
function initExportEngine() {
  const exportBtn = document.getElementById("bp-export-btn");
  exportBtn.addEventListener("click", () => {
    openModal("export-modal-overlay");
  });
}

window.openModal = function(id) {
  document.getElementById(id).classList.add("active");
  logAuditEvent("Opened Modal Dialog", id.split('-')[0].toUpperCase(), "Success");
};

window.closeModal = function(id) {
  document.getElementById(id).classList.remove("active");
};

window.triggerExport = function(format) {
  const spinner = document.getElementById("export-spinner-container");
  const statusText = document.getElementById("export-status-text");
  
  spinner.style.display = "flex";
  statusText.innerText = `Preparing ${format} document structure...`;

  const bp = AppState.activeBlueprint;
  if (!bp) return;

  if (format === "PPTX") {
    // Generate real PPTX slide deck!
    let pptx = new PptxGenJS();
    
    pptx.title = bp.title;
    pptx.subject = "AI Solution Design Blueprint";
    pptx.author = "Antigravity Solution Platform";
    pptx.company = bp.metadata.companyName;
    pptx.layout = "LAYOUT_16x9";
    
    const COLOR_BG = "0F172A";
    const COLOR_CARD = "1E293B";
    const COLOR_TEXT = "F8FAFC";
    const COLOR_MUTED = "94A3B8";
    const COLOR_PRIMARY = "6366F1";
    const COLOR_SECONDARY = "06B6D4";
    const COLOR_SUCCESS = "10B981";
    
    function createSlide(title, category = "SOLUTION DESIGN BLUEPRINT") {
      let slide = pptx.addSlide();
      slide.background = { fill: COLOR_BG };
      slide.addText(category, { x: 0.5, y: 0.4, w: 9, h: 0.3, fontSize: 10, color: COLOR_SECONDARY, bold: true, fontFace: "Outfit" });
      slide.addText(title, { x: 0.5, y: 0.7, w: 9, h: 0.5, fontSize: 24, color: COLOR_TEXT, bold: true, fontFace: "Outfit" });
      slide.addText(`Prepared for ${bp.metadata.companyName} | Confidential`, { x: 0.5, y: 7.1, w: 7, h: 0.3, fontSize: 9, color: COLOR_MUTED, fontFace: "Inter" });
      slide.addText(`Generated via Antigravity Enterprise Platform`, { x: 9.0, y: 7.1, w: 4, h: 0.3, fontSize: 9, color: COLOR_MUTED, align: "right", fontFace: "Inter" });
      slide.addShape(pptx.ShapeType.line, { x: 0.5, y: 1.3, w: 12.3, h: 0.02, line: { color: COLOR_PRIMARY, width: 2 } });
      return slide;
    }
    
    // Slide 1: Title Slide
    let cover = pptx.addSlide();
    cover.background = { fill: COLOR_BG };
    cover.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.33, h: 0.15, fill: { color: COLOR_PRIMARY } });
    cover.addText(bp.metadata.department.toUpperCase() + " AI SOLUTION BLUEPRINT", { x: 1.0, y: 2.2, w: 11.3, h: 0.4, fontSize: 12, color: COLOR_SECONDARY, bold: true, tracking: 1, fontFace: "Outfit" });
    cover.addText(bp.title, { x: 1.0, y: 2.7, w: 11.3, h: 1.5, fontSize: 44, color: COLOR_TEXT, bold: true, fontFace: "Outfit" });
    cover.addText(`A McKinsey/Gartner-Style Target Architecture and Feasibility Study`, { x: 1.0, y: 4.3, w: 11.3, h: 0.4, fontSize: 14, color: COLOR_MUTED, fontFace: "Inter", italic: true });
    cover.addText(`Client: ${bp.metadata.companyName}\nIndustry: ${bp.metadata.industry}\nPrepared on: ${bp.metadata.generatedAt}\nConfidence Level: ${bp.metadata.confidenceScore}%`, 
                  { x: 1.0, y: 5.3, w: 6.0, h: 1.2, fontSize: 11, color: COLOR_TEXT, fontFace: "Inter", lineSpacing: 4 });
    cover.addText(`Solution Type: ${bp.aiType}\nReady Score: ${bp.metadata.aiReadinessScore}/10\nComplexity Score: ${bp.metadata.complexityScore}/10\nEst. Savings: ${bp.roi.savings}`, 
                  { x: 7.0, y: 5.3, w: 5.0, h: 1.2, fontSize: 11, color: COLOR_TEXT, fontFace: "Inter", lineSpacing: 4 });

    // Slide 2: Executive Summary
    let s2 = createSlide("Executive Summary & Business Strategy", "SECTION 1: BUSINESS OPPORTUNITY");
    s2.addText(bp.summary, { x: 0.5, y: 1.6, w: 12.3, h: 0.8, fontSize: 15, color: COLOR_SECONDARY, italic: true, fontFace: "Inter" });
    s2.addShape(pptx.ShapeType.rect, { x: 0.5, y: 2.6, w: 12.3, h: 4.1, fill: { color: COLOR_CARD }, line: { color: "334155", width: 1 } });
    s2.addText("BUSINESS STRATEGY TARGETS", { x: 0.8, y: 2.8, w: 11.7, h: 0.4, fontSize: 12, color: COLOR_SECONDARY, bold: true, fontFace: "Outfit" });
    s2.addText(`• Goal Description: ${bp.summary}\n• Target Technology Stack: ${bp.techStack.llmProviders[0]} coupled with ${bp.techStack.vectorDatabases[0]} running in ${bp.techStack.cloudPlatforms[0]}.\n• Quantified Feasibility: Confidence rating of ${bp.metadata.confidenceScore}% indicates high system pattern matching.\n• Primary Stakeholder alignment includes: ${bp.stakeholders.join(', ')}.`,
                  { x: 0.8, y: 3.3, w: 11.7, h: 3.1, fontSize: 13, color: COLOR_TEXT, fontFace: "Inter", lineSpacing: 8 });

    // Slide 3: Business Problem & Current State
    let s3 = createSlide("Current State Assessment & Pain Points", "SECTION 1: BUSINESS OPPORTUNITY");
    s3.addShape(pptx.ShapeType.rect, { x: 0.5, y: 1.6, w: 5.9, h: 5.1, fill: { color: COLOR_CARD }, line: { color: "334155", width: 1 } });
    s3.addText("PRIMARY PROBLEM STATEMENT", { x: 0.8, y: 1.8, w: 5.3, h: 0.3, fontSize: 12, color: COLOR_PRIMARY, bold: true, fontFace: "Outfit" });
    s3.addText(bp.problemStatement, { x: 0.8, y: 2.2, w: 5.3, h: 4.2, fontSize: 12, color: COLOR_TEXT, fontFace: "Inter", lineSpacing: 5 });
    s3.addShape(pptx.ShapeType.rect, { x: 6.9, y: 1.6, w: 5.9, h: 5.1, fill: { color: COLOR_CARD }, line: { color: "334155", width: 1 } });
    s3.addText("OPERATIONAL PAIN POINTS", { x: 7.2, y: 1.8, w: 5.3, h: 0.3, fontSize: 12, color: COLOR_PRIMARY, bold: true, fontFace: "Outfit" });
    let painLines = bp.currentStateAssessment.painPointsList.map(p => `• ${p}`).join("\n");
    s3.addText(painLines, { x: 7.2, y: 2.2, w: 5.3, h: 1.8, fontSize: 12, color: COLOR_TEXT, fontFace: "Inter", lineSpacing: 6 });
    s3.addText("REGULATORY & DATA STANDARDS MAPPED", { x: 7.2, y: 4.2, w: 5.3, h: 0.3, fontSize: 12, color: COLOR_SECONDARY, bold: true, fontFace: "Outfit" });
    let regText = `• Regulations: ${bp.regulations.join(', ') || 'N/A'}\n• Data Available: ${bp.dataRequirements.map(d => d.category).slice(0, 2).join(', ')}`;
    s3.addText(regText, { x: 7.2, y: 4.6, w: 5.3, h: 1.8, fontSize: 12, color: COLOR_TEXT, fontFace: "Inter", lineSpacing: 6 });

    // Slide 4: Solution Overview
    let s4 = createSlide("Recommended AI Solution Design", "SECTION 2: ARCHITECTURE & TECHNOLOGY");
    s4.addShape(pptx.ShapeType.rect, { x: 0.5, y: 1.6, w: 12.3, h: 1.0, fill: { color: COLOR_PRIMARY }, opacity: 0.1, line: { color: COLOR_PRIMARY, width: 1 } });
    s4.addText(bp.recommendedSolution.headline, { x: 0.8, y: 1.7, w: 11.7, h: 0.3, fontSize: 14, color: COLOR_SECONDARY, bold: true, fontFace: "Outfit" });
    s4.addText(`AI Deployment Model: ${bp.aiType} Integration`, { x: 0.8, y: 2.0, w: 11.7, h: 0.5, fontSize: 12, color: COLOR_TEXT, italic: true, fontFace: "Inter" });
    s4.addText("CORE ARCHITECTURE CAPABILITIES", { x: 0.5, y: 2.9, w: 12.3, h: 0.4, fontSize: 13, color: COLOR_SECONDARY, bold: true, fontFace: "Outfit" });
    s4.addShape(pptx.ShapeType.rect, { x: 0.5, y: 3.4, w: 12.3, h: 3.3, fill: { color: COLOR_CARD }, line: { color: "334155", width: 1 } });
    s4.addText(bp.recommendedSolution.details, { x: 0.8, y: 3.6, w: 11.7, h: 2.9, fontSize: 12, color: COLOR_TEXT, fontFace: "Inter", lineSpacing: 8 });

    // Slide 5: Target Architecture Overview
    let s5 = createSlide("Architecture Integration Framework", "SECTION 2: ARCHITECTURE & TECHNOLOGY");
    s5.addText("The solution connects existing data reservoirs to ingestion, orchestration, and LLM processing layers:", { x: 0.5, y: 1.5, w: 12.3, h: 0.4, fontSize: 12, color: COLOR_TEXT, fontFace: "Inter" });
    s5.addShape(pptx.ShapeType.rect, { x: 0.5, y: 2.1, w: 3.9, h: 4.6, fill: { color: COLOR_CARD }, line: { color: "334155", width: 1 } });
    s5.addText("1. DATA SOURCES & INGEST", { x: 0.8, y: 2.3, w: 3.3, h: 0.3, fontSize: 12, color: COLOR_SECONDARY, bold: true, fontFace: "Outfit" });
    s5.addText(`• Legacy Core: ${bp.currentStateAssessment.existingSystems.join(', ')}\n• Data Formats: ${bp.dataRequirements.map(d=>d.category).join(', ')}\n• Gateway: Secure Webhook APIs with Token Masking and TLS 1.3 Transport.`, 
                  { x: 0.8, y: 2.7, w: 3.3, h: 3.8, fontSize: 11, color: COLOR_TEXT, fontFace: "Inter", lineSpacing: 6 });
    s5.addShape(pptx.ShapeType.rect, { x: 4.7, y: 2.1, w: 3.9, h: 4.6, fill: { color: COLOR_CARD }, line: { color: "334155", width: 1 } });
    s5.addText("2. PROCESSING & AI MODELS", { x: 5.0, y: 2.3, w: 3.3, h: 0.3, fontSize: 12, color: COLOR_PRIMARY, bold: true, fontFace: "Outfit" });
    s5.addText(`• Orchestration: LangChain Agentic Router in python environment.\n• Model: ${bp.techStack.llmProviders[0]}\n• Vector Store: ${bp.techStack.vectorDatabases[0]}\n• Cloud Platform: Host setup in ${bp.techStack.cloudPlatforms[0]}.`, 
                  { x: 5.0, y: 2.7, w: 3.3, h: 3.8, fontSize: 11, color: COLOR_TEXT, fontFace: "Inter", lineSpacing: 6 });
    s5.addShape(pptx.ShapeType.rect, { x: 8.9, y: 2.1, w: 3.9, h: 4.6, fill: { color: COLOR_CARD }, line: { color: "334155", width: 1 } });
    s5.addText("3. SECURITY & MONITORING", { x: 9.2, y: 2.3, w: 3.3, h: 0.3, fontSize: 12, color: COLOR_SUCCESS, bold: true, fontFace: "Outfit" });
    s5.addText(`• Key Storage: KMS Key Vaults\n• Observability: ${bp.techStack.monitoringTools[0]} log dashboard.\n• Security Guardrails: Strict input sanitization, dynamic prompt checking, and air-gapped system backups.`, 
                  { x: 9.2, y: 2.7, w: 3.3, h: 3.8, fontSize: 11, color: COLOR_TEXT, fontFace: "Inter", lineSpacing: 6 });

    // Slide 6: Business Benefits
    let s6 = createSlide("Project Value & Expected Benefits", "SECTION 3: GOVERNANCE & BUSINESS FEASIBILITY");
    s6.addShape(pptx.ShapeType.rect, { x: 0.5, y: 1.6, w: 5.9, h: 5.1, fill: { color: COLOR_CARD }, line: { color: "334155", width: 1 } });
    s6.addText("MEASURABLE SUCCESS METRICS", { x: 0.8, y: 1.8, w: 5.3, h: 0.3, fontSize: 12, color: COLOR_SECONDARY, bold: true, fontFace: "Outfit" });
    let metricsLines = bp.businessBenefits.map(m => `✔ ${m}`).join("\n\n");
    s6.addText(metricsLines, { x: 0.8, y: 2.3, w: 5.3, h: 4.1, fontSize: 13, color: COLOR_TEXT, fontFace: "Inter", lineSpacing: 4 });
    s6.addShape(pptx.ShapeType.rect, { x: 6.9, y: 1.6, w: 5.9, h: 5.1, fill: { color: COLOR_CARD }, line: { color: "334155", width: 1 } });
    s6.addText("COMPARABLE SUCCESS STORY REFERENCE", { x: 7.2, y: 1.8, w: 5.3, h: 0.3, fontSize: 12, color: COLOR_PRIMARY, bold: true, fontFace: "Outfit" });
    const benchmark = bp.benchmarks[0] || { org: "Global Enterprise", story: "Deployed similar AI solution.", source: "Accenture Case Study", lessons: "Incorporate human validation queue." };
    s6.addText(benchmark.org, { x: 7.2, y: 2.3, w: 5.3, h: 0.3, fontSize: 14, color: COLOR_SECONDARY, bold: true, fontFace: "Outfit" });
    s6.addText(`Case Outline: ${benchmark.story}`, { x: 7.2, y: 2.7, w: 5.3, h: 1.5, fontSize: 11, color: COLOR_TEXT, fontFace: "Inter", lineSpacing: 4 });
    s6.addText(`Lessons Learned: ${benchmark.lessons}`, { x: 7.2, y: 4.3, w: 5.3, h: 1.2, fontSize: 11, color: COLOR_TEXT, fontFace: "Inter", italic: true, lineSpacing: 4 });
    s6.addText(`Citation Source: ${benchmark.source}`, { x: 7.2, y: 5.8, w: 5.3, h: 0.5, fontSize: 10, color: COLOR_MUTED, fontFace: "Inter" });

    // Slide 7: Implementation Roadmap
    let s7 = createSlide("Implementation Timeline & Phased Roadmap", "SECTION 4: TIMELINE & INVESTMENT");
    s7.addText(`Phased Gantt execution framework spanning target duration of ${bp.metadata.timeline}.`, { x: 0.5, y: 1.5, w: 12.3, h: 0.3, fontSize: 12, color: COLOR_TEXT, fontFace: "Inter" });
    let colors = [COLOR_PRIMARY, COLOR_SECONDARY, COLOR_SUCCESS, COLOR_MUTED];
    bp.roadmap.phases.forEach((p, idx) => {
      let xOffset = 0.5 + (idx * 3.1);
      s7.addShape(pptx.ShapeType.rect, { x: xOffset, y: 2.1, w: 2.9, h: 4.6, fill: { color: COLOR_CARD }, line: { color: colors[idx], width: 1.5 } });
      s7.addText(p.phase.toUpperCase(), { x: xOffset + 0.2, y: 2.3, w: 2.5, h: 0.4, fontSize: 10, color: colors[idx], bold: true, fontFace: "Outfit" });
      s7.addText(`Duration: ${p.duration}`, { x: xOffset + 0.2, y: 2.8, w: 2.5, h: 0.3, fontSize: 10, color: COLOR_MUTED, italic: true, fontFace: "Inter" });
      let tasksText = p.tasks.map(t => `• ${t}`).join("\n");
      s7.addText(tasksText, { x: xOffset + 0.2, y: 3.2, w: 2.5, h: 3.3, fontSize: 10, color: COLOR_TEXT, fontFace: "Inter", lineSpacing: 5 });
    });

    // Slide 8: Risks & Compliance
    let s8 = createSlide("Risk Analysis & Compliance Alignment", "SECTION 3: GOVERNANCE & BUSINESS FEASIBILITY");
    let rGrid = [
      { t: "TECHNICAL RISK", val: bp.risks.technical, c: COLOR_PRIMARY },
      { t: "OPERATIONAL ADOPTION", val: bp.risks.operational, c: COLOR_SECONDARY },
      { t: "INFORMATION SECURITY", val: bp.risks.security, c: COLOR_SUCCESS },
      { t: "COMPLIANCE & AUDIT", val: bp.risks.compliance, c: "EF4444" }
    ];
    rGrid.forEach((r, idx) => {
      let xOffset = 0.5 + ((idx % 2) * 6.3);
      let yOffset = 1.6 + (Math.floor(idx / 2) * 2.6);
      s8.addShape(pptx.ShapeType.rect, { x: xOffset, y: yOffset, w: 6.0, h: 2.3, fill: { color: COLOR_CARD }, line: { color: r.c, width: 1 } });
      s8.addText(r.t, { x: xOffset + 0.3, y: yOffset + 0.2, w: 5.4, h: 0.3, fontSize: 11, color: r.c, bold: true, fontFace: "Outfit" });
      s8.addText(r.val, { x: xOffset + 0.3, y: yOffset + 0.6, w: 5.4, h: 1.5, fontSize: 10, color: COLOR_TEXT, fontFace: "Inter", lineSpacing: 4 });
    });

    // Slide 9: Investment & ROI
    let s9 = createSlide("Financial Assessment & ROI Forecast", "SECTION 4: TIMELINE & INVESTMENT");
    s9.addShape(pptx.ShapeType.rect, { x: 0.5, y: 1.6, w: 3.8, h: 3.0, fill: { color: COLOR_CARD }, line: { color: "334155", width: 1 } });
    s9.addText(bp.roi.investment, { x: 0.5, y: 2.2, w: 3.8, h: 0.6, fontSize: 36, color: COLOR_PRIMARY, bold: true, align: "center", fontFace: "Outfit" });
    s9.addText("ESTIMATED INVESTMENT\nImplementation & Setup Cost", { x: 0.5, y: 2.9, w: 3.8, h: 0.8, fontSize: 11, color: COLOR_MUTED, align: "center", fontFace: "Inter" });
    s9.addShape(pptx.ShapeType.rect, { x: 4.75, y: 1.6, w: 3.8, h: 3.0, fill: { color: COLOR_CARD }, line: { color: "334155", width: 1 } });
    s9.addText(bp.roi.savings, { x: 4.75, y: 2.2, w: 3.8, h: 0.6, fontSize: 36, color: COLOR_SUCCESS, bold: true, align: "center", fontFace: "Outfit" });
    s9.addText("ESTIMATED SAVINGS\nNet Annual Operating Efficiency", { x: 4.75, y: 2.9, w: 3.8, h: 0.8, fontSize: 11, color: COLOR_MUTED, align: "center", fontFace: "Inter" });
    s9.addShape(pptx.ShapeType.rect, { x: 9.0, y: 1.6, w: 3.8, h: 3.0, fill: { color: COLOR_CARD }, line: { color: "334155", width: 1 } });
    s9.addText(bp.roi.payback, { x: 9.0, y: 2.2, w: 3.8, h: 0.6, fontSize: 36, color: COLOR_SECONDARY, bold: true, align: "center", fontFace: "Outfit" });
    s9.addText("PAYBACK PERIOD\nAmortization Threshold (Months)", { x: 9.0, y: 2.9, w: 3.8, h: 0.8, fontSize: 11, color: COLOR_MUTED, align: "center", fontFace: "Inter" });
    s9.addShape(pptx.ShapeType.rect, { x: 0.5, y: 4.9, w: 12.3, h: 1.8, fill: { color: COLOR_CARD }, line: { color: "334155", width: 1 } });
    s9.addText("FINANCIAL COMPLIANCE ASSUMPTIONS & NOTES", { x: 0.8, y: 5.1, w: 11.7, h: 0.3, fontSize: 11, color: COLOR_SECONDARY, bold: true, fontFace: "Outfit" });
    // Slide 10: AI Agent Consensus & Multi-Agent Orchestration
    let s10 = createSlide("AI Agent Consensus & Orchestration", "SECTION 5: MULTI-MODEL ORCHESTRATION");
    s10.addShape(pptx.ShapeType.rect, { x: 0.5, y: 1.6, w: 3.8, h: 2.2, fill: { color: COLOR_CARD }, line: { color: COLOR_PRIMARY, width: 1 } });
    s10.addText(`${bp.consensus.confidenceScore}%`, { x: 0.5, y: 1.9, w: 3.8, h: 0.6, fontSize: 36, color: COLOR_SECONDARY, bold: true, align: "center", fontFace: "Outfit" });
    s10.addText("CONFIDENCE SCORE\nConsensus correlation rating", { x: 0.5, y: 2.6, w: 3.8, h: 0.8, fontSize: 11, color: COLOR_MUTED, align: "center", fontFace: "Inter" });

    s10.addShape(pptx.ShapeType.rect, { x: 4.75, y: 1.6, w: 3.8, h: 2.2, fill: { color: COLOR_CARD }, line: { color: COLOR_SUCCESS, width: 1 } });
    s10.addText(bp.consensus.consensusLevel.toUpperCase(), { x: 4.75, y: 1.9, w: 3.8, h: 0.6, fontSize: 36, color: COLOR_SUCCESS, bold: true, align: "center", fontFace: "Outfit" });
    s10.addText("AGREEMENT LEVEL\nMulti-Agent consensus voting status", { x: 4.75, y: 2.6, w: 3.8, h: 0.8, fontSize: 11, color: COLOR_MUTED, align: "center", fontFace: "Inter" });

    s10.addShape(pptx.ShapeType.rect, { x: 9.0, y: 1.6, w: 3.8, h: 2.2, fill: { color: COLOR_CARD }, line: { color: COLOR_PRIMARY, width: 1 } });
    s10.addText(`${bp.consensus.sourcesChecked}`, { x: 9.0, y: 1.9, w: 3.8, h: 0.6, fontSize: 36, color: COLOR_PRIMARY, bold: true, align: "center", fontFace: "Outfit" });
    s10.addText("RAG REFERENCES\nTrusted industry case studies checked", { x: 9.0, y: 2.6, w: 3.8, h: 0.8, fontSize: 11, color: COLOR_MUTED, align: "center", fontFace: "Inter" });

    // Model agreement list
    s10.addShape(pptx.ShapeType.rect, { x: 0.5, y: 4.1, w: 5.9, h: 2.6, fill: { color: COLOR_CARD }, line: { color: "334155", width: 1 } });
    s10.addText("MODEL AGREEMENT AREAS", { x: 0.8, y: 4.2, w: 5.3, h: 0.3, fontSize: 11, color: COLOR_SUCCESS, bold: true, fontFace: "Outfit" });
    let agreeText = bp.consensus.agreements.map(a => `• ${a.replace(/\*\*/g, '')}`).join("\n\n");
    s10.addText(agreeText, { x: 0.8, y: 4.6, w: 5.3, h: 1.9, fontSize: 9, color: COLOR_TEXT, fontFace: "Inter", lineSpacing: 4 });

    // Model disagreement list
    s10.addShape(pptx.ShapeType.rect, { x: 6.9, y: 4.1, w: 5.9, h: 2.6, fill: { color: COLOR_CARD }, line: { color: "334155", width: 1 } });
    s10.addText("DISAGREEMENT HIGHLIGHTS", { x: 7.2, y: 4.2, w: 5.3, h: 0.3, fontSize: 11, color: COLOR_SECONDARY, bold: true, fontFace: "Outfit" });
    let disagreeText = bp.consensus.disagreements.map(d => `• ${d.replace(/\*\*/g, '')}`).join("\n\n");
    s10.addText(disagreeText, { x: 7.2, y: 4.6, w: 5.3, h: 1.9, fontSize: 9, color: COLOR_TEXT, fontFace: "Inter", lineSpacing: 4 });

    // Slide 11: Solution Explainability & Logic
    let s11 = createSlide("Solution Explainability & Reference Logs", "SECTION 5: MULTI-MODEL ORCHESTRATION");
    s11.addShape(pptx.ShapeType.rect, { x: 0.5, y: 1.6, w: 12.3, h: 1.2, fill: { color: COLOR_CARD }, line: { color: "334155", width: 1 } });
    s11.addText("WHY THIS RECOMMENDATION?", { x: 0.8, y: 1.8, w: 11.7, h: 0.3, fontSize: 11, color: COLOR_SECONDARY, bold: true, fontFace: "Outfit" });
    s11.addText(bp.explainability.whyThisRecommendation.replace(/\*\*/g, ''), { x: 0.8, y: 2.1, w: 11.7, h: 0.6, fontSize: 11, color: COLOR_TEXT, fontFace: "Inter", lineSpacing: 4 });

    // Assumptions
    s11.addShape(pptx.ShapeType.rect, { x: 0.5, y: 3.1, w: 5.9, h: 3.6, fill: { color: COLOR_CARD }, line: { color: "334155", width: 1 } });
    s11.addText("KEY ENGINEERING ASSUMPTIONS", { x: 0.8, y: 3.3, w: 5.3, h: 0.3, fontSize: 11, color: COLOR_PRIMARY, bold: true, fontFace: "Outfit" });
    let assumptText = bp.explainability.assumptions.map(a => `• ${a.replace(/\*\*/g, '')}`).join("\n\n");
    s11.addText(assumptText, { x: 0.8, y: 3.7, w: 5.3, h: 2.8, fontSize: 10, color: COLOR_TEXT, fontFace: "Inter", lineSpacing: 4 });

    // Alternatives
    s11.addShape(pptx.ShapeType.rect, { x: 6.9, y: 3.1, w: 5.9, h: 3.6, fill: { color: COLOR_CARD }, line: { color: "334155", width: 1 } });
    s11.addText("ALTERNATIVE ARCHITECTURES CONSIDERED", { x: 7.2, y: 3.3, w: 5.3, h: 0.3, fontSize: 11, color: COLOR_SUCCESS, bold: true, fontFace: "Outfit" });
    let altText = bp.explainability.alternatives.map(a => `• ${a.replace(/\*\*/g, '')}`).join("\n\n");
    s11.addText(altText, { x: 7.2, y: 3.7, w: 5.3, h: 2.8, fontSize: 10, color: COLOR_TEXT, fontFace: "Inter", lineSpacing: 4 });

    pptx.writeFile({ fileName: `${bp.title.replace(/\s+/g, '_')}_Presentation_Deck.pptx` })
      .then(() => {
        spinner.style.display = "none";
        closeModal("export-modal-overlay");
        logAuditEvent(`Exported PPTX Solution Deck`, bp.title, "Success");
        alert("Success: PowerPoint presentation deck generated and downloaded.");
      })
      .catch((err) => {
        spinner.style.display = "none";
        logAuditEvent(`Export PPTX Failure`, err.message || err, "Error");
        alert("Failed to compile PPTX deck: " + (err.message || err));
      });
      
    return;
  }

  const steps = [
    `Compiling Executive Summary...`,
    `Rendering target workflow diagrams...`,
    `Generating financial modeling parameters...`,
    `Completing export package...`
  ];

  let current = 0;
  function processExportSteps() {
    if (current < steps.length) {
      statusText.innerText = steps[current];
      current++;
      setTimeout(processExportSteps, 600);
    } else {
      spinner.style.display = "none";
      closeModal("export-modal-overlay");
      
      // Perform Mock Client-Side Download
      let content = "";
      let mimeType = "text/plain";
      let extension = "txt";

      if (format === "MD") {
        content = `# SOLUTION BLUEPRINT: ${bp.title}\n\n## Executive Summary\n${bp.summary}\n\n## Problem Statement\n${bp.problemStatement}\n\n## Recommended Solution\n${bp.recommendedSolution.details}\n\n## ROI Analysis\n- Investment: ${bp.roi.investment}\n- Savings: ${bp.roi.savings}\n- Payback Period: ${bp.roi.payback}\n\n## Implementation Roadmap\n${bp.roadmap.phases.map(p => `### ${p.phase} (${p.duration})\n${p.tasks.map(t => `- ${t}`).join('\n')}`).join('\n\n')}`;
        mimeType = "text/markdown";
        extension = "md";
      } else if (format === "HTML") {
        content = `<html><head><title>${bp.title}</title><style>body{font-family:sans-serif;padding:40px;color:#333;}h1{color:#6366f1;}table{border-collapse:collapse;width:100%;}td,th{border:1px solid #ddd;padding:8px;}</style></head><body><h1>${bp.title}</h1><h2>Summary</h2><p>${bp.summary}</p><h2>Problem</h2><p>${bp.problemStatement}</p><h2>ROI</h2><p>Investment: ${bp.roi.investment}<br>Savings: ${bp.roi.savings}</p></body></html>`;
        mimeType = "text/html";
        extension = "html";
      } else {
        // Mock binary formats (PDF, DOCX)
        content = `[Mock Binary Data Stream for Enterprise ${format} Export]\n\nBlueprint: ${bp.title}\nPrepared for: ${bp.metadata.companyName}\nGenerated on: ${bp.metadata.generatedAt}\n\nThis is a simulation of the formatted ${format} document including complete McKinsey & Gartner-style consulting deliverables, Gantt flowcharts, and architecture frameworks.`;
        mimeType = "application/octet-stream";
        extension = format.toLowerCase();
      }

      // Download trigger
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${bp.title.replace(/\s+/g, '_')}_solution_blueprint.${extension}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      logAuditEvent(`Exported Solution Blueprint`, `${format}: ${bp.title}`, "Success");
      alert(`Success: Solution blueprint downloaded in ${format} format.`);
    }
  }

  setTimeout(processExportSteps, 400);
};

// Translate/Localization Helper
function translatePage() {
  const elements = document.querySelectorAll("[data-i18n]");
  const lang = AppState.language;
  
  elements.forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (Localization[lang] && Localization[lang][key]) {
      el.innerText = Localization[lang][key];
    }
  });

  // Update page title if view is active
  switchView(AppState.currentView);
}

// Slide Deck Previewer Implementation
let slidesControlsInitialized = false;

function initSlideDeckControls() {
  if (slidesControlsInitialized) return;
  
  const prevBtn = document.getElementById("slide-prev-btn");
  const nextBtn = document.getElementById("slide-next-btn");
  
  if (prevBtn && nextBtn) {
    prevBtn.addEventListener("click", () => {
      if (AppState.currentSlideIndex > 0) {
        AppState.currentSlideIndex--;
        renderSlidePreview();
      }
    });
    
    nextBtn.addEventListener("click", () => {
      if (AppState.currentSlideIndex < 10) {
        AppState.currentSlideIndex++;
        renderSlidePreview();
      }
    });
    slidesControlsInitialized = true;
  }
}

function renderSlidePreview() {
  const canvas = document.getElementById("ppt-slide-canvas");
  const label = document.getElementById("slide-index-label");
  const bp = AppState.activeBlueprint;
  
  if (!canvas || !bp) return;
  
  label.innerText = `Slide ${AppState.currentSlideIndex + 1} of 11`;
  
  let html = "";
  const categoryHeader = `<div class="slide-header"><span class="slide-category">${bp.metadata.department} AI SOLUTION DECK</span><span style="font-size: 0.7rem; opacity: 0.7;">CONFIDENTIAL</span></div>`;
  
  switch (AppState.currentSlideIndex) {
    case 0: // Cover Slide
      html = `
        <div style="display: flex; flex-direction: column; justify-content: center; height: 100%; padding-left: 5%;">
          <span style="font-size: 0.85rem; color: var(--secondary); font-weight: bold; letter-spacing: 0.1em; text-transform: uppercase;">
            ${bp.metadata.department} AI SOLUTION BLUEPRINT
          </span>
          <h2 style="font-size: 2.2rem; font-weight: 800; color: var(--text-primary); margin-top: 10px; line-height: 1.2;">
            ${bp.title}
          </h2>
          <p style="font-size: 0.95rem; color: var(--text-secondary); margin-top: 8px; font-style: italic;">
            McKinsey-Style Target Architecture and Financial Assessment
          </p>
          <div style="display: flex; gap: 40px; margin-top: 30px; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 20px;">
            <div style="font-size: 0.75rem; color: var(--text-secondary); line-height: 1.5;">
              <strong>Client Name:</strong> ${bp.metadata.companyName}<br>
              <strong>Industry:</strong> ${bp.metadata.industry}<br>
              <strong>Generated:</strong> ${bp.metadata.generatedAt}
            </div>
            <div style="font-size: 0.75rem; color: var(--text-secondary); line-height: 1.5;">
              <strong>AI Type:</strong> ${bp.aiType}<br>
              <strong>Ready Score:</strong> ${bp.metadata.aiReadinessScore}/10<br>
              <strong>Confidence Score:</strong> ${bp.metadata.confidenceScore}%
            </div>
          </div>
        </div>
      `;
      break;
      
    case 1: // Executive Summary
      html = `
        ${categoryHeader}
        <h3 class="slide-title">Executive Summary & Strategic Vision</h3>
        <div class="slide-body">
          <p style="font-size: 1.15rem; color: var(--secondary); font-style: italic; line-height: 1.5; margin-bottom: 20px;">
            "${bp.summary}"
          </p>
          <div class="slide-card" style="height: auto; padding: 20px;">
            <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--primary); margin-bottom: 10px;">BUSINESS ADOPTION STRATEGY</h4>
            <ul style="margin-left: 20px; font-size: 0.85rem; color: var(--text-secondary); line-height: 1.6;">
              <li><strong>Objective:</strong> Optimize domain operations via automation and advanced LLM reasoning.</li>
              <li><strong>Baseline Core Systems:</strong> Systems integrated: ${bp.currentStateAssessment.existingSystems.join(', ')}.</li>
              <li><strong>Expected Results:</strong> Significant deflection of manual bottlenecks and reduction of SLA breaches.</li>
            </ul>
          </div>
        </div>
        <div class="slide-footer"><span>Slide 2</span><span>Strategy & Value</span></div>
      `;
      break;
      
    case 2: // Problem & Current State
      html = `
        ${categoryHeader}
        <h3 class="slide-title">Current State Assessment & Pain Points</h3>
        <div class="slide-body">
          <div class="slide-grid-2col" style="align-items: stretch;">
            <div class="slide-card">
              <h4>PRIMARY PROBLEM STATEMENT</h4>
              <p>${bp.problemStatement}</p>
              <div style="margin-top: 15px; font-size: 0.75rem; color: var(--text-muted);">
                <strong>Legacy Workflow:</strong> ${bp.currentStateAssessment.description.substring(0, 150)}...
              </div>
            </div>
            <div class="slide-card">
              <h4>OPERATIONAL PAIN POINTS</h4>
              <ul style="margin-left: 15px; font-size: 0.78rem; color: var(--text-secondary); line-height: 1.5; margin-bottom: 15px;">
                ${bp.currentStateAssessment.painPointsList.map(p => `<li>${p}</li>`).join('')}
              </ul>
              <h4 style="border-top: 1px solid rgba(255,255,255,0.06); padding-top: 10px; margin-top: 10px;">COMPLIANCE MAPPING</h4>
              <p style="font-size: 0.78rem;">Standards: ${bp.regulations.join(', ') || 'Standard Internal Controls'}</p>
            </div>
          </div>
        </div>
        <div class="slide-footer"><span>Slide 3</span><span>Opportunity Sizing</span></div>
      `;
      break;
      
    case 3: // Solution Design
      html = `
        ${categoryHeader}
        <h3 class="slide-title">Recommended AI Solution Overview</h3>
        <div class="slide-body">
          <div style="background: rgba(99,102,241,0.05); border-left: 4px solid var(--primary); padding: 15px; border-radius: 4px; margin-bottom: 20px;">
            <strong style="color: var(--secondary); font-size: 1rem;">${bp.recommendedSolution.headline}</strong>
            <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 4px;">Architecture Class: ${bp.aiType}</div>
          </div>
          <div class="slide-card" style="height: auto; padding: 20px;">
            <h4 style="margin-bottom: 8px;">INTEGRATED CAPABILITIES</h4>
            <p style="font-size: 0.85rem; line-height: 1.6;">${bp.recommendedSolution.details}</p>
          </div>
        </div>
        <div class="slide-footer"><span>Slide 4</span><span>Solution Design</span></div>
      `;
      break;
      
    case 4: // Technical Specifications
      html = `
        ${categoryHeader}
        <h3 class="slide-title">Target Integration Architecture Spec</h3>
        <div class="slide-body">
          <div class="slide-grid-2col" style="grid-template-columns: repeat(3, 1fr); gap: 15px; align-items: stretch;">
            <div class="slide-card">
              <h4>1. DATA & INGEST</h4>
              <p style="font-size: 0.75rem; line-height: 1.4; color: var(--text-secondary);">
                <strong>Source:</strong> ${bp.currentStateAssessment.existingSystems.slice(0,2).join(', ')}<br>
                <strong>Formats:</strong> ${bp.dataRequirements.map(d=>d.category).slice(0,2).join(', ')}<br>
                <strong>Security:</strong> AES-256 Encrypted storage, TLS-1.3 integration tunnels.
              </p>
            </div>
            <div class="slide-card" style="border-color: rgba(99,102,241,0.3);">
              <h4>2. PROCESSING & AI</h4>
              <p style="font-size: 0.75rem; line-height: 1.4; color: var(--text-secondary);">
                <strong>Orchestrator:</strong> Python Agentic Router<br>
                <strong>Model:</strong> ${bp.techStack.llmProviders[0]}<br>
                <strong>Vector DB:</strong> ${bp.techStack.vectorDatabases[0]}<br>
                <strong>Host:</strong> ${bp.techStack.cloudPlatforms[0]}
              </p>
            </div>
            <div class="slide-card">
              <h4>3. SECURITY & MONITOR</h4>
              <p style="font-size: 0.75rem; line-height: 1.4; color: var(--text-secondary);">
                <strong>Security:</strong> Token Masking (PII Guard)<br>
                <strong>Observability:</strong> ${bp.techStack.monitoringTools[0]} log audits<br>
                <strong>Access:</strong> Role-Based Access controls (RBAC).
              </p>
            </div>
          </div>
        </div>
        <div class="slide-footer"><span>Slide 5</span><span>Technical Architecture</span></div>
      `;
      break;
      
    case 5: // Business Benefits
      html = `
        ${categoryHeader}
        <h3 class="slide-title">Project Value & Success Benchmarks</h3>
        <div class="slide-body">
          <div class="slide-grid-2col" style="align-items: stretch;">
            <div class="slide-card">
              <h4>EXPECTED BENEFITS & KPIs</h4>
              <ul style="margin-left: 20px; font-size: 0.78rem; color: var(--text-secondary); line-height: 1.6;">
                ${bp.businessBenefits.map(b => `<li>${b}</li>`).join('')}
              </ul>
            </div>
            <div class="slide-card">
              <h4>CASE STUDY REFERENCE</h4>
              <strong style="color: var(--secondary); font-size: 0.85rem;">${bp.benchmarks[0].org}</strong>
              <p style="font-size: 0.72rem; color: var(--text-secondary); margin-top: 5px; line-height: 1.4;">
                ${bp.benchmarks[0].story}
              </p>
              <div style="font-size: 0.72rem; margin-top: 10px; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 8px;">
                <strong>Key Lesson:</strong> <span style="font-style: italic;">${bp.benchmarks[0].lessons}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="slide-footer"><span>Slide 6</span><span>Project Feasibility</span></div>
      `;
      break;
      
    case 6: // Implementation Roadmap
      html = `
        ${categoryHeader}
        <h3 class="slide-title">Implementation Phased Roadmap</h3>
        <div class="slide-body">
          <div class="slide-grid-2col" style="grid-template-columns: repeat(4, 1fr); gap: 10px; align-items: stretch;">
            ${bp.roadmap.phases.map((p, idx) => `
              <div class="slide-card" style="padding: 10px; border-color: rgba(99,102,241,0.2);">
                <div style="font-size: 0.7rem; font-weight: 700; color: var(--secondary); text-transform: uppercase;">
                  Phase ${idx + 1}
                </div>
                <div style="font-size: 0.8rem; font-weight: bold; margin-top: 4px; line-height: 1.2; height: 32px; overflow: hidden; color: var(--text-primary);">
                  ${p.phase.split(': ')[1] || p.phase}
                </div>
                <div style="font-size: 0.7rem; color: var(--text-muted); margin-top: 2px;">
                  Duration: ${p.duration}
                </div>
                <ul style="margin-left: 10px; font-size: 0.65rem; color: var(--text-secondary); line-height: 1.3; margin-top: 10px; padding-left: 5px;">
                  <li>${p.tasks[0]}</li>
                  <li style="margin-top: 4px;">${p.tasks[1]}</li>
                </ul>
              </div>
            `).join('')}
          </div>
        </div>
        <div class="slide-footer"><span>Slide 7</span><span>Timeline & Gantt</span></div>
      `;
      break;
      
    case 7: // Risks & Mitigations
      html = `
        ${categoryHeader}
        <h3 class="slide-title">Governance & Risk Mitigations</h3>
        <div class="slide-body">
          <div class="slide-grid-2col" style="grid-template-rows: 1fr 1fr; gap: 12px; align-items: stretch;">
            <div class="slide-card" style="padding: 12px; height: auto;">
              <strong style="color: var(--danger); font-size: 0.78rem;">TECHNICAL RISK:</strong>
              <p style="font-size: 0.72rem; margin-top: 2px; color: var(--text-secondary);">${bp.risks.technical}</p>
            </div>
            <div class="slide-card" style="padding: 12px; height: auto;">
              <strong style="color: var(--warning); font-size: 0.78rem;">OPERATIONAL ADOPTION:</strong>
              <p style="font-size: 0.72rem; margin-top: 2px; color: var(--text-secondary);">${bp.risks.operational}</p>
            </div>
            <div class="slide-card" style="padding: 12px; height: auto;">
              <strong style="color: var(--primary); font-size: 0.78rem;">SECURITY MITIGATION:</strong>
              <p style="font-size: 0.72rem; margin-top: 2px; color: var(--text-secondary);">${bp.risks.security}</p>
            </div>
            <div class="slide-card" style="padding: 12px; height: auto;">
              <strong style="color: var(--success); font-size: 0.78rem;">COMPLIANCE STANDARD:</strong>
              <p style="font-size: 0.72rem; margin-top: 2px; color: var(--text-secondary);">${bp.risks.compliance}</p>
            </div>
          </div>
        </div>
        <div class="slide-footer"><span>Slide 8</span><span>Risk Matrix</span></div>
      `;
      break;
      
    case 8: // Investment & ROI
      html = `
        ${categoryHeader}
        <h3 class="slide-title">Financial Model & Investment Case</h3>
        <div class="slide-body">
          <div class="slide-metrics-row">
            <div class="slide-metric-box">
              <div class="slide-metric-val">${bp.roi.investment}</div>
              <div class="slide-metric-label">Estimated Investment</div>
            </div>
            <div class="slide-metric-box" style="background: rgba(16,185,129,0.1); border-color: rgba(16,185,129,0.2);">
              <div class="slide-metric-val" style="color: var(--success);">${bp.roi.savings}</div>
              <div class="slide-metric-label">Annual Operating Savings</div>
            </div>
            <div class="slide-metric-box" style="background: rgba(6,182,212,0.1); border-color: rgba(6,182,212,0.2);">
              <div class="slide-metric-val" style="color: var(--secondary);">${bp.roi.payback}</div>
              <div class="slide-metric-label">Payback Threshold</div>
            </div>
          </div>
          <div class="slide-card" style="height: auto; padding: 12px; margin-top: 15px;">
            <p style="font-size: 0.7rem; color: var(--text-secondary); line-height: 1.4;">
              <strong>Financial Assumptions:</strong> Calculations scale as a factor of company revenue <strong>${bp.metadata.revenue}</strong> and readiness complexity coefficient. Subject to Standard ROI validation protocols.
            </p>
          </div>
        </div>
        <div class="slide-footer"><span>Slide 9</span><span>Business Feasibility</span></div>
      `;
      break;

    case 9: // Consensus Slide
      html = `
        ${categoryHeader}
        <h3 class="slide-title">Multi-Model Agent Consensus Voting</h3>
        <div class="slide-body">
          <div class="slide-metrics-row">
            <div class="slide-metric-box">
              <div class="slide-metric-val">${bp.consensus.confidenceScore}%</div>
              <div class="slide-metric-label">Confidence Score</div>
            </div>
            <div class="slide-metric-box" style="background: rgba(16,185,129,0.1); border-color: rgba(16,185,129,0.2);">
              <div class="slide-metric-val" style="color: var(--success);">${bp.consensus.consensusLevel}</div>
              <div class="slide-metric-label">Agreement Level</div>
            </div>
            <div class="slide-metric-box" style="background: rgba(6,182,212,0.1); border-color: rgba(6,182,212,0.2);">
              <div class="slide-metric-val" style="color: var(--secondary);">${bp.consensus.sourcesChecked}</div>
              <div class="slide-metric-label">RAG Sources Checked</div>
            </div>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 15px;">
            <div class="slide-card" style="height: auto; padding: 12px;">
              <h4 style="font-size: 0.8rem; color: var(--success); margin-bottom: 6px;"><i class="fa-solid fa-circle-check"></i> AGREEMENT AREAS</h4>
              <ul style="margin-left: 14px; font-size: 0.7rem; color: var(--text-secondary); line-height: 1.4;">
                ${bp.consensus.agreements.map(a => `<li>${a}</li>`).join('')}
              </ul>
            </div>
            <div class="slide-card" style="height: auto; padding: 12px;">
              <h4 style="font-size: 0.8rem; color: var(--warning); margin-bottom: 6px;"><i class="fa-solid fa-triangle-exclamation"></i> DISAGREEMENT HIGHLIGHTS</h4>
              <ul style="margin-left: 14px; font-size: 0.7rem; color: var(--text-secondary); line-height: 1.4;">
                ${bp.consensus.disagreements.map(d => `<li>${d}</li>`).join('')}
              </ul>
            </div>
          </div>
        </div>
        <div class="slide-footer"><span>Slide 10</span><span>AI Agent Consensus</span></div>
      `;
      break;

    case 10: // Explainability Slide
      html = `
        ${categoryHeader}
        <h3 class="slide-title">Solution Explainability & Alternatives</h3>
        <div class="slide-body">
          <div class="slide-card" style="height: auto; padding: 12px; margin-bottom: 12px;">
            <strong style="color: var(--secondary); font-size: 0.8rem;">WHY THIS RECOMMENDATION?</strong>
            <p style="font-size: 0.72rem; color: var(--text-secondary); margin-top: 4px; line-height: 1.4;">${bp.explainability.whyThisRecommendation}</p>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
            <div class="slide-card" style="height: auto; padding: 12px;">
              <h4 style="font-size: 0.8rem; color: var(--primary); margin-bottom: 6px;">KEY ENGINEERING ASSUMPTIONS</h4>
              <ul style="margin-left: 14px; font-size: 0.7rem; color: var(--text-secondary); line-height: 1.4;">
                ${bp.explainability.assumptions.map(a => `<li>${a}</li>`).join('')}
              </ul>
            </div>
            <div class="slide-card" style="height: auto; padding: 12px;">
              <h4 style="font-size: 0.8rem; color: var(--accent); margin-bottom: 6px;">ALTERNATIVE ARCHITECTURES CONSIDERED</h4>
              <ul style="margin-left: 14px; font-size: 0.7rem; color: var(--text-secondary); line-height: 1.4;">
                ${bp.explainability.alternatives.map(a => `<li>${a}</li>`).join('')}
              </ul>
            </div>
          </div>
        </div>
        <div class="slide-footer"><span>Slide 11</span><span>Architecture Explainability</span></div>
      `;
      break;
  }
  
  canvas.innerHTML = html;
}

// ==========================================
// AI ORCHESTRATION & AGENT SYSTEM MODULES
// ==========================================

function initOrchestrator() {
  const savedSettings = localStorage.getItem("enterprise_orchestrator_settings");
  if (savedSettings) {
    AppState.orchestratorSettings = JSON.parse(savedSettings);
  } else {
    AppState.orchestratorSettings = {
      models: [
        { id: "gpt-5", name: "GPT-5", provider: "OpenAI", endpoint: "https://api.openai.com/v1/chat/completions", status: "Enabled", key: "sk-••••••••••••••••" },
        { id: "claude-3-5-sonnet", name: "Claude 3.5 Sonnet", provider: "Anthropic", endpoint: "https://api.anthropic.com/v1/messages", status: "Enabled", key: "sk-ant-••••••••••••••••" },
        { id: "gemini-1-5-pro", name: "Gemini 1.5 Pro", provider: "Google", endpoint: "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro", status: "Enabled", key: "AIzaSy••••••••••••••••" },
        { id: "deepseek-v3", name: "DeepSeek V3", provider: "DeepSeek", endpoint: "https://api.deepseek.com/v1/chat/completions", status: "Enabled", key: "sk-ds-••••••••••••••••" },
        { id: "llama-3-1-local", name: "Llama 3.1 (Local)", provider: "Local LLM", endpoint: "http://localhost:11434/v1/chat/completions", status: "Disabled", key: "" },
        { id: "mistral-large", name: "Mistral Large", provider: "Mistral AI", endpoint: "https://api.mistral.ai/v1/chat/completions", status: "Disabled", key: "" }
      ],
      rules: {
        business: "gpt-5",
        architecture: "claude-3-5-sonnet",
        ai_models: "gemini-1-5-pro",
        data_strategy: "claude-3-5-sonnet",
        security: "gpt-5",
        benchmarks: "deepseek-v3",
        project_mgmt: "claude-3-5-sonnet"
      }
    };
    localStorage.setItem("enterprise_orchestrator_settings", JSON.stringify(AppState.orchestratorSettings));
  }

  // Repository search event
  const repoSearch = document.getElementById("repo-search-input");
  if (repoSearch) {
    repoSearch.addEventListener("input", (e) => {
      renderRepositoryTable(e.target.value);
    });
  }
}

function renderOrchestration() {
  renderModelsTable();
  renderRoutingRules();
  renderRepositoryTable();
}

function renderModelsTable() {
  const tbody = document.querySelector("#orchestrator-models-table tbody");
  if (!tbody) return;

  tbody.innerHTML = AppState.orchestratorSettings.models.map(model => {
    const isCustom = !["gpt-5", "claude-3-5-sonnet", "gemini-1-5-pro", "deepseek-v3", "llama-3-1-local", "mistral-large"].includes(model.id);
    const deleteBtn = isCustom 
      ? `<button class="control-btn" style="border: none; background: transparent;" onclick="deleteCustomModel('${model.id}')">
           <i class="fa-solid fa-trash-can" style="color: var(--danger);"></i>
         </button>` 
      : `<span style="color: var(--text-muted); font-size: 0.75rem;">Preset</span>`;

    let providerClass = "badge-primary";
    const provLower = model.provider.toLowerCase();
    if (provLower.includes("openai") || provLower.includes("azure")) providerClass = "badge-primary";
    else if (provLower.includes("anthropic")) providerClass = "badge-warning";
    else if (provLower.includes("google")) providerClass = "badge-success";
    else if (provLower.includes("deepseek")) providerClass = "badge-danger";
    else providerClass = "badge-primary";

    return `
      <tr>
        <td><strong>${model.name}</strong></td>
        <td><span class="badge ${providerClass}">${model.provider}</span></td>
        <td>
          <input type="text" class="form-control" value="${model.endpoint}" style="padding: 6px 10px; font-size: 0.8rem; width: 100%; border: 1px solid var(--border-color); border-radius: 6px; background: rgba(0,0,0,0.2); color: var(--text-primary);" onchange="updateModelEndpoint('${model.id}', this.value)">
        </td>
        <td>
          <label class="switch">
            <input type="checkbox" ${model.status === 'Enabled' ? 'checked' : ''} onchange="toggleModelStatus('${model.id}')">
            <span class="slider"></span>
          </label>
        </td>
        <td style="text-align: center;">
          ${deleteBtn}
        </td>
      </tr>
    `;
  }).join('');
}

window.updateModelEndpoint = function(modelId, newEndpoint) {
  const model = AppState.orchestratorSettings.models.find(m => m.id === modelId);
  if (model) {
    model.endpoint = newEndpoint;
    localStorage.setItem("enterprise_orchestrator_settings", JSON.stringify(AppState.orchestratorSettings));
    logAuditEvent("Updated Model Endpoint", `${model.name}: ${newEndpoint}`, "Success");
  }
};

window.toggleModelStatus = function(modelId) {
  const model = AppState.orchestratorSettings.models.find(m => m.id === modelId);
  if (model) {
    model.status = model.status === 'Enabled' ? 'Disabled' : 'Enabled';
    localStorage.setItem("enterprise_orchestrator_settings", JSON.stringify(AppState.orchestratorSettings));
    logAuditEvent("Toggled Model Status", `${model.name}: ${model.status}`, "Success");
    renderOrchestration();
  }
};

window.deleteCustomModel = function(modelId) {
  const modelIndex = AppState.orchestratorSettings.models.findIndex(m => m.id === modelId);
  if (modelIndex > -1) {
    const model = AppState.orchestratorSettings.models[modelIndex];
    AppState.orchestratorSettings.models.splice(modelIndex, 1);
    localStorage.setItem("enterprise_orchestrator_settings", JSON.stringify(AppState.orchestratorSettings));
    logAuditEvent("Deleted Custom Model", model.name, "Success");
    renderOrchestration();
  }
};

function renderRoutingRules() {
  const container = document.getElementById("orchestrator-routing-rules");
  if (!container) return;

  const routingTasks = [
    { key: "business", label: "Business Consultant (ROI)", desc: "Quantifies financial ROI, margins, and savings templates." },
    { key: "architecture", label: "Solution Architect (System Design)", desc: "Builds integration maps, database layout schemas." },
    { key: "ai_models", label: "AI Architect (Model Selection)", desc: "Recommends foundation models (RAG / Agentic config)." },
    { key: "data_strategy", label: "Data Architect (Ingest & Schema)", desc: "Defines ingestion channels and chunking protocols." },
    { key: "security", label: "Security Specialist (Compliance)", desc: "Sanitizes data, masks PII, maps HIPAA/GDPR rules." },
    { key: "benchmarks", label: "Industry Benchmarker", desc: "Correlates design patterns with case repository studies." },
    { key: "project_mgmt", label: "Project Planner (Roadmap)", desc: "Drafts Gantt timeline and delivery execution phases." }
  ];

  const enabledModels = AppState.orchestratorSettings.models.filter(m => m.status === 'Enabled');

  container.innerHTML = routingTasks.map(task => {
    const currentSelectedId = AppState.orchestratorSettings.rules[task.key];
    const optionsHtml = enabledModels.map(m => {
      return `<option value="${m.id}" ${m.id === currentSelectedId ? 'selected' : ''}>${m.name} (${m.provider})</option>`;
    }).join('');

    const fallbackOption = enabledModels.find(m => m.id === currentSelectedId) 
      ? '' 
      : `<option value="" disabled selected>Select Enabled Model</option>`;

    return `
      <div class="routing-rule-row">
        <div>
          <strong>${task.label}</strong>
          <div style="font-size: 0.75rem; color: var(--text-muted);">${task.desc}</div>
        </div>
        <select class="form-control" style="background: rgba(15, 23, 42, 0.6); color: var(--text-primary); border: 1px solid var(--border-color); border-radius: 6px; padding: 6px 12px; width: 50%;" onchange="updateRoutingRule('${task.key}', this.value)">
          ${fallbackOption}
          ${optionsHtml}
        </select>
      </div>
    `;
  }).join('');
}

window.updateRoutingRule = function(taskKey, modelId) {
  AppState.orchestratorSettings.rules[taskKey] = modelId;
  localStorage.setItem("enterprise_orchestrator_settings", JSON.stringify(AppState.orchestratorSettings));
  logAuditEvent("Updated Routing Rule", `${taskKey} Task mapped to ${modelId}`, "Success");
};

function renderRepositoryTable(filterText = "") {
  const tbody = document.querySelector("#orchestrator-repo-table tbody");
  if (!tbody) return;

  const query = filterText.toLowerCase().trim();
  const repo = window.AIUseCaseRepository || [];

  const filtered = repo.filter(item => {
    return item.title.toLowerCase().includes(query) ||
           item.industry.toLowerCase().includes(query) ||
           item.summary.toLowerCase().includes(query) ||
           item.pattern.toLowerCase().includes(query) ||
           item.source.toLowerCase().includes(query);
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--text-muted); padding: 20px;">No matching reference implementations found.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(item => {
    return `
      <tr>
        <td><strong>${item.title}</strong></td>
        <td><span class="badge badge-primary">${item.industry}</span></td>
        <td>
          <div style="font-size: 0.85rem; line-height: 1.4;">${item.summary}</div>
          <div style="font-size: 0.78rem; color: var(--warning); margin-top: 4px;"><strong style="font-size: 0.72rem; text-transform: uppercase;">Benchmark lessons:</strong> ${item.lessons}</div>
        </td>
        <td><i class="fa-solid fa-building"></i> ${item.source}<br><span style="font-size: 0.75rem; color: var(--text-muted);">${item.pattern}</span></td>
      </tr>
    `;
  }).join('');
}

window.submitCustomModel = function() {
  const nameInput = document.getElementById("new-model-name");
  const providerSelect = document.getElementById("new-model-provider");
  const endpointInput = document.getElementById("new-model-endpoint");
  const keyInput = document.getElementById("new-model-key");

  const name = nameInput.value.trim();
  const provider = providerSelect.value;
  const endpoint = endpointInput.value.trim();
  const key = keyInput.value.trim();

  if (!name || !endpoint) {
    alert("Please enter both Model Name and API Route Endpoint.");
    return;
  }

  const newModelId = "custom-" + Date.now();
  const newModel = {
    id: newModelId,
    name: name,
    provider: provider,
    endpoint: endpoint,
    status: "Enabled",
    key: key ? "sk-••••••••••••••••" : ""
  };

  AppState.orchestratorSettings.models.push(newModel);
  localStorage.setItem("enterprise_orchestrator_settings", JSON.stringify(AppState.orchestratorSettings));
  
  logAuditEvent("Added Custom Model", `${name} (${provider})`, "Success");

  // Reset inputs
  nameInput.value = "";
  endpointInput.value = "";
  keyInput.value = "";

  closeModal("add-model-modal");
  renderOrchestration();
};

function runAgentPipelineAnimation(inputData, callback) {
  const overlay = document.getElementById("agent-orchestration-overlay");
  const flowContainer = document.getElementById("active-agent-pipeline-flow");
  const consoleEl = document.getElementById("agent-pipeline-console");
  
  if (!overlay || !flowContainer || !consoleEl) {
    const blueprint = generateBlueprint(inputData);
    callback(blueprint);
    return;
  }

  const getModelName = (taskKey) => {
    const modelId = AppState.orchestratorSettings.rules[taskKey];
    const model = AppState.orchestratorSettings.models.find(m => m.id === modelId);
    return model ? `${model.name} (${model.provider})` : "Default LLM";
  };

  const agents = [
    { name: "Business Consultant", key: "business", icon: "fa-briefcase", modelUsed: getModelName("business") },
    { name: "Solution Architect", key: "architecture", icon: "fa-sitemap", modelUsed: getModelName("architecture") },
    { name: "AI Architect", key: "ai_models", icon: "fa-robot", modelUsed: getModelName("ai_models") },
    { name: "Data Architect", key: "data_strategy", icon: "fa-database", modelUsed: getModelName("data_strategy") },
    { name: "Security Agent", key: "security", icon: "fa-shield-halved", modelUsed: getModelName("security") },
    { name: "Industry Expert", key: "benchmarks", icon: "fa-magnifying-glass-chart", modelUsed: getModelName("benchmarks") },
    { name: "Project Manager", key: "project_mgmt", icon: "fa-calendar-check", modelUsed: getModelName("project_mgmt") }
  ];

  flowContainer.innerHTML = agents.map((agent, idx) => `
    <div class="agent-card pending" id="agent-card-${idx}">
      <div class="agent-icon">
        <i class="fa-solid ${agent.icon}"></i>
      </div>
      <div style="font-size: 0.82rem; font-weight: 600; color: var(--text-primary); margin-top: 4px;">${agent.name}</div>
      <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 2px;">${agent.modelUsed}</div>
    </div>
  `).join('');

  consoleEl.innerHTML = `<span style="color: var(--text-muted);">&gt; Ingesting user context boundaries... Done.</span><br>
<span style="color: var(--text-muted);">&gt; Activating multi-agent neural network configuration... Done.</span>`;
  consoleEl.scrollTop = consoleEl.scrollHeight;

  overlay.style.display = "flex";

  let currentStep = 0;
  
  function processStep() {
    if (currentStep < agents.length) {
      const agent = agents[currentStep];
      const card = document.getElementById(`agent-card-${currentStep}`);
      
      if (currentStep > 0) {
        const prevCard = document.getElementById(`agent-card-${currentStep - 1}`);
        if (prevCard) {
          prevCard.classList.remove("active");
          prevCard.classList.add("completed");
        }
      }
      
      if (card) {
        card.classList.remove("pending");
        card.classList.add("active");
      }

      let logMsg = "";
      const primaryReg = inputData.regulations && inputData.regulations[0] || "GDPR";
      switch(agent.key) {
        case "business":
          logMsg = `[Business Consultant] Quantifying financial ROI and savings templates via ${agent.modelUsed}...`;
          break;
        case "architecture":
          logMsg = `[Solution Architect] Mapping cloud integration paths and microservice layouts via ${agent.modelUsed}...`;
          break;
        case "ai_models":
          logMsg = `[AI Architect] Selecting optimal foundation LLMs and RAG templates via ${agent.modelUsed}...`;
          break;
        case "data_strategy":
          logMsg = `[Data Architect] Planning document chunking and vector index schema layouts via ${agent.modelUsed}...`;
          break;
        case "security":
          logMsg = `[Security Agent] Sanitizing prompt structures and checking regulatory ${primaryReg} compliance via ${agent.modelUsed}...`;
          break;
        case "benchmarks":
          logMsg = `[Industry Expert] Performing RAG match against enterprise implementation repository via ${agent.modelUsed}...`;
          break;
        case "project_mgmt":
          logMsg = `[Project Manager] Formulating Gantt timeline phase allocations via ${agent.modelUsed}...`;
          break;
      }

      consoleEl.innerHTML += `<br><span style="color: var(--secondary);">&gt; ${logMsg}</span>`;
      consoleEl.scrollTop = consoleEl.scrollHeight;

      setTimeout(() => {
        consoleEl.innerHTML += ` <span style="color: var(--success);">Done.</span>`;
        consoleEl.scrollTop = consoleEl.scrollHeight;
        currentStep++;
        processStep();
      }, 700);
    } else {
      const lastCard = document.getElementById(`agent-card-${agents.length - 1}`);
      if (lastCard) {
        lastCard.classList.remove("active");
        lastCard.classList.add("completed");
      }

      consoleEl.innerHTML += `<br><span style="color: var(--accent); font-weight: bold;">&gt; Executing consensus voting and consolidation... Done.</span>`;
      consoleEl.scrollTop = consoleEl.scrollHeight;

      setTimeout(() => {
        overlay.style.display = "none";
        const blueprint = generateBlueprint(inputData);
        callback(blueprint);
      }, 800);
    }
  }

  setTimeout(processStep, 500);
}
