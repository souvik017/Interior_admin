import { jsPDF } from 'jspdf'
import { clientsData } from '../data/mockData'

const BRAND = {
  name: 'Atelier Pro',
  tagline: 'Interior Design & Build Studio',
  addressLines: ['24 Riverside Design Quarter, Salt Lake', 'Kolkata 700091, West Bengal, India'],
  email: 'accounts@atelier.pro',
  phone: '+91 98300 12345',
  taxId: 'GSTIN 19AATFA1234C1Z5',
}

const COLOR = {
  primary: [175, 16, 26],
  primarySoft: [246, 226, 227],
  text: [25, 28, 29],
  muted: [104, 112, 118],
  faint: [150, 156, 161],
  border: [228, 230, 233],
  surface: [250, 250, 251],
}

const STATUS_COLOR = { Draft: COLOR.muted, Sent: [180, 130, 9], Approved: [22, 163, 74], Rejected: [186, 26, 26] }

function formatCurrency(value) {
  return `$${(Number(value) || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function formatDateLong(dateStr) {
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return dateStr
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

function findClient(clientName) {
  return clientsData.find((c) => c.name === clientName)
}

export function buildQuotationPdf(quotation) {
  const client = findClient(quotation.client)
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const pageW = doc.internal.pageSize.getWidth()
  const marginX = 16
  const contentW = pageW - marginX * 2

  doc.setFillColor(...COLOR.primary)
  doc.rect(0, 0, pageW, 3, 'F')

  let y = 16

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

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(24)
  doc.setTextColor(...COLOR.primary)
  doc.text('QUOTATION', pageW - marginX, y, { align: 'right' })

  doc.setFontSize(10.5)
  doc.setTextColor(...COLOR.text)
  doc.text(quotation.id, pageW - marginX, y + 6.5, { align: 'right' })

  const statusColor = STATUS_COLOR[quotation.status] || COLOR.muted
  const statusText = (quotation.status || 'Draft').toUpperCase()
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

  y += 9
  const colGap = 8
  const colW = (contentW - colGap) / 2

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.setTextColor(...COLOR.faint)
  doc.text('PREPARED FOR', marginX, y)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11.5)
  doc.setTextColor(...COLOR.text)
  doc.text(quotation.client, marginX, y + 6.5)

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

  const rightColX = marginX + colW + colGap
  const detailRows = [
    ['Quotation No.', quotation.id],
    ['Quote Date', formatDateLong(quotation.quoteDate)],
    ['Valid Until', formatDateLong(quotation.validUntil)],
    ['Project', quotation.project || '—'],
  ]
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.setTextColor(...COLOR.faint)
  doc.text('QUOTATION DETAILS', rightColX, y)

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

  const tableTop = y
  const cols = [
    { key: 'desc', label: 'Description', x: marginX, w: contentW * 0.46, align: 'left' },
    { key: 'unit', label: 'Unit', x: marginX + contentW * 0.46, w: contentW * 0.12, align: 'center' },
    { key: 'qty', label: 'Qty', x: marginX + contentW * 0.58, w: contentW * 0.1, align: 'center' },
    { key: 'rate', label: 'Rate', x: marginX + contentW * 0.68, w: contentW * 0.16, align: 'right' },
    { key: 'amount', label: 'Amount', x: marginX + contentW * 0.84, w: contentW * 0.16, align: 'right' },
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

  const items = quotation.lines || []
  let rowY = tableTop + 8
  const lineH = 5

  items.forEach((item, idx) => {
    const descLines = doc.splitTextToSize(item.description, cols[0].w - 4)
    const rowH = Math.max(10, descLines.length * lineH + 4)

    if (idx % 2 === 1) {
      doc.setFillColor(...COLOR.surface)
      doc.rect(marginX, rowY, contentW, rowH, 'F')
    }
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(...COLOR.text)
    doc.text(descLines, cols[0].x + 2, rowY + 6)
    doc.text(item.unit || '—', cols[1].x + cols[1].w / 2, rowY + 6, { align: 'center' })
    doc.text(String(item.qty), cols[2].x + cols[2].w / 2, rowY + 6, { align: 'center' })
    doc.text(formatCurrency(item.rate), cols[3].x + cols[3].w - 2, rowY + 6, { align: 'right' })
    doc.text(formatCurrency(item.amount), cols[4].x + cols[4].w - 2, rowY + 6, { align: 'right' })
    rowY += rowH
  })

  doc.setDrawColor(...COLOR.border)
  doc.line(marginX, rowY, pageW - marginX, rowY)

  let totalsY = rowY + 8
  const totalsLabelX = pageW - marginX - 55
  const totalsValueX = pageW - marginX

  const totalsRows = [
    ['Subtotal', quotation.subtotal],
    [`Tax (${quotation.taxRate || 0}%)`, quotation.taxAmount],
    ['Discount', -Math.abs(quotation.discount || 0)],
  ]
  totalsRows.forEach(([label, value]) => {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9.5)
    doc.setTextColor(...COLOR.muted)
    doc.text(label, totalsLabelX, totalsY)
    doc.setTextColor(...COLOR.text)
    doc.text(formatCurrency(value), totalsValueX, totalsY, { align: 'right' })
    totalsY += 6.5
  })

  totalsY += 1.5
  doc.setFillColor(...COLOR.primarySoft)
  doc.roundedRect(totalsLabelX - 6, totalsY - 5.5, 61, 10.5, 2, 2, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10.5)
  doc.setTextColor(...COLOR.primary)
  doc.text('Grand Total', totalsLabelX, totalsY + 1)
  doc.setFontSize(12.5)
  doc.text(formatCurrency(quotation.grandTotal), totalsValueX, totalsY + 1, { align: 'right' })

  let notesY = totalsY + 15
  if (quotation.notes) {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8.5)
    doc.setTextColor(...COLOR.text)
    doc.text('NOTES & TERMS', marginX, notesY)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8.5)
    doc.setTextColor(...COLOR.muted)
    const terms = doc.splitTextToSize(quotation.notes, contentW)
    doc.text(terms, marginX, notesY + 5)
  }

  const pageH = doc.internal.pageSize.getHeight()
  const footerY = pageH - 16
  doc.setDrawColor(...COLOR.border)
  doc.line(marginX, footerY, pageW - marginX, footerY)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8.5)
  doc.setTextColor(...COLOR.muted)
  doc.text('Thank you for considering Atelier Pro.', pageW / 2, footerY + 5.5, { align: 'center' })
  doc.setFontSize(7.5)
  doc.setTextColor(...COLOR.faint)
  doc.text(`${BRAND.name} · ${BRAND.taxId}`, pageW / 2, footerY + 10, { align: 'center' })

  return doc
}

export function downloadQuotationPdf(quotation) {
  const doc = buildQuotationPdf(quotation)
  doc.save(`${quotation.id}.pdf`)
}
