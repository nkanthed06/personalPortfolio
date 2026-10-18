import amazonLogo from "../assets/logos/amazon.png";
import ibmLogo from "../assets/logos/ibm.png";
import lemnLabLogo from "../assets/logos/lemn-lab.svg?raw";
import sanquestLogo from "../assets/logos/sanquest.svg?raw";

// Work experience, shown newest first on the timeline.
// start/end are "YYYY-MM"; end: null means the role is ongoing.
// logo is either { src } for an image file or { svg } for inline SVG markup.
export const experience = [
  {
    org: "Amazon",
    url: "https://www.amazon.com",
    logo: { src: amazonLogo },
    role: "Software Development Engineer Intern",
    team: "Prime Video",
    teamUrl: "https://www.primevideo.com",
    location: "Seattle, WA",
    start: "2026-09",
    end: "2026-12",
    current: true,
    points: [
      "Productionized Prime Video's Composite Metrics ML system across training, inference, and validation, aligning research and production so economists can reliably measure long-term engagement and monetization impact from A/B tests.",
      "Built an automated pre-submit ML test pipeline covering train → inference → validation, catching configuration and runtime failures before code review.",
      "Built self-service model explainability and hosted validation reporting, helping economists investigate experiment results faster with less manual analysis.",
    ],
    tags: ["Python", "ML Pipelines", "Explainability", "A/B Testing"],
  },
  {
    org: "IBM",
    url: "https://www.ibm.com",
    logo: { src: ibmLogo },
    role: "Software Development Engineering Co-op",
    team: "HashiCorp",
    teamUrl: "https://www.hashicorp.com",
    location: "Austin, TX",
    start: "2026-08",
    end: "2026-09",
    points: [
      "Detected new API documentation issues with 15 custom rules in the vacuum OpenAPI linter, using Go tools in GitHub Actions to compare specs before and after code changes, tested with 30 passing and failing cases.",
      "Integrated a Claude agent into GitHub Actions that analyzes Go endpoint code and lint findings, then suggests missing path descriptions, operation summaries, and typed response schemas as one-click PR fixes.",
      "Validated agent-proposed fixes in isolated builds by regenerating specs with Vault's Go OpenAPI generator and running Swagger and TypeScript client compatibility checks.",
    ],
    tags: ["Go", "C++", "OpenAPI", "GitHub Actions", "Claude", "TypeScript"],
  },
  {
    org: "Lemn Lab",
    url: "https://ucsd.edu",
    logo: { svg: lemnLabLogo },
    role: "Machine Learning Researcher",
    team: "Language Learning Research",
    location: "La Jolla, CA",
    start: "2025-01",
    end: "2026-01",
    points: [
      "Improved speech recognition for 7 underrepresented languages by fine-tuning OpenAI Whisper with PyTorch on Google FLEURS and other public datasets, reducing word error rate by 52% relative to baseline.",
      "Reduced trainable parameters by 98.7% (244M → 3.2M) by applying LoRA to Whisper and comparing WER against full fine-tuning, documenting findings for an ongoing research manuscript.",
      "Automated Bayesian hyperparameter sweeps on Kubernetes and tracked results in Weights & Biases.",
    ],
    tags: ["PyTorch", "Whisper", "LoRA", "Kubernetes", "Weights & Biases"],
  },
  {
    org: "SanQuest Inc.",
    url: "",
    logo: { svg: sanquestLogo },
    role: "Software Development Engineer Intern",
    team: "Cloud Solutions",
    location: "Irving, TX",
    start: "2025-06",
    end: "2025-09",
    points: [
      "Built an HR onboarding dashboard with React, FastAPI, and PostgreSQL to centralize employee documents and track missing, submitted, and verified records.",
      "Integrated the DocuSign API with FastAPI, stored files in AWS S3 with signed URLs, and saved document metadata in PostgreSQL.",
      "Automated database migrations and integration tests with GitHub Actions to verify document uploads before deployment.",
    ],
    tags: ["React", "FastAPI", "PostgreSQL", "AWS S3", "DocuSign API"],
  },
];

// Month used as "now" for roles without an end date.
export const timelineNow = "2026-10";
