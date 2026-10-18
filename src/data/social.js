import resumeUrl from "../assets/resume/Nirav_Kanthed_Resume.pdf?url";

// Contact details and links used by the hero, contact section and footer.
export const social = {
  name: "Nirav Kanthed",
  email: "niravkanthed2@gmail.com",
  github: "https://github.com/nkanthed06",
  linkedin: "https://www.linkedin.com/in/nkanthed5/",
  locations: ["San Diego, CA", "San Francisco, CA", "Seattle, WA"],
};

// The email button opens a Gmail draft addressed to the email above.
export const gmailComposeUrl = (email) =>
  `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}`;

// Downloadable resume (the "Download Resume" button).
export const resume = {
  url: resumeUrl,
  filename: "Nirav_Kanthed_Resume.pdf",
};
