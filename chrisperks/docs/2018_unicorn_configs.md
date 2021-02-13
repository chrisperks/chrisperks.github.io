---
id: unicorn_configs
title: Digging into Unicorn configs in Sitecore Habitat
---

Sitecore Habitat ships with Unicorn as the serialization utility of choice. Unicorn works in the background during the development of a Sitecore implementation and writes out a YAML copy of templates, renderings and other Sitecore items to disk.
You can then add these YAML (.yml) files to your version control repository, merge changes with other developers and ensure they are picked up / deployed to target environments as part of your continuous integration (CI) pipeline.

In Habitat, we bundle a Unicorn-specific configuration file with each module – in line with the Helix principle that any assets relating to a module should be bundled and deployed with that module.

If we had a feature module called ‘Car’, we’d create a config patch in `App_Config/Include/Feature called Feature.Car.Serialization.Config`

```xml
<configuration xmlns:patch="http://www.sitecore.net/xmlconfig/">
 <sitecore>
  <unicorn>
   <configurations>
    <configuration name="Feature.Car" description="Feature Car" dependencies="Foundation.*" extends="Helix.Feature">
     <rolePredicate>
      <include domain="modules" pattern="^Feature Car .*$" />
     </rolePredicate>
    </configuration>
   </configurations>
  </unicorn>
 </sitecore>
</configuration>
```

The key line setting up this configuration file is:

```xml
<configuration name="Feature.Car" description="Feature Car" dependencies="Foundation.*" extends="Helix.Feature">
```

Aside from the obvious name and description, dependencies tells Unicorn to run other configurations before this one (in our case, run any other configuration named `Foundation.*` first. Extends allows us to inherit from a parent config, Helix.Feature. This is a great feature which removes unnecessary code duplication in Helix solutions (which can have hundreds of modules!)

With this simple config (which extends the Helix.Feature abstract configuration), Unicorn will sync any Sitecore definition items under any folder called `/Feature/Car` in Sitecore. Happily, the `Helix.Feature` abstract config will ensure that Unicorn puts its `.yml` files alongside the rest of your source code for the Car module. We can track down the configuration line which determines the serialization location in `Unicorn.Helix.config`:

```xml
<configuration name="Helix.Feature" abstract="true" extends="Helix.Base">
 <predicate>
   <include name="Templates" database="master" path="/sitecore/templates/$(layer)/$(module)" />
   <include name="Renderings" database="master" path="/sitecore/layout/renderings/$(layer)/$(module)" />
   <include name="Media" database="master" path="/sitecore/media library/$(layer)/$(module)" />
  </predicate>
</configuration>
```

Read more about Unicorn configuration at [Kam’s blog](https://kamsar.net/index.php/2017/02/Unicorn-4-Part-III-Configuration-Enhancements/).