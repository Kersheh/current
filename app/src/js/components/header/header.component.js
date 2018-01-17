import HeaderController from './header.controller';
import HeaderTemplate from './header.template.html';

export default {
  controller: HeaderController,
  controllerAs: '$ctrl',
  template: HeaderTemplate,
  bindings: {
    authenticated: '='
  }
};
