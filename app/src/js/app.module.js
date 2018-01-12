// app template
import AppTemplate from './app.template.html';

// modules
import './components/components.module';

// constants
import './shared/constants';

// styling
import '../scss/styles.scss';
import '../scss/app.scss';

const currentApp = angular.module('currentApp', [
  'ui.router',
  'currentApp.components'
]);

currentApp.config(($locationProvider) => {
  $locationProvider.html5Mode(true);
  $locationProvider.hashPrefix('!');
});

currentApp.config(($stateProvider) => {
  $stateProvider.state('home', {
    url: '/',
    template: AppTemplate
  });

  $stateProvider.state('404', {
    url: '*path',
    template: '<h1>404</h1>'
  });
});

currentApp.run(($rootScope, $state) => {
  $rootScope.$on('unauthorized', () => {
    $state.transitionTo('login');
  });
});
