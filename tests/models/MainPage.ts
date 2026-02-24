import test, { expect, Locator, Page } from '@playwright/test';

interface Elements {
  locator: (page: Page) => Locator;
  name: string;
  text?: string;
  attribute?: {
    type: string;
    value: string;
  };
}

export class MainPage {
  readonly page: Page;
  readonly elements: Elements[];
  readonly themeButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.themeButton = page.getByRole('button', { name: 'Switch between dark and light' });
    this.elements = [
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
      {
        locator: (page: Page): Locator => this.themeButton,
        name: 'Lightmode icon',
      },
    ];
  }
  async openMainPage() {
    await this.page.goto('https://playwright.dev/');
  }
  async checkElementsVisability() {
    for (const { locator, name } of this.elements) {
      test.step(`Проверка отображения элемента ${name}`, async () => {
        await expect.soft(locator(this.page)).toBeVisible();
      });
    }
  }
  async checkElementsText() {
    for (const { locator, name, text } of this.elements) {
      if (text) {
        test.step(`Проверка названия элемента ${name}`, async () => {
          await expect.soft(locator(this.page)).toContainText(text);
        });
      }
    }
  }
  async checkElementsHrefAttribute() {
    for (const { locator, name, attribute } of this.elements) {
      if (attribute) {
        test.step(`Проверка названия элемента ${name}`, async () => {
          await expect.soft(locator(this.page)).toHaveAttribute(attribute.type, attribute.value);
        });
      }
    }
  }
  async switchThemeTo(mode: 'light' | 'dark' | 'system') {
    const html = this.page.locator('html');

    await test.step(`Установка темы: ${mode}`, async () => {
      // 1. Настраиваем эмуляцию ОС
      if (mode === 'system') {
        // Эмулируем светлую систему
        await this.page.emulateMedia({ colorScheme: 'light' });
      } else {
        await this.page.emulateMedia({ colorScheme: 'no-preference' });
      }

      // 2. Логика ожидания атрибута
      // Если сайт при выборе 'system' пишет в HTML 'light',
      // то мы должны проверять именно это.
      const expectedInHtml = mode === 'system' ? 'light' : mode;

      let attempts = 0;
      // Кликаем по кнопке, пока не получим нужное состояние в HTML
      while ((await html.getAttribute('data-theme')) !== expectedInHtml && attempts < 5) {
        await this.themeButton.click();
        await this.page.waitForTimeout(300); // Даем время на срабатывание скриптов
        attempts++;
      }

      // Финальная проверка: теперь она не упадет, так как мы ждем 'light' для 'system'
      await expect(html).toHaveAttribute('data-theme', expectedInHtml);
    });
  }

  //Делает скриншот и сравнивает его с эталоном

  async checkVisualMode(mode: string) {
    await test.step(`Скриншот страницы в режиме: ${mode}`, async () => {
      await expect(this.page).toHaveScreenshot(`main-page-${mode}.png`, {
        animations: 'disabled',
        fullPage: true,
      });
    });
  }
}
