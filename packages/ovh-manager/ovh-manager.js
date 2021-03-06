import angular from 'angular';
import ngAria from 'angular-aria';
import ngSanitize from 'angular-sanitize';
import ssoAuth from 'ovh-angular-sso-auth';

import license from '@ovh-ux/ovh-manager-license';
import welcome from '@ovh-ux/ovh-manager-welcome';

import routing from './ovh-manager.routes';

require('ovh-ui-angular');
require('bootstrap');

import './ovh-manager.less';
import './ovh-manager.scss';

angular
    .module("ovhManager", [
        license,
        welcome,
        ngAria,
        ngSanitize,
        ssoAuth,
        'oui'
    ])
    .run((ssoAuthentication/*, User*/) => {
        ssoAuthentication.login() //.then(() => User.getUser());
    })
    .constant("OVH_SSO_AUTH_LOGIN_URL", "/auth")
    .config((ssoAuthenticationProvider, $httpProvider, OVH_SSO_AUTH_LOGIN_URL, constants) => {
        ssoAuthenticationProvider.setLoginUrl(OVH_SSO_AUTH_LOGIN_URL);
        ssoAuthenticationProvider.setLogoutUrl(`${OVH_SSO_AUTH_LOGIN_URL}?action=disconnect`);

        // if (!constants.prodMode) {
            ssoAuthenticationProvider.setUserUrl("/engine/apiv6/me");
        // }

        // ssoAuthenticationProvider.setConfig([
        //     {
        //         serviceType: "apiv6",
        //         urlPrefix: "/engine/apiv6"
        //     },
        //     {
        //         serviceType: "aapi",
        //         urlPrefix: "/engine/2api"
        //     },
        //     {
        //         serviceType: "apiv7",
        //         urlPrefix: "/engine/apiv7"
        //     }
        // ]);

        // $httpProvider.interceptors.push("serviceTypeInterceptor");
        $httpProvider.interceptors.push("ssoAuthInterceptor");
    })
    .config(OvhHttpProvider => {
        // OvhHttpProvider.rootPath = constants.swsProxyPath;
        OvhHttpProvider.clearCacheVerb = ["POST", "PUT", "DELETE"];
        OvhHttpProvider.returnSuccessKey = "data"; // By default, request return response.data
        OvhHttpProvider.returnErrorKey = "data"; // By default, request return error.data
    })
    .config(routing)
    