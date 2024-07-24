import{b as I}from"./index-68a79b4e.js";var y={};(function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var n="locale";e.default=function(t){var a=t.getLocaleMessages,u=t.locales,s=function(r){return localStorage.setItem(n,r)},f=function(){return localStorage.getItem(n)||Object.keys(u)[0]};return{setLocale:function(r){return Promise.resolve(r).then(s)},getLocale:function(){return Promise.resolve().then(f)},getMessages:function(){return Promise.resolve().then(f).then(a)}}}})(y);var b={};(function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var n=function(t){var a=t.parents,u=t.id;return((a?a.join("/")+"/":"")+u).replace(/\./g,"/")};e.default=function(){var t=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},a=t.basename,u=a===void 0?"":a,s=function(o,r,i){return"".concat(u,"/static/").concat(o,"/").concat(r,"/").concat(n(i))};return{originByData:function(o,r){return s("origin",o,r)},pathByData:s}}})(b);var k={};function v(e){this.message=e}v.prototype=new Error,v.prototype.name="InvalidCharacterError";var m=typeof window<"u"&&window.atob&&window.atob.bind(window)||function(e){var n=String(e).replace(/=+$/,"");if(n.length%4==1)throw new v("'atob' failed: The string to be decoded is not correctly encoded.");for(var c,t,a=0,u=0,s="";t=n.charAt(u++);~t&&(c=a%4?64*c+t:t,a++%4)?s+=String.fromCharCode(255&c>>(-2*a&6)):0)t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(t);return s};function P(e){var n=e.replace(/-/g,"+").replace(/_/g,"/");switch(n.length%4){case 0:break;case 2:n+="==";break;case 3:n+="=";break;default:throw"Illegal base64url string!"}try{return function(c){return decodeURIComponent(m(c).replace(/(.)/g,function(t,a){var u=a.charCodeAt(0).toString(16).toUpperCase();return u.length<2&&(u="0"+u),"%"+u}))}(n)}catch{return m(n)}}function d(e){this.message=e}function _(e,n){if(typeof e!="string")throw new d("Invalid token specified");var c=(n=n||{}).header===!0?0:1;try{return JSON.parse(P(e.split(".")[c]))}catch(t){throw new d("Invalid token specified: "+t.message)}}d.prototype=new Error,d.prototype.name="InvalidTokenError";const S=Object.freeze(Object.defineProperty({__proto__:null,InvalidTokenError:d,default:_},Symbol.toStringTag,{value:"Module"})),D=I(S);(function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var n=c(D);function c(o){return o&&o.__esModule?o:{default:o}}var t="token",a=function(r){return localStorage.setItem(t,r)},u=function(){return localStorage.getItem(t)},s=function(){return localStorage.removeItem(t)},f=function(){var r=u();return r?(0,n.default)(r):{}};e.default=function(){return{login:function(i){var l=i.username,h=i.password,p=btoa("".concat(l,":").concat(h)),w={Authorization:"Basic ".concat(p)};return fetch("/login",{headers:w}).then(function(g){if(g.status<200||g.status>=300)throw new Error(g.statusText);return g.text()}).then(a)},logout:function(i){return Promise.resolve().then(s).then(function(){if(typeof i=="string")return i})},checkError:function(i){var l=i.status;return Promise.resolve().then(function(){if(l===401||l===403)return s(),Promise.reject()})},checkAuth:function(){return u()?Promise.resolve():Promise.reject()},getPermissions:function(){return Promise.resolve().then(f).then(function(i){var l=i.roles;return l})},getUserId:function(){return Promise.resolve().then(f).then(function(i){var l=i.sub;return l})},setToken:function(i){return Promise.resolve(i).then(a)},getToken:function(){return Promise.resolve().then(u)}}}})(k);export{k as b,b as f,y as i};