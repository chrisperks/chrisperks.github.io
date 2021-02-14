---
id: custom_solr_index
title: Create a custom Solr index in Sitecore 9
---

#### Hello there. 

Hi! So you want to create a new Solr index?

#### Yes, I think so?

It’s a great idea. You’ll be familiar with the big three, `sitecore_core_index, sitecore_master_index and sitecore_web_index`, but you don’t have to stop there! You can create individual indexes for certain content types on your site, such as Products. Smaller, more individualised indexes are easier to maintain, troubleshoot, faster to rebuild and can be faster to query.

#### Are they hard to set up?

Not as hard as you’d expect! Let’s create one now.

OK. My Solr is set up and I can access the web UI on https://solr:8983/solr/#/ – what now?

#### Let’s create the physical Solr core.

1. Find your Solr index folder for the sitecore_master_index. Mine was at `C:\solr\solr-6.6.2\server\solr\sitecore_master_index`
2. Copy this whole folder (into the same parent folder) and call it `sitecore_master_products_index`
3. Inside the `sitecore_master_products_index` folder, open up the core.properties file and change the name property to read `sitecore_master_products_index`
4. Restart Solr (I use the solr stop and solr start commands – see below)
5. Now, go to `https://solr:8983/solr/#/` and check out your cores – you will have a new one!

Awesome, it’s there. So I get that we copied the sitecore_master_index and renamed it to `sitecore_master_products_index` – and in Solr I can see that it contains thousands of documents already, copied from `sitecore_master_index`. How do I clean things up?

Well, good question. We want to delete all of the existing items in this index and start afresh. You can do this via a web browser – just call this URL:

```csharp
https://solr:8983/solr/sitecore_master_products_index/update?commit=true&stream.body=<delete><query>*:*</query></delete>
```

Radical. Everything is deleted. Soo. I want to use this index to only contain certain types of content from Sitecore. How do I configure it properly?

We need to just add a single configuration file to Sitecore. It’s below. It looks mostly like the configuration file for `sitecore_master_index`, but we change two important things, (a) which template types we want to include in our index and (b) which field types we want to include in our index. In your real solution, this will take a bit of time to set up, but being selective is the whole point of creating a custom index, and you’ll want to keep it as trim as possible.

Here’s the whole config file, which I’ve called `Sitecore.ContentSearch.Solr.Index.Master.Products.config`:

```xml
<?xml version="1.0" encoding="utf-8" ?>
<configuration xmlns:patch="http://www.sitecore.net/xmlconfig/" xmlns:role="http://www.sitecore.net/xmlconfig/role/" xmlns:search="http://www.sitecore.net/xmlconfig/search/">
  <sitecore role:require="Standalone or ContentManagement" search:require="solr">
    <contentSearch>
      <configuration type="Sitecore.ContentSearch.ContentSearchConfiguration, Sitecore.ContentSearch">
        <indexes hint="list:AddIndex">
          <index id="sitecore_master_products_index" type="Sitecore.ContentSearch.SolrProvider.SolrSearchIndex, Sitecore.ContentSearch.SolrProvider">
            <param desc="name">$(id)</param>
            <param desc="core">$(id)</param>
            <param desc="propertyStore" ref="contentSearch/indexConfigurations/databasePropertyStore" param1="$(id)" />
              <configuration ref="contentSearch/indexConfigurations/defaultSolrIndexConfiguration">
                  <documentOptions type="Sitecore.ContentSearch.SolrProvider.SolrDocumentBuilderOptions, Sitecore.ContentSearch.SolrProvider">
                      <indexAllFields>false</indexAllFields>

                      <!-- Included fields -->
                      <include hint="list:AddIncludedField">
                          <ProductName>{E676F36E-B0E0-4BE5-998A-329A8F9055FD}</ProductName>
						  <LongDescription>{8A978A2E-0E7A-4415-9163-2F4ECF85A3AB}</LongDescription>
                      </include>

                      <!-- Included templates -->
                      <include hint="list:AddIncludedTemplate">
                          <Product>{665DC431-673A-4D63-B9A6-00EB148E693C}</Product>
                      </include>

                  </documentOptions>
              </configuration>
            <strategies hint="list:AddStrategy">
              <strategy ref="contentSearch/indexConfigurations/indexUpdateStrategies/syncMaster" />
            </strategies>
            <locations hint="list:AddCrawler">
              <crawler type="Sitecore.ContentSearch.SitecoreItemCrawler, Sitecore.ContentSearch">
                <Database>master</Database>
                <Root>/sitecore</Root>
              </crawler>
            </locations>
            <enableItemLanguageFallback>false</enableItemLanguageFallback>
            <enableFieldLanguageFallback>false</enableFieldLanguageFallback>
          </index>
        </indexes>
      </configuration>
    </contentSearch>
  </sitecore>
</configuration>
```

The two bits you’ll need to replace here are the bits commented as Included Fields and Included Templates:

```xml
<!-- Included fields -->
<include hint="list:AddIncludedField">
  <ProductName>{E676F36E-B0E0-4BE5-998A-329A8F9055FD}</ProductName>
  <LongDescription>{8A978A2E-0E7A-4415-9163-2F4ECF85A3AB}</LongDescription>
</include>

<!-- Included templates -->
<include hint="list:AddIncludedTemplate">
  <Product>{665DC431-673A-4D63-B9A6-00EB148E693C}</Product>
</include>
```

OK, done. I’ve added my list of templates, and fields here. So, can I reindex now and see my new content?

Absolutely. Go into `Sitecore > Control Panel > Indexing Manager`, find your index and rebuild it.

When you’re done, go back to the Solr UI and see your documents! If things didn’t go quite to plan, check in your site `Crawling.log`, which will contain any indexing errors.

#### Production ready?

Well, not quite. You might want to create a `sitecore_web_products_index` and use the `Sitecore.ContentSearch.Solr.Index.Web.config` configuration file as an example of how to register it in Sitecore. Using Sitecore’s conventions for master and web keep the surprises to a minimum.

Search on, pals!