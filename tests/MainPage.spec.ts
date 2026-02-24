import { test, expect, Page, Locator } from '@playwright/test';

interface Elements {
  locator: (page: Page) => Locator;
  name: string;
  text?: string;
  attribute?: {
    type: string;
    value: string;
  };
}

const elements: Elements[] = [
  {
    locator: (page: Page): Locator =>
      page.getByRole('link', { name: 'Playwright logo Playwright' }),
    name: 'Playwright logo link',
    text: 'Playwright',
    attribute: {
      type: 'href',
      value: '/',
    },
  },
  {
    locator: (page: Page): Locator => page.getByRole('link', { name: 'Docs' }),
    name: 'Docs link',
    text: 'Docs',
    attribute: {
      type: 'href',
      value: '/docs/intro',
    },
  },
  {
    locator: (page: Page): Locator => page.getByRole('link', { name: 'API' }),
    name: 'API link',
    text: 'API',
    attribute: {
      type: 'href',
      value: '/docs/api/class-playwright',
    },
  },
  {
    locator: (page: Page): Locator => page.getByRole('button', { name: 'Node.js' }),
    name: 'Node.js link',
    text: 'Node.js',
  },
  {
    locator: (page: Page): Locator => page.getByRole('link', { name: 'Community' }),
    name: 'Community link',
    text: 'Community',
    attribute: {
      type: 'href',
      value: '/community/welcome',
    },
  },
  {
    locator: (page: Page): Locator => page.getByRole('link', { name: 'GitHub repository' }),
    name: 'GitHub icon',
    attribute: {
      type: 'href',
      value: 'https://github.com/microsoft/playwright',
    },
  },
  {
    locator: (page: Page): Locator => page.getByRole('link', { name: 'Discord server' }),
    name: 'Discord icon',
    attribute: {
      type: 'href',
      value: 'https://aka.ms/playwright/discord',
    },
  },
  {
    locator: (page: Page): Locator =>
      page.getByRole('button', { name: 'Switch between dark and light' }),
    name: 'Lightmode icon',
  },
  {
    locator: (page: Page): Locator => page.getByRole('button', { name: 'Search (Ctrl+K)' }),
    name: 'Search input',
  },
  {
    locator: (page: Page): Locator =>
      page.getByRole('heading', { name: 'Playwright enables reliable' }),
    name: 'Title',
    text: 'Playwright enables reliable end-to-end testing for modern web apps.',
  },
  {
    locator: (page: Page): Locator => page.getByRole('link', { name: 'Get started' }),
    name: 'Get started batton',
    text: 'Get started',
    attribute: {
      type: 'href',
      value: '/docs/intro',
    },
  },
];

test.describe('Тесты главной страницы', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://playwright.dev/');
  });
  test('Проверка отображения элементов навигации хедера', async ({ page }) => {
    elements.forEach(({ locator, name }) => {
      test.step(`Проверка отображения элемента ${name}`, async () => {
        await expect.soft(locator(page)).toBeVisible();
      });
    });
  });
  test('Проверка назване элементов навигации хедеров', async ({ page }) => {
    elements.forEach(({ locator, name, text }) => {
      if (text) {
        test.step(`Проверка названия элемента ${name}`, async () => {
          await expect.soft(locator(page)).toContainText(text);
        });
      }
    });
  });

  test('Проверка атрибута href элемента', async ({ page }) => {
    elements.forEach(({ locator, name, attribute }) => {
      if (attribute) {
        test.step(`Проверка названия элемента ${name}`, async () => {
          await expect.soft(locator(page)).toHaveAttribute(attribute.type, attribute.value);
        });
      }
    });
  });

  test.describe('Тестирование тем оформления (Light, Dark, System)', () => {
    // 1. Тест функциональности переключателя
    test('Проверка циклического переключения тем кнопкой', async ({ page }) => {
      await page.goto('https://playwright.dev/');

      const themeButton = page.getByRole('button', { name: 'Switch between dark and light' });
      const html = page.locator('html');

      // Переключаем на Light
      await themeButton.click();
      await expect(html).toHaveAttribute('data-theme-choice', 'light');

      // Переключаем на Dark
      await themeButton.click();
      await expect(html).toHaveAttribute('data-theme-choice', 'dark');

      // Переключаем на System
      await themeButton.click();
      await expect(html).toHaveAttribute('data-theme-choice', 'system');
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
