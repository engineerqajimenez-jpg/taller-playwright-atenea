# 🏦 Atenea Bank — Playwright Automation | Automatización con Playwright

## 🇺🇸 English

### Description
End-to-end test automation suite for **Redux Athena Bank**, a full-stack banking application. Built with **Playwright** and **TypeScript**, featuring CI/CD integration with GitHub Actions and automated report publishing via GitHub Pages.

### 🔗 Live Test Report
👉 [View Latest Playwright Report](https://engineerqajimenez-jpg.github.io/taller-playwright-atenea/report-51/)

### ✅ Test Coverage — 16 Test Cases
| File | Test Cases |
|------|-----------|
| `registro.spec.ts` | TC-1 to TC-9 — Registration flow |
| `login.spec.ts` | TC-7, TC-11 — Login flow |
| `transacciones.spec.ts` | TC-12 to TC-14 — Transactions |

### 🛠️ Tech Stack
- **Playwright** + **TypeScript**
- **Page Object Model (POM)**
- **storageState** for multi-user authentication
- **GitHub Actions** CI/CD
- **GitHub Pages** for automated report publishing
- **MongoDB** + **Node.js** backend (auto-started in CI/CD)

### 🚀 Run Locally
```bash
npm install
npx playwright install chromium
npx playwright test --project=setup
npx playwright test --project=chromium
```

### 📊 CI/CD Pipeline
Every push to `main` automatically:
1. Starts MongoDB, Backend and Frontend
2. Runs all 16 tests
3. Publishes HTML report to GitHub Pages

---

## 🇪🇸 Español

### Descripción
Suite de automatización end-to-end para **Redux Athena Bank**, una aplicación bancaria full-stack. Desarrollada con **Playwright** y **TypeScript**, con integración CI/CD en GitHub Actions y publicación automática de reportes en GitHub Pages.

### 🔗 Reporte en Vivo
👉 [Ver Último Reporte de Playwright](https://engineerqajimenez-jpg.github.io/taller-playwright-atenea/report-51/)

### ✅ Cobertura — 16 Casos de Prueba
| Archivo | Casos de Prueba |
|---------|----------------|
| `registro.spec.ts` | TC-1 al TC-9 — Flujo de registro |
| `login.spec.ts` | TC-7, TC-11 — Flujo de login |
| `transacciones.spec.ts` | TC-12 al TC-14 — Transacciones |

### 🛠️ Tecnologías
- **Playwright** + **TypeScript**
- **Page Object Model (POM)**
- **storageState** para autenticación de múltiples usuarios
- **GitHub Actions** CI/CD
- **GitHub Pages** para publicación automática de reportes
- **MongoDB** + **Node.js** backend (levantado automáticamente en CI/CD)

### 🚀 Ejecutar Localmente
```bash
npm install
npx playwright install chromium
npx playwright test --project=setup
npx playwright test --project=chromium
```

### 📊 Pipeline CI/CD
Cada push a `main` automáticamente:
1. Levanta MongoDB, Backend y Frontend
2. Corre los 16 tests
3. Publica el reporte HTML en GitHub Pages

---

**Author / Autor:** Jose Jimenez — [LinkedIn](https://www.linkedin.com/in/jose-jimenez-qa) | [GitHub](https://github.com/engineerqajimenez-jpg)