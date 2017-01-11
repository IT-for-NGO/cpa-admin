import {inject} from 'aurelia-framework';
import {HttpClient, json} from 'aurelia-fetch-client';
import {Router} from 'aurelia-router';

@inject(HttpClient, Router)
export class OrgsCreate {
  constructor(httpClient, router) {
    this.httpClient = httpClient;
    this.router = router;

    this.input = {
      category: 'université',
      address: {},
      contact: {},
    }
    this.errors = {};
  }

  create() {
    console.log(JSON.stringify(this.input, null, 2))
    this.errors = {};
    this.httpClient
      .fetch('organisations', {
        method: 'POST',
        body: json(this.input)
      })
      .then(r => r.json())
      .then(data => {
        console.log('data', data)
        this.router.navigateToRoute('d-orgs-show', { id: data.id });
      })
      .catch(e => {
        console.log(e)
        if (e.status == 409) {
          this.errors.mailAddress = "Conflict";
          console.log(this.errors)
          return;
        }
        e.json().then(x => this.errors = x);
      });
  }
}
