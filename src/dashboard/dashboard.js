import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {HttpClient, json} from 'aurelia-fetch-client';

@inject(HttpClient, Router)
export class Dashboard {
  constructor(httpClient, router) {
    this.httpClient = httpClient;
  }

  configureRouter(config, router) {
     config.map([
       { route: '', moduleId: './index/index', name: 'd-index', title: 'Index', nav: true },
       { route: 'organisations', moduleId: './orgs-list/orgs-list', name: 'd-orgs-list', title: 'Organisations', nav: true },
       { route: 'organisations/:id', moduleId: './orgs-show/orgs-show', name: 'd-orgs-show' },
       { route: 'organisations/create', moduleId: './orgs-create/orgs-create', name: 'd-orgs-create' },
     ]);
     this.router = router;
   }

  activate() {
    return this.httpClient
      .fetch('authentication', {
        method: 'POST',
        body: json({
          accessKey: localStorage.getItem('accessKey')
        })
      })
      .then(r => r.json())
      .then(account => {
        this.account = account;
      });
  }

  signOut() {
    localStorage.removeItem('accessKey');
    this.router.navigateToRoute('sign-in');
  }
}
