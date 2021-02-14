---
id: solr_highlights
title: Sitecore Search Highlighting with Solr - the highlights
---

#### In this post
Examples of how to get going with search result highlighting, using the Sitecore ContentSearch API and Solr

#### What does highlighting look like?

Solr’s highlighting system is extremely powerful. A simple use-case is to show the part of the document which matched a user’s search terms. We call this part a snippet. We can even supply some HTML to wrap the matching terms:

**Search**: healthy
**Wrap with**: <em> </em>
**Snippet**: The <em>healthy</em> workplace toolkits support you either as a health care employer..

#### Code: A Basic Search

Our documents have a field called ‘Summary’. Sitecore and the ContentSearch API don’t know about this field by default, so we create a custom SearchResultItem class to include the field in our search results:

```csharp
using System;
using System.Runtime.Serialization;
using Sitecore.ContentSearch;
using Sitecore.ContentSearch.SearchTypes;

public class SearchResultWithSummary : SearchResultItem
{
    [IndexField("summary_t")]
    [DataMember]
    public virtual string Summary { get; set; }
}
```

Let’s search for any documents with the word healthy in the Summary field. Note that highlighting is currently only supported when we search directly through SolrNet, so we’ll construct the query that way.

```csharp
const string searchField = "summary_t";
const string searchValue = "healthy";

var index = ContentSearchManager.GetIndex(string.Format("sitecore_{0}_index", Sitecore.Context.Database.Name));
using (var context = index.CreateSearchContext())
{
	var results = context.Query(new SolrQueryByField(searchField, searchValue), new QueryOptions());

	foreach (var result in results)
	{
		@result.Summary
                // Results:
		// - The healthy workplace toolkits support you either as a health care employer, RCN workplace representative, employment agency or host organisation to create healthy working environments.
		// - Engaging families, communities and schools to change the outlook of a generation. The Healthy Weight Commitment Foundation is a broad-based, not-for-profit organization whose mission is to help reduce obesity.
		// - People who are homeless are more likely than the general population to have poor health. Through our Healthy Futures project, we help homeless people when they are admitted to hospital.
	}
}
```

#### Code: Let’s add highlighting!

We populate a `QueryOptions` object with a `HighlightingParameters` configuration, and pass this in when creating our query. We specify (Field) the field to include in the highlight snippet returned by Solr, (`BeforeTer`) the token to place before our matched terms, and (`AfterTerm`) the token to place after the matched terms.

```csharp
const string searchField = "summary_t";
const string searchValue = "healthy";

var queryOptions = new QueryOptions
{
	Highlight = new HighlightingParameters
	{
		Fields = new[] { searchField },
		BeforeTerm = "<em>",
		AfterTerm = "</em>"
	}
};
```

Now, let’s execute our query, passing in the `queryOptions` object. The results object we get back now contains a populated Highlights collection.

```csharp
var index = ContentSearchManager.GetIndex(string.Format("sitecore_{0}_index", Sitecore.Context.Database.Name));
using (var context = index.CreateSearchContext())
{
	var results = context.Query<SearchResultWithSummary>(new SolrQueryByField(searchField, searchValue), queryOptions);

	foreach (var result in results)
	{
		var highlights = results.Highlights[result.Fields["_uniqueid"].ToString()];

		if (highlights.Any())
		{
			<ul>
				@foreach (var highlight in highlights)
				{
					<li style="color: #696969">@result.Name</li>
					//The Healthy Workplace Toolkits
					<li>@Html.Raw(string.Join(",", highlight.Value))</li>
					// - The <em>healthy</em> workplace toolkits support you either as a health care employer, RCN workplace representative, employment agency or host organisation to create <em>healthy</em> working environments.
				}
			</ul>        
		}
	}
}
```

#### Controlling the size of the snippet

Solr allow us to pass in a parameter, `Fragsize`, to control the length of the snippet returned to us. I recommend playing around with this to suit your needs.

```csharp
var queryOptions = new QueryOptions
{
	Highlight = new HighlightingParameters
	{
		Fields = new[] { searchField },
		BeforeTerm = "<em>",
		AfterTerm = "</em>",
		Fragsize = 30
	}
};
// - The <em>healthy</em> workplace toolkits support
```
#### A choice of highlighters!

Solr supports different highlighters – take a look at the “Choosing a Highlighter” section in the Solr documentation: https://lucene.apache.org/solr/guide/6_6/highlighting.html

The newest, shiniest highlighter (which shipped with Solr 6.4) is the Unified Highlighter (https://lucene.apache.org/solr/guide/6_6/highlighting.html#Highlighting-TheUnifiedHighlighter). By using this highlighter instead, we can remove the `Fragsize` parameter and instead get back a whole sentance, containing our highlighted terms. We have to add another parameter to the `QueryOptions` object, `ExtraParams`, to tell Solr which highlighter to use:

```csharp
var queryOptions = new QueryOptions
{
	Highlight = new HighlightingParameters
	{
		Fields = new[] { searchField },
		BeforeTerm = "<em>",
		AfterTerm = "</em>"
	},
	ExtraParams = new List<KeyValuePair<string, string>>
	{
		new KeyValuePair<string, string>("hl.method", "unified")
	}
};
// - Through our <em>healthy</em> Futures project, we help homeless people when they are admitted to hospital.
```

#### Can I use Linq?

To make use of the `QueryOptions` object, we have to query directly through SolrNet. Losing our fancy ContentSearch Linq capabilities is a big deal! Here’s a not-so-great workaround to get it back. We serialize the Linq query to a string, then use it to create a native SolrNet query, attaching our QueryOptions once again.

```csharp
var query = context.GetQueryable().Where(x => x.Summary.Contains(searchValue));
var solrQuery = new SolrQuery(((IHasNativeQuery)query).Query.ToString());
var results = context.Query(solrQuery, queryOptions);
```

#### Feedback

I’d love to hear nicer ways of working with Linq and Highlighting – please let me know any work you’ve done in this area!

Full gist of this functionality here: https://gist.github.com/christofur/178b3a8ff93d6a899c00b15dcdd49966