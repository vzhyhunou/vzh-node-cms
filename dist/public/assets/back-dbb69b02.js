import{b as I}from"./index-4698c0e1.js";var b={};(function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var t="locale";e.default=function(r){var s=r.getLocaleMessages,u=r.locales,l=function(n){return localStorage.setItem(t,n)},f=function(){return localStorage.getItem(t)||Object.keys(u)[0]};return{setLocale:function(n){return Promise.resolve(n).then(l)},getLocale:function(){return Promise.resolve().then(f)},getMessages:function(){return Promise.resolve().then(f).then(s)}}}})(b);var k={};function m(e){this.message=e}m.prototype=new Error,m.prototype.name="InvalidCharacterError";var v=typeof window<"u"&&window.atob&&window.atob.bind(window)||function(e){var t=String(e).replace(/=+$/,"");if(t.length%4==1)throw new m("'atob' failed: The string to be decoded is not correctly encoded.");for(var i,r,s=0,u=0,l="";r=t.charAt(u++);~r&&(i=s%4?64*i+r:r,s++%4)?l+=String.fromCharCode(255&i>>(-2*s&6)):0)r="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(r);return l};function P(e){var t=e.replace(/-/g,"+").replace(/_/g,"/");switch(t.length%4){case 0:break;case 2:t+="==";break;case 3:t+="=";break;default:throw"Illegal base64url string!"}try{return function(i){return decodeURIComponent(v(i).replace(/(.)/g,function(r,s){var u=s.charCodeAt(0).toString(16).toUpperCase();return u.length<2&&(u="0"+u),"%"+u}))}(t)}catch{return v(t)}}function g(e){this.message=e}function y(e,t){if(typeof e!="string")throw new g("Invalid token specified");var i=(t=t||{}).header===!0?0:1;try{return JSON.parse(P(e.split(".")[i]))}catch(r){throw new g("Invalid token specified: "+r.message)}}g.prototype=new Error,g.prototype.name="InvalidTokenError";const _=Object.freeze(Object.defineProperty({__proto__:null,InvalidTokenError:g,default:y},Symbol.toStringTag,{value:"Module"})),S=I(_);(function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var t=i(S);function i(o){return o&&o.__esModule?o:{default:o}}var r="token",s=function(n){return localStorage.setItem(r,n)},u=function(){return localStorage.getItem(r)},l=function(){return localStorage.removeItem(r)},f=function(){var n=u();return n?(0,t.default)(n):{}};e.default=function(){return{login:function(a){var c=a.username,h=a.password,p=btoa("".concat(c,":").concat(h)),w={Authorization:"Basic ".concat(p)};return fetch("/login",{headers:w}).then(function(d){if(d.status<200||d.status>=300)throw new Error(d.statusText);return d.text()}).then(s)},logout:function(a){return Promise.resolve().then(l).then(function(){if(typeof a=="string")return a})},checkError:function(a){var c=a.status;return Promise.resolve().then(function(){if(c===401||c===403)return l(),Promise.reject()})},checkAuth:function(){return u()?Promise.resolve():Promise.reject()},getPermissions:function(){return Promise.resolve().then(f).then(function(a){var c=a.roles;return c})},getUserId:function(){return Promise.resolve().then(f).then(function(a){var c=a.sub;return c})},setToken:function(a){return Promise.resolve(a).then(s)},getToken:function(){return Promise.resolve().then(u)}}}})(k);export{k as b,b as i};