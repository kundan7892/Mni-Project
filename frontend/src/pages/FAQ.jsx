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
    <div className="space-y-16 pb-20 pt-28 bg-canvas">

      {/* Header Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <span className="inline-block text-xs font-bold uppercase tracking-wide text-accent-ink bg-accent/10 px-4 py-1.5 rounded-full border border-accent/20">
          Knowledge Base & Support
        </span>
        <h1 className="text-4xl sm:text-5xl font-semibold text-white tracking-tight">
          Frequently Asked <span className="">Questions</span>
        </h1>
        <p className="text-lg text-subtle max-w-2xl mx-auto leading-relaxed">
          Everything you need to know about renting drones, host shop policies, and flight safety on DroneHub.
        </p>

        {/* Search Input Bar */}
        <div className="pt-4 max-w-xl mx-auto">
          <div className="relative">
            <Search className="w-5 h-5 text-muted absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions (e.g. rental pricing, insurance, cancellation)..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-black/60 border border-accent/30 focus:border-accent focus:ring-2 focus:ring-accent/40 focus:outline-none text-white placeholder-subtle text-sm backdrop-blur-sm transition-all"
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
                      ? 'border-accent/50 shadow-lg '
                      : 'border-accent/20 hover:border-accent/40'
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
                          ? 'bg-accent text-white rotate-180'
                          : 'bg-accent/15 border border-accent/30 text-subtle'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {/* Accordion Content Body */}
                  {isOpen && (
                    <div className="px-6 pb-6 pt-1 text-sm text-subtle leading-relaxed border-t border-accent/20">
                      {faq.answer}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-black/60 border border-accent/20 rounded-2xl p-8 space-y-3 backdrop-blur-sm">
            <HelpCircle className="w-10 h-10 text-muted mx-auto" />
            <h3 className="text-lg font-bold text-white">No questions found matching "{searchQuery}"</h3>
            <p className="text-sm text-muted">Try searching for keywords like "documents", "damage", or "pricing".</p>
          </div>
        )}
      </section>

      {/* Still Have Questions Box */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-black border border-accent/30 rounded-2xl p-8 sm:p-12 text-center space-y-4 overflow-hidden ">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-accent/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-48 h-48 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-accent border border-accent/30 mx-auto flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-accent-ink" />
            </div>
            <h3 className="text-2xl font-bold text-white">Still have questions?</h3>
            <p className="text-subtle text-sm max-w-xl mx-auto">
              Can't find the answer you're looking for? Reach out to our dedicated support team.
            </p>
            <div className="pt-2">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-accent text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg "
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
