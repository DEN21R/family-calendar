import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  activeGroupId: localStorage.getItem('activeGroupId') || null,
  groups: [],
  initialized: false,
  loading: false,
  error: null,
}

const groupSlice = createSlice({
  name: 'group',
  initialState,
  reducers: {
    setActiveGroupId(state, action) {
      state.activeGroupId = action.payload
      if (action.payload) {
        localStorage.setItem('activeGroupId', action.payload)
      } else {
        localStorage.removeItem('activeGroupId')
      }
    },
    setGroups(state, action) {
      state.groups = action.payload
    },
    setGroupInitialized(state, action) {
      state.initialized = action.payload
    },
    setGroupLoading(state, action) {
      state.loading = action.payload
    },
    setGroupError(state, action) {
      state.error = action.payload
    },
    clearGroupState() {
      localStorage.removeItem('activeGroupId')
      return initialState
    },
  },
  extraReducers: (builder) => {
    builder.addCase('auth/logout', (state) => {
      return {
        ...state,
        initialized: false,
        groups: [],
        loading: false,
        error: null,
      }
    })
  },
})

export const {
  setActiveGroupId,
  setGroups,
  setGroupInitialized,
  setGroupLoading,
  setGroupError,
  clearGroupState,
} = groupSlice.actions
export default groupSlice.reducer
