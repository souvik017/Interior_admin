import { jsPDF } from 'jspdf'
import { clientsData } from '../data/mockData'

const BRAND = {
  name: 'Atelier Pro',
  tagline: 'Interior Design & Build Studio',
  addressLines: ['24 Riverside Design Quarter, Salt Lake', 'Kolkata 700091, West Bengal, India'],
  email: 'accounts@atelier.pro',
  phone: '+91 98300 12345',
  taxId: 'GSTIN 19AATFA1234C1Z5',
  bank: {
    name: 'HDFC Bank, Salt Lake Branch',
    accountName: 'Atelier Pro Design Studio',
    accountNo: '5020 0091 4477 21',
    ifsc: 'HDFC0001234',
  },
}

const COLOR = {
  primary: [175, 16, 26],
  primarySoft: [246, 226, 227],
  text: [25, 28, 29],
  muted: [104, 112, 118],
  faint: [150, 156, 161],
  border: [228, 230, 233],
  surface: [250, 250, 251],
  success: [22, 163, 74],
  warning: [180, 83, 9],
  danger: [186, 26, 26],
}

const STATUS_COLOR = { Paid: COLOR.success, Due: COLOR.warning, Overdue: COLOR.danger }

const ONES = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen']
const TENS = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety']

function chunkToWords(n) {
  if (n === 0) return ''
  if (n < 20) return ONES[n]
  if (n < 100) return `${TENS[Math.floor(n / 10)]}${n % 10 ? ' ' + ONES[n % 10] : ''}`
  return `${ONES[Math.floor(n / 100)]} Hundred${n % 100 ? ' ' + chunkToWords(n % 100) : ''}`
}

function numberToWords(value) {
  const whole = Math.floor(value)
  const cents = Math.round((value - whole) * 100)
  if (whole === 0) return `Zero Dollars${cents ? ` and ${chunkToWords(cents)} Cents` : ''}`

  const scales = ['', 'Thousand', 'Million', 'Billion']
  let remaining = whole
  const parts = []
  let scaleIdx = 0
  while (remaining > 0) {
    const chunk = remaining % 1000
    if (chunk) parts.unshift(`${chunkToWords(chunk)}${scales[scaleIdx] ? ' ' + scales[scaleIdx] : ''}`)
    remaining = Math.floor(remaining / 1000)
    scaleIdx += 1
  }
  const words = parts.join(' ')
  return `${words} Dollars${cents ? ` and ${chunkToWords(cents)} Cents` : ''}`
}

function parseAmount(amount) {
  return Number(String(amount).replace(/[^0-9.]/g, '')) || 0
}

