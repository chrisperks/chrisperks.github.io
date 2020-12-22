---
id: finding_action_name_from_mvc_processor
title: Finding the current Action name from an MVC pipeline processor
---

Sitecore provides two pipeline hooks for tapping into an `Action` method at point of execution:

- `mvc.actionExecuting`
- `mvc.actionExecuted`

These follow standard MVC naming conventions – `actionExecuting` fires before your Action method executes, and `actionExecuted` fires afterwards.

A process hooking into actionExecuting looks something like this:

```csharp
public class LogActionExecuting
{
    public void Process(ActionExecutingArgs args)
    {
        //Something here
    }
}
```


At this point, it might be useful to get some information about the `Action` we’re executing, or the Controller it belongs to. Sitecore allows us to access the MVC `ActionDescriptor` and `ControllerDescriptor` objects, which contain plenty of information about our `Action` and `Controller`.

```csharp
public class LogActionExecuting
{
    public void Process(ActionExecutingArgs args)
    {
        //Some interesting items from the Action
        var actionName = args.Context.ActionDescriptor.ActionName;
        var actionAttributes = args.Context.ActionDescriptor.GetCustomAttributes(false);
           
        //Some interesting items from the Controller
        var controllerName = args.Context.ActionDescriptor.ControllerDescriptor.ControllerName;
        var controllerType = args.Context.ActionDescriptor.ControllerDescriptor.ControllerType;
        var controllerActions = args.Context.ActionDescriptor.ControllerDescriptor.GetCanonicalActions();
 
        //args.Context.ActionDescriptor.Execute(..);
 
    }
}
```

The last line is commented out, as executing the action from within itself may cause the universe to implode. Maybe.

Happy hacking!