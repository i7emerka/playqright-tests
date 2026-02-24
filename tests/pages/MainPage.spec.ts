import { test, expect, Page, Locator } from '@playwright/test';
import { MainPage } from '../models/MainPage';

let mainPage: MainPage;

test.describe('Тесты главной страницы', () => {
  test.beforeEach(async ({ page }) => {
    mainPage = new MainPage(page);
    await mainPage.openMainPage();
  });
  test('Проверка отображения элементов навигации хедера', async () => {
    await mainPage.checkElementsVisability();
  });
  test('Проверка назване элементов навигации хедеров', async () => {
    await mainPage.checkElementsText();
  });

  test('Проверка атрибута href элемента', async () => {
    await mainPage.checkElementsHrefAttribute();
  });

  test('Визуальная проверка всех тем', async () => {
    const themes = ['light', 'dark', 'system'] as const;
    for (const theme of themes) {
      await mainPage.switchThemeTo(theme); // 1. Переключаем тему (теперь система будет светлой)
      await mainPage.checkVisualMode(theme); // 2. Делаем скриншот и сравниваем
    }
  });
});
/*
  test.describe('Тестирование тем оформления (Light, Dark, System)', () => {
    // 1. Тест функциональности переключателя
    test('Проверка циклического переключения тем кнопкой', async ({ page }) => {
      await page.goto('https://playwright.dev/');

      const mainPage = new MainPage(page);
      await mainPage.openMainPage();
      await mainPage.checkElementsHrefAttribute();
      await mainPage.clickSwitchLigtModeIcon();
    });

    // 2. Визуальная проверка всех состояний (Screenshot testing)
    const modes = ['light', 'dark', 'system'];

    for (const mode of modes) {
      test(`Визуальный регресс для мода: ${mode}`, async ({ page }) => {
        await page.goto('https://playwright.dev/');

        const themeButton = page.getByRole('button', { name: 'Switch between dark and light' });
        const html = page.locator('html');

        // Если тестируем системную тему, эмулируем настройки ОС (например, темные)
        if (mode === 'system') {
          await page.emulateMedia({ colorScheme: 'light' });
        }

        // Нажимаем на кнопку до тех пор, пока атрибут не совпадет с нужным модом
        // Это гарантирует, что и КНОПКА изменит свой вид на скриншоте
        let attempts = 0;
        while ((await html.getAttribute('data-theme-choice')) !== mode && attempts < 3) {
          await themeButton.click();
          attempts++;
        }
        // Ждем завершения анимаций перехода темы
        await page.waitForTimeout(500);

        // Делаем скриншот всей страницы
        await expect(page).toHaveScreenshot(`pageWiths${mode}mode.png`, {
          animations: 'disabled', // Игнорируем мигание курсора и CSS-переходы
          fullPage: true,
          threshold: 0.2, // Допуск на небольшие различия в рендеринге шрифтов
        });
      });
    }
  });
});
*/

/*
  test('Проверка переключения light mods', async ({ page }) => {
    await page.getByRole('button', { name: 'Switch between dark and light' }).click();
    await expect.soft(page.locator('html')).toHaveAttribute('data-theme', 'light');
    await page.getByRole('button', { name: 'Switch between dark and light' }).click();
    await expect.soft(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  });
  ['system', 'light', 'dark'].forEach((value) => {
    test(`Проверка стилей активного ${value} мода`, async ({ page }) => {
      await page.evaluate((value) => {
        document.querySelector('html')?.setAttribute('data-theme', value);
      }, value);
      await expect(page).toHaveScreenshot(`pageWiths${value}Mode1.png`);
    });
  });
});
*/
