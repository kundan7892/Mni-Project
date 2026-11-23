import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, HelpCircle, Search, MessageSquare, ArrowRight } from 'lucide-react'
import { faqData } from '../data/mockData'

// FAQ Component: Interactive accordion FAQ list using React useState hook
function FAQ() {
  // State to track which accordion item is open (null if all closed)
  const [openId, setOpenId] = useState('faq-1')

  // Search query filter state
  const [searchQuery, setSearchQuery] = useState('')

  // Toggle accordion item
  const toggleAccordion = (id) => {
    setOpenId((prevOpenId) => (prevOpenId === id ? null : id))
  }

  // Filter FAQs based on search string
  const filteredFaqs = faqData.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-16 pb-20 pt-28 bg-[#050508]">

      {/* Header Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <span className="inline-block text-xs font-bold uppercase tracking-widest text-cyan-400 bg-cyan-400/10 px-4 py-1.5 rounded-full border border-cyan-400/20">
          Knowledge Base & Support
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
          Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Questions</span>
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Everything you need to know about renting drones, host shop policies, and flight safety on DroneHub.
        </p>

        {/* Search Input Bar */}
        <div className="pt-4 max-w-xl mx-auto">
          <div className="relative">
            <Search className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions (e.g. rental pricing, insurance, cancellation)..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-black/60 border border-purple-500/30 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none text-white placeholder-slate-600 text-sm backdrop-blur-sm transition-all"
            />
          </div>
        </div>
      </section>

      {/* Interactive Accordion List */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {filteredFaqs.length > 0 ? (
          <div className="space-y-4">
            {filteredFaqs.map((faq) => {
              const isOpen = openId === faq.id
              return (
                <div
                  key={faq.id}
                  className={`border rounded-xl transition-all duration-200 overflow-hidden bg-black/60 backdrop-blur-sm ${
                    isOpen
                      ? 'border-purple-500/50 shadow-lg shadow-purple-500/10'
                      : 'border-purple-500/20 hover:border-cyan-400/40'
                  }`}
                >
                  {/* Accordion Header Button */}
                  <button
                    onClick={() => toggleAccordion(faq.id)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none cursor-pointer"
                  >
                    <span className="text-base font-bold text-white pr-4">
                      {faq.question}
                    </span>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300 shrink-0 ${
                        isOpen
                          ? 'bg-purple-600 text-white rotate-180'
                          : 'bg-purple-900/40 border border-purple-500/30 text-slate-400'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {/* Accordion Content Body */}
                  {isOpen && (
                    <div className="px-6 pb-6 pt-1 text-sm text-slate-400 leading-relaxed border-t border-purple-500/20">
                      {faq.answer}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-black/60 border border-purple-500/20 rounded-2xl p-8 space-y-3 backdrop-blur-sm">
            <HelpCircle className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-lg font-bold text-white">No questions found matching "{searchQuery}"</h3>
            <p className="text-sm text-slate-500">Try searching for keywords like "documents", "damage", or "pricing".</p>
          </div>
        )}
      </section>

      {/* Still Have Questions Box */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-black border border-purple-500/30 rounded-3xl p-8 sm:p-12 text-center space-y-4 overflow-hidden glow-purple">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600/30 to-cyan-500/20 border border-purple-500/30 mx-auto flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold text-white">Still have questions?</h3>
            <p className="text-slate-400 text-sm max-w-xl mx-auto">
              Can't find the answer you're looking for? Reach out to our dedicated support team.
            </p>
            <div className="pt-2">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-purple-500/25"
              >
                <span>Contact Customer Support</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}

export default FAQ
