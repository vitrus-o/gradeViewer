<template>
  <div class="banner-wrapper">
    <div class="banner">
      <img src="/yotsubato-kaeru.gif" alt="Yotsuba Banner" class="banner-img"/>
    </div>
  </div>
  <div class="container">
    <div class="header">
      <button @click="refreshGrades" :disabled="isLoading" class="refresh-btn">
        Refresh Grades
      </button>
      <button
        v-if="hasUserCredentials"
        @click="revertToDefault"
        :disabled="isLoading"
        class="refresh-btn"
        style="background-color: #888; margin-left: 1rem"
      >
        Revert to default (no credentials)
      </button>
    </div>

    <div v-if="isLoading" class="loading">Loading grades...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div class="table-container" v-else-if="grades.length">
      <table>
      <thead>
        <tr>
          <th class="subject-code">Subject Code</th>
          <th class="description">Subject Description</th>
          <th class="status">Status</th>
          <th class="status-label">Status Label</th>
          <th class="submitted">Submitted</th>
          <th v-if="hasUserCredentials" class="midterm">Midterm</th>
          <th v-if="hasUserCredentials" class="final">Final</th>
          <th v-if="hasUserCredentials" class="completion">Completion</th>
          <th v-if="hasUserCredentials" class="remark">Remark</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="grade in grades" :key="grade.offer.subject.subject_no">
          <td class="subject-code">{{ grade.offer.subject.subject_no }}</td>
          <td class="description">{{ grade.offer.subject.description }}</td>
          <td class="status">{{ grade.grade_status.final.status }}</td>
          <td class="status-label">
            {{ grade.grade_status.final.status_label }}
          </td>
          <td class="submitted">
            {{ grade.grade_status.final.submitted || "Not yet submitted" }}
          </td>
          <td v-if="hasUserCredentials" class="midterm">
            {{ grade.grade?.midterm ?? "-" }}
          </td>
          <td v-if="hasUserCredentials" class="final">
            {{ grade.grade?.final ?? "-" }}
          </td>
          <td v-if="hasUserCredentials" class="completion">
            {{ grade.grade?.completion ?? "-" }}
          </td>
          <td v-if="hasUserCredentials" class="remark">
            {{ grade.grade?.remark ?? "-" }}
          </td>
        </tr>
      </tbody>
      </table>
    </div>
    <div class="footer">
      <p>
        <NuxtLink v-if="hasCredentials" to="/login" class="link">
          Account
        </NuxtLink>
        <NuxtLink v-if="hasCredentials" to="/privacy" class="link">
          Privacy Policy
        </NuxtLink>
      </p>
      <div class="footer-extra">
        <img src="/sewerYotsuba.png" alt="Sewer Yotsuba" class="yotsuba-img" />
        <p class="credits">credits: vitrus</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSeoMeta, useHead } from "@vueuse/head";
import { ref, onMounted } from "vue";
import type { Grade } from "~/types";

const title = "Yotsuba Grade Viewer";
const description =
  "I'm lazy, so I made a grade viewer in honor of Yotsuba. It shows the status of the subjects.";

useSeoMeta({
  title: () => title,
  description: () => description,
  charset: "utf-8",
  viewport: "width=device-width, initial-scale=1.0",
});

useHead({
  link: [
    { rel: "icon", type: "image/png", href: "/logoyotsubato.png" },
    { rel: "stylesheet", href: "/reset.css" },
  ],
});

const grades = ref<Grade[]>([]);
const isLoading = ref(false);
const error = ref<string | null>(null);
const hasCredentials = ref(false);
const hasUserCredentials = ref(false);

async function getStatus(
  force = false,
  userCredentials?: { username: string; password: string }
) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  if (userCredentials) {
    headers["X-VSU-Username"] = userCredentials.username;
    headers["X-VSU-Password"] = userCredentials.password;
  }

  const response = await fetch(`/api/grades${force ? "?force=true" : ""}`, {
    method: "GET",
    headers: headers,
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "An error occurred while fetching grades.");
  }
  return data;
}

function revertToDefault() {
  localStorage.removeItem("vsu_credentials");
  hasCredentials.value = false;
  hasUserCredentials.value = false;
  loadStatus();
}

