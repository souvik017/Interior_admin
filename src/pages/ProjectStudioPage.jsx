import { useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Icon } from '../components/ui/Icon'
import { Button } from '../components/ui/Button'
import { Drawer, Dialog } from '../components/feedback/Dialog'
import { Checkbox } from '../components/forms/Checkbox'
import { useToast } from '../components/feedback/Toast'

function downloadTextFile(filename, content) {
  const blob = new Blob([content], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

const galleryItems = [
  {
    title: 'Hardwood Installation',
    date: '24 Oct, 2023',
    location: 'NYC, NY',
    time: '14:32 PM',
    status: 'In Progress',
    room: 'Living Room',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDCLGiBEFOGnCtGbHq3HN4cGMXYaPIj5Tabei33V4FYdOgFLhX4ENyYRd4QhrOxjwxks3VldQYTzkeAQiu35Qes8crIL1GFMFS9UrFF8tH2DXDoWkrQ1UtFWRV-nYdwDI-X-EFHAvtv-0HPXWGzyKsLM0ZLCIfhG1xXxdvPK3vQJelmUX4Sk8SrkY5jmKs3AqtAgG9juXC8F-lON-g7Dsv2O0jgocG3ezYR_Quc-wtGloiK9H5YG0tOg2DpzMCetKKFktSGmoaTNvE',
  },
  {
    title: 'Final Inspection: Island',
    date: '21 Oct, 2023',
    note: 'Verified material spec for Calacatta Gold. No defects found.',
    status: 'Completed',
    room: 'Kitchen',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBbJvvtqIgvZYwIeZd88m29BRUg1430zWAGGA-Q7HJLWmpkEAdZPPVl7r555oMxFO6qnEMrlZMGl8XGUPTfBHLnCKsVbyiXBL9gtUuMwzTAt8X4FAwjf6Rshb13xhYi38B_sPhszYYZoCZBlfrTYtN3gmaLrIwS_75zIFHjgFXvd2_J0CY60U1y3oZy4mZqqFODNQjesg98JFlt63bSE6vinOIjD_60mUtC3yazQ6pJWShK4yat5sl0ouKq63MDY5cA-71KJN5w8yI',
  },
  {
    title: 'Pre-Wall Structural',
    date: '15 Oct, 2023',
    note: 'Logged by Marcus G.',
    status: 'Before',
    room: 'Master Bed',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAV5JDfYffDqZisZOHt8fhLVqV4KuLt1t-ZvqGOe3ZQPLDvtACmByBcNEpSEDOx7zlDyBOMtZ7Jvn3j4Olq8cxZKJF0iQEL2nHMbZExDS2cYXq4YtxUfyA40l8UKbpkS0MHGeH571o33pRD4-wQrlkw2q6p-RkoDt_VWbRrPESAWuIv3OL_a7FlGTzkmH-3gKslr7oGjpMZ7-Ewz5SP1Omx18y-DEDEvs9TL4djwcyZTrhPFTjo33xwgYFfN-8iBNVSyRvdZFbMu6o',
  },
  {
    title: 'Joinery Hardware Fix',
    date: '23 Oct, 2023',
    note: 'GPS 40.7128 N, ALT 32.4 m',
    status: 'In Progress',
    room: 'Hardware',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBMdEGGh49hh1K96Uxa4-4pi9BnusdnXjwMbKw-wA0d2jqxE3YA7JTqH5X-U0J0-S__ccjjIe4zF8EIFd33aenxr6Z0LI-r5Nki0qiuVp83nKkxDkTkS2O7ZRUzrB2wrUEvXB3-brMEZ3y8SAg5-AmxtUj4Eg2sav1vOHYfszzTxiyiX-svjhNigc0OEufRFX9karOujuc72msM3H7YChCbNcWpQ6sbv4JcKdplYmc-agiQrm508qw3ii4vjgNRmXCBaKZ6bSoRM4I',
  },
  {
    title: 'Floor Tiling: Master Bath',
    date: '22 Oct, 2023',
    note: 'Batch #45-A Gray Slate',
    status: 'In Progress',
    room: 'Bathroom',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBdV4OsY2BcVYHwgPFFqnjLpQWy6mzTeu-HdKDI1Zqft5pFFa3ZcRCrdgfgTA_dyFKNowB1RBqaeH0RG4koYW8wtQi4_zEoqI9-DT-npSSLfe-vmluFuoOubUkSQmsaEvD5falrOhfCUWD4bkZxdIJGJjDTrGNDsJw6wvZbmY2NJYJGJCoGwddtvOR5SZe51_se6wmwPQE3fFJgzoNKbtW3jkpsXkSkqIBbbXOzYfq8TuJo_61JTJx_Yu0RMKOmwT0jz6zrlfsrfV8',
  },
]

const galleryFilterLabels = ['Grid', 'Timeline', 'By Room']

const aiNotes = [
  {
    tone: 'primary',
    title: 'Material Mismatch',
    text: "Marble slab 'Calacatta Vagli' shows different veining density than specified in the master render.",
  },
  {
    tone: 'tertiary',
    title: 'Alignment Warning',
    text: 'Floor transition strips are 12mm off-center from the structural column axis.',
  },
]

const statusOptions = ['In Progress', 'Completed', 'Before']

export function ProjectStudioPage() {
  const { showToast } = useToast()
  const location = useLocation()
  const projectName = location.state?.projectName || 'Serene Heights Penthouse'
  const fileInputRef = useRef(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [filterIdx, setFilterIdx] = useState(0)

  // Interactive slider compare value (percent)
  const [sliderVal, setSliderVal] = useState(75)
  const [activePhoto, setActivePhoto] = useState(null)

  const [items, setItems] = useState(galleryItems)
  const [filterPanelOpen, setFilterPanelOpen] = useState(false)
  const [statusFilters, setStatusFilters] = useState([])
  const [addPhotoOpen, setAddPhotoOpen] = useState(false)
  const [renderCompareOpen, setRenderCompareOpen] = useState(false)

  const visibleItems = statusFilters.length
    ? items.filter((item) => statusFilters.includes(item.status))
    : items

  const renderGalleryCard = (item, isMasonry = true) => (
    <motion.article
      key={item.title}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.2 }}
      onClick={() => setActivePhoto(item)}
      className={`${
        isMasonry ? 'masonry-item' : ''
      } overflow-hidden rounded-[1.6rem] border border-border/70 bg-surface/90 shadow-soft transition-all duration-300 cursor-zoom-in hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(15,23,42,0.08)]`}
    >
      <div
        className="relative overflow-hidden"
        style={{
          aspectRatio: !isMasonry
            ? '4 / 3'
            : item.room === 'Kitchen'
              ? '1 / 1'
              : item.room === 'Master Bed'
                ? '3 / 2'
                : '4 / 5',
        }}
      >
        <img
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
          alt={item.title}
          src={item.image}
          loading="lazy"
        />
        <div className="absolute left-3.5 top-3.5 flex gap-2">
          <span
            className={`rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
              item.status === 'Completed'
                ? 'bg-emerald-500 text-white'
                : item.status === 'Before'
                  ? 'bg-orange-500 text-white'
                  : 'bg-surface text-text border border-border'
            }`}
          >
            {item.status}
          </span>
          <span className="rounded-full bg-navy-deep/90 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
            {item.room}
          </span>
        </div>
      </div>

      <div className="p-4.5">
        <div className="mb-2 flex items-start justify-between gap-3">
          <h4 className="text-sm font-bold text-text truncate">{item.title}</h4>
          <span className="text-[10px] font-bold text-muted shrink-0">{item.date}</span>
        </div>
        {item.location && (
          <div className="flex items-center gap-4 text-[10px] font-semibold text-muted select-none">
            <span className="flex items-center gap-1">
              <Icon name="location_on" className="text-[14px]" />
              {item.location}
            </span>
            <span className="flex items-center gap-1">
              <Icon name="schedule" className="text-[14px]" />
              {item.time}
            </span>
          </div>
        )}
        {item.note && <p className="mt-2 text-[10px] font-semibold italic text-muted leading-relaxed">{item.note}</p>}
      </div>
    </motion.article>
  )

  const groupedItems = (() => {
    if (filterIdx === 1) {
      const groups = {}
      visibleItems.forEach((item) => {
        const key = item.date
        if (!groups[key]) groups[key] = []
        groups[key].push(item)
      })
      return Object.entries(groups)
    }
    if (filterIdx === 2) {
      const groups = {}
      visibleItems.forEach((item) => {
        const key = item.room || 'Unsorted'
        if (!groups[key]) groups[key] = []
        groups[key].push(item)
      })
      return Object.entries(groups)
    }
    return null
  })()

  const toggleStatusFilter = (status) => {
    setStatusFilters((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status],
    )
  }

  const handleGenerateReport = () => {
    downloadTextFile(
      `qc-report-${projectName.toLowerCase().replace(/\s+/g, '-')}.txt`,
      `QC Report — ${projectName}\nMatch Score: 84%\n\nFindings:\n${aiNotes
        .map((n) => `- [${n.title}] ${n.text}`)
        .join('\n')}\n`,
    )
    showToast('QC report generated and downloaded.', 'success')
  }

  const handleDownloadAudit = () => {
    downloadTextFile(
      `full-audit-${projectName.toLowerCase().replace(/\s+/g, '-')}.txt`,
      `Full Site Audit — ${projectName}\n\nCritical Material Alert: Dining Area slab exceeds thickness deviation by 4mm.\nOptimization Suggestion: Tilt recessed ceiling lighting fixtures to 15°.\n`,
    )
    showToast('Full audit downloaded.', 'success')
  }

  const handleAddPhotoFile = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    const objectUrl = URL.createObjectURL(file)
    setItems((prev) => [
      {
        title: file.name.replace(/\.[^/.]+$/, ''),
        date: new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
        note: 'Uploaded from site device.',
        status: 'In Progress',
        room: 'Unsorted',
        image: objectUrl,
      },
      ...prev,
    ])
    showToast('Photo added to the gallery.', 'success')
    setAddPhotoOpen(false)
    event.target.value = ''
  }

  return (
    <div className="space-y-6 select-none">
      <div className="rounded-[2rem] border border-border/70 bg-surface/80 p-5 shadow-soft backdrop-blur-xl sm:p-6">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-primary">QC &amp; Photo Audit</p>
            <h2 className="text-3xl font-extrabold tracking-tight text-text sm:text-4xl mt-1">
              Photo Gallery &amp; QC
            </h2>
            <p className="mt-1 text-sm font-semibold text-muted">
              Project: {projectName} • Site Quality Control
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex rounded-full border border-border bg-surface p-1 relative select-none">
              {galleryFilterLabels.map((label, index) => {
                const active = filterIdx === index
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setFilterIdx(index)}
                    className={`relative rounded-full px-4.5 py-1.5 text-xs font-bold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
                      active ? 'text-on-primary' : 'text-muted hover:text-text'
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="gallery-tabs-active"
                        transition={{ type: 'spring', duration: 0.45, bounce: 0.15 }}
                        className="absolute inset-0 rounded-full bg-primary z-0"
                      />
                    )}
                    <span className="relative z-10">{label}</span>
                  </button>
                )
              })}
            </div>
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                icon="filter_list"
                className="rounded-full"
                onClick={() => setFilterPanelOpen((prev) => !prev)}
              >
                Filters{statusFilters.length > 0 ? ` (${statusFilters.length})` : ''}
              </Button>
              <AnimatePresence>
                {filterPanelOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                    className="absolute right-0 top-[110%] z-30 w-56 rounded-2xl border border-border bg-surface p-3.5 shadow-xl"
                  >
                    <p className="mb-2.5 text-[10px] font-bold uppercase tracking-wider text-muted px-1">
                      Filter by status
                    </p>
                    <div className="space-y-2">
                      {statusOptions.map((status) => (
                        <Checkbox
                          key={status}
                          label={status}
                          checked={statusFilters.includes(status)}
                          onChange={() => toggleStatusFilter(status)}
                        />
                      ))}
                    </div>
                    {statusFilters.length > 0 && (
                      <button
                        onClick={() => setStatusFilters([])}
                        className="mt-3 text-[10px] font-bold uppercase tracking-wider text-primary hover:underline"
                      >
                        Clear filters
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <Button variant="outline" size="sm" icon="auto_awesome" className="rounded-full" onClick={() => setDrawerOpen(true)}>
              AI View
            </Button>
          </div>
        </div>
      </div>

      <div className="rounded-[2rem] border border-border/70 bg-surface/90 p-5 shadow-soft sm:p-6">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-tertiary/10 text-tertiary border border-tertiary/10">
              <Icon name="auto_awesome" />
            </div>
            <div>
              <h3 className="font-bold text-text text-base sm:text-lg tracking-tight">AI Photo Quality Control</h3>
              <p className="text-xs font-semibold text-muted">
                Comparing Live Site Image vs. 3D Render Specifications
              </p>
            </div>
          </div>
          <span className="rounded-full bg-primary/10 text-primary border border-primary/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
            Live Analysis
          </span>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          {/* Slider box */}
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl border border-border bg-surface-2 select-none group">
            {/* Render (Background / Left side when clipped) */}
            <img
              className="absolute inset-0 h-full w-full object-cover"
              alt="3D interior render of a luxury living room"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDHDJfnTRrWlEBVc6gUNHxhBiKVItTKw1R6Levldjz1NUB-Ufv7n8AqZM4u4MITP4pdCEgDlYfKQP9xx0q5H5C-g5GSWvakxbxg_PH2ZsCSvlzMA3fjM9JEizak1bC8lB9QK9E1RnT4li659REwblq2Hj0-bfEIW0VijSKHzEh6TJOki-PoZEz-Fp0ktFv_RXeX1B-N82JnOC0c7vw0iLYmrpdyGUXa5A6M6d2PQC13u87br77z9GAkJpzdIXLy02zOFTT_dqsjHws"
            />
            
            {/* Real site photo (Foreground / Right side, clipped via clip-path) */}
            <img
              className="absolute inset-0 h-full w-full object-cover transition-all"
              style={{
                clipPath: `polygon(${sliderVal}% 0, 100% 0, 100% 100%, ${sliderVal}% 100%)`
              }}
              alt="Real site photo of a living room under construction"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB8fJPhaG8MAtMOdh9iil43NqdKKuNWLJdIrXXcDxShYjb6H16lLL-cGcPTJBNaGpO1c2xB6i9HDpa5PbKA6RT46Fe4N1TF3HN9thGEJN1UUCtEJD0WFgiQZNIVAiK_k2vjgOIFoQL7ouhWVPkivnOE2j4f7oWB--EFuj7gUvz-Rs0v8JEU9jbr5iVfAVYRi-uSEGOaZemYnU3_HdbJXjbt0l8dU31FGFb6SM7-PAjJKS5UDk8UbsDg15UQo8u9AlSBaLgo7OfY_Mo"
            />

            {/* Labels overlay */}
            <div className="absolute left-4 bottom-4 z-10 bg-black/60 backdrop-blur-md text-white px-3 py-1.5 rounded-xl text-xs font-bold pointer-events-none">
              Original 3D Design
            </div>
            <div className="absolute right-4 bottom-4 z-10 bg-black/60 backdrop-blur-md text-white px-3 py-1.5 rounded-xl text-xs font-bold pointer-events-none">
              Actual Site Work
            </div>

            {/* Border line */}
            <div
              className="absolute inset-y-0 z-10 w-[2px] bg-primary pointer-events-none"
              style={{ left: `${sliderVal}%`, transform: 'translateX(-50%)' }}
            />

            {/* Slider bar range input overlay */}
            <input
              type="range"
              min="0"
              max="100"
              value={sliderVal}
              onChange={(e) => setSliderVal(Number(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20 slider-input"
              aria-label="QC image comparator slider"
            />

            {/* Custom slider button indicator */}
            <div
              className="absolute inset-y-0 z-10 pointer-events-none flex items-center"
              style={{ left: `${sliderVal}%`, transform: 'translateX(-50%)' }}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-on-primary shadow-lg ring-4 ring-primary/20">
                <Icon name="unfold_more_double" className="text-[18px] rotate-90" />
              </div>
            </div>
          </div>

          {/* QC Details */}
          <div className="space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="rounded-2xl border border-border bg-surface-2/40 p-4">
                <div className="mb-2.5 flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted">
                    Deviation Detected
                  </span>
                  <span className="text-xs font-bold text-primary">84% Match Score</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-surface-3">
                  <div className="h-full bg-primary rounded-full transition-all duration-300" style={{ width: '84%' }} />
                </div>
              </div>

              <ul className="space-y-2.5">
                {aiNotes.map((note) => (
                  <li
                    key={note.title}
                    className={[
                      'flex items-start gap-3 rounded-2xl border p-3.5',
                      note.tone === 'primary'
                        ? 'border-danger/10 bg-danger/5'
                        : 'border-tertiary/10 bg-tertiary/5',
                    ].join(' ')}
                  >
                    <Icon
                      name={note.tone === 'primary' ? 'warning' : 'info'}
                      className={[
                        'text-[20px] shrink-0 mt-0.5',
                        note.tone === 'primary' ? 'text-danger' : 'text-tertiary',
                      ].join(' ')}
                    />
                    <div className="text-xs">
                      <p className="font-bold text-text leading-tight">{note.title}</p>
                      <p className="mt-1 font-semibold text-muted leading-relaxed">{note.text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <Button variant="primary" className="w-full justify-center" icon="assessment" onClick={handleGenerateReport}>
              Generate QC Report
            </Button>
          </div>
        </div>
      </div>

      {/* Gallery View (Grid, Timeline, or By Room) */}
      {visibleItems.length === 0 ? (
        <div className="rounded-[2rem] border border-dashed border-border/80 bg-surface/40 p-10 text-center">
          <Icon name="filter_alt_off" className="text-3xl text-muted/50" />
          <p className="mt-2 text-sm font-bold text-text">No photos match the selected filters</p>
          <button
            onClick={() => setStatusFilters([])}
            className="mt-2 text-xs font-bold text-primary hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : filterIdx === 0 ? (
        /* Grid View (Standard grid layout) */
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence>
            {visibleItems.map((item) => renderGalleryCard(item, false))}
          </AnimatePresence>
        </div>
      ) : filterIdx === 1 ? (
        /* Timeline View */
        <div className="relative pl-6 sm:pl-8 border-l border-border/80 ml-4 space-y-8 py-2">
          {groupedItems.map(([date, dateItems]) => (
            <div key={date} className="relative space-y-4">
              {/* Timeline marker node */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary border-4 border-surface shadow-sm" />
              <div>
                <h4 className="text-sm font-bold text-primary tracking-wider uppercase select-none">{date}</h4>
                <p className="text-xs font-semibold text-muted">
                  {dateItems.length} {dateItems.length === 1 ? 'photo' : 'photos'}
                </p>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                {dateItems.map((item) => renderGalleryCard(item, false))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* By Room View */
        <div className="space-y-8">
          {groupedItems.map(([room, roomItems]) => (
            <div key={room} className="space-y-4">
              <div className="flex items-center gap-3 border-b border-border/40 pb-2">
                <span className="rounded-xl bg-primary/10 text-primary border border-primary/15 px-3 py-1 text-xs font-bold uppercase tracking-wider">
                  {room}
                </span>
                <p className="text-xs font-semibold text-muted">
                  {roomItems.length} {roomItems.length === 1 ? 'photo' : 'photos'}
                </p>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                {roomItems.map((item) => renderGalleryCard(item, false))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Slide-out AI insights drawer */}
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title="AI Insights">
        <div className="space-y-5">
          <div className="rounded-2xl border border-danger/20 bg-danger/5 p-4.5">
            <h4 className="mb-2 flex items-center gap-2 text-xs sm:text-sm font-bold text-danger">
              <Icon name="priority_high" className="text-[18px]" />
              Critical Material Alert
            </h4>
            <p className="text-xs leading-relaxed font-semibold text-muted">
              The current slab installation in the <strong>Dining Area</strong> exceeds the
              allowed thickness deviation by 4mm. This may affect flush cabinet alignment parameters.
            </p>
            <button
              onClick={() => setRenderCompareOpen(true)}
              className="mt-3 text-[10px] font-bold uppercase tracking-wider text-danger hover:underline"
            >
              View Comparative Render
            </button>
          </div>

          <div className="rounded-2xl border border-tertiary/20 bg-tertiary/5 p-4.5">
            <h4 className="mb-2 flex items-center gap-2 text-xs sm:text-sm font-bold text-tertiary">
              <Icon name="lightbulb" className="text-[18px]" />
              Optimization Suggestion
            </h4>
            <p className="text-xs leading-relaxed font-semibold text-muted">
              Based on site lighting logs, we suggest tilting the recessed ceiling lighting fixtures
              to 15° to reduce harsh reflections on the marble.
            </p>
          </div>

          <Button variant="primary" className="w-full justify-center mt-4" icon="download" onClick={handleDownloadAudit}>
            Download Full Audit
          </Button>
        </div>
      </Drawer>

      {/* Floating Add Photo Button */}
      <button
        onClick={() => setAddPhotoOpen(true)}
        className="fixed bottom-20 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-on-primary shadow-glow hover:bg-primary-soft transition-transform active:scale-90 md:bottom-8 md:right-8"
        aria-label="Capture photo"
      >
        <Icon name="add_a_photo" filled />
      </button>

      {/* Add Photo dialog */}
      <Dialog open={addPhotoOpen} onClose={() => setAddPhotoOpen(false)} title="Add site photo" size="sm">
        <div className="space-y-4">
          <p className="text-xs font-semibold text-muted leading-relaxed">
            Upload a photo from this device to add it to the QC gallery.
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAddPhotoFile}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border/80 bg-surface-2/20 p-8 text-center hover:border-primary/50 hover:bg-surface-2/50 transition-all"
          >
            <Icon name="add_a_photo" className="text-2xl text-primary" />
            <span className="text-sm font-bold text-text">Choose a photo</span>
            <span className="text-xs font-semibold text-muted">JPG, PNG up to 10MB</span>
          </button>
        </div>
      </Dialog>

      {/* Comparative render dialog */}
      <Dialog open={renderCompareOpen} onClose={() => setRenderCompareOpen(false)} title="Comparative render — Dining Area" size="lg">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-muted">Original 3D Design</p>
            <img
              className="w-full aspect-[4/3] object-cover rounded-2xl border border-border"
              alt="Original 3D interior render"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDHDJfnTRrWlEBVc6gUNHxhBiKVItTKw1R6Levldjz1NUB-Ufv7n8AqZM4u4MITP4pdCEgDlYfKQP9xx0q5H5C-g5GSWvakxbxg_PH2ZsCSvlzMA3fjM9JEizak1bC8lB9QK9E1RnT4li659REwblq2Hj0-bfEIW0VijSKHzEh6TJOki-PoZEz-Fp0ktFv_RXeX1B-N82JnOC0c7vw0iLYmrpdyGUXa5A6M6d2PQC13u87br77z9GAkJpzdIXLy02zOFTT_dqsjHws"
            />
          </div>
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-muted">Actual Site Work</p>
            <img
              className="w-full aspect-[4/3] object-cover rounded-2xl border border-border"
              alt="Actual site photo"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB8fJPhaG8MAtMOdh9iil43NqdKKuNWLJdIrXXcDxShYjb6H16lLL-cGcPTJBNaGpO1c2xB6i9HDpa5PbKA6RT46Fe4N1TF3HN9thGEJN1UUCtEJD0WFgiQZNIVAiK_k2vjgOIFoQL7ouhWVPkivnOE2j4f7oWB--EFuj7gUvz-Rs0v8JEU9jbr5iVfAVYRi-uSEGOaZemYnU3_HdbJXjbt0l8dU31FGFb6SM7-PAjJKS5UDk8UbsDg15UQo8u9AlSBaLgo7OfY_Mo"
            />
          </div>
        </div>
        <p className="mt-4 text-xs font-semibold text-muted leading-relaxed">
          The slab installation is offset by 4mm from the original render, which may affect flush cabinet alignment.
        </p>
      </Dialog>

      {/* Lightbox photo modal */}
      <Dialog open={!!activePhoto} onClose={() => setActivePhoto(null)} title={activePhoto?.title} size="xl">
        {activePhoto && (
          <div className="flex flex-col items-center">
            <img
              src={activePhoto.image}
              alt={activePhoto.title}
              className="w-full max-h-[70vh] object-contain rounded-2xl bg-black/5 border border-border"
            />
            <div className="w-full mt-4 flex items-center justify-between gap-3">
              <p className="flex items-center gap-1.5 text-xs font-semibold text-muted">
                <Icon name="meeting_room" className="text-sm" />
                {activePhoto.room} · {activePhoto.date}
              </p>
              <span
                className={`shrink-0 rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                  activePhoto.status === 'Completed'
                    ? 'bg-emerald-500 text-white'
                    : activePhoto.status === 'Before'
                      ? 'bg-orange-500 text-white'
                      : 'bg-surface-2 text-text border border-border'
                }`}
              >
                {activePhoto.status}
              </span>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  )
}

