export function AvatarGroup({ items = [], onItemClick }) {
  const isClickable = typeof onItemClick === 'function'

  return (
    <div className="flex -space-x-2.5 overflow-hidden">
      {items.map((item, idx) => {
        const sharedClass =
          'flex h-8 w-8 items-center justify-center rounded-full border-2 border-surface bg-primary/10 text-[10px] font-bold text-primary ring-1 ring-border/20 shadow-sm'

        if (!isClickable) {
          return (
            <div key={item + '_' + idx} className={sharedClass}>
              {item}
            </div>
          )
        }

        return (
          <button
            key={item + '_' + idx}
            type="button"
            onClick={() => onItemClick(item)}
            className={`${sharedClass} transition hover:z-10 hover:scale-110 hover:bg-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40`}
            aria-label={`View ${item} in team directory`}
          >
            {item}
          </button>
        )
      })}
    </div>
  )
}
