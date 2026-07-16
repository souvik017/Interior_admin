export const sidebarLinks = [
  { label: 'Dashboard', icon: 'dashboard', to: '/dashboard' },
  { section: 'Operations' },
  { label: 'All Projects', icon: 'folder_open', to: '/projects' },
  { label: 'Project Studio', icon: 'architecture', to: '/project-studio' },
  { label: 'Task Board', icon: 'view_kanban', to: '/task-board' },
  { label: 'Calendar', icon: 'calendar_month', to: '/calendar' },
  { label: 'Site Manager', icon: 'construction', to: '/site-manager' },
  { label: 'Room Management', icon: 'meeting_room', to: '/room-management' },
  { section: 'Business' },
  { label: 'Clients', icon: 'contacts', to: '/clients' },
  { label: 'Vendors', icon: 'storefront', to: '/vendors' },
  { label: 'Team', icon: 'groups', to: '/team' },
  { label: 'Purchase Approval', icon: 'shopping_cart', to: '/purchase-approval' },
  { label: 'Invoices', icon: 'receipt_long', to: '/invoices' },
  { label: 'Quotation View', icon: 'request_quote', to: '/quotation-view' },
  { label: 'Documents', icon: 'folder', to: '/documents' },
  { label: 'Project Analytics', icon: 'bar_chart', to: '/project-analytics' },
  { section: 'Workspace' },
  { label: 'Settings', icon: 'settings', to: '/settings' },
]

export const quickLinks = [
  { label: 'Home', icon: 'home', to: '/dashboard' },
  { label: 'Studio', icon: 'architecture', to: '/project-studio' },
  { label: 'Tasks', icon: 'view_kanban', to: '/task-board' },
  { label: 'Reports', icon: 'bar_chart', to: '/project-analytics' },
]

export const dashboardRevenueSeries = [
  { label: 'Jan', value: 42, cap: 56 },
  { label: 'Feb', value: 68, cap: 82 },
  { label: 'Mar', value: 39, cap: 74 },
  { label: 'Apr', value: 84, cap: 84 },
  { label: 'May', value: 55, cap: 68 },
  { label: 'Jun', value: 72, cap: 91 },
]

export const dashboardPipeline = [
  { label: 'Concept Design', value: 92, tone: 'primary' },
  { label: 'Execution Planning', value: 74, tone: 'secondary' },
  { label: 'Material Procurement', value: 61, tone: 'tertiary' },
  { label: 'Client Handover', value: 39, tone: 'success' },
]

export const dashboardActivity = [
  {
    time: '08:40',
    title: 'Design Board approved for Villa 7',
    detail: 'Client sign-off received after revision V3.',
    status: 'Approved',
  },
  {
    time: '10:15',
    title: 'Marble delivery delayed at Central Warehouse',
    detail: 'Supplier ETA moved by 5 hours.',
    status: 'Alert',
  },
  {
    time: '12:05',
    title: 'Electrical checklist completed for Site 4',
    detail: 'QC mark added and archived.',
    status: 'Done',
  },
]

export const dashboardNotifications = [
  {
    title: 'Material request for Villa X',
    detail: 'Lead on-site requested 450 sqm Italian marble.',
    tone: 'primary',
  },
  {
    title: 'Budget warning for Showroom',
    detail: 'Material cost is trending 12% above estimate.',
    tone: 'tertiary',
  },
  {
    title: 'Client approval for Loft 4',
    detail: 'Revision V3.2 was approved by Sarah Jenkins.',
    tone: 'success',
  },
]

export const dashboardUploads = [
  'Marble installation',
  'Lighting fixture',
  'Kitchen carcass',
  'Blueprint review',
  'Material swatches',
  'Site staging',
]

export const projectStats = [
  { label: 'Open Projects', value: 18, subtitle: '5 new this week' },
  { label: 'Team Members', value: 64, subtitle: 'Across 9 disciplines' },
  { label: 'Avg. Margin', value: '24.3%', subtitle: 'Improved 1.7%' },
  { label: 'On-Time Delivery', value: '91%', subtitle: 'Above target' },
]

export const projectStages = [
  { label: 'Brief', progress: 100 },
  { label: 'Concept', progress: 82 },
  { label: 'Procurement', progress: 67 },
  { label: 'Execution', progress: 49 },
  { label: 'Handover', progress: 21 },
]

