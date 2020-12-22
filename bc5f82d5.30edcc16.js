(window.webpackJsonp=window.webpackJsonp||[]).push([[11],{126:function(e,t,n){"use strict";n.r(t),t.default=n.p+"assets/images/2016_task-8d7f57dd1c4053c6600387a595a8e532.png"},77:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return o})),n.d(t,"metadata",(function(){return s})),n.d(t,"toc",(function(){return c})),n.d(t,"default",(function(){return u}));var r=n(3),a=n(7),i=(n(0),n(82)),o={id:"async_functionality_testing_with_xunit",title:"C# Async functionality testing with xUnit"},s={unversionedId:"async_functionality_testing_with_xunit",id:"async_functionality_testing_with_xunit",isDocsHomePage:!1,title:"C# Async functionality testing with xUnit",description:"While we\u2019re used to using xUnit for properly isolated single unit tests, the library makes it extremely easy to assert HTTP endpoints are running and responding properly.",source:"@site/docs/2016_async.md",slug:"/async_functionality_testing_with_xunit",permalink:"/async_functionality_testing_with_xunit",version:"current",sidebar:"someSidebar",previous:{title:"Sitecore MVC internals - SitecoreControllerFactory",permalink:"/sitecore_mvc_internals_factory"}},c=[],l={toc:c};function u(e){var t=e.components,o=Object(a.a)(e,["components"]);return Object(i.b)("wrapper",Object(r.a)({},l,o,{components:t,mdxType:"MDXLayout"}),Object(i.b)("p",null,"While we\u2019re used to using xUnit for properly isolated single unit tests, the library makes it extremely easy to assert HTTP endpoints are running and responding properly."),Object(i.b)("p",null,"We make use of the ",Object(i.b)("strong",{parentName:"p"},"System.Net.Http.HttpClient")," class, available with .NET Core."),Object(i.b)("p",null,Object(i.b)("img",{alt:"img",src:n(126).default})),Object(i.b)("p",null,Object(i.b)("strong",{parentName:"p"},"System.Net.Http.HttpClient")," makes an async call to a server running locally. Once we have a response, we deserialize the response to a model object, Person, and ensure that we got a single, valid result."),Object(i.b)("p",null,"Use this approach with TDD to set out endpoints with expected responses, and apply ",Object(i.b)("a",Object(r.a)({parentName:"p"},{href:"https://blog.cleancoder.com/uncle-bob/2014/12/17/TheCyclesOfTDD.html"}),"red-green-refactoring")," until you have all of your services online."),Object(i.b)("p",null,"Lastly \u2013 how should you run your test server, which the tests will query against? If you\u2019re using a local IIS instance or debugging through Visual Studio already, you\u2019ll already have a suitable test server in place. Better practice, is to create a test server as part of the suite of tests, which exits and cleans up afterwards. I\u2019ll be covering this in future posts."))}u.isMDXComponent=!0},82:function(e,t,n){"use strict";n.d(t,"a",(function(){return p})),n.d(t,"b",(function(){return d}));var r=n(0),a=n.n(r);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function s(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function c(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var l=a.a.createContext({}),u=function(e){var t=a.a.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):s(s({},t),e)),n},p=function(e){var t=u(e.components);return a.a.createElement(l.Provider,{value:t},e.children)},y={inlineCode:"code",wrapper:function(e){var t=e.children;return a.a.createElement(a.a.Fragment,{},t)}},f=a.a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,i=e.originalType,o=e.parentName,l=c(e,["components","mdxType","originalType","parentName"]),p=u(n),f=r,d=p["".concat(o,".").concat(f)]||p[f]||y[f]||i;return n?a.a.createElement(d,s(s({ref:t},l),{},{components:n})):a.a.createElement(d,s({ref:t},l))}));function d(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var i=n.length,o=new Array(i);o[0]=f;var s={};for(var c in t)hasOwnProperty.call(t,c)&&(s[c]=t[c]);s.originalType=e,s.mdxType="string"==typeof e?e:r,o[1]=s;for(var l=2;l<i;l++)o[l]=n[l];return a.a.createElement.apply(null,o)}return a.a.createElement.apply(null,n)}f.displayName="MDXCreateElement"}}]);