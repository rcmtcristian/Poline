import Home from './pages/home';
import Collections from './pages/collections';
import Detail from './pages/detail';
import About from './pages/about';
import Preloader from 'components/Preloader';
import { each } from 'neo-async';

class app {
  constructor() {
    this.createPreloader();
    this.createContent();
    this.createPages();
    this.addLinkListeners();
  }
  createPreloader() {
    this.preloader = new Preloader({});
    this.preloader.once('completed', this.onPreloaded.bind(this));
  }

  createContent() {
    this.content = document.querySelector('.content');
    this.template = this.content.getAttribute('data-template');
  }

  onPreloaded() {
    this.preloader.destroy();

    this.page.show();
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
    this.page.show();

    console.log(this.pages);
  }

  async onChange(href) {
    const request = new XMLHttpRequest();
    request.open('GET', href, true);
    request.onload = () => {
      if (request.status >= 200 && request.status < 400) {
        const response = request.responseText;
        const parser = new DOMParser();
        const text = parser.parseFromString(response, 'text/html');
        const content = text.querySelector('.content');
        const nextTemplate = content.getAttribute('data-template');
        this.page.hide();
        this.template = nextTemplate;
        this.content.setAttribute('data-template', this.template);
        this.page = this.pages[this.template];
        this.page.create();
        this.page.show();
        history.pushState({}, '', href);
        this.addLinkListeners();
      } else {
        console.log('We reached our target server, but it returned an error');
      }
    };
  }

  addLinkListeners() {
    this.links = document.querySelectorAll('a');

    each(links, (link) => {
      link.onCLick = (event) => {
        const { href } = link;
        event.preventDefault();

        this.onChange(href);
      };
    });
  }
}

new app();
