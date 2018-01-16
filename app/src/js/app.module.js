// app
import AppTemplate from './app.template.html';
import AppController from './app.controller';

// modules
import './components/components.module';
import './services/services.module';

// constants
import './shared/constants';

// styling
import '../scss/styles.scss';
import '../scss/app.scss';

angular.module('currentApp', [
  'ui.router',
  'currentApp.components',
  'currentApp.services'
]).config(($locationProvider) => {
  $locationProvider.html5Mode(true);
  $locationProvider.hashPrefix('!');
}).config(($stateProvider) => {
  $stateProvider.state('home', {
    url: '/',
    template: AppTemplate,
    controller: AppController,
    controllerAs: '$ctrl'
  });

  $stateProvider.state('404', {
    url: '*path',
    template: '<h1>404</h1>'
  });
}).run(() => {

});
