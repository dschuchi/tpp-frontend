import { type Locator, type Page } from '@playwright/test';

export class PaginatedTable {
  readonly page: Page;
  readonly apiUrlSubstring: string;

  constructor(page: Page, apiUrlSubstring: string) {
    this.page = page;
    this.apiUrlSubstring = apiUrlSubstring;
  }

  async findRow(name: string): Promise<Locator> {
    const row = this.page.getByRole('row', { name: name });
    const nextButton = this.page.getByLabel('Next page');

    let hasNextPage = true;

    do {
      await this.page.waitForTimeout(500);

      if (await row.count() > 0 && await row.first().isVisible()) {
        return row.first();
      }

      hasNextPage = await nextButton.isVisible() && !(await nextButton.isDisabled());

      if (hasNextPage) {
        const responsePromise = this.page.waitForResponse(response => 
          response.url().includes(this.apiUrlSubstring) && response.request().method() === 'GET'
        );
        await nextButton.click();
        await responsePromise;
      }
    } while (hasNextPage);
    return row.first();
  }
}