export const taskColumns = [
  {
    title: 'To Do',
    count: 3,
    tone: 'primary',
    cards: [
      { title: 'Wardrobe carcass assembly', category: 'Carpentry', due: 'Oct 24', owner: 'Rajesh K.', budget: '$45,000', priority: 'High' },
      { title: 'Point wiring and conduit', category: 'Electrical', due: 'Oct 26', owner: 'Amit S.', budget: '$12,800', priority: 'Low' },
      { title: 'Lighting layout review', category: 'MEP', due: 'Oct 27', owner: 'Nora P.', budget: '$9,400', priority: 'Medium' },
    ],
  },
  {
    title: 'In Progress',
    count: 2,
    tone: 'tertiary',
    cards: [
      { title: 'False ceiling framing', category: 'Ceiling', due: '45% complete', owner: 'Vikram M.', budget: '$28,500', priority: 'Medium' },
      { title: 'Veneer pressing - accent wall', category: 'Surface', due: 'Waiting QC', owner: 'Sara L.', budget: '$52,000', priority: 'Urgent' },
    ],
  },
  {
    title: 'Review',
    count: 1,
    tone: 'secondary',
    cards: [
      { title: 'Client handover checklist', category: 'QA', due: 'Ready for approval', owner: 'Meera J.', budget: '$7,100', priority: 'Review' },
    ],
  },
  {
    title: 'Completed',
    count: 8,
    tone: 'success',
    cards: [
      { title: 'Plastering and curing', category: 'Civil', due: 'Verified by PM', owner: 'Team Alpha', budget: '$19,400', priority: 'Done' },
    ],
  },
]

export const siteSchedule = [
  { time: '09:00', title: 'Skyline Penthouse: HVAC installation', meta: 'Phase 3, Team Alpha', status: 'On Track' },
  { time: '11:30', title: 'Zen Office Hub: floor tiling inspection', meta: 'Milestone reach, QC team', status: 'Pending' },
  { time: '14:00', title: 'Luxe Retail: marble delivery', meta: 'Inventory update, logistics', status: 'On Time' },
  { time: '16:30', title: 'Conference suite lighting punch list', meta: 'Final review, interiors', status: 'Urgent' },
]

export const siteIssues = [
  {
    title: 'Material shortage: cement grade 43',
    detail: 'Skyline Penthouse, delay risk high',
    tone: 'danger',
  },
  {
    title: 'Safety violation: scaffolding',
    detail: 'Luxe Retail, north wing access',
    tone: 'warning',
  },
  {
    title: 'Client access request',
    detail: 'Penthouse lobby walkthrough tomorrow',
    tone: 'primary',
  },
]

export const resourceBars = [
  { label: 'Carpentry and Joinery', value: 93, detail: '112 / 120 workers' },
  { label: 'Electrical and Wiring', value: 45, detail: '68 / 150 workers' },
  { label: 'Finishes and Fixtures', value: 71, detail: '84 / 118 workers' },
]

export const rooms = [
  {
    name: 'Master Bedroom',
    stage: 'Furnishing',
    progress: 84,
    owner: 'Interior lead',
    budget: '$78,450',
    assets: ['Wardrobe', 'Lighting', 'Curtains'],
  },
  {
    name: 'Living Lounge',
    stage: 'Joinery',
    progress: 63,
    owner: 'Site manager',
    budget: '$54,280',
    assets: ['TV unit', 'Paneling', 'Cove lights'],
  },
  {
    name: 'Kitchen Suite',
    stage: 'Installation',
    progress: 48,
    owner: 'Procurement',
    budget: '$91,120',
    assets: ['Quartz top', 'Cabinets', 'Hardware'],
  },
  {
    name: 'Guest Bath',
    stage: 'QC review',
    progress: 92,
    owner: 'Quality team',
    budget: '$18,560',
    assets: ['Tiles', 'Sanitary', 'Mirror'],
  },
]

export const roomChecklist = [
  { label: 'Material delivered', status: 'done' },
  { label: 'Electrical rough-in', status: 'done' },
  { label: 'Joinery fixed', status: 'in-progress' },
  { label: 'Final styling', status: 'pending' },
]

export const purchaseQueue = [
  {
    item: 'Italian marble slab',
    project: 'Villa X',
    amount: '$24,900',
    vendor: 'StoneCraft',
    urgency: 'High',
    status: 'Waiting',
  },
  {
    item: 'Linear lighting profile',
    project: 'Showroom 4',
    amount: '$6,420',
    vendor: 'NovaLux',
    urgency: 'Medium',
    status: 'Reviewed',
  },
  {
    item: 'Custom wardrobe hinges',
    project: 'Apartment 21',
    amount: '$3,160',
    vendor: 'HingeWorks',
    urgency: 'Low',
    status: 'Approved',
  },
]

