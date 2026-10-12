"use strict";

// Publish verified contact details here to enable direct email and WhatsApp links.
const contact = {
  email: "",
  whatsapp: "" // International number, digits only, without the leading +.
};

document.documentElement.classList.add("js-enabled");

const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector("#nav-links");

function closeMenu() {
  navLinks.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");
}

menuToggle.addEventListener("click", () => {
  const open = menuToggle.getAttribute("aria-expanded") !== "true";
  navLinks.classList.toggle("open", open);
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
    closeMenu();
    menuToggle.focus();
  }
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".navigation")) closeMenu();
});

window.matchMedia("(max-width: 540px)").addEventListener("change", closeMenu);
document.querySelector("#current-year").textContent = new Date().getFullYear();

if ("IntersectionObserver" in window) {
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    document.documentElement.classList.add("motion-enabled");
    document.querySelectorAll(".reveal").forEach((section) => revealObserver.observe(section));
  }

  const navigationObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.querySelectorAll("a").forEach((link) => {
        if (link.hash === `#${entry.target.id}`) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    });
  }, { rootMargin: "-15% 0px -55% 0px", threshold: 0 });
  document.querySelectorAll("main section[id]").forEach((section) => navigationObserver.observe(section));
}

const emailConfigured = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email);
const whatsappConfigured = /^[1-9]\d{6,14}$/.test(contact.whatsapp);
const contactForm = document.querySelector("#contact-form");
const contactStatus = document.querySelector("#contact-status");
const messagePreview = document.querySelector("#message-preview");
const messageDraft = document.querySelector("#message-draft");

if (emailConfigured) {
  const emailLink = document.createElement("a");
  emailLink.href = `mailto:${contact.email}`;
  emailLink.textContent = contact.email;
  document.querySelector("#email-detail").replaceChildren(emailLink);
  document.querySelector("#contact-submit").firstChild.textContent = "Open email app ";
}
if (whatsappConfigured) {
  document.querySelector("#whatsapp-detail").textContent = `+${contact.whatsapp}`;
}
if (emailConfigured || whatsappConfigured) {
  document.querySelector(".contact-copy .content-note").textContent =
    "Use the published contact details to get in touch, or prepare a message with the form.";
}

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const fields = new FormData(contactForm);
  const name = fields.get("name").trim();
  const email = fields.get("email").trim();
  const subject = fields.get("subject").trim();
  const message = fields.get("message").trim();

  if (!name || !subject || !message) {
    contactStatus.textContent = "Please include your name, a subject, and a message, not just spaces.";
    return;
  }

  const body = `Hi Avinash,\n\n${message}\n\nFrom: ${name}\nReply to: ${email}`;
  messageDraft.value = `Subject: ${subject}\n\n${body}`;
  messagePreview.hidden = false;
  document.querySelector("#copy-message").textContent = "Copy message";

  if (emailConfigured) {
    contactStatus.textContent = "Opening your email app with this draft. Review it there before sending.";
    window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  } else {
    contactStatus.textContent = "Your message is ready, but has not been sent. Contact details aren’t published yet. Copy the draft to keep it.";
  }
});

document.querySelector("#copy-message").addEventListener("click", async (event) => {
  try {
    await navigator.clipboard.writeText(messageDraft.value);
    event.target.textContent = "Copied!";
    contactStatus.textContent = "Draft copied. No message has been sent by this website.";
  } catch {
    messageDraft.focus();
    messageDraft.select();
    contactStatus.textContent = "Automatic copying isn’t available. Your draft is selected; use your device’s copy command.";
  }
});

const whatsappDialog = document.querySelector("#whatsapp-dialog");
document.querySelector("#whatsapp-button").addEventListener("click", () => {
  if (whatsappConfigured) {
    window.open(`https://wa.me/${contact.whatsapp}?text=${encodeURIComponent("Hi Avinash, I’d like to connect!")}`, "_blank", "noopener,noreferrer");
  } else {
    whatsappDialog.showModal();
  }
});
document.querySelector("#close-whatsapp").addEventListener("click", () => whatsappDialog.close());
document.querySelector("#whatsapp-contact-link").addEventListener("click", () => whatsappDialog.close());
whatsappDialog.addEventListener("click", (event) => {
  const bounds = whatsappDialog.getBoundingClientRect();
  if (event.target === whatsappDialog &&
      (event.clientX < bounds.left || event.clientX > bounds.right ||
       event.clientY < bounds.top || event.clientY > bounds.bottom)) {
    whatsappDialog.close();
  }
});

