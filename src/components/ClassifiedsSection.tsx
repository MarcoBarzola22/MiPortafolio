import React from 'react';
import { Mail, Github, Linkedin, MapPin, Globe, FileText, Download } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import ContactForm from '@/components/ContactForm';

const ClassifiedsSection: React.FC = () => {
  const { language, t } = useTranslation();

  const cvUrl = language === 'en' ? '/cv-en.pdf' : '/cv-es.pdf';

  const contactLinks = [
    {
      icon: <Mail className="w-5 h-5" aria-hidden="true" />,
      label: t('classifieds.emailLabel'),
      value: t('classifieds.emailValue'),
      href: 'mailto:marcobarzoladev@gmail.com',
    },
    {
      icon: <Github className="w-5 h-5" aria-hidden="true" />,
      label: t('classifieds.githubLabel'),
      value: t('classifieds.githubValue'),
      href: 'https://github.com/MarcoBarzola22',
    },
    {
      icon: <Linkedin className="w-5 h-5" aria-hidden="true" />,
      label: t('classifieds.linkedinLabel'),
      value: t('classifieds.linkedinValue'),
      href: 'https://www.linkedin.com/in/marco-nicolás-barzola-789a8a341',
    },
  ];

  return (
    <section className="animate-fade-in-up w-full max-w-full">
      {/* Section Header */}
      <div className="text-center mb-8">
        <span className="bg-ink-headline text-paper-base px-3 py-1 text-mono-sm font-mono uppercase tracking-widest font-semibold">
          {t('classifieds.kicker')}
        </span>
        <h2 className="font-headline text-2xl sm:text-3xl md:text-h2 font-bold mt-4 text-ink-headline break-words">
          {t('classifieds.title')}
        </h2>
        <p className="font-headline text-sm sm:text-base md:text-body-lg italic text-ink-muted mt-2">
          {t('classifieds.subtitle')}
        </p>
      </div>

      {/* Divider */}
      <div className="border-t-2 border-b border-rule-bold py-1 mb-8">
        <div className="border-t border-rule-light"></div>
      </div>

      {/* Classified Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {/* About Box - Marco Nicolas Barzola Real Background */}
        <div className="md:col-span-2 border-2 border-rule-bold p-6 bg-paper-card">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-mint-base" aria-hidden="true" />
            <span className="font-headline text-h3 font-bold uppercase tracking-wide text-ink-headline">
              {t('classifieds.aboutTitle')}
            </span>
          </div>
          
          <p className="font-body text-body-lg leading-relaxed text-ink-body drop-cap">
            {t('classifieds.aboutBio')}
          </p>

          <p className="font-body text-body leading-relaxed text-ink-body mt-4">
            {t('classifieds.aboutBioSecond')}
          </p>

          <div className="mt-6 pt-4 border-t border-dashed border-rule-dashed flex flex-wrap items-center gap-4 text-caption text-ink-muted">
            <span className="flex items-center gap-1 font-mono">
              <MapPin className="w-4 h-4 text-mint-base" aria-hidden="true" /> {t('classifieds.location')}
            </span>
            <span className="flex items-center gap-1 font-mono">
              <Globe className="w-4 h-4 text-mint-base" aria-hidden="true" /> {t('classifieds.availability')}
            </span>
          </div>
        </div>

        {/* Contact Box */}
        <div className="border-2 border-rule-bold p-6 bg-paper-card flex flex-col justify-between">
          <div>
            <div className="text-center mb-6">
              <span className="font-headline text-h3 font-bold uppercase tracking-wide block mb-2 text-ink-headline">
                {t('classifieds.contactBoxTitle')}
              </span>
              <p className="font-body text-caption text-ink-muted italic">
                {t('classifieds.contactBoxSubtitle')}
              </p>
            </div>

            <div className="space-y-4">
              {contactLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 border border-rule-light bg-paper-muted hover:border-mint-base hover:bg-paper-elevated transition-all duration-300 group rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-mint-base"
                >
                  <span className="text-mint-base">{link.icon}</span>
                  <div>
                    <span className="font-mono text-mono-sm uppercase tracking-widest text-ink-muted block">
                      {link.label}
                    </span>
                    <span className="font-mono text-body text-ink-headline group-hover:text-mint-base transition-colors">
                      {link.value}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* CTA - Descargar CV */}
          <a 
            href={cvUrl}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="w-full mt-6 py-3 bg-mint-base text-mint-contrast font-mono text-mono-sm font-semibold uppercase tracking-wider hover:bg-mint-hover transition-colors shadow-md rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-mint-base cursor-pointer flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" aria-hidden="true" />
            <span>{t('classifieds.downloadCv')}</span>
          </a>
        </div>
      </div>

      {/* Formulario de Contacto Editorial */}
      <div className="mt-8">
        <ContactForm />
      </div>

      {/* Footer */}
      <footer className="mt-12 pt-8 border-t border-rule-light text-center">
        <p className="font-headline text-h3 mb-2 text-ink-headline">{t('classifieds.footerTitle')}</p>
        <p className="font-body text-caption text-ink-muted">
          {t('classifieds.footerCopy', { year: new Date().getFullYear() })}
        </p>
        <p className="font-body text-caption text-ink-subtle mt-2 italic">
          {t('classifieds.footerQuote')}
        </p>
      </footer>
    </section>
  );
};

export default ClassifiedsSection;
