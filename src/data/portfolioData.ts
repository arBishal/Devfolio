
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
    title: "Software Engineer",
    username: "arBishal",
    location: "Dhaka, Bangladesh",
    education: [
      "B.Sc in Computer Science & Engineering",
      "Shahjalal University of Science & Technology",
    ],
    bio: [
      "A software engineer crafting seamless, user-first experiences—driven by detail, design, and a dash of storytelling; powered by human curiosity, and amplified by AI-assisted workflows. Currently, at Dynamic Solution Innovators Ltd., supporting the digital operations of 190+ financial institutions, impacting over 85+ million end users.",
      "Engineering digital solutions for millions by day; chasing ideas through code, visuals, and words by night. Has a strong affinity for building fun, visually striking products that feel as good as they look. Always creating. Always telling stories.",
    ],
    portfolioVersion: "v2.0.1",
  },

  // Resume ---------------------------------------------------
  resume: {
    filePath: "/Résumé_of_Ashikur_Rahman_Bishal.pdf",
    downloadFilename: "Résumé_of_Ashikur_Rahman_Bishal.pdf",
  },

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
      name: "Terminal-Devfolio",
      description:
        "This is the very thing you are visiting right now, my developer portfolio living inside a terminal; as well a minimal stoick mode.",
      tech: ["TypeScript", "React.js", "TailwindCSS"],
      github: "https://github.com/arBishal/Terminal-Devfolio",
    },
    {
      name: "FRONTEND 101",
      description:
        "An interactive simulation platform teaching frontend fundamentals through live, manipulable demonstrations paired with written explanations. Structured topics from first principles to composition.",
      tech: ["TypeScript", "Next.js", "TailwindCSS", "Shiki", "Claude Code"],
      github: "https://github.com/arBishal/frontend-101",
      live: "https://frontend101.arbishal.com",
    },
    {
      name: "Fireflies",
      description:
        "This is a tribute to the near-extinction fireflies. An interactive firefly simulation, preserving their magic through generative motion and flickering light. Implemented touch/cursor reactive physics—fireflies drift, pulse, and gently attract or scatter based on interaction; with real-time controls for population, radius, speed, etc.",
      tech: ["JavaScript", "Vue.js", "TailwindCSS", "Canvas API"],
      github: "https://github.com/arBishal/Fireflies",
      live: "https://fireflies.arbishal.com",
    },
  ],

  // Work Experience ------------------------------------------
  experience: [
    {
      title: "Software Development Unit",
      period: "April 2023 – Present",
      company: "Dynamic Solution Innovators Ltd.",
      achievements: [
        "Accelerated development workflows by integrating AI-assisted tooling, cutting repetitive overhead and shipping features faster across multiple projects.",
        // "Mentored junior engineers through structured technical coaching, including hands-on code reviews, pair programming, and knowledge-sharing sessions, improving overall team capability.",
        "Performed in-depth security auditing and applied mitigation strategies to resolve application-level vulnerabilities.",
        "Proactively built helper tools adopted across the team to automate repetitive workflows; increasing efficiency, and reducing delivery time.",
        "Identified and resolved critical performance bottlenecks across multiple applications, optimizing API call efficiency, reducing unnecessary network calls.",
        "Demonstrated strong accountability and data ethics in handling sensitive, and bulk banking data; strictly adhering to data privacy standards and regulatory compliance requirements.",
        "Led migration of legacy monolithic architecture to a modern multi-tenant platform, delivering a fully tested and documented transition across multiple services with zero critical disruptions.",
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

};
