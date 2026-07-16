import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { documentsData } from '../data/mockData'
import { Icon } from '../components/ui/Icon'
import { PageHeader } from '../components/layout/PageHeader'
import { EmptyState } from '../components/ui'
import { Button } from '../components/ui/Button'
import { Dialog } from '../components/feedback/Dialog'
import { useToast } from '../components/feedback/Toast'

const categoryIcon = {
  Blueprint: 'architecture',
  Contract: 'gavel',
  Specification: 'description',
  Permit: 'verified',
  Handover: 'inventory_2',
}

const categories = ['Blueprint', 'Contract', 'Specification', 'Permit', 'Handover']

export function DocumentsPage() {
  const { showToast } = useToast()
  const fileInputRef = useRef(null)
  const [documents, setDocuments] = useState(documentsData)
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [uploadOpen, setUploadOpen] = useState(false)

  const filtered = documents.filter((doc) => {
    if (categoryFilter !== 'All' && doc.category !== categoryFilter) return false
    if (search && !doc.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const handleUpload = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    setDocuments((prev) => [
      {
        id: `DOC-${String(prev.length + 1).padStart(2, '0')}`,
        name: file.name,
        category: 'Specification',
        project: 'Unassigned',
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        uploadedBy: 'You',
        date: new Date().toISOString().slice(0, 10),
        blobUrl: URL.createObjectURL(file),
      },
      ...prev,
    ])
    showToast(`${file.name} uploaded.`, 'success')
    setUploadOpen(false)
    event.target.value = ''
  }

  const handleDelete = (id) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id))
    showToast('Document removed.', 'warning')
  }

  const handleDownload = (doc) => {
    if (doc.blobUrl) {
      // Real file the user uploaded this session — download the actual bytes
      const link = document.createElement('a')
      link.href = doc.blobUrl
      link.download = doc.name
      document.body.appendChild(link)
      link.click()
      link.remove()
    } else {
      // Seed/demo document — no real file content exists, so download a metadata placeholder
      const content = `${doc.name}\n${'='.repeat(doc.name.length)}\n\nCategory:     ${doc.category}\nProject:      ${doc.project}\nSize:         ${doc.size}\nUploaded by:  ${doc.uploadedBy}\nDate:         ${doc.date}\n\n(This is a demo placeholder — no real file is stored for seed documents.)\n`
      const blob = new Blob([content], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${doc.name.replace(/\.[^/.]+$/, '')}.txt`
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(url)
    }
    showToast(`${doc.name} downloaded.`, 'success')
  }

  const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } }
  const itemVariants = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6 select-none">
      <PageHeader
        eyebrow="Document Control"
        title="Documents"
        description="Blueprints, contracts, permits, and specs — all in one searchable repository."
        actions={[
          <Button key="upload" variant="primary" size="sm" icon="upload_file" onClick={() => setUploadOpen(true)}>
            Upload Document
          </Button>,
        ]}
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-md flex-1">
          <Icon name="search" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search documents..."
            className="w-full rounded-2xl border border-border bg-surface pl-11 pr-4 py-2.5 text-sm outline-none transition focus:border-primary/30 focus:ring-4 focus:ring-primary/10"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {['All', ...categories].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
                categoryFilter === cat
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'border border-border bg-surface text-muted hover:text-text'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon="folder_off" title="No documents found" description="Try a different search or category filter." />
      ) : (
        <motion.div variants={containerVariants} className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((doc) => (
            <motion.div
              key={doc.id}
              variants={itemVariants}
              className="rounded-2xl border border-border/80 bg-surface p-4 shadow-soft hover:-translate-y-0.5 hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon name={categoryIcon[doc.category] || 'description'} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-text truncate" title={doc.name}>{doc.name}</p>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted mt-0.5">{doc.category} · {doc.size}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-border/40 pt-3 text-[10px] font-bold text-muted">
                <span>{doc.project}</span>
                <span>{doc.date}</span>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-[10px] font-semibold text-muted">By {doc.uploadedBy}</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleDownload(doc)}
                    className="rounded-full p-1.5 text-muted hover:bg-primary/10 hover:text-primary transition"
                    aria-label={`Download ${doc.name}`}
                  >
                    <Icon name="download" className="text-base" />
                  </button>
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="rounded-full p-1.5 text-muted hover:bg-danger/10 hover:text-danger transition"
                    aria-label={`Remove ${doc.name}`}
                  >
                    <Icon name="delete" className="text-base" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      <Dialog open={uploadOpen} onClose={() => setUploadOpen(false)} title="Upload document" size="sm">
        <div className="space-y-4">
          <p className="text-xs font-semibold text-muted leading-relaxed">
            Upload a blueprint, contract, permit, or spec sheet to the shared repository.
          </p>
          <input ref={fileInputRef} type="file" onChange={handleUpload} className="hidden" />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border/80 bg-surface-2/20 p-8 text-center hover:border-primary/50 hover:bg-surface-2/50 transition-all"
          >
            <Icon name="upload_file" className="text-2xl text-primary" />
            <span className="text-sm font-bold text-text">Choose a file</span>
            <span className="text-xs font-semibold text-muted">PDF, DOCX, XLSX up to 25MB</span>
          </button>
        </div>
      </Dialog>
    </motion.div>
  )
}
