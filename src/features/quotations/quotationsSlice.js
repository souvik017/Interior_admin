import { createSlice } from '@reduxjs/toolkit'

const STORAGE_KEY = 'interior-admin-quotations'

const loadInitial = () => {
  if (typeof window === 'undefined') return []
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

const persist = (items) => {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

const nextQuotationId = (items) => {
  const year = new Date().getFullYear()
  const seq = items.filter((q) => q.id.includes(`QUO-${year}`)).length + 1
  return `QUO-${year}-${String(seq).padStart(3, '0')}`
}

const quotationsSlice = createSlice({
  name: 'quotations',
  initialState: {
    items: loadInitial(),
  },
  reducers: {
    addQuotation: {
      reducer(state, action) {
        state.items.unshift(action.payload)
        persist(state.items)
      },
      prepare(quotation) {
        return { payload: quotation }
      },
    },
    updateQuotationStatus(state, action) {
      const { id, status } = action.payload
      const found = state.items.find((q) => q.id === id)
      if (found) found.status = status
      persist(state.items)
    },
  },
})

export const { addQuotation, updateQuotationStatus } = quotationsSlice.actions
export const quotationsReducer = quotationsSlice.reducer
export { nextQuotationId }
