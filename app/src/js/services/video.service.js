export default class VideoService {
  constructor(ProxyService) {
    this.proxy = ProxyService;
  }

  getVideoList() {
    return this.proxy.get('http://127.0.0.1:3000/videos')
      .then((res) => res.data)
      .catch((err) => console.log(err));
  }

  getVideoUrl(id) {
    return 'http://127.0.0.1:3000/video/' + id;
  }
}
