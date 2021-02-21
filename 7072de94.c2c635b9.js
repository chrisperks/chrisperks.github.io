(window.webpackJsonp=window.webpackJsonp||[]).push([[17],{101:function(e,t,n){"use strict";n.d(t,"a",(function(){return p})),n.d(t,"b",(function(){return m}));var r=n(0),a=n.n(r);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function c(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var l=a.a.createContext({}),u=function(e){var t=a.a.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):c(c({},t),e)),n},p=function(e){var t=u(e.components);return a.a.createElement(l.Provider,{value:t},e.children)},b={inlineCode:"code",wrapper:function(e){var t=e.children;return a.a.createElement(a.a.Fragment,{},t)}},d=a.a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,o=e.originalType,i=e.parentName,l=s(e,["components","mdxType","originalType","parentName"]),p=u(n),d=r,m=p["".concat(i,".").concat(d)]||p[d]||b[d]||o;return n?a.a.createElement(m,c(c({ref:t},l),{},{components:n})):a.a.createElement(m,c({ref:t},l))}));function m(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var o=n.length,i=new Array(o);i[0]=d;var c={};for(var s in t)hasOwnProperty.call(t,s)&&(c[s]=t[s]);c.originalType=e,c.mdxType="string"==typeof e?e:r,i[1]=c;for(var l=2;l<o;l++)i[l]=n[l];return a.a.createElement.apply(null,i)}return a.a.createElement.apply(null,n)}d.displayName="MDXCreateElement"},85:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return i})),n.d(t,"metadata",(function(){return c})),n.d(t,"toc",(function(){return s})),n.d(t,"default",(function(){return u}));var r=n(3),a=n(7),o=(n(0),n(101)),i={id:"sitecore_analyzers",title:"Visualising Sitecore Analyzers"},c={unversionedId:"sitecore_analyzers",id:"sitecore_analyzers",isDocsHomePage:!1,title:"Visualising Sitecore Analyzers",description:"When Sitecore indexes your content, Lucene analyzers work to break down your text into a series of individual tokens. For instance, a simple analyzer might convert input text to lowercase, split into separate words, and remove punctuation:",source:"@site/docs/2017_sitecore_analyzers.md",slug:"/sitecore_analyzers",permalink:"/sitecore_analyzers",version:"current",sidebar:"someSidebar",previous:{title:"Explaining Lucene explain",permalink:"/lucene_explain"},next:{title:"Elasticon London 2017 (for a Sitecore developer)",permalink:"/elasticon"}},s=[],l={toc:s};function u(e){var t=e.components,n=Object(a.a)(e,["components"]);return Object(o.b)("wrapper",Object(r.a)({},l,n,{components:t,mdxType:"MDXLayout"}),Object(o.b)("p",null,"When Sitecore indexes your content, Lucene analyzers work to break down your text into a series of individual tokens. For instance, a simple analyzer might convert input text to lowercase, split into separate words, and remove punctuation:"),Object(o.b)("ul",null,Object(o.b)("li",{parentName:"ul"},"input: Hi there! My name is Chris."),Object(o.b)("li",{parentName:"ul"},"output tokens: \u201chi\u201d, \u201cthere\u201d, \u201cmy\u201d, \u201cname\u201d, \u201cis\u201d, \u201cchris\u201d")),Object(o.b)("p",null,"While this happens behind the scenes, and is usually not of too much interest outside of diagnostics or curiosity, there\u2019s a way we can view the output of the analyzers bundled with Sitecore."),Object(o.b)("p",null,"Let\u2019s get some input text to analyze, in both English and French:"),Object(o.b)("pre",null,Object(o.b)("code",Object(r.a)({parentName:"pre"},{className:"language-csharp"}),'var text = "Did the Quick Brown Fox jump over the Lazy Dog?";\nvar text_fr = "Le Fox brune rapide a-t-il saut\xe9 sur le chien paresseux?";\n')),Object(o.b)("p",null,"Next, let\u2019s write a generic method which takes some text and a Lucene analyzer, and runs the text through the analyzer:"),Object(o.b)("pre",null,Object(o.b)("code",Object(r.a)({parentName:"pre"},{className:"language-csharp"}),'private static void displayTokens(Analyzer analyzer, string text)\n{\n    var stream = analyzer.TokenStream("content", new StringReader(text));\n    var term = stream.AddAttribute();\n    while (stream.IncrementToken())\n    {\n      Console.Write("\'" + term.Term + "\', ");\n    }\n}\n')),Object(o.b)("p",null,"Now, let\u2019s try this out on some Sitecore analyzers!"),Object(o.b)("p",null,Object(o.b)("inlineCode",{parentName:"p"},"CaseSensitiveStandardAnalyzer")," retains case, but removes punctuation and stop words (common words which offer no real value when searching)"),Object(o.b)("pre",null,Object(o.b)("code",Object(r.a)({parentName:"pre"},{className:"language-csharp"}),"displayTokens(new CaseSensitiveStandardAnalyzer(Lucene.Net.Util.Version.LUCENE_30), text);\n> 'Did', 'Quick', 'Brown', 'Fox', 'jump', 'over', 'Lazy', 'Dog'\n")),Object(o.b)("p",null,Object(o.b)("inlineCode",{parentName:"p"},"LowerCaseKeywordAnalyzer")," convers the input to lowercase, but retains the punctuation and doesn\u2019t split the input into separate words."),Object(o.b)("pre",null,Object(o.b)("code",Object(r.a)({parentName:"pre"},{className:"language-csharp"}),"displayTokens(new LowerCaseKeywordAnalyzer(), text);\n> 'did the quick brown fox jump over the lazy dog?\n")),Object(o.b)("p",null,Object(o.b)("inlineCode",{parentName:"p"},"NGramAnalyzer")," breaks text up into trigrams which are useful for autocomplete. See more here."),Object(o.b)("pre",null,Object(o.b)("code",Object(r.a)({parentName:"pre"},{className:"language-csharp"}),"displayTokens(new NGramAnalyzer(), text);\n> 'did_the_quick', 'the_quick_brown', 'quick_brown_fox', 'brown_fox_jump', 'fox_jump_over', 'jump_over_the', 'over_the_lazy', 'the_lazy_dog\n")),Object(o.b)("p",null,Object(o.b)("inlineCode",{parentName:"p"},"StandardAnalyzerWithStemming")," introduces stemming, which finds a common root for similar words (lazy, lazily, laze -> lazi)"),Object(o.b)("pre",null,Object(o.b)("code",Object(r.a)({parentName:"pre"},{className:"language-csharp"}),"displayTokens(new StandardAnalyzerWithStemming(Lucene.Net.Util.Version.LUCENE_30), text);\n> 'Did', 'the', 'Quick', 'Brown', 'Fox', 'jump', 'over', 'the', 'Lazi', 'Dog'\n")),Object(o.b)("p",null,Object(o.b)("inlineCode",{parentName:"p"},"SynonymAnalyzer")," uses a set of synonyms (in our case, defined in an XML file) to index synonyms (fast, rapid) along with the original word (quick). Read more: ",Object(o.b)("a",Object(r.a)({parentName:"p"},{href:"http://firebreaksice.com/sitecore-synonym-search-with-lucene/"}),"http://firebreaksice.com/sitecore-synonym-search-with-lucene/")),Object(o.b)("pre",null,Object(o.b)("code",Object(r.a)({parentName:"pre"},{className:"language-csharp"}),"displayTokens(new SynonymAnalyzer(new XmlSynonymEngine(\"synonyms.xml\")), text);\n> 'did', 'quick', 'fast', 'rapid', 'brown', 'fox', 'jump', 'over', 'lazy', 'dog\n")),Object(o.b)("p",null,"Lastly, we try a ",Object(o.b)("inlineCode",{parentName:"p"},"FrenchAnalyzer"),". Stop words are language specific, and so the community often contributes analyzers which will remove stop words in languages other than English. In the example below, we remove common French words."),Object(o.b)("pre",null,Object(o.b)("code",Object(r.a)({parentName:"pre"},{className:"language-csharp"}),"displayTokens(new FrenchAnalyzer(Lucene.Net.Util.Version.LUCENE_30), text_fr);\n> 'le', 'fox', 'brun', 'rapid', 't', 'saut', 'chien', 'pares'\n")),Object(o.b)("p",null,"The full code is here: ",Object(o.b)("a",Object(r.a)({parentName:"p"},{href:"https://gist.github.com/christofur/e2ea406c21bccd3b032c9b861df0749b"}),"https://gist.github.com/christofur/e2ea406c21bccd3b032c9b861df0749b")))}u.isMDXComponent=!0}}]);