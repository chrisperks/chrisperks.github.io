---
id: 2018_solr_error
title: Sitecore Solr Error - Processing Field Name. Resolving Multiple Field found on Solr Field Map. No matching template field on index field name, return type ‘String’ and field type ”
---

After an upgrade to Sitecore 9, our Sitecore search logs were filled with thousands of warnings, like the below:

```xml
WARN Processing Field Name : Overview Text. Resolving Multiple Field found on Solr Field Map. No matching template field on index field name 'overview_text', return type 'String' and field type ''
```

#### What’s the fix?

You need to add field mappings for each of the fields in your Solr index. In our case, we had no mapping for ‘overview_text’, so Sitecore / Solr didn’t know how to treat the field. Add a config patch and specify a returnType for the fields you see as warnings in the log:

```xml
<configuration xmlns:patch="http://www.sitecore.net/xmlconfig/" xmlns:role="http://www.sitecore.net/xmlconfig/role/" xmlns:search="http://www.sitecore.net/xmlconfig/search/">
  <sitecore>
    <contentSearch>
      <indexConfigurations>
        <defaultSolrIndexConfiguration>
          <fieldMap>
            <fieldNames hint="raw:AddFieldByFieldName">
              <field fieldName="overview_text" returnType="text" />
            </fieldNames>
          </fieldMap>
        </defaultSolrIndexConfiguration>
      </indexConfigurations>
    </contentSearch>
  </sitecore>
</configuration>
```

#### ** UPDATE 25/01/2018 **

While the above is suitable for adding a few fields, having hundreds or thousands of fields in your Solr index will lead to having to maintain lots of the above configuration entries. I raised a ticket with Sitecore, and was told “We registered this behavior as a bug with the reference #​195567”. Sitecore’s suggested workaround is to add a log4Net filter which will stop the problematic entries from reaching the log. For example:

```xml
<!-- Filter out Solr log warnings-->
    <log4net>
      <appender name="SearchLogFileAppender">
        <filter type="log4net.Filter.StringMatchFilter">
          <regexToMatch  value="Resolving Multiple Field found on Solr Field Map. No matching solr search field configuration on index field name|Search field name in Solr with Template Resolver is returning no entry|Resolving Multiple Field found on Solr Field Map. No matching template field on index field name|Solr with Template Resolver is returning multiple entry|is being skipped. Reason: No Field Type Name" />
          <acceptOnMatch value="false" />
        </filter>
      </appender>
    </log4net>
```

Hopefully a proper fix or configuration guidance will be released at some point.