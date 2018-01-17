import LoginController from './login.controller';
import LoginTemplate from './login.template.html';

export default {
  controller: LoginController,
  controllerAs: '$ctrl',
  template: LoginTemplate,
  bindings: {
    authenticated: '='
  }
};
