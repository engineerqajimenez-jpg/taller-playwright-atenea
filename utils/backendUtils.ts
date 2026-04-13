import {APIRequestContext, expect, } from '@playwright/test';

export class backendUtils {

  static async crearUsuarioPorApi(request: APIRequestContext, usuario: {firstName: string, lastName: string, email: string, password: string}) {
    const email = usuario.email.split('@')[0] + Date.now().toString() + '@' + usuario.email.split('@')[1];
    const response = await request.post('http://localhost:6007/api/auth/signup/', {
     headers: {
      'accept': 'application/vndd.github.v3+json',
      'content-type': 'application/json'
     },
      data: {
        firstName: usuario.firstName,
        lastName: usuario.lastName,
        email: email,
        password: usuario.password
      }
    });
    expect(response.status()).toBe(201);
    return { email: email, password: usuario.password };
  }

}