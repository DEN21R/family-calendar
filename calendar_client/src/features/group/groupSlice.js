import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  activeGroupId: localStorage.getItem('activeGroupId') || null,
  groups: [],
  loading: false,
}

const groupSlice = createSlice({
  name: 'group',
  initialState,
  reducers: {
    setActiveGroup(state, action) {
      state.activeGroupId = action.payload
      localStorage.setItem('activeGroupId', action.payload)
    },
    setGroups(state, action) {
      state.groups = action.payload
    },
    setLoading(state, action) {
      state.loading = action.payload
    },
  },
})

export const { setActiveGroup, setGroups, setLoading } = groupSlice.actions
export default groupSlice.reducer

// **State:**

// - `activeGroupId` — текущая выбранная группа (восстанавливается из localStorage)
// - `groups` — список групп пользователя
// - `loading` — загрузка данных
