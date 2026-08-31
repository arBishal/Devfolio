import { portfolioData } from "@/data/portfolioData";

export function renderAbout() {
    return (
        <div className="space-y-2">
            <p className="text-t-warning">$ whoami</p>
            <div className="pl-4 space-y-1 text-t-text">
                {portfolioData.personal.bio.map((line, i) => (
                    <p key={i}>{line}</p>
                ))}
            </div>
            <div className="mt-2 pl-4">
                <p className="text-t-accent2">Location:</p>
                <p className="text-t-text pl-4">{portfolioData.personal.location}</p>
                <p className="text-t-accent2 mt-1">Education:</p>
                {portfolioData.personal.education.map((line, i) => (
                    <p key={i} className="text-t-text pl-4">{line}</p>
                ))}
            </div>
        </div>
    );
}

export function renderSkills() {
    return (
        <div className="space-y-2">
            <p className="text-t-warning">$ cat skills.json</p>
            <div className="pl-4 font-mono text-sm">
                <p className="text-t-muted">{"{"}</p>
                <div className="pl-4">
                    {(Object.entries(portfolioData.skills) as [string, string[]][]).map(
                        ([key, values], i, arr) => (
                            <p key={key}>
                                <span className="text-t-accent2">&quot;{key}&quot;</span>
                                {": "}
                                <span className="text-t-text">
                                    [{values.map((v) => `"${v}"`).join(", ")}]
                                </span>
                                {i < arr.length - 1 ? "," : ""}
                            </p>
                        ),
                    )}
                </div>
                <p className="text-t-muted">{"}"}</p>
            </div>
        </div>
    );
}

export function renderProjects() {
    return (
        <div className="space-y-2">
            <p className="text-t-warning">$ ls -la ~/projects/</p>
            <div className="space-y-2 pl-4">
                {portfolioData.projects.map((project) => (
                    <div key={project.name}>
                        <div className="flex items-center gap-4">
                            <p className="text-t-accent2 font-semibold">{project.name}</p>
                            <div className="flex gap-3">
                                {project.github && (
                                    <a
                                        href={project.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-t-accent2 hover:text-t-text transition-colors"
                                        aria-label="GitHub Repository"
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                                        </svg>
                                    </a>
                                )}
                                {project.live && (
                                    <a
                                        href={project.live}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-t-accent2 hover:text-t-text transition-colors"
                                        aria-label="Live Demo"
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                            <polyline points="15 3 21 3 21 9" />
                                            <line x1="10" y1="14" x2="21" y2="3" />
                                        </svg>
                                    </a>
                                )}
                            </div>
                        </div>
                        <p className="text-t-text text-sm mt-1">{project.description}</p>
                        <p className="text-t-muted text-sm mt-2">
                            Tech: {project.tech.join(" • ")}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function renderExperience() {
    return (
        <div className="space-y-2">
            <p className="text-t-warning">$ cat experience.log</p>
            <div className="space-y-4 pl-4">
                {portfolioData.experience.map((job, index) => (
                    <div key={`${job.company}-${index}`}>
                        <div className="flex justify-between items-start flex-wrap gap-2">
                            <p className="text-t-accent2 font-semibold">{job.company}</p>
                            <p className="text-t-muted text-sm">{job.period}</p>
                        </div>
                        <p className="text-t-accent2 text-sm opacity-75">{job.title}</p>
                        <ul className="text-t-text text-sm mt-2 space-y-1">
                            {job.achievements.map((achievement, i) => (
                                <li key={i} className="flex gap-2">
                                    <span className="text-t-muted flex-shrink-0 select-none">-</span>
                                    <span>{achievement}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function renderResume() {
    return (
        <div className="space-y-2">
            <p className="text-t-warning">$ wget resume.pdf</p>
            <div className="pl-4 space-y-1">
                <p className="text-t-text">Downloading resume...</p>
                <div className="flex items-center gap-2">
                    <div className="w-48 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full w-full bg-t-accent text-t-btn-text animate-pulse"></div>
                    </div>
                    <span className="text-t-accent">100%</span>
                </div>
                <p className="text-t-accent2 mt-1">✓ Resume download initiated successfully!</p>
                <a
                    href={portfolioData.resume.filePath}
                    download={portfolioData.resume.downloadFilename}
                    className="inline-block mt-1 px-4 py-2 bg-t-accent text-t-btn-text rounded hover:opacity-80 transition-colors font-medium"
                >
                    Click here if download doesn&apos;t start
                </a>
            </div>
        </div>
    );
}

export function renderContact() {
    return (
        <div className="space-y-2">
            <p className="text-t-warning">$ cat contact.txt</p>
            <div className="pl-4">
                <div className="flex items-center gap-3">
                    <span className="text-t-accent2">Email:</span>
                    <a
                        href={`mailto:${portfolioData.contact.email}`}
                        className="text-t-text hover:underline"
                    >
                        {portfolioData.contact.email}
                    </a>
                </div>
                {portfolioData.contact.links.map((item) => (
                    <div key={item.label} className="flex items-center gap-3">
                        <span className="text-t-accent2">{item.label}:</span>
                        <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-t-text hover:underline"
                        >
                            {item.display}
                        </a>
                    </div>
                ))}
            </div>
            <p className="text-t-muted mt-2 pl-4 text-sm">{portfolioData.contact.note}</p>
        </div>
    );
}

export function renderBlog() {
    return (
        <div className="space-y-2">
            <p className="text-t-warning">$ cat blog-links.txt</p>
            <div className="pl-4">
                <p className="text-t-text mb-2">
                    Check out my articles and technical writing:
                </p>
                {portfolioData.blog.links.map((item) => (
                    <div key={item.label} className="flex items-center gap-2">
                        <span className="text-t-accent2">{item.label}:</span>
                        <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-t-text hover:underline"
                        >
                            {item.display}
                        </a>
                    </div>
                ))}
            </div>
            <p className="text-t-muted mt-2 pl-4 text-sm">{portfolioData.blog.tagline}</p>
        </div>
    );
}

export function renderPublications() {
    return (
        <div className="space-y-2">
            <p className="text-t-warning">$ cat publications.md</p>
            <div className="space-y-4 pl-4">
                {portfolioData.publications.map((pub, index) => (
                    <div key={index}>
                        <div className="flex items-center flex-wrap gap-3">
                            <p className="text-t-accent2 font-semibold">{pub.title}</p>
                            <span className="border border-t-muted text-t-muted px-2 py-0.5 rounded text-xs font-medium">{pub.status}</span>
                        </div>
                        <p className="text-t-text mt-1 text-sm">{pub.authors}</p>
                        <p className="text-t-muted mt-1 text-sm">{pub.journal} • {pub.year}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function renderInterests() {
    return (
        <div className="space-y-2">
            <p className="text-t-warning">$ cat interests.txt</p>
            <div className="pl-4 space-y-2">
                <p>
                    <span className="text-t-accent2">Research Focus:</span>{" "}
                    <span className="text-t-text">{portfolioData.interests.researchFocus}</span>
                </p>
                <p>
                    <span className="text-t-accent2">Creative Pursuits:</span>{" "}
                    <span className="text-t-text">{portfolioData.interests.creativePursuits}</span>
                </p>
            </div>
        </div>
    );
}
