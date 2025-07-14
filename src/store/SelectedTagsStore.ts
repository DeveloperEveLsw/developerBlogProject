import { create } from 'zustand'

interface Tag {
  tag_id: number
  tag_text: string
}

interface SelectedTagsState {
  selectedTags: Tag[]
  setSelectedTag: (tag: Tag | null) => void
  toggleSelectedTag: (tag: Tag) => void
}

export const SelectedTagsStore = create<SelectedTagsState>((set, get) => ({
  selectedTags: [],
  setSelectedTag: (tag) => {
    if (tag) {
      set({ selectedTags: [...get().selectedTags, tag] })
    } else {
      set({ selectedTags: [] }) // 또는 아무것도 안 하게 처리할 수도 있어요
    }
  },
  toggleSelectedTag: (tag) => {
    const existing = get().selectedTags.find((t) => t.tag_id === tag.tag_id)
    if (existing) {
      set({
        selectedTags: get().selectedTags.filter((t) => t.tag_id !== tag.tag_id),
      })
    } else {
      set({ selectedTags: [...get().selectedTags, tag] })
    }
  },
}))