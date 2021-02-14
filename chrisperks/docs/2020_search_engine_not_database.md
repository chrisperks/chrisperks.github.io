---
id: search_engine_not_database
title: When Does A Search Database Become A Search Engine?
---

Modern databases have a wealth of features to support the querying of text data. We can employ fuzzy search, proximity search, stemming and word-breaking to take natural language queries and return matching records with high confidence. While returning all matching records is a good start, a search engine aims to ensure the most relevant results are shown first. In a great search experience, the most relevant match to your search query should appear in the first few items. How is this achieved?

Imagine we manage a searchable catalogue of movies and TV shows:

`Schema 1.0`:

Where we search for an exact phrase, this schema does the job:

`search: lion king`

Most general databases could service a query by breaking a phrase into individual terms, searching for a match in one or more columns, and with some configuration, even support filters:

```
search : simba lion
search : africa lion
search : lion year:1994
```

However, this schema won’t do such a good job on the following natural queries:

```
search : documentaries about lions
search: 90s funny lion movies
```

For both of the above queries, we can only match the term ‘lion’—all other context given in the query is lost.

#### From Search Database To Search Engine

Search engines can deliver us greater relevancy in our search results. Out of the box, popular products such as Solr and Elasticsearch give us multi-field searching, and relevancy scoring based on Information Retrieval ranking functions such as TF/IDF or BM25. TF/IDF gives a greater score to query terms matched in shorter fields, and so:

`search: lion`

Without adding to the schema, we can fine-tune our relevancy scoring by applying a boost factor to fields we know are important. From our own searching experience, we understand that a query term matched in the ‘title’ field is a powerful signal—so we can apply a scoring boost to that field which helps these results stand out:

`Schema 1.1`

Note: in production situations, boosts are applied at query-time, rather than being fixed at index-time.

Let’s re-run the search, with boosts applied:

`search: lion`

We’ve ensured that queries matching terms in the ‘title’ field score highly. However, our other queries are still not faring so well:

```
search : documentaries about lions
search : 90s funny lion movies
```

#### Signal Modelling

At this point, we begin to push up against the limits of our current schema. No matter the config trickery, we don’t have enough descriptive information about our content to handle these natural queries. To get the best from our search engine, we can embark on a process of enriching our schema with more descriptive fields, and tuning the boosts on those fields to ensure our results fit our users’ expectations. While search indexes are typically built from a source database, we should apply some careful consideration to exactly which parts of the source data we want to include in the index. To increase the relevancy of our results, we want fewer, better-tuned index fields.

> The motivation for choosing which source fields to include in your index should be directed by understanding that search fields should each be contributing highly to a majority of searches. 

*Doug Turnbull, Modeling Signals to Build Real Semantic Search*

Signal Modelling refers to the process of choosing and applying boost (weighting) search fields, with a desire to contribute optimally to scoring.

From the list of available fields, let’s carefully pick a few:

`Schema 2.0`

Let’s create two new schema fields which will help match records to our search query:

These new fields are populated during indexing, by converting the value of an existing field to a set of new, search-friendly values:

So now, our schema looks like:

`Schema 3.0`

We now have an extremely powerful, tunable approach to search which is centred around an understanding of how heavily a field features in the natural query style of our users.

`search : 90s funny lion movies`

#### What Next?

While flexible schemas and boosting are crucial search engine features which allowed us to ensure ranking matches our user’s expectations, our understanding of the content domain and the search style of our users allowed us to pick the most appropriate fields and choose boost levels. This begins a cycle of tuning and observation, learning more about your content, watching how users are searching and ultimately how quickly they found relevant results. Observe, re-tune, re-deploy and re-observe.

A lot of work is happening in the search community to apply intelligent and self-learning algorithms to relevancy work. In September 2019, Trey Granger of [Lucidworks](https://lucidworks.com/) began work on an authoritative guide to the application of [AI techniques on search](https://www.manning.com/books/ai-powered-search).