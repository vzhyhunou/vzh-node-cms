import{q as F,r as z,g as K,_ as V,a as q}from"./index-5b26969c.js";import{i as x,b as G}from"./back-5cdc925e.js";var B={},$={};(function(f){Object.defineProperty(f,"__esModule",{value:!0}),f.default=void 0,f.default=function(){var b=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},O=b.basename,_=O===void 0?"":O,h=function(l){var g=l.parents,j=l.id;return((g?g.join("/")+"/":"")+j).replace(/\./g,"/")},y={pathByData:function(l,g,j,D){return"".concat(_,"/static/").concat(l,"/").concat(g,"/").concat(h(j),"/").concat(D)},originByData:function(l,g,j){return y.pathByData("origin",l,g,j)}};return y}})($);var R={};(function(f){function v(t){"@babel/helpers - typeof";return v=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(e){return typeof e}:function(e){return e&&typeof Symbol=="function"&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},v(t)}Object.defineProperty(f,"__esModule",{value:!0}),f.default=void 0;var b=F,O=z,_=["id"];function h(t,e){if(t==null)return{};var n,o,d=y(t,e);if(Object.getOwnPropertySymbols){var p=Object.getOwnPropertySymbols(t);for(o=0;o<p.length;o++)n=p[o],e.includes(n)||{}.propertyIsEnumerable.call(t,n)&&(d[n]=t[n])}return d}function y(t,e){if(t==null)return{};var n={};for(var o in t)if({}.hasOwnProperty.call(t,o)){if(e.includes(o))continue;n[o]=t[o]}return n}function S(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(t);e&&(o=o.filter(function(d){return Object.getOwnPropertyDescriptor(t,d).enumerable})),n.push.apply(n,o)}return n}function l(t){for(var e=1;e<arguments.length;e++){var n=arguments[e]!=null?arguments[e]:{};e%2?S(Object(n),!0).forEach(function(o){g(t,o,n[o])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):S(Object(n)).forEach(function(o){Object.defineProperty(t,o,Object.getOwnPropertyDescriptor(n,o))})}return t}function g(t,e,n){return(e=j(e))in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function j(t){var e=D(t,"string");return v(e)=="symbol"?e:e+""}function D(t,e){if(v(t)!="object"||!t)return t;var n=t[Symbol.toPrimitive];if(n!==void 0){var o=n.call(t,e||"default");if(v(o)!="object")return o;throw new TypeError("@@toPrimitive must return a primitive value.")}return(e==="string"?String:Number)(t)}function C(t,e){return U(t)||H(t,e)||N(t,e)||J()}function J(){throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function N(t,e){if(t){if(typeof t=="string")return k(t,e);var n={}.toString.call(t).slice(8,-1);return n==="Object"&&t.constructor&&(n=t.constructor.name),n==="Map"||n==="Set"?Array.from(t):n==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?k(t,e):void 0}}function k(t,e){(e==null||e>t.length)&&(e=t.length);for(var n=0,o=Array(e);n<e;n++)o[n]=t[n];return o}function H(t,e){var n=t==null?null:typeof Symbol<"u"&&t[Symbol.iterator]||t["@@iterator"];if(n!=null){var o,d,p,c,r=[],a=!0,u=!1;try{if(p=(n=n.call(t)).next,e===0){if(Object(n)!==n)return;a=!1}else for(;!(a=(o=p.call(n)).done)&&(r.push(o.value),r.length!==e);a=!0);}catch(i){u=!0,d=i}finally{try{if(!a&&n.return!=null&&(c=n.return(),Object(c)!==c))return}finally{if(u)throw d}}return r}}function U(t){if(Array.isArray(t))return t}var m="/api";f.default=function(e){var n=e.localeProvider.getLocale,o=e.authProvider.getToken,d=function(c){var r=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};return Promise.all([n(),o()]).then(function(a){var u=C(a,2),i=u[0],s=u[1];return l(l({},r),{},{headers:new Headers({Accept:"application/json","Accept-Language":i})},s?{user:{authenticated:!0,token:"Bearer ".concat(s)}}:{})}).then(function(a){return O.fetchUtils.fetchJson(c,a)})};return{getList:function(c,r){var a=r.pagination,u=r.sort,i=r.filter,s=r.options,P=a.page,E=a.perPage,w=u.field,L=u.order,M=l({page:P-1,size:E,sort:"".concat(w,",").concat(L)},i);return d("".concat(m,"/").concat(c,"/search/list?").concat((0,b.stringify)(M)),s).then(function(T){var A=T.json;return{data:A.content||[],total:A.page.totalElements}})},getOne:function(c,r){var a=r.id,u=r.options;return d("".concat(m,"/").concat(c,"/").concat(a),u).then(function(i){var s=i.json;return{data:s}})},getMany:function(c,r){var a=r.ids,u=r.options;return d("".concat(m,"/").concat(c,"/search/findByIdIn?").concat((0,b.stringify)({ids:a})),u).then(function(i){var s=i.json;return{data:s.content||[]}})},getManyReference:function(c,r){var a=r.pagination,u=r.sort,i=r.filter,s=r.target,P=r.id,E=r.options,w=a.page,L=a.perPage,M=u.field,T=u.order,A=l(l({page:w-1,size:L,sort:"".concat(M,",").concat(T)},i),{},g({},s,P));return d("".concat(m,"/").concat(c,"/search/list?").concat((0,b.stringify)(A)),E).then(function(W){var I=W.json;return{data:I.content||[],total:I.page.totalElements}})},update:function(c,r){var a=r.id,u=r.data,i=r.options;return d("".concat(m,"/").concat(c,"/").concat(a),l({method:"PUT",body:JSON.stringify(u)},i)).then(function(s){var P=s.json;return{data:P}})},updateMany:function(c,r){var a=r.data,u=r.options;return Promise.all(a.map(function(i){var s=i.id,P=h(i,_);return d("".concat(m,"/").concat(c,"/").concat(s),l({method:"PATCH",body:JSON.stringify(P)},u))})).then(function(i){return{data:i.map(function(s){return s.json})}})},create:function(c,r){var a=r.data,u=r.options;return d("".concat(m,"/").concat(c),l({method:"POST",body:JSON.stringify(a)},u)).then(function(i){var s=i.json;return{data:l(l({},a),{},{id:s.id})}})},delete:function(c,r){var a=r.id,u=r.options;return d("".concat(m,"/").concat(c,"/").concat(a),l({method:"DELETE"},u)).then(function(i){var s=i.json;return{data:s}})},deleteMany:function(c,r){var a=r.ids,u=r.options;return Promise.all(a.map(function(i){return d("".concat(m,"/").concat(c,"/").concat(i),l({method:"DELETE"},u))})).then(function(i){return{data:i.map(function(s){return s.json})}})},exchange:function(c){var r=c.path,a=c.query,u=c.data,i=c.options;return d((r.startsWith("/")?r:"".concat(m,"/").concat(r))+(a?"?".concat((0,b.stringify)(a)):""),u?l({body:JSON.stringify(u)},i):i).then(function(s){var P=s.json;return{data:P}})}}}})(R);(function(f){Object.defineProperty(f,"__esModule",{value:!0}),f.default=void 0;var v=h(x),b=h($),O=h(G),_=h(R);function h(y){return y&&y.__esModule?y:{default:y}}f.default={getLocaleProvider:v.default,getFuncProvider:b.default,getAuthProvider:O.default,getDataProvider:_.default}})(B);const Q=K(B),Z=f=>{const{getLocaleProvider:v,getFuncProvider:b,getAuthProvider:O,getDataProvider:_}=Q,y=v({getLocaleMessages:j=>V(Object.assign({"./messages/en.js":()=>q(()=>import("./en-e1cf78e7.js"),["assets/en-e1cf78e7.js","assets/index-5b26969c.js"]),"./messages/ru.js":()=>q(()=>import("./ru-bbf70720.js"),["assets/ru-bbf70720.js","assets/index-5b26969c.js"])}),`./messages/${j}.js`).then(D=>D.default),...f}),S=b(f),l=O(f),g=_({localeProvider:y,authProvider:l,...f});return{localeProvider:y,funcProvider:S,authProvider:l,dataProvider:g}};export{Z as default};