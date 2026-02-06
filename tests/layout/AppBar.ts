import type { Locator, Page } from '@playwright/test'

export class AppBar {
  readonly page: Page
  readonly userName: Locator

  constructor (page: Page) {
    this.page = page
    this.userName = page.locator('.v-app-bar .v-card-title')
  }
}
