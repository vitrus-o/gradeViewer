<template>
    <div class="container">
        <div class="header">
            <h1>{{ title }}</h1>
            <button @click="refreshGrades" :disabled="isLoading" class="refresh-btn">
                Refresh Grades
            </button>
        </div>
        <div v-if="error" class="error">{{ error }}</div>
        <div v-else-if="isLoading" class="loading"> Loading grades...</div>
        <table v-else-if="grades.length">
                <tr>
                    <th class="subject-code">Subject Code</th>
                    <th class="description">Subject Description</th>
                    <th class="status">Status</th>
                    <th class="status-label">Status Label</th>
                    <th class="submitted">Submitted</th>
                </tr>
            <tbody>
                <tr v-for="grade in grades" :key="grade.offer.subject.subject_no">
                    <td class="subject-code">{{ grade.offer.subject.subject_no }}</td>
                    <td class="description">{{ grade.offer.subject.description }}</td>
                    <td class="status">{{ grade.grade_status.final.status }}</td>
                    <td class="status-label">{{ grade.grade_status.final.status_label }}</td>
                    <td class="submitted">{{ grade.grade_status.final.submitted || 'Not yet submitted' }}</td>
                </tr>
            </tbody>
        </table>
        <div class="footer">
            <img src="/sewerYotsuba.png" alt="Sewer Yotsuba" class="yotsuba-img">
            <p class="credits">credits: vitrus</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useSeoMeta, useHead } from '@vueuse/head';
import { ref, onMounted } from 'vue';

const title = "Yotsuba Grade Viewer";
const description = "I'm lazy, so I made a grade viewer in honor of Yotsuba. It shows the status of the subjects.";

useSeoMeta({
    title: () => title,
    description: () => description,
    charset: "utf-8",
    viewport: "width=device-width, initial-scale=1.0"
});

useHead({
    link: [
        {rel: 'icon', type: 'image/png', href: '/logoyotsubato.png'},
        {rel: 'stylesheet', href: '/reset.css'}
    ]
});

interface Grade {
  grade_status: {
    final: {
      status: number;
      status_label: string;
      submitted: string;
    };
  };
  offer: {
    subject: {
      subject_no: string;
      description: string;
    };
  };
}

const grades = ref<Grade[]>([]);
const isLoading = ref(false);
const error = ref<string | null>(null);

async function handleLogin() {
    try {
        const response = await fetch('/api/auth');
        const data = await response.json();
        if (!data.success) {
            throw new Error('Login failed');
        }
        return true;
    } catch (error) {
        console.error("Login failed: ", error);
        throw error;
    }
}

async function getStatus(force = false) {
    const response = await fetch(`/api/grades${force ? '?force=true' : ''}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    });
    const data = await response.json();
    return data;
}

async function logout() {
    grades.value = [];
    error.value = null;
}

async function loadStatus() {
    isLoading.value = true;
    error.value = null;
    try {
        await handleLogin();
        const data = await getStatus();
        grades.value = data.grades;
    } catch (err: unknown) {
        error.value = err instanceof Error ? err.message : 'An unexpected error occurred';
        console.error("Error: ", err);
    } finally {
        isLoading.value = false;
    }
}

async function refreshGrades() {
    isLoading.value = true;
    error.value = null;
    try {
        const data = await getStatus(true);
        grades.value = data.grades;
    } catch (err: unknown) {
        error.value = err instanceof Error ? err.message : 'An unexpected error occurred';
        console.error("Error: ", err);
    } finally {
        isLoading.value = false;
    }
}

onMounted(() => {
    loadStatus();
});
</script>

<style scoped>
.container{
    padding: 1rem;
    max-width: 100%;
    margin: 0 auto;
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
    table-layout: fixed;
}

th, td {
    border: 1px solid #ddd;
    padding: 0.5rem;
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    vertical-align: top;
    min-width: 80px;
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
    width: 100px;
}

.description {
    width: auto;
}

.status {
    width: 80px;
}

.status-label {
    width: 150px;
}

.submitted {
    width: 120px;
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
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}

.refresh-btn {
    padding: 0.5rem 1rem;
    background-color: #4CAF50;
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

@media screen and (min-width: 768px){
    .subject-code{
        width: 12%;
    }
    .description{
        width: 45%;
    }
    .status{
        width: 8%;
    }
    .status-label{
        width: 20%;
    }
    .submitted{
        width: 15%;
    }
}

@media screen and (max-width: 767px){
    .subject-code{
        width: 15%;
    }
    .description{
        width: 40%;
    }
    .status{
        width: 10%;
    }
    .status-label{
        width: 20%;
    }
    .submitted{
        width: 15%;
    }
}

@media screen and (max-width: 480px){
    th, td {
        padding: 0.25rem;
        font-size: 0.875rem;
    }
}

.footer {
    margin-top: 2rem;
    text-align: center;
}

.yotsuba-img {
    max-width: 300px;
    height: auto;
    margin: 1rem auto;
    display: block;
}

.credits {
    font-size: 0.9rem;
    color: #666;
    margin-top: 0.5rem;
}
</style>