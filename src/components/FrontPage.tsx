import profilePhoto from '@/assets/profile-photo.jpg';

const FrontPage = () => {
  return (
    <section className="animate-fade-in-up">
      {/* Main Headline Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        {/* Lead Story - Photo */}
        <div className="lg:col-span-5 column-divider">
          <div className="halftone vintage-border p-1 bg-card">
            <img
              src={profilePhoto}
              alt="Systems Engineer Architect"
              className="w-full grayscale contrast-125 hover:grayscale-0 transition-all duration-700"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2 font-body italic text-center">
            Photo by Editorial Staff
          </p>
        </div>

        {/* Lead Story - Content */}
        <div className="lg:col-span-7">
          <div className="mb-4">
            <span className="bg-foreground text-background px-2 py-1 text-xs font-body uppercase tracking-widest">
              Breaking
            </span>
          </div>
          
          <h2 className="font-headline text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            THE <span className="highlight">SYSTEMS</span> ENGINEER ARCHITECT
          </h2>
          
          <p className="font-headline text-xl md:text-2xl italic text-muted-foreground mb-6 border-l-4 border-primary pl-4">
            Building scalable infrastructure and elegant solutions for the modern web
          </p>

          <div className="drop-cap font-body text-lg leading-relaxed text-foreground/90">
            In an era where digital systems grow ever more complex, one engineer stands 
            at the intersection of innovation and reliability. Specializing in cloud 
            architecture, automation workflows, and full-stack development, this 
            portfolio showcases a journey through the most challenging technical 
            landscapes of our time.
          </div>

          <p className="font-body text-base leading-relaxed text-foreground/80 mt-4">
            From orchestrating microservices on Kubernetes to crafting pixel-perfect 
            user interfaces with React, every project represents a commitment to 
            excellence and a passion for solving complex problems with elegant code.
          </p>
        </div>
      </div>

      {/* Horizontal Rule with Ornament */}
      <div className="section-ornament text-muted-foreground">
        <span className="font-headline text-sm">§</span>
      </div>

      {/* Secondary Headlines */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <article className="article-card p-4 bg-card border border-border">
          <span className="text-xs font-body uppercase tracking-widest text-primary">
            Experience
          </span>
          <h3 className="font-headline text-xl font-semibold mt-2 mb-3">
            5+ Years of Building at Scale
          </h3>
          <p className="font-body text-sm text-muted-foreground">
            From startups to enterprise, delivering solutions that handle millions of requests daily.
          </p>
        </article>

        <article className="article-card p-4 bg-card border border-border">
          <span className="text-xs font-body uppercase tracking-widest text-primary">
            Expertise
          </span>
          <h3 className="font-headline text-xl font-semibold mt-2 mb-3">
            Full-Stack & Cloud Native
          </h3>
          <p className="font-body text-sm text-muted-foreground">
            Deep expertise in React, Node.js, TypeScript, AWS, and modern DevOps practices.
          </p>
        </article>

        <article className="article-card p-4 bg-card border border-border">
          <span className="text-xs font-body uppercase tracking-widest text-primary">
            Philosophy
          </span>
          <h3 className="font-headline text-xl font-semibold mt-2 mb-3">
            Automate Everything
          </h3>
          <p className="font-body text-sm text-muted-foreground">
            Believer in infrastructure as code, CI/CD pipelines, and reducing toil through automation.
          </p>
        </article>
      </div>
    </section>
  );
};

export default FrontPage;
