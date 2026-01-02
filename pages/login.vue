<template>
  <div class="login-bg-minimal">
    <div class="login-minimal-card">
      <img src="/yotsubato-kaeru.gif" alt="Yotsuba Banner" class="login-banner-img" />
      <p class="subtitle">Enter your VSU portal credentials to view your grades</p>
      <div class="info-banner-minimal">
        <strong>Privacy Notice:</strong> Your credentials are stored only in your browser's local storage and are never sent to our servers or any third party. See our <NuxtLink to="/privacy">privacy policy</NuxtLink> for more details.
      </div>
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="username">Username</label>
          <input
            id="username"
            v-model="username"
            type="text"
            placeholder="Your VSU username"
            required
            :disabled="isLoading"
          />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="Your VSU password"
            required
            :disabled="isLoading"
          />
        </div>
        <div class="checkbox-group">
          <input
            id="remember"
            v-model="rememberMe"
            type="checkbox"
            :disabled="isLoading"
          />
          <label for="remember">Remember me on this device</label>
        </div>
        <button type="submit" :disabled="isLoading" class="login-btn-minimal">
          {{ isLoading ? "Logging in..." : "Login" }}
        </button>
      </form>
      <div v-if="error" class="error">{{ error }}</div>
      <div v-if="success" class="success">{{ success }}</div>
      <div class="footer-links">
        <p>
          Have credentials stored? <button @click="logout" class="link-btn">Clear stored credentials</button>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useSeoMeta, useHead } from "@vueuse/head";
import { useRouter } from "vue-router";

const title = "Yotsuba Grade Viewer - Login";
const description =
  "Login with your VSU portal credentials to view your grades. Your credentials are stored only locally in your browser.";

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

const router = useRouter();
const username = ref("");
const password = ref("");
const rememberMe = ref(true);
const isLoading = ref(false);
const error = ref<string | null>(null);
const success = ref<string | null>(null);

onMounted(() => {
  const stored = localStorage.getItem("vsu_credentials");
  if (stored) {
    try {
      const { username: storedUsername } = JSON.parse(stored);
      username.value = storedUsername;
    } catch (e) {
      console.error("Failed to parse stored credentials");
    }
  }
});

