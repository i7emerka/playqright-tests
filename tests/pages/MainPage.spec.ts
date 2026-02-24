import { test, expect } from '../fixtures/mainPage';
import { MainPage } from '../models/MainPage';

test.describe('Тесты главной страницы', () => {
  test('Проверка отображения элементов навигации хедера', async ({ mainPage }) => {
    await mainPage.checkElementsVisability();
  });
  test('Проверка назване элементов навигации хедеров', async ({ mainPage }) => {
    await mainPage.checkElementsText();
  });

  test('Проверка атрибута href элемента', async ({ mainPage }) => {
    await mainPage.checkElementsHrefAttribute();
  });

  test('Визуальная проверка всех тем', async ({ mainPage }) => {
    const themes = ['light', 'dark', 'system'] as const;
    for (const theme of themes) {
      await mainPage.switchThemeTo(theme); // 1. Переключаем тему (теперь система будет светлой)
      await mainPage.checkVisualMode(theme); // 2. Делаем скриншот и сравниваем
    }
  });
});