async function loadStatus() {
  isLoading.value = true;
  error.value = null;

  try {
    const storedCredentials = localStorage.getItem("vsu_credentials");
    if (storedCredentials) {
      try {
        const { username, password } = JSON.parse(storedCredentials);
        hasCredentials.value = true;
        const data = await getStatus(false, { username, password });
        grades.value = data.grades;
        hasUserCredentials.value = !!data.hasUserCredentials;
        return;
      } catch (e) {
        console.error(
          "Failed to parse stored credentials, falling back to default"
        );
      }
    }

    const data = await getStatus();
    grades.value = data.grades;
    hasCredentials.value = false;
    hasUserCredentials.value = !!data.hasUserCredentials;
  } catch (err: unknown) {
    error.value =
      err instanceof Error ? err.message : "An unexpected error occurred";
    console.error("Error: ", err);
  } finally {
    isLoading.value = false;
  }
}

async function refreshGrades() {
  isLoading.value = true;
  error.value = null;
  try {
    const storedCredentials = localStorage.getItem("vsu_credentials");
    if (storedCredentials) {
      try {
        const { username, password } = JSON.parse(storedCredentials);
        const data = await getStatus(true, { username, password });
        grades.value = data.grades;
        hasUserCredentials.value = !!data.hasUserCredentials;
        return;
      } catch (e) {
        console.error("Failed to parse stored credentials");
      }
    }

    const data = await getStatus(true);
    grades.value = data.grades;
    hasUserCredentials.value = !!data.hasUserCredentials;
  } catch (err: unknown) {
    error.value =
      err instanceof Error ? err.message : "An unexpected error occurred";
    console.error("Error: ", err);
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  isLoading.value = true;
  loadStatus();
});
</script>

<style scoped>
.banner-wrapper {
  width: 100%;
  background: #fff;
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
}
.footer {
  margin-top: 2rem;
  text-align: center;
  padding: 1rem 0 0.5rem 0;
}
.footer-extra {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 1.2rem;
}
.yotsuba-img {
  max-width: 220px;
  width: 100%;
  height: auto;
  display: block;
  margin: 0 auto 0.5rem auto;
  border-radius: 10px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
}
.credits {
  text-align: center;
  font-size: 0.92rem;
  color: #888;
  margin-bottom: 0;
}

.container {
  padding: 1.5rem 1rem 2rem 1rem;
  max-width: 100%;
  margin: 0 auto;
  background: #fff;
  border-radius: 12px;
}

h1 {
  text-align: center;
}

.table-container {
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
  table-layout: auto;
  min-width: 600px;
}

th,
td {
  border: 1px solid #ddd;
  padding: 0.5rem;
  text-align: left;
  white-space: normal;
  vertical-align: middle;
  word-wrap: break-word;
}

th {
  background-color: #f5f5f5;
  font-weight: bold;
  position: sticky;
  top: 0;
  z-index: 1;
}

tr:nth-child(even) {
  background-color: #f9f9f9;
}

.subject-code {
  min-width: 90px;
}

.description {
  min-width: 200px;
  max-width: 300px;
}

.status {
  min-width: 70px;
}

.status-label {
  min-width: 120px;
}

.submitted {
  min-width: 100px;
}

.midterm,
.final,
.completion {
  min-width: 70px;
}

.remark {
  min-width: 80px;
}

.error {
  color: red;
  padding: 1rem;
  margin: 1rem 0;
  border: 1px solid red;
}

.loading {
  padding: 1rem;
  text-align: center;
}

.header {
  display: flex;
  justify-content: left;
  align-items: center;
  margin-bottom: 1rem;
}

.refresh-btn {
  padding: 0.5rem 1rem;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.refresh-btn:hover {
  background-color: #45a049;
}

.refresh-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.footer {
  margin-top: 2rem;
  text-align: center;
  padding: 1rem 0 0.5rem 0;
}

.link {
  color: #666666;
  text-decoration: none;
  margin: 0 1rem;
  font-weight: 600;
}

.link:hover {
  text-decoration: underline;
}

@media screen and (min-width: 768px) {
  .description {
    max-width: 400px;
  }
}

@media screen and (max-width: 767px) {
  th,
  td {
    padding: 0.35rem 0.4rem;
    font-size: 0.9rem;
  }
}

@media screen and (max-width: 480px) {
  th,
  td {
    padding: 0.25rem 0.3rem;
    font-size: 0.85rem;
  }
}
</style>
