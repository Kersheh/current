import AuthService from './auth.service';
import ProxyService from './proxy.service';
import VideoService from './video.service';

export default angular.module('currentApp.services', [])
  .factory('AuthService', AuthService)
  .factory('ProxyService', ProxyService)
  .factory('VideoService', VideoService);
