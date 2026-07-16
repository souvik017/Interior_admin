import { useMemo, useRef, useState } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import { Icon } from './Icon'
import { Skeleton } from '../feedback/Skeleton'
import { Button } from './Button'

export function Table({
  columns,
  data,
  loading = false,
  globalSearchPlaceholder = 'Search records...',
  emptyState = (
    <div className="flex flex-col items-center justify-center p-12 text-center text-muted">
      <Icon name="inbox" className="text-4xl mb-3 text-muted/50" />
      <p className="text-sm font-semibold">No records found</p>
      <p className="text-xs text-muted/70 mt-1">Try refining your search filters.</p>
    </div>
  ),
  stickyHeader = true,
  enableSelection = false,
  enableColumnFilters = false,
  onRowClick,
  // Virtualization: opt-in for large datasets. When enabled, pagination is
  // bypassed and every filtered/sorted row is rendered in a fixed-height,
  // windowed scroll container instead.
  virtualized = false,
  virtualizedHeight = 520,
  estimateRowHeight = 52,
}) {
  const [sorting, setSorting] = useState([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [columnFilters, setColumnFilters] = useState([])
  const [columnVisibility, setColumnVisibility] = useState({})
  const [rowSelection, setRowSelection] = useState({})
  const [showVisibilityMenu, setShowVisibilityMenu] = useState(false)
  const [showFilterRow, setShowFilterRow] = useState(false)
  const scrollRef = useRef(null)

  // Memoize column selection checkbox column if selection is enabled
  const finalColumns = useMemo(() => {
    if (!enableSelection) return columns

    return [
      {
        id: 'select',
        header: ({ table }) => (
          <div className="flex items-center justify-center px-1">
            <input
              type="checkbox"
              aria-label="Select all rows"
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary/30"
              checked={table.getIsAllRowsSelected()}
              onChange={table.getToggleAllRowsSelectedHandler()}
            />
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex items-center justify-center px-1">
            <input
              type="checkbox"
              aria-label={`Select row ${row.index + 1}`}
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary/30"
              checked={row.getIsSelected()}
              disabled={!row.getCanSelect()}
              onChange={row.getToggleSelectedHandler()}
            />
          </div>
        ),
        size: 50,
        enableColumnFilter: false,
      },
      ...columns,
    ]
  }, [columns, enableSelection])

  const table = useReactTable({
    data,
    columns: finalColumns,
    state: {
      sorting,
      globalFilter,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: 'includesString',
  })

  // Virtualized mode renders every filtered/sorted row (no pagination slice);
  // non-virtualized mode keeps the existing paginated row model.
  const rows = virtualized ? table.getSortedRowModel().rows : table.getRowModel().rows

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => estimateRowHeight,
    overscan: 8,
    enabled: virtualized,
  })

  const filterableColumns = table.getAllLeafColumns().filter(
    (column) => column.id !== 'select' && column.columnDef.accessorKey && column.getCanFilter(),
  )

  return (
    <div className="space-y-4">
      {/* Table Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-md flex-1">
          <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-full rounded-2xl border border-border bg-surface pl-10 pr-4 py-2.5 text-sm outline-none transition focus:border-primary/30 focus:ring-4 focus:ring-primary/10"
            placeholder={globalSearchPlaceholder}
            aria-label={globalSearchPlaceholder}
          />
        </div>

        <div className="flex gap-2 justify-end relative">
          {enableColumnFilters && filterableColumns.length > 0 && (
            <Button
              variant={showFilterRow ? 'primary' : 'outline'}
              size="sm"
              icon="filter_list"
              onClick={() => setShowFilterRow((prev) => !prev)}
              aria-pressed={showFilterRow}
            >
              Filters
            </Button>
          )}

          {/* Column Visibility Trigger */}
          <Button
            variant="outline"
            size="sm"
            icon="view_week"
            onClick={() => setShowVisibilityMenu((prev) => !prev)}
            aria-expanded={showVisibilityMenu}
          >
            Columns
          </Button>

          {showVisibilityMenu && (
            <div
              onMouseLeave={() => setShowVisibilityMenu(false)}
              className="absolute right-0 top-[110%] z-20 w-48 rounded-2xl border border-border bg-surface p-3 shadow-xl max-h-64 overflow-y-auto"
            >
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted mb-2 px-1">
                Toggle Columns
              </p>
              <div className="space-y-1">
                {table.getAllLeafColumns().map((column) => {
                  if (column.id === 'select') return null
                  return (
                    <label
                      key={column.id}
                      className="flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-surface-2 cursor-pointer text-xs font-semibold text-text"
                    >
                      <input
                        type="checkbox"
                        checked={column.getIsVisible()}
                        onChange={column.getToggleVisibilityHandler()}
                        className="h-3.5 w-3.5 rounded border-border text-primary focus:ring-primary/20"
                      />
                      <span className="capitalize">{column.id.replace(/_/g, ' ')}</span>
                    </label>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Grid Container */}
      <div
        ref={scrollRef}
        className="relative overflow-x-auto rounded-3xl border border-border/80 bg-surface/90 shadow-soft"
        style={virtualized ? { height: virtualizedHeight, overflowY: 'auto' } : undefined}
      >
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="bg-surface-2/60 border-b border-border">
                {headerGroup.headers.map((header) => {
                  const isSorted = header.column.getIsSorted()
                  const canSort = header.column.getCanSort()
                  return (
                    <th
                      key={header.id}
                      aria-sort={isSorted === 'asc' ? 'ascending' : isSorted === 'desc' ? 'descending' : canSort ? 'none' : undefined}
                      className={`px-5 py-4 text-xs font-bold uppercase tracking-[0.18em] text-muted select-none ${
                        stickyHeader ? 'sticky top-0 bg-surface-2 z-10' : ''
                      }`}
                      style={{ width: header.getSize() }}
                    >
                      {header.isPlaceholder ? null : canSort ? (
                        <button
                          type="button"
                          onClick={header.column.getToggleSortingHandler()}
                          className="flex items-center gap-1.5 hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded"
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          <span className="inline-block text-[14px]">
                            {isSorted === 'asc' ? (
                              <Icon name="arrow_upward" className="text-primary font-bold" />
                            ) : isSorted === 'desc' ? (
                              <Icon name="arrow_downward" className="text-primary font-bold" />
                            ) : (
                              <Icon name="swap_vert" className="text-muted/40" />
                            )}
                          </span>
                        </button>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </div>
                      )}
                    </th>
                  )
                })}
              </tr>
            ))}
            {enableColumnFilters && showFilterRow && (
              <tr className="bg-surface/95 border-b border-border">
                {table.getFlatHeaders().map((header) => (
                  <th key={header.id} className="px-5 py-2.5">
                    {header.column.id !== 'select' && header.column.columnDef.accessorKey && header.column.getCanFilter() ? (
                      <input
                        value={header.column.getFilterValue() ?? ''}
                        onChange={(e) => header.column.setFilterValue(e.target.value)}
                        placeholder={`Filter ${typeof header.column.columnDef.header === 'string' ? header.column.columnDef.header.toLowerCase() : header.column.id}...`}
                        aria-label={`Filter by ${header.column.id}`}
                        className="w-full rounded-lg border border-border/80 bg-surface px-2.5 py-1.5 text-xs font-medium outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/10"
                      />
                    ) : null}
                  </th>
                ))}
              </tr>
            )}
          </thead>

          {virtualized ? (
            <tbody
              className="divide-y divide-border relative"
              style={{ height: rowVirtualizer.getTotalSize() }}
            >
              {loading ? (
                Array.from({ length: 4 }).map((_, rowIndex) => (
                  <tr key={rowIndex} className="animate-pulse">
                    {table.getAllLeafColumns().map((col) => (
                      <td key={col.id} className="px-5 py-4">
                        <Skeleton className="h-4 w-3/4 rounded" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : rows.length > 0 ? (
                rowVirtualizer.getVirtualItems().map((virtualRow) => {
                  const row = rows[virtualRow.index]
                  return (
                    <tr
                      key={row.id}
                      onClick={() => onRowClick && onRowClick(row.original)}
                      className={`absolute inset-x-0 flex w-full transition hover:bg-surface-2/40 ${
                        onRowClick ? 'cursor-pointer' : ''
                      } ${row.getIsSelected() ? 'bg-primary/5' : ''}`}
                      style={{ transform: `translateY(${virtualRow.start}px)`, height: virtualRow.size }}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className="flex items-center px-5 py-4 text-text font-medium"
                          style={{ width: cell.column.getSize(), flexShrink: 0 }}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={table.getAllLeafColumns().length} className="px-5 py-8 text-center">
                    {emptyState}
                  </td>
                </tr>
              )}
            </tbody>
          ) : (
            <tbody className="divide-y divide-border">
              {loading ? (
                Array.from({ length: 4 }).map((_, rowIndex) => (
                  <tr key={rowIndex} className="animate-pulse">
                    {table.getAllLeafColumns().map((col) => (
                      <td key={col.id} className="px-5 py-4">
                        <Skeleton className="h-4 w-3/4 rounded" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : rows.length > 0 ? (
                rows.map((row) => (
                  <tr
                    key={row.id}
                    onClick={() => onRowClick && onRowClick(row.original)}
                    className={`transition hover:bg-surface-2/40 ${
                      onRowClick ? 'cursor-pointer' : ''
                    } ${row.getIsSelected() ? 'bg-primary/5' : ''}`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-5 py-4 text-text font-medium">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={table.getAllLeafColumns().length} className="px-5 py-8 text-center">
                    {emptyState}
                  </td>
                </tr>
              )}
            </tbody>
          )}
        </table>
      </div>

      {/* Pagination Controls (hidden in virtualized mode — every row renders in the scroll window) */}
      {!virtualized && !loading && rows.length > 0 && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-2 pt-2">
          <div className="text-xs font-semibold text-muted">
            Page {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount() || 1}
            <span className="mx-2">•</span>
            {table.getFilteredRowModel().rows.length} total rows
          </div>

          <div className="flex items-center gap-2 justify-end">
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
              aria-label="Rows per page"
              className="mr-2 rounded-xl border border-border bg-surface text-xs font-semibold px-2 py-1.5 outline-none focus:border-primary/30"
            >
              {[5, 10, 20, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>

            <Button
              variant="outline"
              size="sm"
              icon="chevron_left"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              aria-label="Previous page"
            />
            <Button
              variant="outline"
              size="sm"
              icon="chevron_right"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              aria-label="Next page"
            />
          </div>
        </div>
      )}
      {virtualized && rows.length > 0 && (
        <div className="px-2 pt-2 text-xs font-semibold text-muted">
          Showing all {rows.length} rows (virtualized)
        </div>
      )}
    </div>
  )
}
