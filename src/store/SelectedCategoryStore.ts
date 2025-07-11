import { create } from 'zustand'

interface Category {
    category_id: number,
    category_text: string
  }

interface SelectedCategoryState {
    selectedCategory: Category | null,
    setSelectedCategory: (category:Category | null)=> void,
    toggleSelectedCategory: (category:Category) => void
}

export const SelectedCategoryStore = create<SelectedCategoryState>((set,get)=>({
    selectedCategory: null,
    setSelectedCategory: (category:Category | null)=> set({selectedCategory:category}),
    toggleSelectedCategory: (category:Category) => set({selectedCategory: get().selectedCategory?.category_id === category.category_id ? null : category })
}))