export const budgetRows = [
  { label: 'Approved', value: '$1.84M', tone: 'success' },
  { label: 'Pending', value: '$420K', tone: 'tertiary' },
  { label: 'Rejected', value: '$38K', tone: 'danger' },
]

export const analyticsSeries = [
  { label: 'Jan', value: 38 },
  { label: 'Feb', value: 52 },
  { label: 'Mar', value: 61 },
  { label: 'Apr', value: 58 },
  { label: 'May', value: 72 },
  { label: 'Jun', value: 81 },
]

export const analyticsHighlights = [
  { label: 'Revenue', value: '$2.8M', delta: '+18%', tone: 'primary' },
  { label: 'Utilization', value: '84%', delta: '+6%', tone: 'secondary' },
  { label: 'Delay Risk', value: '7%', delta: '-3%', tone: 'success' },
  { label: 'Client NPS', value: '91', delta: '+4', tone: 'tertiary' },
]

export const quotationLines = [
  { item: 'Design consultation', qty: 1, rate: '$12,000', total: '$12,000' },
  { item: 'Custom joinery package', qty: 1, rate: '$46,500', total: '$46,500' },
  { item: 'Lighting and controls', qty: 1, rate: '$18,250', total: '$18,250' },
  { item: 'Soft furnishings', qty: 1, rate: '$14,800', total: '$14,800' },
]

export const quotationSummary = [
  { label: 'Subtotal', value: '$91,550' },
  { label: 'Tax', value: '$7,324' },
  { label: 'Discount', value: '-$3,500' },
  { label: 'Grand total', value: '$95,374' },
]

export const allProjects = [
  { id: 'PRJ-089', name: 'Skyline Penthouse', client: 'Marcus Chen', type: 'Residential', status: 'In Progress', budget: '$480,000', progress: 68, manager: 'Rajesh K.', startDate: '2024-06-12' },
  { id: 'PRJ-092', name: 'The Loft Workspace', client: 'Novara Studios', type: 'Commercial', status: 'In Progress', budget: '$210,000', progress: 54, manager: 'Amit S.', startDate: '2024-08-02' },
  { id: 'PRJ-041', name: 'Zen Office Hub', client: 'Apex Holdings', type: 'Commercial', status: 'At Risk', budget: '$250,000', progress: 41, manager: 'Nora P.', startDate: '2024-05-20' },
  { id: 'PRJ-002', name: 'Sunset Villa II', client: 'Elena Marsh', type: 'Residential', status: 'On Hold', budget: '$390,000', progress: 22, manager: 'Vikram M.', startDate: '2024-09-14' },
  { id: 'PRJ-104', name: 'Luxe Retail', client: 'Bloom Retail Group', type: 'Retail', status: 'In Progress', budget: '$175,000', progress: 77, manager: 'Sara L.', startDate: '2024-04-08' },
  { id: 'PRJ-115', name: 'Harbor View Residence', client: 'Daniel Kwan', type: 'Residential', status: 'Completed', budget: '$620,000', progress: 100, manager: 'Rajesh K.', startDate: '2023-11-02' },
  { id: 'PRJ-098', name: 'Showroom 4', client: 'Bloom Retail Group', type: 'Retail', status: 'In Progress', budget: '$142,000', progress: 33, manager: 'Amit S.', startDate: '2024-10-01' },
  { id: 'PRJ-076', name: 'Apartment 21', client: 'Priya Nair', type: 'Residential', status: 'Completed', budget: '$98,500', progress: 100, manager: 'Nora P.', startDate: '2023-08-19' },
]

export const clientsData = [
  { id: 'CL-001', name: 'Marcus Chen', company: 'Chen Holdings', email: 'marcus@chenholdings.com', phone: '+1 (555) 201-3344', projects: ['Skyline Penthouse'], status: 'Active', since: '2023' },
  { id: 'CL-002', name: 'Novara Studios', company: 'Novara Studios LLC', email: 'hello@novarastudios.com', phone: '+1 (555) 447-9012', projects: ['The Loft Workspace'], status: 'Active', since: '2024' },
  { id: 'CL-003', name: 'Apex Holdings', company: 'Apex Holdings Inc.', email: 'ops@apexholdings.com', phone: '+1 (555) 663-2210', projects: ['Zen Office Hub'], status: 'Active', since: '2024' },
  { id: 'CL-004', name: 'Elena Marsh', company: '—', email: 'elena.marsh@gmail.com', phone: '+1 (555) 118-7765', projects: ['Sunset Villa II'], status: 'On Hold', since: '2024' },
  { id: 'CL-005', name: 'Bloom Retail Group', company: 'Bloom Retail Group', email: 'projects@bloomretail.com', phone: '+1 (555) 902-3387', projects: ['Luxe Retail', 'Showroom 4'], status: 'Active', since: '2022' },
  { id: 'CL-006', name: 'Daniel Kwan', company: '—', email: 'daniel.kwan@outlook.com', phone: '+1 (555) 774-6621', projects: ['Harbor View Residence'], status: 'Past Client', since: '2023' },
  { id: 'CL-007', name: 'Priya Nair', company: '—', email: 'priya.nair@gmail.com', phone: '+1 (555) 330-8845', projects: ['Apartment 21'], status: 'Past Client', since: '2023' },
]

