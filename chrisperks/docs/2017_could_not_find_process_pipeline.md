---
id: could_not_find_process_pipeline
title: Error - Could not find method Process.Pipeline
---

When adding custom pipeline processors, you may come across the error:

```
Could not find method: Process. Pipeline: /sitecore[database="SqlServer" xmlns:patch="http://www.sitecore.net/xmlconfig/"]/pipelines/mvc.resultExecuting[patch:source="Sitecore.Mvc.config"]/processor[type="SitecoreCustom.Feature.Logging.LifecycleLogger.Pipelines.ActionExecuting.LogActionExecuting, SitecoreCustom.Feature.Logging.LifecycleLogger" patch:source="Feature.LifecycleLogger.config"]
Description: An unhandled exception occurred.
```

There are two usual culprits to check.

1. Did you reference the correct class and assembly, in your pipeline configuration? A typo here will mean that the processor cannot be found.
2. Are you sending in the correct typed arguments? Each pipeline requires a specific typed argument object, such as InitializeContainerArgs. If I expect the wrong args type for my chosen pipeline, Sitecore will consider the Process method invalid and will skip it.
 
These are both really easy mistakes to make, and hard to spot where you might be going wrong, as everything will compile fine.