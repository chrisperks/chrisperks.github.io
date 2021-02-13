---
id: sitecore_analyzers
title: Visualising Sitecore Analyzers
---

When Sitecore indexes your content, Lucene analyzers work to break down your text into a series of individual tokens. For instance, a simple analyzer might convert input text to lowercase, split into separate words, and remove punctuation:

- input: Hi there! My name is Chris.
- output tokens: “hi”, “there”, “my”, “name”, “is”, “chris”

While this happens behind the scenes, and is usually not of too much interest outside of diagnostics or curiosity, there’s a way we can view the output of the analyzers bundled with Sitecore.

Let’s get some input text to analyze, in both English and French:

```csharp
var text = "Did the Quick Brown Fox jump over the Lazy Dog?";
var text_fr = "Le Fox brune rapide a-t-il sauté sur le chien paresseux?";
```

Next, let’s write a generic method which takes some text and a Lucene analyzer, and runs the text through the analyzer:

```csharp
private static void displayTokens(Analyzer analyzer, string text)
{
    var stream = analyzer.TokenStream("content", new StringReader(text));
    var term = stream.AddAttribute();
    while (stream.IncrementToken())
    {
      Console.Write("'" + term.Term + "', ");
    }
}
```

Now, let’s try this out on some Sitecore analyzers!

`CaseSensitiveStandardAnalyzer` retains case, but removes punctuation and stop words (common words which offer no real value when searching)

```csharp
displayTokens(new CaseSensitiveStandardAnalyzer(Lucene.Net.Util.Version.LUCENE_30), text);
> 'Did', 'Quick', 'Brown', 'Fox', 'jump', 'over', 'Lazy', 'Dog'
```

`LowerCaseKeywordAnalyzer` convers the input to lowercase, but retains the punctuation and doesn’t split the input into separate words.

```csharp
displayTokens(new LowerCaseKeywordAnalyzer(), text);
> 'did the quick brown fox jump over the lazy dog?
```

`NGramAnalyzer` breaks text up into trigrams which are useful for autocomplete. See more here.

```csharp
displayTokens(new NGramAnalyzer(), text);
> 'did_the_quick', 'the_quick_brown', 'quick_brown_fox', 'brown_fox_jump', 'fox_jump_over', 'jump_over_the', 'over_the_lazy', 'the_lazy_dog
```

`StandardAnalyzerWithStemming` introduces stemming, which finds a common root for similar words (lazy, lazily, laze -> lazi)

```csharp
displayTokens(new StandardAnalyzerWithStemming(Lucene.Net.Util.Version.LUCENE_30), text);
> 'Did', 'the', 'Quick', 'Brown', 'Fox', 'jump', 'over', 'the', 'Lazi', 'Dog'
```

`SynonymAnalyzer` uses a set of synonyms (in our case, defined in an XML file) to index synonyms (fast, rapid) along with the original word (quick). Read more: http://firebreaksice.com/sitecore-synonym-search-with-lucene/

```csharp
displayTokens(new SynonymAnalyzer(new XmlSynonymEngine("synonyms.xml")), text);
> 'did', 'quick', 'fast', 'rapid', 'brown', 'fox', 'jump', 'over', 'lazy', 'dog
```

Lastly, we try a `FrenchAnalyzer`. Stop words are language specific, and so the community often contributes analyzers which will remove stop words in languages other than English. In the example below, we remove common French words.

```csharp
displayTokens(new FrenchAnalyzer(Lucene.Net.Util.Version.LUCENE_30), text_fr);
> 'le', 'fox', 'brun', 'rapid', 't', 'saut', 'chien', 'pares'
```

The full code is here: https://gist.github.com/christofur/e2ea406c21bccd3b032c9b861df0749b