export const vendorsData = [
  { id: 'VN-01', name: 'StoneCraft Imports', category: 'Marble & Stone', contact: 'Elena Ruiz', email: 'sales@stonecraft.com', phone: '+1 (555) 210-4471', rating: 4.8, leadTime: '14 days', status: 'Active' },
  { id: 'VN-02', name: 'NovaLux Lighting', category: 'Lighting', contact: 'Tom Baird', email: 'orders@novalux.com', phone: '+1 (555) 664-2298', rating: 4.5, leadTime: '9 days', status: 'Active' },
  { id: 'VN-03', name: 'HingeWorks', category: 'Hardware & Fittings', contact: 'Priya Menon', email: 'support@hingeworks.com', phone: '+1 (555) 883-1102', rating: 4.2, leadTime: '5 days', status: 'Active' },
  { id: 'VN-04', name: 'Industrial Brass Co.', category: 'Fixtures', contact: 'Marco Diaz', email: 'sales@industrialbrass.com', phone: '+1 (555) 552-7743', rating: 3.9, leadTime: '5 days', status: 'Active' },
  { id: 'VN-05', name: 'Global Stones', category: 'Marble & Stone', contact: 'Wei Zhang', email: 'contact@globalstones.com', phone: '+1 (555) 118-9963', rating: 4.6, leadTime: '18 days', status: 'Active' },
  { id: 'VN-06', name: 'Artisan Veneer Co.', category: 'Wood & Veneer', contact: 'Isabelle Roy', email: 'hello@artisanveneer.com', phone: '+1 (555) 337-6650', rating: 4.0, leadTime: '12 days', status: 'Inactive' },
]

export const teamData = [
  { id: 'TM-01', initials: 'JD', name: 'James Dawson', role: 'Lead Architect', discipline: 'Design', site: 'Skyline Penthouse', email: 'james.d@atelier.pro', status: 'Active' },
  { id: 'TM-02', initials: 'MK', name: 'Maria Kapoor', role: 'Interior Designer', discipline: 'Design', site: 'The Loft Workspace', email: 'maria.k@atelier.pro', status: 'Active' },
  { id: 'TM-03', initials: 'AR', name: 'Aisha Rahman', role: 'Site Engineer', discipline: 'Site Ops', site: 'Zen Office Hub', email: 'aisha.r@atelier.pro', status: 'Active' },
  { id: 'TM-04', initials: 'SL', name: 'Sara Lin', role: 'Procurement Lead', discipline: 'Procurement', site: 'Luxe Retail', email: 'sara.l@atelier.pro', status: 'Active' },
  { id: 'TM-05', initials: 'RK', name: 'Rajesh K.', role: 'Project Manager', discipline: 'Management', site: 'Skyline Penthouse', email: 'rajesh.k@atelier.pro', status: 'Active' },
  { id: 'TM-06', initials: 'AS', name: 'Amit S.', role: 'Electrical Lead', discipline: 'MEP', site: 'The Loft Workspace', email: 'amit.s@atelier.pro', status: 'Active' },
  { id: 'TM-07', initials: 'NP', name: 'Nora P.', role: 'MEP Coordinator', discipline: 'MEP', site: 'Zen Office Hub', email: 'nora.p@atelier.pro', status: 'Active' },
  { id: 'TM-08', initials: 'VM', name: 'Vikram M.', role: 'Carpentry Supervisor', discipline: 'Site Ops', site: 'Sunset Villa II', email: 'vikram.m@atelier.pro', status: 'On Leave' },
  { id: 'TM-09', initials: 'DC', name: 'David Chen', role: 'Lead Architect', discipline: 'Management', site: 'HQ', email: 'architect@atelier.pro', status: 'Active' },
]

