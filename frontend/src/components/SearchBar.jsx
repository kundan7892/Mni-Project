import React from 'react'
import { Search, X } from 'lucide-react'

// SearchBar Component: Real-time search bar input component (Dark AeroPulse theme)
function SearchBar({ searchTerm, setSearchTerm }) {
  return (
    <div className="relative w-full">
      <div className="relative flex items-center">
        <Search className="w-5 h-5 text-white/40 absolute left-4 pointer-events-none" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by drone name, brand, model, or category..."
          className="w-full pl-12 pr-10 py-3.5 rounded-2xl border border-white/10 bg-[#0d1117]/80 backdrop-blur-md text-white text-sm shadow-xl focus:outline-none focus:border-[#00f0ff]/50 focus:ring-1 focus:ring-[#00f0ff]/30 transition-all placeholder:text-white/35"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-3 p-1 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-colors"
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
