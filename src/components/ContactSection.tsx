import { CheckCircle2, Mail, MapPin, MessageCircle, Phone, QrCode, Send } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { STATIC_CONTENT } from '../data/translations';
import type { Language, SiteConfig } from '../types/portfolio';

interface ContactSectionProps {
  lang: Language;
  config: SiteConfig;
  onOpenAdmin: () => void;
  onOpenQrCode: () => void;
}

export function ContactSection({ lang, config, onOpenAdmin, onOpenQrCode }: ContactSectionProps) {
  const t = STATIC_CONTENT[lang].contact;
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [emailFeedback, setEmailFeedback] = useState(false);

  const handleEmailClick = () => {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText('ngolomfrance@icloud.com').catch(() => {});
    }
    setEmailFeedback(true);
    window.setTimeout(() => setEmailFeedback(false), 5000);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, subject, message }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Une erreur est survenue.');
      } else {
        setSubmitted(true);
        setFullName('');
        setEmail('');
        setSubject('');
        setMessage('');
      }
    } catch {
      setError(
        lang === 'fr'
          ? 'Impossible de joindre le serveur. Veuillez réessayer.'
          : 'Unable to reach server. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="bg-[#F4F5F7] py-20 sm:py-24">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="max-w-2xl mb-12 sm:mb-14">
          <p className="text-xs font-semibold tracking-wider text-[#C5A46D] mb-2">
            {t.sectionLabel}
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#101C35] tracking-tight [text-wrap:balance] mb-4">
            {t.title}
          </h2>
          <p className="text-[15px] sm:text-base text-[#687386] leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Column: Direct Channels */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-7 space-y-6">
              <div className="flex items-start gap-3.5">
                <MapPin className="w-5 h-5 text-[#C5A46D] mt-0.5 shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-xs font-semibold text-[#687386]">{t.locationLabel}</p>
                  <p className="text-sm sm:text-base font-semibold text-[#101C35]">
                    {t.locationValue}
                  </p>
                </div>
              </div>

              <div className="pt-5 border-t border-slate-100 flex items-start gap-3.5">
                <Mail className="w-5 h-5 text-[#C5A46D] mt-0.5 shrink-0" aria-hidden="true" />
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-[#687386]">{t.personalLabel}</p>
                  <a
                    href="mailto:ngolomfrance@icloud.com"
                    className="block text-sm font-semibold text-[#101C35] hover:text-[#C5A46D] transition-colors"
                  >
                    ngolomfrance@icloud.com
                  </a>
                  <a
                    href="tel:+237652198178"
                    className="block text-sm text-[#687386] hover:text-[#101C35] tabular-nums"
                  >
                    652 19 81 78
                  </a>
                </div>
              </div>

              <div className="pt-5 border-t border-slate-100 flex items-start gap-3.5">
                <Phone className="w-5 h-5 text-[#C5A46D] mt-0.5 shrink-0" aria-hidden="true" />
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-[#687386]">{t.agencyPhoneLabel}</p>
                  <a
                    href="tel:+237690370454"
                    className="block text-sm sm:text-base font-semibold text-[#101C35] hover:text-[#C5A46D] tabular-nums transition-colors"
                  >
                    +237 690 37 04 54
                  </a>
                </div>
              </div>

              <div className="pt-5 border-t border-slate-100 flex items-start gap-3.5">
                <Mail className="w-5 h-5 text-[#C5A46D] mt-0.5 shrink-0" aria-hidden="true" />
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-[#687386]">{t.agencyEmailLabel}</p>
                  <a
                    href="mailto:dataworkagency0@gmail.com"
                    className="block text-sm sm:text-base font-semibold text-[#101C35] hover:text-[#C5A46D] transition-colors"
                  >
                    dataworkagency0@gmail.com
                  </a>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-wrap gap-3">
                <a
                  href="https://wa.me/237652198178"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold bg-[#101C35] hover:bg-[#1A2B4D] text-white rounded-md transition-colors whitespace-nowrap"
                >
                  <MessageCircle className="w-4 h-4 text-[#C5A46D]" aria-hidden="true" />
                  <span>{t.whatsappBtn}</span>
                </a>

                <a
                  href="mailto:ngolomfrance@icloud.com?subject=Contact%20Portfolio%20-%20Sophie%20Francette%20Ngolom"
                  target="_top"
                  onClick={handleEmailClick}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold border border-[#101C35]/20 hover:border-[#C5A46D] text-[#101C35] rounded-md transition-colors whitespace-nowrap cursor-pointer"
                >
                  <Mail className="w-4 h-4 text-[#C5A46D]" aria-hidden="true" />
                  <span>{t.emailBtn}</span>
                </a>

                <button
                  type="button"
                  onClick={onOpenQrCode}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold border border-[#101C35]/20 hover:border-[#C5A46D] text-[#101C35] rounded-md transition-colors whitespace-nowrap cursor-pointer"
                >
                  <QrCode className="w-4 h-4 text-[#C5A46D]" aria-hidden="true" />
                  <span>{lang === 'fr' ? 'QR Code' : 'QR Code'}</span>
                </button>
              </div>

              {emailFeedback && (
                <p className="text-xs text-[#101C35] font-medium pt-1">
                  {lang === 'fr'
                    ? 'Redirection vers ngolomfrance@icloud.com (adresse copiée dans votre presse-papiers).'
                    : 'Opening mail client for ngolomfrance@icloud.com (address copied to clipboard).'}
                </p>
              )}

              {/* LinkedIn & GitHub (Configurable without inventing fake URLs) */}
              <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="block font-semibold text-[#101C35] mb-1">
                    {t.linkedinLabel}
                  </span>
                  {config.linkedinUrl ? (
                    <a
                      href={config.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#C5A46D] font-medium hover:underline break-all"
                    >
                      {t.linkedinLabel} ↗
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={onOpenAdmin}
                      className="text-left text-[#687386] hover:text-[#101C35] underline decoration-dotted cursor-pointer"
                    >
                      {t.unconfiguredLink}
                    </button>
                  )}
                </div>

                <div>
                  <span className="block font-semibold text-[#101C35] mb-1">
                    {t.githubLabel}
                  </span>
                  {config.githubUrl ? (
                    <a
                      href={config.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#C5A46D] font-medium hover:underline break-all"
                    >
                      {t.githubLabel} ↗
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={onOpenAdmin}
                      className="text-left text-[#687386] hover:text-[#101C35] underline decoration-dotted cursor-pointer"
                    >
                      {t.unconfiguredLink}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Validated Backend Contact Form */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-7 sm:p-10">
            {submitted ? (
              <div className="py-10 text-center space-y-4">
                <CheckCircle2
                  className="w-12 h-12 text-[#C5A46D] mx-auto"
                  aria-hidden="true"
                />
                <h3 className="font-serif text-2xl font-semibold text-[#101C35]">
                  {t.form.successTitle}
                </h3>
                <p className="text-sm text-[#687386] max-w-md mx-auto leading-relaxed">
                  {t.form.successBody}
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-2 inline-flex items-center px-5 py-2.5 text-sm font-semibold bg-[#101C35] text-white rounded-md hover:bg-[#1A2B4D] transition-colors cursor-pointer"
                >
                  {lang === 'fr' ? 'Envoyer un autre message' : 'Send another message'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="block text-xs font-semibold text-[#101C35] mb-1.5"
                    >
                      {t.form.name}
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder={t.form.namePlaceholder}
                      className="w-full px-4 py-2.5 text-sm text-[#101C35] bg-[#F4F5F7] border border-slate-200 rounded-md focus:outline-none focus:border-[#C5A46D] focus:bg-white transition-colors"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contact-email"
                      className="block text-xs font-semibold text-[#101C35] mb-1.5"
                    >
                      {t.form.email}
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t.form.emailPlaceholder}
                      className="w-full px-4 py-2.5 text-sm text-[#101C35] bg-[#F4F5F7] border border-slate-200 rounded-md focus:outline-none focus:border-[#C5A46D] focus:bg-white transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="contact-subject"
                    className="block text-xs font-semibold text-[#101C35] mb-1.5"
                  >
                    {t.form.subject}
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder={t.form.subjectPlaceholder}
                    className="w-full px-4 py-2.5 text-sm text-[#101C35] bg-[#F4F5F7] border border-slate-200 rounded-md focus:outline-none focus:border-[#C5A46D] focus:bg-white transition-colors"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-message"
                    className="block text-xs font-semibold text-[#101C35] mb-1.5"
                  >
                    {t.form.message}
                  </label>
                  <textarea
                    id="contact-message"
                    rows={5}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={t.form.messagePlaceholder}
                    className="w-full px-4 py-3 text-sm text-[#101C35] bg-[#F4F5F7] border border-slate-200 rounded-md focus:outline-none focus:border-[#C5A46D] focus:bg-white transition-colors resize-y"
                  />
                </div>

                {error && (
                  <p role="alert" className="text-xs font-medium text-red-600">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold bg-[#101C35] hover:bg-[#1A2B4D] disabled:opacity-60 text-white rounded-md transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Send className="w-4 h-4 text-[#C5A46D]" aria-hidden="true" />
                  <span>{submitting ? t.form.sending : t.form.submit}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
