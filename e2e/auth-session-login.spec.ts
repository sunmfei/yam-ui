import { test, expect } from '@playwright/test'

test('session login works through gateway', async ({ page }) => {
  await page.goto('http://127.0.0.1:53001/login')

  await page.getByLabel('账号').fill('admin')
  await page.getByLabel('密码').fill('123456')
  await page.getByRole('button', { name: '登录' }).click()

  await page.waitForURL((url) => !url.pathname.startsWith('/login') && !url.pathname.startsWith('/callback'), {
    timeout: 15000,
  })

  await expect(page).toHaveURL(/127\.0\.0\.1:53001\/?$/)

  const meResponse = await page.request.get('http://127.0.0.1:48088/auth/me', {
    headers: {
      Cookie: (await page.context().cookies())
        .map((cookie) => `${cookie.name}=${cookie.value}`)
        .join('; '),
    },
  })

  expect(meResponse.ok()).toBeTruthy()
  const body = await meResponse.json()
  expect(body.code).toBe('200')
  expect(body.data?.preferred_username).toBe('admin')
})
