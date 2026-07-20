import { validateCv } from "@/domain/cv";

export const defaultCv = validateCv({
  schemaVersion: 1,
  basics: {
    name: "Kostiantyn Mironchyk",
    headline: "Senior Full Stack Developer",
    location: "Abu Dhabi, UAE",
    availability: "Open to remote and onsite opportunities",
    links: [{ label: "LinkedIn", url: "https://www.linkedin.com/in/koc9n" }],
  },
  summary:
    "Results-driven Senior Full Stack Developer with 10+ years of experience building scalable, high-performance web applications and enterprise backend systems. Experienced in Java, Node.js, Angular, AWS, Docker, and Kubernetes, with a track record in microservices, infrastructure migrations, performance optimization, and team mentorship.",
  skills: [
    { category: "Languages", items: ["Java", "JavaScript", "TypeScript", "Node.js", "HTML", "CSS"] },
    { category: "Backend", items: ["Spring Boot", "Hibernate", "Express.js", "JSF", "REST APIs", "Microservices"] },
    { category: "Frontend", items: ["Angular"] },
    { category: "Cloud & DevOps", items: ["AWS", "Docker", "Kubernetes", "Terraform", "Helm", "Jenkins", "Git", "CI/CD"] },
    { category: "Data", items: ["PostgreSQL", "MySQL", "MongoDB", "Redis", "Oracle"] },
    { category: "Messaging & Observability", items: ["Kafka", "RabbitMQ", "ELK Stack"] },
    { category: "Practices", items: ["TDD", "Agile", "Scrum", "Mentoring", "Code Review"] },
  ],
  experience: [
    {
      role: "Senior Full Stack Developer",
      employer: "Allianz Technology",
      location: "Bangkok, Thailand",
      start: "Oct 2018",
      end: "Nov 2025",
      achievements: [
        { text: "Engineered and maintained critical microservices for a roadside assistance platform using Java, Spring Boot, Node.js, and Angular." },
        { text: "Spearheaded an AWS infrastructure migration using Docker, Kubernetes, and Terraform, reducing deployment time by 40%." },
        { text: "Integrated real-time tracking with Kafka and RabbitMQ, increasing dispatch efficiency by 30%." },
        { text: "Led code reviews and Agile ceremonies and mentored junior engineers, improving team velocity by 20%." },
      ],
      technologies: ["Java", "Spring Boot", "Node.js", "Angular", "AWS", "Docker", "Kubernetes", "Terraform", "Kafka", "RabbitMQ"],
    },
    {
      role: "Java Developer",
      employer: "Mobile Technologies",
      location: "Bangkok, Thailand",
      start: "Dec 2016",
      end: "Oct 2018",
      achievements: [
        { text: "Developed key components for a telecom management system using Java, Spring, Hibernate, and JSF." },
        { text: "Improved application stability by resolving critical defects and delivering features with cross-functional teams." },
      ],
      technologies: ["Java", "Spring", "Hibernate", "JSF"],
    },
    {
      role: "Freelance Backend Developer",
      employer: "Independent",
      location: "Phuket, Thailand",
      start: "Mar 2016",
      end: "Dec 2016",
      achievements: [
        { text: "Built REST APIs for a dating platform using Node.js, Express.js, and PostgreSQL." },
        { text: "Designed and deployed secure, scalable backend services for a cryptocurrency wallet application." },
      ],
      technologies: ["Node.js", "Express.js", "PostgreSQL"],
    },
    {
      role: "Java Developer",
      employer: "AxiomSL, Accepic, Intexcs, Provectus IT, CHI Software, NIX Solutions, Avek",
      location: "Ukraine",
      start: "2010",
      end: "2016",
      achievements: [
        { text: "Contributed throughout the software development lifecycle on enterprise software projects." },
        { text: "Developed backend capabilities with Java, JSF, Hibernate, Oracle, and JBoss." },
        { text: "Improved performance and resolved defects across mission-critical applications." },
      ],
      technologies: ["Java", "JSF", "Hibernate", "Oracle", "JBoss"],
    },
  ],
  education: [{ degree: "Bachelor's Degree in Computer Science", institution: "Kharkiv National University of Radio Electronics", period: "2006 - 2011" }],
  achievements: [
    { text: "Led an AWS cloud migration at Allianz Technology, re-architecting legacy systems into cloud-native services." },
    { text: "Improved system scalability through modular microservices and infrastructure-as-code practices." },
  ],
});