function formatCurrency(value) {
  return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function formatDateLong(dateStr) {
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return dateStr
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

function findClient(clientName) {
  return clientsData.find((c) => c.name === clientName)
}

export function buildInvoicePdf(invoice) {
  const client = findClient(invoice.client)
  const total = parseAmount(invoice.amount)
  const subtotal = total
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const pageW = doc.internal.pageSize.getWidth()
  const pageH = doc.internal.pageSize.getHeight()
  const marginX = 16
  const contentW = pageW - marginX * 2

  // Top accent bar
  doc.setFillColor(...COLOR.primary)
  doc.rect(0, 0, pageW, 3, 'F')

  let y = 16

  // Company header
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(19)
  doc.setTextColor(...COLOR.text)
  doc.text(BRAND.name.toUpperCase(), marginX, y)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8.5)
  doc.setTextColor(...COLOR.muted)
  doc.text(BRAND.tagline, marginX, y + 5)
  doc.text(BRAND.addressLines[0], marginX, y + 10)
  doc.text(BRAND.addressLines[1], marginX, y + 14.5)
  doc.text(`${BRAND.email}  ·  ${BRAND.phone}`, marginX, y + 19)
  doc.text(BRAND.taxId, marginX, y + 23.5)

  // Right block: INVOICE title + number + status
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(24)
  doc.setTextColor(...COLOR.primary)
  doc.text('INVOICE', pageW - marginX, y, { align: 'right' })

  doc.setFontSize(10.5)
  doc.setTextColor(...COLOR.text)
  doc.text(invoice.id, pageW - marginX, y + 6.5, { align: 'right' })

  const statusColor = STATUS_COLOR[invoice.status] || COLOR.muted
  const statusText = invoice.status.toUpperCase()
  doc.setFontSize(8.5)
  const statusW = doc.getTextWidth(statusText) + 8
  const statusX = pageW - marginX - statusW
  const statusY = y + 10
  doc.setFillColor(...statusColor)
  doc.roundedRect(statusX, statusY, statusW, 6, 3, 3, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.text(statusText, statusX + statusW / 2, statusY + 4.1, { align: 'center' })

  y += 30
  doc.setDrawColor(...COLOR.border)
  doc.setLineWidth(0.4)
  doc.line(marginX, y, pageW - marginX, y)

  // Bill To / Invoice details two-column section
  y += 9
  const colGap = 8
  const colW = (contentW - colGap) / 2

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.setTextColor(...COLOR.faint)
  doc.text('BILLED TO', marginX, y)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11.5)
  doc.setTextColor(...COLOR.text)
  doc.text(invoice.client, marginX, y + 6.5)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(...COLOR.muted)
  let billY = y + 11.5
  if (client?.company && client.company !== '—') {
    doc.text(client.company, marginX, billY)
    billY += 4.5
  }
  if (client?.email) {
    doc.text(client.email, marginX, billY)
    billY += 4.5
  }
  if (client?.phone) {
    doc.text(client.phone, marginX, billY)
    billY += 4.5
  }

  const rightColX = marginX + colW + colGap
  const detailRows = [
    ['Invoice Number', invoice.id],
    ['Issue Date', formatDateLong(invoice.issueDate)],
    ['Due Date', formatDateLong(invoice.dueDate)],
    ['Project', invoice.project],
  ]
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.setTextColor(...COLOR.faint)
  doc.text('INVOICE DETAILS', rightColX, y)

  let detailY = y + 6.5
  detailRows.forEach(([label, value]) => {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(...COLOR.muted)
    doc.text(label, rightColX, detailY)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...COLOR.text)
    doc.text(String(value), pageW - marginX, detailY, { align: 'right' })
    detailY += 5
  })

  y = Math.max(billY, detailY) + 8

  // Line items table
  const tableTop = y
  const cols = [
    { key: 'desc', label: 'Description', x: marginX, w: contentW * 0.52, align: 'left' },
    { key: 'qty', label: 'Qty', x: marginX + contentW * 0.52, w: contentW * 0.12, align: 'center' },
    { key: 'rate', label: 'Rate', x: marginX + contentW * 0.64, w: contentW * 0.18, align: 'right' },
    { key: 'amount', label: 'Amount', x: marginX + contentW * 0.82, w: contentW * 0.18, align: 'right' },
  ]

  doc.setFillColor(...COLOR.primary)
  doc.rect(marginX, tableTop, contentW, 8, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8.5)
  doc.setTextColor(255, 255, 255)
  cols.forEach((c) => {
    const tx = c.align === 'right' ? c.x + c.w - 2 : c.align === 'center' ? c.x + c.w / 2 : c.x + 2
    doc.text(c.label.toUpperCase(), tx, tableTop + 5.3, { align: c.align })
  })

  const items = [
    {
      desc: `Interior design & execution services — ${invoice.project}`,
      qty: 1,
      rate: subtotal,
      amount: subtotal,
    },
  ]

  let rowY = tableTop + 8
  const rowH = 10
  items.forEach((item, idx) => {
    if (idx % 2 === 1) {
      doc.setFillColor(...COLOR.surface)
      doc.rect(marginX, rowY, contentW, rowH, 'F')
    }
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(...COLOR.text)
    const descLines = doc.splitTextToSize(item.desc, cols[0].w - 4)
    doc.text(descLines, cols[0].x + 2, rowY + 6)
    doc.text(String(item.qty), cols[1].x + cols[1].w / 2, rowY + 6, { align: 'center' })
    doc.text(formatCurrency(item.rate), cols[2].x + cols[2].w - 2, rowY + 6, { align: 'right' })
    doc.text(formatCurrency(item.amount), cols[3].x + cols[3].w - 2, rowY + 6, { align: 'right' })
    rowY += rowH
  })

  doc.setDrawColor(...COLOR.border)
  doc.line(marginX, rowY, pageW - marginX, rowY)

  // Totals block
  let totalsY = rowY + 8
  const totalsLabelX = pageW - marginX - 55
  const totalsValueX = pageW - marginX

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9.5)
  doc.setTextColor(...COLOR.muted)
  doc.text('Subtotal', totalsLabelX, totalsY)
  doc.setTextColor(...COLOR.text)
  doc.text(formatCurrency(subtotal), totalsValueX, totalsY, { align: 'right' })

  totalsY += 7
  doc.setFillColor(...COLOR.primarySoft)
  doc.roundedRect(totalsLabelX - 6, totalsY - 5.5, 61, 10.5, 2, 2, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10.5)
  doc.setTextColor(...COLOR.primary)
  doc.text('Amount Due', totalsLabelX, totalsY + 1)
  doc.setFontSize(12.5)
  doc.text(formatCurrency(total), totalsValueX, totalsY + 1, { align: 'right' })

  // Amount in words
  let notesY = totalsY + 15
  doc.setFont('helvetica', 'italic')
  doc.setFontSize(8.5)
  doc.setTextColor(...COLOR.faint)
  doc.text(`Amount in words: ${numberToWords(total)} only.`, marginX, notesY)

  // Payment details + terms
  notesY += 10
  const boxGap = 8
  const boxW = (contentW - boxGap) / 2

  doc.setDrawColor(...COLOR.border)
  doc.setFillColor(...COLOR.surface)
  doc.roundedRect(marginX, notesY, boxW, 28, 2, 2, 'FD')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8.5)
  doc.setTextColor(...COLOR.text)
  doc.text('PAYMENT DETAILS', marginX + 4, notesY + 6)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(...COLOR.muted)
  doc.text(`Bank: ${BRAND.bank.name}`, marginX + 4, notesY + 11.5)
  doc.text(`Account Name: ${BRAND.bank.accountName}`, marginX + 4, notesY + 16)
  doc.text(`Account No: ${BRAND.bank.accountNo}`, marginX + 4, notesY + 20.5)
  doc.text(`IFSC: ${BRAND.bank.ifsc}`, marginX + 4, notesY + 25)

  const termsX = marginX + boxW + boxGap
  doc.setDrawColor(...COLOR.border)
  doc.setFillColor(...COLOR.surface)
  doc.roundedRect(termsX, notesY, boxW, 28, 2, 2, 'FD')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8.5)
  doc.setTextColor(...COLOR.text)
  doc.text('TERMS & NOTES', termsX + 4, notesY + 6)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(...COLOR.muted)
  const terms = doc.splitTextToSize(
    'Payment is due within 15 days of the issue date. Please reference the invoice number with your payment. Late payments may accrue a 1.5% monthly service charge.',
    boxW - 8,
  )
  doc.text(terms, termsX + 4, notesY + 11.5)

  const contentBottomY = notesY + 28
  const footerY = pageH - 16

  // Watermark stamp for status, placed in the empty space below the content
  if (invoice.status === 'Paid' || invoice.status === 'Overdue') {
    const stampColor = invoice.status === 'Paid' ? COLOR.success : COLOR.danger
    const stampY = (contentBottomY + footerY) / 2
    doc.saveGraphicsState()
    doc.setGState(new doc.GState({ opacity: 0.14 }))
    doc.setDrawColor(...stampColor)
    doc.setTextColor(...stampColor)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(40)
    doc.text(invoice.status.toUpperCase(), pageW / 2, stampY, { align: 'center', angle: 12 })
    doc.restoreGraphicsState()
  }

  // Footer
  doc.setDrawColor(...COLOR.border)
  doc.line(marginX, footerY, pageW - marginX, footerY)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8.5)
  doc.setTextColor(...COLOR.muted)
  doc.text('Thank you for choosing Atelier Pro.', pageW / 2, footerY + 5.5, { align: 'center' })
  doc.setFontSize(7.5)
  doc.setTextColor(...COLOR.faint)
  doc.text(`${BRAND.name} · ${BRAND.taxId}`, pageW / 2, footerY + 10, { align: 'center' })

  return doc
}

export function downloadInvoicePdf(invoice) {
  const doc = buildInvoicePdf(invoice)
  doc.save(`${invoice.id}.pdf`)
}
