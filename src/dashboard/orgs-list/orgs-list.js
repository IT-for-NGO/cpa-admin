import {inject} from 'aurelia-framework';
import {HttpClient, json} from 'aurelia-fetch-client';

@inject(HttpClient)
export class OrgsList {
  constructor(httpClient) {
    this.httpClient = httpClient;
  }

  activate() {
    return this.httpClient.fetch('organisations')
      .then(r => r.json())
      .then(data => this.organisations = data);
  }
}
