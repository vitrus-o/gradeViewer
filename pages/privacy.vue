<template>
  <div class="privacy-bg-minimal">
    <div class="privacy-minimal-card">
      <div class="content">
      <div class="header">
        <NuxtLink to="/" class="back-link">← Back to Grades</NuxtLink>
      </div>

      <section>
        <h2>Privacy Policy</h2>
        
        <h3>1. Introduction</h3>
        <p>
          Yotsuba Grade Viewer ("we", "us", "our", or "the Application") is committed to protecting your privacy. This Privacy Policy explains how we handle your information when you use our application.
        </p>

        <h3>2. Credentials Storage & Security</h3>
        <p>
          <strong>Your login credentials are NOT stored on our servers.</strong>
        </p>
        <p>
          When you log in to Yotsuba Grade Viewer:
        </p>
        <ul>
          <li>Your username and password are stored <strong>only in your browser's local storage</strong></li>
          <li>Your credentials are never transmitted to our servers or any third-party services</li>
          <li>Your credentials are only used to authenticate directly with the VSU Cumulus portal</li>
          <li>You can clear your stored credentials at any time by clicking the "Clear stored credentials" button on the login page</li>
        </ul>

        <h3>3. Data Collection & Processing</h3>
        <p>
          <strong>We do not collect, store, or gather any of your personal data.</strong>
        </p>
        <ul>
          <li>We do not store your username or password</li>
          <li>We do not store your grade information</li>
          <li>We do not store any personal or academic data</li>
          <li>We do not use cookies for tracking or analytics</li>
          <li>We do not share any information with third parties</li>
        </ul>

        <h3>4. VSU Portal Communication</h3>
        <p>
          This application communicates directly with the Cumulus student portal. Your credentials are used solely to authenticate your session with the official Cumulus systems. VSU Cumulus' own privacy policies and terms of service apply to your interactions with their platform.
        </p>

        <h3>5. Local Storage Security</h3>
        <p>
          Since credentials are stored in your browser's local storage:
        </p>
        <ul>
          <li><strong>Risk:</strong> Local storage is accessible to any JavaScript code on your device or connected devices</li>
          <li><strong>Recommendation:</strong> Only use this application on trusted, secure devices</li>
          <li><strong>Public Computers:</strong> Do NOT save your credentials on public or shared computers</li>
          <li><strong>Device Security:</strong> Ensure your device is protected with a strong password or biometric security</li>
        </ul>

        <h3>6. Browser Privacy</h3>
        <p>
          Your stored credentials will persist in your browser until:
        </p>
        <ul>
          <li>You manually clear them by clicking "Clear stored credentials"</li>
          <li>You clear your browser's local storage manually</li>
          <li>You clear your browser cache and site data</li>
          <li>You uninstall your browser (depending on your browser settings)</li>
        </ul>

        <h3>7. Changes to This Policy</h3>
        <p>
          We may update this Privacy Policy occasionally. Any changes will be posted on this page with an updated date.
        </p>

        <h3>8. Disclaimer</h3>
        <p>
          This application is provided "as is" without warranties. The developer is not responsible for unauthorized access to your credentials or any damages resulting from their misuse. Always keep your device secure and monitor your account for suspicious activity.
        </p>
      </section>

      <section>
        <h2>Terms of Service</h2>

        <h3>1. Acceptable Use</h3>
        <p>
          You agree to use Yotsuba Grade Viewer only for viewing your own grade information. Any unauthorized access or misuse is strictly prohibited.
        </p>

        <h3>2. Account Responsibility</h3>
        <p>
          You are responsible for maintaining the confidentiality of your VSU Cumulus portal credentials. You agree not to share your login information with others.
        </p>

        <h3>3. No Warranty</h3>
        <p>
          This application is provided on an "as is" basis without any warranties or guarantees. We do not guarantee the accuracy, availability, or continued operation of this service.
        </p>

        <h3>4. Limitation of Liability</h3>
        <p>
          The developer shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of this application.
        </p>

        <h3>5. Third-Party Services</h3>
        <p>
          This application relies on the VSU Cumulus portal API. We are not responsible for any issues, downtime, or changes made by VSU to their services.
        </p>

        <h3>6. User Consent</h3>
        <p>
          By using Yotsuba Grade Viewer, you acknowledge that:
        </p>
        <ul>
          <li>You have read and understood this Privacy Policy and Terms of Service</li>
          <li>You accept the risks associated with storing credentials in browser local storage</li>
          <li>You take full responsibility for the security of your stored credentials</li>
          <li>You agree to use this application only with your own credentials</li>
        </ul>
      </section>

      <div class="footer-section">
        <p>
          <strong>Last Updated:</strong> January 2, 2026
        </p>
        <p>
          By using Yotsuba Grade Viewer, you agree to this Privacy Policy.
        </p>
      </div>
    </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSeoMeta, useHead } from "@vueuse/head";

