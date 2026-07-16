import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Icon } from '../components/ui/Icon'
import { PageHeader } from '../components/layout/PageHeader'
import { AvatarGroup, ProgressBar } from '../components/ui'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Dialog } from '../components/feedback/Dialog'
import { Input } from '../components/forms/Input'
import { Select } from '../components/forms/Select'
import { useToast } from '../components/feedback/Toast'

const wingOptions = ['North Wing', 'South Wing', 'East Wing', 'West Wing']

const project = {
  status: 'ACTIVE PROJECT',
  id: 'SP-2024-089',
  name: 'Skyline Penthouse — 42nd Floor',
  description:
    'High-end contemporary renovation focusing on open-concept living and bespoke Italian modular systems. Total area: 4,200 sq.ft.',
  team: ['JD', 'MK', 'AR', 'SL', '+4'],
  overallProgress: 68,
}

const roomsData = [
  {
    id: 'living-room',
    name: 'Living Room',
    area: '1,250 sq.ft',
    wing: 'North Wing',
    stage: 'In Progress',
    stageTone: 'primary',
    completion: 45,
    team: ['JD', 'MK'],
    image:
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80',
  },
  {
    id: 'master-bedroom',
    name: 'Master Bedroom',
    area: '850 sq.ft',
    wing: 'East Wing',
    stage: 'Design Phase',
    stageTone: 'neutral',
    completion: 12,
    team: ['AR'],
    image:
      'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&q=80',
  },
  {
    id: 'modular-kitchen',
    name: 'Modular Kitchen',
    area: '600 sq.ft',
    wing: 'South Wing',
    stage: 'Almost Done',
    stageTone: 'success',
    completion: 92,
    team: ['JD', 'MK', 'SL'],
    image:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
  },
]

const stageBadgeClasses = {
  primary: 'bg-surface/90 text-text border border-border/80',
  neutral: 'bg-surface/90 text-text border border-border/80',
  success: 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/15',
}

const progressBarColor = (value) =>
  value >= 80 ? 'bg-emerald-500' : 'bg-primary'

