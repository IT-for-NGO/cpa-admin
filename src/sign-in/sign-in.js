import {inject} from 'aurelia-framework';
import {HttpClient, json} from 'aurelia-fetch-client';
import {Router} from 'aurelia-router';

@inject(HttpClient, Router)
export class SignIn {
  constructor(httpClient, router) {
    this.httpClient = httpClient;
    this.router = router;

    this.realm = 'A';
    
    this.hasError = false;
    this.isFetching = false;
  }

  activate(transition) {
    if (transition.accessKey) {
      localStorage.setItem('accessKey', transition.accessKey);
      this.router.navigate('/dashboard');
    }
  }

  signIn() {
    this.hasError = false;
    this.isFetching = true;

    this.httpClient
      .fetch('authentication', {
        method: 'POST',
        body: json({
          mailAddress: this.email,
          password: this.password,
          realm: this.realm,
        }),
      })
      .then(r => r.json())
      .then(account => {
        this.isFetching = false;
        localStorage.setItem('accessKey', account.accessKey);
        this.router.navigate('/dashboard');
      })
      .catch((e) => {
        console.log(e)
        this.hasError = true;
        this.isFetching = false;
      });
    ;
  }
}
