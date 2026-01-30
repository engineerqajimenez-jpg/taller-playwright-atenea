import {Page, Locator, } from '@playwright/test';

export class backendUtils{
  readonly page: Page;
  
  
  constructor(page: Page) {
       this.page = page;
  }

  async enviarRequestDeBackend(endpoint: string, data: any) {
    const response = await this.page.request.post(endpoint, {
      headers: {
        'Accept': 'application/VND.github.v3+json',
        'Content-Type': 'application/json'
      },
      data: data
    });
    const responseBody = await response.json();
    return responseBody;
}

}