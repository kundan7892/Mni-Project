import React from 'react'
import { Search, X } from 'lucide-react'

// SearchBar Component: Real-time search bar input component
function SearchBar({ searchTerm, setSearchTerm }) {
  return (
    <div className="relative w-full">
      <div className="relative flex items-center">
        <Search className="w-5 h-5 text-subtle absolute left-4 pointer-events-none" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by drone name, brand, model, or category..."
          className="w-full pl-12 pr-10 py-3.5 rounded-2xl border border-line bg-surface text-fg text-sm shadow-xs focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-transparent transition-all placeholder:text-subtle"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-3 p-1 rounded-full text-subtle hover:text-muted hover:bg-surface-2 transition-colors"
            aria-label="Clear Search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}

export default SearchBar
