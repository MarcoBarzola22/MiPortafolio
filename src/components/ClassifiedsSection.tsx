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
        <span className="bg-foreground text-background px-3 py-1 text-xs font-body uppercase tracking-widest">
          Classifieds
        </span>
        <h2 className="font-headline text-4xl md:text-5xl font-bold mt-4">
          GET IN <span className="highlight">TOUCH</span>
        </h2>
        <p className="font-headline text-lg italic text-muted-foreground mt-2">
          For Inquiries & Opportunities
        </p>
      </div>

      {/* Divider */}
      <div className="border-t-2 border-b border-foreground/80 py-1 mb-8">
        <div className="border-t border-foreground/30"></div>
      </div>

      {/* Classified Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* About Box */}
        <div className="md:col-span-2 border-2 border-foreground/80 p-6 bg-card">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-primary" />
            <span className="font-headline text-lg font-bold uppercase tracking-wide">
              About the Author
            </span>
          </div>
          
          <p className="font-body text-base leading-relaxed text-foreground/90 drop-cap">
            A passionate systems engineer and architect with over five years of experience 
            building scalable applications and cloud infrastructure. Specializing in React 
            ecosystems, Node.js backends, and DevOps practices. Currently exploring the 
            intersection of AI and automation to create smarter developer workflows.
          </p>

          <p className="font-body text-base leading-relaxed text-foreground/80 mt-4">
            When not architecting systems, you'll find me contributing to open-source projects, 
            writing technical articles, or exploring new technologies. I believe in clean code, 
            comprehensive documentation, and the power of automation.
          </p>

          <div className="mt-6 pt-4 border-t border-dashed border-foreground/30 flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" /> San Francisco, CA
            </span>
            <span className="flex items-center gap-1">
              <Phone className="w-4 h-4" /> Available for Remote
            </span>
          </div>
        </div>

        {/* Contact Box */}
        <div className="border-2 border-foreground/80 p-6 bg-card">
          <div className="text-center mb-6">
            <span className="font-headline text-xl font-bold uppercase tracking-wide block mb-2">
              ★ Contact ★
            </span>
            <p className="font-body text-sm text-muted-foreground italic">
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
                className="flex items-center gap-3 p-3 border border-foreground/30 hover:bg-primary/10 hover:border-primary transition-all duration-300 group"
              >
                <span className="text-primary">{link.icon}</span>
                <div>
                  <span className="font-body text-xs uppercase tracking-widest text-muted-foreground block">
                    {link.label}
                  </span>
                  <span className="font-body text-sm text-foreground group-hover:text-primary transition-colors">
                    {link.value}
                  </span>
                </div>
              </a>
            ))}
          </div>

          {/* CTA */}
          <button className="w-full mt-6 py-3 bg-primary text-primary-foreground font-body font-semibold uppercase tracking-wider hover:bg-primary/90 transition-colors">
            Download Resume
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-12 pt-8 border-t border-foreground/30 text-center">
        <p className="font-headline text-2xl mb-2">THE PORTFOLIO TIMES</p>
        <p className="font-body text-sm text-muted-foreground">
          © {new Date().getFullYear()} All Rights Reserved · Crafted with React & TypeScript
        </p>
        <p className="font-body text-xs text-muted-foreground mt-2 italic">
          "Code is poetry, architecture is art"
        </p>
      </footer>
    </section>
  );
};

export default ClassifiedsSection;
