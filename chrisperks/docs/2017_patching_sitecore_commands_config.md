---
id: patching_sitecore_commands_config
title: Patching the Sitecore Commands.config file
---

A quick tip [Mark Cassidy](http://cassidy.dk) helped me with – patching the Commands.config is something you may need to do when adding custom Sitecore ribbon buttons.

The contents of `Commands.config` get wrapped into `Web.config` when Sitecore initializes, so actually, we can patch `Commands.config` just like we would `Web.config`. The element you’re aiming for is `sitecore/commands/command`.

```xml
<configuration xmlns:patch="http://www.sitecore.net/xmlconfig/">
  <sitecore>
    <commands>
      <command name="item:clone">
        <patch:attribute name="type">ChrisPerks.Features.Ticker.Commands.CustomButton, ChrisPerks.Features.Ticker</patch:attribute>
      </command>
    </commands>
  </sitecore>
</configuration>
```

And et voila! Your `Commands.config` is patched.

