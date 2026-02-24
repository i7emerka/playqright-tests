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
