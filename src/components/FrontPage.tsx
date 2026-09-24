import profilePhoto from '@/assets/profile-photo.jpg';

const FrontPage = () => {
  return (
    <section className="animate-fade-in-up">
      {/* Main Headline Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        {/* Lead Story - Photo */}
        <div className="lg:col-span-5 column-divider">
          <div className="halftone vintage-border p-1 bg-paper-card">
            <img
              src={profilePhoto}
              alt="Systems Engineer Architect"
              className="w-full grayscale contrast-125 hover:grayscale-0 transition-all duration-700"
            />
          </div>
          <p className="text-caption text-ink-muted mt-2 font-body italic text-center">
            Photo by Editorial Staff
          </p>
        </div>

        {/* Lead Story - Content */}
        <div className="lg:col-span-7">
          <div className="mb-4">
            <span className="bg-ink-headline text-paper-base px-2 py-1 text-mono-sm font-mono uppercase tracking-widest font-semibold">
              Breaking
            </span>
          </div>
          
          <h2 className="font-headline text-h1 font-bold mb-6 text-ink-headline">
            THE <span className="highlight">SYSTEMS</span> ENGINEER ARCHITECT
          </h2>
          
          <p className="font-headline text-h3 italic text-ink-muted mb-6 border-l-4 border-mint-base pl-4">
            Building scalable infrastructure and elegant solutions for the modern web
          </p>

          <div className="drop-cap font-body text-body-lg text-ink-body">
            In an era where digital systems grow ever more complex, one engineer stands 
            at the intersection of innovation and reliability. Specializing in cloud 
            architecture, automation workflows, and full-stack development, this 
            portfolio showcases a journey through the most challenging technical 
            landscapes of our time.
          </div>

          <p className="font-body text-body text-ink-body mt-4">
            From orchestrating microservices on Kubernetes to crafting pixel-perfect 
            user interfaces with React, every project represents a commitment to 
            excellence and a passion for solving complex problems with elegant code.
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
            Experience
          </span>
          <h3 className="font-headline text-h3 font-semibold mt-2 mb-3 text-ink-headline">
            5+ Years of Building at Scale
          </h3>
          <p className="font-body text-caption text-ink-muted">
            From startups to enterprise, delivering solutions that handle millions of requests daily.
          </p>
        </article>

        <article className="article-card p-4 bg-paper-card border border-rule-light">
          <span className="text-mono-sm font-mono uppercase tracking-widest text-mint-base font-semibold">
            Expertise
          </span>
          <h3 className="font-headline text-h3 font-semibold mt-2 mb-3 text-ink-headline">
            Full-Stack & Cloud Native
          </h3>
          <p className="font-body text-caption text-ink-muted">
            Deep expertise in React, Node.js, TypeScript, AWS, and modern DevOps practices.
          </p>
        </article>

        <article className="article-card p-4 bg-paper-card border border-rule-light">
          <span className="text-mono-sm font-mono uppercase tracking-widest text-mint-base font-semibold">
            Philosophy
          </span>
          <h3 className="font-headline text-h3 font-semibold mt-2 mb-3 text-ink-headline">
            Automate Everything
          </h3>
          <p className="font-body text-caption text-ink-muted">
            Believer in infrastructure as code, CI/CD pipelines, and reducing toil through automation.
          </p>
        </article>
      </div>
    </section>
  );
};

export default FrontPage;