function RoomCard({ room, onQuickView, onEdit, onDuplicate, onDelete }) {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <Card className="overflow-hidden p-0 flex flex-col h-full group" hoverLift>
      {/* Image + badge overlay */}
      <div className="relative h-40 w-full overflow-hidden bg-surface-2 sm:h-48 select-none">
        <img
          src={room.image}
          alt={room.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-103"
          loading="lazy"
        />
        <div className="absolute right-3 top-3">
          <span
            className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider shadow-sm ${
              stageBadgeClasses[room.stageTone] || stageBadgeClasses.neutral
            }`}
          >
            {room.stage}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="truncate text-base font-bold text-text tracking-tight">{room.name}</h3>
              <p className="mt-1 text-xs font-semibold text-muted">
                Area: {room.area} <span className="text-border mx-1">|</span> {room.wing}
              </p>
            </div>

            <div className="relative shrink-0">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition hover:bg-surface-2 hover:text-text"
                aria-label="Room options"
                aria-haspopup="true"
                aria-expanded={menuOpen}
              >
                <Icon name="more_vert" />
              </button>
              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    onMouseLeave={() => setMenuOpen(false)}
                    className="absolute right-0 z-10 mt-1 w-40 overflow-hidden rounded-xl border border-border bg-surface shadow-xl"
                  >
                    {[
                      ['Edit room', () => onEdit(room)],
                      ['Duplicate', () => onDuplicate(room)],
                      ['Delete room', () => onDelete(room)],
                    ].map(([option, action]) => (
                      <button
                        key={option}
                        onClick={() => {
                          setMenuOpen(false)
                          action()
                        }}
                        className={`block w-full px-4 py-2.5 text-left text-xs font-semibold transition hover:bg-surface-2 ${
                          option === 'Delete room' ? 'text-danger' : 'text-text'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between select-none">
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted">
                Completion
              </span>
              <span className="text-xs font-extrabold text-primary">{room.completion}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
              <div
                className={`h-full rounded-full transition-all duration-500 ${progressBarColor(room.completion)}`}
                style={{ width: `${room.completion}%` }}
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between gap-3 pt-3 border-t border-border/30">
          <AvatarGroup items={room.team} onItemClick={(initials) => navigate('/team', { state: { initials } })} />
          <button
            onClick={() => onQuickView(room)}
            className="flex shrink-0 items-center gap-1 text-xs font-bold text-text hover:text-primary transition"
          >
            Quick View
            <Icon name="arrow_forward" className="text-sm" />
          </button>
        </div>
      </div>
    </Card>
  )
}

function RoomImagePicker({ image, onSelect, label = 'Room photo' }) {
  const fileInputRef = useRef(null)

  return (
    <div className="space-y-1.5 w-full">
      <label className="block text-[11px] font-bold uppercase tracking-[0.24em] text-muted">{label}</label>
      <input ref={fileInputRef} type="file" accept="image/*" onChange={onSelect} className="hidden" />
      {image ? (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="group relative block h-40 w-full overflow-hidden rounded-2xl border border-border"
        >
          <img src={image} alt="Room preview" className="h-full w-full object-cover" />
          <div className="absolute inset-0 flex items-center justify-center gap-1.5 bg-navy/0 text-transparent transition-all group-hover:bg-navy/50 group-hover:text-white">
            <Icon name="photo_camera" className="text-lg" />
            <span className="text-xs font-bold">Change photo</span>
          </div>
        </button>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex h-40 w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border/80 bg-surface-2/20 text-center hover:border-primary/50 hover:bg-surface-2/50 transition-all"
        >
          <Icon name="add_a_photo" className="text-2xl text-primary" />
          <span className="text-xs font-bold text-text">Upload a room photo</span>
          <span className="text-[10px] font-semibold text-muted">JPG, PNG up to 10MB</span>
        </button>
      )}
    </div>
  )
}

function AddRoomCard({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex min-h-[280px] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-border/80 bg-surface-2/20 p-6 text-center hover:border-primary/50 hover:bg-surface-2/50 transition-all duration-300 group"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:scale-105 transition-transform duration-200">
        <Icon name="add" className="text-2xl" />
      </span>
      <p className="mt-4 text-sm font-bold text-text">Add New Room</p>
      <p className="mt-1 text-xs font-semibold text-muted">Define dimensions, materials, and teams</p>
    </button>
  )
}

const placeholderRoomImage =
  'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80'

export function RoomManagementPage() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const goToTeamMember = (initials) => navigate('/team', { state: { initials } })
  const [showSuggestion, setShowSuggestion] = useState(true)
  const [rooms, setRooms] = useState(roomsData)

  const [quickViewRoom, setQuickViewRoom] = useState(null)
  const [editingRoom, setEditingRoom] = useState(null)
  const [deleteConfirmRoom, setDeleteConfirmRoom] = useState(null)
  const [addRoomOpen, setAddRoomOpen] = useState(false)
  const [roomForm, setRoomForm] = useState({ name: '', area: '', wing: wingOptions[0], image: null })

  const handleRoomFormImageSelect = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    setRoomForm((prev) => ({ ...prev, image: URL.createObjectURL(file) }))
    event.target.value = ''
  }

  const handleEditingRoomImageSelect = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    setEditingRoom((prev) => ({ ...prev, image: URL.createObjectURL(file) }))
    event.target.value = ''
  }

  const handleScheduleNow = () => {
    showToast('Lighting inspection scheduled for Thursday.', 'success')
    setShowSuggestion(false)
  }

  const handleDuplicateRoom = (room) => {
    setRooms((prev) => [
      ...prev,
      { ...room, id: `${room.id}-copy-${Date.now()}`, name: `${room.name} (Copy)` },
    ])
    showToast(`${room.name} duplicated.`, 'success')
  }

  const handleConfirmDelete = () => {
    setRooms((prev) => prev.filter((r) => r.id !== deleteConfirmRoom.id))
    showToast(`${deleteConfirmRoom.name} deleted.`, 'warning')
    setDeleteConfirmRoom(null)
  }

  const handleEditSave = (event) => {
    event.preventDefault()
    setRooms((prev) => prev.map((r) => (r.id === editingRoom.id ? editingRoom : r)))
    showToast(`${editingRoom.name} updated.`, 'success')
    setEditingRoom(null)
  }

  const handleAddRoom = (event) => {
    event.preventDefault()
    if (!roomForm.name.trim() || !roomForm.area.trim()) return
    setRooms((prev) => [
      ...prev,
      {
        id: `room-${Date.now()}`,
        name: roomForm.name.trim(),
        area: roomForm.area.trim(),
        wing: roomForm.wing,
        stage: 'Design Phase',
        stageTone: 'neutral',
        completion: 0,
        team: [],
        image: roomForm.image || placeholderRoomImage,
      },
    ])
    showToast(`${roomForm.name.trim()} added.`, 'success')
    setRoomForm({ name: '', area: '', wing: wingOptions[0], image: null })
    setAddRoomOpen(false)
  }

  const closeAddRoom = () => {
    setAddRoomOpen(false)
    setRoomForm({ name: '', area: '', wing: wingOptions[0], image: null })
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <PageHeader
        eyebrow="Room Coordination"
        title="Room management"
        description="Track checklists, layouts, finishes, and handover deadlines at the single-space resolution."
      />

      {/* Project banner */}
      <motion.div variants={itemVariants}>
        <Card className="p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-primary" />
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 select-none">
                <span className="rounded-full bg-primary px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-on-primary">
                  {project.status}
                </span>
                <span className="text-xs font-bold text-muted">ID: {project.id}</span>
              </div>
              <h2 className="mt-3 text-xl font-extrabold text-text tracking-tight sm:text-2xl">{project.name}</h2>
              <p className="mt-2 max-w-3xl text-sm font-semibold text-muted leading-relaxed">{project.description}</p>
            </div>

            <div className="flex items-center justify-between gap-5 border-t border-border/30 pt-4 lg:border-t-0 lg:pt-0 lg:flex-col lg:items-end lg:justify-start lg:gap-3 shrink-0">
              <AvatarGroup items={project.team} onItemClick={goToTeamMember} />
              <div className="text-right">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted select-none">
                  Overall Progress
                </p>
                <p className="text-2xl font-extrabold text-primary sm:text-3xl mt-0.5">{project.overallProgress}%</p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Room cards list */}
      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
      >
        {rooms.map((room) => (
          <motion.div key={room.id} variants={itemVariants}>
            <RoomCard
              room={room}
              onQuickView={setQuickViewRoom}
              onEdit={setEditingRoom}
              onDuplicate={handleDuplicateRoom}
              onDelete={setDeleteConfirmRoom}
            />
          </motion.div>
        ))}
        <motion.div variants={itemVariants}>
          <AddRoomCard onClick={() => setAddRoomOpen(true)} />
        </motion.div>
      </motion.div>

      {/* AI Suggestion box */}
      <AnimatePresence>
        {showSuggestion && (
          <motion.div
            variants={itemVariants}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col gap-4 rounded-3xl border border-border bg-surface/90 p-5 shadow-soft relative overflow-hidden sm:flex-row sm:items-center sm:justify-between sm:gap-6"
          >
            <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-primary" />
            <div className="flex items-start gap-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon name="auto_awesome" className="text-base" />
              </span>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-primary">
                  AI Suggestion
                </p>
                <p className="mt-1 text-xs sm:text-sm font-semibold text-muted leading-relaxed">
                  Based on assembly logs in <span className="font-bold text-text">Modular Kitchen</span>,
                  we suggest scheduling final lighting inspections for next Thursday. This resolves a
                  pending conflict in dining zone handovers.
                </p>
              </div>
            </div>

            <div className="flex shrink-0 gap-2 sm:gap-3">
              <Button variant="primary" size="sm" className="flex-1 sm:flex-none" onClick={handleScheduleNow}>
                Schedule Now
              </Button>
              <Button variant="outline" size="sm" className="flex-1 sm:flex-none" onClick={() => setShowSuggestion(false)}>
                Dismiss
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Add Room Button */}
      <button
        onClick={() => setAddRoomOpen(true)}
        className="fixed bottom-20 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-on-primary shadow-glow hover:bg-primary-soft transition-transform active:scale-95 md:bottom-8 md:right-8"
        aria-label="Add new room"
      >
        <Icon name="add" className="text-2xl" />
      </button>

      {/* Quick View dialog */}
      <Dialog open={!!quickViewRoom} onClose={() => setQuickViewRoom(null)} title={quickViewRoom?.name} size="sm">
        {quickViewRoom && (
          <div className="space-y-4">
            <img
              src={quickViewRoom.image}
              alt={quickViewRoom.name}
              className="w-full aspect-video object-cover rounded-2xl border border-border"
            />
            <div className="grid grid-cols-2 gap-3 text-xs font-semibold">
              <div>
                <p className="text-muted">Area</p>
                <p className="mt-0.5 text-text font-bold">{quickViewRoom.area}</p>
              </div>
              <div>
                <p className="text-muted">Wing</p>
                <p className="mt-0.5 text-text font-bold">{quickViewRoom.wing}</p>
              </div>
              <div>
                <p className="text-muted">Stage</p>
                <p className="mt-0.5 text-text font-bold">{quickViewRoom.stage}</p>
              </div>
              <div>
                <p className="text-muted">Completion</p>
                <p className="mt-0.5 text-text font-bold">{quickViewRoom.completion}%</p>
              </div>
            </div>
            <ProgressBar value={quickViewRoom.completion} tone={progressBarColor(quickViewRoom.completion) === 'bg-emerald-500' ? 'success' : 'primary'} />
            <AvatarGroup items={quickViewRoom.team} onItemClick={goToTeamMember} />
          </div>
        )}
      </Dialog>

      {/* Edit Room dialog */}
      <Dialog open={!!editingRoom} onClose={() => setEditingRoom(null)} title="Edit room" size="sm">
        {editingRoom && (
          <form onSubmit={handleEditSave} className="space-y-4">
            <RoomImagePicker image={editingRoom.image} onSelect={handleEditingRoomImageSelect} />
            <Input
              label="Room name"
              value={editingRoom.name}
              onChange={(e) => setEditingRoom({ ...editingRoom, name: e.target.value })}
              required
            />
            <Input
              label="Stage"
              value={editingRoom.stage}
              onChange={(e) => setEditingRoom({ ...editingRoom, stage: e.target.value })}
              required
            />
            <Input
              label="Completion (%)"
              type="number"
              min="0"
              max="100"
              value={editingRoom.completion}
              onChange={(e) => setEditingRoom({ ...editingRoom, completion: Number(e.target.value) })}
            />
            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setEditingRoom(null)}>
                Cancel
              </Button>
              <Button type="submit" icon="task_alt">
                Save changes
              </Button>
            </div>
          </form>
        )}
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog open={!!deleteConfirmRoom} onClose={() => setDeleteConfirmRoom(null)} title="Delete room?" size="sm">
        {deleteConfirmRoom && (
          <div className="space-y-5">
            <div className="flex items-start gap-3 rounded-2xl border border-danger/20 bg-danger/5 p-4">
              <Icon name="warning" className="text-danger text-xl shrink-0" />
              <p className="text-xs font-semibold text-muted leading-relaxed">
                This will permanently remove <span className="font-bold text-text">{deleteConfirmRoom.name}</span> and
                its checklist, photos, and progress data. This action cannot be undone.
              </p>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setDeleteConfirmRoom(null)}>
                Cancel
              </Button>
              <Button variant="danger" icon="delete" onClick={handleConfirmDelete}>
                Delete room
              </Button>
            </div>
          </div>
        )}
      </Dialog>

      {/* Add Room dialog */}
      <Dialog open={addRoomOpen} onClose={closeAddRoom} title="Add new room" size="sm">
        <form onSubmit={handleAddRoom} className="space-y-4">
          <RoomImagePicker image={roomForm.image} onSelect={handleRoomFormImageSelect} />
          <Input
            label="Room name"
            value={roomForm.name}
            onChange={(e) => setRoomForm({ ...roomForm, name: e.target.value })}
            placeholder="Home Office"
            required
          />
          <Input
            label="Area"
            value={roomForm.area}
            onChange={(e) => setRoomForm({ ...roomForm, area: e.target.value })}
            placeholder="320 sq.ft"
            required
          />
          <Select
            label="Wing"
            value={roomForm.wing}
            onChange={(e) => setRoomForm({ ...roomForm, wing: e.target.value })}
          >
            {wingOptions.map((wing) => (
              <option key={wing} value={wing}>
                {wing}
              </option>
            ))}
          </Select>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={closeAddRoom}>
              Cancel
            </Button>
            <Button type="submit" icon="add">
              Add room
            </Button>
          </div>
        </form>
      </Dialog>
    </motion.div>
  )
}