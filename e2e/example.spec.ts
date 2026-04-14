import { test, expect } from '@playwright/test'

test('homepage has title', async ({ page }) => {
  await page.goto('/')

  // 检查页面标题
  await expect(page).toHaveTitle(/Yam UI/)
})

test('homepage displays content', async ({ page }) => {
  await page.goto('/')

  // 检查页面是否加载
  await expect(page.locator('#app')).toBeVisible()
})
