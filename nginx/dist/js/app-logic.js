(function () {
	'use strict';

	var riskMarket = angular.module('riskMarket', [
		// Templates cache

		'riskMarket.templates',

		'ui.bootstrap',

		'ngAnimate',

		'publicNavigation',

		'ui.mask',

		'mainPage',

		'registry',

		'utils',

		'ngCookies',

		'ngRoute',

		'searchResults',

		'orderPrepare',

		'orderPayment',

		'orderResult',

		'privateOffice',

		'ngSanitize',

		'adminMonitor',

		'innerPages',

		'partner',

		'partnerLogin',

		'publicFooter',

		'comparePolicies'
	]);

	riskMarket.config([
		'$routeProvider',

		'$logProvider',

		'$locationProvider',

		'DEBUG',

		'ROUTES',

		'STRUCTURE',

		'MODULES',

		'PATH_SEPARATOR',

		'REST_API',

		'$httpProvider',

		'$sceDelegateProvider',

		'BUSINESS_ENTITIES',

		'currenciesSumProvider',

		'insuranceCalculationProvider',

		'orderManagerProvider',

		'countriesProvider',

		'riskOptionsProvider',

		'riskFiltersProvider',

		'soldItemsProvider',

		'USER_ROLES',

		'USER_TYPES',

		'HTTP_HEADERS',

		'insuranceCompaniesProvider',

		'assistanceCompaniesProvider',

		'insuredDaysProvider',

		'policiesManagerProvider',

		'insuranceTypesProvider',

		'$animateProvider',

		'ANIMATED_CLASSES',

		function (
				$routeProvider,

				$logProvider,

				$locationProvider,

				DEBUG,

				ROUTES,

				STRUCTURE,

				MODULES,

				PATH_SEPARATOR,

				REST_API,

				$httpProvider,

				$sceDelegateProvider,

				BUSINESS_ENTITIES,

				currenciesSumProvider,

				insuranceCalculationProvider,

				orderManagerProvider,

				countriesProvider,

				riskOptionsProvider,

				riskFiltersProvider,

				soldItemsProvider,

				USER_ROLES,

				USER_TYPES,

				HTTP_HEADERS,

				insuranceCompaniesProvider,

				assistanceCompaniesProvider,

				insuredDaysProvider,

				policiesManagerProvider,

				insuranceTypesProvider,

		    $animateProvider,

				ANIMATED_CLASSES
		) {
			// Log mode

			$logProvider.debugEnabled(DEBUG.LOG_MODE_ENABLED);

			// URL white list

			$sceDelegateProvider.resourceUrlWhitelist([
				'https://demomoney.yandex.ru/eshop.xml',

				'https://money.yandex.ru/eshop.xml',

				'self',

				'https://riskmarket-dev.ru/order-done',

				'https://riskmarket-dev.ru/order-fail',

				'http://test.riskmarket.ru/order-done',

				'http://test.riskmarket.ru/order-fail'
			]);
			
			$httpProvider.defaults.headers.common[HTTP_HEADERS.ACCEPT] = HTTP_HEADERS.ACCEPT.JSON;

			// Configure dataSource for riskFiltersProvider

			riskFiltersProvider.dataSource = REST_API.RISK_FILTERS;

			// Configure dataSource for riskOptionsProvider

			riskOptionsProvider.dataSource = REST_API.RISK_OPTIONS;

			// Configure dataSource for insuranceCalculationProvider

			insuranceCalculationProvider.dataSource = REST_API.INSURANCE_CALCULATOR;

		  // Configure dataSource for soldItemsProvider

		  soldItemsProvider.dataSource = REST_API.ADMIN_MONITOR;

			// Configure dataSource for insuranceCalculationProvider

			insuranceCalculationProvider.dataSource = REST_API.INSURANCE_CALCULATOR;

			// Push remember-me interceptor
			$httpProvider.interceptors.push('rememberMeInterceptor');

			// Configure countries provider

			countriesProvider.dataSource = REST_API.COUNTRIES_LIST;

			countriesProvider.compareBy = 'nameRus';

			// Configure orderManagerProvider

			orderManagerProvider.draftPersistenceDestination = REST_API.ORDER_DRAFT;

			orderManagerProvider.orderPurchaseDestination = REST_API.ORDER_PURCHASE;

			orderManagerProvider.acceptanceDestination = REST_API.PAYMENT_PROCESS_STARTED;

			orderManagerProvider.draftCreationDestination = REST_API.DRAFT_CREATE;

			// Configure dataSource for insuranceCalculationProvider

			insuranceCalculationProvider.dataSource = REST_API.INSURANCE_CALCULATOR;

			// Configure dataSource for currenciesSumProvider

			currenciesSumProvider.dataSource = REST_API.CURRENCIES_SUM;

			// Configure dataSource for insuranceCompaniesProvider

			insuranceCompaniesProvider.dataSource = REST_API.INSURANCE_COMPANIES;

			// Configure dataSource for insuranceCompaniesProvider

			assistanceCompaniesProvider.dataSource = REST_API.ASSISTANCE_COMPANIES;

			// Configure dataSource for insuranceDaysProvider

			insuredDaysProvider.dataSource = REST_API.INSURED_DAYS;

			// Configure policies manager provider

			policiesManagerProvider.dataSource = REST_API.PRIVATE_OFFICE.POLICIES_LIST;
			
			policiesManagerProvider.removeEntityEndpoint = REST_API.PRIVATE_OFFICE.REMOVE_POLICY;

			// Configure insurance types provider

			insuranceTypesProvider.dataSource = REST_API.INSURANCE_TYPES;

			// Configure animate provider

			$animateProvider.classNameFilter(new RegExp(ANIMATED_CLASSES.join('|'), 'i'));

			// Configure locationProvider for using html5mode

			$locationProvider.html5Mode(true);

			var userStateCheck = function(userAuth, $q) {
				return userAuth.updateAuthState().then(angular.noop, function(error) {
					return $q.reject(error);
				});
			};

			var rememberMeCheck = ['userAuth', '$q', function (userAuth, $q) {
				return userStateCheck(userAuth, $q);
			}];
			
			var riskOptionsPrefetch = ['riskOptions', '$q', function(riskOptions, $q) {
				return riskOptions.getList()

				.then(function(result) {
					return result;
				}, function(error) {
					return $q.reject(error);
				});
			}];

			var countriesPrefetch = ['countries', '$q', function(countries, $q) {
				return countries.getList().then(function(countriesList) {
					return countriesList;
				}, function(error) {
					return $q.reject(error);
				});
			}];

			var partnerCheck = ['userAuth', '$q', function (userAuth, $q) {
				return userStateCheck(userAuth, $q)['finally'](function() {
					var currentUser = userAuth.getCurrentUser();

					var promise;

					if( !currentUser.value ) {
						promise = $q.reject();
					} else {
						var deferred = $q.defer();

						if( currentUser.value.userType === USER_TYPES.PARTNER ) {
							deferred.resolve(true);
						} else {
							deferred.reject();
						}

						promise = deferred.promise;
					}

					return promise;
				});
			}];

      $routeProvider
				.when(ROUTES.MAIN_PAGE, {
					resolve: {
						load : rememberMeCheck,

						countries: countriesPrefetch
					},

					templateUrl: [STRUCTURE.MODULES, MODULES.MAIN_PAGE.FOLDER, STRUCTURE.TEMPLATES, MODULES.MAIN_PAGE.TEMPLATES.MAIN_PAGE].join(PATH_SEPARATOR),

					controller: MODULES.MAIN_PAGE.CONTROLLERS.MAIN_PAGE,

					businessEntity: BUSINESS_ENTITIES.MAIN_PAGE
				})

				.when(ROUTES.ABOUT, {
					resolve: {
						load : rememberMeCheck
					},
					templateUrl: [STRUCTURE.MODULES, MODULES.INNER_PAGES.FOLDER, STRUCTURE.TEMPLATES, MODULES.INNER_PAGES.TEMPLATES.ABOUT_SERVICE_PAGE].join(PATH_SEPARATOR),

					businessEntity: BUSINESS_ENTITIES.ABOUT_PAGE
				})

				.when(ROUTES.SEARCH_RESULTS, {
					resolve: {
						load : rememberMeCheck,

						riskOptions: riskOptionsPrefetch,

						countries: countriesPrefetch
					},
					templateUrl: [STRUCTURE.MODULES, MODULES.SEARCH_RESULTS.FOLDER, STRUCTURE.TEMPLATES, MODULES.SEARCH_RESULTS.TEMPLATES.SEARCH_RESULTS].join(PATH_SEPARATOR),

					controller: MODULES.SEARCH_RESULTS.CONTROLLERS.SEARCH_RESULTS,

					businessEntity: BUSINESS_ENTITIES.SEARCH_RESULTS
				})

				.when(ROUTES.ORDER_PREPARE, {
					resolve: {
						load : rememberMeCheck,

						riskOptions: riskOptionsPrefetch
					},

					templateUrl: [STRUCTURE.MODULES, MODULES.ORDER_PREPARE.FOLDER, STRUCTURE.TEMPLATES, MODULES.ORDER_PREPARE.TEMPLATES.ORDER_PREPARE].join(PATH_SEPARATOR),

					controller: MODULES.ORDER_PREPARE.CONTROLLERS.ORDER_PREPARE,

					businessEntity: BUSINESS_ENTITIES.ORDER_PREPARE
				})

				.when(ROUTES.ORDER_PAYMENT, {
					resolve: {
						load : rememberMeCheck,

						riskOptions: riskOptionsPrefetch
					},

					templateUrl: [STRUCTURE.MODULES, MODULES.ORDER_PAYMENT.FOLDER, STRUCTURE.TEMPLATES, MODULES.ORDER_PAYMENT.TEMPLATES.ORDER_PAYMENT].join(PATH_SEPARATOR),

					controller: MODULES.ORDER_PAYMENT.CONTROLLERS.ORDER_PAYMENT,

					businessEntity: BUSINESS_ENTITIES.ORDER_PAYMENT
				})

				.when(ROUTES.ORDER_DONE, {
					resolve: {
						load : rememberMeCheck
					},

					templateUrl: [STRUCTURE.MODULES, MODULES.ORDER_RESULT.FOLDER, STRUCTURE.TEMPLATES, MODULES.ORDER_RESULT.TEMPLATES.ORDER_DONE].join(PATH_SEPARATOR),

					controller: MODULES.ORDER_RESULT.CONTROLLERS.ORDER_DONE,

					businessEntity: BUSINESS_ENTITIES.ORDER_DONE
				})

				.when(ROUTES.ORDER_FAIL, {
					resolve: {
						load : rememberMeCheck
					},

					templateUrl: [STRUCTURE.MODULES, MODULES.ORDER_RESULT.FOLDER, STRUCTURE.TEMPLATES, MODULES.ORDER_RESULT.TEMPLATES.ORDER_FAIL].join(PATH_SEPARATOR),

					controller: MODULES.ORDER_RESULT.CONTROLLERS.ORDER_FAIL
				})

				.when(ROUTES.PRIVATE_OFFICE, {
					resolve: {
						load : rememberMeCheck,

						riskOptions: riskOptionsPrefetch
					},
					templateUrl: [STRUCTURE.MODULES, MODULES.PRIVATE_OFFICE.FOLDER, STRUCTURE.TEMPLATES, MODULES.PRIVATE_OFFICE.TEMPLATES.PRIVATE_OFFICE].join(PATH_SEPARATOR),

					controller: MODULES.PRIVATE_OFFICE.CONTROLLERS.PRIVATE_OFFICE,

					businessEntity: BUSINESS_ENTITIES.PRIVATE_OFFICE
				})

				.when(ROUTES.ADMIN_MONITOR, {
					resolve: {
						load_admin : ['userAuth', '$q', function(userAuth, $q) {
							return userStateCheck(userAuth, $q)['finally'](function() {
								var currentUser = userAuth.getCurrentUser();

								if( !currentUser.value || currentUser.value.roles.indexOf(USER_ROLES.ADMIN) === -1) {
									return $q.reject('User have no rights');
								}

								return true;
							});
						}]

					},

					templateUrl: [STRUCTURE.MODULES, MODULES.ADMIN_MONITOR.FOLDER, STRUCTURE.TEMPLATES, MODULES.ADMIN_MONITOR.TEMPLATES.ADMIN_MONITOR].join(PATH_SEPARATOR),

					controller: MODULES.ADMIN_MONITOR.CONTROLLERS.ADMIN_MONITOR
				})

				.when(ROUTES.CONTACTS, {
					resolve: {
						load : rememberMeCheck
					},

					templateUrl: [STRUCTURE.MODULES, MODULES.INNER_PAGES.FOLDER, STRUCTURE.TEMPLATES, MODULES.INNER_PAGES.TEMPLATES.CONTACTS_PAGE].join(PATH_SEPARATOR),

					businessEntity: BUSINESS_ENTITIES.CONTACTS_PAGE
				})

				.when(ROUTES.TERMS, {
					resolve: {
						load : rememberMeCheck

					},

					name: 'TERMS_PAGE',

					templateUrl: [STRUCTURE.MODULES, MODULES.INNER_PAGES.FOLDER, STRUCTURE.TEMPLATES, MODULES.INNER_PAGES.TEMPLATES.TERMS_PAGE].join(PATH_SEPARATOR),

					businessEntity: BUSINESS_ENTITIES.TERMS_PAGE
				})

	      .when(ROUTES.PARTNER, {
		      resolve: {
			      partner: partnerCheck
		      },

		      templateUrl: [STRUCTURE.MODULES, MODULES.PARTNER.FOLDER, STRUCTURE.TEMPLATES, MODULES.PARTNER.TEMPLATES.PARTNER_TRADES].join(PATH_SEPARATOR),

		      controller: MODULES.PARTNER.CONTROLLERS.PARTNER_CONTROLLER,

		      businessEntity: BUSINESS_ENTITIES.PARTNER
	      })

	      .when(ROUTES.PARTNER_LOGIN, {
		      resolve: {
			      load : rememberMeCheck
		      },

		      templateUrl: [STRUCTURE.MODULES, MODULES.PARTNER_LOGIN.FOLDER, STRUCTURE.TEMPLATES, MODULES.PARTNER_LOGIN.TEMPLATES.PARTNER_LOGIN].join(PATH_SEPARATOR),

		      controller: MODULES.PARTNER_LOGIN.CONTROLLERS.PARTNER_LOGIN,

		      businessEntity: BUSINESS_ENTITIES.PARTNER_LOGIN
	      })

	      .when(ROUTES.COMPARE_POLICIES, {
		      resolve: {
			      load : rememberMeCheck
		      },

		      templateUrl: [STRUCTURE.MODULES, MODULES.COMPARE_POLICIES.FOLDER, STRUCTURE.TEMPLATES, MODULES.COMPARE_POLICIES.TEMPLATES.COMPARE_POLICIES].join(PATH_SEPARATOR),

		      controller: MODULES.COMPARE_POLICIES.CONTROLLERS.COMPARE_POLICIES,

		      businessEntity: BUSINESS_ENTITIES.COMPARE_POLICIES
	      })

				.otherwise({
					redirectTo: ROUTES.MAIN_PAGE
				});
		}]
	);

	riskMarket.run([
		'$rootScope',

		'EVENTS',

		'UX',

		'pageScroll',

		'$log',

		'$location',

		'PAGE_META',

		'$route',

		'BUSINESS_ENTITIES',

		'USER_TYPES',

		'userAuth',

		'manageLocation',

		'ROUTES',

		'ANALYTICS',

		'$window',

		'$document',

		'TRUSTED_ORIGINS',
		
		'DEFAULT_PARTNER',

		'dataStorage',

		'frameManager',

		function (
				$rootScope,

				EVENTS,

				UX,

				pageScroll,

				$log,

				$location,

				PAGE_META,

				$route,

				BUSINESS_ENTITIES,

		    USER_TYPES,

				userAuth,

				manageLocation,

		    ROUTES,

				ANALYTICS,

		    $window,

		    $document,

				TRUSTED_ORIGINS,

				DEFAULT_PARTNER,

				dataStorage,

		    frameManager
		) {
			$rootScope.$on(EVENTS.LOCATION.CHANGE_START, function(e) {
				var defaultLocation = ROUTES.SEARCH_RESULTS;

				var forbiddenPaths = [
					ROUTES.MAIN_PAGE,

					ROUTES.ABOUT,

					ROUTES.CONTACTS,

					ROUTES.TERMS,

					ROUTES.PARTNER,

					ROUTES.PARTNER_LOGIN,

					ROUTES.ADMIN_MONITOR,

					ROUTES.PRIVATE_OFFICE
				];

				if( $rootScope.appInFrameMode ) {
					if( _.includes(forbiddenPaths , $location.path()) ) {
						e.preventDefault();

						manageLocation.redirect(defaultLocation);
					}
				}
			});

			$rootScope.$on(EVENTS.ROUTE.CHANGE_SUCCESS, function() {
				// Update page title

				var currentBusinessEntity = $route.current.businessEntity;

				var pageName = _.findKey(BUSINESS_ENTITIES, function(businessEntity) {
					return businessEntity === currentBusinessEntity;
				});

				$rootScope.pageTitle = (PAGE_META[pageName] || PAGE_META.DEFAULT).TITLE;

				var unscrolledPage = BUSINESS_ENTITIES.ORDER_PAYMENT;

				// Scroll to the top of the page

				if( !$rootScope.appInFrameMode && BUSINESS_ENTITIES[pageName] !== unscrolledPage ) {
					pageScroll.scrollTo({
						animationTime: UX.SCROLLING.TIME,

						easing: UX.SCROLLING.EASING,

						scrollTo: UX.SCROLLING.DEFAULT_TOP_SCROLLING
					});
				}

				// Update partner info

				var cachedParnterId = dataStorage.getData('partnerId');

				if( !_.isString(cachedParnterId) ) {
					dataStorage.setData('partnerId', $location.search().partnerId || DEFAULT_PARTNER);
				}

				// Send data to the analytic system about current page

				var pageHitParams = {
					title: $document.prop('title'),

					referer: $document.prop('referrer'),

					callback: function() {
						$log.info('Page hit was successfully send to Yandex metrika: ', pageHitParams);
					}
				};

				var analytic = $window[ANALYTICS.YANDEX_METRIKA.COUNTER];

				if( analytic && typeof analytic.hit === 'function' ) {
					analytic.hit($location.absUrl(), pageHitParams);
				} else {
					$log.warn('Can not send information about changed route to tracking system');
				}
			});

			/**
			 * Checks whether current page is partner login form
			 * @returns {Boolean} positive or negative result of check
			 */

			$rootScope.isPartnerLoginPage = function() {
				return manageLocation.isCurrentLocation(ROUTES.PARTNER_LOGIN);
			};

			/**
			 * Checks whether current page is partner cabinet
			 * @returns {Boolean} positive or negative result of check
			 */

			$rootScope.isPartnerCabinetPage = function() {
				return manageLocation.isCurrentLocation(ROUTES.PARTNER);
			};

			/**
			 * Checks whether current page is a main page
			 * @returns {Boolean} positive or negative result of check
			 */

			$rootScope.isMainPage = function() {
				return manageLocation.isCurrentLocation(ROUTES.MAIN_PAGE);
			};

			/**
			 * If route change failed, then redirect user
			 * to the main page
			 */

			$rootScope.$on(EVENTS.ROUTE.CHANGE_ERROR, function() {
				$location.path(ROUTES.MAIN_PAGE);
			});

			/**
			 * Handles user logout event.
			 * In case if he / she land up on some page which isn't for public user,
			 * then we have to redirect user to main page.
			 * In case if he/ she is on the partner's cabinet page (you can stay there only if you
			 * was authorized), then we have to redirect user to the partner login page.
			 */

			$rootScope.$on(EVENTS.USER_ACTIONS.LOGOUT, function() {
				if( $rootScope.isPartnerCabinetPage() ) {
					$log.debug('Redirecting to the partner login page');

					$location.path(ROUTES.PARTNER_LOGIN);
				} else {
					var privilegedPaths = [
						ROUTES.ORDER_PREPARE,

						ROUTES.ADMIN_MONITOR,

						ROUTES.ORDER_PAYMENT,

						ROUTES.PRIVATE_OFFICE
					];

					if( privilegedPaths.indexOf($location.path()) !== -1 ) {
						$location.path(ROUTES.MAIN_PAGE);
					}
				}

				$log.debug('User is now logout');
			});

			$rootScope.routes = ROUTES;

			$rootScope.appInFrameMode = frameManager.isAppInFrameMode();

			if( $rootScope.appInFrameMode ) {
				$rootScope.currentPartner = {};

				$window.top.postMessage({request: 'PARTNER_ID'}, '*');

				var trustedOrigins = _.values(TRUSTED_ORIGINS);

				$window.addEventListener(EVENTS.WINDOW.MESSAGE, function(event) {
          if( _.includes(trustedOrigins, event.origin) && event.data.subject === 'partnerId' ) {
						$log.debug('Receiving response from trusted origin "' + event.origin + '". Setting partner id to: ' + event.data.value);

						$rootScope.currentPartner.id = event.data.value;

						dataStorage.setData('partnerId', event.data.value);
					} else {
						$log.warn('Message event was received from untrusted origin "' + event.origin + '". Doing nothing');
					}
				});

			}

			/**
			 * Erases partner id, when user closes either browser tab, or browser itself (only one handler per whole application)
			 */

			$window[EVENTS.WINDOW.ONBEFOREONLOAD] = function() {
				dataStorage.removeData('partnerId');
			};
		}
	]);
})();;
(function() {
    'use strict';

    angular.module('mainPage', ['registry']);


})();;
(function () {
  'use strict';

  var riskMarket = angular.module('riskMarket');

  riskMarket.controller('MainPageController', [
	'$scope',

	'$log',

	'$location',

	'$dateParser',

	'ROUTES',

	'CACHE_ITEMS',

	'DATE_FORMAT',

  // Countries is a list of already loaded countries

	'countries',

	'SELECTABLE_ITEMS',

	'TEXT_LABELS',

  'orderManager',

	'EVENTS',

	function (
		$scope,

		$log,

		$location,

		$dateParser,

		ROUTES,

		CACHE_ITEMS,

		DATE_FORMAT,

		countries,

		SELECTABLE_ITEMS,

		TEXT_LABELS,

		orderManager,

	  EVENTS
	) {
		var mainPageController = this;

	  $scope.selectableItems = SELECTABLE_ITEMS;

	  $scope.textLabels = TEXT_LABELS;

		$scope.isParticipantWarningHidden = true;

		$scope.countries = countries;

	  /**
	   * Redirects user to the calculation results
	   */

	  $scope.showSearchResults = function () {
			mainPageController.saveFormPreview($scope.formData);

			$location.path(ROUTES.SEARCH_RESULTS);
	  };

	  /**
	   * Stores insurance choices and criteria to the local storage
		 * @param {Object} formData form data
	   */

	  this.saveFormPreview = function(formData) {
			var formSnapshot = angular.copy(formData);

			// Remove all invalid passengers and passengers with undefined birth date

			_.remove(formSnapshot.passengers, function(passenger) {
				return !passenger.birthDate || !passenger.isValid;
			});

		  orderManager.storeInsuranceParams(formSnapshot);
	  };


	  // Trip form data is empty by default
	  $scope.formData = {
			country: [],

			passengers: [],

			period: {
				'start-date': '',

				'end-date': ''
			}
	  };

		$scope.submitAttempt = false;

	  $scope.validation = {
			period: false,

			passengers: false
	  };

	  $scope.events = {
			checkFormData: function (data) {
			  return data.country.length
				  && $scope.validation.period
				  && data.passengers.length
				  && $scope.validation.passengers;
			},

		  submitForm: function (data) {
			  $scope.submitAttempt = true;

				if($scope.events.checkFormData(data)) {
				  $scope.showSearchResults();
			  }
		  }
	  };

		var cancelParicipantsDataListener = $scope.$on(EVENTS.PARTICIPANTS_CONTROL.PASS_DATA, function(event, state) {
			$scope.isParticipantWarningHidden = state;
		});

		var cancelScopeDestroyListener = $scope.$on(EVENTS.SCOPE.DESTROY, function () {
			cancelParicipantsDataListener();

			cancelScopeDestroyListener();
		});

	}]);
})();;
(function() {
    'use strict';

    angular.module('innerPages', ['registry']);
})();
;
(function() {
	'use strict';
	
	var searchResults = angular.module('searchResults', []);
})();;
(function () {
	'use strict';

	var searchResults = angular.module('searchResults');

	searchResults.controller('SearchResultsController', [
		'$scope',

		'insuranceCalculation',

		// Risk options are loaded already by the moment of loading search results view

		'riskOptions',

		'$log',

		'EVENTS',

		'CACHE_ITEMS',

		'REST_API',

		'$filter',

    'pageScroll',

    'UX',

		'orderManager',

		'$rootScope',

		'dataStorage',

		'COMPARE_ITEMS',

		'countries',

		function (
				$scope,

				insuranceCalculation,

				riskOptions,

				$log,

				EVENTS,

				CACHE_ITEMS,

				REST_API,

				$filter,

        pageScroll,

        UX,

		    orderManager,

		    $rootScope,

		    dataStorage,

				COMPARE_ITEMS,

		    countries
		) {
			var searchResultsController = this;

			$scope.countries = countries;

			$scope.riskOptions = riskOptions;

			$scope.allowDisplayFilterInFrame = !$rootScope.appInFrameMode;

			/**
			 * Helper method for storing insurance params in local storage
			 * @param {Object} data data which should be saved
			 */

			$scope.cacheInsuranceParams = function(data) {
				orderManager.storeInsuranceParams(data);
			};

			/**
			 * Helper method for fetching insurance parameters
			 * @returns {Object} result cached insurance parameters
			 */

			$scope.fetchInsuranceParams = function() {
				/*
				 * If there is no insuranceParams in local storage, then create a dummy skeleton and write it to the localStorage
				 * passing true as an argument returns raw json
				 */

				var insuranceParams = orderManager.getInsuranceParams();

				if( _.isEmpty(insuranceParams) ) {
					insuranceParams = {
						passengers: [],

						period: {
							'start-date': '',

							'end-date': ''
						},

						country: [],

						riskOptions: riskOptions,

						countries: countries
					};

					$scope.cacheInsuranceParams(insuranceParams);
				} else {
					insuranceParams.riskOptions = riskOptions;

					insuranceParams.countries = countries;
				}

				return insuranceParams;
			};

			// Fetch user choice from a previous step (trip-form)

			$scope.insuranceParams = $scope.fetchInsuranceParams();

			// Initialize results filter

			$scope.insuranceParams.resultsFilter = null;

      /**
       * Resets filter params
       */

      this.resetFilter = function() {
        $scope.insuranceParams.resultsFilter = {
          calculationDataInput: {
            // Policy type

            travelData: {
              period: {
                multi: undefined,

                insuredDays: undefined
              }
            },

            // Insurance sum

            riskAliasMap: {
              MEDICAL_EXPENSES: {
                risk: {
                  sumInsured: undefined
                },

                subRisks: {
                  EXTRA_DENTAL_TREATMENT: {
                    riskStatus: undefined
                  },

                  THIRD_PARTY_VISIT: {
                    riskStatus: undefined
                  },

                  PRESCHEDULE_RETURN: {
                    riskStatus: undefined
                  },

                  TRANSPORT_EXPENSES: {
                    riskStatus: undefined
                  },

                  BRING_CHILDREN_BACK_HOME: {
                    riskStatus: undefined
                  },

                  LEGAL_HELP: {
                    riskStatus: undefined
                  },

                  LOST_OR_STOLEN_DOCUMENTS: {
                    riskStatus: undefined
                  }
                }
              },

              BROKEN_CAR: {
                riskStatus: undefined
              },

              FLIGHT_DELAY: {
                riskStatus: undefined
              }
            },

            // Policy currency

            currency: undefined
          },

          insuranceCompany: {
            companyName: undefined,

            registeredService: undefined
          },

          serviceCompany: {
            companyName: undefined,

            companyCode: undefined
          }
        };
      };

      this.resetFilter();

      $scope.sortData = {
	      resultsOrder: null
      };

			/**
			 * Resets compared items list
			 */

			this.resetComparedItems = function() {
				dataStorage.setData(CACHE_ITEMS.COMPARED_POLICIES, angular.toJson([]));

				$scope.comparedItems = [];

				$scope.$broadcast(EVENTS.SEARCH_RESULT_ITEM.UPDATE_COMPARED_ITEMS, 0);
			};

      /**
       * Resets soring value and order
       */

      this.resetSorting = function() {
        $scope.sortData.resultsOrder = {
          prop: undefined,

          direction: undefined
        };
      };

      this.resetSorting();

      /**
       * Compares previous filtering related object with current and delegates
       * page scrolling to ux service in case of any differences between new object's
       * version and the previous one.
       * @param {Object} newValue object's new value
       * @param {Object} oldValue object's old value
       */

      this.filterParamsWatcher = function(newValue, oldValue) {
        if( newValue !== oldValue ) {
          // Move params to constants

          pageScroll.scrollTo({
            scrollTo: UX.SCROLLING.DEFAULT_TOP_SCROLLING,

            animationTime: UX.SCROLLING.AUTO_SCROLLING_DURATION_ON_SEARCH_RESULT_PAGE
          });
        }
      };

      var cancelFilterParamsWatch = $scope.$watch('insuranceParams.resultsFilter', this.filterParamsWatcher, true);

      var cancelSortParamsWatch = $scope.$watch('sortData.resultsOrder', this.filterParamsWatcher, true);

      $scope.$on(EVENTS.SCOPE.DESTROY, function() {
        cancelFilterParamsWatch();

        cancelSortParamsWatch();
      });

			// Initialize results order

			$scope.insuranceParams.resultsOrder = undefined;

			$scope.insuranceParams.riskFilters = $scope.insuranceParams.riskFilters || {};

			$scope.insuranceParams.specialTermFilters = $scope.insuranceParams.specialTermFilters || [];

			// By default search results are empty

			$scope.searchResults = [];

			// By default a promise for calculation process isn't initialized

			searchResultsController.insuranceCalculationDeferred = null;

			// If user wants to leave the page before calculation results received, then cancel polling

			$scope.$on(EVENTS.ROUTE.CHANGE_START, function() {
				if( !!searchResultsController.insuranceCalculationDeferred ) {
					searchResultsController.insuranceCalculationDeferred.cancel();

					$log.warn('Polling for calculation results has been terminated');
				} else {
					$log.warn('Detected attempt to cancel non initialized deffer calculation object');
				}
			});

			$scope.fetchingResults = false;

			/**
			 * Helper method for checking at least one checked checkbox
			 * @returns {Boolean} result availability to commit action
			 */

			$scope.allowToFetchResults = function() {
				return !!$scope.insuranceParams.period['start-date'] &&

						!!$scope.insuranceParams.period['end-date'] &&

						$scope.insuranceParams.country.length &&

						$scope.insuranceParams.passengers.length &&

						!$scope.fetchingResults;
			};

			/**
			 * Cleans up insurance params by removing passengers without birthday
			 * @param {Object} data insurance parameters
			 * @returns {Object} data cleaned insurance parameters
			 */

			this.cleanInsuranceParams = function(data) {
				if( !!data.passengers && data.passengers.length ) {
					_.remove(data.passengers, function(passenger) {
						return !passenger.birthDate;
					});
				}

				return data;
			};

			/**
			 * Checks if all passengers contain valid birthday data
			 * @param {Object} data insurance parameters
			 * @returns {Boolean} boolean flag indicating passengers validity
			 */

			this.checkPassengersValidity = function(data) {
				if( Array.isArray(data.passengers) && data.passengers.length ) {
					return data.passengers.every(function(passenger) {
						return passenger.isValid;
					});
				}

				return false;
			};

			/**
			 * Helper method for launching calculation process
			 * @param {Object} data insurance parameters
			 */

			$scope.getResults = function(data) {
				if( !$scope.allowToFetchResults() ) {
					return;
				}

				$scope.calculationDone = false;

				searchResultsController.cleanInsuranceParams(data);

        searchResultsController.resetSorting();

				searchResultsController.resetFilter();

				searchResultsController.resetComparedItems();

				$scope.cacheInsuranceParams(data);

				if( !searchResultsController.checkPassengersValidity(data) ) {
					return;
				}

				$scope.allowDisplayFilterInFrame = true;

				// Flush any previous results

				$scope.searchResults.splice(0);

				// And linking current calculations fetching with appropriate promise

				$log.debug('Initiating polling process with params: ', data);

				searchResultsController.insuranceCalculationDeferred = insuranceCalculation.launchCalculation(data);

				$scope.fetchingResults = true;

				searchResultsController.insuranceCalculationDeferred.$promise.then(function () {
					$log.debug('Calculation completed');

					$scope.fetchingResults = false;

					$scope.calculationDone = true;
				}, function (error) {
					$log.error('Error during calculation process: ', error);

					$scope.fetchingResults = false;
				}, function (data) {
					// Augment calculation results once the data chunk is received

					$log.debug('Data received: ', data);

					$scope.searchResults.push.apply($scope.searchResults, data);
				});
			};

			$scope.getResults($scope.insuranceParams);

			// Expand the new item and collapse expanded at the moment

			$scope.expandItem = function (item) {
				item.expanded = !item.expanded;
			};

			var itemFilter = $filter('filter');

			/**
			 * Helper method for toggling item visibility (visible if relevant and vice versa)
			 * @param {Object} item insurance item
			 * @param {Object} expression filter parameters
			 * @returns {Boolean} result relevancy flag
			 */

			$scope.isRelevantSearchResult = function(item, expression) {
				item.relevant = !!itemFilter([item], expression, true).length;

				return item.relevant;
			};

      var relevantItemsReport = null;

			/**
			 * Helper method for checking relevant items
			 * @returns {Object} result relevant items report with boolean field
       * and quantity of such items
			 */

			$scope.getRelevantItemsReport = function() {
        var newRelevantItemsReport = $scope.searchResults.reduce(function(report, currentItem) {
					if( currentItem.relevant ) {
            report.quantity++;

            report.presence = true;
          }

          return report;
				}, {quantity: 0, presence: false});

        if(
          !relevantItemsReport ||

          relevantItemsReport.quantity !== newRelevantItemsReport.quantity
        ) {
          relevantItemsReport = newRelevantItemsReport;

          $scope.$broadcast(EVENTS.SEARCH_RESULTS_FILTER.RELEVANT_ITEMS_REPORT_READY, relevantItemsReport.quantity);
        }

        return newRelevantItemsReport;
			};

			$scope.comparedItems = [];

			var cancelPolicyItemForCompareListener = $scope.$on(EVENTS.SEARCH_RESULT_ITEM.POLICY_ITEM_ADDED_FOR_COMPARE, function(event, item) {
				if( item.isAddedToCompared ) {
					if( $scope.comparedItems.length < COMPARE_ITEMS.MAXIMUM_QUANTITY ) {
						$scope.comparedItems.push(item);
					}
				} else {
					_.remove($scope.comparedItems, {isAddedToCompared: false});
				}

				dataStorage.setData(CACHE_ITEMS.COMPARED_POLICIES, angular.toJson($scope.comparedItems || []));

				$scope.$broadcast(EVENTS.SEARCH_RESULT_ITEM.UPDATE_COMPARED_ITEMS, $scope.comparedItems.length);
			});

			var cancelScopeDestroyListener = $scope.$on(EVENTS.SCOPE.DESTROY, function() {
				cancelPolicyItemForCompareListener();

				cancelScopeDestroyListener();
			});
		}
	]);
})();;
(function() {
  'use strict';

  var searchResults = angular.module('searchResults');

  searchResults.controller('searchResultItemCtrl', [
    '$rootScope',

    '$scope',

    '$window',

    '$location',

    'CURRENCY_SYMBOLS',

    'CACHE_ITEMS',

    'ROUTES',

    'TRUSTED_ORIGINS',

    'REST_API',

    'SEARCH_RES_ICONS',

    'VENDOR_LOGO',

    'TERRITORY_BLOCK',

    'quantitySuffixFilter',
    
    'orderManager',

    'TEXT_LABELS',

    'VENDOR_COMPANIES',

    'EVENTS',

    'frameManager',

    function(
      $rootScope,

      $scope,

      $window,
      
      $location,
      
      CURRENCY_SYMBOLS,
      
      CACHE_ITEMS,
      
      ROUTES,

      TRUSTED_ORIGINS,
      
      REST_API,
      
      SEARCH_RES_ICONS,
      
      VENDOR_LOGO,
      
      TERRITORY_BLOCK,
      
      quantitySuffixFilter,
    
      orderManager,

      TEXT_LABELS,

      VENDOR_COMPANIES,
      
      EVENTS,

      frameManager
    ) {
      $scope.appInFrameMode = frameManager.isAppInFrameMode();

      var site = REST_API.SITE;

      var riskStatuses = {
        included: 'INCLUDED',
        optional: 'OPTIONAL',
        notIncluded: 'NOT_INCLUDED'
      };

      var paramGroups = null;

      $scope.updateParamsGroup = function() {
        paramGroups = {
          global: $scope.item.calculationDataInput.riskAliasMap,
          medical: $scope.item.calculationDataInput.riskAliasMap.MEDICAL_EXPENSES.subRisks,
          options: $scope.item.calculationDataInput.options
        };
      };

      var singleParam = function(name, group) {
        return typeof name !== "string" ? name : name.length == 0 ? null : {
          displayName: group[name].displayName,
          included: group[name].riskStatus === riskStatuses.included,
          risk: group[name].risk
        };
      };

      var paramPair = function(left, groupLeft, right, groupRight) {
        return {
          left: singleParam(left, groupLeft),
          right: singleParam(right, groupRight)
        };
      };

      $scope.site = site;

      $scope.config = $scope.config || {};

      $scope.currencySymbols = CURRENCY_SYMBOLS;

      // Model of "MEDICAL_EXPENSES" params group
      $scope.medicalExpenses = null;

      $scope.setMedicalExpenses = function() {
        $scope.updateParamsGroup();

        $scope.medicalExpenses = [
          paramPair(
            "URGENT_HELP", paramGroups.medical,
            "BRING_CHILDREN_BACK_HOME", paramGroups.medical
          ),
          paramPair(
            "MEDICAL_DRUGS", paramGroups.medical,
            "THIRD_PARTY_VISIT", paramGroups.medical
          ),
          paramPair(
            "DIAGNOSIS", paramGroups.medical,
            "PRESCHEDULE_RETURN", paramGroups.medical
          ),
          paramPair(
            "OUT_PATIENT_TREATMENT", paramGroups.medical,
            "TRANSPORT_EXPENSES", paramGroups.medical
          ),
          paramPair(
            "INDOOR_TREATMENT", paramGroups.medical,
            "URGENT_MESSAGES", paramGroups.medical
          ),
          paramPair(
            "SURGERY", paramGroups.medical,
            "LOST_OR_STOLEN_DOCUMENTS", paramGroups.medical
          ),
          paramPair(
            "EXTRA_DENTAL_TREATMENT", paramGroups.medical,
            "SEARCH_AND_RESCUE", paramGroups.medical
          ),
          paramPair(
            "MEDICAL_TRANSPORTATION", paramGroups.medical,
            "LEGAL_HELP", paramGroups.medical
          ),
          paramPair(
            "TRANSPORT_OF_PATIENT_HOME", paramGroups.medical,
            "FLIGHT_DELAY", paramGroups.global
          ),
          paramPair(
            "BODY_REPATRIATION", paramGroups.medical,
            "BROKEN_CAR", paramGroups.global
          ),
          paramPair(
            "RETURN_DELAY", paramGroups.medical,
            "ADDITIONAL_EXPENSES", paramGroups.medical
          )
        ];
      };

      // Model of extra options params group

      $scope.extraOptions = null;

      $scope.setExtraOptions = function() {
        if( !!$scope.riskOptions ) {
          var options = $scope.riskOptions.ACTIVITY.specialTermDictionaryItems;

          $scope.extraOptions = [
            paramPair({
                displayName: options['ACTIVE_REST'].displayName,
                included: paramGroups.options && paramGroups.options['ACTIVE_REST']
              }, null,
              "LUGGAGE", paramGroups.global
            ),
            paramPair({
                displayName: options['SPORT'].displayName,
                included: paramGroups.options && paramGroups.options['SPORT']
              }, null,
              "TRIP_CHANGE_OR_CANCELLATION", paramGroups.global
            ),
            paramPair({
                displayName: options['SPORT_COMPETITIONS'].displayName,
                included: paramGroups.options && paramGroups.options['SPORT_COMPETITIONS']
              }, null,
              "PERSONAL_LIABILITY", paramGroups.global
            ),
            paramPair({
                displayName: options['EXTREME_SPORT'].displayName,
                included: paramGroups.options && paramGroups.options['EXTREME_SPORT']
              }, null,
              "ACCIDENT", paramGroups.global
            )
          ];
        }
      };

      if( !!$scope.item ) {
        $scope.setMedicalExpenses();

        $scope.setExtraOptions();
      }

      // All form events
      $scope.events = {
        onBuyClick: function(item) {
          orderManager.createOrderDraft(item);

          orderManager.storeInsuranceChoice(item);

         if( $rootScope.appInFrameMode ) {
           $window.open($location.protocol() + '://' + $location.host() + ROUTES.ORDER_PREPARE);
         } else {
           $location.path(ROUTES.ORDER_PREPARE);
         }

        },

        onPayClick: function(item, orderPreview) {
          // todo: refactor storing of order preview using orderManager service

          localStorage.setItem(CACHE_ITEMS.ORDER_PREVIEW, angular.toJson(orderPreview));
          
          orderManager.storeInsuranceChoice(item);
          
          $location.path(ROUTES.ORDER_PAYMENT);
        }
      };

      $scope.vendorIcon = VENDOR_LOGO.CLASS;

      $scope.arrowDownIcon = SEARCH_RES_ICONS.ALL_PARAMS_ICON;

      try {
        $scope.territory = $scope.item.calculationDataInput.territoryDisplayName;
      } catch( error ) {
        $scope.territory = '';
      }

      $scope.maxTerritoryTextLength = TERRITORY_BLOCK.MAX_SYMBOLS;

      $scope.showExtraOptions = [ROUTES.ORDER_PREPARE, ROUTES.ORDER_PAYMENT, ROUTES.PRIVATE_OFFICE].indexOf($location.path()) !== -1;

      try {
        $scope.totalInsuredPersons = $scope.item.calculationDataInput.travelData.passengers.length;
      } catch(error) {
        $scope.totalInsuredPersons = 0;
      }

      $scope.quantitySuffix = quantitySuffixFilter;

      $scope.vendorIconClass = function(item) {
        var companyLogoMap = VENDOR_COMPANIES;

        var companyCode;

        var defaultCompanyCode = Object.keys(companyLogoMap)[0];

        try {
          companyCode = item.serviceCompany.companyCode;
        } catch( error ) {
          companyCode = defaultCompanyCode;
        }

        return companyCode in companyLogoMap ? companyLogoMap[companyCode] : companyLogoMap[defaultCompanyCode];
      };

      $scope.item.isAddedToCompared = !!$scope.item.isAddedToCompared;

      $scope.item.tooltipText = TEXT_LABELS.TOOLTIPS.COMPARED_ITEM.ADD;

      $scope.updateComparedItemState = function(item) {
        item.isAddedToCompared = !item.isAddedToCompared;

        item.tooltipText = item.isAddedToCompared ? TEXT_LABELS.TOOLTIPS.COMPARED_ITEM.REMOVE : TEXT_LABELS.TOOLTIPS.COMPARED_ITEM.ADD;

        $scope.$emit(EVENTS.SEARCH_RESULT_ITEM.POLICY_ITEM_ADDED_FOR_COMPARE, item);
      };

      $scope.linkTargetAttr = frameManager.getStaticLinksMode();
    }]);

  searchResults.directive('searchResultItem', [
    'EVENTS',

    function(
      EVENTS
    ) {
    return {
      scope: {
        item: "=",

        expand: "=",

        config: "=?",

        orderPreview: "=?",

        riskOptions: "=",

        previewAsTrigger: '=?',

        getActionLabel: '&?',

        getActionResource: '&?',

        contextAction: '&?'
      },

      transclude: true,

      controller: 'searchResultItemCtrl',

      link: function(scope, element, attrs, controller, transclude) {
        var cloneContent = null;

        transclude(function(clone, scope) {
          scope = scope.$parent.$parent;

          cloneContent = clone;
        });

        var contentHeader = cloneContent.find('[data-header]');

        var extraContent = cloneContent.find('[data-extra-content]');

        var primaryTop = element.find('[data-primary-top]');

        var primaryBottom = element.find('[data-primary-bottom]');

        primaryTop.before(contentHeader);

        primaryBottom.append(extraContent);

        element.click(function(event) {
          if( !!scope.previewAsTrigger && $(event.target).attr('data-action-trigger') === undefined ) {
            scope.item.expanded = !scope.item.expanded;

            scope.$digest();
          }
        });

        var cancelItemUpdateWatcher = scope.$on(EVENTS.SEARCH_RESULT_ITEM.UPDATE_ITEMS, function() {
          if( !!scope.item && typeof scope.item === 'object' ) {
            scope.item.expanded = false;
          }
        });

        var cancelDestroyWatcher = scope.$on(EVENTS.SCOPE.DESTROY, function() {
          cancelItemUpdateWatcher();

          cancelDestroyWatcher();
        });
      },

      templateUrl: 'modules/search-results/partials/search-result-item.html'
    };
  }]);
})();;
(function() {
	'use strict';

	var searchResults = angular.module('searchResults');

	searchResults.directive('searchQuery', [
		'MODULES',

		'STRUCTURE',

		'PATH_SEPARATOR',

		function(
			MODULES,

			STRUCTURE,

			PATH_SEPARATOR
		) {
			return {
				scope: {
					action: '&',

					data: '=',

					actionAllowed: '&?'
				},

				templateUrl: [
					STRUCTURE.MODULES,

					MODULES.SEARCH_RESULTS.FOLDER,

					STRUCTURE.TEMPLATES,

					MODULES.SEARCH_RESULTS.TEMPLATES.SEARCH_QUERY
				]

				.join(PATH_SEPARATOR),

				controller: [
					'riskFilters',

					'riskOptions',

					'orderManager',

					'SELECTABLE_ITEMS',

					'CURRENCY_SYMBOLS',

					'TEXT_LABELS',

					'$scope',

					'$log',

					function(
					  riskFilters,

					  riskOptions,

					  orderManager,

					  SELECTABLE_ITEMS,

					  CURRENCY_SYMBOLS,

					  TEXT_LABELS,

					  $scope,

					  $log
					) {
						$scope.selectableItems = SELECTABLE_ITEMS;

						$scope.textLabels = TEXT_LABELS;

						var dictionaryBuilder = {
							/**
							 * Helper method for sorting dictionary
							 * @param {Array} values original values
							 * @param {Array} by sorting criteria
							 * @param {Array} order sorting order
							 * @returns {Array} result sorted array
							 */

							sort: function(values, by, order) {
								order = order && angular.isArray(values) || ['asc'];

								return _.sortByOrder(values, by, order);
							},

							/**
							 * Helper method for creating dictionaries list
							 * @param {Array} config.values array of values
							 * @param {Array} config.sortBy sorting criteria
							 * @param {Array} config.sortOrder sorting order
							 * @returns {Array} result mapped dictionary
							 */

							'numeric': function(config) {
								return _.map(
										this.sort(config.values, config.sortBy, config.sortOrder),

										function(insuredParam) {
											var value = insuredParam.value;

											var labels = _.transform(
													insuredParam.currencies,

													function(result, value) {
														result.push(CURRENCY_SYMBOLS[value]);
													},

													[]
											).join(',');

											return value.toLocaleString() + ' ' + labels;
										}
								);
							},

							'string': function(config) {
								return _.map(
										this.sort(config.values, config.sortBy, config.sortOrder),

										function(insuredParam) {
											return insuredParam.displayName;
										}
								);
							}
						};

						// By default all dictionaries are empty

						$scope.dictionaries = {
							luggage: {
								type: 'numeric',

								list: null
							},

							trip_change_or_cancellation: {
								type: 'numeric',

								list: null
							},

							accident: {
								type: 'numeric',

								list: null
							},

							personal_liability: {
								type: 'numeric',

								list: null
							}
						};

						// By default formData is empty

						$scope.formData = {};

						/**
						 * Helper method for fetching all countries
						 */

						$scope.getCountries = function() {
								$scope.countries = $scope.data.countries;
						};

					  	$scope.getCountries();

						/**
						 * Helper method for fetching risk filters
						 */

				    $scope.fetchRiskFilters = function() {
						  riskFilters
							  .getList()

							  .then(function (response) {
									$log.debug('Risk filters: ', response.data);

									// Create dictionary for luggage risk

									angular.forEach($scope.dictionaries, function (entityData, entityCode) {
									  // ACTIVITY has another type of dictionary, so avoid it

									  if (entityCode !== 'activity') {
											entityData.list = dictionaryBuilder[entityData.type]({
											  values: response.data[entityCode.toUpperCase()].sumInsureds,

											  sortBy: ['value']
											});
									  }
									});

									$log.debug('$scope.dictionaries : ', $scope.dictionaries);

									// Note success callback returns undefined implicitly
							  }, function (error) {
									$log.error('Error while trying to fetch risk filters: ', error);
							  });
						};

						/**
						 * Helper method for fetching risk options
						 */

				    $scope.fetchRiskOptions = function() {
					    $scope.dictionaries.activity = _.transform($scope.data.riskOptions.ACTIVITY.specialTermDictionaryItems, function(result, value, key) {
						    value.code = key;

						    result.push(value);
					    }, []);
						};

				    $scope.fetchRiskOptions();

						/**
						 * Helper method for toggling a certain risk filter
						 * @param {Object} risk described risk which should be enabled / disabled
						 */

						$scope.toggleRisk = function(risk) {
						  	var riskCode = risk.toUpperCase();

							if( riskCode in $scope.data.riskFilters ) {
							  delete $scope.data.riskFilters[riskCode];
							} else {
							  $scope.data.riskFilters[riskCode] = 1;
							}
						};

						/**
						 * Helper method for toggling a certain risk term
						 * @param term
						 */

					  	$scope.toggleTerm = function(term) {
						  	var termCode = term.toUpperCase();

							if( _.contains($scope.data.specialTermFilters, termCode) ) {
							  _.remove($scope.data.specialTermFilters, function(value) {
									return value === termCode;
							  });
							} else {
							  $scope.data.specialTermFilters.push(termCode);
							}
						};
					}
				]
			};
		}
	]);
})();;
(function () {
	'use strict';

	var searchResults = angular.module('searchResults');

	searchResults.directive('searchFilter', [
		'MODULES',

		'STRUCTURE',

		'PATH_SEPARATOR',

		'EVENTS',

		'$document',

		'$log',

		'ROUTES',

		function (
				MODULES,

				STRUCTURE,

				PATH_SEPARATOR,

				EVENTS,

				$document,

				$log,

				ROUTES
		) {
			return {
				scope: {
					params: '=',

					order: '='
				},

				restrict: 'A',

				templateUrl: [
					STRUCTURE.MODULES,

					MODULES.SEARCH_RESULTS.FOLDER,

					STRUCTURE.TEMPLATES,

					MODULES.SEARCH_RESULTS.TEMPLATES.SEARCH_FILTER
				]

				.join(PATH_SEPARATOR),

				controller: [
					'currenciesSum',

					'CURRENCY_SYMBOLS',

					'LOCALES',

					'$scope',

					'$q',

					'insuranceCompanies',

					'assistanceCompanies',

          'insuredDays',

					'quantitySuffixFilter',

					'frameManager',

					function (
						currenciesSum,

						CURRENCY_SYMBOLS,

						LOCALES,

						$scope,

						$q,

						insuranceCompanies,

						assistanceCompanies,

            insuredDays,

						quantitySuffixFilter,

					  frameManager
					) {
						$scope.appInFrameMode = frameManager.isAppInFrameMode();

						// By default additional filters are hidden

						$scope.showAdditionalFilters = false;

						var cancelAdditionalFiltersMonitoring = $scope.$watch(
							'showAdditionalFilters',

							function(newValue, oldValue) {
								if( newValue !== oldValue && newValue ) {
									$scope.$broadcast(EVENTS.WIDGET.ADJUST_SIZE);
								}
							}
						);

						$scope.toggleFilters = function() {
							$scope.showAdditionalFilters = !$scope.showAdditionalFilters;
						};

						$scope.quantitySuffix = quantitySuffixFilter;

						$scope.dictionaries = {
							currency: null,

							insuranceCompanies: null,

              assistanceCompanies: null,

              insuredDays: null,

							policyType: null,

							insuranceSum: null,

							sortOrder: null
						};

						$scope.referenceDataFetched = false;

						/**
						 * Builds currencies dictionary
						 * @param {Object} list key:value pair of currency: insuranceSums
						 */

						function buildCurrencyDictionary(list) {
							var dictionary = _.map(_.keys(list), function(currency) {
								var dictionaryElement = {};

								if( currency === 'ANY' ) {
									dictionaryElement.value = undefined;

									dictionaryElement.label = _.values(CURRENCY_SYMBOLS).join(', ');
								} else {
									dictionaryElement.value = currency;

									dictionaryElement.label = CURRENCY_SYMBOLS[currency];
								}

								return dictionaryElement;
							});

							// Add 'ANY' currency at the beginning

							dictionary.splice(0, 0, _.remove(dictionary, {
								value: undefined
							})[0]);

							$scope.dictionaries.currency = dictionary;
						}

						/**
						 * Builds insurance sums dictionary
						 * @param {Object} list key:value pair of insuranceSum: currenciesList
             */

						function buildSumDictionary(list) {
							var dictionary = _.map(_.keys(list), function(sum) {
								var dictionaryElement = {};

								if( sum === 'ANY' ) {
									dictionaryElement.label = 'Любая';

									dictionaryElement.value = undefined;
								} else {
									dictionaryElement.label = (+sum).toLocaleString(LOCALES.RU);

									dictionaryElement.value = +sum;
								}

								return dictionaryElement;
							});

							var defaultDictionaryElement = dictionary.splice(_.findIndex(dictionary, {
								value: undefined
							}), 1)[0];

							dictionary.unshift(defaultDictionaryElement);

							$scope.dictionaries.insuranceSum = dictionary;
						}

						/**
						 * Builds dictionary for insurance companies
						 * @param {Array} list list of insurance companies
             */

						function buildInsuranceCompaniesDictionary(list) {
							var insuranceCompaniesDictionary = _.map(list, function(company) {
								return {
									label: company.nameRus,

                  value: {
                    companyName: company.nameRus,

                    registeredService: company.code
                  },

									inactive: !company.active
								};
							});

              insuranceCompaniesDictionary = _.sortBy(insuranceCompaniesDictionary, function(company) {
                return company.label.toLowerCase();
              });

              insuranceCompaniesDictionary.unshift({
                label: 'Все',

                value: {
                  companyName: undefined,

                  registeredService: undefined
                }
              });

							$scope.dictionaries.insuranceCompanies = insuranceCompaniesDictionary;
						}

            /**
             * Builds dictionary for assistance companies
             * @param {Array} list list of assistance companies
             */

            function buildAssistanceCompaniesDictionary(list) {
              var assistanceCompaniesDictionary = _.map(list, function(company) {
                return {
                  label: company.name,

                  value: {
                    companyName: company.name,

                    companyCode: company.code
                  }
                };
              });

              assistanceCompaniesDictionary = _.sortBy(assistanceCompaniesDictionary, function(company) {
                return company.label.toLowerCase();
              });

              assistanceCompaniesDictionary.unshift({
                label: 'Все',

                value: {
                  companyName: undefined,

                  companyCode: undefined
                }
              });

              $scope.dictionaries.assistanceCompanies = assistanceCompaniesDictionary;
            }

            /**
             * Builds dictionary for insurance list
             * @param {Array} list the list of available insurance days
             */

            function buildInsuredDaysDictionary(list) {
              var insuranceDaysDictionary = _.map(_.sortBy(list), function(day) {
                return {
                  label: day,

                  value: day
                };
              });

              insuranceDaysDictionary.unshift({
                label: 'Любое',

                value: undefined
              });

              $scope.dictionaries.insuredDays = insuranceDaysDictionary;
            }

						/**
						 * Helper method for adjusting available values inside dictionaries
						 * @param {String} config.type type of connection (cts: currency to sum or stc: sum to currency)
						 * @param {*} config.newValue new value of monitored item
						 * @param {Array} config.origin dictionary
						 */

						function updateDictionary(config) {
							var availableItems = _.map(currenciesSumList[config.type][config.newValue], function(item) {
									return config.type === 'cts' ? +item : item;
							});

							_.forEach(config.origin, function(item) {
								item.inactive = !_.contains(availableItems, item.value) && config.newValue !== 'ANY' && item.value !== undefined;
							});
						}

						var currenciesSumList = null;

						/**
						 * Helper method for building reference data (dictionaries)
						 */

						$scope.buildReferenceData = function() {
							/*
							 * Fetch currencies, sums, insurance companies, assistance companies,
							 * insurance days list in parallel.
							 */

							var currenciesFetchingPromise = currenciesSum.getList()
							.then(function(response) {
								$log.debug('Currencies to sum list received: ', response.data);

								currenciesSumList = response.data;

								buildCurrencyDictionary(response.data.cts);

								buildSumDictionary(response.data.stc);

								$log.debug('Filter dictionaries after building: ', $scope.dictionaries);
							}, function(error) {
								$log.error('Can not fetch currencies to sum list: ', error);

								return $q.reject(error);
							});

							var insuranceCompaniesFetchingPromise = insuranceCompanies.getList()
								.then(function(response) {
									buildInsuranceCompaniesDictionary(response.content);
								}, function(error) {
									$log.error('Can not fetch insurance companies list: ', error);

									return $q.reject(error);
								});

              var assistanceCompaniesFetchingPromise = assistanceCompanies.getList()
                .then(function(response) {
                  buildAssistanceCompaniesDictionary(response.data.content);
                }, function(error) {
                  $log.error('Can not fetch assistance companies list: ', error);

	                return $q.reject(error);
                });

              var insuredDaysFetchingPromise = insuredDays.getList()
                .then(function(response) {
                  buildInsuredDaysDictionary(response.data);
                }, function(error) {
                  $log.error('Can not fetch insured days list: ', error);

	                return $q.reject(error);
                });

							$q.all([
								currenciesFetchingPromise,

								insuranceCompaniesFetchingPromise,

                assistanceCompaniesFetchingPromise,

                insuredDaysFetchingPromise
							]).then(function() {
								$scope.$broadcast(EVENTS.WIDGET.ADJUST_SIZE);

								$scope.referenceDataFetched = true;
							}, function(error) {
								$log.error('Error during building reference data: ', error);
							});
						};

						$scope.buildReferenceData();

						// Monitoring insurance sum

						var cancelInsuranceSumMonitoring = $scope.$watch(
							'params.riskAliasMap.MEDICAL_EXPENSES.risk.sumInsured',

							function(newValue, oldValue) {
								if( !!currenciesSumList && newValue !== oldValue ) {
									if( newValue === undefined ) {
										newValue = 'ANY';
									}

									updateDictionary({
										newValue: newValue,

										type: 'stc',

										origin: $scope.dictionaries.currency
									});
								}
							}
						);

						// Monitoring currency

						var cancelCurrencyMonitoring = $scope.$watch('params.currency', function(newValue, oldValue) {
							if( !!currenciesSumList && newValue !== oldValue ) {
								if( newValue === undefined ) {
									newValue = 'ANY';
								}

								updateDictionary({
									newValue: newValue,

									type: 'cts',

									origin: $scope.dictionaries.insuranceSum
								});
							}
						});

						$scope.setPolicyTypes = function() {
							$scope.dictionaries.policyType = [
								{
									label: 'Любой',

									value: undefined
								},

								{
									label: 'Однократный',

									value: false
								},

								{
									label: 'Многократный',

									value: true
								}
							];
						};

						$scope.setPolicyTypes();

						/**
						 * Helper method for setting sorting order
						 */

						$scope.setSortOrder = function() {
							$scope.dictionaries.sortOrder = [
								{
									label: 'По умолчанию',

									value: {
										prop: undefined,

										direction: undefined
									}
								},

								{
									label: 'Сначала дорогие',

									value: {
										prop: 'totalPrice',

										direction: true
									}
								},

								{
									label: 'Сначала дешевые',

									value: {
										prop: 'totalPrice',

										direction: false
									}
								}
							];
						};

						$scope.setSortOrder();

						$scope.relevantItemsQuantity = 0;

						// Listening for relevant search results quantity

						var cancelRelevantItemsReportListening = $scope.$on(
							EVENTS.SEARCH_RESULTS_FILTER.RELEVANT_ITEMS_REPORT_READY,

							function(event, relevantItemsQuantity) {
								$scope.relevantItemsQuantity = relevantItemsQuantity;
							}
						);

						/*
						 * If user choosed a certain quantity of days for trip (not the default value),
						 * then policy type should be automatically set as 'multi'
						 */

						var cancelTripDaysMonitoring = $scope.$watch(
							'params.calculationDataInput.travelData.period.insuredDays',

							function(newValue, oldValue) {
                if( newValue !== oldValue ) {
                  if( newValue !== $scope.dictionaries.insuredDays[0].value ) {
                    $scope.params.calculationDataInput.travelData.period.multi = true;
                  }
                }
							}
						);

            /*
             * If user choosed a certain policy type for a trip (either default or not a multi),
             * then days quantity should be set to default
             */

            var cancelPolicyTypeMonitoring = $scope.$watch(
              'params.calculationDataInput.travelData.period.multi',

              function(newValue, oldValue) {
                if( newValue !== oldValue ) {
                  /*
                   * $scope.dictionaries.policyType[0].value - 'any'
                   * $scope.dictionaries.policyType[1].value - 'single'
                   * $scope.dictionaries.policyType[2].value - 'multiple'
                   */

                  var anyPolicyType = $scope.dictionaries.policyType[0].value;

                  var singlePolicyType = $scope.dictionaries.policyType[1].value;

                  if( [anyPolicyType, singlePolicyType].indexOf(newValue) !== -1 ) {
                    //  $scope.dictionaries.insuredDays[0].value - any number of days

                    $scope.params.calculationDataInput.travelData.period.insuredDays = $scope.dictionaries.insuredDays[0].value;
                  }

                  $scope.$broadcast(EVENTS.WIDGET.BLOCK, 'INSURED_DAYS', newValue === singlePolicyType);
                }
              }
            );

						$scope.comparedItemsNum = 0;

						var cancelCompareItemsUpdateListener = $scope.$on(EVENTS.SEARCH_RESULT_ITEM.UPDATE_COMPARED_ITEMS, function(event, data) {
							$scope.comparedItemsNum = data;

							$scope.comparedItemsPageLink = $scope.comparedItemsNum > 0 ? ROUTES.COMPARE_POLICIES : '';
							}
						);

						$scope.$on(EVENTS.SCOPE.DESTROY, function() {
							cancelRelevantItemsReportListening();

							cancelInsuranceSumMonitoring();

							cancelCurrencyMonitoring();

							cancelTripDaysMonitoring();

							cancelAdditionalFiltersMonitoring();

              cancelPolicyTypeMonitoring();

							cancelCompareItemsUpdateListener();
						});
					}
				],

				link: function(scope, element) {
					function handleDocumentScrolling() {
						if( scope.showAdditionalFilters ) {
							scope.$apply(function() {
								$log.info('User scrolled a page. Hiding search filter details and triggering $digest cycle');

								scope.showAdditionalFilters = false;
							});

							/*
							 * Hack for angular sticky.
							 * By triggering window's resize event we
							 * force redrawing for sticky placeholder element.
							 */

							var filtersExtraBlock = element.find('[data-filter-extra]');

							var transitionDuration = filtersExtraBlock.css('transition-duration').split(',')[0];

							transitionDuration = parseFloat(transitionDuration) * (/ms$/i.test(transitionDuration) ? 1 : 1000);

							window.clearTimeout(scope.resizeTimeout);

							scope.resizeTimeout = window.setTimeout(function() {
								$(window).trigger(EVENTS.WINDOW.RESIZE);
							}, 1.05 * transitionDuration);
						}
					}

					$document.on(EVENTS.SCROLL.REGULAR, handleDocumentScrolling);

					scope.$on(EVENTS.SCOPE.DESTROY, function() {
						$document.off(EVENTS.SCROLL.REGULAR, handleDocumentScrolling);
					});
				}
			}
		}
	]);
})();;
/**
 *  Method for fixing top part of policy item on top of the screen if the parameters list is expanded.
 *  List of blocks:
 *  stickyEl - fixed top block of policy-item
 *  scrollingEl - block with policy parameters that is scrolled
 *  scrolledOffsetBlock - block above the policy items list with static position(if any). Should be defined in "data-sticky-block-offset-top-by" attribute.
 *  fixedOffsetBlock - block above the policy items list with fixed position(if any). Should be defined in "data-sticky-block-fixed-to" attribute.
 */

(function () {
    'use strict';

    var searchResults = angular.module('searchResults');

    searchResults.directive('stickyBlock', [

        'EVENTS',

        '$document',

        '$parse',

        function(
            EVENTS,

            $document,

            $parse
        ) {

        return {
            restrict: 'A',

            link: function(scope, element, attrs) {
                var stickyEl, scrollingEl, scrollY, offsetY;

                stickyEl = element.find('.sticky-top');

                // use offsetHeight to take into account paddings and borders

                var stickyElHeight = stickyEl.prop('offsetHeight');

                var scrolledOffsetBlock = $('[' + attrs.stickyBlockOffsetTopBy+ ']');

                var scrolledOffsetBlockHeight = scrolledOffsetBlock.length ? scrolledOffsetBlock.first().height() : 0;

	              var fixedOffsetBlock = $('[' + attrs.stickyBlockFixedTo + ']').first();

                $document.on(EVENTS.SCROLL.REGULAR, handleStickyScroll);

                function handleStickyScroll() {
	                if( !scope.item.expanded ) {
		                stickyEl.removeClass('sticky-enabled');

		                return;
	                }

                  var fixedOffsetBlockHeight = +fixedOffsetBlock.height();

                  if(scope.item.expanded) {
                      scrollingEl = element.find('.scrolled-block');

                      // use offsetHeight to take into account paddings and borders
                      scrollY = scrollingEl.prop('offsetHeight');

                      offsetY = scrollingEl.offset().top - $document.scrollTop() - stickyElHeight;

                      if(offsetY <= fixedOffsetBlockHeight && $document.scrollTop() >= scrolledOffsetBlockHeight) {
                          stickyEl.addClass('sticky-enabled').css('top', fixedOffsetBlockHeight);

                          scrollingEl.css('margin-top', stickyElHeight);

                          if(offsetY <= fixedOffsetBlockHeight - scrollY) {
                              //scroll sticked block with the bottom part of the params block
                              var tempStickyOffset = offsetY + scrollY;

                              stickyEl.css('top', tempStickyOffset);
                              //turn sticked block back to static
                              if(offsetY <=  -scrollY) {
                                  scrollingEl.css('margin-top', 0);

                                  stickyEl.removeClass('sticky-enabled');
                              }
                          }
                      } else {
                          stickyEl.removeClass('sticky-enabled');

                          scrollingEl.css('margin-top', 0);
                      }
                  }
                }

	            var actionTriggerClickHandler = function() {
		            if( !scope.item.expanded && stickyEl.hasClass('sticky-enabled') ) {
			            stickyEl.removeClass('sticky-enabled');

			            $('html, body').animate({
				            scrollTop: stickyEl.offset().top - stickyElHeight
			            }, attrs.stickyBlockScrollSpeed);
		            }
	            };

	            var actionTriggers = stickyEl.find('[data-action-trigger]');

	            actionTriggers.on(EVENTS.ELEMENT.CLICK, actionTriggerClickHandler);

              var cancelScopeDestroyWatcher = scope.$on(EVENTS.SCOPE.DESTROY, function() {
	              $document.off(EVENTS.SCROLL.REGULAR, handleStickyScroll);

	              cancelScopeDestroyWatcher();

								actionTriggers.off(EVENTS.ELEMENT.CLICK, actionTriggerClickHandler);
              });
            }
        };
    }]);
})();
;
(function() {
	'use strict';
	
	/*
	 * First step in transaction process:
	 * a) Prepare order
	 * b) Payment
	 * c) Receiving insurance document to the client email
	*/
	
	
	angular.module('orderPrepare', []);
})();;
(function () {
	'use strict';

	var orderPrepare = angular.module('orderPrepare');

	orderPrepare.controller('OrderPrepareController', [
		'$scope',

		'$log',

		'$location',

		// Note: riskOptions here is an already fetched list of risk options

		'riskOptions',

		'ROUTES',

		'INSURER_MINIMAL_AGE',

		'MONTH_PER_YEAR',

		'CACHE_ITEMS',

		'REGEXP',

		'EVENTS',

		'userAuth',

		'MAX_SYMBOLS',

		'REST_API',

		'orderManager',

		'MASKS',

		'INSURANCE_COMPANIES',

		'$dateParser',

		'DATE_FORMAT',

		'frameManager',

		function (
				$scope,

				$log,

				$location,

				riskOptions,

				ROUTES,

				INSURER_MINIMAL_AGE,

				MONTH_PER_YEAR,

				CACHE_ITEMS,

				REGEXP,

				Events,

				userAuth,

				MAX_SYMBOLS,

				REST_API,

		    orderManager,

		    MASKS,

				INSURANCE_COMPANIES,

				$dateParser,

				DATE_FORMAT,

				frameManager
		) {
			// Fetch previously selected (step 'search-results') insurance policy

			$scope.insuranceChoice = orderManager.getInsuranceChoice();

			if (!$scope.insuranceChoice) {
				$location.path(ROUTES.SEARCH_RESULTS);
			}

			$scope.regexp = REGEXP;

			$scope.currentUser = userAuth.getCurrentUser();

			$scope.requestAuthenticate = userAuth.requestAuthenticate;

			$scope.$on(Events.USER_ACTIONS.LOGIN, function() {
				$scope.insurer.lastName = $scope.currentUser.value.lastName;

				$scope.insurer.firstName = $scope.currentUser.value.firstName;

				$scope.insurer.email = $scope.currentUser.value.email;

				$scope.insurer.phoneNumber = $scope.currentUser.value.phoneNumber;

				$scope.insurer.birthDate = $scope.currentUser.value.birthDate;
			});

			$scope.riskOptions = riskOptions;

			// Fetch order preview from cache (user might go back to this step when he / she will proceed to the next step

			var orderPreview = orderManager.getOrderPreview();

			// In case if there is no data regarding insurer, then initiate it as a dummy object

			$scope.insurer = orderPreview ? orderPreview.insurer : $scope.currentUser.value != null ? $scope.currentUser.value : {
				lastName: '',

				firstName: '',

				email: '',

				phoneNumber: '',

				birthDate: ''
			};

			/**
			 * Stores order preview to the localStorage
			 */

			$scope.toUpperCase = function () {
				$scope.insurer.firstName = $scope.insurer.firstName.toUpperCase();
				$scope.insurer.lastName = $scope.insurer.lastName.toUpperCase();
			};

			$scope.prepareOrder = function () {
			  $log.debug(this.prepare);

			  if( !this.prepare.$valid ) {
					$log.warn('Attempt to send invalid form');

					return false;
			  }

				// Save order preview

				orderManager.storeOrderPreview({
					calculationId: $scope.insuranceChoice.calculationId,

					insurer: $scope.insurer,

					insuredPersons: $scope.insuranceChoice.calculationDataInput.travelData.passengers
				});

				// And update insurance choice as well

				orderManager.storeInsuranceChoice($scope.insuranceChoice);

				// After that redirect user to the next step

				$location.path(ROUTES.ORDER_PAYMENT);

				return true;
			};

			/**
			 * @param {Number} comparedAge age of a person which we would like to check
			 * @returns {boolean} true if person age is >= 18, false otherwise
			 */

			$scope.ageIsAllowed = function(comparedAge) {
				var currentDate = new Date();

				currentDate.setHours(0,0,0,0);

				// By default age is passed in form dd.mm.yyyy

				var ageRelevantTime = Date.parse(comparedAge.split('.').reverse().join('-'));

				var ageDate = new Date(ageRelevantTime);

				ageDate.setMonth(ageDate.getMonth() + INSURER_MINIMAL_AGE * MONTH_PER_YEAR);

				return ageDate < currentDate;
			};

			$scope.isInsurerAgeAllowed = true;

			/**
			 * Checks if insurer birthDate value is valid, that means person's age is >= 18.
			 * Empty field is also valid.
			 * @param {String} date Formatted date to check
			 * @returns {Boolean} true if field is empty or person age is >= 18, false otherwise
			 */

			$scope.checkInsurerBirthDate = function(date) {
				if( $dateParser(date, DATE_FORMAT) < new Date() && typeof date === 'string') {
					$scope.isBirthDateValid = true;

					$scope.isInsurerAgeAllowed = $scope.ageIsAllowed(date);

					return $scope.isInsurerAgeAllowed;
				} else {
					$scope.isInsurerAgeAllowed = true;

					$scope.isBirthDateValid = false;

					return false;
				}
			};

			$scope.toUpperCase = function(insuredPerson) {
				if (insuredPerson != undefined) {
					if(insuredPerson.name != undefined) {
						insuredPerson.name = insuredPerson.name.toUpperCase();
					}
					if(insuredPerson.surname != undefined) {
						insuredPerson.surname = insuredPerson.surname.toUpperCase();
					}
				}
				return true;
			};

			$scope.toUpperCaseInsurer = function(insurer) {
				if (insurer != undefined) {
					if(insurer.lastName != undefined) {
						insurer.lastName = insurer.lastName.toUpperCase();
					}
					if(insurer.firstName != undefined) {
						insurer.firstName = insurer.firstName.toUpperCase();
					}
				}
				return true;
			};

			$scope.isInvalidPrepareForm = function(){
				return this.prepare.$invalid;
			};

			$scope.isPrepareButtonDisabled = function(){
				if($scope.currentUser.value != null){
					$scope.setThatEmailIsValid();
				}
				var result = $scope.isInvalidPrepareForm() || $scope.isInvalidEmail() || !$scope.isUserAgreement;
				return result;
			};

			$scope.setThatEmailIsValid = function(){
				$scope.validation.email = true;
				$scope.validation.processing = false;
			};

			$scope.isInvalidEmail = function(){
				return !$scope.validation.email || $scope.validation.processing;
			};

		    // Custom validation fields and settings

			$scope.validation = {
			    email: true,

			    processing: false
			};

			$scope.isUserAgreement = false;

	    /**
		 * Check email address
		 */

	    $scope.isEmailHint = false;

			$scope.isEmailWarning = false;

			$scope.firstCheckFlag = false;

			$scope.showPopovers = function() {
				if($scope.validation.email) {
					$scope.isEmailHint = true;
				}
				else {
					$scope.isEmailWarning = true;
				}
			};

			$scope.hidePopovers = function() {
				$scope.isEmailWarning = false;
				$scope.isEmailHint = false;
			};

			$scope.checkEmail = function () {
				if ($scope.currentUser.value == null) {
					$scope.validation.processing = true;
					userAuth.checkEmail($scope.insurer.email)
						.then(
							function(response) {

								$scope.validation.email = !response.data.created;

								if(!$scope.firstCheckFlag) {
									$scope.firstCheckFlag = true;
								}
								else {
									$scope.isEmailHint = !response.data.created;
								}

								$scope.isEmailWarning = response.data.created;

								$scope.validation.processing = false;
							},
						$scope.setThatEmailIsValid
						);
				} else {
					$scope.setThatEmailIsValid();
				}
			};

			$scope.checkEmail();

	    /**
		 * Expand insurance choice
		 */

			$scope.expandItem = function (item) {
			    item.expanded = !item.expanded;
			};

			/**
		 * Info popover settings
		 */

			$scope.orderInfoPopover = {
				templateUrl: "orderInfo.html"
			};

			$scope.searchResultsLink = ROUTES.SEARCH_RESULTS;

			try {
				$scope.currentCompany = $scope.insuranceChoice.insuranceCompany.registeredService;
			} catch( error ) {
				$scope.currentCompany = '';
			}

			$scope.vtbCompany = INSURANCE_COMPANIES.VTB.LABEL;

			/**
			 * Checks if current insurance company matches a certain company
			 * @param {String} expected Insurance company label to compare to
			 * @param {String} current Insurance company taken from user's insurance choice
			 * @returns {Boolean} result flag of current company matching expected one
			 */

			$scope.isInsuranceCompany = function(expected, current) {
				return expected === current;
			};

			$scope.mask = {
				blur: MASKS.DATE.DEFAULT,

				focus: MASKS.DATE.EMPTY
			};

			/**
			 * Set custom input mask
			 * @param {String} maskType mask
			 */

			$scope.setMask = function(maskType) {
				$scope.currentMask = $scope.mask[maskType] || '';
			};

			$scope.currentMask = $scope.mask.blur;

			$scope.linkTargetAttr = frameManager.getStaticLinksMode();
		}]);
})();;
(function() {
    'use strict';

    /*
     * First step in transaction process:
     * a) Prepare order
     * b) Payment
     * c) Receiving insurance document to the client email
     */


    var orderPayment = angular.module('orderPayment', []);
})();;
(function () {
	'use strict';

	var orderPayment = angular.module('orderPayment');

	orderPayment.controller('OrderPaymentController', [
		'$scope',

		'$log',

		'$q',

		'$location',

		'ROUTES',

		'orderManager',

		'CACHE_ITEMS',

		'EVENTS',

		'userAuth',

		'$http',

		'REST_API',

		// Note: riskOptions here is an already fetched list of risk options

		'riskOptions',

		'httpCsrfAware',

		'CURRENCY_SYMBOLS',
		
		'manageLocation',

		'INSURANCE_COMPANIES',

		'frameManager',

		function (
				$scope,

				$log,

				$q,

				$location,

				ROUTES,

				orderManager,

				CACHE_ITEMS,

				EVENTS,

				userAuth,

				$http,

				REST_API,

				riskOptions,

				httpCsrfAware,

				CURRENCY_SYMBOLS,

				manageLocation,

				INSURANCE_COMPANIES,

				frameManager
		) {
			// Check if application is in the iFrame mode

			$scope.appInFrameMode = frameManager.isAppInFrameMode();

			// Get payment form target (value for "target" attribute)

			$scope.paymentFormTarget = frameManager.getStaticLinksMode();

			// Fetch user's choice from localStorage

			$scope.insuranceChoice = orderManager.getInsuranceChoice();

			$log.debug('Current insurance choice: ', $scope.orderPreview);

			// Fetch order preview from localStorage

			$scope.orderPreview = orderManager.getOrderPreview();

			$log.debug('Order preview: ', $scope.orderPreview);

			if( !$scope.insuranceChoice || !$scope.orderPreview ) {
				$location.path(ROUTES.ORDER_PREPARE);
			}

			// By default order isn't saved

			$scope.orderPreviewSaved = false;

			// By default order's payment details aren't received

			$scope.paymentDataReceived = false;

			// By default we don't know any payment details

			$scope.paymentInfo = null;

			// By default order's draft isn't created

			$scope.orderDraft = null;

			// Don't allow to submit before response from server is received

			$scope.allowSubmit = false;

			// By default request for policy acceptance is not pending

			$scope.acceptRequestPending = false;

			$scope.riskOptions = riskOptions;
			
			/**
			 * Helper method for redirecting user back to the order editing page
			 */

			$scope.editOrderDetails = function () {
				$location.path(ROUTES.ORDER_PREPARE);
			};

			/**
			 * @param {String} statusType transaction status type
			 * @returns {string} success / fail transaction url
			 */

			$scope.buildTransactionUrl = function (statusType) {
				var statusRelatedPath = {
					success: ROUTES.ORDER_DONE,

					fail: ROUTES.ORDER_FAIL
				};

				var transactionPath = statusRelatedPath[statusType];

				return [
					$location.protocol(),

					'://',

					$location.host(),

					':',

					$location.port(),

					'/',

					transactionPath
				].join('');
			};

			// Set up deferred objects for preview data, draft data and payment details

			$scope.entitiesDeffered = {
				previewData: null,

				draftData: null,

				paymentDetails: null
			};

			// Meanwhile lets store order snapshot

			orderManager.storeOrderDraft($scope.orderPreview);

			var previewDataDeferred = orderManager.storePreviewData($scope.orderPreview);

			$scope.entitiesDeffered.previewData = previewDataDeferred;

			previewDataDeferred

				.$promise

				.then(function(response) {
				  $log.debug('Order draft id received: ', response.data);

				  $scope.orderPreviewSaved = true;

				  var paymentDetailsDeferred = orderManager.getPaymentDetails(response.data);

				  $scope.entitiesDeffered.paymentDetails = paymentDetailsDeferred;

				  userAuth.updateAuthState();

				  return paymentDetailsDeferred.$promise;
				}, function (error) {
					$log.error('Can not retrieve draft calculation id: ', error);

					return $q.reject(error);
				})

				.then(function (paymentDetails) {
					$log.debug('Order payment details received: ', paymentDetails.data);

					$scope.paymentDataReceived = true;

					$scope.paymentInfo = paymentDetails.data;

					$scope.paymentInfo.success = $scope.buildTransactionUrl('success');

					$scope.paymentInfo.fail = $scope.buildTransactionUrl('fail');

					$scope.formReady = true;
				}, function (error) {
					manageLocation.redirect(ROUTES.ORDER_FAIL);

					$log.error('Can not receive payment details: ', error);
				});

			// When user wants to leave the page, then cancel all pending xhr requests

			$scope.$on(EVENTS.ROUTE.CHANGE_START, function () {
				angular.forEach($scope.entitiesDeffered, function (entityDeferred) {
					if (!!entityDeferred) {
						entityDeferred.cancel();
					}
				});
			});

			/**
			 * @param {Event} event click event which is passed to this handler when user clicks on the 'checkout' button
			 */

			$scope.checkOrder = function(event) {
		    if( !$scope.orderPreviewSaved || !$scope.paymentDataReceived || !$scope.formReady ) {
					event.preventDefault();
				}

				$scope.acceptRequestPending = true;

				orderManager.acceptPolicyItem($scope.paymentInfo.orderId)

				.then(function() {
					/*
					 * We don't set acceptRequestPending to false since after that
					 * process indicator would gone and user will be able to see 'Pay'
					 * text on a button (in a short period of time) during form submission,
					 * which should happen right after allowSubmit was set to true.
					 */

					$log.debug('Order with id ' + $scope.paymentInfo.orderId + ' is ready to be paid.');

					$scope.allowSubmit = true;

				}, function(error) {
					manageLocation.redirect(ROUTES.ORDER_FAIL);
					
					$scope.acceptRequestPending = false;

					$log.error('Cannot start payment process. Reason: ', error);
				});
			};

			$scope.searchResultsLink = ROUTES.SEARCH_RESULTS;

			$scope.orderPrepareLink = ROUTES.ORDER_PREPARE;

			$scope.personalDataAgreementLink = REST_API.PERSONAL_DATA_AGREEMENT;

			$scope.insuranceChoice.expanded = $scope.insuranceChoice.status === 'DRAFT';

			$scope.insuredBlockExpanded = $scope.insuranceChoice.expanded;

	    /**
			 * Expand insurance choice
			 */

			$scope.expandItem = function (item) {
			    item.expanded = !item.expanded;
				  $scope.insuredBlockExpanded = item.expanded;
			};

			$scope.currencySymbols = CURRENCY_SYMBOLS;

			try {
				$scope.currentCompany = $scope.insuranceChoice.insuranceCompany.registeredService;
			} catch( error ) {
				$scope.currentCompany = '';
			}

			$scope.vtbCompany = INSURANCE_COMPANIES.VTB.LABEL;

			/**
			 * Checks if current insurance company matches a certain company
			 * @param {String} expected Insurance company label to compare to
			 * @param {String} current Insurance company taken from user's insurance choice
			 * @returns {Boolean} result flag of current company matching expected one
			 */

			$scope.isInsuranceCompany = function(expected, current) {
				return expected === current;
			};

			$scope.linkTargetAttr = frameManager.getStaticLinksMode();
		}]);
})();;
(function() {
    'use strict';

    /*
     * First step in transaction process:
     * a) Prepare order
     * b) Payment
     * c) Receiving insurance document to the client email
     */


    var orderResult = angular.module('orderResult', []);
})();;
(function() {
    'use strict';

    var orderResult = angular.module('orderResult');

    orderResult.controller('OrderDoneController', [
        'userData',

        'REST_API',

        '$scope',

        'ROUTES',

        function(
            userData,

            REST_API,

            $scope,

            ROUTES
        ) {
            // Remove everything from localStorage

            userData.clearCache();

            $scope.linkToDownload = REST_API.LATEST_BOUGHT_POLICY_DOWNLOAD;

            $scope.privateOfficeLink = ROUTES.PRIVATE_OFFICE;
        }
    ]);
})();;
(function() {
	'use strict';

	var orderResult = angular.module('orderResult');

	orderResult.controller('OrderFailController', [
		'userData',

		'$scope',

		'ROUTES',

		'ORDER_STATUSES',

		'CACHE_ITEMS',

		'orderManager',

		'MACROS',

		function(
		  userData,

		  $scope,

			ROUTES,

		  ORDER_STATUSES,

		  CACHE_ITEMS,

		  orderManager,

		  MACROS
		) {

			$scope.insuranceCompanyTemplate = MACROS.COMPANY_NAME_MACRO;

			var insuranceChoice = orderManager.getInsuranceChoice();

			$scope.insuranceCompanyName = _.isObject(insuranceChoice) && _.isObject(insuranceChoice.insuranceCompany) ? insuranceChoice.insuranceCompany.companyName : '';

			var orderStatus = orderManager.orderStatus;

			$scope.orderStatus = !_.isEqual(orderStatus, ORDER_STATUSES.DUMMY_ORDER) ? orderStatus : ORDER_STATUSES.SOMETHING_GOES_WRONG;

			$scope.failReasonUndefined = _.isEqual($scope.orderStatus, ORDER_STATUSES.SOMETHING_GOES_WRONG);

		  /*
		   * Clear data from local storage.
		   * In case if error happened because of failure from insurance company,
		   * then keep data, entered previously into TRIP_FORM
		   */
			
			var clearCacheConfig = _.isEqual($scope.orderStatus, ORDER_STATUSES.INSURANCE_SERVICE_UNAVAILABLE) ? {
				except: [CACHE_ITEMS.TRIP_FORM]
			} : undefined;

		  userData.clearCache.call(userData, clearCacheConfig);

			$scope.privateOfficeLink = ROUTES.PRIVATE_OFFICE;
			
			$scope.searchResultsLink = ROUTES.SEARCH_RESULTS;
		}
	]);
})();;
(function() {
	'use strict';
	
	var publicFooter = angular.module('publicFooter', []);
})();;
(function() {
	'use strict';

	var publicFooter = angular.module('publicFooter');

	publicFooter.controller('publicFooterController', [
		'$scope',

		'ROUTES',

		'manageLocation',

		function(
			$scope,

			ROUTES,

			manageLocation
		) {
			$scope.aboutPageLink = ROUTES.ABOUT;

			$scope.contactsPageLink = ROUTES.CONTACTS;

			$scope.termsPageLink = ROUTES.TERMS;

			$scope.partnerPageLink = ROUTES.PARTNER_LOGIN;

			/**
			 * Checks whether current page is partner page
			 * @returns {Boolean} Positive or negative result of check
			 */

			$scope.isPartnerPage = function() {
				return manageLocation.isCurrentLocation(ROUTES.PARTNER);
			};
		}
	]);
})();
;
(function() {
	'use strict';
	
	var publicNavigation = angular.module('publicNavigation', []);
})();;
(function() {
	'use strict';

	var publicNavigation = angular.module('publicNavigation');

	publicNavigation.controller('loginController', [
		// Parent here is a reference to userAuth service

		'parent',

		'$uibModalInstance',

		'$window',

		'$scope',

		'$log',

		'REGEXP',

		'userAuth',

		'$timeout',

		'dataStorage',

		'UX',

		'WARNINGS',

		'EVENTS',

		'USER_TYPES',

		'$rootScope',

		'formHelper',

		function (
				parent,

				modalInstance,

				window,

				$scope,

				$log,

				REGEXP,

		    userAuth,

		    $timeout,

				dataStorage,

		    UX,

		    WARNINGS,

				EVENTS,

				USER_TYPES,

		    $rootScope,

				formHelper
		) {
			var controller = this;

			$scope.regexp = REGEXP;

			$scope.isCollapsed = true;

			$scope.isRestore = false;

			$scope.loginError = false;

			$scope.passwordRestoreError = false;

			$scope.passwordRestoreIntent = false;

			$scope.passwordRestoreResultReceived = false;

			$scope.feedBack = '';

			$scope.userType = USER_TYPES.CLIENT;

			$scope.formData = {};

			$scope.formData.userName = dataStorage.getData('userEmail', true);

			$scope.findInvalidFields = function() {
				$rootScope.$broadcast(EVENTS.LOGIN_MODAL.FIND_INVALID_ITEMS);
			};

			/**
			 * Sends user's credentials for further check and handles response
			 */

			$scope.ok = function() {
				parent

				.login($scope.formData.userName, $scope.formData.password, !$scope.formData.alienComputer, $scope.userType)

				.then(function() {
					modalInstance.dismiss('ok');

					$scope.loginError = false;

					$scope.feedBack = '';
				}, function(err) {
					$log.error('Can not login. Reason: ', err);

					$scope.loginError = true;

					$scope.feedBack = WARNINGS.LOGIN_FORM.LOGIN_ERROR;
				});
			};

			/**
			 * Sends user's email for further check and handles cases when such email exists or not
			 */

			$scope.isExistingEmail = function() {
				if( $scope.formData.userName && $scope.login.userName.$valid ) {
					userAuth.checkEmail($scope.formData.userName)

					.then(function(response) {
						$scope.userIsExisting = response.data.created;

						if( $scope.userIsExisting ) {
							$scope.passwordRestoreError = false;

							$scope.feedBack = '';

							$scope.loginError = false;

							$scope.isCollapsed = true;

							if( $scope.passwordRestoreIntent ) {
								$scope.isRestore = true;
							}
						} else {
							$scope.passwordRestoreError = true;

							$scope.feedBack = WARNINGS.LOGIN_FORM.USER_NOT_FOUND;

							$scope.isCollapsed = false;
						}
					}, function(err) {
						$log.error('Error while checking user email: ', err);
					});
				}
			};

			/**
			 * Query password reset.
			 * In case of success display relevant message and close restore password window.
			 */

			$scope.restorePassword = function() {
				$scope.passwordRestoreIntent = true;

				parent.resetPassword($scope.formData.userName)

				.then(function() {
					$scope.passwordRestoreError = false;

					$scope.feedBack = WARNINGS.LOGIN_FORM.PASSWORD_RESTORED;

					dataStorage.setData('userEmail', $scope.formData.userName, true);

					controller.hideRestoreBlock = $timeout(function() {
						$scope.passwordRestoreIntent = false;

						$scope.isRestore = false;
					}, UX.HIDE.RESTORE_PASSWORD_BLOCK.DELAY);
				}, function(err) {
					$log.error('Error while restoring password: ', err);
				})

				['finally'](function() {
					$scope.passwordRestoreResultReceived = true;
				});
			};

			/**
			 * Open restore password window
			 * @param {Object} $event Handled event
			 */

			$scope.setRestore = function($event) {
				$event.preventDefault();

				$event.stopPropagation();

				$scope.passwordRestoreIntent = true;

				if( $scope.userIsExisting ) {
					$scope.isRestore = true;
				}
			};

			/**
			 * Close modal window
			 * @param {Object} $event Handled event
			 */

			$scope.close = function($event) {
				if( $scope.isRestore ) {
					$scope.passwordRestoreIntent = false;

					$scope.isRestore = false;

					$scope.loginError = false;
				} else {
					modalInstance.dismiss('cancel');
				}

				$event.preventDefault();
			};

			/**
			 * Toggles password visibility
			 * @param $event Handled event
			 */

			$scope.showpassword = function($event) {
				formHelper.togglePasswordDisplay($event);
			};

			$scope.$on(EVENTS.SCOPE.DESTROY, function() {
				$timeout.cancel(controller.hideRestoreBlock);
			});
		}
	]);

	publicNavigation.controller('navigationController', ['userAuth','$location', '$scope', 'USER_ROLES', 'manageLocation', 'ROUTES', function (userAuth, $location, $scope, USER_ROLES, manageLocation, ROUTES) {
		var self = this;
		self.currentUser = userAuth.getCurrentUser();
		self.requestAuthenticate = userAuth.requestAuthenticate;
		self.resetPassword = userAuth.resetPassword;
		self.logout = function ($event) {
			userAuth.logout();
			$event.preventDefault();
		};
		self.isAdmin = function() {
            if(self.currentUser.value == null) {
                return false;
            } else {
                return self.currentUser.value.roles.indexOf(USER_ROLES.ADMIN) != -1;
            }

		};

		/**
		 * Checks whether current page is partner page
		 * @returns {Boolean} Positive or negative result of check
		 */

		$scope.isPartnerPage = function() {
			return manageLocation.isCurrentLocation(ROUTES.PARTNER);
		};

	}]);
})();;
(function() {
	'use strict';

	var searchResults = angular.module('publicNavigation');

	searchResults.directive('handleModal', [
		'EVENTS',

		'$document',

		'$timeout',

		'KEYBOARD',

		function(
			EVENTS,

			$document,

		  $timeout,

			KEYBOARD
		) {
			return {
				restrict: 'A',

				scope: {
					username: '=',

					isRestore: '=',

					close: '&closeAction'
				},

				link: function(scope, element) {

					/**
					 * Focus invalid field in login form.
					 * Method was created to be able to call function from view.
					 */

					scope.$on(EVENTS.LOGIN_MODAL.FIND_INVALID_ITEMS, function() {
						scope.findInvalidFields();
					});

					/**
					 * Focus empty field in login form after restore password window is closed
					 * @param {Boolean} newValue Boolean flag indicating visibility of restore password window
					 */

					scope.$watch('isRestore', function(newValue) {
						if( !newValue && scope.username ) {
							scope.findInvalidFields();
						}
					});

					/**
					 * Search for invalid values in fields and focus the first found field
					 */

					scope.findInvalidFields = function() {
						scope.focusInvalidEl = $timeout(function() {
							element.find('input.ng-invalid').first().focus();
						});
					};

					/**
					 * Focus user login field if empty on clicking 'restore password' link
					 */

					element.find('.restore-password-link').on(EVENTS.ELEMENT.CLICK, function() {
						if( !scope.username ) {
							scope.findInvalidFields();
						}
					});

					/**
					 * Blur input element on pressing Enter key
					 * @param {Object} $event Handled event
					 */

					element.find('input').on(EVENTS.ELEMENT.KEYPRESS, function($event) {
						var el = this;

						if( $event.keyCode === KEYBOARD.ENTER ) {
							el.blur();

							scope.findInvalidFields();
						}
					});

					/**
					 * Close modal window
					 * @param {Object} $event Handled event
					 */

					scope.closeModal = function($event) {
						var modalForm = angular.element('.modal');

						if( modalForm.hasClass('in') &&  !modalForm.has($event.target).length ) {
							scope.hideRestoreBlock = $timeout(function() {
								scope.close({$event: $event});
							});
						}
					};

					$document.on(EVENTS.ELEMENT.CLICK, scope.closeModal);

					scope.$on(EVENTS.SCOPE.DESTROY, function() {
						$timeout.cancel(scope.focusInvalidEl);

						$timeout.cancel(scope.hideRestoreBlock);

						$document.off(EVENTS.ELEMENT.CLICK, scope.closeModal);
					});
				}
			};
		}
	]);
})();
;
(function() {
    'use strict';

    angular.module('registry', []);
})();;
(function() {
    'use strict';

    var registry = angular.module('registry');

    registry.constant('USER_ROLES', {
        'USER': 'ROLE_USER',

        'ADMIN': 'ROLE_ADMIN'
    });
})();;
(function() {
	'use strict';

	var registry = angular.module('registry');

	registry.constant('ANALYTICS', {
		YANDEX_METRIKA: {
			COUNTER: 'yaCounter34477675'
		}
	});
})();;
(function() {
	'use strict';

	var registry = angular.module('registry');

	registry.constant('HTTP_HEADERS', {
		'ACCEPT': {
			'NAME': 'Accept',

			'VALUES': {
				'JSON': 'application/json'
			}
		}
	});
})();;
(function() {
	'use strict';

	var registry = angular.module('registry');
	
	registry.constant('HTTP_STATUSES', {
		OK: 200,

		CREATED: 201,

		NO_CONTENT: 204,

		BAD_REQUEST: 400,

		UNAUTHORIZED: 401,

		NOT_FOUND: 404,

		REQUEST_TIMEOUT: 408,

		INTERNAL_SERVER_ERROR: 500
	});
})();;
(function () {
    'use strict';

    var registry = angular.module('registry');

    registry
        .constant('DEBUG', {
            'LOG_MODE_ENABLED': true
        })

        .constant('INSURER_MINIMAL_AGE', 18)

        .constant('PARTICIPANT_MAX_AGE', 100)

        .constant('MONTH_PER_YEAR', 12)

        .constant('CALCULATION_RESULTS_TIMEOUT', 3 * 60 * 1000)

        .constant('MAX_SYMBOLS', 62)

        .constant('CACHE_ITEMS', {
            'INSURANCE_CHOICE': 'insurance-choice',

            'ORDER_PREVIEW': 'order-preview',

            'ORDER_DRAFT': 'order-draft',

            'COMPARED_POLICIES': 'comparedPolicies',

            'TRIP_FORM': 'trip-form',

            'ORDER_STATUS': 'orderStatus'
        })
      
        .constant('COMPARE_ITEMS', {
            'MAXIMUM_QUANTITY': 99
        })

        .constant('TIMEOUT', {
            'ORDER_PREVIEW': 60 * 1000,
            'CALCULATION': 5 * 1000
        })

        .constant('HEADERS', {
            'CALCULATION_STATUS_HEADER': {
                'NAME': 'x-rm-calculation-status',

                'VALUE': 'completed'
            }
        })

        .constant('PATH_SEPARATOR', '/')

        .constant('DATE_FORMAT', 'dd.MM.yyyy')

        .constant('SELECTABLE_ITEMS', {
            'TRIP_FORM_ITEMS_LIMIT': 8,

            'MAIN_PAGE_TRIP_ITEMS_LIMIT': 3
        })

        .constant('DEFAULT_PARTNER', 'ghost')

        .constant('INSURANCE_PERIOD', {
            'MIN': 1,

            'MAX': 365
        });
})();;
(function() {
	'use strict';

	var registry = angular.module('registry');

	registry.constant('EVENTS', {
		'ROUTE': {
			'CHANGE_START': '$routeChangeStart',

			'CHANGE_SUCCESS': '$routeChangeSuccess',

			'CHANGE_ERROR': '$routeChangeError'
		},

		'SCOPE': {
			'DESTROY': '$destroy'
		},

		'ELEMENT': {
			'FOCUS': 'focus',

			'FOCUSIN': 'focusin',

			'FOCUSOUT': 'focusout',

			'CLICK': 'click',

			'MOUSEDOWN': 'mousedown',

			'MOUSEOVER': 'mouseover',

			'KEYPRESS': 'keypress',

			'KEYDOWN': 'keydown',

			'INPUT': 'input',

			'BLUR': 'blur'
		},

		'LOGIN': {
			'OPEN_LOGIN_FORM': '$openLoginForm',

			'DESTROY': '$destroy',

			'LOGIN': 'onlogin',

			'LOGOUT': 'onlogout'
		},

		'SEARCH_RESULTS_FILTER': {
			'RELEVANT_ITEMS_REPORT_READY': 'relevantItemsReportCompleted'
		},

		'LOGIN_MODAL': {
			'FIND_INVALID_ITEMS': 'findInvalidItems'
		},

    'WINDOW': {
      'RESIZE': 'resize',

	    'MESSAGE': 'message',

	    'ONBEFOREONLOAD': 'onbeforeunload'
    },

		'WIDGET': {
			'SET_DEFAULT_VALUE': 'widgetSetDefaultValue',

      'ADJUST_SIZE': 'adjustWidgetSize',

			'BLOCK': 'blockWidget'
		},

		'SCROLL': {
			'REGULAR': 'scroll',

			'SCROLL_OVERLAY': 'scrollOverlay'
		},

		'USER_ACTIONS': {
			'LOGIN': 'UserLogin',

			'LOGOUT': 'UserLogout'
		},

		'PAGE_TITLE': 'PAGE_TITLE',

		'REMEMBER_ME': 'REMEMBER_ME',

		'PARTICIPANTS_CONTROL': {
			'PASS_DATA': 'passParticipantData'
		},

		'SEARCH_RESULT_ITEM': {
			'UPDATE_ITEMS': 'updateFilteredPolicyItems',

			'UPDATE_COMPARED_ITEMS': 'updateComparedItemsNum',

			'POLICY_ITEM_ADDED_FOR_COMPARE': 'policyItemAddedForCompare'
		},

		'BLOCK_DYNAMIC_RESIZE': {
			'RESET_DUMMY': 'blockDynamicResizeResetDummy'
		},

		'LOCATION': {
			'CHANGE_START': '$locationChangeStart'
		}
	});
})();;
(function() {
    'use strict';

    var registry = angular.module('registry');

    registry.constant('ORDER_STATUSES', {
        'ORDER_DONE': {
            'TITLE': 'Заказ завершен'
        },

        'DUMMY_ORDER': {},

        'PAYMENT_FAILED': {
            'TITLE': 'Оплата не прошла!',

            'FULL_DESCRIPTION': 'К сожалению, полис не оформлен. Но вы можете завершить покупку, перейдя в личный кабинет.'
        },

        'INSURANCE_SERVICE_UNAVAILABLE': {
            'TITLE': 'Сервер страховщика не доступен!',

            'FULL_DESCRIPTION': 'К сожалению, в настоящий момент оформить полис компании &quot;${company_name}&quot;<br/>нельзя по техническим причинам.',

            'SUGGESTIONS': 'Пожалуйста, выберите предложение другого страховщика.'
        },

        'PAYMENT_MICROSERVICE_UNAVAILABLE': {
            'TITLE': 'Платежный сервис временно не доступен!',

            'FULL_DESCRIPTION': 'К сожалению, в настоящий момент по техническим причинам мы не можем сделать перенаправление на платежный сервис.',

            'SUGGESTIONS': 'Вы можете вернуться к оплате позже через личный кабинет.'
        },

        'DRAFT_FAILED': {
            'TITLE': 'Черновик полиса не создан!',

            'FULL_DESCRIPTION': 'К сожалению, в настоящий момент по техническим причинам оформить этот полис нельзя.',

            'SUGGESTIONS': 'Вы можете приобрести другой полис.'
        },

        'SOMETHING_GOES_WRONG': {
            'TITLE': 'Ошибка!',

            'FULL_DESCRIPTION': 'К сожалению, в настоящий момент что-то пошло не так, причина выясняется.',

            'SUGGESTIONS': 'Вы можете продолжить работу с сервисом с главной страницы или через личный кабинет.'
        },

        'CALCULATION_NOT_FOUND': {
            'TITLE': 'Расчёт не найден!',

            'FULL_DESCRIPTION': 'К сожалению, расчёт устарел.',

            'SUGGESTIONS': 'Вы можете вернуться на страницу выбора страховки и обновить предложения.'
        }
    });
})();;
(function() {
    'use strict';

    var registry = angular.module('registry');

    registry.constant('MACROS', {
        'COMPANY_NAME_MACRO' : '${company_name}'
    });
})();;
(function () {
    'use strict';

    var registry = angular.module('registry');

    registry.constant('MODULES', {
        'MAIN_PAGE': {
            'FOLDER': 'main-page',

            'CONTROLLERS': {
            	'MAIN_PAGE': 'MainPageController'
            },

            'TEMPLATES': {
            	'MAIN_PAGE': 'main-page.html',
            	'ABOUT_PAGE': 'about_page.html'
            }
        },

        'INNER_PAGES': {
            'FOLDER': 'inner-pages',

            'CONTROLLERS': {
                'TERMS_PAGE': 'TermsPageController'
            },

            'TEMPLATES': {
                'ABOUT_SERVICE_PAGE': 'about-service-page.html',

                'CONTACTS_PAGE': 'contacts-page.html',

                'TERMS_PAGE': 'terms-page.html'
            }
        },

        'SEARCH_RESULTS': {
            'FOLDER': 'search-results',

            'CONTROLLERS': {
                'SEARCH_RESULTS': 'SearchResultsController',

                'SEARCH_RESULT_ITEM_CONTROLLER': 'searchResultItemCtrl'
            },

            'TEMPLATES': {
                'SEARCH_RESULTS': 'search-results.html',

                'SEARCH_QUERY': 'search-query.html',

                'SEARCH_FILTER': 'search-filter.html'
            }
        },

        'TRIP_FORM': {
            'FOLDER': 'trip-form',

            'CONTROLLERS': {
                'TRIP_FORM': 'TripFormController'
            },

            'TEMPLATES': {
                'TRIP_FORM': 'trip-form.html'
            }
        },

        'ORDER_PREPARE': {
            'FOLDER': 'order-prepare',

            'CONTROLLERS': {
                'ORDER_PREPARE': 'OrderPrepareController'
            },

            'TEMPLATES': {
                'ORDER_PREPARE': 'order-prepare.html'
            }
        },

        'ORDER_PAYMENT': {
            'FOLDER': 'order-payment',

            'CONTROLLERS': {
                'ORDER_PAYMENT': 'OrderPaymentController'
            },

            'TEMPLATES': {
                'ORDER_PAYMENT': 'order-payment.html'
            }
        },

        'ORDER_RESULT': {
            'FOLDER': 'order-result',

            'CONTROLLERS': {
                'ORDER_DONE': 'OrderDoneController',

                'ORDER_FAIL': 'OrderFailController'
            },

            'TEMPLATES': {
                'ORDER_DONE': 'order-done.html',

                'ORDER_FAIL': 'order-fail.html'
            }
        },

        'PRIVATE_OFFICE': {
            'FOLDER': 'private-office',

            'CONTROLLERS': {
                'PRIVATE_OFFICE': 'privateOfficeController'
            },

            'TEMPLATES': {
                'PRIVATE_OFFICE': 'private-office.html'
            }
        },

        'UTILS': {
            'FOLDER': 'utils',

            'CONTROLLERS': {
                'PARTICIPANTS_CONTROL': 'participantsControlCtrl'
            }
        },

        'ADMIN_MONITOR': {
            'FOLDER': 'admin/monitor',

            'CONTROLLERS': {
                'ADMIN_MONITOR': 'adminMonitorController'
            },

            'TEMPLATES': {
                'ADMIN_MONITOR': 'monitor.html'
            }
        },

        'PARTNER': {
            'FOLDER': 'partner',

            'CONTROLLERS': {
                'PARTNER_CONTROLLER': 'PartnerController'
            },

            'TEMPLATES': {
                'PARTNER_TRADES': 'partner-trades.html'
            }
        },

        'PARTNER_LOGIN': {
            'FOLDER': 'partner-login',

            'CONTROLLERS': {
                'PARTNER_LOGIN': 'partnerLoginController'
            },

            'TEMPLATES': {
                'PARTNER_LOGIN': 'partner-login.html'
            }
        },

        'COMPARE_POLICIES': {
            'FOLDER': 'compare-policies',

            'CONTROLLERS': {
                'COMPARE_POLICIES': 'ComparePoliciesController'
            },

            'TEMPLATES': {
                'COMPARE_POLICIES': 'compare-policies.html'
            }
        }
    });
})();;
(function () {
	'use strict';

	var registry = angular.module('registry');

	var site = 'https://riskmarket-dev.sidenis.local';

	var internal = site + '/internal';

	registry.constant('REST_API', {

		'SITE' : site,

		'INSURANCE_CALCULATOR': internal + '/calculations/',

		'ORDER_DRAFT': internal + '/order',

		'ORDER_PURCHASE': internal + '/payment/link',

		"LOGIN": internal + '/login',

		"LOGOUT": internal + '/logout',

		"PING": internal + '/ping/',

		'AUTHENTICATION': site + 'internal',

		'PARTNER': internal + '/admin/monitor/partner_info',

		"USER": internal + '/current/user',

		"USER_ACCOUNT": internal + '/current/user/personal/account',

		"NEW_PASSWORD": internal + '/new/password',

		'COUNTRIES_LIST': internal + '/dictionary/countries',

		'RISK_FILTERS': internal + '/dictionary/risk_filters',

		'RISK_OPTIONS': internal + '/dictionary/special_terms/',

		'LATEST_BOUGHT_POLICY_DOWNLOAD': internal + '/downloads/bought/latest/policy',

		'PERSONAL_DATA_AGREEMENT': internal + '/downloads/license/agreement',

		'INSURANCE_COMPANIES': internal + '/dictionary/insurance-service-providers',

		'ASSISTANCE_COMPANIES': internal + '/dictionary/assistance-companies',

		'INSURED_DAYS': internal + '/dictionary/insured-days',

		'INSURANCE_TYPES': internal + '/dictionary/insurance-types',

		'PRIVATE_OFFICE': {
			'POLICIES_LIST': internal + '/private_office/all',

			'REMOVE_POLICY': internal + '/private_office/policy'
		},

		'ADMIN_MONITOR': {
			'POLICIES': internal + '/admin/monitor',

			"CSV": internal + '/admin/monitor/csv',

			"EXCEL": internal + '/admin/monitor/excel'

		},

		'CURRENCIES_SUM': internal + '/util/medical/expenses/currencies/and/sums/mappings',

		'CURRENT_TIME': internal + '/time',

		'PAYMENT_PROCESS_STARTED': internal + '/payment/process/started',

		'DRAFT_CREATE': internal + '/drafts'
	});
})
();;
(function() {
    'use strict';

    var registry = angular.module('registry');

    registry.constant('ROUTES', {
        'MAIN_PAGE': '/',

        'SEARCH_RESULTS': '/search-results',

        'ORDER_PREPARE': '/order-prepare',

        'ORDER_PAYMENT': '/order-payment',

        'ORDER_DONE': '/order-done',
			
        'ORDER_FAIL': '/order-fail',

        'PRIVATE_OFFICE': '/private-office',

        'ADMIN_MONITOR': '/admin.monitor',

        'ABOUT': '/about',

        'CONTACTS': '/contacts',

        'TERMS': '/terms',

        'PARTNER': '/partner',

        'PARTNER_LOGIN': '/partner-login',

        'COMPARE_POLICIES': '/compare-policies'
    });
})();;
(function() {
    'use strict';

    var registry = angular.module('registry');

    registry.constant('STRUCTURE', {
        'MODULES': 'modules',

        'CONTROLLERS': 'controllers',

        'CONSTANTS': 'constants',

        'SERVICES': 'services',

        'PROVIDERS': 'providers',

        'FACTORIES': 'factories',

        'TEMPLATES': 'partials',

        'DOWNLOADS': 'downloads'
    });
})();;
(function() {
    'use strict';

    var registry = angular.module('registry');

    registry.constant('TEXT_LABELS', {
        'INSURANCE_DOCUMENT': {
            'MULTIPLE': 'Многократная',

            'SINGLE': 'Однократная'
        },

        'SELECTABLE_ITEMS': {
					'COUNTRIES': {
						'INTERACTIVE_BTN': 'Карта',

            'TIPS_LABEL': 'Например:',

						'TIPS': [
							'Весь мир',

							'Шенген',

							'Финляндия'
						]
					}
				},

	      'TOOLTIPS': {
		      'COMPARED_ITEM': {
			      'ADD': 'Добавить к сравнению',

			      'REMOVE': 'Убрать из сравнения'
		      }
	      }
    });
})();;
(function() {
  'use strict';

  var registry = angular.module('registry');

  registry.constant('BUSINESS_ENTITIES', {
  	'MAIN_PAGE': 'main-page',

  	'TEXT_PAGE': 'text-page',

    'TRIP_FORM': 'trip-form',

    'SEARCH_RESULTS': 'search-results',

    'ORDER_PREPARE': 'order-prepare',

    'ORDER_PAYMENT': 'order-payment',

    'ORDER_DONE': 'order-done',

    'ORDER_FAIL': 'order-fail',

    'PRIVATE_OFFICE': 'private-office',

    'ABOUT_PAGE': 'about-page',

    'CONTACTS_PAGE': 'contacts-page',

    'TERMS_PAGE': 'terms-page',

    'PARTNER': 'partner',

    'PARTNER_LOGIN': 'partner-login',

    'COMPARE_POLICIES': 'compare-policies'
  });
})();;
(function() {
	'use strict';

	var registry = angular.module('registry');

	registry.constant('PAGE_BG_RANDOM', {
		'IMG_FOLDER': 'img/min/background-collection/',

		'IMG_QUANTITY': 4
	});
})();;
(function () {
    'use strict';

    var registry = angular.module('registry');

    registry.constant('PAGE_META', {
        'DEFAULT': {
            'TITLE': 'RiskMarket - сервис онлайн страхования и надёжного хранения полисов'
        },

        'TERMS_PAGE': {
            'TITLE': 'Пользовательское соглашение РискМаркета'
        }
    });
})();
;
(function() {
	var registry = angular.module('registry');

	registry.constant('REGEXP', {
		'YANDEX_WEBVISOR_FRAME_URL_FRAGMENT': /yandex\.net/i,

		'EMAIL': /^[\w\.\-\\']+@[\w\-]+(?:(?:\.[\w\-]+)?){1,}\.[a-z]{2,6}$/i,

		'NUMBER': /^\d+$/,

		'ALLOWED_STATE_FOR_RAW_NAME': /^[a-z]+(?:([\s\'\-])(?!\1)(?:[a-z]+)?)?(?:\1(?!\1)(?:[a-z]+)?)?$/i,

		'ALLOWED_STATE_FOR_RESULT_NAME': /^[a-z]{1,15}((?:\'|\-|\s)?[a-z]{0,15}){1,2}[a-z]{1,15}$/i,

		'DURATION_MEASURE_UNIT': /ms/i
	});
})();;
(function() {
	'use strict';

	var registry = angular.module('registry');

	registry.constant('UX', {
		'SCROLLING': {
			'TIME': 500,

			'EASING': 'swing',

			'DEFAULT_TOP_SCROLLING': 0,

			'AUTO_SCROLLING_DURATION_ON_SEARCH_RESULT_PAGE': 300
		},

		'HIDE': {
			'RESTORE_PASSWORD_BLOCK': {
				'DELAY': 5000
			}
		}
	});
})();;
(function() {
	var registry = angular.module('registry');

	registry.constant('KEYBOARD', {
		'ESC': 27,

		'ENTER': 13,

		'SPACE': 32,

		'ZERO': 48,

		'NINE': 57,

		'ARROW_UP': 38,

		'ARROW_DOWN': 40,

		'TAB': 9
	});
})();;
(function () {
    'use strict';

    var registry = angular.module('registry');

    registry.constant('CURRENCY_SYMBOLS', {
        USD: '$',

        EUR: '€',

        RUB: 'a'
    });
})();;
(function () {
    'use strict';

    var registry = angular.module('registry');

    registry.constant('SEARCH_RES_ICONS', {
        'ALL_PARAMS_ICON': 'img/min/search-result/arrow-down.png'
    });

    registry.constant('VENDOR_LOGO', {
        'CLASS': 'img/min/search/class-assistance.png'
    });
})();;
(function () {
    'use strict';

    var registry = angular.module('registry');

    registry.constant('TERRITORY_BLOCK', {
        'MAX_SYMBOLS': 62,

        'ITEM_SUGGESTION_HEIGHT': 30
    });
})();
;
(function() {
  'use strict';

  var registry = angular.module('registry');

  registry.constant('LOCALES', {
    'RU': 'ru-Latn'
  });
})();;
(function() {
	'use strict';

	var registry = angular.module('registry');

	registry.constant('POLICY_STRUCTURE', {
		TYPES: {
			ANY: {
				categoryLabel: 'Все полисы',

				priority: 0,

				serviceLabel: 'any',

				showItemsQuantity: false
			},

			DRAFT: {
				categoryLabel: 'Черновики',

				itemLabel: 'Черновик',

				priority: 3,

				compositionPriority: 1,

				actionLabel: 'Оформить',

				serviceLabel: 'draft',

				showItemsQuantity: false
			},

			PAID: {
				categoryLabel: 'Действующие',

				itemLabel: 'Действует',

				priority: 2,

				compositionPriority: 1,

				actionLabel: 'Скачать',

				serviceLabel: 'paid',

				showItemsQuantity: false
			},

			PAYMENT_PENDING: {
				categoryLabel: 'Ожидающие оплаты',

				itemLabel: 'Ожидает оплаты',

				priority: 1,

				compositionPriority: 0,

				serviceLabel: 'payment-pending',

				actionLabel: 'Оплатить',

				showItemsQuantity: true
			}
		},
		
		POLICY_FIELDS: {
			TYPE: 'status'
		}
	});
})();;
(function() {
	'use strict';

	var registry = angular.module('registry');

	registry.constant('USER_TYPES', {
		'CLIENT': 'CLIENT',

		'PARTNER': 'PARTNER',

		'ADMIN': 'ADMIN'
	});
})();;
(function() {
	'use strict';

	var registry = angular.module('registry');

	registry.constant('WARNINGS', {
		'LOGIN_FORM': {
			'USER_NOT_FOUND': 'Пользователя с таким email не существует',

			'LOGIN_ERROR': 'Неверный логин или пароль',

			'PASSWORD_RESTORED': 'На указанный email выслан новый пароль'
		}
	});
})();;
(function() {
	'use strict';

	var registry = angular.module('registry');

	registry.constant('MASKS', {
		'DATE': {
			'EMPTY': '__.__.____',

			'DEFAULT': 'дд.мм.гггг'
		}
	});
})();
;
(function() {
	'use strict';

	var registry = angular.module('registry');

	registry.constant('INSURANCE_COMPANIES', {
		'VTB': {
			'LABEL': 'VTB'
		},

		'ALFA': {
			'LABEL': 'ALFA'
		}
	});
})();;
(function() {
	'use strict';

	var registry = angular.module('registry');

	registry.constant('TRUSTED_ORIGINS', {
		'AKANO': 'https://www.akano.ru',

		'SPRINT.AKANO': 'https://sprint.akano.ru',

		'RAVTA': 'https://ravta.ru',

		'DEV': 'https://riskmarket-dev.sidenis.local',

		'QA': 'https://riskmarket-qa.sidenis.local',

		'TRAIN': 'https://riskmarket-train.sidenis.local',

		'TEST': 'https://test.riskmarket.ru',

		'SIDENIS': 'https://riskmarket.sidenis.com',

		'RISKMARKET': 'https://riskmarket.ru'
	});
})();;
(function() {
	'use strict';

	var registry = angular.module('registry');

	registry.constant('VENDOR_COMPANIES', {
		CLASS_ASSISTANCE: 'class-assistance',

		SAVITAR_GROUP: 'savitar-group',

		GVA : 'gva',

		AP_COMPANIES : 'ap-companies'
	});
})();
;
(function() {
	'use strict';
	
	var registry = angular.module('registry');
	
	registry.constant('ANIMATED_CLASSES', [
		'search-result-params',

		'search-result-container',

		'btn-nav',

		'restore',

		'filter-container',

		'policy-item'
	]);
})();;
(function() {
	'use strict';

	var registry = angular.module('registry');

	// Path to img folder is resolving related to index.html

	var picturesFolderPath = '../img/min';

	registry.constant('PICTURE_PATH_TEMPLATES', {
		vendorCompany: {
			path: picturesFolderPath + '/search',

			ext: 'png'
		}
	});
})();;
(function() {
    'use strict';

    angular.module('utils', []);
})();;
(function() {
  'use strict';

  var utils = angular.module('utils');

  utils.directive('classAt', [
	'EVENTS',

	function(EVENTS) {
	  return {
		restrict: 'A',

		link: function(scope, element, attributes) {
		  var classAtMap = scope.$eval(attributes.classAt);

		  var classAtHelper = {
			getClasses: function() {
			  return Object.keys(classAtMap);
			},

			setMatchedClasses: function(route) {
			  var classesList = this.getClasses();

			  element.removeClass(classesList.join(' '));

			  var businessEntity = route.businessEntity;

			  var matchedClassesList = classesList.map(function(cssClass) {
				return classAtMap[cssClass].indexOf(businessEntity) !== -1 ? cssClass : '';
			  });

			  element.addClass(matchedClassesList.join(' '));
			}
		  };

		  scope.$on(EVENTS.ROUTE.CHANGE_SUCCESS, function(event, route) {
			classAtHelper.setMatchedClasses(route);
		  });
		}
	  };
  	}
  ]);
})();;
// Enhanced copy of ngSticky directive

(function () {
  'use strict';

  var utils = angular.module('utils');

  /**
   * Directive: sticky
   */

  utils.directive('smartSticky', ['$window', '$timeout', function ($window, $timeout) {
      return {
        restrict: 'A', // this directive can only be used as an attribute.
        scope: {
          disabled: '=disabledSticky'
        },
        link: function linkFn($scope, $elem, $attrs) {
          // Setting scope
          var scrollableNodeTagName = "sticky-scroll"; // convention used in the markup for annotating scrollable container of these stickies
          var stickyLine;
          var stickyBottomLine = 0;
          var placeholder;
          var isSticking = false;
          var originalOffset;

          // Optional Classes
          var stickyClass = $attrs.stickyClass || '';
          var unstickyClass = $attrs.unstickyClass || '';
          var bodyClass = $attrs.bodyClass || '';
          var bottomClass = $attrs.bottomClass || '';

          // Find scrollbar
          var scrollbar = deriveScrollingViewport ($elem);

          // Define elements
          var windowElement = angular.element($window);
          var scrollbarElement = angular.element(scrollbar);
          var $body = angular.element(document.body);

          // Define options
          var usePlaceholder = ($attrs.usePlaceholder !== 'false');
          var anchor = $attrs.anchor === 'bottom' ? 'bottom' : 'top';
          var confine = ($attrs.confine === 'true');
          // flag: can react to recalculating the initial CSS dimensions later as link executes prematurely. defaults to immediate checking
          var isStickyLayoutDeferred = $attrs.isStickyLayoutDeferred !== undefined ? ($attrs.isStickyLayoutDeferred === 'true') : false;

          // flag: is sticky content constantly observed for changes. Should be true if content uses ngBind to show text that may vary in size over time
          var isStickyLayoutWatched = $attrs.isStickyLayoutWatched !== undefined ? ($attrs.isStickyLayoutWatched === 'true') : true;
          var initialPosition = $elem.css('position'); // preserve this original state

          var offset = $attrs.offset ? parseInt ($attrs.offset.replace(/px;?/, '')) : 0;
          var onStickyContentLayoutHeightWatchUnbind;

          // initial style
          var initialStyle = $elem.attr('style') || '';
          var initialCSS;
          var originalInitialCSS;

          /**
           * Initialize Sticky
           */
          var initSticky = function() {
            // Listeners
            scrollbarElement.on('scroll', checkIfShouldStick);
            windowElement.on('resize', $scope.$apply.bind($scope, onResize));

            memorizeDimensions (); // remember sticky's layout dimensions

            // Setup watcher on digest and change
            $scope.$watch(onDigest, onChange);

            // Clean up
            $scope.$on('$destroy', onDestroy);
          };

          /**
           * need to recall sticky's DOM attributes ( make sure layout has occured)
           */
          function memorizeDimensions() {
            // immediate assignment, but there is the potential for wrong values if content not ready
            initialCSS = $scope.calculateStickyContentInitialDimensions ();

            // option to calculate the dimensions when layout is "ready"
            if (isStickyLayoutDeferred) {

              // logic: when this directive link() runs before the content has had a chance to layout on browser, height could be 0
              if (!$elem[0].getBoundingClientRect().height) {

                onStickyContentLayoutHeightWatchUnbind = $scope.$watch(
                  function() {
                    return $elem.height();
                  },

                  // state change: sticky content's height set
                  function onStickyContentLayoutInitialHeightSet(newValue, oldValue) {
                    if (newValue > 0) {
                      // now can memorize
                      initialCSS = $scope.calculateStickyContentInitialDimensions ();

                      if (!isStickyLayoutWatched) {
                        // preference was to do just a one-time async watch on the sticky's content; now stop watching
                        onStickyContentLayoutHeightWatchUnbind ();
                      }
                    }
                  }
                );
              }

              // any processing for when sticky layout is immediate
            }
          }

          /**
           * Determine if the element should be sticking or not.
           */
          var checkIfShouldStick = function() {
            // Check media query and disabled attribute
            if ($scope.disabled === true || mediaQueryMatches ()) {
              if(isSticking) unStickElement ();
              return false;
            }

            // What's the document client top for?
            var scrollbarPosition = scrollbarYPos();
            var shouldStick;

            if (anchor === 'top') {
              if (confine === true) {
                shouldStick = scrollbarPosition > stickyLine && scrollbarPosition <= stickyBottomLine;
              } else {
                shouldStick = scrollbarPosition > stickyLine;
              }
            } else {
              shouldStick = scrollbarPosition <= stickyLine;
            }

            // Switch the sticky mode if the element crosses the sticky line
            // $attrs.stickLimit - when it's equal to true it enables the user
            // to turn off the sticky function when the elem height is
            // bigger then the viewport
            var closestLine = getClosest (scrollbarPosition, stickyLine, stickyBottomLine);



            if (shouldStick && !shouldStickWithLimit ($attrs.stickLimit) && !isSticking) {
              stickElement (closestLine);
            } else if (!shouldStick && isSticking) {
              unStickElement(closestLine, scrollbarPosition);
            } else if (confine && !shouldStick) {
              // If we are confined to the parent, refresh, and past the stickyBottomLine
              // We should "remember" the original offset and unstick the element which places it at the stickyBottomLine
              originalOffset = elementsOffsetFromTop ($elem[0]);

              unStickElement (closestLine, scrollbarPosition);
            }
          };

          /**
           * determine the respective node that handles scrolling, defaulting to browser window
           */
          function deriveScrollingViewport(stickyNode) {
            // derive relevant scrolling by ascending the DOM tree
            var match =findAncestorTag (scrollableNodeTagName, stickyNode);
            return (match.length === 1) ? match[0] : $window;
          }

          /**
           * since jqLite lacks closest(), this is a pseudo emulator ( by tag name )
           */
          function findAncestorTag(tag, context) {
            var m = [], // nodelist container
              n = context.parent(), // starting point
              p;

            do {
              var node = n[0]; // break out of jqLite
              // limit DOM territory
              if (node.nodeType !== 1) {
                break;
              }

              // success
              if (node.tagName.toUpperCase() === tag.toUpperCase()) {
                return n;
              }

              p = n.parent();
              n = p; // set to parent
            } while (p.length !== 0);

            return m; // empty set
          }

          /**
           * Seems to be undocumented functionality
           */
          function shouldStickWithLimit(shouldApplyWithLimit) {
            if (shouldApplyWithLimit === 'true') {
              return ($window.innerHeight - ($elem[0].offsetHeight + parseInt (offset)) < 0);
            } else {
              return false;
            }
          }

          /**
           * Finds the closest value from a set of numbers in an array.
           */
          function getClosest(scrollTop, stickyLine, stickyBottomLine) {
            var closest = 'top';
            var topDistance = Math.abs(scrollTop - stickyLine);
            var bottomDistance = Math.abs(scrollTop - stickyBottomLine);

            if (topDistance > bottomDistance) {
              closest = 'bottom';
            }

            return closest;
          }

          /**
           * Unsticks the element
           */
          function unStickElement(fromDirection) {
            $elem.attr('style', initialStyle);
            isSticking = false;

            $body.removeClass(bodyClass);
            $elem.removeClass(stickyClass);
            $elem.addClass(unstickyClass);

            if (fromDirection === 'top') {
              $elem.removeClass(bottomClass);

              $elem
                .css('z-index', 10)
                .css('width', $elem[0].offsetWidth)
                .css('top', initialCSS.top)
                .css('position', initialCSS.position)
                .css('left', initialCSS.cssLeft)
                .css('margin-top', initialCSS.marginTop)
                .css('height', initialCSS.height);
            } else if (fromDirection === 'bottom' && confine === true) {
              $elem.addClass(bottomClass);

              // It's possible to page down page and skip the "stickElement".
              // In that case we should create a placeholder so the offsets don't get off.
              createPlaceholder();

              $elem
                .css('z-index', 10)
                .css('width', $elem[0].offsetWidth)
                .css('top', '')
                .css('bottom', 0)
                .css('position', 'absolute')
                .css('left', initialCSS.cssLeft)
                .css('margin-top', initialCSS.marginTop)
                .css('margin-bottom', initialCSS.marginBottom)
                .css('height', initialCSS.height);
            }

            if (placeholder && fromDirection === anchor) {
              placeholder.remove();
            }
          }

          /**
           * Sticks the element
           */
          function stickElement(closestLine) {
            // Set sticky state
            isSticking = true;
            $timeout( function() {
              initialCSS.offsetWidth = $elem[0].offsetWidth;
            }, 0);
            $body.addClass(bodyClass);
            $elem.removeClass(unstickyClass);
            $elem.removeClass(bottomClass);
            $elem.addClass(stickyClass);

            createPlaceholder();

            $elem
              .css('z-index', '10')
              .css('width', $elem[0].offsetWidth + 'px')
              .css('position', 'fixed')
              .css('left', $elem.css('left').replace('px', '') + 'px')
              .css(anchor, (offset + elementsOffsetFromTop (scrollbar)) + 'px')
              .css('margin-top', 0);

            if (anchor === 'bottom') {
              $elem.css('margin-bottom', 0);
            }
          }

          /**
           * Clean up directive
           */
          var onDestroy = function() {
            scrollbarElement.off('scroll', checkIfShouldStick);
            windowElement.off('resize', onResize);


            $body.removeClass(bodyClass);

            if (placeholder) {
              placeholder.remove();
            }
          };

          /**
           * Updates on resize.
           */
          var onResize = function() {
            unStickElement (anchor);
            checkIfShouldStick ();
          };

          /**
           * Triggered on load / digest cycle
           */
          var onDigest = function() {
            if ($scope.disabled === true) {
              return unStickElement ();
            }

            if (anchor === 'top') {
              return (originalOffset || elementsOffsetFromTop ($elem[0])) - elementsOffsetFromTop (scrollbar) + scrollbarYPos ();
            } else {
              return elementsOffsetFromTop ($elem[0]) - scrollbarHeight () + $elem[0].offsetHeight + scrollbarYPos ();
            }
          };

          /**
           * Triggered on change
           */
          var onChange = function (newVal, oldVal) {
            if (( newVal !== oldVal || typeof stickyLine === 'undefined' ) &&
              (!isSticking && !isBottomedOut()) && newVal !== 0) {
              stickyLine = newVal - offset;

              // IF the sticky is confined, we want to make sure the parent is relatively positioned,
              // otherwise it won't bottom out properly
              if (confine) {
                $elem.parent().css({
                  'position': 'relative'
                });
              }

              // Get Parent height, so we know when to bottom out for confined stickies
              var parent = $elem.parent()[0];
              // Offset parent height by the elements height, if we're not using a placeholder
              var parentHeight = parseInt (parent.offsetHeight) - (usePlaceholder ? 0 : $elem[0].offsetHeight);

              // and now lets ensure we adhere to the bottom margins
              // TODO: make this an attribute? Maybe like ignore-margin?
              var marginBottom = parseInt ($elem.css('margin-bottom').replace(/px;?/, '')) || 0;

              // specify the bottom out line for the sticky to unstick
              var elementsDistanceFromTop = elementsOffsetFromTop ($elem[0]);
              var parentsDistanceFromTop = elementsOffsetFromTop (parent)
              var scrollbarDistanceFromTop = elementsOffsetFromTop (scrollbar);

              var elementsDistanceFromScrollbarStart = elementsDistanceFromTop - scrollbarDistanceFromTop;
              var elementsDistanceFromBottom = parentsDistanceFromTop + parentHeight - elementsDistanceFromTop;

              stickyBottomLine = elementsDistanceFromScrollbarStart + elementsDistanceFromBottom - $elem[0].offsetHeight - marginBottom - offset + +scrollbarYPos ();

              checkIfShouldStick ();
            }
          };

          /**
           * Helper Functions
           */

          /**
           * Create a placeholder
           */
          function createPlaceholder() {
            if (usePlaceholder) {
              // Remove the previous placeholder
              if (placeholder) {
                placeholder.remove();
              }

              placeholder = angular.element('<div>');
              placeholder.css('height', $elem[0].offsetHeight + 'px');

              $elem.after(placeholder);
            }
          }

          /**
           * Are we bottomed out of the parent element?
           */
          function isBottomedOut() {
            if (confine && scrollbarYPos() > stickyBottomLine) {
              return true;
            }

            return false;
          }

          /**
           * Fetch top offset of element
           */
          function elementsOffsetFromTop(element) {
            var offset = 0;

            if (element.getBoundingClientRect) {
              offset = element.getBoundingClientRect().top;
            }

            return offset;
          }

          /**
           * Retrieves top scroll distance
           */
          function scrollbarYPos() {
            var position;

            if (typeof scrollbar.scrollTop !== 'undefined') {
              position = scrollbar.scrollTop;
            } else if (typeof scrollbar.pageYOffset !== 'undefined') {
              position = scrollbar.pageYOffset;
            } else {
              position = document.documentElement.scrollTop;
            }

            return position;
          }

          /**
           * Determine scrollbar's height
           */
          function scrollbarHeight() {
            var height;

            if (scrollbarElement[0] instanceof HTMLElement) {
              // isn't bounding client rect cleaner than insane regex mess?
              height = $window.getComputedStyle(scrollbarElement[0], null)
                .getPropertyValue('height')
                .replace(/px;?/, '');
            } else {
              height = $window.innerHeight;
            }

            return parseInt (height) || 0;
          }

          /**
           * Checks if the media matches
           */
          function mediaQueryMatches() {
            var mediaQuery = $attrs.mediaQuery || false;
            var matchMedia = $window.matchMedia;

            return mediaQuery && !(matchMedia ('(' + mediaQuery + ')').matches || matchMedia (mediaQuery).matches);
          }

          // public accessors for the controller to hitch into. Helps with external API access
          $scope.getElement = function() { return $elem; };
          $scope.getScrollbar = function() { return scrollbar; };
          $scope.getInitialCSS = function() { return initialCSS; };
          $scope.getAnchor = function() { return anchor; };
          $scope.isSticking = function() { return isSticking; };
          $scope.getOriginalInitialCSS = function() { return originalInitialCSS; };
          // pass through aliases
          $scope.processUnStickElement = function(anchor){ unStickElement(anchor)};
          $scope.processCheckIfShouldStick =function() { checkIfShouldStick(); };

          /**
           * set the dimensions for the defaults of the content block occupied by the sticky element
           */
          $scope.calculateStickyContentInitialDimensions = function() {
            return {
              zIndex: $elem.css('z-index'),
              top: $elem.css('top'),
              position: initialPosition, // revert to true initial state
              marginTop: $elem.css('margin-top'),
              marginBottom: $elem.css('margin-bottom'),
              cssLeft: $elem.css('left'),
              height: $elem.css('height')
            };
          };

          /**
           * only change content box dimensions
           */
          $scope.updateStickyContentUpdateDimensions = function(width, height) {
            if (width && height) {
              initialCSS.width = width + "px";
              initialCSS.height = height + "px";
              // if a dimensionless pair of arguments was supplied.
            }
          };

          // ----------- configuration -----------

          $timeout( function() {
            originalInitialCSS = $scope.calculateStickyContentInitialDimensions(); // preserve a copy
            // Init the directive
            initSticky();
          },0);
        },

        /**
         * +++++++++ public APIs+++++++++++++
         */
        controller: ['$scope', '$window', function($scope, $window) {

          /**
           * integration method allows for an outside client to reset the pinned state back to unpinned.
           * Useful for when refreshing the scrollable DIV content completely
           * if newWidth and newHeight integer values are not supplied then function will make a best guess
           */
          this.resetLayout = function(newWidth, newHeight) {

            var scrollbar = $scope.getScrollbar(),
              initialCSS = $scope.getInitialCSS(),
              anchor = $scope.getAnchor();

            function _resetScrollPosition() {

              // reset means content is scrolled to anchor position
              if (anchor === "top") {
                // window based scroller
                if (scrollbar === $window) {
                  $window.scrollTo(0, 0);
                  // DIV based sticky scroller
                } else {
                  if (scrollbar.scrollTop > 0) {
                    scrollbar.scrollTop = 0;
                  }
                }
              }
              // todo: need bottom use case
            }

            // only if pinned, force unpinning, otherwise height is inadvertently reset to 0
            if ($scope.isSticking()) {
              $scope.processUnStickElement (anchor);
              $scope.processCheckIfShouldStick ();
            }
            // remove layout-affecting attribures that were modified by this sticky
            $scope.getElement().css({"width": "", "height": "", "position": "", "top": "", zIndex: ""});
            // model resets
            initialCSS.position = $scope.getOriginalInitialCSS().position; // revert to original state
            delete initialCSS.offsetWidth; // stickElement affected

            // use this directive element's as default, if no measurements passed in
            if (newWidth === undefined && newHeight === undefined) {
              var e_bcr = $scope.getElement()[0].getBoundingClientRect();
              newWidth = e_bcr.width;
              newHeight = e_bcr.height;
            }

            // update model with new dimensions ( if supplied from client's own measurement )
            $scope.updateStickyContentUpdateDimensions(newWidth, newHeight); // update layout dimensions only

            _resetScrollPosition ();
          };

          /**
           * return a reference to the scrolling element ( window or DIV with overflow )
           */
          this.getScrollbar = function() {
            return $scope.getScrollbar();
          };
        }]
      };
    }]
  );

  // Shiv: matchMedia
  window.matchMedia = window.matchMedia || (function () {
      var warning = 'angular-sticky: This browser does not support ' +
        'matchMedia, therefore the minWidth option will not work on ' +
        'this browser. Polyfill matchMedia to fix this issue.';

      if (window.console && console.warn) {
        console.warn(warning);
      }

      return function () {
        return {
          matches: true
        };
      };
    }());
}());
;
(function() {
	'use strict';
	
	var utils = angular.module('utils');
	
	utils.directive('dummyLink', function() {
		return {
			restrict: 'A',
			
			link: function(scope, element) {
				element.on('click', function(event) {
					event.stopPropagation();
					
					event.preventDefault();
				});
			}
		};
	});
})();;
(function() {
	'use strict';

	var utils = angular.module('utils');

	utils.directive('mainPageBgRandom',['PAGE_BG_RANDOM', function(PAGE_BG_RANDOM) {
		return {
			restrict: 'A',

			link: function(scope, element) {
				var bgImgUrl = PAGE_BG_RANDOM.IMG_FOLDER
												+ Math.floor(Math.random() * PAGE_BG_RANDOM.IMG_QUANTITY)
												+ ".jpg";

				element.css('background-image', 'url(' + bgImgUrl + ')');
			}
		};
	}]);
})();;
(function() {
	'use strict';

	var utils = angular.module('utils');

	utils.directive('popoverClose', ['EVENTS', function(EVENTS){
		return{
			scope: {
				excludeClass: '@'
			},

			link: function(scope, element) {
				var excludeClass = "exclude";

				function closePopover(event) {
					var eTarget = $(event.target);

					if(eTarget.hasClass('close-popover-btn')) {
						eTarget.closest('.popover').siblings('[data-popover-elem]').first().click();
					} else if(!eTarget.hasClass('trigger') && !eTarget.parents().hasClass(excludeClass)) {
						$('.trigger').click().removeClass('trigger');
					}
				}

				element.on('click', closePopover);

				scope.$on(EVENTS.SCOPE.DESTROY, function() {
					element.off('click', closePopover);
				});
			}
		};
	}]);
})();;
(function() {
	'use strict';

	var utils = angular.module('utils');

	utils.directive('popoverElem', ['EVENTS', function(EVENTS) {
		return {
			link: function(scope, element) {
				function addTriggerClasses() {
					element.toggleClass('trigger').siblings('.popover').addClass('exclude');
				}

				element.on('click', addTriggerClasses);

				scope.$on(EVENTS.SCOPE.DESTROY, function() {
					element.off('click', addTriggerClasses);
				});
			}
		};
	}]);
})();;
(function() {
	'use strict';
	
	var utils = angular.module('utils');
	
	utils.directive('focusStyling', function() {
		return {
			link: function(scope, element, attrs) {
				var focusStyling = scope.$eval(attrs.focusStyling);
				
				element.focusin(function() {
					$(this).addClass(focusStyling.class);
				});
				
				element.focusout(function() {
					$(this).removeClass(focusStyling.class);
				});
			}
		};
	});
})();;
(function () {
	'use strict';

	var utils = angular.module('utils');
	utils.directive('imgSvg', ['$http',function ($http) {
		return {
			restrict: 'A',
			link: function (scope, element, attrs) {
				var src = attrs.src;
				var manipulateImgNode = function (data, elem) {
					var xml = $.parseXML(data);
					var $svg = $(xml).find('svg');
					var imgClass = elem.attr('class');
					if (typeof(imgClass) !== 'undefined') {
						$svg.attr("class", imgClass);
					}
					return $svg;
				};
				$http.get(src, { 'Content-Type': 'application/xml' }).then(function (data) {
					element.replaceWith(manipulateImgNode(data.data, element));
				});
			}
		};
	}]);
})();;
(function() {
	'use strict';
	
	var utils = angular.module('utils');
	
	utils.directive('inputMask', function() {
		return {
			restrict: 'A',
			
			require: 'ngModel',
			
			scope: {
				model: '=ngModel',
				
				pattern: '@ngPattern'
			},
			
			link: function(scope, element, attrs, ngModelController) {
				element.on('input', function(event) {
					var viewValue = element.val();
					
					var viewValueLength = viewValue.length;
					
					var inputMaskLength = attrs.inputMask.length;
					
					if( viewValueLength < inputMaskLength ) {
						var composedValue = viewValue + attrs.inputMask.slice(viewValueLength);
					}
				});
			}
		};
	});
})();;
(function () {
    'use strict';

    var utils = angular.module('utils');
    var regex = /^[A-Z a-z\-']+$/;
    utils.directive('latinLetters', function () {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, elm, attrs, ctrl) {
                ctrl.$validators.latinLetters = function (modelValue, viewValue) {
                    return ctrl.$isEmpty(modelValue) || regex.test(viewValue);
                };
            }
        };
    });
})();;
(function() {
    'use strict';

    var utils = angular.module('utils');

    utils.directive('nameValidation', [
        'EVENTS',

        '$log',

        'REGEXP',

        function(
          EVENTS,

          $log,

          REGEXP
        ) {
        return {
            restrict: 'A',

            require: 'ngModel',

            link: function (scope, elm, attrs, ctrl) {
                var currentValue;

                var previousValue;

                var cursorPosition;

                var inputValueHandler = function(e) {
                    cursorPosition = e.target.selectionStart;

                    currentValue = elm.val();

                    if( currentValue === previousValue ) {
                        $log.warn('Name validation. Previous value and current value are the same. Doing nothing');

                        return;
                    }

                    var validationResult = REGEXP.ALLOWED_STATE_FOR_RAW_NAME.test(currentValue);

                    if( validationResult ) {
                        currentValue = currentValue.toUpperCase();

                        previousValue = currentValue;
                    } else {
                        if( !currentValue ) {
                            previousValue = '';
                        } else {
                            currentValue = previousValue;
                        }

                        cursorPosition--;
                    }

                    ctrl.$setViewValue(currentValue);

                    ctrl.$modelValue = ctrl.$viewValue;

                    ctrl.$render();

                    e.target.selectionEnd = cursorPosition;
                };

                var inputFocusHandler = function() {
                    previousValue = elm.val();
                };

                var inputBlurHandler = function() {
                    if( currentValue ) {
                        ctrl.$setViewValue(currentValue.trim());

                        ctrl.$setValidity('nameValidation', REGEXP.ALLOWED_STATE_FOR_RESULT_NAME.test(ctrl.$viewValue));

                        ctrl.$modelValue = ctrl.$viewValue;

                        ctrl.$render();

                        scope.$apply();
                    }
                };

                elm
                  .on(EVENTS.ELEMENT.FOCUS, inputFocusHandler)

                  .on(EVENTS.ELEMENT.INPUT, inputValueHandler)

                  .on(EVENTS.ELEMENT.BLUR, inputBlurHandler);

                scope.$on(EVENTS.SCOPE.DESTROY, function() {
                    elm
                      .off(EVENTS.ELEMENT.INPUT, inputValueHandler)

                      .off(EVENTS.ELEMENT.FOCUS, inputFocusHandler)

                      .off(EVENTS.ELEMENT.BLUR, inputBlurHandler);
                });
            }
        };
    }]);
})();;
(function() {
    'use strict';

    var utils = angular.module('utils');

    utils.directive('lazySubmit', ['frameManager', function(frameManager) {
        return {
            restrict: 'A',

            link: function(scope, element, attrs) {
                // Do nothing in case if application is in the iFrame mode

                if( frameManager.isAppInFrameMode() ) {
                    return;
                }

                attrs.$observe('lazySubmit', function(value) {
                    var permission = scope.$eval(value);

                    !!permission && element.submit();
                });
            }
        };
    }]);
})();;
(function () {
	'use strict';

	var utils = angular.module('utils');

	utils.controller(
		'participantsControlCtrl',

		[
			'$scope',

			'$dateParser',

			'EVENTS',

			'KEYBOARD',

			'DATE_FORMAT',

			'PARTICIPANT_MAX_AGE',

			function ($scope,
			          $dateParser,
			          EVENTS,
			          KEYBOARD,
			          DATE_FORMAT,
			          PARTICIPANT_MAX_AGE) {
				$scope.showControls = false;

				// Default scope state - is untouched (pristine)

				$scope.touched = false;

				$scope.isParticipantAgeAllowed = true;

				/**
				 * Helper method for touching context (as analogy - setting model as $dirty)
				 * @param {Object} context
				 */

				function touch(context) {
					context.touched = true;
				}

				// By default there is only one user added in there is no other passengers

				if (!$scope.participants.length) {
					$scope.participants.push(
						{
							birthDate: undefined,

							touched: false,

							isValid: false
						}
					);
				}

				/**
				 * Helper method for adding new tourist to the passengers queue
				 */

				$scope.addParticipant = function () {
					$scope.participants.push(
						{
							birthDate: undefined,

							touched: false,

							dirty: false,

							isValid: true
						}
					);
				};

				/**
				 * Helper method for removing passenger from passengers queue (with the following checks of
				 * all passengers for validity)
				 * @param {Number} participantIndex passenger's index in the passengers array
				 */

				$scope.removeParticipant = function (participantIndex) {
					$scope.participants.splice(participantIndex, 1);

					$scope.checkParticipants($scope.participants);
				};

				// Default widget placeholder

				$scope.totalPassengersLabel = 'Кто едет';

				/**
				 * Helper method for checking quantity of valid passengers (valid, touched and with
				 * birth date other than undefined)
				 * @returns {Number} result quantity of valid passengers
				 */

				function howManyIsValid() {
					return $scope.participants.reduce(function (total, participant) {
						return total + (!!participant.isValid && !!participant.birthDate && participant.touched);
					}, 0);
				}

				/**
				 * Helper method for setting correct passengers suffix (singular / plural) in Russian
				 * @param {Number} quantity passengers quantity
				 * @returns {String} result concatenation of passengers phrase with correct suffix
				 */

				function getPersonsQuantityLabel(quantity) {
					var base = 'турист';

					var result = '';

					switch (quantity) {
						case 0:
							result = 'Кто едет';

							break;

						case 1:
							result = quantity + ' ' + base;

							break;

						case 2:
						case 3:
						case 4:
							result = quantity + ' ' + base + 'а';

							break;

						case 5:
							result = quantity + ' ' + base + 'ов';

							break;
					}

					return result;
				}

				/**
				 * Helper method for updating passengers quantity
				 */

				function updateParticipantsQuantity() {
					$scope.participantsQuantity = howManyIsValid();

					$scope.totalPassengersLabel = getPersonsQuantityLabel($scope.participantsQuantity);
				}

				/**
				 * Helper method for checking birth date validity of each participant in a list.
				 * Implemented to set correct value of passengers validity, since newly added passengers are valid by default.
				 * @param {Array} participants List of passengers to check
				 */

				$scope.checkEachParticipant = function (participants) {
					participants.forEach($scope.checkBirthDate);
				};

				/**
				 * Helper method for checking participants list (with following update of widget placeholder)
				 * @param {Array} participants passengers
				 */

				$scope.checkParticipants = function (participants) {
					$scope.checkEachParticipant(participants);

					$scope.isValid = participants.every(function (participant) {
						return $scope.checkBirthDate(participant);
					});

					updateParticipantsQuantity();
				};

				/**
				 * Helper method for checking passenger birth date
				 * @param {Object} participant passenger object
				 * @returns {Boolean} result passenger validity
				 */

				$scope.checkBirthDate = function (participant) {
					// By default all empty birth dates are valid (only filled values can pass validators)
					var participantAgeIsPositive = $dateParser(participant.birthDate, DATE_FORMAT) < new Date();

					$scope.isParticipantAgeAllowed = true;

					if (participantAgeIsPositive) {
						$scope.isParticipantAgeAllowed = $dateParser(participant.birthDate, DATE_FORMAT).getFullYear() >= new Date().getFullYear() - PARTICIPANT_MAX_AGE;

						$scope.$emit(EVENTS.PARTICIPANTS_CONTROL.PASS_DATA, $scope.isParticipantAgeAllowed);
					}

					participant.isValid = !participant.touched || participantAgeIsPositive && $scope.isParticipantAgeAllowed;

					return participant.isValid;
				};

				/**
				 * Birth date manual input handler (via keyboard / mouse)
				 * @param {Object} event DOM event
				 * @param {Object} participant
				 */

				$scope.onBirthDateInput = function (event, participant) {
					touch($scope);
					touch(participant);

					if (participant.birthDate != null) {
						participant.dirty = true;
					}

					$scope.checkParticipants($scope.participants);

					if (event.which === KEYBOARD.ENTER) {
						if ($scope.isValid) {
							$scope.showControls = false;
						}
					}
				}

				// Mask options

				$scope.mask = {
					blur: "дд.мм.гггг",

					focus: "__.__.____"
				};

				// Default mask

				$scope.currentMask = $scope.mask.blur;

				// Update passengers quantity label right after widget initialization in case if don't need lazy update

				if (!$scope.lazyUpdate) {
					updateParticipantsQuantity();
				}
			}
		]);

	utils.directive('participantsControl', [
		'$document',
		'EVENTS',
		'KEYBOARD',
		function ($document, EVENTS, KEYBOARD) {
			return {
				scope: {
					isValid: '=',

					participants: '=',

					maxParticipantCount: '=',

					lazyUpdate: '='
				},

				controller: 'participantsControlCtrl',

				templateUrl: 'modules/utils/directives/participants-control/partials/participants-control.html',

				link: function (scope, element) {
					var elems = {
						participantControlPopupAdd: element.find('.participants-control-popup-add')
					};

					scope.togglePopup = function () {
						scope.showControls = !scope.showControls;
					};

					scope.handleOuterClick = function (event) {
						var showControls = !!element.find($(event.target)).length;

						if (!showControls) {
							scope.showControls = showControls;

							scope.$digest();
						}
					};

					scope.tabHandler = function (event) {
						if (event.keyCode === KEYBOARD.TAB) {
							scope.handleOuterClick({target: ''});
						}
					};

					scope.blockPropagation = function (event) {
						event.stopPropagation();
					};

					// If user clicked somewhere outside widget boundaries, then handle it appropriately

					$document.on(EVENTS.ELEMENT.MOUSEDOWN, scope.handleOuterClick);

					elems.participantControlPopupAdd.on(EVENTS.ELEMENT.KEYDOWN, scope.tabHandler);

					// Remove outer click when scope is about to be destroyed

					var cancelScopeDestroyListener = scope.$on(EVENTS.SCOPE.DESTROY, function () {
						$document.off(EVENTS.ELEMENT.MOUSEDOWN, scope.handleOuterClick);

						elems.participantControlPopupAdd.off(EVENTS.ELEMENT.KEYDOWN, scope.tabHandler);

						cancelScopeDestroyListener();
					});
				}
			};
		}
	]);
})();;
(function () {
	'use strict';

	var utils = angular.module('utils');

	utils.controller('periodControlCtrl', [

		'$scope',

		'$window',

		'$dateParser',

		'dateFilter',

		'DATE_FORMAT',

		'INSURANCE_PERIOD',

		'$timeout',

		function (
			$scope,

			$window,

			$dateParser,

			dateFilter,

			DATE_FORMAT,

			INSURANCE_PERIOD,

			$timeout
		) {

			$scope.dateType = {
				preview:'preview',
				start: 'start',
				finish: 'finish'
			};

			$scope.overdueType = {
				before: 'before',
				after: 'after'
			};

			var minDate = new Date();

        /*
         * Deprecated restriction.
         * In previous versions of period control we had a restriction for 'start' and 'end' date.
         * Start date was equal to 'current date' + 1 and 'end date' was equal to 'start date' + one year.
         * Currently this restriction is disabled.
         * Uncomment it in case of necessity
         */

			//minDate.setDate(minDate.getDate() + 1);

			minDate.setHours(0, 0, 0, 0);

			var maxDate = new Date();
			maxDate.setDate(minDate.getDate() + INSURANCE_PERIOD.MAX);
			maxDate.setHours(0, 0, 0, 0);

			var initialDate = $dateParser($scope[$scope.dateType.start], DATE_FORMAT) || minDate;

			$scope.formData = {
				type: $scope.dateType.preview,

				month: initialDate.getMonth(),

				year: initialDate.getFullYear(),

				grid: 0,

				show: {
					popup: false
				},

				valid: {
					start: true,
					finish: false
				}
			};

			$scope.helpers = {

				getOffsetDayArray: function (year, month) {
					var offset = [],
						dayNumber = new Date(year, month, 1).getDay();

					dayNumber = dayNumber == 0 ? 6 : dayNumber - 1;

					while (dayNumber) offset[--dayNumber] = dayNumber;

					return offset;
				},

				getOverdueDayCount: function (year, month, dayCount, minDate, maxDate, dateType, overdueType) {
					var overdueCount = 0;

					switch (overdueType) {
						case $scope.overdueType.after:
							if (new Date(year, month, maxDate.getDate()) >= maxDate) {
								overdueCount =
									year == maxDate.getFullYear() &&
									month == maxDate.getMonth()
										? maxDate.getDate() - INSURANCE_PERIOD.MIN
										: 0;
							} else if (dateType == $scope.dateType.finish) {
								if (new Date(year, month, maxDate.getDate()) < maxDate) {
									overdueCount =
										year == maxDate.getFullYear() &&
										month == maxDate.getMonth()
											? maxDate.getDate()
											: dayCount;
								}
							}
							break;
						case $scope.overdueType.before:
							if (new Date(year, month, 0) < minDate) {
								overdueCount =
									year == minDate.getFullYear() &&
									month == minDate.getMonth()
                    /*
                     * We are substracting one from minDate.getDate() in order to fill
                     * overdue days.
                     * Example: today is 22 of November 2016.
                     * Hence, overdue days will be an array of [1, 2, 3 .... 21].
                     * 22 is a valid start date
                     */

										? minDate.getDate() - 1
										: dayCount;
							}
							break;
					}

					return overdueCount;
				},

				getOverdueType: function (date) {
					var timeDiff = maxDate.getTime() - date.getTime();
					var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

					return diffDays > 0 ?
						$scope.overdueType.before :
						$scope.overdueType.after;
				},

				fillCalendar: function (grid, dayCount) {
					var i = 0;

					switch (grid.overdueType) {
						case $scope.overdueType.after:
							grid.overdue = new Array(dayCount - grid.overdue.length);

							for (; i < grid.overdue.length; i++)
								grid.overdue[i] = dayCount - grid.overdue.length + i + 1;

							for (var j = 0; i < dayCount; j++, i++)
								grid.actual[j] = { index: j + 1, select: false };

							break;

						case $scope.overdueType.before:
							for (; i < grid.overdue.length; i++)
								grid.overdue[i] = i + 1;

							for (var j = 0; i < dayCount; j++, i++)
								grid.actual[j] = { index: i + 1, select: false };

							break;
					}
				},

				setCalendarSelection: function (grid, month, year, selectedDate) {

					if (selectedDate != null && selectedDate.getFullYear() == year && selectedDate.getMonth() == month) {
						switch (grid.overdueType) {
							case $scope.overdueType.after:
								grid.actual[selectedDate.getDate() - 1].select = true;
								break;

							case $scope.overdueType.before:
								var index = selectedDate.getDate() - grid.overdue.length - 1;
								if (index >= 0) {
									grid.actual[index].select = true;
								}
								break;
						}
					}

				}

			};

			$scope.events = {

				notInPreviewMode: function(){
					var start = $dateParser($scope[$scope.dateType.start], DATE_FORMAT);
					var finish = $dateParser($scope[$scope.dateType.finish], DATE_FORMAT);

					return ($scope.formData.type != 'preview') || (start != null || finish != null);
				},
				checkPreviewMode: function() {
					var start = $dateParser($scope[$scope.dateType.start], DATE_FORMAT);
					var finish = $dateParser($scope[$scope.dateType.finish], DATE_FORMAT);
					if (start == null && finish == null) {
						$timeout(function () {
							$scope.formData.type = 'preview';
						}, 0);
					}

				},

				updatePopup: function (type) {

					var selectedDate = $dateParser($scope[type], DATE_FORMAT) || $dateParser($scope["start"], DATE_FORMAT) || minDate,
						updateGrid = $scope.formData.month == selectedDate.getMonth();

					$scope.formData.year = selectedDate.getFullYear();
					$scope.formData.month = selectedDate.getMonth();

					if (updateGrid) $scope.events.updateGrid();

				},

				dateFieldFocus: function (type) {

					$scope.formData.type = type;
					$scope.formData.show.popup = true;
					$scope.events.updatePopup(type);

				},

				inputBtnClick: function () {

					var showPopup = !$scope.formData.show.popup;
					$scope.events.dateFieldFocus($scope.dateType.start);
					$scope.formData.show.popup = showPopup;

				},

				prevMonthClick: function () {

					if ($scope.formData.month == 0) {
						$scope.formData.year--;
						$scope.formData.month = 11;
					}
					else $scope.formData.month--;

				},

				nextMonthClick: function () {

					if ($scope.formData.month == 11) {
						$scope.formData.year++;
						$scope.formData.month = 0;
					}
					else $scope.formData.month++;

				},

				selectDate: function (item, isLastDay) {
					$scope[$scope.formData.type] = dateFilter(new Date($scope.formData.year, $scope.formData.month, item.index), DATE_FORMAT);

					$scope.events.checkDates();

					$scope.events.updateGrid();

					$scope.events.moveFocus();

					if( isLastDay ) {
						$scope.formData.month = $dateParser($scope[$scope.dateType.start], DATE_FORMAT).getMonth();
					}
				},

				moveFocus: function () {
					if ($scope.formData.type == $scope.dateType.start) {
						$scope.events.dateFieldFocus($scope.dateType.finish);

					} else if ($scope.formData.type == $scope.dateType.finish) {
						$timeout(function () {
							$scope.formData.show.popup = false;
						}, 0);
					}
				},

				checkDates: function () {
					var start = $dateParser($scope[$scope.dateType.start], DATE_FORMAT);
					var finish = $dateParser($scope[$scope.dateType.finish], DATE_FORMAT);

					if (finish != null) {
						finish.setDate(finish.getDate() - INSURANCE_PERIOD.MIN + 2);
					}

					$scope.formData.valid[$scope.dateType.finish] = finish > start;
					$scope.isValid = $scope.formData.valid[$scope.dateType.start] && $scope.formData.valid[$scope.dateType.finish];
				},

				updateGrid: function () {

					var year = $scope.formData.year,
						month = $scope.formData.month,
						startDate = new Date(minDate),
						finishDate = new Date(maxDate),
						dayCount = new Date(year, month + 1, 0).getDate(),
						selectedDate = $dateParser($scope[$scope.formData.type], DATE_FORMAT);

					if ($scope.formData.type == $scope.dateType.finish) {
						startDate = $dateParser($scope[$scope.dateType.start], DATE_FORMAT) || new Date(minDate);
						startDate.setDate(startDate.getDate() + INSURANCE_PERIOD.MIN - 1);
						finishDate = new Date(startDate);
						finishDate.setFullYear(finishDate.getFullYear() + 1);
					}

					var overdueType = $scope.helpers.getOverdueType(new Date(year, month, maxDate.getDate()));

					var grid = {
						overdueType: overdueType,
						offset: $scope.helpers.getOffsetDayArray(year, month),
						overdue: new Array($scope.helpers.getOverdueDayCount(year, month, dayCount, startDate, finishDate, $scope.formData.type, overdueType)),
						actual: []
					};

					$scope.helpers.fillCalendar(grid, dayCount);

					$scope.helpers.setCalendarSelection(grid, month, year, selectedDate);

					$scope.formData.grid = grid;
				},

				outerClick: function (event) {

					if (angular.element(".period-control").find(event.target).length == 0
						&& !angular.element(event.target).hasClass("period-control-popup-active-day")) {

						$scope.$apply(function () {
							$scope.formData.show.popup = false;
						});

						$scope.events.checkPreviewMode();

						$scope.shouldReactOnFocus = true;

					}

				},

				changePopupVisibility: function (value) {

					if (value)
						$window.addEventListener('click', $scope.events.outerClick);
					else
						$window.removeEventListener('click', $scope.events.outerClick);

				}

			};

			$scope.$watch('formData.month', $scope.events.updateGrid);

			$scope.$watch('formData.show.popup', $scope.events.changePopupVisibility);

			$scope.months = [
				"Январь", "Февраль", "Март",
				"Апрель", "Май", "Июнь",
				"Июль", "Август", "Сентябрь",
				"Октябрь", "Ноябрь", "Декабрь"
			];

			$scope.daysAcronyms = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

			//this flag determines that focusinHandler should work or does not
			$scope.shouldReactOnFocus = true;

		}]);

	utils.directive('periodControl', ['EVENTS', 'KEYBOARD', function (EVENTS, KEYBOARD) {
		return {
			scope: {
				start: '=',
				finish: '=',
				isValid: '='
			},
			controller: 'periodControlCtrl',

			templateUrl: 'modules/utils/directives/period-control/partials/period-control.html',

			link: function (scope, element) {
				scope.createFocusinHandler = function(ref) {
					return function () {
						scope.events.dateFieldFocus(ref);
						scope.$digest();
					}
				};

				//create handlers

				scope.focusinHandler = function() {
					if( !scope.shouldReactOnFocus ) {
						return false;
					}

					scope.events.dateFieldFocus(scope.dateType.start);
					scope.$digest();

					scope.shouldReactOnFocus = false;
					scope.inputs.startDate.focus();
				};

				//Handle tab keydown on end-date input. This keydown closes calendar widget.
				scope.finishTabHandler = function(event) {
					if( event.keyCode === KEYBOARD.TAB ) {
						if( !scope.shouldReactOnFocus ) {
							scope.shouldReactOnFocus = true;
						}
						scope.events.outerClick({target: null});
					}
				};

				scope.inputs = {
					startDate: element.find('#startdate'),

					endDate: element.find('#enddate')
				};

				scope.startDateFocusInHandler = scope.createFocusinHandler(scope.dateType.start);

				scope.endDateFocusInHandler = scope.createFocusinHandler(scope.dateType.finish);

				//assign handlers

				element.on(EVENTS.ELEMENT.FOCUSIN, scope.focusinHandler);

				scope.inputs.startDate.on(EVENTS.ELEMENT.FOCUSIN, scope.startDateFocusInHandler);

				scope.inputs.endDate.on(EVENTS.ELEMENT.FOCUSIN, scope.endDateFocusInHandler);

				scope.inputs.endDate.on(EVENTS.ELEMENT.KEYDOWN, scope.finishTabHandler);

				var cancelScopeDestroyListener = scope.$on(EVENTS.SCOPE.DESTROY, function () {
					element.off(EVENTS.ELEMENT.FOCUSIN, scope.focusinHandler);

					scope.inputs.startDate.off(EVENTS.ELEMENT.FOCUSIN, scope.startDateFocusInHandler);

					scope.inputs.endDate.off(EVENTS.ELEMENT.FOCUSIN, scope.endDateFocusInHandler);

					scope.inputs.endDate.off(EVENTS.ELEMENT.KEYDOWN, scope.finishTabHandler);

					cancelScopeDestroyListener();
				});
			}
		};
	}]);

})();;
(function() {
	'use strict';

	var utils = angular.module('utils');

	utils.directive('selectableItems', [
		'KEYBOARD',

		'$filter',

		'EVENTS',

		'TERRITORY_BLOCK',

		'$parse',

		function(KEYBOARD, $filter, EVENTS, TERRITORY_BLOCK, $parse) {
			return {
				restrict: 'E',

				require: 'ngModel',

				scope: {
					selection: '=ngModel',

					items: '='
				},

				templateUrl: 'modules/utils/directives/selectable-items/partials/selectable-items.html',

				link: function(scope, element, attrs) {
					var ITEM_DATA_PROPERTY = 'item';

					// By default suggestions is disabled

					scope.enableSuggestions = false;

					// If selection isn't an array, then initialize it as an empty array

					scope.selection = angular.isArray(scope.selection) ? scope.selection : [];

					/*
					 * Mirror each widget parameter to the scope
					 * Note, that we are referencing parent scope explicitly
					 * in order to parse attribute values
					 */

					var widgetParams = $parse(attrs.params)(scope.$parent);

					angular.forEach(widgetParams, function(paramValue, paramName) {
						scope[paramName] = paramValue;
					});

					// Cache links to dom elements

					var textInputEl = element.find('.suggestion-input').first();

					var selectableItemsContainer = element.find('.selectable-items');


					var suggestions = element.find('.selectable-items-suggestions');

					var triggerBtn = element.find('.btn-trigger');

					var body = $(document.body);

					var itemsWrapper = element.find('.items-wrapper');

					// Predefined css classes

					var selectableItemContainerCssClass = 'item-container';

					var selectableItemCssClass = 'item';

					var itemLabel = scope.itemLabel;

					/**
					 * Resets DOM element value to an empty string
					 * @param {Object} element jQuery wrapper on DOM element
					 */

					scope.resetValue = function(element) {
						element.val('');
					};

					/**
					 * Removes element from selection list
					 * @param {Object} item item which should be removed
					 */

					scope.removeItem = function(item) {
						scope.squeezeInputArea();

						var searchConfig = {};

						searchConfig[itemLabel] = item[itemLabel];

						_.remove(scope.selection, searchConfig);

						scope.adjustUserInputWidth();

						scope.showHideDefault(!scope.selection.length && !textInputEl.val());

						textInputEl.removeAttr('disabled');
					};

					/**
					 * @param {Object} newItem new item which should be added to the items array
					 */

					scope.addItem = function(newItem) {
						// If we reached top limit, then do nothing

						if (scope.suggestionsListIsFull()) {
							return;
						}

						var itemLabel = scope.itemLabel;

						var searchConfig = {};

						searchConfig[itemLabel] = newItem[itemLabel];

						var isDuplicate = !!_.find(scope.selection, searchConfig);

						if (isDuplicate) {
							$log.warn('Attempt to add duplicate');

							return false;
						}

						scope.squeezeInputArea();

						scope.selection.push(newItem);

						scope.resetValue(textInputEl);

						if (scope.suggestionsListIsFull()) {
							textInputEl.attr('disabled', 'disabled');
						}

						scope.switchSuggestions(false);

						scope.showHideDefault(!scope.selection.length && !textInputEl.val());

						scope.adjustUserInputWidth();

						scope.adjustInputOnLoad = false;
					};

					var supportedKeys = [
						KEYBOARD.ESC,

						KEYBOARD.ENTER,

						KEYBOARD.ARROW_UP,

						KEYBOARD.ARROW_DOWN
					];

					/**
					 * Handles user input
					 * @param {Event} event
					 */

					function handleUserInput(event) {
						if (_.includes(supportedKeys, event.which)) {
							if (event.which === KEYBOARD.ESC) {
								scope.switchSuggestions(false);

								// Prevent FireFox from rolling back a value of input field

								event.preventDefault();
							}
							else if (event.which === KEYBOARD.ARROW_UP || event.which === KEYBOARD.ARROW_DOWN) {
								if (scope.suggestions.length && !scope.enableSuggestions) {
									scope.switchSuggestions(true);
								}
								else if (scope.suggestions.length) {
									event.which === KEYBOARD.ARROW_UP ? activeSuggestion.decrease() : activeSuggestion.increase();
								}
							}
							else if (event.which === KEYBOARD.ENTER) {
								if (scope.suggestions.length) {
									if (activeSuggestion.value < 0) {

										// in case there's no value selected by arrows

										scope.addItem(scope.suggestions[0]);
									}
									else {
										scope.addItem(scope.suggestions[activeSuggestion.value]);
									}
									generateItemsDom();
								}
							}

							scope.$digest();
						}
					}

					/**
					 * Suggestions visibility switcher
					 * @param {Boolean} switchTo indicator for suggestions activity
					 */

					scope.switchSuggestions = function(switchTo) {
						scope.enableSuggestions = switchTo;
					};

					/**
					 * Checks if selection list is full or overflown
					 * @returns {Boolean} flag indicating the fact, that selection list is full
					 */

					scope.suggestionsListIsFull = function() {
						return scope.selection.length >= scope.maxItems;
					};

					scope.fakeInputVisible = true;

					scope.adjustInputOnLoad = true;

					scope.isFakeInputVisible = function() {
						if (scope.adjustInputOnLoad) {
							textInputEl.outerWidth(
								scope.inputSize
							);
						}

						return scope.fakeInputVisible && textInputEl.get(0) != document.activeElement && !scope.selection.length && !textInputEl.val();
					};

					scope.showHideDefault = function(param) {
						scope.fakeInputVisible = param;
					};

					var fakeClick = function() {
						if (scope.suggestionsListIsFull()) {
							return;
						}

						scope.showHideDefault(false);

						if (!scope.fakeInputVisible && !scope.toggleSuggestionsDisplay) {
							textInputEl.focus();

							scope.switchSuggestions(true);
						}
						else {
							scope.switchSuggestions(false);

							scope.showHideIfNothingSelected();
						}
						scope.toggleSuggestionsDisplay = false;

						scope.$digest();
					};

					var toggleItemsList = function() {
						scope.toggleSuggestionsDisplay = !!scope.enableSuggestions;
					};

					/**
					 * Handles click for text input element
					 */

					var textInputElClickHandler = function() {
						scope.switchSuggestions(true);

						activeSuggestion.reset();

						scope.showHideDefault(false);

						scope.$digest();
					};

					scope.showHideIfNothingSelected = function() {
						scope.showHideDefault(!scope.selection.length && !textInputEl.val());
					};

					function textInputBlurHandler() {
						if( !scope.enableSuggestions ) {
							scope.resetValue(textInputEl);
						}

						/*
						 * Once user is no longer using widget, we have to synchronize
						 * changes with external scopes
						 */

						scope.$apply();
					}

					scope.tipClick = function(tip) {
						var searchConfig = {};

						searchConfig[itemLabel] = tip[itemLabel];

						var tipRelevantItem = _.find(scope.items, {
							nameRus: tip
						});

						!!tipRelevantItem && scope.addItem(tipRelevantItem);
					};

					// Filters

					/**
					 * @param {Object} item item which should be compared with already chosen items in order to be shown in suggestions list
					 * @returns {Boolean} result flag of uniqueness
					 */

					scope.uniqueSuggestionFilter = function(item) {
						return !_.find(scope.selection, {
							nameRus: item.nameRus
						});
					};

					/**
					 * @param {Object} item item which is checked for parent sign
					 * @returns {Number} result number to boolean equivalent, multiplied by -1 (in order to sort from parent items to regular items)
					 */

					scope.topicsFilter = function(item) {
						return -item.parent;
					};

					/**
					 * @param {Object} item suggestion item
					 * @returns {Number} result substring index of userInput in item label
					 */

					scope.relevantIndexFilter = function(item) {
						var userInput = textInputEl.val().trim().toLowerCase();

						return item[itemLabel].toLowerCase().indexOf(userInput);
					};

					/**
					 * Helper method for sorting items by alphabet (independent of case)
					 * @param {Object} item
					 * @returns {String} item label in lowercase
					 */

					scope.alphabetFilter = function(item) {
						return item[scope.itemLabel].toLowerCase();
					};

					/**
					 * @param {Object} item
					 * @returns {Boolean} result returns flag of matched suggestion
					 */

					scope.matchedSuggestionFilter = function(item) {
						return scope.relevantIndexFilter(item) !== -1 && scope.uniqueSuggestionFilter(item);
					};

					/**
					 * Helper method for squeezing element's with ot zero
					 */

					scope.squeezeInputArea = function() {
						if (!textInputEl.length) {
							$log.warn('There is no input element inside suggestions container');

							return false;
						}

						textInputEl.width(0);

						return true;
					};

					/**
					 * Helper method for adjusting user input field according to
					 * currently selected items
					 */

					scope.inputSize = 0;

					scope.adjustUserInputWidth = function() {
						/*
						 * We don't want neither to trigger $digest cycle by using $timeout, or use $$postDigestQueue,
						 * so just use normal setTimeout
						 */

						setTimeout(function() {
							scope.inputSize = itemsWrapper.outerWidth() - textInputEl.position().left - (textInputEl.outerWidth(true) - textInputEl.width()) - triggerBtn.outerWidth();

							textInputEl.outerWidth(scope.inputSize);
						});
					};

					// Adjust user input width

					scope.adjustUserInputWidth();

					/**
					 * Handles click for the element or it's child content
					 * by adding a special flag to original event in order to ignore
					 * this event in body click handler, when event reaches body
					 * @param {Object} event
					 */

					function reactOnElementClick(event) {
						event.originalEvent.ignore = true;
					}

					/**
					 * Helper method for reacting on an external clicks (outside widget container).
					 * Helper will hide suggestions list only if they are currently visible
					 * @param {Object} event DOM event
					 */

					function reactOnExternalClicks(event) {
						/*
						 * Note: scope.suggestions here is an array
						 * of matched elements
						 */


						if( !scope.suggestions.length ) {
							return;
						}

						/*
						 * Note: here suggestions is a reference do DOM
						 * element, which contains DOM elements each
						 * of which reflects matched item
						 */

						if( !event.originalEvent.ignore && suggestions.is(':visible') ) {
							scope.switchSuggestions(false);

							activeSuggestion.reset();

							scope.showHideIfNothingSelected();

							scope.$digest();
						}
					}

					/* vm/RIS-1367 - begin changes */

					var ngFilter = $filter('filter');

					var orderByFilter = $filter('orderBy');

					var highlightFilter = $filter('highlight');

					function generateItemsDom() {
						var fragment = document.createDocumentFragment();

						var items = ngFilter(scope.items, scope.matchedSuggestionFilter);

						scope.suggestions = orderByFilter(items, [scope.topicsFilter, scope.relevantIndexFilter, scope.alphabetFilter]);

						var matchedItems = scope.suggestions;

						scope.previousSuggestions = matchedItems;

						suggestions.empty();

						matchedItems.forEach(function(item, index) {
							var itemContainer = $('<li/>', {
								'class': selectableItemContainerCssClass
							});

							if (item.parent) {
								itemContainer.addClass('parent');
							}

							if (item.parent && !!matchedItems[index + 1] && !matchedItems[index + 1].parent) {
								itemContainer.addClass('separator');
							}

							var itemActive = activeSuggestion.value === index ? ' item-active' : '';

							var itemContent = $('<span/>', {
								'class': selectableItemCssClass + itemActive,
								'data-index': index
							});

							itemContent.data(ITEM_DATA_PROPERTY, item);

							var itemContentHtml = highlightFilter(item[scope.itemLabel], textInputEl.val().trim());

							itemContent.html(itemContentHtml);

							itemContainer.append(itemContent);

							fragment.appendChild(itemContainer.get(0));
						});

						matchedItems.length && suggestions.append(fragment);
					}

					var activeSuggestion = {

						/*
						*	By default (on script load) current value is equal to -1
						*	to avoid style change in case of handling mouse events
						*/

						currentValue: -1,
						zeroValue: 0,
						scrollValue: 3,

						reset: function() {
							this.updateDOM();
							this.currentValue = -1;
							suggestions.scrollTop(0);
						},

						increase: function() {
							if (this.currentValue < scope.suggestions.length - 1) {
								this.updateDOM();
								this.currentValue++;
								if (this.currentValue >= this.scrollValue) {
									suggestions.scrollTop(suggestions.scrollTop() + itemSuggestionHeight);
								}
								this.updateDOM();
							}
							else {
								suggestions.scrollTop(0);
								this.value = this.zeroValue;
							}
						},

						decrease: function() {
							if (this.currentValue > this.zeroValue) {
								this.updateDOM();
								this.currentValue--;
								if (this.currentValue <= scope.suggestions.length - this.scrollValue) {
									suggestions.scrollTop(suggestions.scrollTop() - itemSuggestionHeight);
								}
								this.updateDOM();
							}
							else {
								suggestions.scrollTop(suggestions[0].scrollHeight);
								this.value = scope.suggestions.length - 1;
							}
						},

						get value() {
							return this.currentValue;
						},

						set value(value) {
							this.updateDOM();
							this.currentValue = value;
							this.updateDOM();
						},


						updateDOM: function() {
							if (this.currentValue >= this.zeroValue) {
								var ITEM_ACTIVE_CLASS = 'item-active';

								suggestions.find('.' + selectableItemCssClass).eq(this.currentValue).toggleClass(ITEM_ACTIVE_CLASS);
							}
						}
					};

					generateItemsDom();

					var itemContainers = $('.selectable-items-suggestions .item-container');
					var itemSuggestionHeight = TERRITORY_BLOCK.ITEM_SUGGESTION_HEIGHT;
					if (itemContainers.length) {
						itemSuggestionHeight = itemContainers.first().height();
					}

					/**
					 * Handles click on selectable item and adds it to
					 * the list with selected items
					 */

					var handleItemAddition = function(event) {
						/*
						 * Prevent event propagation so that it
						 * wouldn't be handled on body and treated
						 * as an outer click
						 */

						event.stopPropagation();

						var item = scope.suggestions[activeSuggestion.value];

						scope.addItem(item);

						activeSuggestion.reset();

						if (!scope.suggestionsListIsFull()) {
							textInputEl.focus();
						}

						scope.$digest();
					};

					var handleItemMouseover = function(event) {
						var index = $(event.target).data('index');
						activeSuggestion.value = index;
					}

					var handleItemAdditionThrottled = _.throttle(handleUserInput, 100);

					suggestions
						.on(EVENTS.ELEMENT.CLICK, '.' + selectableItemCssClass, handleItemAddition)
						.on(EVENTS.ELEMENT.MOUSEOVER, '.' + selectableItemCssClass, handleItemMouseover)

					var reactOnTextInputElChanges = function(event) {
						handleUserInput(event);

						activeSuggestion.reset();

						generateItemsDom();

						scope.switchSuggestions(true);

						scope.$digest();
					};

					triggerBtn.on(EVENTS.ELEMENT.CLICK, toggleItemsList);

					selectableItemsContainer.on(EVENTS.ELEMENT.CLICK, fakeClick);

					textInputEl
						.on(EVENTS.ELEMENT.INPUT, reactOnTextInputElChanges)

						.on(EVENTS.ELEMENT.KEYDOWN, handleItemAdditionThrottled)

						.on(EVENTS.ELEMENT.CLICK, textInputElClickHandler)

						.on(EVENTS.ELEMENT.FOCUS, generateItemsDom)

						.on(EVENTS.ELEMENT.BLUR, textInputBlurHandler);

					/* vm/RIS-1367 - end changes */

					// We need to hide widget when user clicks outside of it's container

					body.on(EVENTS.ELEMENT.CLICK, reactOnExternalClicks);

					element.on(EVENTS.ELEMENT.CLICK, reactOnElementClick);

					// When widget's scope is about to destroy, then we need to detach click event handler

					var cancelScopeDestroyWatcher = scope.$on(EVENTS.SCOPE.DESTROY, function() {
						body.off(EVENTS.ELEMENT.CLICK, reactOnExternalClicks);

						element.off(EVENTS.ELEMENT.CLICK, reactOnElementClick);

						suggestions
							.off(EVENTS.ELEMENT.CLICK, handleItemAddition)
							.off(EVENTS.ELEMENT.MOUSEOVER, handleItemMouseover)

						cancelScopeDestroyWatcher();

						textInputEl
							.off(EVENTS.ELEMENT.INPUT, reactOnTextInputElChanges)

							.off(EVENTS.ELEMENT.KEYDOWN, handleItemAdditionThrottled)

							.off(EVENTS.ELEMENT.CLICK, textInputElClickHandler)

							.off(EVENTS.ELEMENT.FOCUS, generateItemsDom)

							.off(EVENTS.ELEMENT.BLUR, textInputBlurHandler);

						triggerBtn.off(EVENTS.ELEMENT.CLICK, toggleItemsList);

						selectableItemsContainer.off(EVENTS.ELEMENT.CLICK, fakeClick);
					});
				}
			};
		}
	]);
})();;
(function() {
	'use strict';

	var utils = angular.module('utils');

	utils.directive('userInputList', ['$timeout', 'EVENTS', function($timeout, EVENTS) {
		return {
			scope: {
				values: '=',

				targetModel: '=',

				viewProp: '@',

				modelProp: '@',

				enabled: '=',

				ignoreEvents: '=',

				defaultViewValue: '@',

				widgetCode: '@?'
			},

			templateUrl: 'modules/utils/directives/user-input-list/partials/user-input-list.html',

			link: function(scope, element) {
				element.attr('tabindex', -1);

				// By default promise for dropdown list hiding is null

				scope.hideDropdownListPromise = null;

				// Elements locator

				var helperData = {
					dropDownListEnabledCssClass: 'slide-down',

					listTriggerBtnCssClass: 'btn-trigger',

					dropDownListItemCssClass: 'user-input-item-value',

					dropDownListCurrentItemCssClass: 'current-item',

					selectedInput: 'user-input-item-selected'
				};

				var dropDownControlTimeout = null;

				/**
				 * Helper method for controlling dropdown behaviour (show, hide, toggle)
				 * @param {String} event action which should be executed with element's css class (dropDownListEnabledCssClass)
				 */

				function controlDropdownList(event) {

					if( event.type === 'remove' ) {

						clearTimeout(dropDownControlTimeout);

						element.removeClass(helperData.dropDownListEnabledCssClass);
					} else {

						dropDownControlTimeout = setTimeout(function() {

							if( event.target.parentElement.tagName !== 'LI' ) {

								element.toggleClass(helperData.dropDownListEnabledCssClass);
							}
							
						});
					}
				}

				// Assign helper method for click on the list's trigger

				element.on(EVENTS.ELEMENT.CLICK, '.' + helperData.listTriggerBtnCssClass, controlDropdownList);

				/**
				 * Helper method for adjusting widget size by using the most widest child item
				 */

				scope.adjustWidgetSize = function() {
					var listItems = element.find('.' + helperData.dropDownListItemCssClass);

					var listItemMaxWidth = Math.max.apply(null, listItems.map(function(index, item) {
						return $(item).outerWidth(true) + 30;
					}));

					element.find('.' + helperData.dropDownListCurrentItemCssClass).width(listItemMaxWidth);
				};

				// We should adjust widget size as soon as possible

				setTimeout(scope.adjustWidgetSize);

				// And each time, when dictionary values are changed

				scope.$watch('values', function() {
					scope.setDefaultValue();

					setTimeout(scope.adjustWidgetSize);
				});

				// When target model is changing, then selected value should be actualized accordingly

				scope.$watch('targetModel', function(newValue, oldValue) {
					if( newValue !== oldValue ) {
            if( scope.modelProp === 'self' && scope.viewProp === 'self' ) {
              scope.selectedValue = newValue;
            } else {
              /*
               * If modelProp isn't self, then view prop also isn't self.
               * Hence find item in dictionary (values) with the same model
               * value as newValue, then use it's view value for selected value.
               */

              var searchConfig = {};

              searchConfig[scope.modelProp] = newValue;

              var newValueTwinFromDictionary = _.find(scope.values, searchConfig);

              scope.selectedValue[scope.modelProp] = newValue;

              scope.selectedValue[scope.viewProp] = newValueTwinFromDictionary[scope.viewProp];
            }
					}
				});

				var cancelWidgetAdjustmentListener = scope.$on(EVENTS.WIDGET.ADJUST_SIZE, function() {
					setTimeout(scope.adjustWidgetSize);
				});

        var cancelWidgetBlockingListener = scope.$on(EVENTS.WIDGET.BLOCK, function(event, code, newState) {
          if( code === scope.widgetCode ) {
            var classMethod = ( !!newState ? 'add' : 'remove' ) + 'Class';

            element[classMethod]('inactive');
          }
        });

        scope.$on(EVENTS.SCOPE.DESTROY, function() {
          cancelWidgetAdjustmentListener();

          cancelWidgetBlockingListener();
        });

				// Current model's value setter

				scope.setCurrentValue = function(newValue) {
			
					if( !newValue.inactive) {
						scope.selectedValue = angular.copy(newValue);

						if( scope.modelProp === 'self' ) {
							scope.targetModel = newValue;

							controlDropdownList({
								type: 'remove'
							});

						} else {
							scope.targetModel = newValue[scope.modelProp];

							controlDropdownList({
								type: 'remove'
							});
						}

					}

				};

				/**
				 * Helper method for getting model's view value
				 * @param {Object} data model object
				 * @returns {*} result specific property of model object or model itself
				 */

				scope.getViewValue = function(data) {
					return scope.viewProp === 'self' ? data : (!!data && data[scope.viewProp] || '');
				};

				// By default selected value is null

				scope.selectedValue = null;

				/**
				 * Helper method for setting default value (selected value and target model)
				 */

				scope.setDefaultValue = function() {
					if( !!scope.values && scope.values.length ) {
						var defaultValue = angular.copy(scope.values[0]);

						if( scope.defaultViewValue !== undefined ) {
							defaultValue[scope.viewProp] = scope.defaultViewValue;
						}

						scope.setCurrentValue(defaultValue);
					}
				};

				// Set first value in the list as a default value

				scope.setDefaultValue();

				// When user clicks somewhere outside of the widget, then hide dropdown list

				var blurHandler = function(event) {

					var relTarget = event.relatedTarget;

					if( relTarget ) {

						if( ( _.indexOf(relTarget.classList, helperData.selectedInput) < 0) && (_.indexOf(relTarget.parentElement.classList, helperData.selectedInput) < 0) ) {

							controlDropdownList({
								type: 'remove'
							});
							
						} 
					} else {
						controlDropdownList({
							type: 'remove'
						});
					}

				};


				element.on(EVENTS.ELEMENT.FOCUSOUT, blurHandler);

				if( !scope.ignoreEvents ) {
					scope.$on(EVENTS.WIDGET.SET_DEFAULT_VALUE, function() {
						scope.setDefaultValue();
					});
				}
			}
		};
	}]);
})(); ;
(function() {
	'use strict';

	var utils = angular.module('utils');

	utils.provider('policiesManager', function() {
		this.dataSource = '';

		this.$get = ['$http', '$q', 'HTTP_STATUSES', function($http, $q, HTTP_STATUSES) {
			var dataSource = this.dataSource.trim();

			var removeEntityEndpoint = this.removeEntityEndpoint.trim();

			if (!dataSource) {
				throw 'Please configure data sources for policiesManagerProvider';
			}

			if( !removeEntityEndpoint ) {
				throw 'Please configure entity removing endpoint for policiesManagerProvider';
			}

			return {
				getList: function() {
					return $http.get(dataSource)
						.then(function(response) {
							return response.data;
						}, function(error) {
							return $q.reject(error);
						});
				},

				/**
				 * Removes item from personal cabinet
				 * @param {Number} id order id
				 * @returns {Promise} promise promise for removing policy item from personal cabinet
				 */

				removeItem: function(id) {
					return $http['delete'](removeEntityEndpoint + '/' + id).then(function(response) {
						return response.status === HTTP_STATUSES.OK ? true :

							$q.reject('Server responded with success, but actual code is not 200: ' + response.status);
					}, function(error) {
						return $q.reject(error);
					});
				}
			};
		}];
	});
})();;
(function() {
	'use strict';
	
	var utils = angular.module('utils');
	
	utils.directive('downloadLink', [
		'STRUCTURE',

		function(STRUCTURE) {
			return {
				restrict: 'A',

				link: function(scope, element, attributes) {
					attributes.$observe('href', function(newValue) {
						element.attr('target', String(newValue).indexOf(STRUCTURE.DOWNLOADS) !== -1 ? '_blank' : '_self');
					});
				}
			};
		}
	]);
})();;
(function () {
	'use strict';

	var utils = angular.module('utils');

	utils.directive('numberValidation', [
		'REGEXP',

		function(
			REGEXP
		) {
		return {
			restrict: 'A',

			require: 'ngModel',

			link: function (scope, elm, attrs, ctrl) {
				ctrl.$validators.numberValidation = function (modelValue, viewValue) {
					return ctrl.$isEmpty(modelValue) || REGEXP.NUMBER.test(viewValue);
				};
			}
		};
	}]);
})();
;
(function() {
	'use strict';

	var utils = angular.module('utils');

	utils.directive('birthdateValidation', function() {
			return {
				restrict: 'A',

				require: 'ngModel',

				link: function(scope, element, attrs, ctrl) {
					var validationMethodName = attrs.validationMethodName;

					var targetScope = scope;

					var validationMethod = targetScope[validationMethodName];

					if( !isNaN(attrs.upperScopeDepth) ) {
						for( var i = 0, j = +attrs.upperScopeDepth; i < j; i++ ) {
							targetScope = targetScope.$parent;

							validationMethod = targetScope[validationMethodName];
						}
					} else if( !validationMethod ) {
						while( targetScope.$parent !==  null ) {
							targetScope = targetScope.$parent;

							validationMethod = targetScope[validationMethodName];

							if( typeof validationMethod === 'function' ) {
								break;
							}
						}
					}

					validationMethod = typeof validationMethod === 'function' ? validationMethod : angular.noop;

					ctrl.$validators.birthdateValidation = function(modelValue) {
						if( !ctrl.$isEmpty(modelValue) ) {
							var dateIsValid;

							try {
								dateIsValid = validationMethod.call(null, modelValue);
							} catch( error ) {
								dateIsValid = false;
							}
						}

						return ctrl.$isEmpty(modelValue) || dateIsValid;
					};
				}
			};
		}
	);
})();
;
(function () {
	'use strict';

	var utils = angular.module('utils');

	utils.directive('disallowSymbolEnter', [
		'EVENTS',

		'KEYBOARD',

		function(
			EVENTS,

			KEYBOARD
		) {
			return {
				restrict: 'A',

				link: function (scope, elm, attrs) {
					/*
					 * Prevents entering certain symbols depending on directive attribute value:
					 * 'space' - blocks entering space
					 * 'non-digit' - blocks entering all symbols except numbers
					 */
					
					var inputKeyPressHandler = function(e) {
						var keyCode = e.which;

						switch( attrs.disallowSymbolEnter ) {
							case 'space':
								if( keyCode === KEYBOARD.SPACE ) {
									e.preventDefault();
								}

								break;

							case 'non-digits':
								if( keyCode < KEYBOARD.ZERO || keyCode > KEYBOARD.NINE ) {
									e.preventDefault();
								}

								break;

							default:
								return;
						}
					};

					elm.on(EVENTS.ELEMENT.KEYPRESS, inputKeyPressHandler);

					scope.$on(EVENTS.SCOPE.DESTROY, function() {
						elm.off(EVENTS.ELEMENT.KEYPRESS, inputKeyPressHandler);
					});
				}
			};
		}]);
})();
;
(function () {
	'use strict';

	var utils = angular.module('utils');

	utils.directive('restrictInputMaxlength', [
		'MAX_SYMBOLS',

		function(
			MAX_SYMBOLS
		) {
			return {
				restrict: 'A',

				require: 'ngModel',

				link: function (scope, elm, attrs, ctrl) {
					var restrictionAttr = attrs.restrictInputMaxlength;

					var maxLength = restrictionAttr && !isNaN(restrictionAttr) ? restrictionAttr : MAX_SYMBOLS;

					ctrl.$parsers.push(function(viewValue) {
						if( !ctrl.$isEmpty(viewValue) && viewValue.length > maxLength ) {
							viewValue = viewValue.substring(0, maxLength);

							ctrl.$setViewValue(viewValue);

							ctrl.$modelValue = viewValue;

							ctrl.$render();
						}

						return viewValue;
					});
				}
			};
		}]);
})();
;
(function () {
	'use strict';

	var utils = angular.module('utils');

	utils.directive('cloneAnimation', [
		'EVENTS',

		'REGEXP',

		function(
			EVENTS,

		  REGEXP
		) {
			return {
				restrict: 'A',

				link: function (scope, elm) {
					/*
					 * Creates an element clone and animates it
					 */

					var durationProp, duration, clone, deleteClone;

					var durationRegex = REGEXP.DURATION_MEASURE_UNIT;

					var clonedItemAnimation = function() {
						if( !elm.hasClass('active') ) {
							clone = elm.clone();

							clone.addClass('animated-el');

							clone.insertAfter(elm);

							durationProp = clone.css('animationDuration');

							duration = durationRegex.test(durationProp) ? parseFloat(durationProp) : parseFloat(durationProp) * 1000;

							deleteClone = setTimeout(function() {
								clone.remove();
							}, duration);
						}
					};

					elm.on(EVENTS.ELEMENT.CLICK, clonedItemAnimation);

					scope.$on(EVENTS.SCOPE.DESTROY, function() {
						elm.off(EVENTS.ELEMENT.CLICK, clonedItemAnimation);

						clearTimeout(deleteClone);
					});
				}
			};
		}]);
})();;
(function () {
	'use strict';

	var utils = angular.module('utils');

	utils.directive('fixClonedContent', [
		'EVENTS',

		'$document',

		function(
			EVENTS,

		  $document
		) {
			return {
				restrict: 'A',

				link: function(scope, elm, attrs) {
					var cssHiddenClass = attrs.cssHiddenClass || 'hidden';

					var wrapper = $('<div class="fixed-el-container"></div>');

					wrapper.addClass(cssHiddenClass);

					elm.prepend(wrapper);

					var wrapperParent = $('.' + attrs.fixClonedContentParent);

					var clonedElSelector = '.' + attrs.fixClonedContent;

					var cloneElmsFn = function() {
						wrapper.empty();

						var fragment = $(document.createDocumentFragment());

						elm.find(clonedElSelector).each(function(index, value) {
							fragment.append($(value).clone(true));
						});

						wrapper.append(fragment);
					};

					var cloneElmsTimeout = setTimeout(cloneElmsFn);

					$document.on(EVENTS.SCROLL.REGULAR, trackScrolledEl);

					wrapperParent.on(EVENTS.SCROLL.REGULAR, calcWrapperLeftOffset);

					var precedingElementsHeight, initialLeftOffset;

					function trackScrolledEl() {
						precedingElementsHeight = elm.offset().top;

						if( $document.scrollTop() > precedingElementsHeight ) {
							wrapper.removeClass(cssHiddenClass);

							initialLeftOffset = parseFloat(wrapperParent.css('padding-left'));

							calcWrapperLeftOffset();
						} else {
							wrapper.addClass(cssHiddenClass);
						}
					}

					function calcWrapperLeftOffset() {
						wrapper.css('left', initialLeftOffset - wrapperParent.scrollLeft());
					}

					scope.$watch(cloneElmsFn);

					scope.$on(EVENTS.SCOPE.DESTROY, function() {
						clearTimeout(cloneElmsTimeout);

						$document.off(EVENTS.SCROLL.REGULAR, trackScrolledEl);

						wrapperParent.off(EVENTS.SCROLL.REGULAR, calcWrapperLeftOffset);
					});
				}
			};
		}]);
})();
;
(function() {
	'use strict';

	var utils = angular.module('utils');

	utils.directive('overlayScrollEmitter', [
		'EVENTS',

		'$document',

		'$window',

		function(
			EVENTS,

			$document,

		  $window
		) {
			return {
				link: function(scope, elm, attrs) {
					var contentMinWidth = attrs.containerContentWidth;

					var innerContentBlock = attrs.innerContentBlock;

					var resizedContent;

					var viewport = null;

					var setViewPortData = function setViewPortData() {
						viewport = {
							width: document.documentElement.clientWidth
						};
					};

					var elmPadding, scrollSize = 0;

					/**
					 * Calculate left padding to center content block.
					 */

					var calcPaddings = function calcPaddings() {
						if( !viewport ) {
							return;
						}

						elmPadding = (viewport.width - contentMinWidth) / 2;

						elmPadding >= 0 && elm.css('padding-left', elmPadding);
					};

					/**
					 * Calculate scroll width.
					 */

					var calcScrollSize = function() {
						var dummyBlockWrapper = $('<div class="dummy-block-wrapper"></div>');

						$('body').append(dummyBlockWrapper);

						var dummyContent = $('<div class="dummy-block"></div>');

						dummyBlockWrapper.append(dummyContent);

						scrollSize = dummyBlockWrapper.prop('offsetWidth') - dummyBlockWrapper.prop('clientWidth');

						dummyBlockWrapper.remove();
					};

					calcScrollSize();

					/**
					 * Create dummy block that imitates the content we want to scroll.
					 */

					var overlay = null, overlayWrapper = null;

					var createOverlay = function() {
						overlayWrapper = $('<div class="scrollable-overlay-wrapper"></div>');

						overlay = $('<div class="scrollable-overlay"></div>');

						overlayWrapper.append(overlay);

						elm.prepend(overlayWrapper);
					};

					createOverlay();

					var adaptDimensions = function adaptDimensions() {
						resizedContent = elm.find('.' + innerContentBlock);

						var resizedContentScrollWidth = resizedContent.prop('scrollWidth');

						resizedContent.css('width', Math.max(resizedContentScrollWidth, contentMinWidth));

						overlay.css('width', resizedContentScrollWidth + elmPadding);

						overlayWrapper.css('height', scrollSize + overlay.prop('clientHeight'));
					};

					var animFrame = $window.requestAnimationFrame(function animate() {
						setViewPortData();

						calcPaddings();

						adaptDimensions();

						animFrame = $window.requestAnimationFrame(animate);
					});

					overlayWrapper.on(EVENTS.SCROLL.REGULAR, trackScrollX);

					var scrollDistance;

					function trackScrollX() {
						scrollDistance = overlayWrapper.scrollLeft();

						scope.$emit(EVENTS.SCROLL.SCROLL_OVERLAY, scrollDistance);
					}

					var cancelEventListener = scope.$on(EVENTS.BLOCK_DYNAMIC_RESIZE.RESET_DUMMY, function() {
						resizedContent.css('width', contentMinWidth);
					});

					scope.$on(EVENTS.SCOPE.DESTROY, function() {
						$window.cancelAnimationFrame(animFrame);

						overlayWrapper.off(EVENTS.SCROLL.REGULAR, trackScrollX);

						cancelEventListener();
					});
				}
			};
		}]);
})();;
(function() {
	'use strict';

	var utils = angular.module('utils');

	utils.directive('overlayScrollHandler', [
		'EVENTS',

		'$rootScope',

		function(
			EVENTS,

			$rootScope
		) {
			return {
				link: function(scope, elm) {
					var cancelScrollEventListener = $rootScope.$on(EVENTS.SCROLL.SCROLL_OVERLAY, function(event, data) {
						elm.scrollLeft(data);
					});

					scope.$on(EVENTS.SCOPE.DESTROY, function() {
						cancelScrollEventListener();
					});
				}
			};
		}]);
})();;
(function() {
	'use strict';
	
	var utils = angular.module('utils');
	
	utils.directive('bgImage', [
		'PICTURE_PATH_TEMPLATES',

		'$log',

		function(
			PICTURE_PATH_TEMPLATES,

			$log
		) {
			return {
				restrict: 'A',

				link: function(scope, element, attrs) {
					var picParams = scope.$eval(attrs.bgImage) || {};

					var template = picParams.template;

					var file = picParams.file;

					if( !template || !file ) {
						$log.warn('Unable to set background image for element. Either template or file is incorrect');

						return;
					}

					var chosenTmpl = PICTURE_PATH_TEMPLATES[template];

					var bgPath = 'url(' + chosenTmpl.path + '/' + file + '.' + chosenTmpl.ext + ')';

					element.css('background-image', bgPath);
				}
			};
		}]);
})();;
(function () {
    'use strict';

    var utils = angular.module('utils');

    utils

        .factory('dateParserHelpers', [function () {

            'use strict';

            var cache = {};

            return {
                // Returns string value within a range if it's an integer
                getInteger: function (string, startPoint, minLength, maxLength) {
                    var val = string.substring(startPoint);
                    var matcher = cache[minLength + '_' + maxLength];
                    if (!matcher) {
                        matcher = new RegExp('^(\\d{' + minLength + ',' + maxLength + '})');
                        cache[minLength + '_' + maxLength] = matcher;
                    }

                    var match = matcher.exec(val);
                    if (match) {
                        return match[1];
                    }
                    return null;
                }
            };
        }])

        .factory('$dateParser', ['$locale', 'dateParserHelpers', function ($locale, dateParserHelpers) {

            'use strict';

            // Fetch date and time formats from $locale service
            var datetimeFormats = $locale.DATETIME_FORMATS;

            // Build array of month and day names
            var monthNames = datetimeFormats.MONTH.concat(datetimeFormats.SHORTMONTH);
            var dayNames = datetimeFormats.DAY.concat(datetimeFormats.SHORTDAY);

            return function (val, format) {

                // If input is a Date object, there's no need to process it
                if (angular.isDate(val)) {
                    return val;
                }

                try {
                    val = val + '';
                    format = format + '';

                    // If no format is provided, just pass it to the Date constructor
                    if (!format.length) {
                        return new Date(val);
                    }

                    // Check if format exists in the format collection
                    if (datetimeFormats[format]) {
                        format = datetimeFormats[format];
                    }

                    // Initial values
                    var now = new Date(),
                        i_val = 0,
                        i_format = 0,
                        format_token = '',
                        year = now.getFullYear(),
                        month = now.getMonth() + 1,
                        date = now.getDate(),
                        hh = 0,
                        mm = 0,
                        ss = 0,
                        sss = 0,
                        ampm = 'am',
                        z = 0,
                        parsedZ = false;

                    // TODO: Extract this into a helper function perhaps?
                    while (i_format < format.length) {
                        // Get next token from format string
                        format_token = format.charAt(i_format);

                        var token = '';

                        // TODO: Handle double single quotes
                        // Handle quote marks for strings within format string
                        if (format.charAt(i_format) == "'") {
                            var _i_format = i_format;

                            while ((format.charAt(++i_format) != "'") && (i_format < format.length)) {
                                token += format.charAt(i_format);
                            }

                            if (val.substring(i_val, i_val + token.length) != token) {
                                throw 'Pattern value mismatch';
                            }

                            i_val += token.length;
                            i_format++;

                            continue;
                        }

                        while ((format.charAt(i_format) == format_token) && (i_format < format.length)) {
                            token += format.charAt(i_format++);
                        }

                        // Extract contents of value based on format token
                        if (token == 'yyyy' || token == 'yy' || token == 'y') {
                            var minLength, maxLength;

                            if (token == 'yyyy') {
                                minLength = 4;
                                maxLength = 4;
                            }

                            if (token == 'yy') {
                                minLength = 2;
                                maxLength = 2;
                            }

                            if (token == 'y') {
                                minLength = 2;
                                maxLength = 4;
                            }

                            year = dateParserHelpers.getInteger(val, i_val, minLength, maxLength);

                            if (year === null) {
                                throw 'Invalid year';
                            }

                            i_val += year.length;

                            if (year.length == 2) {
                                if (year > 70) {
                                    year = 1900 + (year - 0);
                                } else {
                                    year = 2000 + (year - 0);
                                }
                            }
                        } else if (token === 'MMMM' || token == 'MMM') {
                            month = 0;

                            for (var i = 0; i < monthNames.length; i++) {
                                var month_name = monthNames[i];

                                if (val.substring(i_val, i_val + month_name.length).toLowerCase() == month_name.toLowerCase()) {
                                    month = i + 1;
                                    if (month > 12) {
                                        month -= 12;
                                    }

                                    i_val += month_name.length;

                                    break;
                                }
                            }

                            if ((month < 1) || (month > 12)) {
                                throw 'Invalid month';
                            }
                        } else if (token == 'EEEE' || token == 'EEE') {
                            for (var j = 0; j < dayNames.length; j++) {
                                var day_name = dayNames[j];

                                if (val.substring(i_val, i_val + day_name.length).toLowerCase() == day_name.toLowerCase()) {
                                    i_val += day_name.length;
                                    break;
                                }
                            }
                        } else if (token == 'MM' || token == 'M') {
                            month = dateParserHelpers.getInteger(val, i_val, token.length, 2);

                            if (month === null || (month < 1) || (month > 12)) {
                                throw 'Invalid month';
                            }

                            i_val += month.length;
                        } else if (token == 'dd' || token == 'd') {
                            date = dateParserHelpers.getInteger(val, i_val, token.length, 2);

                            if (date === null || (date < 1) || (date > 31)) {
                                throw 'Invalid date';
                            }

                            i_val += date.length;
                        } else if (token == 'HH' || token == 'H') {
                            hh = dateParserHelpers.getInteger(val, i_val, token.length, 2);

                            if (hh === null || (hh < 0) || (hh > 23)) {
                                throw 'Invalid hours';
                            }

                            i_val += hh.length;
                        } else if (token == 'hh' || token == 'h') {
                            hh = dateParserHelpers.getInteger(val, i_val, token.length, 2);

                            if (hh === null || (hh < 1) || (hh > 12)) {
                                throw 'Invalid hours';
                            }

                            i_val += hh.length;
                        } else if (token == 'mm' || token == 'm') {
                            mm = dateParserHelpers.getInteger(val, i_val, token.length, 2);

                            if (mm === null || (mm < 0) || (mm > 59)) {
                                throw 'Invalid minutes';
                            }

                            i_val += mm.length;
                        } else if (token == 'ss' || token == 's') {
                            ss = dateParserHelpers.getInteger(val, i_val, token.length, 2);

                            if (ss === null || (ss < 0) || (ss > 59)) {
                                throw 'Invalid seconds';
                            }

                            i_val += ss.length;
                        } else if (token === 'sss') {
                            sss = dateParserHelpers.getInteger(val, i_val, 3, 3);

                            if (sss === null || (sss < 0) || (sss > 999)) {
                                throw 'Invalid milliseconds';
                            }

                            i_val += 3;
                        } else if (token == 'a') {
                            if (val.substring(i_val, i_val + 2).toLowerCase() == 'am') {
                                ampm = 'AM';
                            } else if (val.substring(i_val, i_val + 2).toLowerCase() == 'pm') {
                                ampm = 'PM';
                            } else {
                                throw 'Invalid AM/PM';
                            }

                            i_val += 2;
                        } else if (token == 'Z') {
                            parsedZ = true;

                            if (val[i_val] === 'Z') {
                                z = 0;

                                i_val += 1;
                            } else {
                                if (val[i_val + 3] === ':') {
                                    var tzStr = val.substring(i_val, i_val + 6);

                                    z = (parseInt(tzStr.substr(0, 3), 10) * 60) + parseInt(tzStr.substr(4, 2), 10);

                                    i_val += 6;
                                } else {
                                    var tzStr = val.substring(i_val, i_val + 5);

                                    z = (parseInt(tzStr.substr(0, 3), 10) * 60) + parseInt(tzStr.substr(3, 2), 10);

                                    i_val += 5;
                                }
                            }

                            if (z > 720 || z < -720) {
                                throw 'Invalid timezone';
                            }
                        } else {
                            if (val.substring(i_val, i_val + token.length) != token) {
                                throw 'Pattern value mismatch';
                            } else {
                                i_val += token.length;
                            }
                        }
                    }

                    // If there are any trailing characters left in the value, it doesn't match
                    if (i_val != val.length) {
                        throw 'Pattern value mismatch';
                    }

                    // Convert to integer
                    year = parseInt(year, 10);
                    month = parseInt(month, 10);
                    date = parseInt(date, 10);
                    hh = parseInt(hh, 10);
                    mm = parseInt(mm, 10);
                    ss = parseInt(ss, 10);
                    sss = parseInt(sss, 10);

                    // Is date valid for month?
                    if (month == 2) {
                        // Check for leap year
                        if (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0)) { // leap year
                            if (date > 29) {
                                throw 'Invalid date';
                            }
                        } else {
                            if (date > 28) {
                                throw 'Invalid date';
                            }
                        }
                    }

                    if ((month == 4) || (month == 6) || (month == 9) || (month == 11)) {
                        if (date > 30) {
                            throw 'Invalid date';
                        }
                    }

                    // Correct hours value
                    if (hh < 12 && ampm == 'PM') {
                        hh += 12;
                    } else if (hh > 11 && ampm == 'AM') {
                        hh -= 12;
                    }

                    var localDate = new Date(year, month - 1, date, hh, mm, ss, sss);

                    if (parsedZ) {
                        return new Date(localDate.getTime() - (z + localDate.getTimezoneOffset()) * 60000);
                    }

                    return localDate;
                } catch (e) {
                    return undefined;
                }
            };
        }]);

})();;
(function() {
	'use strict';

	var utils = angular.module('utils');

	utils.factory('pageScroll', ['$log', function($log) {
		if( !jQuery ) {
			throw {
				message: 'pageScroll requires jQuery to be plugged in'
			}
		}

		return {
			/**
			 * @param {Number} config.scrollTo an integer representing page top scrolling
			 * @param {Number} config.animationTime a number of ms required for animation
			 * @param {String} config.easing a string indicating which easing function to use for the transition
			 */

			scrollTo: function(config) {
				var pageElements = $('body, html');

				var documentScroll = $(document).scrollTop();

				if( documentScroll === config.scrollTo ) {
					$log.info('Current document\'s scrollTop is the same as desired scrollTo. Doing nothing');

					return;
				}

				pageElements

					// Stop currently running animations

					.stop()

					// Then animate page scrolling

					.animate({
							scrollTop: config.scrollTo
						},

						config.animationTime,

						config.easing
					);
			}
		};
	}]);
})();;
(function() {
    'use strict';

    var utils = angular.module('utils');

    utils.factory('textTranslator', ['TEXT_LABELS', function(TEXT_LABELS) {
        return {
            translate: function(phraseScope, phraseKey) {
                var phraseValue = TEXT_LABELS[phraseScope][phraseKey];

                return phraseValue ? phraseValue : '';
            }
        };
    }]);
})();;
(function() {
    'use strict';

    var utils = angular.module('utils');

    utils.factory('csrf', ['$http','$log', '$q', 'REST_API', function($http, $log, $q, REST_API) {
        return {
            get: function() {
                var resolveHandler = function(response) {
                    $log.info('Token received.');

                    $log.info('Cookies: ', response.headers().cookie);
                };

                var errorHandler = function(error) {
                    $log.error('Error during GET request to get token');

                    return $q.reject(error);
                };

               return $http.get(REST_API.PING).then(resolveHandler, errorHandler);
            }
        };
    }]);
})();;
(function() {
    'use strict';
    var utils = angular.module('utils');

    utils.factory('httpCsrfAware', ['$http','$q' , '$log', 'csrf', function($http, $q, $log, csrf ) {
        return {
            callMethod: function(methodToCall, argsArray) {
                var resolveHandler = function() {
                    var context = null;
                    
                    return methodToCall.apply(context,argsArray);
                };
                
                var errorHandler = function(error) {
                    $log.error('Error during GET request to get token token');

                    return $q.reject(error);
                };
                
                return csrf.get().then(resolveHandler, errorHandler);
            }
        };
    }]);
})();;
(function () {
	"use strict";

	var utils = angular.module("utils");

	utils.factory("userAuth", [
		"$rootScope",

		"$http",

		"REST_API",

		"$uibModal",

		"$location",

		"$route",

		"BUSINESS_ENTITIES",

		"ROUTES",

		"EVENTS",

		"$q",

		"$log",

		"csrf",

		"httpCsrfAware",

		'REST_API',

		function (
			$rootScope,

			$http,

			restApi,

			modal,

			location,

			route,

			businessEntities,

			routes,

			events,

			$q,

			$log,

			csrf,

			httpCsrfAware,

			REST_API
		) {
			var postlogout = function () {
				if (route.current != null && route.current.businessEntity != null &&
					[businessEntities.ORDER_PREPARE, businessEntities.ORDER_PAYMENT, businessEntities.PRIVATE_OFFICE]
						.indexOf(route.current.businessEntity) >= 0) {
					location.path(routes.MAIN_PAGE);
				}
			};
			var currentUser = {value: null};

			var doLogin = function(login, password, rememberMe, userType) {
				localStorage.setItem(events.REMEMBER_ME, rememberMe);
				var doLoginFn = function (url, login, password, userType) {
					return $http.post(url,
						{
							email: login,
							password: password,
							userType: userType
						},
						{
							headers: {
								'Accept': "application/json",
								'Content-type': "application/json",
								'remember-me': rememberMe
							},

							isArray: false
						}
					);
				};
				return httpCsrfAware.callMethod(doLoginFn, [restApi.LOGIN, login, password, userType]);

			};

			var doBroadcast = function (result) {
				currentUser.value = result.data;
				localStorage.setItem('userAuth', true);
				$rootScope.$broadcast(events.USER_ACTIONS.LOGIN, [result.data]);
			};

			var getCsrfToken = function () {
				return $http.get(restApi.PING);
			};

			var otherwiseLogThatCannotSendBroadcast = function (error) {
				$log.error('Can not send broadcast. Reason: ', error.statusText);

				return $q.reject(error.statusText);
			};


			var res = {

				getCurrentUser: function () {
					return currentUser;
				},

				getPartnerData: function() {
					return $http.get(restApi.PARTNER).then(function(response) {
						return response.data;
					}, function(error) {
						return $q.reject(error);
					});
				},

				login: function (login, password, rememberMe, userType) {
					return doLogin(login, password, rememberMe, userType).then(doBroadcast, otherwiseLogThatCannotSendBroadcast);
				},
				logout: function () {
					var logoutFn = function (url) {
						return $http.post(url, null, {
							headers: {
								'Accept': "application/json"
							}
						})
					};

					return httpCsrfAware.callMethod(logoutFn, [restApi.LOGOUT]).then(function () {
						$log.debug('User is logging out. Clear local storage...');

						$rootScope.$broadcast(events.USER_ACTIONS.LOGOUT, currentUser.value);
						currentUser.value = null;

						localStorage.clear();
					}, postlogout).then(csrf.get, function () {
						$log.error('Error during resolving promise');
					});
				},
				checkEmail: function (account) {
					var checkEmailFn = function (url, account) {

						return $http.post(url, {email: account},
							{
								headers: {
									'Accept': 'application/json',
									'Content-type': 'application/json'
								},

								isArray: false
							});
					};
					return httpCsrfAware.callMethod(checkEmailFn, [restApi.USER_ACCOUNT, account]);
				},
				resetPassword: function (account) {
					var resetPasswordFn = function (url, account) {
						return $http.post(url, {email: account},
							{
								headers: {
									'Accept': 'application/json',
									'Content-type': 'application/json'
								}
							});
					};
					return httpCsrfAware.callMethod(resetPasswordFn, [restApi.NEW_PASSWORD, account]);
				}
			};

			$rootScope.$on(events.REMEMBER_ME, function(config){
				if(localStorage.getItem('userAuth') !== null) {
					localStorage.removeItem('userAuth');
					return res.logout();
				}
				return config;
			});

			res.requestAuthenticate = function () {
				modal.open({
					animation: true,
					templateUrl: "login.html",
					size: "sm",
					controller: "loginController",
					resolve: {
						parent: function () {
							return res;
						}
					},
					backdrop: 'static'
				});
				return false;
			};
			res.updateAuthState = function () {
				var errorHandler = function (error) {
					currentUser.value = null;
					if(localStorage.getItem('userAuth') !== null) {
						$log.error('User is no longer authorised');
						res.logout();
						return $q.reject(error);
					}
				};
				var successHandler = function (result) {
					currentUser.value = result.data;
					$rootScope.$broadcast(events.USER_ACTIONS.LOGIN, [result.data]);
				};

				return $http.get(restApi.USER, {
					headers: {
						'Accept': "application/json"
					},

					isArray: false,
					cache: false
				}).then(successHandler, errorHandler);
			};

			return res;
		}
	]);
})();;
(function() {
    'use strict';

    var utils = angular.module('utils');

    utils.factory('userData', ['CACHE_ITEMS', function(CACHE_ITEMS) {
        return {
            getCacheNames: function() {
                return _.values(CACHE_ITEMS);
            },

            clearCache: function(config) {
                var cacheNames = this.getCacheNames();

                try {
                    var exceptions = config.except;
                } catch( error ) {
                    exceptions = [];
                }

                cacheNames.forEach(function(key) {
                    if( exceptions.indexOf(key) === -1 ) {
                        (key in localStorage ? localStorage : sessionStorage).removeItem(key);
                    }
                });
            }
        };
    }]);
})();;
(function () {
    'use strict';

    var utils = angular.module('utils');

    utils.factory('rememberMeInterceptor', ['$log', 'REST_API', '$rootScope', '$cookies', "EVENTS", function ($log, REST_API, $rootScope, $cookies, events) {
        return {
            request: function (config) {
                var rememberMeItem = localStorage.getItem(events.REMEMBER_ME);
                if (localStorage.getItem('userAuth') !== null && (rememberMeItem === 'true' || rememberMeItem === null) && $cookies.get('remember-me') === undefined) {
                    $log.error('remember-me cookie is lost, broadcasting');
                    $rootScope.$broadcast(events.REMEMBER_ME, config);
                }
                return config;
            }
        };
    }]);
})();;
(function() {
	'use strict';

	var utils = angular.module('utils');

	utils.factory('manageLocation', ['$location', function($location) {
		return {
			/**
			 * Checks whether current location path matches the queried one
			 * @param {String} path Location path to be checked
			 * @returns {Boolean} Positive or negative result of comparing paths
			 */

			isCurrentLocation: function(path) {
				return $location.path() === path;
			},

			/**
			 * Makes redirect to specified page
			 * @param {String} path Location path to redirect to
			 */

			redirect: function(path) {
				$location.path(path);
			}
		};
	}]);
})();
;
(function() {
	'use strict';

	var utils = angular.module('utils');

	utils.factory('dataStorage', function() {
		return {
			/**
			 * Stores data either in localStorage or in sessionStorage
			 * @param {String} name Name of parameter
			 * @param {String} data The data to store
			 * @param {Boolean} [storePerSession=undefined] Boolean flag indicating necessity of using sessionStorage in
			 * favor of
			 * localStorage
			 */

			setData: function(name, data, storePerSession) {
				(storePerSession ? sessionStorage : localStorage).setItem(name, data);
			},

			/**
			 * Extracts data either from localStorage or from sessionStorage
			 * @param {String} name Name of parameter
			 * @param {Boolean} storePerSession Boolean flag indicating necessity of using sessionStorage in favor of localStorage
			 * @returns {String} data Result of querying storage
			 */

			getData: function(name, storePerSession) {

				var storage = storePerSession ? sessionStorage : localStorage;

				return storage.getItem(name);
			},

			/**
			 * Deletes data either from localStorage or from sessionStorage
			 * @param {String} name name of parameter
			 * @param {Boolean} storePerSession Boolean flag indicating necessity of using sessionStorage in favor of localStorage
			 */

			removeData: function(name, storePerSession) {
				var storage = storePerSession ? sessionStorage : localStorage;

				return storage.removeItem(name);
			}
		};
	});
})();;
(function() {
	'use strict';

	var utils = angular.module('utils');

	utils.factory('formHelper', function() {
		return {
			/**
			 * Toggles password visibility
			 * @param {Object} $event Event to be handled
			 */

			togglePasswordDisplay: function($event) {
				var target = $($event.currentTarget);

				if ( target.hasClass('showing') ) {
					target.removeClass('showing');

					$('#password').attr('type', 'password');
				} else {
					target.addClass('showing');

					$('#password').attr('type', 'text');
				}

				$event.preventDefault();
			}
		};
	});
})();;
(function() {
	'use strict';
	
	var utils = angular.module('utils');

	utils.factory('frameManager', [
		'$window',

		'REGEXP',

		function(
			$window,

			REGEXP
		) {
			return {
				/**
				 * Checks if application is opened in IFrame
				 * @returns {Boolean} flag indicating the fact, that application is running in IFrame
				 */

				isAppInFrameMode: function() {
					return $window.self !== $window.top && !REGEXP.YANDEX_WEBVISOR_FRAME_URL_FRAGMENT.test($window.self.location.href);
				},

				/**
				 * Sets the context for linked document to be opened in.
				 * Depends on whether the application is opened in iFrame or not.
				 * @returns {String} value of 'target' attribute
				 */

				getStaticLinksMode: function() {
					return this.isAppInFrameMode() ? '_blank' : '_self';
				}
			};
		}
	]);
})();;
(function() {
	'use strict';

	var utils = angular.module('utils');

	utils.filter('highlight', function() {
		return function(haystack, needle, htmlTag) {
			htmlTag = htmlTag || 'span';

			var needleIndex = haystack.search(new RegExp(needle, 'i'));

			if( needleIndex === -1 ) {
				return haystack;
			}

			var pre = haystack.substring(0, needleIndex);

			var middle = haystack.substr(needleIndex, needle.length);

			var post = haystack.substring(needleIndex + needle.length);

			middle = middle.length ? '<' + htmlTag + ' class="mark">' + middle + '</' + htmlTag + '>' : middle;

			return pre + middle + post;
		}
	});
})();;
(function() {
  'use strict';

  var utils = angular.module('utils');

  utils.filter('quantitySuffix', function() {
    /**
     * Returns phrase with correct suffix depending on the numeric quantity.
     * @param {Number} quantity items quantity
     * @param {String} phraseBase word base
     * @param {Array} suffixes array of word suffixes
     * @returns {String} result phrase with correct suffix
     */

    return function(quantity, phraseBase, suffixes) {
      var keys = [2, 0, 1, 1, 1, 2];

      var quantityModulus = quantity % 100;

      var suffixesKey = (quantityModulus > 7 && quantityModulus < 20) ?

        2 : keys[(quantityModulus % 10 < 5 ? quantityModulus % 10 : 5)];

      return phraseBase + suffixes[suffixesKey];
    };
  });
})();;
(function() {
    'use strict';

    var utils = angular.module('utils');

    utils.filter('wordcut', function() {
        return function(input, limit) {
            if(input.length < limit) {
                return input;
            }

            input = input.substring(0, limit).trim();

            var arr = input.split(" ");

            if(arr.length > 1) {
                arr.pop();
            }

            input = arr.join(" ");

            if(input !== "") {
                input += "...";
            }

            return input;
        }
    });
})();;
(function() {
    'use strict';

    var utils = angular.module('utils');

    utils.filter('numtolocale', function() {
        return function(input) {
            input = parseInt(input).toLocaleString();

            return input;
        }
    });
})();
;
(function() {
    'use strict';

    var utils = angular.module('utils');

    utils.filter('numdivider', function() {
        return function(input, divider, replacement) {
            if(input == undefined) {
                return '';
            }

            if(!divider && !replacement) {
                return input;
            }

            var re = new RegExp(divider || ',', "g");

            input = input.toString().replace(re, replacement || ',');

            return input;
        }
    });
})();

;
(function() {
	'use strict';

  	var utils = angular.module('utils');

  	utils.provider('countries', function() {
	  this.dataSource = '';

	  this.compareBy = '';

	  this.$get = [
		  '$http',

		  '$q',

		  '$log',

		  function($http, $q, $log) {
			var self = this;

			var dataSource = self.dataSource.trim();

			if( !dataSource ) {
			  throw {
				message: 'An empty data source was give for countries. Please configure countriesProvider'
			  };
			}

			return {
			  getList: function() {
				  $log.debug('Initiating request for fetching countries list');

			  	return $http.get(dataSource).then(function(response) {
				    return response.data;
					}, function(error) {
					  return $q.reject(error);
					});
			  },

			  compareBy: self.compareBy
			};
		  }
	  ];
	});
})();;
(function() {
	'use strict';

	var utils = angular.module('utils');

	utils.provider('currenciesSum', function() {
		this.dataSource = '';

		this.$get = ['$http', function($http) {
			var dataSource = this.dataSource.trim();

			if( !dataSource ) {
				throw {
					message: 'Empty data source for currencies to sum list. Please configure currenciesSumProvider'
				}
			}

			return {
				getList: function() {
					return $http.get(dataSource);
				}
			};
		}]
	});
})();;
(function () {
    'use strict';

    var utils = angular.module('utils');

    utils.provider('insuranceCalculation', function () {
        this.dataSource = '';

        this.$get = [
            '$http',

            '$q',

            '$log',

            'HEADERS',

            'TIMEOUT',

            'httpCsrfAware',

            function (
                $http,

                $q,

                $log,

                HEADERS,

                TIMEOUT,

                httpCsrfAware
            ) {
                var dataSource = this.dataSource.trim();

                if( !dataSource ) {
                    throw {
                        message: 'Empty data source. Please configure insuranceCalculationProvider'
                    }
                }

                // Calculation related data

                var processData = {
                    offerId: 0,

                    deferred: null
                };

                // Service helper methods

                var serviceHelper = {
                    getNewData: function(cancelPromise) {
                        $log.debug('Trying to fetch calculated data...');

                        var calculationDataPromise = $http({
                            isArray: false,

                            method: 'POST',

                            headers: {
                                'Accept': 'application/json'
                            },

                            url: dataSource + processData.offerId + '/successful-calculations?calculationType=NEW',

                            cache: false,

                            timeout: cancelPromise
                        });

                        return {
                            $promise: calculationDataPromise
                        };
                    },

                    launchPolling: function(cancelPromise) {
                        var self = this;

                        this.getNewData(cancelPromise).$promise.then(function(response) {
                            var headers = response.headers();

                            $log.debug('Response headers: ', headers);

                            if( headers[HEADERS.CALCULATION_STATUS_HEADER.NAME] !== HEADERS.CALCULATION_STATUS_HEADER.VALUE ) {
                                if(!response.data || !response.data.length) {
                                    setTimeout(function() {self.launchPolling(cancelPromise);}, TIMEOUT.CALCULATION);

                                    return $q.reject('Calculation timeout exceeded');
                                }
                                else {
                                    processData.deferred.notify(response.data);
                                    self.launchPolling(cancelPromise);
                                }
                            }
                            else {
                                processData.deferred.resolve();

                                serviceHelper.resetProcessData();

                                return $q.reject('Calculation process done');
                            }
                        }, function(error) {
                            $log.error('Can not get current calculation data: ', error);

                            return $q.reject(error);
                        });
                    },

                    resetProcessData: function() {
                        processData.offerId = 0;

                        processData.deferred = null;
                    }
                };

                return {
                    launchCalculation: function(data) {
                        var processDeferred = $q.defer();

                        var cancelProcess = $q.defer();

                        processData.deferred = processDeferred;

                        var launchCalculationFn = function(dataSource, cancelProcess) {
                            return $http({
                                method: 'POST',

                                url: dataSource,

                                isArray: false,

                                headers: {
                                    'Accept': 'application/json',

                                    'Content-type': 'application/json'
                                },

                                timeout: cancelProcess.promise,

                                data: data
                            });
                        };

                        httpCsrfAware.callMethod(launchCalculationFn, [dataSource, cancelProcess])
                          .then(function(response) {
                            $log.debug('Calculations group id received: ', response.data);

                            processData.offerId = response.data;

                            serviceHelper.launchPolling(cancelProcess.promise);
                          }, function (error) {
                              $log.error('Can not create calculation group: ', error);

                              serviceHelper.resetProcessData();

                              processDeferred.reject(error);
                          });

                        return {
                            $promise: processDeferred.promise,

                            cancel: function() {
                                cancelProcess.resolve();
                            }
                        };
                    }
                };
            }
        ];
    });
})();;
(function () {
	'use strict';

	var utils = angular.module('utils');

	utils.provider('orderManager', function () {
		this.draftPersistenceDestination = '';

		this.orderPurchaseDestination = '';

		this.acceptanceDestination = '';

		this.$get = [
			'$http',

			'$q',

			'httpCsrfAware',

			'CACHE_ITEMS',

			'HTTP_STATUSES',

			'dataStorage',

			'ROUTES',

			'ORDER_STATUSES',

			'$log',

			function ($http, $q, httpCsrfAware, CACHE_ITEMS, HTTP_STATUSES, dataStorage, ROUTES, ORDER_STATUSES, $log) {
				// Note: this refers to the orderManagerProvider

				var draftPersistenceDestination = this.draftPersistenceDestination;

				var orderPurchaseDestination = this.orderPurchaseDestination;

				var acceptanceDestination = this.acceptanceDestination;

				var draftCreationDestination = this.draftCreationDestination;

				if( !draftPersistenceDestination ) {
					throw {
						message: 'Empty draftPersistenceDestination for orderManagerProvider. Please configure it'
					}
				}

				if( !orderPurchaseDestination ) {
					throw {
						message: 'Empty orderPurchaseDestination for orderManagerProvider. Please configure it'
					}
				}

				if( !acceptanceDestination ) {
					throw {
						message: 'Empty acceptanceDestination for orderManagerProvider. Please configure it'
					}
				}

				if( !draftCreationDestination ) {
					throw {
						message: 'Empty draftCreationDestination for orderManagerProvider. Please configure it'
					}
				}
				
				/*
				 * By default order has a dummy status. It's a special status, indicating, that order
				 * has been initiated, but hasn't reached any logical mark.
				 */

				dataStorage.setData(CACHE_ITEMS.ORDER_STATUS, angular.toJson(ORDER_STATUSES.DUMMY_ORDER), true);

				return {
					/**
					 * Sends request to back-end for storing order preview
					 * @param {Object} data order preview data
					 * @returns {Object} result object with two fields - promise for storing order
					 * preview and cancel method, which terminates storing process
					 */

					storePreviewData: function(data) {
						var deferred = $q.defer();

						var storePreviewData = function(draftPersistenceDestination, deferred) {
							return $http.post(draftPersistenceDestination, data, {
								headers: {
									Accept: 'application/json',

									'Content-type': 'application/json',

									partner: dataStorage.getData('partnerId')
								},

								timeout: deferred.promise
							});
						};

						var self = this;

						var dataPromise = httpCsrfAware.callMethod(storePreviewData, [draftPersistenceDestination, deferred])
							.then(function(response) {
								if( response.status === HTTP_STATUSES.NO_CONTENT ) {
									self.orderStatus = ORDER_STATUSES.CALCULATION_NOT_FOUND;

									return $q.reject(ORDER_STATUSES.CALCULATION_NOT_FOUND.TITLE);
								}

							return response;
						}, function(error) {
								var orderStatus = error.status === HTTP_STATUSES.REQUEST_TIMEOUT
									? ORDER_STATUSES.DRAFT_FAILED
									: ORDER_STATUSES.SOMETHING_GOES_WRONG;

								self.orderStatus = orderStatus;

							return $q.reject(orderStatus.TITLE);
						});

						return {
							$promise: dataPromise,

							cancel: function() {
								deferred.resolve();
							}
						};
					},

					// todo: actualize method (either write documentation or remove it)

					getDraftData: function (draftId) {
						var deferred = $q.defer();

						var dataPromise = $http.get(draftPersistenceDestination + draftId, {
							timeout: deferred.promise
						});

						return {
							$promise: dataPromise,

							cancel: function () {
								deferred.resolve();
							}
						};
					},

					/**
					 * Fetches payment details for policy item
					 * @param {Object} data order which has to be paid
					 * @returns {Object} result object with two fields - promise for getting payment details
					 * and cancel method which terminates process of getting payment details
					 */

					getPaymentDetails: function (data) {
						var deferred = $q.defer();

						var getPaymentLink = function(orderPurchaseDestination, deferred){
							return $http({
								method: 'POST',

								url: orderPurchaseDestination,

								headers: {
									'Accept': 'application/json',

									'Content-type': 'application/json',

									'orderId': data
								},

								timeout: deferred.promise
							})
						};

						var self = this;

						var dataPromise = httpCsrfAware.callMethod(getPaymentLink, [orderPurchaseDestination, deferred])
							.then(function(response) {
									if( response.status === HTTP_STATUSES.NO_CONTENT ) {
										self.orderStatus = ORDER_STATUSES.PAYMENT_MICROSERVICE_UNAVAILABLE;

										return $q.reject(ORDER_STATUSES.PAYMENT_MICROSERVICE_UNAVAILABLE.TITLE);
									}

								return response;
							}, function(error) {
								self.orderStatus = error.status === HTTP_STATUSES.NOT_FOUND
								    || error.status === HTTP_STATUSES.INTERNAL_SERVER_ERROR
									? ORDER_STATUSES.PAYMENT_MICROSERVICE_UNAVAILABLE
									: ORDER_STATUSES.SOMETHING_GOES_WRONG;

								return $q.reject(error);
							});

						return {
							$promise: dataPromise,

							cancel: function() {
								deferred.resolve();
							}
						};
					},

					/**
					 * Returns order status
					 * @returns {Object|null} const indicating the last order status
					 */

					get orderStatus() {
						try {
							return angular.fromJson(dataStorage.getData(CACHE_ITEMS.ORDER_STATUS, true));
						} catch( e ) {
							return null;
						}
					},

					/**
					 * Stores order status in session storage by using
					 * 'orderStatus' as a key and values(constants) from order-statuses.js
					 * @param {Object} orderStatus indicating state of the order
					 */

					set orderStatus(orderStatus) {
						if( !_.isObject(orderStatus) ) {
							throw {
								message: 'Order status is not an object!'
							};
						}

						dataStorage.setData(CACHE_ITEMS.ORDER_STATUS, angular.toJson(orderStatus), true);
					},

					/**
					 * Initiates a request to the back-end regarding policy acceptance.
					 * Acceptance is a last step in payment chain (draft -> payment link -> acceptance)
					 * If back-end responds with either 204 or >= 4xx HTTP status code,
					 * then it's an error.
					 * Otherwise it's a success.
					 * @param {Number} orderId order id
					 * @returns {Httpromise} http promise for accepting policy item
					 */

					acceptPolicyItem: function(orderId) {
						var self = this;

						var req = {
							method: 'POST',

							url: acceptanceDestination,

							headers: {
								'Content-Type': 'application/json'
							},

							params: {
								orderId: orderId
							}
						};

						var paymentProcessStartedFn = function(req) {
							return $http(req).then(function(response) {
								if( response.status === HTTP_STATUSES.NO_CONTENT ) {
									self.orderStatus = ORDER_STATUSES.INSURANCE_SERVICE_UNAVAILABLE;
									
									return $q.reject({
										reason: 'Server did not managed to accept policy item',

										status: response.status
									});
								}

								return response.data;
							}, function(error) {
								self.orderStatus = ORDER_STATUSES.INSURANCE_SERVICE_UNAVAILABLE;
								
								return $q.reject(error);
							});
						};

						return httpCsrfAware.callMethod(paymentProcessStartedFn, [req]);
					},

					/**
					 * Stores insurance params in local storage
					 * @param {Object} data user's search configuration
					 */

					storeInsuranceParams: function(data) {
						localStorage.setItem(CACHE_ITEMS.TRIP_FORM, angular.toJson(data));
					},

					/**
					 * Returns use's search configuration
					 * @param {Boolean} getRaw flag indicating necessity of returning data in raw JSON format
					 * @returns {Object|String} result serialized or parsed representation of user's  search configuration
					 */

					getInsuranceParams: function(getRaw) {
						var rawData = localStorage.getItem(CACHE_ITEMS.TRIP_FORM);

						return getRaw ? rawData : angular.fromJson(rawData);
					},

					/**
					 * Stores user's insurance choice in local storage
					 * @param {Object} data policy's calculation data
					 */

					storeInsuranceChoice: function(data) {
						localStorage.setItem(CACHE_ITEMS.INSURANCE_CHOICE, angular.toJson(data));
					},

					/**
					 * Returns user's insurance choice
					 * @returns {Object} result parsed policy's calculation data
					 */

					getInsuranceChoice: function() {

						return angular.fromJson(dataStorage.getData(CACHE_ITEMS.INSURANCE_CHOICE));

					},

					/**
					 * Stores order preview in local storage by cherry picking parameters from policy item
					 * @param {String} config.calculationId calculation id of policy item
					 * @param {Object} config.insurer object representing insurer person
					 * @param {Array} config.insuredPersons an array representing insured persons
					 */

					storeOrderPreview: function(config) {
						localStorage.setItem(CACHE_ITEMS.ORDER_PREVIEW, angular.toJson({
							calculationId: config.calculationId,

							insurer: config.insurer,

							insuredPersons: config.insuredPersons
						}));
					},

					/**
					 * Returns order preview
					 * @returns {Object} result parsed representation of order preview
					 */

					getOrderPreview: function() {
						return angular.fromJson(localStorage.getItem(CACHE_ITEMS.ORDER_PREVIEW));
					},

					/**
					 * Stores order draft in local storage
					 * @param {Object} data object representing order draft
					 */

					storeOrderDraft: function(data) {
						localStorage.setItem(CACHE_ITEMS.ORDER_DRAFT, angular.toJson(data));
					},

					/**
					 * Sends request to back-end for creating order draft
					 * @param {Object} data policy item data
					 * @returns {Httpromise} http promise for getting draft id
					 */

					createOrderDraft: function(data) {
						var req = {
							method: 'POST',

							url: draftCreationDestination + '/' + data.calculationId,

							headers: {
								'Content-Type': 'application/json'
							}
						};

						var getDraftIdReq = function(req) {
							return $http(req).then(function(response) {
								return response.data;
							}, function(error) {
								$log.error('Failed to get draft id: ', error);

								return $q.reject(error);
							});
						};

						return httpCsrfAware.callMethod(getDraftIdReq, [req]);
					}
				};
			}];
	});
})();;
(function() {
  'use strict';

  var utils = angular.module('utils');

  utils.provider('insuranceCompanies', function() {
    this.dataSource = '';

    this.$get = [
      '$http',

      '$q',

      function(
        $http,

        $q
      ) {
        var dataSource = this.dataSource.trim();

        if( !dataSource ) {
         throw {
           message: 'Please configure insuranceCompaniesProvider'
         };
        }

        return {
          getList: function() {
            return $http.get(dataSource).then(function(response) {
              return response.data;
            }, function(error) {
              return $q.reject(error);
            });
          }
        };
      }
    ];
  });
})();;
(function() {
  'use strict';

  var utils = angular.module('utils');

  utils.provider('assistanceCompanies', function() {
    this.dataSource = '';

    this.$get = [
      '$http',

      function(
        $http
      ) {
        var dataSource = this.dataSource.trim();

        if( !dataSource ) {
          throw {
            message: 'Please configure assistanceCompaniesProvider'
          };
        }

        return {
          getList: function() {
            return $http.get(dataSource);
          }
        };
      }
    ];
  });
})();;
(function() {
	'use strict';

	var utils = angular.module('utils');

	utils.provider('riskFilters', function() {
		this.dataSource = '';

		this.$get = [
			'$http',

			function(
					$http
			) {
				// Note: this refers to the provider context

				var dataSource = this.dataSource;

				if( !dataSource.trim() ) {
					throw {
						message: 'Empty dataSource for risk filters. Please configure riskFiltersProvider'
					}
				}

				return {
					getList: function() {
						return $http.get(dataSource);
					}
				};
			}
		];
	});
})();;
(function() {
	'use strict';

	var utils = angular.module('utils');

	utils.provider('riskOptions', function() {
		this.dataSource = '';

		this.$get = [
			'$http',

			'$q',

			function(
					$http,

			    $q
			) {
				// Note: 'this' refers to the provider context

				var dataSource = this.dataSource;

				if( !dataSource.trim() ) {
					throw {
						message: 'Empty dataSource for risk options. Please configure riskOptionsProvider'
					}
				}

				return {
					getList: function() {
						return $http.get(dataSource).then(function(response) {
							return response.data;
						}, function(error) {
							return $q.reject(error);
						});
					}
				};
			}
		];
	});
})();;
(function() {
  'use strict';

  var utils = angular.module('utils');

  utils.provider('insuredDays', function() {
    this.dataSource = '';

    this.$get = [
      '$http',

      function(
        $http
      ) {
        var dataSource = this.dataSource.trim();

        if( !dataSource ) {
          throw {
            message: 'Please configure insuranceDaysProvider'
          };
        }

        return {
          getList: function() {
            return $http.get(dataSource);
          }
        };
      }
    ];
  });
})();;
(function() {
	'use strict';

	var utils = angular.module('utils');

	utils.provider('soldItems', function() {
		this.dataSource = '';

		this.$get = [
			'$http',

			'$q',

			function(
				$http,

        $q
			) {
				// Note: this refers to the provider context

				var dataSource = this.dataSource.POLICIES;
				if( !dataSource.trim() ) {
					throw {
						message: 'Empty dataSource for sales report. Please configure soldItemsProvider'
					}
				}

				return {
					soldItemsDataAll: function(param) {
						var deferred = $q.defer();
						var dataPromise = $http.get(dataSource, {
							method: 'GET',
							params: {'periodString': param},
							headers: {
								'Accept': 'application/json',

								'Content-type': 'application/json'
							},

							timeout: deferred.promise
						});
						return {
							$promise: dataPromise,

							cancel: function() {
								deferred.resolve();
							}
						};
					}
				};
			}
		];
	});
})();;
(function() {
	'use strict';

	var utils = angular.module('utils');

	utils.provider('insuranceTypes', function() {
		this.dataSource = '';

		this.$get = [
			'$http',

			'$q',

			function(
				$http,

			  $q
			) {
				var dataSource = this.dataSource.trim();

				if( !dataSource ) {
					throw {
						message: 'Please configure insuranceTypesProvider'
					};
				}

				return {
					/**
					 * Fetches insurance types from the sever
					 * @returns {HttpPromise} promise for fetching insurance types
					 */

					getList: function() {
						return $http.get(dataSource).then(function(response) {
							return response.data;
						}, function(error) {
							return $q.reject(error);
						});
					}
				};
			}
		];
	});
})();;
(function () {
    'use strict';

    var privateOffice = angular.module('privateOffice', []);
})();;
(function() {
  'use strict';

  var privateOffice = angular.module('privateOffice');

  privateOffice.controller('privateOfficeController', [
    '$scope',

    '$q',

    'policiesManager',

    '$location',

    // Note: riskOptions here is an already fetched list of risk options

    'riskOptions',

    'ROUTES',

    'POLICY_STRUCTURE',

    '$log',

    'orderManager',

    'EVENTS',

    'INSURANCE_COMPANIES',

    function(
      $scope,

      $q,

      policiesManager,

      $location,

      riskOptions,

      ROUTES,

      POLICY_STRUCTURE,

      $log,

      orderManager,

      EVENTS,

      INSURANCE_COMPANIES
    ) {
      var privateOfficeController = this;

      /**
       * Returns link for downloading policy item
       * @param {Object} item policy's calculation data
       * @returns {String} url link for downloading policy item or empty string if there is no such url
       */

      this.getDownloadLink = function(item) {
        var link = '';

        try {
          link = item.links.downloadLink || link;
        } catch( error ) {
          $log.warn('Attempt to get policy\'s link failed: ', error);
        }

        return link;
      };

	    /**
       * Stores order policy item as order preview
       * @param {Object} item policy's calculation data
       */

      this.saveOrderPreview = function(item) {
        orderManager.storeOrderPreview({
          calculationId: item.calculationId,

          insurer: item.insurer,

          insuredPersons: item.insuredPersons
        });
      };

	    /**
       * Returns url for policy payment step
       */

      this.getPaymentStepLink = function() {
        return ROUTES.ORDER_PAYMENT;
      };

      $scope.policyStructure = _.reduce(POLICY_STRUCTURE.TYPES, function(result, categoryObj, type) {
        var categoryClone = angular.copy(categoryObj);

        categoryClone.type = type;

        result.push(categoryClone);

        return result;
      }, []);

      $scope.policyFilter = {};

      $scope.policyFilter[POLICY_STRUCTURE.POLICY_FIELDS.TYPE] = undefined;

      $scope.policiesFetched = false;

      $scope.policiesList = null;

      $scope.itemsPerCategory = null;

      $scope.activePolicyType = null;

	    /**
       * Sets policy filter
       * @param {String} policyType policy type
       */

      $scope.setPoliciesFilter = function(policyType) {
        $scope.policyFilter[POLICY_STRUCTURE.POLICY_FIELDS.TYPE] = policyType !== 'ANY' ?
          policyType : undefined;
      };

      /**
       * Getter for policy filter
       * @returns {Object} result policy filter
       */

      $scope.getPolicyFilter = function() {
        return $scope.policyFilter;
      };

      /**
       * Returns label relevant to policy's category
       * @param {Object} policyItem policy object
       * @returns {String} result label, relevant to policy type
       */

      $scope.getPolicyType = function(policyItem) {
        return POLICY_STRUCTURE.TYPES[policyItem[POLICY_STRUCTURE.POLICY_FIELDS.TYPE]].itemLabel;
      };

      /**
       * Checks if policy item is of a certain type
       * @param {Object} policyItem policy item object
       * @param {String} type service label of policy type (category)
       * @returns {Boolean} result flag of belonging item to a certain type
       */

      $scope.checkPolicyType = function(policyItem, type) {
        return type === POLICY_STRUCTURE.TYPES[policyItem[POLICY_STRUCTURE.POLICY_FIELDS.TYPE]].serviceLabel;
      };

      /**
       * Returns policy action label depending on it's type
       * @param {Object} policyItem
       */

      $scope.getPolicyActionLabel = function(policyItem) {
	      return POLICY_STRUCTURE.TYPES[policyItem[POLICY_STRUCTURE.POLICY_FIELDS.TYPE]].actionLabel;
      };

      /**
       * Sets policy type as currently active
       * @param {String} policyType type of policy
       */

      $scope.setActivePolicyType = function(policyType) {
        $scope.activePolicyType = policyType;
      };

      // Set 'ANY' as the default active policy type

      $scope.setActivePolicyType('ANY');

      /**
       * Checks if policy type is currently active
       * @param {String} policyType policy type
       * @returns {Boolean} result flag indicating the fact of policy type activity
       */

      $scope.policyTypeIsActive = function(policyType) {
        return $scope.activePolicyType === policyType;
      };

      /**
       * Creates policies comparator function.
       * If type is 'category', then items shall be compared using
       * category's order number.
       * If type is 'date', then items shall be compared using item's
       * last modification time.
       * @param {String} type parameter which should be used in order
       * to compare two policies
       * @param {Boolean} useReverse whether or not we shall sort in
       * reverse order.
       * @returns {Function} comparator function for comparing two policy items
       */

      this.createComparator = function(type, useReverse) {
        if( ['category', 'date'].indexOf(type) === -1 ) {
          return angular.noop;
        }

        return function(item) {
          var output;

          if( type === 'category' ) {
            var policyFilter = $scope.getPolicyFilter();

            /*
             * If currently we should see 'ANY' type of policy, then
             * policyFilter[POLICY_STRUCTURE.POLICY_FIELDS.TYPE] would have undefined value
             */

            var compositionModeEnabled = !policyFilter[POLICY_STRUCTURE.POLICY_FIELDS.TYPE];

            var categoryData = POLICY_STRUCTURE.TYPES[item[POLICY_STRUCTURE.POLICY_FIELDS.TYPE]];

            output = categoryData[compositionModeEnabled ? 'compositionPriority' : 'priority'];
          } else {
            output = new Date(item.creationDate).getTime();
          }

          return output * ( !!useReverse ? -1 : 1 );
        };
      };

      $scope.sortByCategory = this.createComparator('category');

      $scope.sortByDate = this.createComparator('date', true);

      /**
       * Checks if there are policies of a certain type
       * @param {String} policyCategory category of a policy item
       * @returns {Boolean} result flag indicating presence for policies
       * of a certain type (exception only for type 'ANY' - it's always presented
       * as well as there is at least one policy item)
       */

      $scope.policiesExists = function(policyCategory) {
        if( policyCategory === 'ANY' && !!$scope.policiesList.length ) {
          return true;
        }

        var config = {};

        config[POLICY_STRUCTURE.POLICY_FIELDS.TYPE] = policyCategory;

        return _.some($scope.policiesList, config);
      };

	    /**
       * Counts policies quantity by grouping them by categories.
       * Category is determined as a distinct value from values consisting from a chosen criteria's value in each object
       * Example: criteria = 'status'
       * Result: {distinctValueAForStatusCriteria: someQuantity, distinctValueBForStatusCriteria: anotherQuantity}
       * See details at https://lodash.com/docs#countBy
       * @param {Array} items array of input values
       * @param {String} countBy grouping criteria
       */

      this.countItemsByCategory = function(items, countBy) {
        $scope.itemsPerCategory = _.countBy(items, countBy);

        $log.debug('Grouping items per category: ', $scope.itemsPerCategory);
      };

      // Fetch policies list and count them by category

      policiesManager.getList()
        .then(function(policiesList) {
          $log.debug('Fetched policies list: ', policiesList);

	        /*
	         * By default policy status is on the root level of policy object.
	         * Search result item accepts calculation data, which has no such
	         * a filed by default.
	         * In that case augment calculation data with this field.
	         * Also augment calculation data with confirmation data (about insurer,
	         * insuredPersons and calculationId) since they has to be there in order
	         * to store insuranceChoice and orderPreview to localStorage
	         */

	        policiesList.forEach(function(policy) {
		        policy.calculationData.status = policy.status;

            angular.merge(policy.calculationData, policy.confirmationData);
	        });

          $scope.policiesList = policiesList;

          $scope.policiesFetched = true;

          privateOfficeController.countItemsByCategory(policiesList, POLICY_STRUCTURE.POLICY_FIELDS.TYPE);
        }, function(error) {
          $log.error('Can not fetch policies list: ', error);
        });

      $scope.riskOptions = riskOptions;

      // Expand the new item and collapse expanded at the moment

      $scope.expandItem = function(item) {
        item.expanded = !item.expanded;
      };

      /**
       * Removes item from personal cabinet
       * @param {Object} item policy item
       * @returns {Promise} promise promise for removing item from personal cabinet
       */

      $scope.removeItem = function(item) {
        var policyId = _.get(item, 'confirmationData.policyId');

        if (typeof policyId === 'undefined') {
          var err = 'No policy ID specified for deletion.';
          $log.error(err);
          return $q.reject(err);
        }

        return policiesManager.removeItem(policyId)
          .then(function() {
            $log.debug('Policy item ' + policyId + ' was successfully removed from personal cabinet');
            _.remove($scope.policiesList, item);
          }, function(error) {
            $log.error('Can not remove item ' + policyId + ' from personal cabinet: ', error);
            return $q.reject(error);
          });
      };

	    /**
       * Executes an action relevant to a policy item
       * @param {Object} item policy's calculation data
       * @returns {String} url url for resource associated with current state of policy item
       */

      $scope.getActionResource = function(item) {
        switch( true ) {
          case $scope.checkPolicyType(item, 'paid'):
            return privateOfficeController.getDownloadLink(item);

          case $scope.checkPolicyType(item, 'draft'):

          case $scope.checkPolicyType(item, 'payment-pending'):
            return privateOfficeController.getPaymentStepLink();
        }
      };

	    /**
       * Saves insuranceChoice and orderPreview in local storage for a given policy item
       * only if it's of a type DRAFT of PAYMENT-PENDING
       * @param {Object} item policy item
       */

      $scope.executePolicyAction = function(item) {
        if( $scope.checkPolicyType(item, 'draft') || $scope.checkPolicyType(item, 'payment-pending') ) {
          orderManager.storeInsuranceChoice(item);

          privateOfficeController.saveOrderPreview(item); 
        }
      };

      $scope.updateFilteredPolicyItems = function() {
        $scope.$broadcast(EVENTS.SEARCH_RESULT_ITEM.UPDATE_ITEMS);
      };

      $scope.vtbCompany = INSURANCE_COMPANIES.VTB.LABEL;

      $scope.isInsuranceCompany = function(expected, current) {
        return expected === current;
      };
    }
  ]);
})();
;
(function() {
    'use strict';

    var adminMonitor = angular.module('adminMonitor', []);
})();;
(function() {
    'use strict';

    var partner = angular.module('adminMonitor');

    partner.controller('adminMonitorController', [
        '$scope',

        '$log',

        '$q',

        'soldItems',

        'userAuth',

        'REST_API',

        'insuranceTypes',

        'insuranceCompanies',

        '$http',

        'httpCsrfAware',

        'HTTP_STATUSES',

        function(
            $scope,

            $log,

            $q,

            soldItems,

            userAuth,

            REST_API,

            insuranceTypes,

            insuranceCompanies,

            $http,

            httpCsrfAware,

            HTTP_STATUSES
        ) {
            var adminController = this;

            $scope.site = REST_API.SITE;

            $scope.cancelPolicyDestination = $scope.site + '/internal/policy/order/admin/status/';

            $scope.insuranceTypes = null;

            $scope.insuranceCompanies = null;

            this.data = null;


            /**
             * Fetches insurance types and sets them on $scope
             */

            this.fetchInsuranceTypes = function() {
                insuranceTypes.getList()
                    .then(function(data) {
                        $log.debug('Fetched insurance types: ', data);

                        $scope.insuranceTypes = data;
                    }, function(error) {
                        $log.error('Unable to fetch insurance types: ', error);
                    });
            };

            /**
             * Fetches information about paid policies
             * @param {Object} period object representing a time range
             * @returns {Promise} promise for fetching data about paid policies
             */

            this.fetchPoliciesData = function(period) {
                return soldItems.soldItemsDataAll(period.value).$promise

                    .then(function(response) {
                            $scope.soldItems = response.data;

                            $log.debug('Received sold items: ', $scope.soldItems);

                            return $scope.soldItems;
                        }, function(error) {
                            $log.error('Error while trying to fetch info about sold items: ', error);

                            return $q.reject(error);
                        }
                    );
            };

            /**
             * Fetches insurance companies and sets them on $scope
             */

            this.fetchInsuranceCompanies = function() {
                insuranceCompanies.getList()
                    .then(function(data) {
                        $log.debug('Fetched insurance companies: ', data);

                        $scope.insuranceCompanies = data.content;
                    }, function(error) {
                        $log.error('Unable to fetch insurance companies list: ', error);
                    });
            };

            $scope.soldItems = [];

            $scope.overallPrice = 0;

            $scope.overallRiskmarketRevenue = 0;

            $scope.periods = [
                {
                    value: 'DAY',

                    label: 'Сегодня'
                },

                {
                    value: 'YESTERDAY',

                    label: 'Вчера'
                },

                {
                    value: 'MONTH',

                    label: 'Текущий месяц'
                },

                {
                    value: 'ALL',

                    label: 'За все время'
                }
            ];

            $scope.soldBy = [
                {
                    value: 'ALL',

                    label: 'Все продажи'
                },

                {
                    value: 'RiskMarket',

                    label: 'Через РискМаркет'
                },

                {
                    value: 'Partners',

                    label: 'Через партнеров'
                }

            ];
            $scope.paidStatuses = [

                {
                    value: 'ALL',

                    label: 'Все'
                },

                {
                    value: 'true',

                    label: 'Оплачены'
                },

                {
                    value: 'false',

                    label: 'Не оплачены'
                }

            ];

            $scope.policyStatuses = [

                {
                    value: 'ALL',

                    label: 'Все'
                },

                {
                    value: 'OK',

                    label: 'Не требуют ручного вмешательства'
                },

                {
                    value: 'ALARM',

                    label: 'Требуют ручного вмешательства'
                }

            ];


            /**
             * Returns human readable insurance type for a policy element
             * @param {String} insuranceCode insurance code
             * @returns {String} human readable name of the insurance type
             */

            $scope.getInsuranceType = function(insuranceCode) {
                return !!$scope.insuranceTypes && insuranceCode in $scope.insuranceTypes ? $scope.insuranceTypes[insuranceCode] : '';
            };

            /**
             * Returns human readable insurance company name
             * @param {String} insuranceCompanyCode insurance company code
             * @returns {String} human readable name of the insurance company
             */

            $scope.getInsuranceCompanyName = function(insuranceCompanyCode) {
                var name = '';

                if( !!$scope.insuranceCompanies ) {
                    var company = _.find($scope.insuranceCompanies, {code: insuranceCompanyCode});

                    name = !!company ? company.nameRus : name;
                }

                return name;
            };

            /**
             * Returns calculated value of riskmarket's revenue
             * @param {String} policyType type of a policy item
             * @param {Number} policyPrice policy item price
             * @returns {Number} calculated value of partner's revenue
             */

            $scope.getRiskmarketRevenue = function(needToShow, policyPrice) {
                if(needToShow) {
                    return policyPrice;
                } else return 0;
            };

            /**
             * Sets chosen paid status
             * @param {Object} paidStatusObj paid status object in form of {label: '<String>', value: '<String>'}
             */

            this.setPaidStatusInCtrl = function(paidStatusObj) {
                $scope.paidStatus = angular.copy(paidStatusObj);
            };

            //set default
            this.setPaidStatusInCtrl($scope.paidStatuses[0]);

            $scope.setPaidStatus = function(status) {
               adminController.setPaidStatusInCtrl(status);

               adminController.fillTotalsReport($scope.soldItems);
            };

            /**
             * Checks if paid status is currently chosen
             * @param {Object} status to check
             * @returns {Boolean} result Boolean flag indicating activity of status
             */

            $scope.paidStatusIsChosen = function(status) {
                return $scope.paidStatus.value === status.value;
            };

            /**
             * Sets chosen policy status
             * @param {Object} policyStatusObj policy status object in form of {label: '<String>', value: '<String>'}
             */

            this.setPolicyStatusInCtrl = function(policyStatusObj) {
                $scope.policyStatus = angular.copy(policyStatusObj);
            };

            //set default
            this.setPolicyStatusInCtrl($scope.policyStatuses[0]);

            $scope.setPolicyStatus = function(status) {
                adminController.setPolicyStatusInCtrl(status);

                adminController.fillTotalsReport($scope.soldItems);
            };

            /**
             * Checks if paid status is currently chosen
             * @param {Object} status to check
             * @returns {Boolean} result Boolean flag indicating activity of status
             */

            $scope.policyStatusIsChosen = function(status) {
                return $scope.policyStatus.value === status.value;
            };

            /**
             * Sets chosen period object
             * @param {Object} periodObj period object in form of {label: '<String>', value: '<String>'}
             */

            this.setChosenPeriod = function(periodObj) {
                $scope.chosenPeriod = angular.copy(periodObj);
            };

            // Set last available period as chosen

            this.setChosenPeriod($scope.periods[0]);

            /**
             * Shows info about paid items for a certain time range
             * Checks if period is currently chosen
             * @param {Object} period Period to check
             * @returns {Boolean} result Boolean flag indicating activity of period
             */

            $scope.periodIsChosen = function(period) {
                return $scope.chosenPeriod.value === period.value;
            };

            /**
             * Shows info about paid items for a within a certain time range
             * @param {Object} period object representing a time range
             */

            $scope.showPaidInfo = function(period) {
                adminController.setChosenPeriod(period);

                $q.all([
                    adminController.fetchPoliciesData(period)
                ])

                    .then(function() {
                        adminController.fillTotalsReport($scope.soldItems);

                        adminController.updateCsvExportLink(period.value);
                    }, function(error) {
                        $log.error('Unable to fill totals report data: ', error);
                    });
            };

            /**
             * Counts total number of sold items
             * @returns {Number} number of items
             */

            $scope.getTotalSoldItems = function() {

                var res = 0;
                for (var i = 0, len = $scope.soldItems.length; i < len; i++) {
                    if($scope.show($scope.soldItems[i])){
                        ++res;
                    }
                }
                return res;
            };


            /**
             * @returns {String} boolean as rus strings
             */

            $scope.toRusString = function(value) {
               return value ? 'да' : 'нет';
            };

            /**
             * @param {Object} policy/order item, which come from BE
             * @return {Boolean} show or don't show the item
             */

            $scope.show = function (item) {
                return $scope.showAccordingPaidStatuses(item) &&  $scope.showAccordingPolicyStatuses(item);
            };

            $scope.showAccordingPaidStatuses = function (item) {
                if ($scope.paidStatus.value === 'ALL') return true;
                else return ($scope.paidStatus.value === 'true') == item.paid;
            };

            $scope.showAccordingPolicyStatuses = function (item) {
                if ($scope.policyStatus.value === 'ALL') return true;
                else return ($scope.policyStatus.value === item.status);
            };

            /**
             * Fills total details
             * @param {Array} data sold policy items
             */

            this.fillTotalsReport = function(data) {
                var totals = data.reduce(function(totals, current) {
                    totals.totalPrice += current.paid && $scope.show(current) ? current.price : 0;

                    totals.totalPartnerRevenue += $scope.getRiskmarketRevenue(current.paid && $scope.show(current), current.price);

                    return totals;
                }, {
                    totalPrice: 0,

                    totalRiskmarketRevenue: 0
                });

                $scope.overallPrice = {
                    int: Math.floor(totals.totalPrice),

                    float: totals.totalPrice % 1
                };

                $scope.overallRiskmarketRevenue = {
                    int: Math.floor(totals.totalRiskmarketRevenue),

                    float: totals.totalRiskmarketRevenue % 1
                };
            };

            /**
             * Updates csv export link depending on the chosen period
             * @param {String} period chosen period
             */

            this.updateCsvExportLink = function(period) {
                $scope.downloadUrl = REST_API.ADMIN_MONITOR.EXCEL + '/' + period;
            };


            $scope.showConfirmDialog = function (cancelled, policyId) {

                if(cancelled){
                    window.alert("Полис уже отменен.");
                } else {
                    var res = window.confirm("Вы уверены, что хотите отменить этот полис?");
                    if (res) {
                        console.log("You pressed OK!");
                        $scope.cancelPolicy(policyId);
                    } else {
                        console.log("You pressed Cancel!");
                    }
                }


            };


            $scope.cancelPolicy = function(policyId) {
                var deferred = $q.defer();

                var cancelPolicyDestinationWithId = $scope.cancelPolicyDestination + policyId;

                var cancelPolicyData = function(cancelPolicyDestinationWithId, deferred) {
                    return $http({
                        method: 'POST',

                        url: cancelPolicyDestinationWithId,

                        headers: {
                            'status': 'CANCELLED'
                        },

                        timeout: deferred.promise
                    });
                };

                var self = this;

                httpCsrfAware.callMethod(cancelPolicyData, [cancelPolicyDestinationWithId, deferred])
                    .then(function(response) {
                        if( response.status === HTTP_STATUSES.NO_CONTENT ) {
                           window.info('There is no policy with such id');
                        }
                        $scope.showPaidInfo($scope.chosenPeriod);//reload all, optimize in future


                    }, function(error) {
                        window.error('Could not change policy status!');
                    });

            };

            // Load sold items right away with default chosen period

            $scope.showPaidInfo($scope.chosenPeriod);

            // Set data export link depending on the chosen time period

            this.updateCsvExportLink(REST_API.ADMIN_MONITOR.EXCEL + '/' + $scope.chosenPeriod.value);

            // Fetch insurance types

            this.fetchInsuranceTypes();

            // Fetch insurance companies

            this.fetchInsuranceCompanies();
        }
    ]);
})();;
(function() {
	'use strict';

	angular.module('partner', []);
})();;
(function() {
	'use strict';

	var partner = angular.module('partner');

	partner.controller('PartnerController', [
		'$scope',

		'$log',

		'$q',

		'soldItems',

		'userAuth',

		'REST_API',

		'insuranceTypes',

		'insuranceCompanies',

		function(
			$scope,

			$log,

			$q,

			soldItems,

			userAuth,
			
			REST_API,

			insuranceTypes,

			insuranceCompanies
		) {
			var partnerController = this;
			
			$scope.insuranceTypes = null;

			$scope.insuranceCompanies = null;

			this.partner = null;

			/**
			 * Fetches partner data
			 * @returns {Promise} promise for fetching partner data
			 */

			this.fetchPartnerData = function() {
				return userAuth.getPartnerData().then(function(data) {
					$log.debug('Partner data: ', data);

					partnerController.partner = data;

					return partnerController.partner;
				}, function(error) {
					$log.error('Unable to fetch partner data: ', error);

					return $q.reject(error);
				});
			};

			/**
			 * Fetches insurance types and sets them on $scope
			 */

			this.fetchInsuranceTypes = function() {
				insuranceTypes.getList()
					.then(function(data) {
						$log.debug('Fetched insurance types: ', data);

						$scope.insuranceTypes = data;
					}, function(error) {
						$log.error('Unable to fetch insurance types: ', error);
					});
			};

			/**
			 * Fetches information about paid policies
			 * @param {Object} period object representing a time range
			 * @returns {Promise} promise for fetching data about paid policies
			 */

			this.fetchPaidData = function(period) {
				return soldItems.soldItemsDataAll(period.value).$promise

					.then(function(response) {
							$scope.soldItems = response.data;

							$log.debug('Received sold items: ', $scope.soldItems);

							return $scope.soldItems;
						}, function(error) {
							$log.error('Error while trying to fetch info about sold items: ', error);

							return $q.reject(error);
						}
					);
			};

			/**
			 * Fetches insurance companies and sets them on $scope
			 */

			this.fetchInsuranceCompanies = function() {
				insuranceCompanies.getList()
					.then(function(data) {
						$log.debug('Fetched insurance companies: ', data);

						$scope.insuranceCompanies = data.content;
					}, function(error) {
						$log.error('Unable to fetch insurance companies list: ', error);
					});
			};
			
			$scope.soldItems = [];
			
			$scope.overallPrice = 0;

			$scope.overallPartnerRevenue = 0;
			
			$scope.periods = [
				{
					value: 'DAY',
					
					label: 'Сегодня'
				},

				{
					value: 'YESTERDAY',

					label: 'Вчера'
				},

				{
					value: 'MONTH',

					label: 'Текущий месяц'
				},

				{
					value: 'ALL',

					label: 'За все время'
				}
			];

			/**
			 * Returns human readable insurance type for a policy element
			 * @param {String} insuranceCode insurance code
			 * @returns {String} human readable name of the insurance type
			 */

			$scope.getInsuranceType = function(insuranceCode) {
				return !!$scope.insuranceTypes && insuranceCode in $scope.insuranceTypes ? $scope.insuranceTypes[insuranceCode] : '';
			};

			/**
			 * Returns human readable insurance company name
			 * @param {String} insuranceCompanyCode insurance company code
			 * @returns {String} human readable name of the insurance company
			 */

			$scope.getInsuranceCompanyName = function(insuranceCompanyCode) {
				var name = '';

				if( !!$scope.insuranceCompanies ) {
					var company = _.find($scope.insuranceCompanies, {code: insuranceCompanyCode});

					name = !!company ? company.nameRus : name;
				}

				return name;
			};

			/**
			 * Returns calculated value of partner's revenue
			 * @param {String} policyType type of a policy item
			 * @param {Number} policyPrice policy item price
			 * @returns {Number} calculated value of partner's revenue
			 */

			$scope.getPartnerRevenue = function(policyType, policyPrice) {
				var revenue = 0;

				if( !!partnerController.partner && partnerController.partner.active ) {
					var partnerInterest = partnerController.partner.insuranceTypeDatas[policyType];

					revenue = !!partnerInterest ? partnerInterest.commission / 100 * policyPrice : revenue;

					if( !partnerInterest ) {
						$log.warn('Partner does not have a commission for that type of policy');
					}
				}

				return revenue;
			};

			/**
			 * Sets chosen period object
			 * @param {Object} periodObj period object in form of {label: '<String>', value: '<String>'}
			 */

			this.setChosenPeriod = function(periodObj) {
				$scope.chosenPeriod = angular.copy(periodObj);
			};

			// Set last available period as chosen
			
			this.setChosenPeriod($scope.periods[0]);
			
			/**
			 * Shows info about paid items for a certain time range
			 * Checks if period is currently chosen
			 * @param {Object} period Period to check
			 * @returns {Boolean} result Boolean flag indicating activity of period
			 */

			$scope.periodIsChosen = function(period) {
				return $scope.chosenPeriod.value === period.value;
			};

			/**
			 * Shows info about paid items for a within a certain time range
			 * @param {Object} period object representing a time range
			 */
			
			$scope.showPaidInfo = function(period) {
				partnerController.setChosenPeriod(period);

				$q.all([
					partnerController.fetchPartnerData(),

					partnerController.fetchPaidData(period)
				])

				.then(function() {
					partnerController.fillTotalsReport($scope.soldItems);

					partnerController.updateCsvExportLink(period.value);
				}, function(error) {
					$log.error('Unable to fill totals report data: ', error);
				});
			};

			/**
			 * Counts total number of sold items
			 * @returns {Number} number of items
			 */

			$scope.getTotalSoldItems = function() {
				return $scope.soldItems.length;
			};

			/**
			 * Fills total details
			 * @param {Array} data sold policy items
			 */

			this.fillTotalsReport = function(data) {
				var totals = data.reduce(function(totals, current) {
					totals.totalPrice += current.price;

					totals.totalPartnerRevenue += $scope.getPartnerRevenue(current.insuranceTypeCode, current.price);

					return totals;
				}, {
					totalPrice: 0,

					totalPartnerRevenue: 0
				});

				$scope.overallPrice = {
					int: Math.floor(totals.totalPrice),

					float: totals.totalPrice % 1
				};

				$scope.overallPartnerRevenue = {
					int: Math.floor(totals.totalPartnerRevenue),

					float: totals.totalPartnerRevenue % 1
				};
			};

			/**
			 * Updates csv export link depending on the chosen period
			 * @param {String} period chosen period
			 */

			this.updateCsvExportLink = function(period) {
				$scope.downloadUrl = REST_API.ADMIN_MONITOR.CSV + '/' + period;
			};

			// Load sold items right away with default chosen period

			$scope.showPaidInfo($scope.chosenPeriod);

			// Set data export link depending on the chosen time period

			this.updateCsvExportLink(REST_API.ADMIN_MONITOR.CSV + '/' + $scope.chosenPeriod.value);

			// Fetch insurance types

			this.fetchInsuranceTypes();

			// Fetch insurance companies

			this.fetchInsuranceCompanies();
		}
	]);
})();;
(function() {
	'use strict';

	var partnerLogin = angular.module('partnerLogin', []);
})();
;
(function() {
	'use strict';

	var partnerLogin = angular.module('partnerLogin');

	partnerLogin.controller('partnerLoginController', [
	  '$scope',

		'$log',

		'userAuth',

		'ROUTES',

		'manageLocation',

		'REGEXP',

		'USER_TYPES',

		'WARNINGS',

		'formHelper',

		function(
			$scope,

			$log,

			userAuth,

			ROUTES,

			manageLocation,

			REGEXP,

			USER_TYPES,

			WARNINGS,

			formHelper
		) {
			var partnerLoginController = this;

			$scope.regexp = REGEXP;

			$scope.feedBack = '';

			$scope.loginError = false;

			$scope.userType = USER_TYPES.PARTNER;

			/**
			 * Redirects user to the partner cabinet page
			 */

			this.goToCabinet = function() {
				manageLocation.redirect(ROUTES.PARTNER);
			};

			var currentUser = userAuth.getCurrentUser().value;

			if( !!currentUser && currentUser.userType === USER_TYPES.PARTNER ) {
				partnerLoginController.goToCabinet();

				return;
			}

			/**
			 * Sends user's credentials for further check and handles response
			 */

			$scope.submit = function() {
			  userAuth.login($scope.formData.userName, $scope.formData.password, !$scope.formData.alienComputer, $scope.userType)
				.then(function() {
				  $scope.loginError = false;

				  $scope.feedBack = '';

					partnerLoginController.goToCabinet();
				}, function (err) {
				  $log.error('Can not login. Reason: ', err);

				  $scope.loginError = true;

				  $scope.feedBack = WARNINGS.LOGIN_FORM.LOGIN_ERROR;
				});
			};

			/**
			 * Toggles password visibility
			 * @param $event Handled event
			 */

			$scope.showpassword = function($event) {
				formHelper.togglePasswordDisplay($event);
			};
		}
	]);
})();;
(function() {
	'use strict';

	angular.module('comparePolicies', ['registry']);
})();;
(function() {
	'use strict';

	var comparedPolicies = angular.module('comparePolicies');

	comparedPolicies.controller('ComparePoliciesController', [
		'$scope',
		
		'manageLocation',
		
		'orderManager',

		'dataStorage',

		'ROUTES',

		'CURRENCY_SYMBOLS',
		
		'CACHE_ITEMS',

		'$log',

		'EVENTS',

		'VENDOR_COMPANIES',

		function(
			$scope,
			
			manageLocation,

			orderManager,

		  dataStorage,

		  ROUTES,

			CURRENCY_SYMBOLS,
			
			CACHE_ITEMS,

			$log,

			EVENTS,

			VENDOR_COMPANIES
		) {
			var comparedPoliciesController = this;

			$scope.sortData = {
				order: ''
			};
			
			$scope.comparedPoliciesList = angular.fromJson(dataStorage.getData(CACHE_ITEMS.COMPARED_POLICIES)) || [];

			$scope.searchResultsLink = ROUTES.SEARCH_RESULTS;

			/**
			 * Fetches parameter info
			 * @param {String} paramName parameter name
			 * @returns {Object|null} parameter object (if found) or null (otherwise)
			 */

			this.getCompareParamData = function(paramName) {
				if( _.isArray($scope.compareParams) ) {
					return _.find($scope.compareParams, {
						paramName: paramName
					}) || null;
				}

				return null;
			};

			/**
			 * Stores insurance params in a storage
			 * @param {Object} data data which should be saved
			 */

			this.cacheInsuranceParams = function(data) {
				orderManager.storeInsuranceParams(data);
			};

			/**
			 * Fetches insurance parameters
			 * @returns {Object} result cached insurance parameters
			 */

			this.fetchInsuranceParams = function() {
				/*
				 * If there is no insuranceParams in local storage, then create a dummy skeleton and write it to the localStorage
				 * passing true as an argument returns raw json
				 */

				var insuranceParams = orderManager.getInsuranceParams(true);

				if( !insuranceParams ) {
					insuranceParams = {
						passengers: [],

						period: {
							'start-date': '',

							'end-date': ''
						},

						country: []
					};

					comparedPoliciesController.cacheInsuranceParams(insuranceParams);
				}

				return orderManager.getInsuranceParams();
			};
			
			$scope.insuranceParams = this.fetchInsuranceParams();

			$scope.insuranceParams.riskFilters = $scope.insuranceParams.riskFilters || {};

			$scope.insuranceParams.specialTermFilters = $scope.insuranceParams.specialTermFilters || [];
			
			/**
			 * Stores current insurance params and redirects user to the search results page
			 * @param {Object} data insurance params data
			 */

			$scope.launchCalculation = function(data) {
				comparedPoliciesController.cacheInsuranceParams(data);

				manageLocation.redirect(ROUTES.SEARCH_RESULTS);
			};

			/**
			 * Converts similar values to the same
			 * value (polyfill for different back-end values,
			 * which basically mean the ame)
			 * @param {String|Object} data input data either as a string or an object
			 * @returns {String|Object} polyfilled version of a value (either string or data)
			 */

			this.polyfillSameValue = function(data) {
				var sameValueRe = /^[0_]|OPTIONAL|NOT_INCLUDED$/i;

				if( typeof data === 'object' ) {
					data.riskStatus = sameValueRe.test(data.riskStatus) ? 'NOT_INCLUDED' : data.riskStatus;
				} else {
					data = sameValueRe.test(data) ? 'NOT_INCLUDED' : data;
				}

				return data;
			};

			/**
			 * Checks if items are matching filter settings for a certain criteria (have the same
			 * value for a given parameter or differs).
			 * @param {Object} param parameter object
			 * @param {Array} items array of compared items
			 * @returns {Boolean} flag indicating a fact, that either all items has the same value for a given
			 * parameter or they differ.
			 */

			$scope.matchesFilter = function(param, items) {
				if( !$scope.sortData.order || param.showAlways || !!param.match && param.match.paramName ) {
					return true;
				} else if( _.isArray(items) && items.length ) {
					param.match = param.match || {};

					if( _.isArray(param.children) ) {
						param.match.paramName = param.children.some(function(paramName) {
							var paramData = comparedPoliciesController.getCompareParamData(paramName);

							return $scope.matchesFilter(paramData, items);
						});
					} else {
						var sampleItem = items[0];

						var sampleValue = param.paramGroup ? $scope.getSubRisk(param, sampleItem) : $scope.getPolicyParamValue(param, sampleItem);

						// Cache match result in order to use it next time

						param.match.paramName = items.length == 1 || items.some(function(item) {
							var currentValue = param.paramGroup ? $scope.getSubRisk(param, item) : $scope.getPolicyParamValue(param, item);

							currentValue = comparedPoliciesController.polyfillSameValue(currentValue);

							sampleValue = comparedPoliciesController.polyfillSameValue(sampleValue);

							return !angular.equals(currentValue, sampleValue);
						});
					}

					return param.match.paramName;
				}

				return false;
			};

			/**
			 * Resets values for filter to their defaults
			 */

			this.resetFilterValues = function() {
				$scope.paramFilterValues = [
					{
						label: 'различающиеся',

						value: 'differing'
					},

					{
						label: 'все',

						value: undefined
					}
				];
			};

			this.resetFilterValues();

			/**
			 * Updates users choice and allows him to proceed with purchasing policy item
			 * @param {Object} item policy item
			 */
			
			$scope.byPolicyItem = function(item) {
				orderManager.createOrderDraft(item);

				orderManager.storeInsuranceChoice(item);
				
				manageLocation.redirect(ROUTES.ORDER_PREPARE);
			};

			/**
			 * Clears match cache for each and every param
			 * in compared params
			 */

			this.clearComparedParamsMatchCache = function() {
				$scope.compareParams.forEach(function(param) {
					delete param.match;
				});
			};

			/**
			 * Deletes item from a list of compared items
			 * @param {Object} item policy item
			 */

			$scope.removeItemFromComparison = function(item) {
				_.remove($scope.comparedPoliciesList, {
					calculationId: item.calculationId,

					totalPrice: item.totalPrice
				});

				comparedPoliciesController.clearComparedParamsMatchCache();

				dataStorage.setData(CACHE_ITEMS.COMPARED_POLICIES, angular.toJson($scope.comparedPoliciesList));

				$scope.$broadcast(EVENTS.BLOCK_DYNAMIC_RESIZE.RESET_DUMMY);
			};

			/**
			 * Returns name of vendor company in policy item
			 * @param {Object} item Policy's calculation data
			 * @returns {String} Vendor company name
			 */

			$scope.vendorIconClass = function(item) {
				var companyLogoMap = VENDOR_COMPANIES;

				var companyCode;

				var defaultCompanyCode = Object.keys(companyLogoMap)[0];

				try {
					companyCode = item.serviceCompany.companyCode;
				} catch( error ) {
					companyCode = defaultCompanyCode;
				}

				return companyCode in companyLogoMap ? companyLogoMap[companyCode] : companyLogoMap[defaultCompanyCode];
			};

			$scope.currencySymbols = CURRENCY_SYMBOLS;

			$scope.compareParams = [
				{
					paramName: 'insuranceCompany',
					displayName: 'Страховщик',
					showAlways: true
				},

				{
					paramName: 'insuranceProgramName',
					displayName: 'Программа',
					paramPath: 'calculationDataInput.insuranceProgramName',
					showAlways: true
				},

				{
					paramName: 'totalPrice',
					displayName: 'Стоимость',
					showAlways: true
				},

				{
					paramName: 'termDays',
					displayName: 'Застраховано дней',
					paramPath: 'calculationDataInput.travelData.period.termDays',
					showAlways: true
				},

				{
					paramName: 'tripsNum',
					displayName: 'Количество поездок',
					showAlways: true
				},

				{
					paramName: 'daysInTrip',
					displayName: 'Макс. дней в одной поездке',
					paramPath: 'calculationDataInput.travelData.period.daysInTrip',
					showAlways: true
				},

				{
					paramName: 'territoryDisplayName',
					displayName: 'Территория страхования',
					paramPath: 'calculationDataInput.territoryDisplayName',
					showAlways: true
				},

				{
					paramName: 'vendorCompany',
					displayName: 'Сервисная компания',
					showAlways: true
				},

				{
					paramName: 'medicalExpenses',
					displayName: 'Медицинская помощь и экстренные расходы',
					paramsTitle: true,
					showAlways: true,
					paramGroup: 'medical-primary'
				},

				{
					paramName: 'urgentHelp',
					displayName: 'Неотложная помощь',
					paramGroup: 'medical',
					paramKey: 'URGENT_HELP'
				},

				{
					paramName: 'medicalDrugs',
					displayName: 'Медицинские препараты и средства',
					paramGroup: 'medical',
					paramKey: 'MEDICAL_DRUGS'
				},

				{
					paramName: 'diagnosis',
					displayName: 'Диагностирование',
					paramGroup: 'medical',
					paramKey: 'DIAGNOSIS'
				},

				{
					paramName: 'outPatientTreatment',
					displayName: 'Амбулаторное лечение',
					paramGroup: 'medical',
					paramKey: 'OUT_PATIENT_TREATMENT'
				},

				{
					paramName: 'indoorTreatment',
					displayName: 'Стационарное лечение',
					paramGroup: 'medical',
					paramKey: 'INDOOR_TREATMENT'
				},

				{
					paramName: 'surgery',
					displayName: 'Хирургия',
					paramGroup: 'medical',
					paramKey: 'SURGERY'
				},

				{
					paramName: 'extraDentalTreatment',
					displayName: 'Экстренная стоматология',
					paramGroup: 'medical',
					paramKey: 'EXTRA_DENTAL_TREATMENT'
				},

				{
					paramName: 'medicalTransportation',
					displayName: 'Перевозка больного в месте пребывания',
					paramGroup: 'medical',
					paramKey: 'MEDICAL_TRANSPORTATION'
				},

				{
					paramName: 'transportHome',
					displayName: 'Перевозка больного домой',
					paramGroup: 'medical',
					paramKey: 'TRANSPORT_OF_PATIENT_HOME'
				},

				{
					paramName: 'bodyRepatriation',
					displayName: 'Посмертная репатриация',
					paramGroup: 'medical',
					paramKey: 'BODY_REPATRIATION'
				},

				{
					paramName: 'returnDelay',
					displayName: 'Задержка возвращения',
					paramGroup: 'medical',
					paramKey: 'RETURN_DELAY'
				},

				{
					paramName: 'bringChildrenHome',
					displayName: 'Возвращение детей домой',
					paramGroup: 'medical',
					paramKey: 'BRING_CHILDREN_BACK_HOME'
				},

				{
					paramName: 'thirdPartyVisit',
					displayName: 'Визит родственника или третьего лица',
					paramGroup: 'medical',
					paramKey: 'THIRD_PARTY_VISIT'
				},

				{
					paramName: 'prescheduleReturn',
					displayName: 'Досрочное возвращение',
					paramGroup: 'medical',
					paramKey: 'PRESCHEDULE_RETURN'
				},

				{
					paramName: 'transportExpenses',
					displayName: 'Временное возвращение',
					paramGroup: 'medical',
					paramKey: 'TRANSPORT_EXPENSES'
				},

				{
					paramName: 'urgentMessages',
					displayName: 'Оплата срочных сообщений',
					paramGroup: 'medical',
					paramKey: 'URGENT_MESSAGES'
				},

				{
					paramName: 'lostOrStolenDocuments',
					displayName: 'Потеря или хищение документов',
					paramGroup: 'medical',
					paramKey: 'LOST_OR_STOLEN_DOCUMENTS'
				},

				{
					paramName: 'searchAndRescue',
					displayName: 'Поисково-спасательные работы',
					paramGroup: 'medical',
					paramKey: 'SEARCH_AND_RESCUE'
				},

				{
					paramName: 'legalHelp',
					displayName: 'Юридическая помощь и консультации',
					paramGroup: 'medical',
					paramKey: 'LEGAL_HELP'
				},

				{
					paramName: 'flightDelay',
					displayName: 'Задержка рейса',
					paramGroup: 'global',
					paramKey: 'FLIGHT_DELAY'
				},

				{
					paramName: 'brokenCar',
					displayName: 'Проблемы с автомобилем',
					paramGroup: 'global',
					paramKey: 'BROKEN_CAR'
				},

				{
					paramName: 'additionalExpenses',
					displayName: 'Иные расходы',
					paramGroup: 'medical',
					paramKey: 'ADDITIONAL_EXPENSES'
				},

				{
					paramName: 'extraOptions',
					displayName: 'Опции',
					paramsSubTitle: true,
					children: [
						'activeRest',

						'sport',

						'sportCompetitions',

						'extremeSport',

						'luggage',

						'tripCancel',

						'personalLiability',

						'accident'
					]
				},

				{
					paramName: 'activeRest',
					displayName: 'Активный отдых',
					paramGroup: 'options',
					paramKey: 'ACTIVE_REST'
				},

				{
					paramName: 'sport',
					displayName: 'Любительский спорт',
					paramGroup: 'options',
					paramKey: 'SPORT'
				},

				{
					paramName: 'sportCompetitions',
					displayName: 'Соревнования и сборы',
					paramGroup: 'options',
					paramKey: 'SPORT_COMPETITIONS'
				},

				{
					paramName: 'extremeSport',
					displayName: 'Экстремальный спорт',
					paramGroup: 'options',
					paramKey: 'EXTREME_SPORT'
				},

				{
					paramName: 'luggage',
					displayName: 'Багаж',
					paramGroup: 'global',
					paramKey: 'LUGGAGE'
				},

				{
					paramName: 'tripCancel',
					displayName: 'Отмена поездки',
					paramGroup: 'global',
					paramKey: 'TRIP_CHANGE_OR_CANCELLATION'
				},

				{
					paramName: 'personalLiability',
					displayName: 'Гражданская ответственность',
					paramGroup: 'global',
					paramKey: 'PERSONAL_LIABILITY'
				},

				{
					paramName: 'accident',
					displayName: 'Несчастный случай',
					paramGroup: 'global',
					paramKey: 'ACCIDENT'
				}
			];

			/**
			 * Returns value of specified policy parameter in policy object
			 * @param {Object} param Policy parameter
			 * @param {Object} item Policy's calculation data
			 * @returns {String} parameter value
			 */

			$scope.getPolicyParamValue = function(param, item) {
				return _.get(item, param.paramPath) || '';
			};

			$scope.riskStatuses = {
				included: 'INCLUDED',
				optional: 'OPTIONAL',
				notIncluded: 'NOT_INCLUDED'
			};

			/**
			 * Returns value of specified parameter in policy object
			 * @param {Object} param Policy parameter
			 * @param {Object} item Policy's calculation data
			 * @returns {String} parameter value
			 */

			$scope.getSubRisk = function(param, item) {
				try {
					switch( param.paramGroup ) {
						case 'global':
							return item.calculationDataInput.riskAliasMap[param.paramKey];

						case 'medical':
							return item.calculationDataInput.riskAliasMap.MEDICAL_EXPENSES.subRisks[param.paramKey];

						case 'medical-primary':
							return item.calculationDataInput.riskAliasMap.MEDICAL_EXPENSES.risk.sumInsured;

						case 'options':
							return item.calculationDataInput.options[param.paramKey];
					}
				} catch( error ) {
					$log.warn('Did not manage to determine policy parameter group: ', error);

					return '';
				}
			}
	}]);
})();;
angular.module('riskMarket.templates', []).run(['$templateCache', function($templateCache) {
  'use strict';
  $templateCache.put('modules/admin/monitor/partials/monitor.html',
    '<div class="container-fluid container-wrapper container-wrapper-darker"><div class="container-content-primary admin-monitor admin-monitor-advanced"><h2 class="admin-monitor-header">Личный кабинет администратора</h2><section class="control-panel"><div class="view-modes-container"><h3 class="content-title">Заказы за</h3><ul class="view-modes"><li class="view-mode" data-ng-repeat="period in periods" data-ng-class="{\'view-mode-active\': periodIsChosen(period)}" data-ng-click="showPaidInfo(period)"><span data-ng-bind="period.label"></span></li></ul></div><div class="view-modes-container"><h3 class="content-title">Статус оплаты</h3><ul class="view-modes"><li class="view-mode" data-ng-repeat="paidStatus in paidStatuses" data-ng-class="{\'view-mode-active\': paidStatusIsChosen(paidStatus)}" data-ng-click="setPaidStatus(paidStatus)"><span data-ng-bind="paidStatus.label"></span></li></ul></div><div class="view-modes-container"><h3 class="content-title">Статус полиса</h3><ul class="view-modes"><li class="view-mode" data-ng-repeat="policyStatus in policyStatuses" data-ng-class="{\'view-mode-active\': policyStatusIsChosen(policyStatus)}" data-ng-click="setPolicyStatus(policyStatus)"><span data-ng-bind="policyStatus.label"></span></li></ul></div><div class="brief"><div class="brief-info-chunk"><span class="brief-info-topic">Всего<br>полисов:</span><output class="brief-info-details"><span class="brief-info-primary-value" data-ng-bind="getTotalSoldItems()"></span></output></div><div class="brief-info-chunk"><span class="brief-info-topic">Продано<br>на:</span><output class="brief-info-details"><span class="brief-info-primary-value" data-ng-bind="overallPrice.int | number: 0 | numdivider: \',\' : \' \'"></span> <span class="brief-info-secondary-value" data-ng-bind="overallPrice.float * 100 | number: 0"></span> <span class="brief-info-value-dimension">a</span></output></div><div class="brief-control"><a class="btn btn-white-transparent" data-ng-href="{{downloadUrl}}" target="_blank">Скачать отчет</a></div></div></section><div class="details-panel"><div class="details-header"><h5 class="subject-title col-smaller">Номер<br>заказа</h5><h5 class="subject-title col-smaller">Дата<br>продажи</h5><h5 class="subject-title col-larger">Канал<br>продаж</h5><h5 class="subject-title col-smaller">Вид<br>страхования</h5><h5 class="subject-title col-larger">Страховщик</h5><h5 class="subject-title col-larger">Номер<br>полиса</h5><h5 class="subject-title col-largest">Электропочта<br>клиента</h5><h5 class="subject-title col-smaller">Дата<br>начала</h5><h5 class="subject-title col-smaller">Дата<br>окончания</h5><h5 class="subject-title col-smaller">Стоимость<br>полиса</h5><h5 class="subject-title col-smaller">Оплачен</h5><h5 class="subject-title col-smaller">Отправлен</h5><h5 class="subject-title col-smaller">Аннулирован</h5><h5 class="subject-title col-smaller">Статус</h5></div><div class="detail-item" data-ng-repeat="item in soldItems | orderBy:\'-orderId\'" data-ng-show="show(item)"><span class="detail-item-param col-smaller" data-ng-bind="item.orderId"></span> <span class="detail-item-param col-smaller" data-ng-bind="item.creationDate | date:\'dd.MM.yyyy\'"></span> <span class="detail-item-param col-larger" data-ng-bind="item.soldBy"></span> <span class="detail-item-param col-smaller" data-ng-bind="item.insuranceTypeCode"></span> <span class="detail-item-param col-larger" data-ng-bind="item.insuranceCompany"></span> <span class="detail-item-param col-larger"><a target="_self" data-ng-href="{{site + \'/\' + item.policyLink}}">{{item.policyNumber}}</a></span> <span class="detail-item-param col-largest" data-ng-bind="item.clientEmail"></span> <span class="detail-item-param col-smaller" data-ng-bind="item.startDate"></span> <span class="detail-item-param col-smaller" data-ng-bind="item.endDate"></span> <span class="detail-item-param detail-item-param-important col-smaller" data-ng-bind="item.price | number: 2 | numdivider: \',\' : \' \'"></span> <span class="detail-item-param col-smaller" data-ng-bind="toRusString(item.paid)"></span> <span class="detail-item-param col-smaller" data-ng-bind="toRusString(item.sent)"></span> <span class="detail-item-param col-smaller" data-ng-bind="toRusString(item.cancelled)" data-ng-click="showConfirmDialog(item.cancelled, item.policyId)"></span> <span class="detail-item-param col-smaller" data-ng-bind="item.status" data-ng-class="{\'view-mode-ok\': item.status === \'OK\', \'view-mode-alarm\': item.status === \'ALARM\'}"></span></div></div></div></div>');
  $templateCache.put('modules/compare-policies/partials/compare-policies.html',
    '<div class="container-fluid container-wrapper container-wrapper-darker compare-policies-container"><div data-search-query data-data="insuranceParams" data-action="launchCalculation(data);" data-action-allowed="true" class="search-query-container"></div><div class="filter-container filter-light compare-policies-params-panel" data-filter-container><div class="filter-wrapper"><div class="dummy-block"></div><div class="filtered-items-number">Сравнение <span data-ng-bind-template="{{ comparedPoliciesList.length }} {{ comparedPoliciesList.length | quantitySuffix : \'страхов\' : [\'ки\', \'ок\', \'ок\'] }}"></span></div><div class="filter-area params-filter"><span class="item-label">Параметры</span><div class="user-input-widget" data-user-input-list data-target-model="sortData.order" data-values="paramFilterValues" data-view-prop="label" data-ignore-events="true" data-model-prop="value"></div></div></div></div><div class="compare-policies-wrapper" data-overlay-scroll-emitter data-overlay-scroll-handler data-container-content-width="1130" data-inner-content-block="compare-policies-list"><div class="compare-policies-list" data-ng-if="comparedPoliciesList.length" data-fix-cloned-content="top-fixed-el" data-fix-cloned-content-parent="compare-policies-wrapper"><div class="flex-container" data-ng-repeat="param in compareParams" data-ng-show="matchesFilter(param, comparedPoliciesList)" data-ng-class="{ \'top-fixed-el\': param.paramName === \'insuranceCompany\' || param.paramName === \'insuranceProgramName\' || param.paramName === \'totalPrice\' }"><div class="params-row-header bordered" data-ng-class="{\n' +
    '						      \'align-bottom\': param.paramName === \'insuranceCompany\' || param.paramName === \'totalPrice\',\n' +
    '						      \'params-group-header\': param.paramsTitle,\n' +
    '						      \'params-group-subheader\': param.paramsSubTitle,\n' +
    '						      \'no-border\': param.paramName === \'insuranceCompany\' || param.paramName === \'insuranceProgramName\' || param.paramName === \'vendorCompany\' || param.paramName === \'totalPrice\'  || param.paramName === \'medicalExpenses\' || param.paramName === \'extraOptions\',\n' +
    '						      \'no-border subgroup-param\': param.paramName === \'urgentHelp\' || param.paramName === \'activeRest\',\n' +
    '						      \'vendor-company\': param.paramName === \'vendorCompany\'\n' +
    '						     }"><div class="param-name" data-ng-bind="param.displayName" data-ng-class="{ \'bordered item-price-header\': param.paramName === \'totalPrice\' }"></div></div><div data-ng-repeat="item in comparedPoliciesList" class="item-values bordered" data-ng-class="{ \'no-border\': param.paramName === \'insuranceCompany\' || param.paramName === \'insuranceProgramName\' || param.paramName === \'vendorCompany\' || param.paramName === \'totalPrice\'  || param.paramName === \'medicalExpenses\' || param.paramName === \'extraOptions\',\n' +
    '				      \'no-border subgroup-param\': param.paramName === \'urgentHelp\' || param.paramName === \'activeRest\',\n' +
    '				      \'vendor-company\': param.paramName === \'vendorCompany\'\n' +
    '				      }"><div data-ng-if="param.paramName === \'insuranceCompany\'" class="param-value program-descr"><span data-ng-bind-template="{{ item.calculationDataInput.travelData.period.multi ? \'Многократный\' : \'Однократный\' }}&nbsp;полис, "></span><br><span>страховая сумма<br></span> <span data-ng-bind-template="{{ (item.calculationDataInput.riskAliasMap.MEDICAL_EXPENSES.risk.sumInsured | number: 0 | numdivider: \',\' : \' \') }}"></span> <span class="currency" data-ng-bind="currencySymbols[item.calculationDataInput.riskAliasMap.MEDICAL_EXPENSES.risk.currency]"></span></div><div data-ng-bind="getPolicyParamValue(param, item)" class="param-value" data-bg-image="{\n' +
    '									template: \'vendorCompany\',\n' +
    '\n' +
    '									file: (param.paramName === \'insuranceCompany\') ? item.insuranceCompany.registeredService.toLowerCase() : (param.paramName === \'vendorCompany\') ? item.serviceCompany.companyCode.toLowerCase() : \'\'\n' +
    '								}" data-ng-class="{\n' +
    '						     \'compared-item-insurer-logo\' : param.paramName === \'insuranceCompany\',\n' +
    '						     \'program-territory\' : param.paramName === \'territoryDisplayName\',\n' +
    '						     \'vendor-logo\': param.paramName === \'vendorCompany\',\n' +
    '						     \'program-name\': param.paramName === \'insuranceProgramName\'\n' +
    '						     }"></div><div data-ng-if="param.paramName === \'totalPrice\'"><button class="btn btn-green btn-buy" data-ng-click="byPolicyItem(item)" data-action-item>Купить</button> <button class="btn btn-grey-transparent action-delete" data-ng-click="removeItemFromComparison(item)" data-action-item>Удалить</button><div class="bordered item-price"><span class="currency-base" data-ng-bind="(item.priceContainer.integralPart | number: 0 | numdivider: \',\' : \' \')"></span> <span class="currency-fraction" data-ng-bind="item.priceContainer.fractionalPart"></span> <span class="currency currency-symbol" data-ng-bind="currencySymbols[\'RUB\']"></span></div></div><div data-ng-if="param.paramName === \'tripsNum\'" class="param-value"><span data-ng-show="item.calculationDataInput.travelData.period.multi" class="infinity">&infin;</span> <span data-ng-show="!item.calculationDataInput.travelData.period.multi">1</span></div><div class="param-value params-group-header" data-ng-if="param.paramName === \'medicalExpenses\'"><span data-ng-bind-template="{{ (getSubRisk(param, item) | number: 0 | numdivider: \',\' : \' \') }}"></span> <span class="value-currency" data-ng-bind-template=" {{ currencySymbols[item.calculationDataInput.riskAliasMap.MEDICAL_EXPENSES.risk.currency] }}"></span></div><div class="param-value value excluded" data-ng-if="param.paramGroup === \'medical\' || param.paramGroup === \'global\'" data-ng-class="{ \'included\': getSubRisk(param, item).riskStatus === riskStatuses.included, \'sum-insured\': getSubRisk(param, item).risk && getSubRisk(param, item).risk.sumInsured }"><span data-ng-bind="getSubRisk(param, item).risk.sumInsured | number: 0 | numdivider: \',\' : \' \'"></span> <span class="value-currency" data-ng-bind-template="{{ getSubRisk(param, item).risk && getSubRisk(param, item).risk.sumInsured ? currencySymbols[getSubRisk(param, item).risk.currency] : \' \' }}"></span></div><div class="param-value value excluded" data-ng-if="param.paramGroup === \'options\'" data-ng-class="{ \'included\': getSubRisk(param, item) }"></div><div class="param-value params-group-subheader" data-ng-if="param.paramName === \'extraOptions\'"></div></div></div></div><p data-ng-if="!comparedPoliciesList.length">Нет страховок для сравнения</p></div></div>');
  $templateCache.put('modules/inner-pages/partials/about-service-page.html',
    '<div class="container-fluid container-wrapper container-wrapper-darker"><article class="container-content inner-page"><header><h1 class="inner-page-header">Сервис онлайн-страхования</h1></header><section class="intro-block"><p class="inner-page-intro-text">RiskMarket.ru даёт возможность на одном сайте рассчитать,<br>выбрать и купить страховки на разные случаи жизни прямо<br>у ведущих страховых компаний.</p></section><section class="flex-container inner-page-block"><div class="inner-page-block-name choice"><header><h3 class="inner-page-block-header">Большой выбор<br>Гарантия цены</h3></header></div><div class="inner-page-block-content"><p>RiskMarket.ru имеет прямые подключения к сервисам страховых компаний и, отвечая на запросы пользователей, предоставляет множество актуальных вариантов страховых продуктов.</p><p>Полис медицинского страхования выезжающих за рубеж, страховка имущества или ответственности, договор страхования жизни и здоровья &mdash; их стоимость будет такая же, как в страховой компании. А порой ниже за счёт специальных бонусных программ для постоянных пользователей.</p></div></section><section class="flex-container inner-page-block"><div class="inner-page-block-name payment"><header><h3 class="inner-page-block-header">Удобная безопасная покупка</h3></header></div><div class="inner-page-block-content"><p>Для поиска подходящей страховки сервис предлагает воспользоваться системой фильтров и сортировок, а подробное описание условий, рейтинги и отзывы клиентов помогут сделать окончательный выбор.</p><p>Для покупки полиса останется лишь ввести необходимые данные, оплатить привычным способом и получить полис на e-mail.</p><h4 class="inner-page-block-subheader">Передача данных защищена</h4><p>Онлайн-покупка нуждается в надёжном канале связи. RiskMarket.ru обеспечивает его, используя специальный SSL-сертификат. Он позволяет организовать шифрование передаваемой информации, подтвердить подлинность сайта и его владельца, обеспечить защиту данных от подмены в процессе передачи по сети.</p><h4 class="inner-page-block-subheader">Популярный способ оплаты</h4><p>Оплата полиса на сайте осуществляется банковскими картами – самым популярным способом оплаты в Интернете. Платёжный сервис отвечает требованиям Центробанка РФ о защите информации о платежах.</p></div></section><section class="flex-container inner-page-block"><div class="inner-page-block-name safekeeping"><header><h3 class="inner-page-block-header">Надёжное хранение полисов</h3></header></div><div class="inner-page-block-content"><p>После оплаты информация о проданном полисе незамедлительно записывается в базе страховой компании. RiskMarket.ru направляет купленный полис, оформленный в электронном виде, на указанный пользователем адрес электронной почты. В дальнейшем его можно распечатать и предъявить для подтверждения заключения страхового договора.</p><p>Кроме того, на сервисе для пользователя создается личный кабинет, в котором сохраняется история покупок, и откуда всегда можно распечатать необходимую страховку.</p></div></section><section class="final-block"><a href="/" class="final-block-link">Покупайте страховки онлайн на RiskMarket.ru!</a></section></article></div>');
  $templateCache.put('modules/inner-pages/partials/contacts-page.html',
    '<div class="container-fluid container-wrapper container-wrapper-darker"><article class="container-content inner-page"><header><h1 class="inner-page-header">Контактная информация</h1></header><section class="flex-container contact-mails"><div><h4>Поддержка клиентов:</h4><a class="contact-link" href="mailto:help@riskmarket.ru">help@riskmarket.ru</a></div><div><h4>Общие вопросы:</h4><a class="contact-link" href="mailto:info@riskmarket.ru">info@riskmarket.ru</a></div><div><h4>Для партнеров:</h4><a class="contact-link" href="mailto:partner@riskmarket.ru">partner@riskmarket.ru</a></div></section><section class="flex-container inner-page-block rm-account-block"><div class="inner-page-block-name rm-account"><header><h3 class="inner-page-block-header">Общество с ограниченной ответственностью «РискМаркет»</h3></header></div><div class="inner-page-block-content"><div class="rm-account-details"><div class="flex-container"><div class="account-detail-name">ОГРН</div><div class="account-detail-value">1157847408113</div></div><div class="flex-container"><div class="account-detail-name">ИНН</div><div class="account-detail-value">7801295503</div></div><div class="flex-container"><div class="account-detail-name">КПП</div><div class="account-detail-value">780101001</div></div><div class="flex-container"><div class="account-detail-name">Юр. адрес</div><div class="account-detail-value">199106, Санкт-Петербург, Средний проспект В.О., дом 76/18, литера А, пом.1-Н, тел. 8&nbsp;(499)&nbsp;350-95-63</div></div><div class="flex-container"><div class="account-detail-name">БИК</div><div class="account-detail-value">044030811</div></div><div class="flex-container"><div class="account-detail-name">Банк</div><div class="account-detail-value">Филиал № 7806 ВТБ 24 (ПАО)</div></div><div class="flex-container"><div class="account-detail-name">р/с</div><div class="account-detail-value">40701810929260001835</div></div><div class="flex-container"><div class="account-detail-name">к/с</div><div class="account-detail-value">30101810300000000811</div></div></div></div></section></article></div>');
  $templateCache.put('modules/inner-pages/partials/terms-page.html',
    '<div class="container-fluid container-wrapper container-wrapper-darker"><article class="container-content inner-page terms-page"><header><h1 class="inner-page-header">Пользовательское соглашение</h1></header><section class="inner-page-block"><p>ООО «РискМаркет» (далее – РискМаркет) предлагает пользователю сети Интернет использовать сервис «RiskMarket страхование онлайн» (далее – RiskMarket или Сервис) для онлайн покупки страховых полисов непосредственно у представленных на сервисе страховых компаний.</p><p>Пользуясь RiskMarket, пользователь принимает требования и положения настоящего Пользовательского соглашения (далее - Соглашение), которое распространяется на сайт www.riskmarket.ru и на сайты субагентов, использующих программное обеспечение РискМаркета (далее - Сайтах).</p><p>На RiskMarket пользователям доступна информационно-справочная система, которая содержит информацию о страховых полисах по разным видам страхования (далее – Полис), предназначенную для потенциальных покупателей Полисов (страхователей). Информация о Полисах, представленная на Сервисе, основана на информации, предоставленной страховыми компаниями.</p><p>На RiskMarket пользователю даётся возможность оформления Полиса в страховой компании, его оплаты и получения в электронном виде на свой адрес электронной почты.</p><p>До момента оформления Полиса на Сервисе пользователь обязуется ознакомиться со всеми условиями приобретения Полиса, условиями и правилами страхования страховых компаний.</p><p>Все страховые компании, представленные на RiskMarket имеют соответствующие действующие лицензии на осуществление страхования, выданные Центральным Банком Российской Федерации.</p><p>При покупке Полиса на Сервисе пользователь заключает договор страхования непосредственно со страховой компанией, чей Полис покупается, и вступает с ней в прямые договорные отношения. Покупка Полиса на RiskMarket означает согласие пользователя со всеми существенными условиями и правилами страховой компании.</p><p>Условия и правила страхования являются неотъемлемой частью покупаемого Полиса и доступны для свободного ознакомления в описании Полиса до момента покупки.</p><p>Все права и обязательства по заключённому со страховой компанией договору возникают непосредственно у страховой компании. Для решения вопросов по предоставлению страховых услуг в рамках приобретённых на Сервисе Полисов (оказание экстренной помощи при наступлении страховых событий, подача соответствующих обращений и заявлений, другие действия, связанные с урегулированием страховых случаев) необходимо обращаться в страховую компанию, чей Полис приобретён. Контакты и адреса страховых компаний для урегулирования страховых случаев доступны на RiskMarket без дополнительных регистраций, а также эту информацию пользователь получает на свой адрес электронной почты после покупки вместе с Полисом в электронном виде.</p><p>Для того чтобы воспользоваться услугой покупки Полиса онлайн на RiskMarket, пользователь соглашается предоставить правдивую, точную и полную информацию о себе, а также о третьих лицах, которых он желает застраховать, (далее – Третьи лица), по вопросам, предлагаемым в форме заказа Полиса, а также с тем, что электронная почта пользователя и его иные идентификационные данные являются аналогом собственноручной подписи пользователя.</p><p>Покупая Полис, пользователь подтверждает, что полностью ознакомился с положениями настоящего Соглашения, полностью понимает их, а также понимает предмет и условия заключаемого со страховой компанией договора, полностью понимает значение и последствия своих действий в рамках условий и правил страхования.</p><p>Пользователь подтверждает, что является дееспособным физическим лицом, имеющим право заключать договоры страхования в отношении себя и лиц, указанных пользователем на Сайтах.</p><p>Пользователь подтверждает, что согласие Третьих лиц на передачу и обработку их персональных данных РискМаркету пользователем получено в порядке, предусмотренном Федеральным законом от 27.07.2006 №152-ФЗ «О персональных данных».</p><p>В соответствии с настоящим Соглашением пользователь даёт своё согласие и согласие всех лиц, указанных пользователем на Сайтах, ООО «РискМаркет» (199106, Санкт-Петербург, Средний проспект В.О., дом 76/18, литера А, пом 1-Н, ИНН 7801295503) и страховым компаниям, чей Полис приобретается, на обработку любой информации (Персональных данных), введенной пользователем в форму заказа Полиса на Сайтах, включая, без ограничения: сбор, систематизацию, накопление, хранение, уточнение (обновление, изменение), использование, распространение (в том числе передачу), обезличивание, блокирование, уничтожение, а также осуществление любых иных действий с персональными данными пользователя с учетом действующего законодательства, в течение срока договорных отношений, связанных со страхованием, и в течение 5 (Пяти) лет после окончания срока действия этих договорных отношений, и подтверждает, что, давая такое согласие, пользователь действует по своей воле и в своём интересе и интересах Третьих лиц.</p><p>Целью обработки персональных данных является формирование (разработка), заключение, исполнение договора страхования, а также информирование об оказываемых РискМаркетом услугах, изменениях тарифов и новых продуктах, в том числе разработанных с участием партнеров РискМаркета, включая, но не ограничиваясь информированием посредством коротких сообщений (SMS) на указанный пользователем телефонный номер.</p><p>Своим согласием пользователь предоставляет право РискМаркету на осуществление любых действий в отношении предоставленных пользователем своих персональных данных и Третьих лиц, предусмотренных Законом и/или выбранных по усмотрению РискМаркетом, которые необходимы или желаемы для достижения указанных выше целей. Пользователь может отозвать свое согласие на обработку персональных данных в любое время путем направления в РискМаркет письменного и подписанного уведомления.</p><p>Настоящим согласием пользователь признаёт и подтверждает, что в случае необходимости предоставления Персональных данных для достижения указанных выше целей третьему лицу, а равно как при привлечении третьих лиц к оказанию услуг в указанных целях, РискМаркет вправе в необходимом объёме раскрывать для совершения вышеуказанных действий информацию о пользователе (включая Персональные данные) таким третьим лицам, их уполномоченным представителям, а также предоставлять таким лицам документы, содержащие такую информацию.</p><p>Покупая Полис, пользователь подтверждает, что осведомлён о том, что правила отказа от заключаемого с помощью Сайтов договора страхования (Полиса) закреплены в правилах страхования той компании, чей Полис приобретается.</p><p>Пользователь использует RiskMarket на свой собственный риск. Сервисы предоставляются «как есть». РискМаркет не принимает на себя никакой ответственности, в том числе за соответствие сервисов целям пользователя.</p><p>РискМаркет не несёт ответственности за любые виды убытков, произошедшие вследствие использования пользователем Сервиса и покупки Полисов.</p><p>При любых обстоятельствах ответственность РискМаркета в соответствии со статьей 15 Гражданского кодекса России ограничена 1000 (одной тысячью) рублей РФ и возлагается на него при наличии в его действиях вины.</p><p>РискМаркет в любое время без уведомления пользователя может изменять текст настоящего Соглашения, такие изменения вступают в силу с момента публикации.</p></section></article></div>');
  $templateCache.put('modules/main-page/partials/about_page.html',
    '<div class="container-fluid container-wrapper container-wrapper-darker"><acticle class="container-fluid container-content container-content-primary text-page"><header><hgroup><h1>О RiskMarket</h1></hgroup></header><section><table class="float-right"><tbody><tr><td><figure><img src="img/tmp/feature-1.gif"><figcaption>Широкий выбор программ от ведущих страховых компаний</figcaption></figure></td><td><figure><img src="img/tmp/feature-2.gif"><figcaption>Покупка полиса в любое время без посещения офиса</figcaption></figure></td></tr><tr><td><figure><img src="img/tmp/feature-3.gif"><figcaption>Удобная оплата всеми банковскими картами</figcaption></figure></td><td><figure><img src="img/tmp/feature-4.gif"><figcaption>Надёжное хранение всех полисов и оповещения о продлении</figcaption></figure></td></tr></tbody></table><p>В сети интернет по адресу RiskMarket.ru располагаются страховые онлайн-сервисы, позволяющие широкому кругу пользователей приобрести полисы страхования российских страховых компаний. С точки зрения продаж сайт, в первую очередь, предназначен для физических лиц. Корпоративные клиенты требуют отдельного рассмотрения.</p></section><section><header><hgroup><h3>На RiskMarket представлены:</h3></hgroup></header><ul><li>полный перечень страховых продуктов, предлагаемых на рынке страхования – имущественные виды страхования, страхование ответственности, личное страхование, накопительное страхование, добровольное и обязательное страхование, прочие виды. Для каждого продукта установлен свой набор параметров необходимых и достаточных для расчёта;</li><li>перечень всех страховых компаний с координатами (офисы продаж, отделы урегулирования убытков, списки партнёров – банки, СТОА, медучреждения, пр.), ссылками на их сайты, рейтинги (официальные, народные), другая полезная информация, касающаяся страховщиков;</li><li>базы действующих агентов и брокеров, предоставляющих услуги по оформлению полисов страхования.</li></ul></section><section><header><hgroup><h3>Потенциальным страхователям ресурс позволяет:</h3></hgroup></header><ul><li>подробно узнать о страховых продуктах, условиях страхования и страховых компаниях;</li><li>познакомиться с мнением других пользователей о компаниях и их услугах, а также с различного рода специальными рейтингами;</li><li>определиться, какой страховой полис необходим;</li><li>рассчитать стоимость полиса по индивидуальным параметрам в разных страховых компаниях;</li><li>сравнить предложения страховщиков;</li><li>сделать выбор подходящего варианта;</li><li>если покупка полиса онлайн возможна, то купить его прямо на RiskMarket, получив полис на свою электронную почту;</li><li>если купить онлайн нельзя, то перейти на сайт выбранной страховой компании или заполнить специальную заявку на страхование, разместить её среди продавцов и, после ознакомления с полученными предложениями, выбрать продавца для заключения договора;</li><li>получать бонусы за купленные на сервисе полисы, которые можно использовать для оплаты новых полисов;</li><li>посредством личного кабинета, контролировать и управлять своими полисами страхования (оплачивать очередные взносы, оформлять пролонгацию, держать свои данные, которые указываются в полисе, в актуальном состоянии и пр.), следить за своим бонусным счётом.</li></ul></section></acticle></div>');
  $templateCache.put('modules/main-page/partials/main-page.html',
    '<div class="main-page"><div class="main-slider"><div class="slider-item trip-slide"><div><h2>Защита на любом континенте</h2><h3>Покупайте туристическую страховку у ведущих компаний онлайн</h3></div></div></div><div class="main-order-prepare"><table><tr><td><selectable-items data-params="{\n' +
    '									mode: \'full\',\n' +
    '\n' +
    '									labels: textLabels,\n' +
    '\n' +
    '									itemLabel: \'nameRus\',\n' +
    '\n' +
    '									maxItems: selectableItems.MAIN_PAGE_TRIP_ITEMS_LIMIT,\n' +
    '\n' +
    '		              enableTips: true\n' +
    '								}" data-ng-model="formData.country" data-items="countries" data-uib-tooltip="Укажите страну" data-tooltip-placement="top" data-tooltip-trigger="none" data-tooltip-is-open="submitAttempt && !formData.country.length" data-tooltip-enable="submitAttempt && !formData.country.length"></selectable-items></td><td><participants-control data-participants="formData.passengers" data-max-participant-count="4" data-is-valid="validation.passengers" data-uib-tooltip="Укажите туристов" data-tooltip-placement="top" data-tooltip-trigger="manual" data-tooltip-is-open="submitAttempt && !validation.passengers && isParticipantWarningHidden" data-tooltip-enable="submitAttempt && !validation.passengers && isParticipantWarningHidden" data-lazy-update="true"></participants-control></td><td><period-control data-start="formData.period[\'start-date\']" data-finish="formData.period[\'end-date\']" data-is-valid="validation.period" data-uib-tooltip="Укажите даты" data-tooltip-placement="top" data-tooltip-trigger="none" data-tooltip-is-open="submitAttempt && (!formData.period[\'start-date\'] || !formData.period[\'end-date\'])" data-tooltip-enable="submitAttempt && (!formData.period[\'start-date\'] || !formData.period[\'end-date\'])"></period-control></td></tr><tr><td colspan="3" style="text-align:center"><button class="btn btn-success" data-ng-disabled data-ng-click="events.submitForm(formData);">Рассчитать полис</button></td></tr></table></div></div>');
  $templateCache.put('modules/order-payment/partials/order-payment.html',
    '<div class="container-fluid container-wrapper container-wrapper-darker"><div class="container-fluid container-content container-content-primary"><div class="actions-sequence"><div class="action-back"><a class="btn btn-grey-transparent" data-ng-href="{{searchResultsLink}}">К результатам поиска</a></div><ul class="items actions"><li class="action-sequence-step-wrapper visited"><a class="item action-sequence-step" data-ng-href="{{orderPrepareLink}}" data-sequence-title="Оформление">Оформление</a></li><li class="action-sequence-step-wrapper active"><a class="item action-sequence-step" href="#" data-dummy-link="" data-sequence-title="Оплата">Оплата</a></li><li class="action-sequence-step-wrapper"><a class="item action-sequence-step" href="#" data-dummy-link="" data-sequence-title="Получение">Получение</a></li></ul></div></div><div class="container-fluid container-content container-content-search-results container-content-order-draft"><div class="list-items"><search-result-item data-item="insuranceChoice" data-expand="expandItem" data-risk-options="riskOptions" data-config="{\n' +
    '            showParamsButton: true\n' +
    '        }" data-ng-class="{\'expanded-item\': insuranceChoice.expanded}"></search-result-item><section class="container-content-insured" data-ng-if="insuredBlockExpanded"><header class="page-header"><h2 class="subject-title subject-section-title">Застрахованные</h2></header><div class="items"><div class="item item-insured-person item-insured-person-attributes"><div class="item-component"><h4 class="subject-title subject-title-param">Дата рождения</h4></div><div class="item-component"><h4 class="subject-title subject-title-param">Фамилия</h4></div><div class="item-component"><h4 class="subject-title subject-title-param">Имя</h4></div><div class="item-component" data-ng-if="isInsuranceCompany(vtbCompany, currentCompany)"><h4 class="subject-title subject-title-param">Загранпаспорт</h4></div></div><div data-ng-class="{\'item-insured-person-terminator\': $last}" class="item item-insured-person" data-ng-repeat="insuredPerson in orderPreview.insuredPersons"><div class="item-component item-smaller"><div class="user-input-widget user-input-widget-read-only"><div class="user-input-wrapper"><span class="user-input" data-ng-bind="insuredPerson.birthDate"></span></div></div></div><div class="item-component"><div class="user-input-widget user-input-widget-read-only"><div class="user-input-wrapper"><span class="user-input" data-ng-bind="insuredPerson.surname"></span></div></div></div><div class="item-component"><div class="user-input-widget user-input-widget-read-only"><div class="user-input-wrapper"><span class="user-input" data-ng-bind="insuredPerson.name"></span></div></div></div><div class="item-component" data-ng-if="isInsuranceCompany(vtbCompany, currentCompany)"><div class="user-input-widget user-input-widget-read-only"><div class="user-input-wrapper"><span class="user-input" data-ng-bind="insuredPerson.internationalPassportSerialAndNumber"></span></div></div></div></div></div></section><section class="container-content-insured container-content-insurer" data-ng-if="insuredBlockExpanded"><header class="page-header"><h2 class="subject-title subject-section-title">Страхователь</h2></header><div class="items"><div class="item item-insured-person item-insured-person-insurer"><div class="items-inner-wrapper"><div class="item-component"><h4 class="subject-title">Дата рождения</h4><div class="user-input-widget user-input-widget-read-only"><div class="user-input-wrapper"><span class="user-input" data-ng-bind="orderPreview.insurer.birthDate"></span></div></div></div><div class="item-component"><h4 class="subject-title">Фамилия</h4><div class="user-input-widget user-input-widget-read-only"><div class="user-input-wrapper"><span class="user-input" data-ng-bind="orderPreview.insurer.lastName"></span></div></div></div><div class="item-component"><h4 class="subject-title">Имя</h4><div class="user-input-widget user-input-widget-read-only"><div class="user-input-wrapper"><span class="user-input" data-ng-bind="orderPreview.insurer.firstName"></span></div></div></div></div><div class="items-inner-wrapper"><div class="item-component item-larger"><h4 class="subject-title">E-mail</h4><div class="user-input-widget user-input-widget-read-only"><div class="user-input-wrapper"><span class="user-input user-input-email" data-ng-bind="orderPreview.insurer.email"></span></div></div></div><div class="item-component"><h4 class="subject-title">Мобильный телефон</h4><div class="user-input-widget user-input-widget-read-only"><div class="user-input-wrapper"><span class="user-input" data-ng-bind="orderPreview.insurer.phoneNumber"></span></div></div></div></div></div></div><div class="item-component item-component-switcher item-component-switcher-read-only user-agreement-switcher"><input type="checkbox" id="user-agreement" data-ng-disabled="true" data-ng-checked="true"><label for="user-agreement">Принимаю <a class="unblocked" target="{{linkTargetAttr}}" data-ng-href="{{site + insuranceChoice.links.linkToRules}}">условия страхования</a> и выражаю <a class="unblocked" target="{{linkTargetAttr}}" data-ng-href="{{personalDataAgreementLink}}">согласие на обработку персональных данных</a>.</label></div><div class="actions-section actions-section-edit"><button data-ng-click="editOrderDetails();" class="btn btn-green-transparent">Редактировать данные</button></div></section><div class="container-content-payment-wrapper"><div class="container-content-bonus-wrapper"><section class="container-content-bonus"><header class="page-header"><h2 class="subject-section-title">Бонусы и скидки</h2></header><div class="items"><div class="item"><h4 class="subject-title">Промокод</h4><div class="item-component"><div data-focus-styling="{class: \'focus\'}" class="user-input-element user-input-single-text"><input type="text"></div><button class="btn btn-green-transparent">Применить</button></div></div><div class="item"><h4 class="subject-title">Бонусы</h4><div class="item-component"><div data-focus-styling="{class: \'focus\'}" class="user-input-element user-input-single-text"><input type="text" placeholder="количество бонусов"></div><button class="btn btn-green-transparent">Использовать</button></div></div></div></section></div><section class="container-content-card-payment"><header class="page-header"><h2 class="subject-title subject-section-title col-xs-8">Безопасный платеж банковской картой на сумму <span class="card-payment-note">Оплата осуществляется через систему Яндекс.Деньги</span></h2><div class="item-price col-xs-4"><span class="currency-base" data-ng-bind="(insuranceChoice.priceContainer.integralPart | number: 0 | numdivider: \',\' : \' \')"></span> <span class="currency-fraction" data-ng-bind="insuranceChoice.priceContainer.fractionalPart"></span> <span class="currency currency-symbol" data-ng-bind="currencySymbols[\'RUB\']"></span></div></header><div class="card-payment-text"><p class="card-payment-subheader">Сразу после успешной оплаты оформленный полис придет на вашу электронную почту</p></div></section></div></div><article class="container-content-payment"><div class="actions-section actions-section-pay"><div class="security-text col-xs-4"><span class="plain-text">передача информации защищена сертификатом SSL&nbsp;256 бит, подписанным компанией GeoTrust</span></div><div class="btn-payment col-xs-4"><form novalidate method="post" target="{{paymentFormTarget}}" action="{{paymentInfo.address}}" data-lazy-submit="{{allowSubmit}}"><input type="hidden" name="shopId" data-ng-value="paymentInfo.shopId"> <input type="hidden" name="scid" data-ng-value="paymentInfo.scid"> <input name="paymentType" value="AC" type="hidden"> <input name="customerNumber" data-ng-value="paymentInfo.customerNumber" type="hidden"> <input type="hidden" name="orderNumber" data-ng-value="paymentInfo.orderId"> <input type="hidden" name="sum" data-ng-value="paymentInfo.amount"> <button data-ng-if="!appInFrameMode || appInFrameMode && !allowSubmit" type="button" class="btn btn-success btn-lg btn-center" data-ng-click="checkOrder($event);" data-ng-class="{ spinner: !formReady || acceptRequestPending }" data-ng-bind-template="{{ !formReady || acceptRequestPending ? \' \' : (appInFrameMode ? \'Подтвердить\' : \'Оплатить\') }}"></button> <button data-ng-if="appInFrameMode && allowSubmit" class="btn btn-success btn-lg btn-center" data-ng-bind-template="{{ !formReady ? \' \' : \'Оплатить\' }}" type="submit"></button></form></div></div></article></div></div>');
  $templateCache.put('modules/order-prepare/partials/order-prepare.html',
    '<div class="container-fluid container-wrapper container-wrapper-darker"><div class="container-fluid container-content container-content-primary"><div class="actions-sequence"><div class="action-back"><a class="btn btn-grey-transparent" data-ng-href="{{searchResultsLink}}">К результатам поиска</a></div><ul class="items actions"><li class="action-sequence-step-wrapper active"><a class="item action-sequence-step" data-ng-href="{{orderPrepareLink}}" data-sequence-title="Оформление">Оформление</a></li><li class="action-sequence-step-wrapper"><span class="item action-sequence-step" data-sequence-title="Оплата">Оплата</span></li><li class="action-sequence-step-wrapper"><span class="item action-sequence-step" data-sequence-title="Получение">Получение</span></li></ul></div></div><div class="container-fluid container-content container-content-search-results order-prepare-insurance-choice"><search-result-item data-item="insuranceChoice" data-risk-options="riskOptions" data-expand="expandItem" data-config="{\n' +
    '                                showParamsButton: true\n' +
    '                            }" data-ng-class="{\'expanded-item\': insuranceChoice.expanded}"></search-result-item></div><section class="container-content order-prepare-auth-block" data-ng-hide="currentUser.value != null" data-ng-if="!appInFrameMode"><div class="order-prepare-auth-block-text">Если вы уже оформляли страховки на нашем<br>сервисе, то рекомендуем авторизоваться</div><div class="order-prepare-auth-block-btn"><button class="btn btn-green-transparent" data-ng-click="requestAuthenticate()">Войти</button></div></section><form name="prepare" novalidate data-ng-submit="prepareOrder();"><section class="container-fluid container-content container-content-insured"><header class="page-header"><h2 class="subject-title subject-section-title">Застрахованные</h2></header><div class="items"><div class="item item-insured-person item-insured-person-attributes"><div class="item-component popover-wrapper"><h4 class="subject-title subject-title-param">Дата рождения <span class="icon-hint" data-uib-popover-template="orderInfoPopover.templateUrl" data-popover-elem></span></h4></div><div class="item-component"><h4 class="subject-title subject-title-param">Фамилия</h4></div><div class="item-component"><h4 class="subject-title subject-title-param">Имя</h4></div><div class="item-component" data-ng-if="isInsuranceCompany(vtbCompany, currentCompany)"><h4 class="subject-title subject-title-param">Загранпаспорт</h4></div></div><ng-form name="member" data-ng-repeat="insuredPerson in insuranceChoice.calculationDataInput.travelData.passengers"><div data-ng-class="{\'item-insured-person-terminator\': $last}" class="item item-insured-person"><div class="item-component item-smaller"><div class="user-input-widget user-input-widget-read-only"><div class="user-input-wrapper"><span class="user-input" data-ng-bind="insuredPerson.birthDate"></span></div></div></div><div class="item-component"><div data-focus-styling="{class: \'focus\'}" class="user-input-element user-input-single-text" data-ng-class="{error: (member.lastName.$error.required || member.lastName.$error.nameValidation) && (member.lastName.$touched || member.$submitted)}"><input type="text" data-ng-model="insuredPerson.surname" name="lastName" data-ng-required="true" data-name-validation="true" data-popover-trigger="focus" data-uib-popover="Только латинские буквы" placeholder="IVANOV" restrict-input-maxlength></div></div><div class="item-component"><div data-focus-styling="{class: \'focus\'}" class="user-input-element user-input-single-text" data-ng-class="{error: (member.firstName.$error.required || member.firstName.$error.nameValidation) && (member.firstName.$touched || member.$submitted)}"><input type="text" data-ng-model="insuredPerson.name" data-ng-required="true" name="firstName" data-popover-trigger="focus" data-uib-popover="Только латинские буквы" placeholder="IVAN" restrict-input-maxlength data-name-validation="true"></div></div><div class="item-component" data-ng-if="isInsuranceCompany(vtbCompany, currentCompany)"><div data-focus-styling="{class: \'focus\'}" class="user-input-element user-input-single-text" data-ng-class="{error: (member.internationalPassportSerialAndNumber.$invalid || member.internationalPassportSerialAndNumber.$error.numberValidation) && member.internationalPassportSerialAndNumber.$touched }"><input type="text" data-ng-model="insuredPerson.internationalPassportSerialAndNumber" data-ng-required="true" data-disallow-symbol-enter="non-digits" number-validation="true" name="internationalPassportSerialAndNumber" data-popover-trigger="focus" data-uib-popover="Серия и номер без пробелов" placeholder="012345678" restrict-input-maxlength></div></div></div></ng-form></div></section><section class="container-fluid container-content container-content-insured"><header class="page-header"><h2 class="subject-title subject-section-title">Страхователь</h2></header><ng-form name="ensurer"><div class="items"><div class="item item-insured-person item-insured-person-insurer"><div class="items-inner-wrapper"><div class="item-component item-smaller"><h4 class="subject-title">Дата рождения</h4><div data-focus-styling="{class: \'focus\'}" class="user-input-element user-input-spartan user-input-single-text" data-ng-hide="(currentUser.value != null && currentUser.value.birthDate != null)" data-ng-class="{error: (ensurer.birthDate.$invalid || !isBirthDateValid || !isInsurerAgeAllowed) && ensurer.birthDate.$touched}"><input type="text" data-ng-required="true" name="birthDate" data-ng-model="insurer.birthDate" data-model-view-value="true" data-ui-mask="99.99.9999" data-ui-mask-placeholder="{{currentMask}}" data-birthdate-validation="true" data-validation-method-name="checkInsurerBirthDate" data-ng-focus="setMask(\'focus\')" data-ng-blur="setMask(\'blur\'); checkInsurerBirthDate(insurer.birthDate)" data-popover-trigger="none" data-popover-enable="!isInsurerAgeAllowed" data-popover-is-open="!isInsurerAgeAllowed" data-uib-popover-template="\'birthDatePopoverTemplateWarning.html\'"></div><div class="user-input-widget user-input-widget-read-only" data-ng-show="(currentUser.value != null && currentUser.value.birthDate != null)"><div class="user-input-wrapper"><span class="user-input" data-ng-bind="insurer.birthDate"></span></div></div></div><div class="item-component"><h4 class="subject-title">Фамилия</h4><div data-focus-styling="{class: \'focus\'}" class="user-input-element user-input-spartan user-input-single-text" data-ng-hide="currentUser.value != null" data-ng-class="{error: (ensurer.lastName.$error.required || ensurer.lastName.$error.nameValidation) && (ensurer.lastName.$touched || ensurer.$submitted)}"><input type="text" data-ng-model="insurer.lastName" data-ng-required="true" data-name-validation="true" name="lastName" data-popover-trigger="focus" data-uib-popover="Только латинские буквы" placeholder="IVANOV" restrict-input-maxlength></div><div class="user-input-widget user-input-widget-read-only" data-ng-show="currentUser.value != null"><div class="user-input-wrapper"><span class="user-input" data-ng-bind="insurer.lastName"></span></div></div></div><div class="item-component"><h4 class="subject-title">Имя</h4><div data-focus-styling="{class: \'focus\'}" data-ng-hide="currentUser.value != null" class="user-input-element user-input-single-text" data-ng-class="{error: (ensurer.firstName.$error.required || ensurer.firstName.$error.nameValidation) && (ensurer.firstName.$touched|| ensurer.$submitted)}"><input type="text" data-ng-model="insurer.firstName" data-ng-required="true" data-name-validation="true" name="firstName" data-popover-trigger="focus" data-uib-popover="Только латинские буквы" placeholder="IVAN" restrict-input-maxlength></div><div class="user-input-widget user-input-widget-read-only" data-ng-show="currentUser.value != null"><div class="user-input-wrapper"><span class="user-input" data-ng-bind="insurer.firstName"></span></div></div></div></div><div class="items-inner-wrapper"><div class="item-component item-larger popover-wrapper"><h4 class="subject-title">E-mail</h4><div data-focus-styling="{class: \'focus\'}" class="user-input-element user-input-single-text" data-ng-hide="currentUser.value != null" data-ng-class="{error: (ensurer.email.$touched || ensurer.$submitted) && (ensurer.email.$error.required || ensurer.email.$error.pattern || !validation.email)}" data-popover-trigger="none" data-popover-enable="isEmailWarning" data-popover-is-open="isEmailWarning" data-uib-popover-template="\'emailPopoverTemplateWarning.html\'"><input type="text" class="user-input-email" data-ng-model="insurer.email" data-ng-required="true" name="email" data-ng-pattern="regexp.EMAIL" maxlength="64" data-ng-focus="showPopovers()" data-ng-change="checkEmail()" data-ng-blur="hidePopovers()" data-popover-trigger="none" data-popover-enable="isEmailHint" data-popover-is-open="isEmailHint" data-uib-popover-template="\'emailPopoverTemplateHelper.html\'" placeholder="ivan.ivanov@domain.ru" restrict-input-maxlength data-disallow-symbol-enter="space"></div><div class="user-input-widget user-input-widget-read-only"><div class="user-input-wrapper" data-ng-show="currentUser.value != null"><span class="user-input" data-ng-bind="insurer.email"></span></div></div></div><div class="item-component"><h4 class="subject-title">Мобильный телефон</h4><div data-focus-styling="{class: \'focus\'}" data-ng-hide="currentUser.value != null" class="user-input-element user-input-single-text" data-ng-class="{error: (ensurer.phonenumber.$touched && !insurer.phoneNumber)}"><input type="tel" data-ng-model="insurer.phoneNumber" data-ui-mask="+7 (999) 999-99-99" data-ui-placeholder="+7 (911) 123-45-67" data-ui-options="{clearOnBlur: false}" data-ng-required="true" data-model-view-value="true" name="phonenumber"></div><div class="user-input-widget user-input-widget-read-only"><div class="user-input-wrapper" data-ng-show="currentUser.value != null"><span class="user-input" data-ng-bind="insurer.phoneNumber"></span></div></div></div><div class="item-insured-person-note">Указанные контактные данные будут использоваться<br>для отправки купленного полиса</div></div></div></div></ng-form><div class="item-component item-component-switcher user-agreement-switcher"><span class="user-input user-input-switcher"><input type="checkbox" id="user-agreement" data-ng-checked="isUserAgreement" data-ng-model="isUserAgreement"><label for="user-agreement">Принимаю <a target="{{linkTargetAttr}}" data-ng-href="{{site + insuranceChoice.links.linkToRules}}">условия страхования</a> и выражаю <a target="{{linkTargetAttr}}" data-ng-href="{{site + \'internal/downloads/license/agreement\'}}">согласие на обработку персональных данных</a>.</label></span></div></section><section class="container-content-prepare"><div class="actions-section"><input data-ng-disabled="isPrepareButtonDisabled()" type="submit" class="btn btn-success btn-lg" value="Оформить"></div></section></form><script type="text/ng-template" id="orderInfo.html"><div class="popover-info-container">\n' +
    '			<div class="close-popover-btn"></div>\n' +
    '\n' +
    '			<div class="popover-info">Возраст застрахованного влияет на стоимость полиса. Для изменения необходимо вернуться к <a class="popover-link" data-ng-href="{{searchResultsLink}}">Расчету</a></div>\n' +
    '		</div></script><script type="text/ng-template" id="emailPopoverTemplateHelper.html"><div>\n' +
    '            Введите адрес эл. почты\n' +
    '        </div></script><script type="text/ng-template" id="emailPopoverTemplateWarning.html"><div class="email-popover">\n' +
    '			Данный email уже используется. Измените его или войдите в <span data-ng-click="requestAuthenticate()">Личный кабинет</span>\n' +
    '		</div></script><script type="text/ng-template" id="birthDatePopoverTemplateWarning.html"><div>\n' +
    '			Страхователь не может<br/>быть моложе 18 лет\n' +
    '		</div></script></div>');
  $templateCache.put('modules/order-result/partials/order-done.html',
    '<div class="container-fluid container-wrapper container-wrapper-darker"><div class="container-fluid container-content container-content-primary"><div class="actions-sequence centered"><ul class="items actions"><li class="action-sequence-step-wrapper disabled"><a data-dummy-link="" class="item action-sequence-step" href="#" data-sequence-title="Оформление">Оформление</a></li><li class="action-sequence-step-wrapper disabled"><a data-dummy-link="" class="item action-sequence-step" href="#" data-sequence-title="Оплата">Оплата</a></li><li class="action-sequence-step-wrapper active"><a data-dummy-link="" class="item action-sequence-step" href="#" data-sequence-title="Получение">Получение</a></li></ul></div></div></div><div class="container-fluid container-wrapper container-wrapper-darker"><div class="container-content container-content-purchase-confirmation"><section><div class="status status-success"></div><h2 class="subject-title">Застраховано!</h2><h3 class="subject-subtitle">Спасибо, что воспользовались нашим сервисом онлайн страхования!</h3></section><div class="container-related container-related-info"><div class="col-md-6"><div class="container-related-policy-info"><p>Оформленный полис в формате pdf отправлен вам на почту. Эта онлайн страховка подтверждает заключение договора страхования с выбранной вами компанией.</p><p>В любое удобное время можно скачать и распечатать полис в личном кабинете.</p></div></div><div class="col-md-6"><div class="container-related-advice"><div class="container-advice"><p>Если вы приобрели страховку для поездки за рубеж и вам необходимо оформить шенгенскую или иную визу, просто распечатайте полис на любом принтере и предоставьте вместе с другими документами. Распечатку онлайн страховки принимают все посольства и визовые центры.</p></div></div></div></div></div></div><div class="container-fluid container-wrapper container-wrapper-darker"><div class="container-content"><div class="actions-section actions-navigation row"><div class="main-page-link-btn col-xs-4"><a class="btn btn-green-transparent btn-arrow" href="/">Вернуться на главную</a></div><div class="col-xs-4" data-ng-show="!appInFrameMode"><a class="btn btn-success btn-lg" data-ng-href="{{privateOfficeLink}}">Личный кабинет</a></div></div></div></div>');
  $templateCache.put('modules/order-result/partials/order-fail.html',
    '<div class="container-fluid container-wrapper container-wrapper-darker"><div class="container-fluid container-content container-content-primary"><div class="actions-sequence centered"><ul class="items actions"><li class="action-sequence-step-wrapper disabled"><a data-dummy-link="" class="item action-sequence-step" href="#" data-sequence-title="Оформление">Оформление</a></li><li class="action-sequence-step-wrapper active"><a data-dummy-link="" class="item action-sequence-step" href="#" data-sequence-title="Оплата">Оплата</a></li><li class="action-sequence-step-wrapper disabled"><a data-dummy-link="" class="item action-sequence-step" href="#" data-sequence-title="Получение">Получение</a></li></ul></div></div></div><div class="container-fluid container-wrapper container-wrapper-darker"><div class="container-content container-content-purchase-confirmation"><section data-ng-if="failReasonUndefined"><div class="status status-error"></div><h2 class="subject-title" data-ng-bind="::orderStatus.TITLE"></h2><h3 class="subject-subtitle-fail" data-ng-bind="::orderStatus.FULL_DESCRIPTION"></h3></section><section data-ng-if="!failReasonUndefined"><div class="status status-error"></div><h2 class="subject-title" data-ng-bind="::orderStatus.TITLE"></h2><h3 class="subject-subtitle-fail-error" data-ng-bind-html="::orderStatus.FULL_DESCRIPTION.replace(insuranceCompanyTemplate, insuranceCompanyName)"></h3><h3 data-ng-if="!!orderStatus.SUGGESTIONS" class="subject-subtitle-fail-error" data-ng-bind="::orderStatus.SUGGESTIONS"></h3></section></div></div><div class="container-fluid container-wrapper container-wrapper-darker container-order-fail"><div class="container-content"><div class="actions-section actions-sequence actions-navigation row"><div class="main-page-link-btn col-xs-4"><a class="btn btn-green-transparent btn-arrow" href="/">Вернуться на главную</a></div><div class="col-xs-4"><a data-ng-if="failReasonUndefined && !appInFrameMode" class="btn btn-success btn-lg" data-ng-href="{{privateOfficeLink}}">Личный кабинет</a> <a data-ng-if="!failReasonUndefined" class="btn btn-grey-transparent" data-ng-href="{{ searchResultsLink }}">К результатам поиска</a></div></div></div></div>');
  $templateCache.put('modules/partner-login/partials/partner-login.html',
    '<div class="partner-login-form"><div class="modal-backdrop"></div><div class="modal-dialog modal-sm"><div class="modal-content"><div class="modal-header"><div class="modal-logo"></div><h2 class="modal-title">Личный кабинет<br>партнера</h2></div><div class="modal-body"><form name="login" novalidate data-ng-submit="login.$valid && submit()"><div class="item-component"><div data-focus-styling="{class: \'focus\'}" class="user-input-element user-input-single-text" data-ng-class="{error: (login.userName.$error.required || login.userName.$error.pattern) && (login.userName.$touched || login.$submitted)}"><input type="text" placeholder="E-mail" data-ng-model="formData.userName" data-ng-required="true" name="userName" data-popover-trigger="focus" data-popover-is-open="login.$submitted && !login.userName.$valid" data-uib-popover="Укажите адрес электронной почты" data-ng-pattern="regexp.EMAIL"></div></div><div class="item-component"><div data-focus-styling="{class: \'focus\'}" class="user-input-element user-input-single-text" data-ng-class="{error: login.password.$error.required && (login.password.$touched || login.$submitted)}"><input type="password" placeholder="Пароль" data-ng-model="formData.password" data-ng-required="true" name="password" id="password" data-popover-trigger="focus" data-popover-is-open="login.$submitted && login.userName.$valid && !login.password.$valid" data-uib-popover="Укажите пароль"><span class="show-pass" data-ng-click="showpassword($event)"><img data-img-svg src="/img/min/pass_vizible_icon.svg" alt="Показать/скрыть пароль"></span></div></div><div><div data-focus-styling="{class: \'focus\'}"><input type="checkbox" placeholder="чужой компьютер" data-ng-model="formData.alienComputer" data-ng-required="false" name="alienComputer" id="alienComputer" data-popover-trigger="focus" data-uib-popover="чужой компьютер"><label for="alienComputer">чужой компьютер</label></div></div><div class="actions actions-login"><input class="btn btn-grey-transparent" type="submit" value="Войти"></div><p data-ng-if="loginError" data-ng-bind="feedBack" class="alert alert-danger"></p></form></div></div></div></div>');
  $templateCache.put('modules/partner/partials/partner-trades.html',
    '<div class="container-fluid container-wrapper container-wrapper-darker"><div class="container-content container-content-primary admin-monitor partner-monitor"><h2 class="partner-monitor-header">Личный кабинет партнера</h2><section class="control-panel"><div class="view-modes-container"><h3 class="content-title">Статистика продаж</h3><ul class="view-modes"><li class="view-mode" data-ng-repeat="period in periods" data-ng-class="{\'view-mode-active\': periodIsChosen(period)}" data-ng-click="showPaidInfo(period)"><span data-ng-bind="period.label"></span></li></ul></div><div class="brief"><div class="brief-info-chunk"><span class="brief-info-topic">Всего<br>полисов:</span><output class="brief-info-details"><span class="brief-info-primary-value" data-ng-bind="getTotalSoldItems()"></span></output></div><div class="brief-info-chunk"><span class="brief-info-topic">Общая<br>стоимость:</span><output class="brief-info-details"><span class="brief-info-primary-value" data-ng-bind="overallPrice.int | number: 0 | numdivider: \',\' : \' \'"></span> <span class="brief-info-secondary-value" data-ng-bind="overallPrice.float * 100 | number: 0"></span> <span class="brief-info-value-dimension">a</span></output></div><div class="brief-info-chunk"><span class="brief-info-topic">Общее<br>вознаграждение:</span><output class="brief-info-details"><span class="brief-info-primary-value" data-ng-bind="overallPartnerRevenue.int | number: 0 | numdivider: \',\' : \' \'"></span> <span class="brief-info-secondary-value" data-ng-bind="overallPartnerRevenue.float * 100 | number: 0"></span> <span class="brief-info-value-dimension">a</span></output></div><div class="brief-control"><a class="btn btn-white-transparent" data-ng-href="{{downloadUrl}}" target="_blank">Скачать отчет</a></div></div></section><div class="details-panel"><div class="details-header"><h5 class="subject-title col-smaller">Дата<br>продажи</h5><h5 class="subject-title col-larger">Номер<br>полиса</h5><h5 class="subject-title col-largest">Вид<br>страхования</h5><h5 class="subject-title col-larger">Страховщик</h5><h5 class="subject-title col-smaller">Стоимость<br>полиса</h5><h5 class="subject-title col-default">Вознаграждение<br>партнера</h5><h5 class="subject-title col-minor">Учет</h5></div><div class="detail-item" data-ng-repeat="item in soldItems | orderBy:\'-orderId\'"><span class="detail-item-param col-smaller" data-ng-bind="item.creationDate | date:\'dd.MM.yyyy\'"></span> <span class="detail-item-param col-larger" data-ng-bind="item.policyNumber"></span> <span class="detail-item-param col-largest" data-ng-bind="getInsuranceType(item.insuranceTypeCode)"></span> <span class="detail-item-param col-larger" data-ng-bind="getInsuranceCompanyName(item.insuranceCompany)"></span> <span class="detail-item-param detail-item-param-important col-smaller" data-ng-bind="item.price | number: 2 | numdivider: \',\' : \' \'"></span> <span class="detail-item-param detail-item-param-important col-default" data-ng-bind="getPartnerRevenue(item.insuranceTypeCode, item.price) | number: 2 | numdivider: \',\' : \' \'"></span> <span class="detail-item-param col-minor"></span></div></div></div></div>');
  $templateCache.put('modules/private-office/partials/private-office.html',
    '<div class="container-fluid container-wrapper container-wrapper-darker"><section class="container-content container-content-primary private-office"><header><h2 class="private-office-header">Личный кабинет</h2><ul class="policy-tab-pane"><li class="policy-tab-item" data-ng-class="{\'policy-tab-item-active\': policyTypeIsActive(policyCategory.type)}" data-ng-repeat="policyCategory in policyStructure | orderBy: \'priority\'" data-ng-click="setPoliciesFilter(policyCategory.type); setActivePolicyType(policyCategory.type); updateFilteredPolicyItems();"><div>{{ policyCategory.categoryLabel }} <span class="policy-counter" data-ng-if="policyCategory.showItemsQuantity && policiesExists(policyCategory.type)" data-ng-bind="itemsPerCategory[policyCategory.type]"></span></div></li></ul></header><div class="private-office-content"><div class="policy-item" data-ng-repeat="policyItem in policiesList | filter: policyFilter | orderBy: [sortByCategory, sortByDate]"><search-result-item data-item="policyItem.calculationData" data-expand="expandItem" data-risk-options="riskOptions" data-order-preview="policyItem.confirmationData" data-config="{showActionsButton: true}" data-preview-as-trigger="true" data-get-action-label="getPolicyActionLabel(item)" data-get-action-resource="getActionResource(item)" data-context-action="executePolicyAction(item)"><div><div class="policy-item-header" data-header><div class="policy-type status-mark" data-ng-bind="getPolicyType(policyItem)" data-ng-class="{\n' +
    '                        \'draft-status-mark\': checkPolicyType(policyItem, \'draft\'),\n' +
    '\n' +
    '                        \'payment-pending-status-mark\': checkPolicyType(policyItem, \'payment-pending\'),\n' +
    '\n' +
    '                        \'paid-status-mark\': checkPolicyType(policyItem, \'paid\')\n' +
    '                    }"></div><div class="policy-date" data-ng-bind-template="от {{ policyItem.creationDate | date:\'dd.MM.yyyy\' }}"></div><button class="btn btn-grey-transparent action-delete" data-action-trigger data-ng-click="removeItem(policyItem)" data-ng-show="checkPolicyType(policyItem, \'draft\') || checkPolicyType(policyItem, \'payment-pending\')">Удалить</button></div><div class="insured-persons-wrapper" data-extra-content><section class="container-content-insured"><header class="page-header"><h2 class="subject-title subject-section-title">Застрахованные</h2></header><div class="items"><div class="item item-insured-person item-insured-person-attributes"><div class="item-component"><h4 class="subject-title subject-title-param">Дата рождения</h4></div><div class="item-component"><h4 class="subject-title subject-title-param">Фамилия</h4></div><div class="item-component"><h4 class="subject-title subject-title-param">Имя</h4></div><div class="item-component" data-ng-if="isInsuranceCompany(vtbCompany, policyItem.calculationData.insuranceCompany.registeredService)"><h4 class="subject-title subject-title-param">Загранпаспорт</h4></div></div><div data-ng-class="{\'item-insured-person-terminator\': $last}" class="item item-insured-person" data-ng-repeat="insuredPerson in policyItem.calculationData.insuredPersons"><div class="item-component"><div class="user-input-widget user-input-widget-read-only"><div class="user-input-wrapper"><span class="user-input" data-ng-bind="insuredPerson.birthDate"></span></div></div></div><div class="item-component"><div class="user-input-widget user-input-widget-read-only"><div class="user-input-wrapper"><span class="user-input" data-ng-bind="insuredPerson.surname"></span></div></div></div><div class="item-component"><div class="user-input-widget user-input-widget-read-only"><div class="user-input-wrapper"><span class="user-input" data-ng-bind="insuredPerson.name"></span></div></div></div><div class="item-component" data-ng-if="isInsuranceCompany(vtbCompany, policyItem.calculationData.insuranceCompany.registeredService)"><div class="user-input-widget user-input-widget-read-only"><div class="user-input-wrapper"><span class="user-input" data-ng-bind="insuredPerson.internationalPassportSerialAndNumber"></span></div></div></div></div></div></section><section class="container-content-insured container-content-insurer"><header class="page-header"><h2 class="subject-title subject-section-title">Страхователь</h2></header><div class="items"><div class="item item-insured-person item-insured-person-insurer"><div class="items-inner-wrapper"><div class="item-component"><h4 class="subject-title">Дата рождения</h4><div class="user-input-widget user-input-widget-read-only"><div class="user-input-wrapper"><span class="user-input" data-ng-bind="policyItem.calculationData.insurer.birthDate"></span></div></div></div><div class="item-component"><h4 class="subject-title">Фамилия</h4><div class="user-input-widget user-input-widget-read-only"><div class="user-input-wrapper"><span class="user-input" data-ng-bind="policyItem.calculationData.insurer.lastName"></span></div></div></div><div class="item-component"><h4 class="subject-title">Имя</h4><div class="user-input-widget user-input-widget-read-only"><div class="user-input-wrapper"><span class="user-input" data-ng-bind="policyItem.calculationData.insurer.firstName"></span></div></div></div></div><div class="items-inner-wrapper"><div class="item-component item-larger"><h4 class="subject-title">E-mail</h4><div class="user-input-widget user-input-widget-read-only"><div class="user-input-wrapper"><span class="user-input user-input-email" data-ng-bind="policyItem.calculationData.insurer.email"></span></div></div></div><div class="item-component"><h4 class="subject-title">Мобильный телефон</h4><div class="user-input-widget user-input-widget-read-only"><div class="user-input-wrapper"><span class="user-input" data-ng-bind="policyItem.calculationData.insurer.phoneNumber"></span></div></div></div></div></div></div></section></div></div></search-result-item></div><div class="spinner-container" data-ng-show="!policiesFetched"><div class="spinner-dot"></div><div class="spinner-dot"></div><div class="spinner-dot"></div></div></div></section></div>');
  $templateCache.put('modules/public-footer/partials/public-footer.html',
    '<div class="container-fluid container-content" data-ng-controller="publicFooterController"><div class="col-xs-2 footer-section-container"><p class="copyright">&copy; 2016, RiskMarket</p></div><div class="col-xs-6 footer-section-container"><a tabindex="-1" data-ng-href="{{aboutPageLink}}" class="footer-link">О компании</a> <a tabindex="-1" data-ng-href="{{contactsPageLink}}" class="footer-link">Контакты</a> <a tabindex="-1" data-ng-href="{{termsPageLink}}" class="footer-link" data-ng-hide="isPartnerPage()">Пользовательское соглашение</a> <a tabindex="-1" data-ng-href="{{partnerPageLink}}" class="footer-link" target="_blank">Для партнеров</a></div><div class="col-xs-4 footer-section-container"><ul class="items partner-items"><li class="partner-item item partner-item-visa"></li><li class="partner-item item partner-item-mastercard"></li><li class="partner-item item partner-item-geotrust"></li></ul></div></div>');
  $templateCache.put('modules/public-navigation/partials/public-navigation.html',
    '<nav class="navbar navbar-default main-nav navbar-fixed-top" data-scrolled-nav data-class-at="{\n' +
    '	\'navbar-index\': \'main-page\',\n' +
    '\n' +
    '	\'\': \'order-prepare, order-payment, order-done, order-fail\'\n' +
    '	}" data-ng-controller="navigationController as vm"><div class="container-fluid container-content"><div class="navbar-header"><button tabindex="-1" type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false"><span class="sr-only">Toggle navigation</span> <span class="icon-bar"></span> <span class="icon-bar"></span> <span class="icon-bar"></span></button> <a tabindex="-1" href="/" class="navbar-brand logo"></a></div><div class="collapse navbar-collapse menu-list" id="bs-example-navbar-collapse-1"><div class="nav-default-content" data-ng-show="!isPartnerPage()"><ul class="nav navbar-nav"><li class="nav-item"><a tabindex="-1" class="link" data-class-at="{\'static\': \'main-page\'}" href="/">Путешествия</a></li></ul><button tabindex="-1" data-ng-show="vm.currentUser.value == null" class="btn btn-nav btn-success" data-class-at="{\'btn-login-main-page\': \'main-page\'}" data-ng-click="vm.requestAuthenticate()">Войти</button><ul class="nav navbar-nav navbar-right" data-ng-show="vm.currentUser.value != null"><li class="dropdown"><a tabindex="-1" href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">{{::vm.currentUser.value.displayName}} <img data-img-svg class="fill-svg" src="img/min/cabinet_button_arrow.svg" alt="arrow"></a><ul class="dropdown-menu"><li><a tabindex="-1" class="link" href="/private-office"><img data-img-svg src="img/min/polis_ico.svg" alt="Полисы" class="link-icon"> Полисы</a></li><li data-ng-show="vm.isAdmin()"><a tabindex="-1" class="link" href="/admin.monitor"><img data-img-svg src="img/min/crown_admin.svg" alt="АДМИН" class="link-icon"> АДМИН</a></li><li><a tabindex="-1" class="link" href="#" data-ng-click="vm.logout($event)"><img data-img-svg src="img/min/exit_ico.svg" alt="Выйти" class="link-icon"> Выйти</a></li></ul></li></ul></div><div class="nav-alt-content" data-ng-show="isPartnerPage()"><a tabindex="-1" href="/" class="nav-inner-page-link" target="_blank"><span class="nav-inner-page-link-text">riskmarket.ru</span></a> <button tabindex="-1" class="btn btn-grey-transparent" data-ng-click="vm.logout($event)">Выйти</button></div></div></div></nav><script type="text/ng-template" id="login.html"><div data-handle-modal data-username="formData.userName" data-is-restore="isRestore" data-close-action="close($event)">\n' +
    '		<div class="modal-header">\n' +
    '			<a tabindex="-1"  class="action-close" href="#" data-ng-click="close($event)"></a>\n' +
    '\n' +
    '			<div class="modal-logo"></div>\n' +
    '\n' +
    '			<h2 class="modal-title" data-ng-hide="isRestore">\n' +
    '\n' +
    '				Вход<br />в личный кабинет\n' +
    '			</h2>\n' +
    '\n' +
    '			<h2 class="modal-title restore" data-ng-show="isRestore">\n' +
    '				Восстановление<br />пароля\n' +
    '			</h2>\n' +
    '		</div>\n' +
    '\n' +
    '		<div class="modal-body" data-ng-hide="isRestore">\n' +
    '			<form name="login" novalidate data-ng-submit="login.$valid && ok()">\n' +
    '				<div class="item-component">\n' +
    '					<div\n' +
    '						data-focus-styling="{class: \'focus\'}"\n' +
    '\n' +
    '						class="user-input-element user-input-single-text"\n' +
    '\n' +
    '						data-ng-class="{\n' +
    '							error: (login.userName.$error.required || login.userName.$error.pattern) && (login.userName.$touched || login.$submitted)\n' +
    '						}"\n' +
    '					>\n' +
    '						<input\n' +
    '							type="text"\n' +
    '\n' +
    '							placeholder="E-mail"\n' +
    '\n' +
    '							data-ng-model="formData.userName"\n' +
    '\n' +
    '							data-ng-required="true"\n' +
    '\n' +
    '							name="userName"\n' +
    '\n' +
    '							data-popover-trigger="focus"\n' +
    '\n' +
    '							data-popover-is-open="login.$submitted && !login.userName.$valid"\n' +
    '\n' +
    '							data-uib-popover="Укажите адрес электронной почты"\n' +
    '\n' +
    '							data-ng-pattern="regexp.EMAIL"\n' +
    '\n' +
    '							data-ng-blur="isExistingEmail()"\n' +
    '						/>\n' +
    '					</div>\n' +
    '				</div>\n' +
    '\n' +
    '				<div class="item-component">\n' +
    '					<div\n' +
    '						data-focus-styling="{class: \'focus\'}"\n' +
    '\n' +
    '						class="user-input-element user-input-single-text"\n' +
    '\n' +
    '						data-ng-class="{error: login.password.$error.required && (login.password.$touched || login.$submitted) && userIsExisting}"\n' +
    '					>\n' +
    '						<input\n' +
    '							type="password"\n' +
    '\n' +
    '							placeholder="Пароль"\n' +
    '\n' +
    '							data-ng-model="formData.password"\n' +
    '\n' +
    '							data-ng-required="true"\n' +
    '\n' +
    '							name="password"\n' +
    '\n' +
    '							id="password"\n' +
    '\n' +
    '							data-popover-trigger="focus"\n' +
    '\n' +
    '							data-popover-is-open="login.$submitted && userIsExisting && !login.password.$valid"\n' +
    '\n' +
    '							data-uib-popover="Укажите пароль"\n' +
    '						/>\n' +
    '\n' +
    '						<span class="show-pass" data-ng-click="showpassword($event)">\n' +
    '							<img data-img-svg src="/img/min/pass_vizible_icon.svg" alt="Показать/скрыть пароль" />\n' +
    '						</span>\n' +
    '					</div>\n' +
    '				</div>\n' +
    '\n' +
    '				<div class="item-component">\n' +
    '					<div data-focus-styling="{class: \'focus\'}" >\n' +
    '						<input\n' +
    '							type="checkbox"\n' +
    '\n' +
    '							placeholder="чужой компьютер"\n' +
    '\n' +
    '							data-ng-model="formData.alienComputer"\n' +
    '\n' +
    '							data-ng-required="false"\n' +
    '\n' +
    '							name="alienComputer"\n' +
    '\n' +
    '							id="alienComputer"\n' +
    '\n' +
    '							data-popover-trigger="focus"\n' +
    '\n' +
    '							data-uib-popover="чужой компьютер"\n' +
    '						/>\n' +
    '\n' +
    '						<label for="alienComputer">чужой компьютер</label>\n' +
    '					</div>\n' +
    '				</div>\n' +
    '\n' +
    '				<div class="actions actions-login">\n' +
    '					<input class="btn btn-grey-transparent" type="submit" value="Войти" data-ng-click="findInvalidFields()" />\n' +
    '				</div>\n' +
    '\n' +
    '				<div class="actions actions-restore">\n' +
    '					<a tabindex="-1"  class="link restore-password-link" href="#" data-ng-click="setRestore($event);">Забыли пароль?</a>\n' +
    '				</div>\n' +
    '			</form>\n' +
    '\n' +
    '			<p\n' +
    '				data-ng-if="passwordRestoreError || loginError"\n' +
    '\n' +
    '				data-ng-bind="feedBack"\n' +
    '\n' +
    '				class="alert alert-danger"\n' +
    '			></p>\n' +
    '\n' +
    '			<div class="helper">\n' +
    '				<a tabindex="-1"  data-ng-click="isCollapsed = !isCollapsed" class="action">Как завести личный кабинет?</a>\n' +
    '\n' +
    '				<div uib-collapse="isCollapsed">\n' +
    '					<div class="message">\n' +
    '						Личный кабинет на RiskMarket.ru создаётся автоматически после указания пользователем своего адреса электронной почты для получения страхового полиса. Адрес электронной почты будет являться логином. На e-mail придёт письмо с паролем к созданному личному кабинету, где будут храниться купленные страховки, откуда их всегда можно распечатать.\n' +
    '					</div>\n' +
    '				</div>\n' +
    '			</div>\n' +
    '		</div>\n' +
    '\n' +
    '		<div class="modal-body restore" data-ng-show="isRestore">\n' +
    '			<form\n' +
    '				name="restore"\n' +
    '\n' +
    '				novalidate\n' +
    '\n' +
    '				data-ng-submit="restore.$valid && restorePassword()"\n' +
    '\n' +
    '				data-ng-hide="passwordRestoreIntent && passwordRestoreResultReceived"\n' +
    '			>\n' +
    '				<div class="helper">\n' +
    '					<p>Новый пароль<br/>будет выслан на почту</p>\n' +
    '\n' +
    '					<p class="email-value" data-ng-bind="formData.userName"></p>\n' +
    '				</div>\n' +
    '\n' +
    '				<div class="actions">\n' +
    '					<input data-ng-disabled="restore.$invalid" class="btn btn-grey-transparent" type="submit" value="Восстановить" />\n' +
    '				</div>\n' +
    '			</form>\n' +
    '\n' +
    '			<p\n' +
    '				data-ng-if="passwordRestoreIntent && passwordRestoreResultReceived"\n' +
    '\n' +
    '				data-ng-bind="feedBack"\n' +
    '\n' +
    '				class="alert alert-success"\n' +
    '			></p>\n' +
    '		</div>\n' +
    '	</div></script>');
  $templateCache.put('modules/search-results/partials/search-filter.html',
    '<div class="filter-container filter-light" data-ng-show="referenceDataFetched"><div class="filter-wrapper filter-wrapper-separate"><a class="btn btn-grey-transparent compare-items-btn" data-ng-href="{{comparedItemsPageLink}}" target="_blank" data-ng-class="{\'invisible\': appInFrameMode}">Сравнить страховки <span class="compared-items-num" data-ng-bind="comparedItemsNum" data-ng-class="{ \'active\' : comparedItemsNum } "></span></a><div class="filtered-items-number">Всего <span data-ng-bind-template="{{ relevantItemsQuantity }} {{ quantitySuffix(relevantItemsQuantity, \'расчет\', [\'\', \'а\', \'ов\']) }}"></span></div><div class="filter-area sorting-filter"><span class="item-label">Сортировка</span><div class="user-input-widget" data-user-input-list="" data-target-model="order" data-view-prop="label" data-model-prop="value" data-ignore-events="true" data-default-view-value="По умолчанию" data-values="dictionaries.sortOrder"></div></div></div><div class="filter-wrapper"><div class="filter-wrapper-inner"><div class="filter-area"><span class="item-label">Компания</span><div class="user-input-widget" data-user-input-list="" data-view-prop="label" data-model-prop="value" data-target-model="params.insuranceCompany" data-values="dictionaries.insuranceCompanies"></div></div><div class="filter-area"><span class="item-label">Тип полиса</span><div class="user-input-widget" data-user-input-list="" data-target-model="params.calculationDataInput.travelData.period.multi" data-view-prop="label" data-model-prop="value" data-values="dictionaries.policyType"></div></div><div class="filter-area"><span class="item-label">Застраховано дней<br><span class="item-label-note">для многократных полисов</span></span><div class="user-input-widget" data-user-input-list="" data-target-model="params.calculationDataInput.travelData.period.insuredDays" data-view-prop="label" data-model-prop="value" data-values="dictionaries.insuredDays" data-widget-code="INSURED_DAYS"></div></div></div><div class="filter-area"><button data-ng-class="{\'active-btn\': showAdditionalFilters}" class="btn btn-grey-transparent" data-ng-click="toggleFilters()">Все фильтры</button></div></div><div class="filter-extra" data-ng-show="showAdditionalFilters" data-filter-extra><div class="filter-wrapper"><div class="filter-area"><span class="item-label">Страховая сумма</span><div class="user-input-widget" data-user-input-list="" data-target-model="params.calculationDataInput.riskAliasMap.MEDICAL_EXPENSES.risk.sumInsured" data-view-prop="label" data-model-prop="value" data-values="dictionaries.insuranceSum"></div><div class="user-input-widget user-input-widget-currencies" data-user-input-list="" data-target-model="params.calculationDataInput.currency" data-view-prop="label" data-model-prop="value" data-values="dictionaries.currency"></div></div><div class="filter-area"><span class="item-label">Сервисная компания</span><div class="user-input-widget" data-user-input-list="" data-view-prop="label" data-model-prop="value" data-target-model="params.serviceCompany" data-values="dictionaries.assistanceCompanies"></div></div></div><h5 class="filter-wrapper-title">Наполнение полиса:</h5><div class="filter-wrapper"><div class="filter-group"><div class="filter-area"><input type="checkbox" id="extraDentalTreatment" data-ng-true-value="\'INCLUDED\'" data-ng-false-value="undefined" data-ng-model="params.calculationDataInput.riskAliasMap.MEDICAL_EXPENSES.subRisks.EXTRA_DENTAL_TREATMENT.riskStatus"><label for="extraDentalTreatment">экстренная стоматология</label></div><div class="filter-area"><input type="checkbox" id="carInsurance" data-ng-true-value="\'INCLUDED\'" data-ng-false-value="undefined" data-ng-model="params.calculationDataInput.riskAliasMap.BROKEN_CAR.riskStatus"><label for="carInsurance">для поездки на авто</label></div><div class="filter-area"><input type="checkbox" id="flightDelay" data-ng-true-value="\'INCLUDED\'" data-ng-false-value="undefined" data-ng-model="params.calculationDataInput.riskAliasMap.FLIGHT_DELAY.riskStatus"><label for="flightDelay">задержка рейса</label></div></div><div class="filter-group"><div class="filter-area"><input type="checkbox" id="thirdPartyVisit" data-ng-true-value="\'INCLUDED\'" data-ng-false-value="undefined" data-ng-model="params.calculationDataInput.riskAliasMap.MEDICAL_EXPENSES.subRisks.THIRD_PARTY_VISIT.riskStatus"><label for="thirdPartyVisit">визит родственника</label></div><div class="filter-area"><input type="checkbox" id="prescheduleReturn" data-ng-true-value="\'INCLUDED\'" data-ng-false-value="undefined" data-ng-model="params.calculationDataInput.riskAliasMap.MEDICAL_EXPENSES.subRisks.PRESCHEDULE_RETURN.riskStatus"><label for="prescheduleReturn">досрочное возвращение</label></div><div class="filter-area"><input type="checkbox" id="transportExpenses" data-ng-true-value="\'INCLUDED\'" data-ng-false-value="undefined" data-ng-model="params.calculationDataInput.riskAliasMap.MEDICAL_EXPENSES.subRisks.TRANSPORT_EXPENSES.riskStatus"><label for="transportExpenses">временное возвращение</label></div></div><div class="filter-group"><div class="filter-area"><input type="checkbox" id="children" data-ng-true-value="\'INCLUDED\'" data-ng-false-value="undefined" data-ng-model="params.calculationDataInput.riskAliasMap.MEDICAL_EXPENSES.subRisks.BRING_CHILDREN_BACK_HOME.riskStatus"><label for="children">возвращение детей домой</label></div><div class="filter-area"><input type="checkbox" id="legalHelp" data-ng-true-value="\'INCLUDED\'" data-ng-false-value="undefined" data-ng-model="params.calculationDataInput.riskAliasMap.MEDICAL_EXPENSES.subRisks.LEGAL_HELP.riskStatus"><label for="legalHelp">юридическая помощь и консультация</label></div><div class="filter-area"><input type="checkbox" id="lostDocuments" data-ng-true-value="\'INCLUDED\'" data-ng-false-value="undefined" data-ng-model="params.calculationDataInput.riskAliasMap.MEDICAL_EXPENSES.subRisks.LOST_OR_STOLEN_DOCUMENTS.riskStatus"><label for="lostDocuments">потеря или хищение документов</label></div></div></div></div></div>');
  $templateCache.put('modules/search-results/partials/search-query.html',
    '<div class="filter-container filter-darker"><div class="filter-wrapper"><div class="filter-fields"><div class="filter-area"><selectable-items data-params="{\n' +
    '					mode: \'full\',\n' +
    '\n' +
    '					labels: textLabels,\n' +
    '\n' +
    '					itemLabel: \'nameRus\',\n' +
    '\n' +
    '					maxItems: selectableItems.MAIN_PAGE_TRIP_ITEMS_LIMIT,\n' +
    '\n' +
    '					enableTips: false\n' +
    '				}" data-ng-model="data.country" data-uib-tooltip="Укажите страну" data-tooltip-placement="top" data-tooltip-enable="!data.country.length" data-tooltip-trigger="none" data-tooltip-is-open="!data.country.length" data-items="data.countries"></selectable-items></div><div class="filter-area"><participants-control data-participants="data.passengers" data-max-participant-count="4" data-is-valid="data.validation" data-lazy-update="false" class="slim" data-uib-tooltip="Укажите туристов" data-tooltip-placement="top" data-tooltip-trigger="none" data-tooltip-is-open="!data.passengers[0].birthDate.length && !data.passengers[0].isValid"></participants-control></div><div class="filter-area"><period-control data-start="data.period[\'start-date\']" data-finish="data.period[\'end-date\']" data-is-valid="data.validation" data-uib-tooltip="Укажите даты" data-tooltip-placement="top" data-tooltip-enable="!data.period[\'start-date\'] || !data.period[\'end-date\']" data-tooltip-trigger="none" data-tooltip-is-open="!data.period[\'start-date\'] || !data.period[\'end-date\']" class="slim"></period-control></div></div><div class="filter-buttons"><div class="filter-area"><button data-ng-click="showOptions = !showOptions" class="btn btn-options" data-ng-class="{ \'btn-options-active\': showOptions }">ОПЦИИ</button></div><div class="filter-area"><button class="btn" data-ng-disabled="!actionAllowed();" data-ng-click="action({data: data});">РАССЧИТАТЬ</button></div></div></div><div data-ng-class="{\'inactive\': !showOptions}" class="filter-wrapper dummy"><div class="filter-options"><div class="filter-area"><input type="checkbox" id="searchQueryLuggage" data-ng-checked="data.riskFilters[\'LUGGAGE\'] == 1"><label data-ng-click="toggleRisk(\'luggage\');">Защита багажа</label></div><div class="filter-area"><input type="checkbox" id="searchQueryCancellation" data-ng-checked="data.riskFilters[\'TRIP_CHANGE_OR_CANCELLATION\'] == 1"><label data-ng-click="toggleRisk(\'trip_change_or_cancellation\');">Отмена поездки</label></div><div class="filter-area"><input type="checkbox" id="searchQueryAccident" data-ng-checked="data.riskFilters[\'ACCIDENT\'] == 1"><label data-ng-click="toggleRisk(\'accident\');">Несчастный случай</label></div><div class="filter-area"><input type="checkbox" id="searchQueryResponsibility" data-ng-checked="data.riskFilters[\'PERSONAL_LIABILITY\'] == 1"><label data-ng-click="toggleRisk(\'personal_liability\');">Гражданская ответственность</label></div></div></div><div data-ng-class="{\'inactive\': !showOptions}" class="filter-wrapper dummy"><div class="filter-options"><div class="filter-area" data-ng-repeat="termData in dictionaries.activity track by $index | orderBy: \'orderNumber\'"><input type="checkbox" data-ng-checked="data.specialTermFilters.indexOf(termData.code.toUpperCase()) != -1" data-ng-attr-id="{{ ::(\'term\' + termData.code) }}"><label data-ng-click="toggleTerm(termData.code);" data-ng-bind="::termData.displayName"></label></div></div></div></div>');
  $templateCache.put('modules/search-results/partials/search-result-item.html',
    '<div class="search-result-item" data-sticky-block data-sticky-block-offset-top-by="data-scrolled-nav" data-sticky-block-fixed-to="data-fixed-nav" data-sticky-active-prop="item.expanded" data-sticky-block-scroll-speed="200" data-element-enable-flag="{{ item.expanded }}"><div class="search-result-item-common sticky-top" data-primary-top><div class="search-result-item-common-row"><div class="flex-container"><div class="flex-item search-result-item-common-logo" data-bg-image="{template: \'vendorCompany\', file: item.insuranceCompany.registeredService.toLowerCase()}"></div><div class="flex-item-center"><div class="flex-container-inner"><div class="program-descr"><div class="item-type"><span data-action-trigger data-ng-click="expand(item);" data-ng-bind-template="{{ ::(item.calculationDataInput.travelData.period.multi ? \'Многократный\' : \'Однократный\') }} полис, страховая сумма {{ ::(item.calculationDataInput.riskAliasMap[\'MEDICAL_EXPENSES\'].risk.sumInsured | number: 0 | numdivider: \',\' : \' \') }}"></span> <span class="currency" data-ng-bind="::currencySymbols[item.calculationDataInput.riskAliasMap[\'MEDICAL_EXPENSES\'].risk.currency]"></span></div><div class="program-territory" data-ng-bind-template="{{ ::(territory | wordcut:maxTerritoryTextLength) }}"></div></div><div class="item-price"><span class="currency-base" data-ng-bind="::(item.priceContainer.integralPart | number: 0 | numdivider: \',\' : \' \')"></span> <span class="currency-fraction" data-ng-bind="::item.priceContainer.fractionalPart"></span> <span class="currency currency-symbol" data-ng-bind="::currencySymbols[\'RUB\']"></span></div></div></div><div data-ng-show="config.showBuyButton || config.showPayButton || config.showDownloadButton" class="flex-item"><button data-ng-if="config.showBuyButton" class="btn btn-success btn-buy" data-ng-click="events.onBuyClick(item)">КУПИТЬ</button> <button data-ng-if="config.showPayButton" class="btn btn-success btn-buy" data-ng-click="events.onPayClick(item, orderPreview)">ОПЛАТИТЬ</button> <a target="_self" data-ng-show="config.showDownloadButton" class="btn btn-success btn-buy" data-ng-href="{{ ::(site  + \'/\' + orderPreview.policyPdfUrl) }}">СКАЧАТЬ</a></div></div></div><div class="separator"></div><div class="search-result-item-common-row"><div class="flex-container search-result-insurer-common-params"><div class="flex-item program-name" data-ng-bind="::item.calculationDataInput.insuranceProgramName"></div><div class="flex-item-center"><div class="flex-container-inner"><div class="option">Застраховано дней: <span class="value" data-ng-bind="::item.calculationDataInput.travelData.period.termDays"></span></div><div class="option">Количество поездок: <span class="value"><span data-ng-show="item.calculationDataInput.travelData.period.multi" class="infinity">&infin;</span> <span data-ng-show="!item.calculationDataInput.travelData.period.multi">1</span></span></div><div class="option">Макс. дней в одной поездке: <span class="value" data-ng-bind="::item.calculationDataInput.travelData.period.daysInTrip"></span></div></div></div><div class="flex-item"><div data-ng-hide="appInFrameMode" class="animated-el-wrapper compare-btn-wrapper"><button data-ng-hide="showExtraOptions" class="compare-btn" data-ng-class="{ \'active\' : item.isAddedToCompared }" data-ng-click="updateComparedItemState(item)" data-uib-tooltip="{{item.tooltipText}}" data-tooltip-is-open="mouseover" data-clone-animation><img data-img-svg src="/img/min/compare_icon.svg" alt="Добавить к сравнению / убрать из сравнения"></button></div><button data-ng-hide="showExtraOptions" data-ng-show="config.showParamsButton" data-action-trigger class="btn btn-grey-transparent btn-params" data-ng-click="expand(item);" data-ng-class="{\'item-full-width\': appInFrameMode}">ПАРАМЕТРЫ</button> <a data-ng-if="config.showActionsButton" data-download-link data-action-trigger class="btn btn-green" data-ng-bind="getActionLabel({item: item})" data-ng-href="{{ getActionResource({item: item}) }}" data-ng-click="contextAction({item: item})"></a></div></div><div data-ng-if="showExtraOptions" class="flex-container search-result-insurer-extra-params"><div class="options-wrapper flex-container"><div class="option">Начало действия: <span class="value" data-ng-bind="::item.calculationDataInput.travelData.period[\'start-date\']"></span></div><div class="option">Застрахованные: <span class="value" data-ng-bind-template="{{ ::totalInsuredPersons }} {{ ::quantitySuffix(totalInsuredPersons, \'турист\', [\'\', \'а\', \'ов\']) }}"></span></div></div><div class="flex-item"><button data-ng-show="config.showParamsButton" data-action-trigger class="btn btn-grey-transparent btn-params" data-ng-click="expand(item);">ПАРАМЕТРЫ</button></div></div></div></div><div class="search-result-params scrolled-block" data-ng-if="item.expanded" data-ng-include="\'modules/search-results/partials/search-result-params.html\'"></div><div data-primary-bottom data-ng-show="item.expanded"></div></div>');
  $templateCache.put('modules/search-results/partials/search-result-params.html',
    '<h4 class="search-result-params-header">Страховые риски и лимиты</h4><div class="search-result-params-group"><h4 class="search-result-params-group-header"><span data-ng-bind="::item.calculationDataInput.riskAliasMap.MEDICAL_EXPENSES.displayName"></span><div class="dash"></div><span data-ng-bind-template="{{ ::(item.calculationDataInput.riskAliasMap.MEDICAL_EXPENSES.risk.sumInsured | number: 0 | numdivider: \',\' : \' \') }}"></span> <span class="value-currency" data-ng-bind-template="{{ ::currencySymbols[item.calculationDataInput.riskAliasMap.MEDICAL_EXPENSES.risk.currency] }}"></span></h4><div data-ng-repeat="expense in medicalExpenses track by $index" class="flex-container"><div class="flex-container-inner params-row col-left"><div data-ng-bind="::expense.left.displayName"></div><div class="value excluded" data-ng-class="{ \'included\': expense.left.included, \'sum-insured\': expense.left.risk && expense.left.risk.sumInsured }"><span data-ng-bind-template="{{ ::(expense.left.risk && expense.left.risk.sumInsured ? (expense.left.risk.sumInsured | number: 0 | numdivider: \',\' : \' \') : \' \') }}"></span> <span class="value-currency" data-ng-bind-template="{{ ::(expense.left.risk && expense.left.risk.sumInsured ? currencySymbols[expense.left.risk.currency] : \' \') }}"></span></div></div><div class="flex-container-inner params-row col-right"><div data-ng-bind="::expense.right.displayName"></div><div class="value excluded" data-ng-class="{ \'included\': expense.right.included, \'sum-insured\': expense.right.risk && expense.right.risk.sumInsured }"><span data-ng-bind-template="{{ ::(expense.right.risk && expense.right.risk.sumInsured ? (expense.right.risk.sumInsured | number: 0 | numdivider: \',\' : \' \') : \' \') }}"></span> <span class="value-currency" data-ng-bind-template="{{ ::(expense.right.risk && expense.right.risk.sumInsured ? currencySymbols[expense.right.risk.currency] : \' \') }}"></span></div></div></div></div><div class="search-result-params-group"><h4 class="search-result-params-group-header">Опции</h4><div data-ng-repeat="option in extraOptions track by $index" class="flex-container"><div class="flex-container-inner params-row col-left"><div data-ng-bind="::option.left.displayName"></div><div class="value excluded" data-ng-class="{ \'included\': option.left.included, \'sum-insured\': option.left.risk && option.left.risk.sumInsured }"><span data-ng-bind-template="{{ ::(option.left.risk && option.left.risk.sumInsured ? (option.left.risk.sumInsured | number: 0 | numdivider: \',\' : \' \') : \' \') }}"></span> <span class="value-currency" data-ng-bind-template="{{ ::(option.left.risk && option.left.risk.sumInsured ? currencySymbols[option.left.risk.currency] : \' \') }}"></span></div></div><div class="flex-container-inner params-row col-right"><div data-ng-bind="::option.right.displayName"></div><div class="value excluded" data-ng-class="{ \'included\': option.right.included, \'sum-insured\': option.right.risk && option.right.risk.sumInsured }"><span data-ng-bind-template="{{ ::(option.right.risk && option.right.risk.sumInsured ? (option.right.risk.sumInsured | number: 0 | numdivider: \',\' : \' \') : \' \') }}"></span> <span class="value-currency" data-ng-bind-template="{{ ::(option.right.risk && option.right.risk.sumInsured ? currencySymbols[option.right.risk.currency] : \' \') }}"></span></div></div></div></div><div class="search-result-params-description" data-ng-if="item.calculationDataInput.description"><div class="caption">Дополнительные условия:</div><span data-ng-bind-html="::item.calculationDataInput.description"></span></div><div class="flex-container"><div class="search-result-params-territory"><div class="caption">Территория покрытия:</div><span data-ng-bind="::item.calculationDataInput.territoryDisplayName"></span></div><div class="search-result-params-links"><a class="download-link" target="{{::linkTargetAttr}}" data-ng-href="{{ ::(site + \'/\' + item.links.linkToRules) }}" href=""><span class="link-content">ПРАВИЛА СТРАХОВАНИЯ</span></a> <a class="download-link" target="{{::linkTargetAttr}}" data-ng-href="{{ ::(site + \'/\' + item.links.linkSpecialConditions) }}" href=""><span class="link-content">ОСОБЫЕ УСЛОВИЯ</span></a> <a class="download-link" target="{{::linkTargetAttr}}" data-ng-href="{{ ::(site + \'/\' + item.links.linkToMemo) }}" href=""><span class="link-content">ПАМЯТКА ПРИ СТРАХОВОМ СЛУЧАЕ</span></a></div></div><div class="search-result-params-company"><div class="caption">Сервисная компания:</div><div class="search-result-item-common-logo service-company-logo" data-bg-image="{template: \'vendorCompany\', file: item.serviceCompany.companyCode.toLowerCase()}"></div></div>');
  $templateCache.put('modules/search-results/partials/search-result-participants.html',
    '<label>Застрахованные</label><table><tr data-ng-repeat="insuredPerson in orderPreview.insuredPersons"><td><div>{{ insuredPerson.birthDate }}</div></td><td><div>{{ insuredPerson.surname }}</div></td><td><div>{{ insuredPerson.name }}</div></td></tr></table>');
  $templateCache.put('modules/search-results/partials/search-results.html',
    '<div class="container-fluid container-wrapper container-wrapper-darker"><div data-search-query data-data="insuranceParams" data-action="getResults(data);" data-action-allowed="allowToFetchResults();"></div><div data-smart-sticky data-fixed-nav class="query-control-area" data-ng-if="allowDisplayFilterInFrame"><div data-search-filter data-params="insuranceParams.resultsFilter" data-order="sortData.resultsOrder"></div></div><section class="container-fluid container-content container-content-primary container-content-search-results"><p data-ng-show="!getRelevantItemsReport().presence && calculationDone;">Нет данных, удовлетворяющих параметрам запроса.</p><div class="list-items"><search-result-item data-ng-repeat="insuranceItem in searchResults | orderBy:sortData.resultsOrder.prop:sortData.resultsOrder.direction track by insuranceItem.calculationId" data-ng-if="isRelevantSearchResult(insuranceItem, insuranceParams.resultsFilter);" class="search-result-container" data-ng-class="{\'chosen-item\': insuranceItem.expanded}" data-item="insuranceItem" data-risk-options="riskOptions" data-expand="expandItem" data-config="{\n' +
    '                  showBuyButton: true,\n' +
    '\n' +
    '                  showParamsButton: true,\n' +
    '\n' +
    '                  showPolicyActionsButton: false\n' +
    '                }"></search-result-item></div><div class="spinner-container" data-ng-show="fetchingResults"><div class="spinner-dot"></div><div class="spinner-dot"></div><div class="spinner-dot"></div></div></section></div><script type="text/ng-template" id="offers.html"><div class="container-fluid container-wrapper">\n' +
    '        <!-- Container for inner content  -->\n' +
    '\n' +
    '        <div class="container-fluid container-content">\n' +
    '            <!-- Offers row:1 (should be a flex grid with bootstrap columns) -->\n' +
    '\n' +
    '            <div class="subjects-container subjects-promo">\n' +
    '                <!-- Promo text -->\n' +
    '\n' +
    '                <div class="subject-container">\n' +
    '                    <h3 class="subject-title">Специально для путешествий</h3>\n' +
    '\n' +
    '                    <!-- End of promo text -->\n' +
    '                </div>\n' +
    '\n' +
    '                <!-- Product with graphical element (picture / video) -->\n' +
    '\n' +
    '                <div class="subject-container subject-container-media">\n' +
    '                    <figure class="subject-container-resource subject-media-asset">\n' +
    '                        <img src="img/min/banners/banner-00.jpg" alt="Новые семейные программы" />\n' +
    '\n' +
    '                        <figcaption class="subject-container-brief alpha">\n' +
    '                            <!-- Note: use pseudo elements for insurance company logo -->\n' +
    '\n' +
    '                            <h4 class="subject-title">Новые семейные программы</h4>\n' +
    '                        </figcaption>\n' +
    '                    </figure>\n' +
    '                    <!-- End of product -->\n' +
    '                </div>\n' +
    '\n' +
    '                <!-- Product with graphical element (picture / video) -->\n' +
    '\n' +
    '                <div class="subject-container subject-container-media">\n' +
    '                    <figure class="subject-container-resource subject-media-asset">\n' +
    '                        <img src="img/min/banners/banner-01.jpg" alt="Время отпусков это ваше время" />\n' +
    '\n' +
    '                        <figcaption class="subject-container-brief vtb">\n' +
    '                            <!-- Note: use pseudo elements for insurance company logo -->\n' +
    '\n' +
    '                            <h4 class="subject-title">Время отпусков это ваше время</h4>\n' +
    '                        </figcaption>\n' +
    '                    </figure>\n' +
    '                    <!-- End of product -->\n' +
    '                </div>\n' +
    '\n' +
    '                <div class="subject-container subject-container-media">\n' +
    '                    <figure class="subject-container-resource subject-media-asset">\n' +
    '                        <img src="img/min/banners/banner-02.jpg" alt="Больше семья, больше защита" />\n' +
    '\n' +
    '                        <figcaption class="subject-container-brief vsk">\n' +
    '                            <!-- Note: use pseudo elements for insurance company logo -->\n' +
    '\n' +
    '                            <h4 class="subject-title">Больше семья, больше защита</h4>\n' +
    '                        </figcaption>\n' +
    '                    </figure>\n' +
    '                    <!-- End of product -->\n' +
    '                </div>\n' +
    '\n' +
    '                <!-- End of offers row:1 -->\n' +
    '            </div>\n' +
    '\n' +
    '            <!-- Offers row:2 (should be a flex grid with bootstrap columns) -->\n' +
    '\n' +
    '            <div class="subjects-container subjects-promo">\n' +
    '                <!-- Promo text -->\n' +
    '\n' +
    '                <div class="subject-container">\n' +
    '                    <h3 class="subject-title">Специально для путешествий</h3>\n' +
    '\n' +
    '                    <!-- End of promo text -->\n' +
    '                </div>\n' +
    '\n' +
    '                <!-- Product with graphical element (picture / video) -->\n' +
    '\n' +
    '                <div class="subject-container subject-container-media">\n' +
    '                    <figure class="subject-container-resource subject-media-asset">\n' +
    '                        <img src="img/min/banners/banner-00.jpg" alt="Новые семейные программы" />\n' +
    '\n' +
    '                        <figcaption class="subject-container-brief alpha">\n' +
    '                            <!-- Note: use pseudo elements for insurance company logo -->\n' +
    '\n' +
    '                            <h4 class="subject-title">Новые семейные программы</h4>\n' +
    '                        </figcaption>\n' +
    '                    </figure>\n' +
    '                    <!-- End of product -->\n' +
    '                </div>\n' +
    '\n' +
    '                <!-- Product with graphical element (picture / video) -->\n' +
    '\n' +
    '                <div class="subject-container subject-container-media">\n' +
    '                    <figure class="subject-container-resource subject-media-asset">\n' +
    '                        <img src="img/min/banners/banner-01.jpg" alt="Время отпусков это ваше время" />\n' +
    '\n' +
    '                        <figcaption class="subject-container-brief vtb">\n' +
    '                            <!-- Note: use pseudo elements for insurance company logo -->\n' +
    '\n' +
    '                            <h4 class="subject-title">Время отпусков это ваше время</h4>\n' +
    '                        </figcaption>\n' +
    '                    </figure>\n' +
    '                    <!-- End of product -->\n' +
    '                </div>\n' +
    '\n' +
    '                <div class="subject-container subject-container-media">\n' +
    '                    <figure class="subject-container-resource subject-media-asset">\n' +
    '                        <img src="img/min/banners/banner-02.jpg" alt="Больше семья, больше защита" />\n' +
    '\n' +
    '                        <figcaption class="subject-container-brief vsk">\n' +
    '                            <!-- Note: use pseudo elements for insurance company logo -->\n' +
    '\n' +
    '                            <h4 class="subject-title">Больше семья, больше защита</h4>\n' +
    '                        </figcaption>\n' +
    '                    </figure>\n' +
    '\n' +
    '                    <!-- End of product -->\n' +
    '                </div>\n' +
    '\n' +
    '                <!-- End of offers row:2 -->\n' +
    '            </div>\n' +
    '\n' +
    '            <!-- End of container for inner content -->\n' +
    '        </div>\n' +
    '    </div></script>');
  $templateCache.put('modules/utils/directives/participants-control/partials/participants-control.html',
    '<div class="participants-control"><div class="participants-control-input" data-ng-click="togglePopup();" data-uib-tooltip-template="\'ageLimitWarning.html\'" data-tooltip-trigger="none" data-tooltip-enable="!isParticipantAgeAllowed" data-tooltip-is-open="!isParticipantAgeAllowed"><div class="widget-info-area" data-ng-class="{\n' +
    '           active: params.show.popup,\n' +
    '           invalid: touched && !isValid,\n' +
    '           placeholder: !participantsQuantity\n' +
    '         }" data-ng-bind="totalPassengersLabel"></div><button tabindex="-1">&nbsp;</button></div><div class="participants-control-popup hidden" data-ng-class="{hidden: !showControls}"><div class="age-add-title" data-ng-show="participants.length < 2">Даты рождения туристов</div><div class="participants-control-popup-row" data-ng-repeat="(participantId, participant) in participants track by $index"><input data-ng-model="participant.birthDate" type="text" required data-ng-class="{\n' +
    '               \'stand-alone\': participants.length === 1,\n' +
    '               \'entity-invalid\': participant.dirty && !participant.isValid\n' +
    '             }" data-ui-mask="99.99.9999" data-ui-mask-placeholder="{{currentMask}}" data-model-view-value="true" data-ui-options="{\'clearOnBlur\': false}" data-ng-focus="currentMask = mask.focus" data-ng-blur="currentMask = mask.blur; checkParticipants(participants);" data-ng-keyup="onBirthDateInput($event, participant);"> <button class="participants-control-popup-row-remove" tabindex="-1" data-ng-show="participant !== participants[0] || participants.length > 1" data-ng-click="blockPropagation($event); removeParticipant($index);">&nbsp;</button></div><div class="participants-control-popup-add"><button data-ng-show="participants.length < maxParticipantCount" data-ng-click="addParticipant();">Ещё турист</button></div></div></div><script type="text/ng-template" id="ageLimitWarning.html"><div class="tooltip-warning">\n' +
    '		К туристам старше ста лет особый подход &mdash; им необходимо обращаться прямо в страховую компанию!\n' +
    '	</div></script>');
  $templateCache.put('modules/utils/directives/period-control/partials/period-control.html',
    '<div class="period-control" tabindex="0"><div class="period-control-input" data-ng-init="events.checkDates()"><div class="period-control-input-div preview" data-ng-hide="events.notInPreviewMode()"><div id="preview" class="date_placeholder" data-ng-model="preview" data-ng-click="events.dateFieldFocus(dateType.start)">Даты поездки</div></div><div class="period-control-input-div" data-ng-show="events.notInPreviewMode()" data-ng-class="{\'active\': formData.type == dateType.start && formData.show.popup }"><input type="text" data-ng-model="start" id="startdate" data-ng-init="events.checkDates()" data-ng-click="events.dateFieldFocus(dateType.start)" placeholder="_ _._ _._ _ _ _" readonly></div><div class="period-control-input-dash" data-ng-show="events.notInPreviewMode()" data-ng-click="events.dateFieldFocus(dateType.start)">&mdash;</div><div class="period-control-input-div" data-ng-show="events.notInPreviewMode()" data-ng-class="{ \'invalid\': !formData.valid[dateType.finish] && finish, \'active\': formData.type == dateType.finish && formData.show.popup }"><input type="text" data-ng-model="finish" id="enddate" data-ng-init="events.checkDates()" data-ng-click="events.dateFieldFocus(dateType.finish)" placeholder="_ _._ _._ _ _ _" readonly></div><button tabindex="-1" data-ng-click="events.inputBtnClick()">&nbsp;</button></div><div class="period-control-popup" data-ng-show="formData.show.popup"><div class="period-control-popup-month"><button tabindex="-1" data-ng-click="events.prevMonthClick()" style="background-image: url(\'../../../../../img/min/calendar/btn-prev-month.png\')">&nbsp;</button><label data-ng-bind="months[formData.month] + \' \' + formData.year"></label><button tabindex="-1" data-ng-click="events.nextMonthClick()" style="background-image: url(\'../../../../../img/min/calendar/btn-next-month.png\')">&nbsp;</button></div><div class="period-control-popup-day-header"><span data-ng-repeat="acronym in daysAcronyms track by $index" data-ng-bind="::acronym"></span></div><div class="period-control-popup-day-body"><span data-ng-repeat="offset in formData.grid.offset track by $index">&nbsp;</span> <span data-ng-if="formData.grid.overdueType == overdueType.before" class="period-control-popup-overdue-day" data-ng-repeat="overdueDay in formData.grid.overdue track by $index" data-ng-bind="overdueDay"></span> <span class="period-control-popup-active-day" data-ng-class="{ \'period-control-popup-active-day-select\': actualDay.select }" data-ng-repeat="actualDay in formData.grid.actual track by $index" data-ng-click="events.selectDate(actualDay, $last)" data-ng-bind="actualDay.index"></span> <span data-ng-if="formData.grid.overdueType == overdueType.after" class="period-control-popup-overdue-day" data-ng-repeat="overdueDay in formData.grid.overdue track by $index" data-ng-bind="overdueDay"></span></div></div></div>');
  $templateCache.put('modules/utils/directives/selectable-items/partials/selectable-items.html',
    '<div class="selectable-items"><div class="suggestion-fake-input selectable-item" data-ng-show="isFakeInputVisible();">Укажите страну</div><div class="items-wrapper"><span data-ng-repeat="selectedItem in selection track by selectedItem[itemLabel]" class="selectable-item">{{ ::selectedItem[itemLabel] }} <span data-ng-click="removeItem(selectedItem);" class="control control-remove"></span></span> <input type="text" class="suggestion-input"></div><button type="button" class="btn-trigger btn-trigger-map btn-command"></button><div data-ng-show="enableSuggestions && suggestions.length"><ul class="selectable-items-suggestions items"></ul></div></div><div class="tips" data-ng-if="enableTips"><span class="title" data-ng-bind="::labels.SELECTABLE_ITEMS.COUNTRIES.TIPS_LABEL"></span><ul class="tip-items-container"><li data-ng-repeat="tip in labels.SELECTABLE_ITEMS.COUNTRIES.TIPS track by $index" data-ng-bind="::tip" class="tip-item" data-ng-click="tipClick(tip);"></li></ul></div>');
  $templateCache.put('modules/utils/directives/user-input-list/partials/user-input-list.html',
    '<div class="user-input-wrapper"><span class="current-item" data-ng-bind="getViewValue(selectedValue);"></span><ul class="user-input-items-list"><li tabindex="-1" class="user-input-item" data-ng-repeat="value in values track by $index" data-ng-mousedown="setCurrentValue(value);" data-ng-class="{\'user-input-item-selected\': value.inactive ||  selectedValue[viewProp] === value[viewProp] && viewProp !== \'self\'}"><span data-ng-bind="getViewValue(value);" class="user-input-item-value"></span></li></ul></div><span class="btn-trigger btn-arrow-down"></span>');
  $templateCache.put('index.html',
    '<!DOCTYPE html><html lang="ru" data-ng-app="riskMarket" data-ng-class="{\'iframe-app\': appInFrameMode}" data-ng-strict-di><head><script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({\'gtm.start\':\n' +
    '              new Date().getTime(),event:\'gtm.js\'});var f=d.getElementsByTagName(s)[0],\n' +
    '              j=d.createElement(s),dl=l!=\'dataLayer\'?\'&l=\'+l:\'\';j.async=true;j.src=\n' +
    '              \'https://www.googletagmanager.com/gtm.js?id=\'+i+dl;f.parentNode.insertBefore(j,f);\n' +
    '            })(window,document,\'script\',\'dataLayer\',\'GTM-MDZDVN\');</script><meta charset="utf-8"><meta name="fragment" content="!"><base href="/"><title data-ng-bind="pageTitle"></title><link href="https://fonts.googleapis.com/css?family=Open+Sans:400,300,600,700&amp;subset=latin,cyrillic" rel="stylesheet"><link rel="icon" href="img/favicon.ico" type="image/x-icon"><link rel="stylesheet" href="css/vendor-style.min.css"><link rel="stylesheet" href="css/app-style.min.css"></head><body data-popover-close data-ng-class="{\n' +
    '            \'iframe-app\': appInFrameMode,\n' +
    '\n' +
    '            \'iframe-app-ravta\': currentPartner.id === \'RAVTA\'\n' +
    '        }"><noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-MDZDVN" height="0" width="0" style="display:none;visibility:hidden" ></iframe></noscript><div class="background-container" data-class-at="{\'main-page-background\': \'main-page\'}" data-main-page-bg-random><div class="container-fluid container-wrapper" data-ng-include="\'modules/public-navigation/partials/public-navigation.html\'" data-ng-if="!isPartnerLoginPage() && !appInFrameMode"></div><div data-ng-view class="container-fluid container-wrapper main-content"></div></div><section class="features hidden" data-ng-if="isMainPage()" data-class-at="{visible: \'main-page\'}"><h3 class="subject-title">Сервис онлайн страхования</h3><div class="wrapper"><article class="feature"><figure class="picture-container"><img class="feature-picture" src="img/min/promo/price-wide-choice.png" alt="Большой выбор, гарантия цены"></figure><h4 class="subject-title">Большой выбор<br>Гарантия цены</h4><p class="feature-text">RiskMarket.ru имеет прямые подключения к базам страховых компаний и, отвечая на запросы пользователей, предоставляет множество актуальных вариантов страховых продуктов.</p></article><article class="feature"><figure class="picture-container"><img class="feature-picture" src="img/min/promo/safe-buy.png" alt="Удобная покупка"></figure><h4 class="subject-title">Удобная<br>покупка</h4><p class="feature-text">Для поиска подходящей страховки можно воспользоваться системой фильтров и сортировок, а подробное описание условий, рейтинги и отзывы клиентов помогут сделать окончательный выбор.</p></article><article class="feature"><figure class="picture-container"><img class="feature-picture" src="img/min/promo/policy-storage.png" alt="Хранение полисов"></figure><h4 class="subject-title">Хранение<br>полисов</h4><p class="feature-text">На сервисе для пользователя создается личный кабинет, в котором сохраняется история покупок, и откуда всегда можно распечатать необходимую страховку.</p></article></div><a tabindex="-1" class="btn btn-success" data-ng-href="{{ routes.ABOUT }}">Узнать больше</a></section><article class="promo-slogan hidden" data-ng-if="isMainPage()" data-class-at="{visible: \'main-page\'}"><h3 class="subject-title">RiskMarket.ru дает возможность на одном сайте рассчитать, выбрать и купить страховки на разные случаи жизни прямо у ведущих страховых компаний.</h3></article><footer class="container-fluid container-wrapper container-wrapper-darker" data-ng-include="\'modules/public-footer/partials/public-footer.html\'" data-class-at="{\'container-wrapper-darker\': \'trip-form, search-results\', \'container-wrapper-lighter\': \'order-prepare, order-payment, order-done, order-fail\'}" data-ng-if="!isPartnerLoginPage() && !appInFrameMode"></footer><script type="text/javascript" src="js/vendor-logic.min.js"></script><script type="text/javascript" src="js/app-logic.min.js"></script></body></html>');
}]);