export const calendarEvents = [
  { id: 1, date: '2026-07-02', time: '09:00', title: 'HVAC installation', project: 'Skyline Penthouse', type: 'site' },
  { id: 2, date: '2026-07-04', time: '11:30', title: 'Floor tiling inspection', project: 'Zen Office Hub', type: 'inspection' },
  { id: 3, date: '2026-07-07', time: '14:00', title: 'Italian marble delivery', project: 'Luxe Retail', type: 'delivery' },
  { id: 4, date: '2026-07-09', time: '10:00', title: 'Client design review', project: 'The Loft Workspace', type: 'client' },
  { id: 5, date: '2026-07-11', time: '15:30', title: 'Lighting punch list', project: 'Skyline Penthouse', type: 'site' },
  { id: 6, date: '2026-07-15', time: '09:30', title: 'Budget review meeting', project: 'Zen Office Hub', type: 'meeting' },
  { id: 7, date: '2026-07-15', time: '13:00', title: 'Vendor negotiation call', project: 'Sunset Villa II', type: 'meeting' },
  { id: 8, date: '2026-07-18', time: '08:30', title: 'Site safety audit', project: 'Luxe Retail', type: 'inspection' },
  { id: 9, date: '2026-07-21', time: '12:00', title: 'Furniture delivery', project: 'Showroom 4', type: 'delivery' },
  { id: 10, date: '2026-07-24', time: '10:00', title: 'Client handover walkthrough', project: 'Apartment 21', type: 'client' },
  { id: 11, date: '2026-07-28', time: '09:00', title: 'Quarterly site inspection', project: 'The Loft Workspace', type: 'inspection' },
  { id: 12, date: '2026-08-01', time: '10:00', title: 'Design freeze deadline', project: 'Sunset Villa II', type: 'meeting' },
]

export const documentsData = [
  { id: 'DOC-01', name: 'Skyline_Penthouse_Blueprint_V3.pdf', category: 'Blueprint', project: 'Skyline Penthouse', size: '4.2 MB', uploadedBy: 'James Dawson', date: '2026-06-02' },
  { id: 'DOC-02', name: 'Zen_Office_Hub_Contract.pdf', category: 'Contract', project: 'Zen Office Hub', size: '1.1 MB', uploadedBy: 'Rajesh K.', date: '2026-05-18' },
  { id: 'DOC-03', name: 'Luxe_Retail_Material_Specs.xlsx', category: 'Specification', project: 'Luxe Retail', size: '640 KB', uploadedBy: 'Sara Lin', date: '2026-06-11' },
  { id: 'DOC-04', name: 'Sunset_Villa_Permit_Approval.pdf', category: 'Permit', project: 'Sunset Villa II', size: '890 KB', uploadedBy: 'Vikram M.', date: '2026-04-29' },
  { id: 'DOC-05', name: 'The_Loft_Workspace_MEP_Plan.pdf', category: 'Blueprint', project: 'The Loft Workspace', size: '3.5 MB', uploadedBy: 'Nora P.', date: '2026-06-20' },
  { id: 'DOC-06', name: 'Harbor_View_Handover_Checklist.pdf', category: 'Handover', project: 'Harbor View Residence', size: '410 KB', uploadedBy: 'James Dawson', date: '2026-03-02' },
]

export const invoicesData = [
  { id: 'INV-2026-041', client: 'Marcus Chen', project: 'Skyline Penthouse', amount: '$95,374', status: 'Paid', issueDate: '2026-05-01', dueDate: '2026-05-15' },
  { id: 'INV-2026-052', client: 'Novara Studios', project: 'The Loft Workspace', amount: '$42,800', status: 'Due', issueDate: '2026-06-20', dueDate: '2026-07-20' },
  { id: 'INV-2026-038', client: 'Apex Holdings', project: 'Zen Office Hub', amount: '$61,250', status: 'Overdue', issueDate: '2026-05-28', dueDate: '2026-06-12' },
  { id: 'INV-2026-047', client: 'Bloom Retail Group', project: 'Luxe Retail', amount: '$28,600', status: 'Paid', issueDate: '2026-06-05', dueDate: '2026-06-19' },
  { id: 'INV-2026-055', client: 'Bloom Retail Group', project: 'Showroom 4', amount: '$18,400', status: 'Due', issueDate: '2026-07-01', dueDate: '2026-07-28' },
  { id: 'INV-2026-029', client: 'Daniel Kwan', project: 'Harbor View Residence', amount: '$112,900', status: 'Paid', issueDate: '2026-02-14', dueDate: '2026-02-28' },
]
