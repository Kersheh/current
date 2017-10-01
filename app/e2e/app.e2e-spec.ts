import { CurrentPage } from './app.po';

describe('current App', function() {
  let page: CurrentPage;

  beforeEach(() => {
    page = new CurrentPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
