import { Mail, Github, Linkedin, MapPin, Phone, FileText } from 'lucide-react';

const ClassifiedsSection = () => {
  const contactLinks = [
    { icon: <Mail className="w-5 h-5" />, label: "Email", value: "hello@portfolio.dev", href: "mailto:hello@portfolio.dev" },
    { icon: <Github className="w-5 h-5" />, label: "GitHub", value: "@developer", href: "https://github.com" },
    { icon: <Linkedin className="w-5 h-5" />, label: "LinkedIn", value: "/in/developer", href: "https://linkedin.com" },
  ];

  return (
    <section className="animate-fade-in-up">
      {/* Section Header */}
      <div className="text-center mb-8">
        <span className="bg-ink-headline text-paper-base px-3 py-1 text-mono-sm font-mono uppercase tracking-widest font-semibold">
          Classifieds
        </span>
        <h2 className="font-headline text-h2 font-bold mt-4 text-ink-headline">
          GET IN <span className="highlight">TOUCH</span>
        </h2>
        <p className="font-headline text-body-lg italic text-ink-muted mt-2">
          For Inquiries & Opportunities
        </p>
      </div>

      {/* Divider */}
      <div className="border-t-2 border-b border-rule-bold py-1 mb-8">
        <div className="border-t border-rule-light"></div>
      </div>

      {/* Classified Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* About Box */}
        <div className="md:col-span-2 border-2 border-rule-bold p-6 bg-paper-card">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-mint-base" />
            <span className="font-headline text-h3 font-bold uppercase tracking-wide text-ink-headline">
              About the Author
            </span>
          </div>
          
          <p className="font-body text-body-lg leading-relaxed text-ink-body drop-cap">
            A passionate systems engineer and architect with over five years of experience 
            building scalable applications and cloud infrastructure. Specializing in React 
            ecosystems, Node.js backends, and DevOps practices. Currently exploring the 
            intersection of AI and automation to create smarter developer workflows.
          </p>

          <p className="font-body text-body leading-relaxed text-ink-body mt-4">
            When not architecting systems, you'll find me contributing to open-source projects, 
            writing technical articles, or exploring new technologies. I believe in clean code, 
            comprehensive documentation, and the power of automation.
          </p>

          <div className="mt-6 pt-4 border-t border-dashed border-rule-dashed flex items-center gap-4 text-caption text-ink-muted">
            <span className="flex items-center gap-1 font-mono">
              <MapPin className="w-4 h-4 text-mint-base" /> San Francisco, CA
            </span>
            <span className="flex items-center gap-1 font-mono">
              <Phone className="w-4 h-4 text-mint-base" /> Available for Remote
            </span>
          </div>
        </div>

        {/* Contact Box */}
        <div className="border-2 border-rule-bold p-6 bg-paper-card flex flex-col justify-between">
          <div>
            <div className="text-center mb-6">
              <span className="font-headline text-h3 font-bold uppercase tracking-wide block mb-2 text-ink-headline">
                ★ Contact ★
              </span>
              <p className="font-body text-caption text-ink-muted italic">
                Let's build something together
              </p>
            </div>

            <div className="space-y-4">
              {contactLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 border border-rule-light bg-paper-muted hover:border-mint-base hover:bg-paper-elevated transition-all duration-300 group rounded"
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

          {/* CTA */}
          <button 
            type="button"
            className="w-full mt-6 py-3 bg-mint-base text-mint-contrast font-mono text-mono-sm font-semibold uppercase tracking-wider hover:bg-mint-hover transition-colors shadow-md rounded"
          >
            Download Resume
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-12 pt-8 border-t border-rule-light text-center">
        <p className="font-headline text-h3 mb-2 text-ink-headline">THE PORTFOLIO TIMES</p>
        <p className="font-body text-caption text-ink-muted">
          © {new Date().getFullYear()} All Rights Reserved · Crafted with React & TypeScript
        </p>
        <p className="font-body text-caption text-ink-subtle mt-2 italic">
          "Code is poetry, architecture is art"
        </p>
      </footer>
    </section>
  );
};

export default ClassifiedsSection;
