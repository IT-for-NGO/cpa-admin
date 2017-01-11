import environment from './environment';

import {Redirect} from 'aurelia-router';
import {inject} from 'aurelia-framework';
import {HttpClient, json} from 'aurelia-fetch-client';
import {Router} from 'aurelia-router';

@inject(HttpClient, Router)
export class App {
  constructor(httpClient, router) {
    this.httpClient = httpClient;

    this.message = 'Hello World!';

    this.httpClient.configure(config => {
      config
        .withBaseUrl(environment.apiEndpoint)
        .withInterceptor({
         request(request) {
           request.headers.set("AccessKey", localStorage.getItem('accessKey'));
           return request;
         },
         response(response) {
           if (response.status >= 400 && response.status <= 599) {
             //if (window.location.pathname != '/sign-in') {
             if (response.status == 401) {
               localStorage.removeItem('accessKey');
               router.navigate('/sign-in');
             }
             //}
             throw response;
           }
          return response;
         }
       });
    });
  }

  configureRouter(config, router) {
     config.title = 'CPA Admin';
     config.addPipelineStep('authorize', AuthorizeStep);
     config.options.pushState = false;
     config.map([
       { route: '', redirect: 'dashboard' },
       { route: 'dashboard', moduleId: './dashboard/dashboard', title: 'Dashboard', nav: true, settings: { roles: [ 'authenticated' ] } },
       { route: 'sign-in', moduleId: './sign-in/sign-in', name: 'sign-in', title: 'Sign in', settings: { roles: [] } },
     ]);
     this.router = router;
   }
}


class AuthorizeStep {
  run(navigationInstruction, next) {
    if (navigationInstruction.getAllInstructions().some(i => i.config.settings.roles.indexOf('authenticated') !== -1)) {
      var isAuthenticated = localStorage.getItem('accessKey') != null;
      if (!isAuthenticated) {
        return next.cancel(new Redirect('sign-in'));
      }
    }

    return next();
  }
}
