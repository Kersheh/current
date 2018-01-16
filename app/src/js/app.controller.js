export default class AppController {
  constructor($scope, VideoService, AuthService) {
    this.$scope = $scope;
    this.auth = AuthService;
    this.video = VideoService;

    this.videos = [];
  }

  $onInit() {
    // this.auth.logout();
    this.auth.login('test', 'pass')
      .then(() => this.video.getVideoList())
      .then((videos) => {
        this.videos = videos;
        this.video_url = this.video.getVideoUrl(videos[0].id);
      });
  }
}
