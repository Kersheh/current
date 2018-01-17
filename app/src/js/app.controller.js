export default class AppController {
  constructor($rootScope, $scope, VideoService, AuthService) {
    this.$rootScope = $rootScope;
    this.$scope = $scope;
    this.AuthService = AuthService;
    this.VideoService = VideoService;

    this.authenticated = false;
  }

  $onInit() {
    this.AuthService.validateAuth()
      .then((auth) => {
        if(auth) {
          this.authenticated = true;
          this.VideoService.getVideoList()
            .then((videos) => {
              this.video_url = this.VideoService.getVideoUrl(videos[0].id);
            });
        }
      });
  }
}
