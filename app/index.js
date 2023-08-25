import Home from './pages/home';
import Collections from './pages/collections';
import Detail from './pages/detail';
import About from './pages/about';

class app {
  constructor() {
    this.createContent();
    this.createPages();
  }

  createContent() {
    this.content = document.querySelector('.content');
    this.template = this.content.getAttribute('data-template');
  }

  createPages() {
    this.pages = {
      home: new Home(),
      collections: new Collections(),
      detail: new Detail(),
      about: new About(),
    };

    this.page = this.pages[this.template];
    this.page.create();

    console.log(this.pages);
  }
}

new app();
