import React, { useState } from 'react'
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, AlertCircle, Zap } from 'lucide-react'

// Contact Component: Frontend interactive contact form and office details
function Contact() {
  // Form input state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    subject: '',
    message: ''
  })

  // Feedback toast state
  const [submitted, setSubmitted] = useState(false)

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle frontend form submit
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.fullName || !formData.email || !formData.message) return

    setSubmitted(true)
    // Clear inputs after submission
    setFormData({
      fullName: '',
      email: '',
      subject: '',
      message: ''
    })

    // Reset notification toast after 5 seconds
    setTimeout(() => {
      setSubmitted(false)
    }, 5000)
  }

  return (
    <div className="space-y-16 pb-20 pt-28 bg-[#050508]">

      {/* Page Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <span className="inline-block text-xs font-bold uppercase tracking-widest text-cyan-400 bg-cyan-400/10 px-4 py-1.5 rounded-full border border-cyan-400/20">
          Get In Touch
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
          Contact <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">DroneHub</span>
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Have questions about renting a drone, registering your rental shop, or fleet partnerships? Send us a message!
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Contact Info Sidebar */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-black/80 border border-purple-500/30 backdrop-blur-xl p-8 rounded-3xl space-y-8 shadow-xl glow-purple">
              <div>
                <h3 className="text-2xl font-extrabold text-white">Contact Information</h3>
                <p className="text-slate-500 text-sm mt-1">Our support team responds within 24 business hours.</p>
              </div>

              <div className="space-y-6 text-sm">

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-400 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 font-medium block uppercase tracking-wider">Email Us</span>
                    <a href="mailto:support@dronehub.com" className="text-white font-semibold hover:text-cyan-400 transition-colors">
                      support@dronehub.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-400 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 font-medium block uppercase tracking-wider">Call Support</span>
                    <a href="tel:+18005553766" className="text-white font-semibold hover:text-cyan-400 transition-colors">
                      +1 (800) 555-DRONE
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-400 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 font-medium block uppercase tracking-wider">Head Office</span>
                    <p className="text-white font-semibold">
                      Silicon Valley Aviation Hub<br />
                      Palo Alto, CA 94301
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-400 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 font-medium block uppercase tracking-wider">Business Hours</span>
                    <p className="text-white font-semibold">
                      Mon – Sat: 8:00 AM – 8:00 PM EST
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7 bg-black/80 border border-purple-500/30 backdrop-blur-xl p-8 sm:p-10 rounded-3xl shadow-xl">

            {/* Success Toast Banner */}
            {submitted && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-900/20 border border-emerald-500/30 text-emerald-400 flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold">Thank You! Message Received.</h4>
                  <p className="text-xs text-emerald-500">We have logged your query and will reply to your email shortly.</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <h3 className="text-2xl font-bold text-white">Send Us a Message</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="e.g. Alex Johnson"
                    className="w-full px-4 py-3 rounded-xl bg-black/60 border border-purple-500/30 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none text-white placeholder-slate-600 text-sm transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="alex@example.com"
                    className="w-full px-4 py-3 rounded-xl bg-black/60 border border-purple-500/30 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none text-white placeholder-slate-600 text-sm transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="e.g. Inquiry regarding rental shop onboarding"
                  className="w-full px-4 py-3 rounded-xl bg-black/60 border border-purple-500/30 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none text-white placeholder-slate-600 text-sm transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Message *
                </label>
                <textarea
                  name="message"
                  required
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Describe your question or drone rental requirements..."
                  className="w-full px-4 py-3 rounded-xl bg-black/60 border border-purple-500/30 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none text-white placeholder-slate-600 text-sm transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-purple-500/25 transition-all glow-purple cursor-pointer"
              >
                <span>Submit Message</span>
                <Send className="w-4 h-4" />
              </button>
            </form>

          </div>

        </div>
      </section>

    </div>
  )
}

export default Contact