useSeoMeta({
  title: () => "Privacy Policy - Yotsuba Grade Viewer",
  description: () =>
    "Read our privacy policy. Learn how your credentials are stored locally and how we protect your privacy.",
  charset: "utf-8",
  viewport: "width=device-width, initial-scale=1.0",
});

useHead({
  link: [
    { rel: "icon", type: "image/png", href: "/logoyotsubato.png" },
    { rel: "stylesheet", href: "/reset.css" },
  ],
});
</script>

<style scoped>
.privacy-bg-minimal {
  min-height: 100vh;
  width: 100vw;
  background: #fafbfa;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 0;
  font-family: 'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
}
.privacy-minimal-card {
  max-width: 900px;
  margin: 0 auto;
  padding: 2.2rem 1.5rem 1.5rem 1.5rem;
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 2px 16px rgba(60,60,60,0.07);
  border: 1px solid #ececec;
  font-family: inherit;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

h1 {
  margin: 0;
  color: #333;
  flex: 1;
  min-width: 250px;
}

.back-link {
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s;
}

.back-link:hover {
  color: #764ba2;
  text-decoration: underline;
}

section {
  margin-bottom: 3rem;
  line-height: 1.8;
}

h2 {
  color: #222;
  border-bottom: 2px solid #ececec;
  padding-bottom: 0.5rem;
  margin-top: 2rem;
  margin-bottom: 1rem;
  font-family: inherit;
  font-size: 1.25rem;
  font-weight: 700;
}

h3 {
  color: #444;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
  font-family: inherit;
  font-size: 1.08rem;
  font-weight: 600;
}

p {
  color: #444;
  margin-bottom: 1rem;
  font-family: inherit;
  font-size: 1.01rem;
  line-height: 1.7;
}

ul {
  color: #444;
  margin-left: 2rem;
  margin-bottom: 1rem;
  font-family: inherit;
  font-size: 1.01rem;
}

li {
  margin-bottom: 0.5rem;
  list-style-type: disc;
  font-family: inherit;
}

strong {
  color: #222;
  font-weight: 700;
  font-family: inherit;
}

.footer-section {
  background-color: #f6f6f6;
  padding: 1.2rem;
  border-radius: 7px;
  margin-top: 2rem;
  text-align: center;
  color: #444;
  font-family: inherit;
  font-size: 1.01rem;
}

.footer-section p {
  margin-bottom: 0.5rem;
}

@media screen and (max-width: 600px) {
  .privacy-minimal-card {
    padding: 1rem 0.3rem 1rem 0.3rem;
  }
  .header {
    flex-direction: column;
    align-items: flex-start;
  }
  h1 {
    font-size: 1.15rem;
  }
  h2 {
    font-size: 1.08rem;
  }
  h3 {
    font-size: 0.98rem;
  }
  ul {
    margin-left: 1.5rem;
  }
}
</style>
