---
id: partial_view_not_found
title: Sitecore 9  - The partial view was not found or no view engine supports the searched locations.
---




When logging into Sitecore 9 and trying to access the Launchpad (`/sitecore/shell/sitecore/client/applications/launchpad`) – you may get the following error:

```csharp
The partial view ‘/sitecore/shell/client/Speak/Layouts/Layouts/Speak-Layout.cshtml’ was not found or no view engine supports the searched locations. The following locations were searched: /sitecore/shell/client/Speak/Layouts/Layouts/Speak-Layout.cshtml
```
This is actually an easy one – make sure you have configured your site to either ContentManagement or Standalone mode. In your `Web.config`:

```csharp
<add key="role:define" value="ContentManagement" />
```

In my case – for testing, I had swapped to ContentDelivery mode and forgotten to change back.