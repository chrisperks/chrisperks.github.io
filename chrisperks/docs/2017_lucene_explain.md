---
id: lucene_explain
title: Explaining Lucene explain
---

Each time you perform a search using Lucene, a score is applied to the results returned by your query.

```csharp
--------------------------------------
| #   | Score | Tags                 |
--------------------------------------
| 343 | 2.319 | Movies, Action       |
| 201 | 2.011 | Music, Classical     |
| 454 | 1.424 | Movies, Kids         |
| 012 | 0.003 | Music, Kids          |
 --------------------------------------
 ```

In our index, # is the unique document number, score is the the closeness of each hit to our query, and tags is a text field belonging to a document.

There are many methods Lucene can use to calculate scoring. By default, we use the DefaultSimilarity implementation of the Similarity abstract class. This class implements the commonly referenced TfIdf scoring formula:


(more: https://lucene.apache.org/core/3_0_3/api/core/org/apache/lucene/search/Similarity.html)

If you’re new to Lucene (or even if you’re not!) this formula can be a bit to get your head around. To get inside the formula for a given search result, Lucene provides an explanation feature, which we can call from code (c# example in Lucene.Net):

```csharp
public List GetExplainerByRawQuery(string rawQuery, int doc = 0)
{
    using (var searcher = new IndexSearcher(_directory, false))
    {
        // Create a parser, and parse a plain-text query which searches for items tagged with 'movies' or 'kids' (or hopefully, both)
        var parser = new QueryParser(Lucene.Net.Util.Version.LUCENE_30, "id", analyzer);
        var query = parser.Parse("tags:(movies OR kids)");

        // Get references to the top 25 results
        var hits = searcher.Search(query, 25).ScoreDocs;

        // For each hit, get the accompanying explanation plan. We now have a List
        var explains = hits.Select((x, i) => searcher.Explain(query, i)).ToList();

        //Clean up and return
        analyzer.Close();
        searcher.Dispose();
        return explains;
    }
}
```

Calling searcher.Explain(query, match.doc) gives us a text output explanation of how the matched document scores against the query:

```csharp
query: tags:movies|kids
```

```csharp
----------------------------------------------------
| #   | Score  | Tags                              |
----------------------------------------------------
| 127 | 2.4824 | Movies, Kids, Animation, Movies   |
----------------------------------------------------
```

```csharp
2.4824  sum of:
  1.4570  weight(tags:movies in 127) [DefaultSimilarity], result of:
    1.4570  score(doc=127,freq=2.0 = termFreq=2.0), product of:
      0.7079  queryWeight, product of:
        2.9105  idf(docFreq=147, maxDocs=1000)
        0.2432  queryNorm
      2.0581  fieldWeight in 127, product of:
        1.4142  tf(freq=2.0), with freq of:
          2.0000  termFreq=2.0
        2.9105  idf(docFreq=147, maxDocs=1000)
        0.5000  fieldNorm(doc=127)
  1.0255  weight(tags:kids in 127) [DefaultSimilarity], result of:
    1.0255  score(doc=127,freq=1.0 = termFreq=1.0), product of:
      0.7063  queryWeight, product of:
        2.9038  idf(docFreq=148, maxDocs=1000)
        0.2432  queryNorm
      1.4519  fieldWeight in 127, product of:
        1.0000  tf(freq=1.0), with freq of:
          1.0000  termFreq=1.0
        2.9038  idf(docFreq=148, maxDocs=1000)
        0.5000  fieldNorm(doc=127)

```

Ok! But still, there’s a lot going on in there. Let’s try and break it down.

- 2.4824 is the total score for this single search result. As our query contained two terms, ‘movies’ and ‘kids’, Lucene breaks the overall query down into two subqueries.
- The sum of the two subqueries (1.4570 for ‘movies’ and 1.0255 for ‘kids’) are added to arrive at our total score.

For our first subquery, the ‘movies’ part, we arrive at the score of 1.4570 by multiplying queryWeight (0.709) by fieldWeight (2.0581). Let’s go line by line:

```csharp
  1.4570  weight(tags:movies in 127) [DefaultSimilarity], result of:
```

↑ The total score for the ‘movies’ subquery is 1.4570. ‘tags:movies‘ is the raw query, 127 is the individual document number we’re examining, and DefaultSimilarity is the scoring mecahsnism we’re using.

```csharp
1.4570 score(doc=127,freq=2.0 = termFreq=2.0), product of:
```

↑ The term (‘movies‘) appears twice in the ‘tags‘ field for document 127, so we get a term frequency of 2.0

```csharp
0.7079 queryWeight, product of:
```

↑ queryWeight (0.7079) is how rare the search term is within the whole index – in our case, ‘movies‘ appears in 147 out of the 1000 documents in our index.   This normalization factor is the same for all results returned by our query and just stops the queryWeight scores from becoming too exaggerated for any single result.

```csharp
2.9105 idf(docFreq=147, maxDocs=1000)
```

 ↑ This rarity is called inverse document frequency (idf)

```csharp
0.2432 queryNorm
```

 ↑ .. and is itself multiplied by a normalization factor (0.2432) called queryNorm.
This normalization factor is the same for all results returned by our query and just stops the queryWeight scores from becoming too exaggerated for any single result.

```csharp
2.0581 fieldWeight in 127, product of:
```

 ↑ fieldWeight (2.0581) is how often the search term (‘movies‘) appears in the field we searched on ‘tags’.
```csharp
1.4142 tf(freq=2.0), with freq of:
  2.0000 termFreq=2.0
```
  ↑ We take the square root of the termFreq (2.0) = 1.4142

```csharp
2.9105 idf(docFreq=147, maxDocs=1000)
```

 ↑ This is multiplied by the idf which we calculated above (2.9105)

```csharp
0.5000 fieldNorm(doc=127)
```

 ↑  and finally by a field normalization factor (0.5000), which tells us how many overall terms were in the field.
This ‘boost‘ value will be higher for shorter fields – meaning the more promenant your search term was in a field, the more relevant the result.

#### Further reading:

http://www.lucenetutorial.com/advanced-topics/scoring.html
https://ayende.com/blog/166274/the-lucene-formula-tf-idf
Happy Lucene hacking!









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