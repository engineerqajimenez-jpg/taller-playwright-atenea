import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import TestData from '../data/testData.json';
import { DashboardPage } from '../pages/dashboardPage';

let loginPage: LoginPage;  
let dashboardPage: DashboardPage;

test.beforeEach(async ({ page }) => {
  loginPage = new LoginPage(page);
  dashboardPage = new DashboardPage(page);
  await loginPage.visitarPaginaLogin();

});

test('TC-7 Verificar login exitoso', async ({ page }) => {
 await loginPage.completarYHacerClickBotonLogin({email: 'jose@email.com', password: '123456'});
 await expect (page.getByText('Login exitoso')).toBeVisible();
 await expect (dashboardPage.dashboardTitle).toBeVisible();
});