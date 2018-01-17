export default class LoginController {
  constructor($scope, AuthService) {
    this.$scope = $scope;
    this.AuthService = AuthService;

    this.error = false;
    this.errorState = null;
  }

  submit() {
    this.AuthService.login(this.$scope.username, this.$scope.password)
      .then(() => {
        this.error = false;
        this.authenticated = true;
      }).catch((res) => {
        this.error = true;
        this.errorState = res.status;
      });
  }
}
