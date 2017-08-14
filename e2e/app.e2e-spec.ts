import { DatepickerPage } from './app.po';

describe('datepicker App', () => {
  let page: DatepickerPage;

  beforeEach(() => {
    page = new DatepickerPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