async function handleLogin() {
  error.value = null;
  success.value = null;
  isLoading.value = true;

  try {
    const response = await fetch("/api/grades", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-VSU-Username": username.value,
        "X-VSU-Password": password.value,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    if (rememberMe.value) {
      localStorage.setItem(
        "vsu_credentials",
        JSON.stringify({
          username: username.value,
          password: password.value,
        })
      );
    }

    success.value = "Login successful! Redirecting...";
    setTimeout(() => {
      router.push("/");
    }, 1000);
  } catch (err: unknown) {
    error.value =
      err instanceof Error
        ? err.message
        : "An error occurred during login. Please check your credentials.";
    console.error("Login error:", err);
  } finally {
    isLoading.value = false;
  }
}

function logout() {
  localStorage.removeItem("vsu_credentials");
  username.value = "";
  password.value = "";
  success.value = "Credentials cleared";
}
</script>

<style scoped>

.login-bg-minimal {
  min-height: 100vh;
  width: 100vw;
  background: #fafbfa;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 0;
  font-family: 'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
}
.login-minimal-card {
  background: #fff;
  padding: 2.2rem 1.5rem 1.5rem 1.5rem;
  border-radius: 14px;
  box-shadow: 0 2px 16px rgba(60,60,60,0.07);
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid #ececec;
}
.login-banner-img {
  max-width: 140px;
  width: 100%;
  margin-bottom: 1.2rem;
  border-radius: 10px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
}
.info-banner-minimal {
  background-color: #f6f6f6;
  border-left: 3px solid #bdbdbd;
  padding: 0.85rem 1rem;
  margin-bottom: 1.2rem;
  border-radius: 5px;
  font-size: 0.97rem;
  color: #444;
  font-family: inherit;
}
.info-banner-minimal a {
  color: #444;
  text-decoration: underline;
  font-weight: 500;
}
.form-group {
  margin-bottom: 1.2rem;
  width: 100%;
}
label {
  display: block;
  margin-bottom: 0.4rem;
  color: #222;
  font-weight: 600;
  font-size: 1.01rem;
  letter-spacing: 0.01em;
  font-family: inherit;
}
input[type="text"],
input[type="password"] {
  width: 100%;
  padding: 0.8rem 0.9rem;
  border: 1px solid #d3d3d3;
  border-radius: 6px;
  font-size: 1.04rem;
  box-sizing: border-box;
  background: #fcfcfc;
  transition: border-color 0.2s, box-shadow 0.2s;
  margin-bottom: 0.1rem;
  font-family: inherit;
}
input[type="text"]:focus,
input[type="password"]:focus {
  outline: none;
  border-color: #888;
  box-shadow: 0 0 0 1.5px #e0e0e0;
}
input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}
.checkbox-group {
  display: flex;
  align-items: center;
  margin-bottom: 1.2rem;
  gap: 0.5rem;
  width: 100%;
}
input[type="checkbox"] {
  cursor: pointer;
}
.checkbox-group label {
  margin: 0;
  cursor: pointer;
  font-weight: 500;
  color: #444;
  font-size: 0.98rem;
  font-family: inherit;
}
.login-btn-minimal {
  width: 100%;
  padding: 0.85rem;
  background: #222;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 1.08rem;
  font-weight: 700;
  cursor: pointer;
  margin-top: 0.4rem;
  margin-bottom: 0.4rem;
  box-shadow: 0 1px 4px rgba(60,60,60,0.07);
  transition: background 0.2s, box-shadow 0.2s, transform 0.2s;
  font-family: inherit;
}
.login-btn-minimal:hover:not(:disabled) {
  background: #444;
  transform: translateY(-1px) scale(1.01);
  box-shadow: 0 3px 10px rgba(60,60,60,0.13);
}
.login-btn-minimal:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.error {
  color: #d32f2f;
  background-color: #ffebee;
  padding: 0.7rem;
  margin-top: 0.8rem;
  border: 1px solid #d32f2f;
  border-radius: 4px;
  font-size: 0.93rem;
  font-family: inherit;
}
.success {
  color: #388e3c;
  background-color: #e8f5e9;
  padding: 0.7rem;
  margin-top: 0.8rem;
  border: 1px solid #388e3c;
  border-radius: 4px;
  font-size: 0.93rem;
  font-family: inherit;
}
.footer-links {
  text-align: center;
  margin-top: 1.2rem;
  font-size: 0.95rem;
  color: #888;
  font-family: inherit;
}
.link-btn {
  background: none;
  border: none;
  color: #222;
  cursor: pointer;
  text-decoration: underline;
  font-weight: 600;
  padding: 0;
  font-size: 0.95rem;
  font-family: inherit;
}
.link-btn:hover {
  color: #444;
}
@media screen and (max-width: 480px) {
  .login-minimal-card {
    padding: 1rem 0.3rem 1rem 0.3rem;
  }
  h1 {
    font-size: 1.15rem;
  }
  .info-banner-minimal {
    font-size: 0.85rem;
    padding: 0.7rem;
  }
}
.error {
  color: #d32f2f;
  background-color: #ffebee;
  padding: 0.75rem;
  margin-top: 1rem;
  border: 1px solid #d32f2f;
  border-radius: 4px;
  font-size: 0.9rem;
}
.success {
  color: #388e3c;
  background-color: #e8ffe8;
  padding: 0.75rem;
  margin-top: 1rem;
  border: 1px solid #388e3c;
  border-radius: 4px;
  font-size: 0.9rem;
}
.footer-links {
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.95rem;
  color: #666;
}
.link-btn {
  background: none;
  border: none;
  color: #388e3c;
  cursor: pointer;
  text-decoration: underline;
  font-weight: 600;
  padding: 0;
  font-size: 0.9rem;
}
.link-btn:hover {
  color: #7ed957;
}
@media screen and (max-width: 480px) {
  .login-green-card {
    padding: 1.2rem 0.5rem 1.2rem 0.5rem;
  }
  h1 {
    font-size: 1.3rem;
  }
  .info-banner-green {
    font-size: 0.85rem;
    padding: 0.75rem;
  }
}

h1 {
  text-align: center;
  margin-bottom: 0.5rem;
  color: #333;
}

.subtitle {
  text-align: center;
  color: #666;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
}

.info-banner {
  background-color: #e3f2fd;
  border-left: 4px solid #2196f3;
  padding: 1rem;
  margin-bottom: 1.5rem;
  border-radius: 4px;
  font-size: 0.9rem;
  color: #1565c0;
}

.info-banner a {
  color: #1565c0;
  text-decoration: underline;
  font-weight: bold;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 500;
}

input[type="text"],
input[type="password"] {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  box-sizing: border-box;
  transition: border-color 0.3s;
}

input[type="text"]:focus,
input[type="password"]:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.checkbox-group {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  gap: 0.5rem;
}

input[type="checkbox"] {
  cursor: pointer;
}

.checkbox-group label {
  margin: 0;
  cursor: pointer;
  font-weight: normal;
}

.login-btn {
  width: 100%;
  padding: 0.75rem;
  background: linear-gradient(135deg, #232427 0%, #1e1c20 100%);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.login-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.login-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error {
  color: #d32f2f;
  background-color: #ffebee;
  padding: 0.75rem;
  margin-top: 1rem;
  border: 1px solid #d32f2f;
  border-radius: 4px;
  font-size: 0.9rem;
}

.success {
  color: #388e3c;
  background-color: #e8f5e9;
  padding: 0.75rem;
  margin-top: 1rem;
  border: 1px solid #388e3c;
  border-radius: 4px;
  font-size: 0.9rem;
}

.footer-links {
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.9rem;
  color: #666;
}

.link-btn {
  background: none;
  border: none;
  cursor: pointer;
  text-decoration: underline;
  font-weight: 600;
  padding: 0;
  font-size: 0.9rem;
}

.link-btn:hover {
  color: #764ba2;
}

@media screen and (max-width: 480px) {
  .login-box {
    padding: 1.5rem;
  }

  h1 {
    font-size: 1.5rem;
  }

  .info-banner {
    font-size: 0.85rem;
    padding: 0.75rem;
  }
}
</style>
