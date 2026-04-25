import { request, APIRequestContext } from '@playwright/test';
import { USERS_ENDPOINTS } from '../../src/api/endpoints';

export async function getAuthContext(): Promise<APIRequestContext> {
  const loginContext = await request.newContext();

  const response = await loginContext.post(`${process.env.VITE_API_BASE_URL}${USERS_ENDPOINTS.LOGIN}`, {
    data: {
      email: 'ev@gmail.com',
      password: 'admin'
    }
  });

  const { accessToken } = await response.json();

  return await request.newContext({
    baseURL: process.env.VITE_API_BASE_URL,
    extraHTTPHeaders: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/json',
    },
    failOnStatusCode: true
  });
}
