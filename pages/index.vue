<template>
    <div class="container">
        <h1>{{ title }}</h1>
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
        {rel: 'icon', type: 'image/png', href: '/logoyotsuba.png'},
        {rel: 'stylesheet', href: '/reset.css'}
    ]
});

interface Grade {
  grade_status: {
    midterm: {
      status: number;
      status_label: string;
      submitted: string;
    };
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
let token: string | null = null;
const isLoading = ref(false);
const error = ref<string | null>(null);

async function handleLogin() {
    try{
        const response = await fetch('https://c1-student.vsu.edu.ph/api/sessions',{
            method:'POST',
            headers: {
                'Accept': 'application/json',
                'Accept-Encoding': 'gzip, deflate, br, zstd',
                'Accept-Language': 'en-PH,en-US;q=0.9,en;q=0.8,fil;q=0.7',
                'Cache-Control': 'no-cache',
                'Content-Type': 'application/json',
                'Origin': 'https://my.vsu.edu.ph',
                'Pragma': 'no-cache',
                'Referer': 'https://my.vsu.edu.ph/',
                'Sec-Ch-Ua': '"Google Chrome";v="137", "Chromium";v="137", "Not/A)Brand";v="24"',
                'Sec-Ch-Ua-Mobile': '?0',
                'Sec-Ch-Ua-Platform': '"Windows"',
                'Sec-Fetch-Dest': 'empty',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'same-site',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36'
            },
            body: JSON.stringify({
                username: 'vlanora',
                password: 'nihonjinCD1213'
            })
        });
        const loginData = await response.json();
        token = loginData?.user?.api_auth_token || "";
        return token;
    } catch (error) {
        console.error("Login failed: ",error);
        throw error;
    }
}

async function getStatus(){
    const response = await fetch('https://c1-student.vsu.edu.ph/api/students/grades?sy_year=2024&sy_period=2',{
        method: 'GET',
        headers: {
            'Authorization': `Token token=${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    });
    const data = await response.json();
    return data;
}

async function loadStatus(){
    isLoading.value = true;
    error.value = null;
    try{
        let data = await getStatus();
        if(data?.messages?.includes("You are not logged in.")) {
            await handleLogin();
            data = await getStatus();
        }
        grades.value = data.grades;    } catch (err: unknown){
        error.value = err instanceof Error ? err.message : 'An unexpected error occurred';
        console.error("Error: ", err);
    } finally {
        isLoading.value = false;
    }
}

onMounted(loadStatus);
</script>