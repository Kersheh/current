export default class AuthService {
  constructor(ProxyService) {
    this.proxy = ProxyService;
  }

  login(username, password) {
    const body = {
      user: {
        username: username,
        password: password
      }
    };

    return this.proxy.post('http://127.0.0.1:3000/auth/login', body);
  }

  logout() {
    return this.proxy.post('http://127.0.0.1:3000/auth/logout');
  }
}
