define('app',['exports', './environment', 'aurelia-router', 'aurelia-framework', 'aurelia-fetch-client'], function (exports, _environment, _aureliaRouter, _aureliaFramework, _aureliaFetchClient) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.App = undefined;

  var _environment2 = _interopRequireDefault(_environment);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var App = exports.App = (_dec = (0, _aureliaFramework.inject)(_aureliaFetchClient.HttpClient, _aureliaRouter.Router), _dec(_class = function () {
    function App(httpClient, router) {
      _classCallCheck(this, App);

      this.httpClient = httpClient;

      this.message = 'Hello World!';

      this.httpClient.configure(function (config) {
        config.withBaseUrl(_environment2.default.apiEndpoint).withInterceptor({
          request: function request(_request) {
            _request.headers.set("AccessKey", localStorage.getItem('accessKey'));
            return _request;
          },
          response: function response(_response) {
            if (_response.status >= 400 && _response.status <= 599) {
              if (_response.status == 401) {
                localStorage.removeItem('accessKey');
                router.navigate('/sign-in');
              }

              throw _response;
            }
            return _response;
          }
        });
      });
    }

    App.prototype.configureRouter = function configureRouter(config, router) {
      config.title = 'CPA Admin';
      config.addPipelineStep('authorize', AuthorizeStep);
      config.options.pushState = false;
      config.map([{ route: '', redirect: 'dashboard' }, { route: 'dashboard', moduleId: './dashboard/dashboard', title: 'Dashboard', nav: true, settings: { roles: ['authenticated'] } }, { route: 'sign-in', moduleId: './sign-in/sign-in', name: 'sign-in', title: 'Sign in', settings: { roles: [] } }]);
      this.router = router;
    };

    return App;
  }()) || _class);

  var AuthorizeStep = function () {
    function AuthorizeStep() {
      _classCallCheck(this, AuthorizeStep);
    }

    AuthorizeStep.prototype.run = function run(navigationInstruction, next) {
      if (navigationInstruction.getAllInstructions().some(function (i) {
        return i.config.settings.roles.indexOf('authenticated') !== -1;
      })) {
        var isAuthenticated = localStorage.getItem('accessKey') != null;
        if (!isAuthenticated) {
          return next.cancel(new _aureliaRouter.Redirect('sign-in'));
        }
      }

      return next();
    };

    return AuthorizeStep;
  }();
});
define('environment',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    debug: false,
    testing: false
  };
});
define('main',['exports', './environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;

  var _environment2 = _interopRequireDefault(_environment);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  Promise.config({
    longStackTraces: _environment2.default.debug,
    warnings: {
      wForgottenReturn: false
    }
  });

  function configure(aurelia) {
    aurelia.use.standardConfiguration().globalResources('resources/attributes/place-autocomplete').feature('resources');

    if (_environment2.default.debug) {
      aurelia.use.developmentLogging();
    }

    if (_environment2.default.testing) {
      aurelia.use.plugin('aurelia-testing');
    }

    _environment2.default.apiEndpoint = "http://api.cpafrance.fr/";

    aurelia.start().then(function () {
      return aurelia.setRoot();
    });
  }
});
define('dashboard/dashboard',['exports', 'aurelia-framework', 'aurelia-router', 'aurelia-fetch-client'], function (exports, _aureliaFramework, _aureliaRouter, _aureliaFetchClient) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Dashboard = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var Dashboard = exports.Dashboard = (_dec = (0, _aureliaFramework.inject)(_aureliaFetchClient.HttpClient, _aureliaRouter.Router), _dec(_class = function () {
    function Dashboard(httpClient, router) {
      _classCallCheck(this, Dashboard);

      this.httpClient = httpClient;
    }

    Dashboard.prototype.configureRouter = function configureRouter(config, router) {
      config.map([{ route: '', moduleId: './index/index', name: 'd-index', title: 'Index', nav: true }, { route: 'organisations', moduleId: './orgs-list/orgs-list', name: 'd-orgs-list', title: 'Organisations', nav: true }, { route: 'organisations/:id', moduleId: './orgs-show/orgs-show', name: 'd-orgs-show' }, { route: 'organisations/create', moduleId: './orgs-create/orgs-create', name: 'd-orgs-create' }]);
      this.router = router;
    };

    Dashboard.prototype.activate = function activate() {
      var _this = this;

      return this.httpClient.fetch('authentication', {
        method: 'POST',
        body: (0, _aureliaFetchClient.json)({
          accessKey: localStorage.getItem('accessKey')
        })
      }).then(function (r) {
        return r.json();
      }).then(function (account) {
        _this.account = account;
      });
    };

    Dashboard.prototype.signOut = function signOut() {
      localStorage.removeItem('accessKey');
      this.router.navigateToRoute('sign-in');
    };

    return Dashboard;
  }()) || _class);
});
define('resources/index',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;
  function configure(config) {}
});
define('sign-in/sign-in',['exports', 'aurelia-framework', 'aurelia-fetch-client', 'aurelia-router'], function (exports, _aureliaFramework, _aureliaFetchClient, _aureliaRouter) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.SignIn = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var SignIn = exports.SignIn = (_dec = (0, _aureliaFramework.inject)(_aureliaFetchClient.HttpClient, _aureliaRouter.Router), _dec(_class = function () {
    function SignIn(httpClient, router) {
      _classCallCheck(this, SignIn);

      this.httpClient = httpClient;
      this.router = router;

      this.realm = 'A';

      this.hasError = false;
      this.isFetching = false;
    }

    SignIn.prototype.activate = function activate(transition) {
      if (transition.accessKey) {
        localStorage.setItem('accessKey', transition.accessKey);
        this.router.navigate('/dashboard');
      }
    };

    SignIn.prototype.signIn = function signIn() {
      var _this = this;

      this.hasError = false;
      this.isFetching = true;

      this.httpClient.fetch('authentication', {
        method: 'POST',
        body: (0, _aureliaFetchClient.json)({
          mailAddress: this.email,
          password: this.password,
          realm: this.realm
        })
      }).then(function (r) {
        return r.json();
      }).then(function (account) {
        _this.isFetching = false;
        localStorage.setItem('accessKey', account.accessKey);
        _this.router.navigate('/dashboard');
      }).catch(function (e) {
        console.log(e);
        _this.hasError = true;
        _this.isFetching = false;
      });
      ;
    };

    return SignIn;
  }()) || _class);
});
define('dashboard/index/index',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var Index = exports.Index = function Index() {
    _classCallCheck(this, Index);
  };
});
define('dashboard/orgs-create/orgs-create',['exports', 'aurelia-framework', 'aurelia-fetch-client', 'aurelia-router'], function (exports, _aureliaFramework, _aureliaFetchClient, _aureliaRouter) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.OrgsCreate = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var OrgsCreate = exports.OrgsCreate = (_dec = (0, _aureliaFramework.inject)(_aureliaFetchClient.HttpClient, _aureliaRouter.Router), _dec(_class = function () {
    function OrgsCreate(httpClient, router) {
      _classCallCheck(this, OrgsCreate);

      this.httpClient = httpClient;
      this.router = router;

      this.input = {
        category: 'université',
        address: {},
        contact: {}
      };
      this.errors = {};
    }

    OrgsCreate.prototype.create = function create() {
      var _this = this;

      console.log(JSON.stringify(this.input, null, 2));
      this.errors = {};
      this.httpClient.fetch('organisations', {
        method: 'POST',
        body: (0, _aureliaFetchClient.json)(this.input)
      }).then(function (r) {
        return r.json();
      }).then(function (data) {
        console.log('data', data);
        _this.router.navigateToRoute('d-orgs-show', { id: data.id });
      }).catch(function (e) {
        console.log(e);
        if (e.status == 409) {
          _this.errors.mailAddress = "Conflict";
          console.log(_this.errors);
          return;
        }
        e.json().then(function (x) {
          return _this.errors = x;
        });
      });
    };

    return OrgsCreate;
  }()) || _class);
});
define('dashboard/orgs-list/orgs-list',['exports', 'aurelia-framework', 'aurelia-fetch-client'], function (exports, _aureliaFramework, _aureliaFetchClient) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.OrgsList = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var OrgsList = exports.OrgsList = (_dec = (0, _aureliaFramework.inject)(_aureliaFetchClient.HttpClient), _dec(_class = function () {
    function OrgsList(httpClient) {
      _classCallCheck(this, OrgsList);

      this.httpClient = httpClient;
    }

    OrgsList.prototype.activate = function activate() {
      var _this = this;

      return this.httpClient.fetch('organisations').then(function (r) {
        return r.json();
      }).then(function (data) {
        return _this.organisations = data;
      });
    };

    return OrgsList;
  }()) || _class);
});
define('dashboard/orgs-show/orgs-show',['exports', 'aurelia-framework', 'aurelia-fetch-client', 'aurelia-router'], function (exports, _aureliaFramework, _aureliaFetchClient, _aureliaRouter) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.OrgsShow = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var _dec, _class;

  var OrgsShow = exports.OrgsShow = (_dec = (0, _aureliaFramework.inject)(_aureliaFetchClient.HttpClient, _aureliaRouter.Router), _dec(_class = function () {
    function OrgsShow(httpClient, router) {
      _classCallCheck(this, OrgsShow);

      this.httpClient = httpClient;
      this.router = router;

      this.isEditing = false;
      this.input = null;
      this.errors = {};
    }

    OrgsShow.prototype.activate = function activate(transition) {
      var _this = this;

      console.log(transition);
      return Promise.all([this.httpClient.fetch('organisations/' + transition.id).then(function (r) {
        return r.json();
      }).then(function (data) {
        _this.org = data;
      }), this.httpClient.fetch('organisations/' + transition.id + '/accessKey').then(function (r) {
        return r.json();
      }).then(function (data) {
        _this.orgAccessKey = data.accessKey;
      }).catch(function (e) {
        return console.log(e);
      })]);
    };

    OrgsShow.prototype.startEdit = function startEdit() {
      this.isEditing = true;
      this.input = JSON.parse(JSON.stringify(this.org));
    };

    OrgsShow.prototype.cancelEdit = function cancelEdit() {
      this.isEditing = false;
      this.input = null;
    };

    OrgsShow.prototype.update = function update() {
      var _this2 = this;

      this.httpClient.fetch('organisations/' + this.input.id, {
        method: 'PUT',
        body: (0, _aureliaFetchClient.json)(this.input)
      }).then(function (r) {
        _this2.org = _this2.input;
        _this2.cancelEdit();
      }).catch(function (e) {
        return e.json().then(function (x) {
          return _this2.errors = x;
        });
      });
    };

    OrgsShow.prototype.delete = function _delete() {
      var _this3 = this;

      if (!confirm('Are you sure you want to delete this organisation?')) {
        return;
      }

      this.httpClient.fetch('organisations/' + this.org.id, {
        method: 'DELETE'
      }).then(function (r) {
        _this3.router.navigateToRoute('d-orgs-list');
      }).catch(function (e) {
        return console.log(e);
      });
    };

    _createClass(OrgsShow, [{
      key: 'orgAsJSON',
      get: function get() {
        return JSON.stringify(this.org, null, 2);
      }
    }]);

    return OrgsShow;
  }()) || _class);
});
define('resources/attributes/place-autocomplete',['exports', 'aurelia-framework'], function (exports, _aureliaFramework) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.PlaceAutocompleteCustomAttribute = undefined;

    function _initDefineProp(target, property, descriptor, context) {
        if (!descriptor) return;
        Object.defineProperty(target, property, {
            enumerable: descriptor.enumerable,
            configurable: descriptor.configurable,
            writable: descriptor.writable,
            value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
        });
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
        var desc = {};
        Object['ke' + 'ys'](descriptor).forEach(function (key) {
            desc[key] = descriptor[key];
        });
        desc.enumerable = !!desc.enumerable;
        desc.configurable = !!desc.configurable;

        if ('value' in desc || desc.initializer) {
            desc.writable = true;
        }

        desc = decorators.slice().reverse().reduce(function (desc, decorator) {
            return decorator(target, property, desc) || desc;
        }, desc);

        if (context && desc.initializer !== void 0) {
            desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
            desc.initializer = undefined;
        }

        if (desc.initializer === void 0) {
            Object['define' + 'Property'](target, property, desc);
            desc = null;
        }

        return desc;
    }

    function _initializerWarningHelper(descriptor, context) {
        throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
    }

    var _dec, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4;

    var PlaceAutocompleteCustomAttribute = exports.PlaceAutocompleteCustomAttribute = (_dec = (0, _aureliaFramework.inject)(Element), _dec(_class = (_class2 = function () {
        function PlaceAutocompleteCustomAttribute(element) {
            _classCallCheck(this, PlaceAutocompleteCustomAttribute);

            _initDefineProp(this, 'target', _descriptor, this);

            _initDefineProp(this, 'userSelectionBinding', _descriptor2, this);

            _initDefineProp(this, 'targetProperty', _descriptor3, this);

            _initDefineProp(this, 'restrictions', _descriptor4, this);

            this.element = element;
        }

        PlaceAutocompleteCustomAttribute.prototype.created = function created() {
            if (!this.restrictions) {
                this.restrictions = ["geocode"];
            } else if (this.restrictions == 'regions') {
                this.restrictions = ["(regions)"];
            }
        };

        PlaceAutocompleteCustomAttribute.prototype.attached = function attached() {
            var _this = this;

            google.maps.event.addDomListener(this.element, 'keydown', function (e) {
                if (e.keyCode == 13) {
                    console.log('enter');
                    e.preventDefault();
                }
            });

            var options = {
                types: this.restrictions,
                componentRestrictions: { country: "fr" }
            };
            this.autocomplete = new google.maps.places.Autocomplete(this.element, options);

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    var geolocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    var circle = new google.maps.Circle({
                        center: geolocation,
                        radius: position.coords.accuracy
                    });
                    _this.autocomplete.setBounds(circle.getBounds());
                });
            }
            this.targetProperty = [this.targetProperty || "address"];
            if (this.target[this.targetProperty] && this.target[this.targetProperty].formattedAddress) {
                this.element.value = this.target[this.targetProperty].formattedAddress;
            }

            this.autocomplete.addListener('place_changed', function () {
                var place = _this.autocomplete.getPlace();
                var googleObject = { formatted_address: place.formatted_address, placeId: place.place_id };

                place.address_components.forEach(function (x) {
                    var googlePropertyName = x.types[0];
                    googleObject[googlePropertyName] = x["short_name"];
                });
                googleObject.lat = place.geometry.location.lat();
                googleObject.lng = place.geometry.location.lng();

                var appPlace = {};
                appPlace.formattedAddress = googleObject.formatted_address;

                if (googleObject.street_number || googleObject.route) {
                    appPlace.street1 = googleObject.street_number ? googleObject.street_number + " " + googleObject.route : googleObject.route;
                }
                if (googleObject.postal_code) {
                    appPlace.postalCode = googleObject.postal_code;
                }
                appPlace.locality = googleObject.locality.indexOf("Paris-") == 0 ? "Paris" : googleObject.locality;
                appPlace.country = googleObject.country == "FR" ? "France" : googleObject.country;

                appPlace.lat = googleObject.lat;
                appPlace.lng = googleObject.lng;
                appPlace.googleMapId = googleObject.placeId;

                _this.target[_this.targetProperty] = appPlace;
                if (_this.userSelectionBinding) {
                    _this.element.value = appPlace[_this.userSelectionBinding];
                }
            });
        };

        return PlaceAutocompleteCustomAttribute;
    }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'target', [_aureliaFramework.bindable], {
        enumerable: true,
        initializer: null
    }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'userSelectionBinding', [_aureliaFramework.bindable], {
        enumerable: true,
        initializer: null
    }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'targetProperty', [_aureliaFramework.bindable], {
        enumerable: true,
        initializer: null
    }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, 'restrictions', [_aureliaFramework.bindable], {
        enumerable: true,
        initializer: null
    })), _class2)) || _class);
});
define('text!app.html', ['module'], function(module) { module.exports = "<template>\n    <!--<div if.bind=\"router.isNavigating\">Loading...</div>-->\n   <router-view></router-view>\n</template>\n"; });
define('text!dashboard/dashboard.html', ['module'], function(module) { module.exports = "<template>\n  <nav class=\"navbar navbar-default\">\n    <div class=\"container-fluid\">\n      <div class=\"navbar-header\">\n        <a class=\"navbar-brand\" href=\"#\">CPA Backend</a>\n      </div>\n\n      <ul class=\"nav navbar-nav\">\n        <li repeat.for=\"row of router.navigation\" class=\"${row.isActive ? 'active' : ''}\">\n          <a href.bind=\"row.href\">${row.title}</a>\n        </li>\n      </ul>\n      <ul class=\"nav navbar-nav navbar-right\">\n        <li class=\"dropdown\">\n          <a href=\"#\" class=\"dropdown-toggle\" data-toggle=\"dropdown\" role=\"button\" aria-haspopup=\"true\" aria-expanded=\"false\">\n            Signed in as <b>${account.name}</b> <span class=\"caret\"></span>\n          </a>\n          <ul class=\"dropdown-menu\">\n            <li><a href=\"#\" click.delegate=\"signOut()\">Sign out</a></li>\n          </ul>\n        </li>\n      </ul>\n    </div>\n  </nav>\n\n  <router-view></router-view>\n</template>\n"; });
define('text!sign-in/sign-in.html', ['module'], function(module) { module.exports = "<template>\n  <h1>Sign in</h1>\n  <form submit.delegate=\"signIn()\">\n    <div class=\"alert alert-danger\" role=\"alert\" if.bind=\"hasError\">\n      Bad email or password. Try again.\n    </div>\n    <div class=\"form-group\">\n      <label for=\"exampleInputEmail1\">Email address</label>\n      <input type=\"email\" class=\"form-control\" placeholder=\"Email\" value.bind=\"email\">\n    </div>\n    <div class=\"form-group\">\n      <label for=\"exampleInputPassword1\">Password</label>\n      <input type=\"password\" class=\"form-control\" placeholder=\"Password\" value.bind=\"password\">\n    </div>\n    <button type=\"submit\" class=\"btn btn-default\" disabled.bind=\"isFetching\">\n      ${isFetching ? 'Signing in...' : 'Sign in'}\n    </button>\n  </form>\n</template>\n"; });
define('text!dashboard/index/index.html', ['module'], function(module) { module.exports = "<template>\n  <h1>Dashboard index</h1>\n</template>\n"; });
define('text!dashboard/orgs-create/orgs-create.html', ['module'], function(module) { module.exports = "<template>\n  <ol class=\"breadcrumb\">\n    <li><a route-href=\"route: d-orgs-list\">Organisations</a></li>\n    <li class=\"active\">Create</li>\n  </ol>\n\n  <div class=\"row toolbar\">\n    <div class=\"col-md-8 toolbar__header\">\n      <h2>Create organisation</h2>\n    </div>\n    <div class=\"col-md-4 toolbar__buttons\">\n      <button click.delegate=\"create()\" class=\"btn btn-primary\">Submit</button>\n      <a route-href=\"route: d-orgs-list\" class=\"btn btn-default\">Cancel</a>\n    </div>\n  </div>\n\n  <compose view=\"./../orgs-show/orgs-form.html\"></compose>\n</template>\n"; });
define('text!dashboard/orgs-show/orgs-form.html', ['module'], function(module) { module.exports = "<template>\n  <form>\n    <div class=\"row\">\n      <div class=\"col-md-4\">\n        <fieldset>\n          <legend>General</legend>\n          <div class=\"form-group ${errors.name ? 'has-error' : ''}\">\n            <label for=\"name\" class=\"control-label\">Name</label>\n            <input type=\"text\" class=\"form-control\" id=\"name\" placeholder=\"Name\" value.bind=\"input.name\">\n          </div>\n          <div class=\"form-group ${errors.mailAddress ? 'has-error' : ''}\">\n            <label for=\"mailAddress\" class=\"control-label\">Email address</label>\n            <input type=\"email\" class=\"form-control\" id=\"mailAddress\" placeholder=\"Email address\" value.bind=\"input.mailAddress\">\n            <span if.bind=\"errors.mailAddress == 'Conflict'\" class=\"help-block\">Email address already in use.</span>\n          </div>\n          <div class=\"form-group ${errors.category ? 'has-error' : ''}\">\n            <label for=\"category\" class=\"control-label\">Category</label>\n            <select class=\"form-control\" id=\"category\" placeholder=\"Category\" value.bind=\"input.category\">\n              <option>université</option>\n              <option>bibliothéque</option>\n            </select>\n          </div>\n        </fieldset>\n      </div>\n      <div class=\"col-md-4\">\n        <fieldset>\n          <legend>Address</legend>\n          <div class=\"form-group ${errors['address.street1'] ? 'has-error' : ''}\">\n            <label for=\"address.street1\" class=\"control-label\">Street 1</label>\n            <input type=\"text\" class=\"form-control\" id=\"address.street1\" placeholder=\"Name\" value.bind=\"input.address.street1\" place-autocomplete=\"target.bind: input;\">\n          </div>\n          <div class=\"form-group ${errors['address.street2'] ? 'has-error' : ''}\">\n            <label for=\"address.street2\" class=\"control-label\">Street 2</label>\n            <input type=\"text\" class=\"form-control\" id=\"address.street2\" placeholder=\"Name\" value.bind=\"input.address.street2\">\n          </div>\n          <div class=\"form-group ${errors['address.postalCode'] ? 'has-error' : ''}\">\n            <label for=\"address.postalCode\" class=\"control-label\">Postal code</label>\n            <input type=\"text\" class=\"form-control\" id=\"address.postalCode\" placeholder=\"Name\" value.bind=\"input.address.postalCode\">\n          </div>\n          <div class=\"form-group ${errors['address.locality'] ? 'has-error' : ''}\">\n            <label for=\"address.locality\" class=\"control-label\">Locality</label>\n            <input type=\"text\" class=\"form-control\" id=\"address.locality\" placeholder=\"Name\" value.bind=\"input.address.locality\">\n          </div>\n          <div class=\"form-group ${errors['address.country'] ? 'has-error' : ''}\">\n            <label for=\"address.country\" class=\"control-label\">Country</label>\n            <input type=\"text\" class=\"form-control\" id=\"address.country\" placeholder=\"Name\" value.bind=\"input.address.country\">\n          </div>\n        </fieldset>\n      </div>\n      <div class=\"col-md-4\">\n        <fieldset>\n          <legend>Contact</legend>\n          <div class=\"form-group ${errors['contact.name'] ? 'has-error' : ''}\">\n            <label for=\"contact.name\" class=\"control-label\">Name</label>\n            <input type=\"text\" class=\"form-control\" id=\"contact.name\" placeholder=\"Name\" value.bind=\"input.contact.name\">\n          </div>\n          <div class=\"form-group ${errors['contact.mailAddress'] ? 'has-error' : ''}\">\n            <label for=\"contact.mailAddress\" class=\"control-label\">Email address</label>\n            <input type=\"email\" class=\"form-control\" id=\"contact.mailAddress\" placeholder=\"Email address\" value.bind=\"input.contact.mailAddress\">\n          </div>\n          <div class=\"form-group ${errors['contact.phoneNumber'] ? 'has-error' : ''}\">\n            <label for=\"contact.phoneNumber\" class=\"control-label\">Phone number</label>\n            <input type=\"text\" class=\"form-control\" id=\"contact.phoneNumber\" placeholder=\"Phone number\" value.bind=\"input.contact.phoneNumber\">\n          </div>\n        </fieldset>\n      </div>\n    </div>\n  </form>\n</template>\n"; });
define('text!dashboard/orgs-show/orgs-show.html', ['module'], function(module) { module.exports = "<template>\n  <ol class=\"breadcrumb\">\n    <li><a route-href=\"route: d-orgs-list\">Organisations</a></li>\n    <li class=\"active\">${org.name}</li>\n  </ol>\n\n  <div class=\"row toolbar\">\n    <div class=\"col-md-8 toolbar__header\">\n      <h2>${org.name}</h2>\n    </div>\n    <div class=\"col-md-4 toolbar__buttons\">\n      <!-- Not editing -->\n      <button if.bind=\"!isEditing\" click.delegate=\"startEdit()\" class=\"btn btn-default\">Edit</button>\n      <a if.bind=\"!isEditing\" href=\"http://www2.cpafrance.fr/?ak=${orgAccessKey}\" target=\"_blank\" class=\"btn btn-default\">View as organisation</a>\n      <button if.bind=\"!isEditing\" click.delegate=\"delete()\" class=\"btn btn-danger\">Delete</button>\n\n      <!-- Editing -->\n      <button if.bind=\"isEditing\" click.delegate=\"update()\" class=\"btn btn-primary\">Update</button>\n      <button if.bind=\"isEditing\" click.delegate=\"cancelEdit()\" class=\"btn btn-default\">Cancel</button>\n    </div>\n  </div>\n\n  <div if.bind=\"!isEditing\">\n    <div class=\"row\">\n      <div class=\"col-md-4\">\n        <fieldset>\n          <legend>General</legend>\n          <div class=\"form-group\">\n            <label class=\"control-label\">Name</label>\n            <div>${org.name}</div>\n          </div>\n          <div class=\"form-group\">\n            <label class=\"control-label\">Email address</label>\n            <div>${org.mailAddress}</div>\n          </div>\n          <div class=\"form-group\">\n            <label class=\"control-label\">Category</label>\n            <div>${org.category}</div>\n          </div>\n        </fieldset>\n      </div>\n      <div class=\"col-md-4\">\n        <fieldset>\n          <legend>Address</legend>\n          <div class=\"form-group\">\n            <label class=\"control-label\">Street 1</label>\n            <div>${org.address.street1 || '/'}</div>\n          </div>\n          <div class=\"form-group\">\n            <label class=\"control-label\">Street 2</label>\n            <div>${org.address.street2 || '/'}</div>\n          </div>\n          <div class=\"form-group\">\n            <label class=\"control-label\">Postal code</label>\n            <div>${org.address.postalCode}</div>\n          </div>\n          <div class=\"form-group\">\n            <label class=\"control-label\">Locality</label>\n            <div>${org.address.locality}</div>\n          </div>\n          <div class=\"form-group\">\n            <label class=\"control-label\">Country</label>\n            <div>${org.address.country || '/'}</div>\n          </div>\n        </fieldset>\n      </div>\n      <div class=\"col-md-4\">\n        <fieldset>\n          <legend>Contact</legend>\n          <div class=\"form-group\">\n            <label class=\"control-label\">Name</label>\n            <div>${org.contact.name}</div>\n          </div>\n          <div class=\"form-group\">\n            <label class=\"control-label\">Email address</label>\n            <div>${org.contact.mailAddress}</div>\n          </div>\n          <div class=\"form-group\">\n            <label class=\"control-label\">Phone number</label>\n            <div>${org.contact.phoneNumber || '/'}</div>\n          </div>\n        </fieldset>\n      </div>\n    </div>\n  </div>\n\n  <div if.bind=\"isEditing\">\n    <compose view=\"./orgs-form.html\"></compose>\n  </div>\n</template>\n"; });
define('text!dashboard/orgs-list/orgs-list.html', ['module'], function(module) { module.exports = "<template>\n  <ol class=\"breadcrumb\">\n    <li class=\"active\">Organisations</li>\n  </ol>\n  <div class=\"row toolbar\">\n    <div class=\"col-md-8 toolbar__header\">\n      <h2 click.delegate=\"foo()\">Organisations</h2>\n    </div>\n    <div class=\"col-md-4 toolbar__buttons\">\n      <a class=\"btn btn-default\" route-href=\"route: d-orgs-create\">Create</a>\n    </div>\n  </div>\n\n  <table class=\"table\">\n    <thead>\n      <tr>\n        <th>#</th>\n        <th>Name</th>\n      </tr>\n    </thead>\n    <tbody>\n      <tr repeat.for=\"org of organisations\">\n        <td width=\"50\">${org.id}</td>\n        <td>\n          <a route-href=\"route: d-orgs-show; params.bind: {id: org.id}\">${org.name}</a>\n        </td>\n      </tr>\n    </tbody>\n  </table>\n</template>\n"; });
//# sourceMappingURL=app-bundle.js.map