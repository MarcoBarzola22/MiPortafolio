import React from 'react';
import profilePhoto from '@/assets/marco-barzola-profile.webp';
import { useTranslation } from '@/hooks/useTranslation';

const FrontPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="animate-fade-in-up">
      {/* Main Headline Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        {/* Lead Story - Dual-Layer GPU Portrait (Principle 3 & QA #8-#11) */}
        <div className="lg:col-span-5 column-divider">
          <div className="portrait-container portrait-fallback vintage-border p-1 shadow-sm">
            {/* Capa 1: Base monocroma estática (tinta de periódico - sin animación) */}
            <img
              src={profilePhoto}
              alt={t('frontpage.photoAlt')}
              loading="eager"
              fetchPriority="high"
              width={400}
              height={500}
              className="portrait-layer-base"
            />
            {/* Capa 2: Superposición con calidez vintage analógica (revelado exclusivamente por opacity) */}
            <img
              src={profilePhoto}
              alt=""
              aria-hidden="true"
              loading="eager"
              fetchPriority="high"
              width={400}
              height={500}
              className="portrait-layer-warmth"
            />
          </div>
          <p className="text-caption text-ink-muted mt-2 font-body italic text-center">
            {t('frontpage.photoCaption')}
          </p>
        </div>

        {/* Lead Story - Real Identity Content (Marco Nicolas Barzola) */}
        <div className="lg:col-span-7">
          <div className="mb-4">
            <span className="bg-ink-headline text-paper-base px-2 py-1 text-mono-sm font-mono uppercase tracking-widest font-semibold">
              {t('frontpage.badge')}
            </span>
          </div>
          
          <h2 className="font-headline text-h1 font-bold mb-6 text-ink-headline tracking-tight">
            {t('frontpage.headline')}
          </h2>
          
          <p className="font-headline text-h3 italic text-ink-muted mb-6 border-l-4 border-mint-base pl-4">
            {t('frontpage.subheadline')}
          </p>

          <div className="drop-cap font-body text-body-lg text-ink-body">
            {t('frontpage.dropcap')}
          </div>

          <p className="font-body text-body text-ink-body mt-4">
            {t('frontpage.bioSecond')}
          </p>
        </div>
      </div>

      {/* Horizontal Rule with Ornament */}
      <div className="section-ornament text-ink-muted">
        <span className="font-headline text-body">§</span>
      </div>

      {/* Secondary Headlines */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <article className="article-card p-4 bg-paper-card border border-rule-light">
          <span className="text-mono-sm font-mono uppercase tracking-widest text-mint-base font-semibold">
            {t('frontpage.card1.kicker')}
          </span>
          <h3 className="font-headline text-h3 font-semibold mt-2 mb-3 text-ink-headline">
            {t('frontpage.card1.title')}
          </h3>
          <p className="font-body text-caption text-ink-muted">
            {t('frontpage.card1.desc')}
          </p>
        </article>

        <article className="article-card p-4 bg-paper-card border border-rule-light">
          <span className="text-mono-sm font-mono uppercase tracking-widest text-mint-base font-semibold">
            {t('frontpage.card2.kicker')}
          </span>
          <h3 className="font-headline text-h3 font-semibold mt-2 mb-3 text-ink-headline">
            {t('frontpage.card2.title')}
          </h3>
          <p className="font-body text-caption text-ink-muted">
            {t('frontpage.card2.desc')}
          </p>
        </article>

        <article className="article-card p-4 bg-paper-card border border-rule-light">
          <span className="text-mono-sm font-mono uppercase tracking-widest text-mint-base font-semibold">
            {t('frontpage.card3.kicker')}
          </span>
          <h3 className="font-headline text-h3 font-semibold mt-2 mb-3 text-ink-headline">
            {t('frontpage.card3.title')}
          </h3>
          <p className="font-body text-caption text-ink-muted">
            {t('frontpage.card3.desc')}
          </p>
        </article>
      </div>
    </section>
  );
};

export default FrontPage;
