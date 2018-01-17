export default class HeaderController {
  constructor($scope, AuthService) {
    this.$scope = $scope;
    this.AuthService = AuthService;
  }

  logout() {
    this.AuthService.logout()
      .then(() => this.authenticated = false);
  }
}
