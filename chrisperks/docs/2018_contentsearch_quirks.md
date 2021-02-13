---
id: contentsearch_quirks
title: Sitecore 9 - ContentSearch Solr query quirks with spaces and wildcards
---

Sitecore provides a Linq powered `IQueryable` mechanism with which you can build powerful search queries. Your query will be translated into a native query for your underlying search engine (eg. Solr). There are some odd quirks (bugs?) with this translation in Sitecore 9.0 and 9.0.1 when your search term includes a space. Let’s take a look.

In the below examples, context is an instance of `IProviderSearchContext`, which you’d typically wire up with dependency injection. In each case, we’re looking to query something from the index based the item’s path in the Sitecore tree.

#### Querying on exact matches:

```csharp
context.GetQueryable().Where(x => x.Path == "Hello");
 Translates to: {_fullpath:(Hello)}
 ```

Ok! This makes sense.

```csharp
context.GetQueryable().Where(x => x.Path == "Hello World");
 Translates to: {_fullpath:("Hello World")}
```

Notice that if your query term has a space, we need to wrap the term in quotes.

```csharp
context.GetQueryable().Where(x => x.Path == "\\Hello");
 Translates to: {_fullpath:(\\Hello)}
```

Backslash? No problem.

```csharp
context.GetQueryable().Where(x => x.Path == "/Hello");
 Translates to: {_fullpath:(\/Hello)}
```

Forwardslash? We need to escape that with a `‘\’`

```csharp
context.GetQueryable().Where(x => x.Path == "\\Hello World");
 Translates to: {_fullpath:("\\Hello World")}
```

Backslash with space? No problem, just add the quotes.

```csharp
context.GetQueryable().Where(x => x.Path == "/Hello World");
 Translates to: {_fullpath:("\/Hello World")}
```
As above, we’re all good, the forwardslash is just escaped.

Querying on partial matches – where things get interesting:

```csharp
context.GetQueryable().Where(x => x.Path.Contains("Hello"));
 Translates to: {_fullpath:(*Hello*)}
```

All good. Here, we wrap our search term in a wildcard, `*`

```csharp
context.GetQueryable().Where(x => x.Path.Contains("Hello World"));
 Translates to: {_fullpath:("\*Hello\\ World\*")}
```

Uh oh! Something weird has happened. The quotes and wildcard seem to have got mixed up, and we’ve ended up with something which won’t return the results we want. Having read more about wildcard / space combinations here , we probably want to end up with something simpler, like `{_fullpath:(*Hello\ World*)}`

```csharp
context.GetQueryable().Where(x => x.Path.Contains("\\Hello"));
 Translates to: {_fullpath:(*\\Hello*)}
```

No problem with this partial match, as we don’t have a space to deal with.

```csharp
context.GetQueryable().Where(x => x.Path.Contains("/Hello"));
 Translates to: {_fullpath:(*\/Hello*)}
```

Again, fine.

```csharp
context.GetQueryable().Where(x => x.Path.Contains("\\Hello World"));
 Translates to: {_fullpath:("\*\\Hello\\ World\*")}
```

The space completely breaks everything here

```csharp
context.GetQueryable().Where(x => x.Path.Contains("/Hello World"));
 Translates to: {_fullpath:("\*\/Hello\\ World\*")}
```

and here..

#### Summary

I raised this with Sitecore and it has been raised as a bug. In the meantime – if you can get away with using StartsWith rather than Contains, you’ll find this works OK:

```csharp
context.GetQueryable().Where(x => x.Path.StartsWith("Hello World"));
 Translates to: {_fullpath:(Hello\ World*)}
```

Which is just about perfect.