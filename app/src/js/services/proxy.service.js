export default class ProxyService {
  constructor($http) {
    this.http = $http;
  }

  get(url) {
    const options = {
      withCredentials: true
    };
    return this.http.get(url, options);
  }

  post(url, body = {}) {
    const json = angular.toJson(body);
    const headers = {
      'Content-Type': 'application/json'
    };
    const options = {
      headers: headers,
      withCredentials: true
    };
    return this.http.post(url, json, options);
  }
}
