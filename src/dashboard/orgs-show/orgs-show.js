import {inject} from 'aurelia-framework';
import {HttpClient, json} from 'aurelia-fetch-client';
import {Router} from 'aurelia-router';

@inject(HttpClient, Router)
export class OrgsShow {
  constructor(httpClient, router) {
    this.httpClient = httpClient;
    this.router = router;

    this.isEditing = false;
    this.input = null;
    this.errors = {};
  }

  activate(transition) {
    console.log(transition)
    return Promise.all([
      this.httpClient.fetch(`organisations/${transition.id}`)
        .then(r => r.json())
        .then(data => {
          this.org = data
        }),
      this.httpClient.fetch(`organisations/${transition.id}/accessKey`)
        .then(r => r.json())
        .then(data => {
          this.orgAccessKey = data.accessKey;
        })
        .catch(e => console.log(e))
    ]);
  }

  startEdit() {
    this.isEditing = true;
    this.input = JSON.parse(JSON.stringify(this.org));
  }

  cancelEdit() {
    this.isEditing = false;
    this.input = null;
  }

  update() {
    this.httpClient
      .fetch(`organisations/${this.input.id}`, {
        method: 'PUT',
        body: json(this.input)
      })
      .then(r => {
        this.org = this.input;
        this.cancelEdit();
      })
      .catch(e => e.json().then(x => this.errors = x));
  }

  delete() {
    if (!confirm('Are you sure you want to delete this organisation?')) {
      return;
    }

    this.httpClient
      .fetch(`organisations/${this.org.id}`, {
        method: 'DELETE'
      })
      .then(r => {
        this.router.navigateToRoute('d-orgs-list');
      })
      .catch(e => console.log(e));
  }

  get orgAsJSON() {
    return JSON.stringify(this.org, null, 2)
  }
}