const transcript = document.querySelector("#chat-transcript");
const questionInput = document.querySelector("#assistant-question");

function profileAnswer(question) {
  const normalized = question.toLowerCase();
  if (/\b(contact|email|whatsapp|reach|touch)\b/.test(normalized)) {
    const details = [];
    if (emailConfigured) details.push(`Email: ${contact.email}.`);
    if (whatsappConfigured) details.push(`WhatsApp: +${contact.whatsapp}.`);
    return details.length
      ? `${details.join(" ")} You can also prepare a message in the contact section.`
      : "Avinash’s email and WhatsApp number haven’t been published yet. The contact section lets you prepare and copy a message, but it won’t send it.";
  }
  if (/\b(database|databases|data|sql|mongodb|redis|snowflake)\b/.test(normalized)) {
    return "Avinash’s database expertise includes MongoDB, SQL Server, Redis, and Snowflake, as part of his work on enterprise-grade applications.";
  }
  if (/\b(experience|career|role|work|background)\b/.test(normalized) &&
      !/\b(technologies|technology|stack|skills)\b/.test(normalized)) {
    return "Avinash M is a Senior Software Engineer with experience designing, developing, and maintaining enterprise-grade applications and scalable cloud-based solutions. Employer details and a career timeline haven’t been published yet.";
  }
  if (/\b(technologies|technology|tech|stack|skills|react|azure|graphql|backend|frontend)\b|\.net|c#/.test(normalized)) {
    return "Avinash works with ASP.NET Core, C#, .NET, React, GraphQL, Azure, MongoDB, Redis, Snowflake, and SQL Server. His focus spans backend development, frontend interfaces, data, and cloud-based solutions.";
  }
  if (/\b(project|projects|portfolio)\b/.test(normalized)) {
    return "The projects section currently shows clearly labeled concepts for an enterprise API platform, a data insights dashboard, and cloud application architecture. Completed project case studies haven’t been published yet.";
  }
  if (/\b(resume|cv|download)\b/.test(normalized)) {
    return "You can download Avinash’s text profile from the resume section. It contains his role, expertise, and engineering focus. A full resume with career history isn’t available yet.";
  }
  if (/\b(certification|certifications|certificate|certified)\b/.test(normalized)) {
    return "Verified certification details haven’t been published yet. The certifications section will be updated when they’re available.";
  }
  if (/\b(hi|hello|hey)\b/.test(normalized)) {
    return "Hello! Ask me about Avinash’s technologies, experience, databases, or how to get in touch.";
  }
  return "I’m a local profile guide, so I can only answer questions about the information on this page. Try asking about Avinash’s technical stack, experience, databases, resume, or contact details.";
}

function appendMessage(text, fromUser) {
  const message = document.createElement("div");
  message.className = `chat-message ${fromUser ? "user-message" : "assistant-message"}`;
  if (!fromUser) {
    const avatar = document.createElement("span");
    avatar.className = "chat-avatar";
    avatar.setAttribute("aria-hidden", "true");
    avatar.textContent = "AM";
    message.append(avatar);
  }
  const content = document.createElement("p");
  content.textContent = text;
  message.append(content);
  transcript.append(message);
  // Keep the local conversation bounded during long sessions.
  while (transcript.children.length > 21) transcript.firstElementChild.remove();
}

function askQuestion(question) {
  const text = question.trim().slice(0, 300);
  if (!text) return;
  appendMessage(text, true);
  appendMessage(profileAnswer(text), false);
  transcript.scrollTop = transcript.scrollHeight;
  questionInput.value = "";
}

document.querySelector("#assistant-form").addEventListener("submit", (event) => {
  event.preventDefault();
  askQuestion(questionInput.value);
});
document.querySelectorAll("[data-question]").forEach((button) => {
  button.addEventListener("click", () => askQuestion(button.dataset.question));
});

document.querySelectorAll("form fieldset").forEach((fieldset) => {
  fieldset.disabled = false;
});
