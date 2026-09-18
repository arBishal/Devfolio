
// ============================================================
// Portfolio Data
// ============================================================
// Edit this file to update all portfolio content.
// No changes to component code are needed.
// ============================================================

import type { PortfolioData } from "@/types/portfolio";

export const portfolioData: PortfolioData = {
  // Personal Info --------------------------------------------
  personal: {
    fullName: "Ashikur Rahman Bishal",
    shortName: "Bishal",
    title: "Coding Stories",
    username: "arBishal",
    location: "Dhaka, Bangladesh",
    education: [
      "B.Sc in Computer Science & Engineering",
      "Shahjalal University of Science & Technology",
    ],
    bio: [
      "A software engineer crafting seamless, user-first experiences; driven by detail, design, and a dash of storytelling. Powered by human curiosity, and amplified by AI-assisted workflows. Currently, at Dynamic Solution Innovators Ltd., supporting the digital operations of 190+ financial institutions, impacting over 85+ million end users. Always creating. Always telling stories.",
    ],
    portfolioVersion: "v2.1.0",
  },

  // Resume ---------------------------------------------------
  resume: {
    filePath: "/Résumé_of_Ashikur_Rahman_Bishal.pdf",
    downloadFilename: "Résumé_of_Ashikur_Rahman_Bishal.pdf",
  },

  // Work Experience ------------------------------------------
  experience: [
    {
      title: "Software Development Unit",
      period: "April 2023 – Present",
      company: "Dynamic Solution Innovators Ltd.",
      achievements: [
        "Accelerated development workflows by integrating AI-assisted tooling, cutting repetitive overhead and shipping features faster across multiple projects.",
        // "Mentored junior engineers through structured technical coaching, including hands-on code reviews, pair programming, and knowledge-sharing sessions, improving overall team capability.",
        "Audited application dependencies for security vulnerabilities, implementing compatible upgrades and Content-Security-Policy enforcement to strengthen application security.",
        "Proactively built helper tools adopted across the team to automate repetitive workflows; increasing efficiency, and reducing delivery time.",
        "Designed a keep-alive mechanism that enforced a maximum of ≤ 2 req/min API rate limits, eliminating redundant traffic while preserving seamless session continuity.",
        "Diagnosed and resolved logic errors and edge-case flaws in deployed applications, averting potential escalations and client-side friction.",
        "Led migration of legacy monolithic architecture to a modern multi-tenant platform, delivering a fully tested and documented transition across multiple services with zero critical disruptions.",
        "Took ownership of critical production issues, minimizing downtime through swift resolution.",
        "Demonstrated strong accountability and data ethics in handling sensitive, and high-volume banking data; strictly adhering to data privacy standards and regulatory compliance requirements.",
        "Collaborated with cross-functional and distributed teams across multiple projects to deliver reliable, scalable, and maintainable software solutions.",
        "Consistently produced clean, well-structured code and comprehensive documentation, upholding high engineering standards to support long-term maintainability and team knowledge sharing.",
      ],
    },
    {
      title: "Research Intern",
      period: "January 2022 – October 2022",
      company: "Ministry of ICT Division",
      achievements: [
        "Formulated the mathematical scoring model for a financial reputation engine, deriving logarithmic scoring functions over money transfer, loan repayment, and bill payment behaviour.",
        "Designed the aggregation function combining these scores with account age, bounded to a normalized range using a modified sigmoid transformation.",
        "Implemented the engine as recursive time-indexed algorithms with thorough documentation.",
      ],
    },
  ],

  // Skills ---------------------------------------------------
  skills: {
    programming: ["JavaScript", "TypeScript", "C++"],
    webStack: ["React.js", "Next.js", "Vue.js", "Meteor.js", "HTML5", "CSS3", "TailwindCSS"],
    databases: ["Oracle", "PostgreSQL", "MongoDB"],
    tools: ["Git", "SVN", "Postman", "JIRA", "Datadog", "Figma"],
    aiWorkflows: ["Claude Code", "Antigravity", "Codex"],
    practices: ["Agile (SCRUM)", "Cross-Team Collaboration"],
  },

  // Projects -------------------------------------------------
  projects: [
    {
      name: "Devfolio",
      description:
        "You're looking at it: Portfolio-as-CLI. Type commands to explore my work, or switch to a minimal view if you'd rather skip the keystrokes.",
      tech: ["TypeScript", "React.js", "TailwindCSS"],
      github: "https://github.com/arBishal/Terminal-Devfolio",
    },
    {
      name: "Frontend 101",
      description:
        "Frontend, but you can poke it. Live, manipulable demos teach the fundamentals. A Lab mode is next, bringing a real code sandbox.",
      tech: ["TypeScript", "Next.js", "TailwindCSS", "Shiki", "Claude Code"],
      github: "https://github.com/arBishal/frontend-101",
      live: "https://frontend101.arbishal.com",
    },
    {
      name: "Fireflies",
      description:
        "A love letter to a dying light. Nudge your cursor or move your thumb, and watch them drift, pulse, scatter like they know you're there.",
      tech: ["JavaScript", "Vue.js", "TailwindCSS", "Canvas API"],
      github: "https://github.com/arBishal/Fireflies",
      live: "https://fireflies.arbishal.com",
    },
  ],

  // Publications ---------------------------------------------
  publications: [
    {
      title: "A Blockchain Empowered & Reputation Integrated e-KYC System",
      status: "UNDER REVIEW",
      year: "2026",
      journal: "Blockchain: Research and Applications (Elsevier) · Manuscript Number: BCRA-D-26-00874",
      authors: "Md Yeasin Ali, Abrar Fahim, Romana Mahjabin Eshita, Kiriti Mukherjee, Md. Ashikur Rahman Bishal, Md. Masum Alam Nahid, Mohammad Jabed Morshed Chowdhury, Mohammad Shahriar Rahman, and Md Sadek Ferdous"
    }
  ],

  // Interests ------------------------------------------------
  interests: {
    researchFocus: "Blockchain & Distributed Systems, Practical AI Applications for Productivity",
    creativePursuits: "Storytelling & Creative Writing, Graphic Design, Photography"
  },

  // Blog Links -----------------------------------------------
  blog: {
    tagline: "Writing about software development, web technologies, and engineering practices.",
    links: [
      {
        label: "Medium",
        url: "https://medium.com/@arBishal",
        display: "medium.com/@arBishal",
      },
      {
        label: "Dev.to",
        url: "https://dev.to/arBishal",
        display: "dev.to/arBishal",
      },
    ],
  },

  // Contact --------------------------------------------------
  contact: {
    email: "m.arbishal@gmail.com",
    links: [
      {
        label: "Phone",
        url: "tel:+8801601610160",
        display: "+880 1601610160",
      },
      {
        label: "GitHub",
        url: "https://github.com/arBishal",
        display: "github.com/arBishal",
      },
      {
        label: "LinkedIn",
        url: "https://linkedin.com/in/arBishal",
        display: "linkedin.com/in/arBishal",
      },
    ],
    note: "Open to new opportunities and collaborations. Feel free to reach out!",
  },

};
