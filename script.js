"use strict";

async function loadSkills() {
  const skills = await window.apiService.fetchSkills();
  return skills;
}

function createSkillCard(skill) {
  const card = document.createElement("article");
  card.className = "skill-card";

  const title = document.createElement("h3");
  title.textContent = skill.title;

  const description = document.createElement("p");
  description.textContent = skill.description;

  const meta = document.createElement("p");
  meta.className = "skill-meta";
  const price = Number(skill.price) === 0 ? "Free" : `$${skill.price}`;
  meta.textContent = `${skill.category} · ${price} · ${skill.provider}`;

  card.append(title, description, meta);
  return card;
}

function showMessage(container, heading, text) {
  const message = document.createElement("div");
  message.className = "offering-placeholder";

  const title = document.createElement("h3");
  title.textContent = heading;

  const body = document.createElement("p");
  body.textContent = text;

  message.append(title, body);
  container.replaceChildren(message);
}

function renderSkills(skills) {
  const container = document.getElementById("skills-list");

  if (!skills.length) {
    showMessage(container, "No skills yet", "Check back to find a skill to learn or share one of your own.");
    return;
  }

  container.replaceChildren(...skills.map(createSkillCard));
}

async function initSkills() {
  const container = document.getElementById("skills-list");
  try {
    const skills = await loadSkills();
    renderSkills(skills);
  } catch (error) {
    showMessage(container, "Unable to load skills", "Make sure the Skill Swap server is running, then refresh the page.");
  }
}

async function handleSkillSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const status = document.getElementById("form-status");
  const submitButton = form.querySelector("button[type='submit']");
  const formData = new FormData(form);

  const skillData = {
    title: formData.get("title").trim(),
    category: formData.get("category").trim(),
    price: Number(formData.get("price")),
    description: formData.get("description").trim(),
  };

  submitButton.disabled = true;
  status.textContent = "Saving...";

  try {
    await window.apiService.createSkill(skillData);
    form.reset();
    status.textContent = "Skill added!";
    await initSkills();
  } catch (error) {
    status.textContent = "Could not add the skill. Please try again.";
  } finally {
    submitButton.disabled = false;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("skill-form").addEventListener("submit", handleSkillSubmit);
  initSkills();
});
