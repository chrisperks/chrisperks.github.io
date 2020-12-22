(window.webpackJsonp=window.webpackJsonp||[]).push([[12],{78:function(e,r,t){"use strict";t.r(r),t.d(r,"frontMatter",(function(){return c})),t.d(r,"metadata",(function(){return a})),t.d(r,"toc",(function(){return l})),t.d(r,"default",(function(){return p}));var n=t(3),o=t(7),i=(t(0),t(82)),c={id:"could_not_find_process_pipeline",title:"Error - Could not find method Process.Pipeline"},a={unversionedId:"could_not_find_process_pipeline",id:"could_not_find_process_pipeline",isDocsHomePage:!1,title:"Error - Could not find method Process.Pipeline",description:"When adding custom pipeline processors, you may come across the error:",source:"@site/docs/2017_could_not_find_process_pipeline.md",slug:"/could_not_find_process_pipeline",permalink:"/could_not_find_process_pipeline",version:"current",sidebar:"someSidebar",previous:{title:"Returning JSON errors from Sitecore MVC controllers",permalink:"/returning_json_errors_from_sitecore_mvc_controllers"},next:{title:"Sitecore MVC Internals - IControllerActivator",permalink:"/sitecore_mvc_internals"}},l=[],s={toc:l};function p(e){var r=e.components,t=Object(o.a)(e,["components"]);return Object(i.b)("wrapper",Object(n.a)({},s,t,{components:r,mdxType:"MDXLayout"}),Object(i.b)("p",null,"When adding custom pipeline processors, you may come across the error:"),Object(i.b)("pre",null,Object(i.b)("code",Object(n.a)({parentName:"pre"},{}),'Could not find method: Process. Pipeline: /sitecore[database="SqlServer" xmlns:patch="http://www.sitecore.net/xmlconfig/"]/pipelines/mvc.resultExecuting[patch:source="Sitecore.Mvc.config"]/processor[type="SitecoreCustom.Feature.Logging.LifecycleLogger.Pipelines.ActionExecuting.LogActionExecuting, SitecoreCustom.Feature.Logging.LifecycleLogger" patch:source="Feature.LifecycleLogger.config"]\nDescription: An unhandled exception occurred.\n')),Object(i.b)("p",null,"There are two usual culprits to check."),Object(i.b)("ol",null,Object(i.b)("li",{parentName:"ol"},"Did you reference the correct class and assembly, in your pipeline configuration? A typo here will mean that the processor cannot be found."),Object(i.b)("li",{parentName:"ol"},"Are you sending in the correct typed arguments? Each pipeline requires a specific typed argument object, such as InitializeContainerArgs. If I expect the wrong args type for my chosen pipeline, Sitecore will consider the Process method invalid and will skip it.")),Object(i.b)("p",null,"These are both really easy mistakes to make, and hard to spot where you might be going wrong, as everything will compile fine."))}p.isMDXComponent=!0},82:function(e,r,t){"use strict";t.d(r,"a",(function(){return u})),t.d(r,"b",(function(){return m}));var n=t(0),o=t.n(n);function i(e,r,t){return r in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}function c(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);r&&(n=n.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,n)}return t}function a(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?c(Object(t),!0).forEach((function(r){i(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):c(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function l(e,r){if(null==e)return{};var t,n,o=function(e,r){if(null==e)return{};var t,n,o={},i=Object.keys(e);for(n=0;n<i.length;n++)t=i[n],r.indexOf(t)>=0||(o[t]=e[t]);return o}(e,r);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)t=i[n],r.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(o[t]=e[t])}return o}var s=o.a.createContext({}),p=function(e){var r=o.a.useContext(s),t=r;return e&&(t="function"==typeof e?e(r):a(a({},r),e)),t},u=function(e){var r=p(e.components);return o.a.createElement(s.Provider,{value:r},e.children)},d={inlineCode:"code",wrapper:function(e){var r=e.children;return o.a.createElement(o.a.Fragment,{},r)}},f=o.a.forwardRef((function(e,r){var t=e.components,n=e.mdxType,i=e.originalType,c=e.parentName,s=l(e,["components","mdxType","originalType","parentName"]),u=p(t),f=n,m=u["".concat(c,".").concat(f)]||u[f]||d[f]||i;return t?o.a.createElement(m,a(a({ref:r},s),{},{components:t})):o.a.createElement(m,a({ref:r},s))}));function m(e,r){var t=arguments,n=r&&r.mdxType;if("string"==typeof e||n){var i=t.length,c=new Array(i);c[0]=f;var a={};for(var l in r)hasOwnProperty.call(r,l)&&(a[l]=r[l]);a.originalType=e,a.mdxType="string"==typeof e?e:n,c[1]=a;for(var s=2;s<i;s++)c[s]=t[s];return o.a.createElement.apply(null,c)}return o.a.createElement.apply(null,t)}f.displayName="MDXCreateElement"}}]);