---
id: sitecore_mvc_internals
title: Sitecore MVC Internals - IControllerActivator
---

When we previously looked into `IControllerFactory` implementations in both Sitecore MVC and standard ASP.NET MVC, we noticed that Microsoft’s default `IControllerFactory` implementation, `DefaultControllerFactory`, doesn’t actually handle the instantiation of new IController instances. To enable dependency injection at the point of object creation, `DefaultControllerFactory` hands off instantiation of `IController` objects to another player – an object which implements `IControllerActivator`.

### How we call an IControllerActivator implementation

Let’s look back at the code for the `GetControllerInstance` method of Microsoft’s `DefaultControllerFactory` class (see previous post for a more in-depth discussion)

```csharp
protected internal virtual IController GetControllerInstance(RequestContext requestContext, Type controllerType)
{
    //...
    return this.ControllerActivator.Create(requestContext, controllerType);
}
```

This method crucially takes in the Type of a controller, which we have determined by looking carefully at the requested URL and matching it to a known route. We see that `DefaultControllerFactory` already has an implementation of `IControllerActivator` to work with, referenced by `this.ControllerActivator`.

### What is Microsoft’s default implementation?

In standard ASP.NET MVC sites, this implementation is Microsoft’s `DefaultControllerActivator`. Let’s look at the `DefaultControllerActivator`.Create() method in full:

```csharp
public IController Create(RequestContext requestContext, Type controllerType)
{
    try{
            return (IController) (this._resolverThunk().GetService(controllerType) ?? Activator.CreateInstance(controllerType));
    }
    catch (Exception ex)
    {
            throw new InvalidOperationException(string.Format((IFormatProvider) CultureInfo.CurrentCulture, MvcResources.DefaultControllerFactory_ErrorCreatingController, new object[1]{(object) controllerType}), ex);
    }
}
```

Ignoring boilerplate, the line we’re left with is:

```csharp
(IController) (this._resolverThunk().GetService(controllerType) ?? Activator.CreateInstance(controllerType));
```

Don’t be discouraged by the odd looking `_resolverThunk()`. This is a reference to the chosen Dependency Resolver for your project. Remembering that ASP.NET MVC was built for extendability at every point, a Dependency Resolver lets us have full control over how any object is created – typically using a Dependency Injection framework. We’ll look at Dependency Resolvers in a future post.

Back to the line above. If you have a Dependency Resolver in place, the `GetService()` method will use this resolver to return an instance of the IController you need to fulfil the request. If not, we fall back to good old `Activator.CreateInstance()`, which is the .NET frameworks vanilla way of creating new objects at runtime.

Does Sitecore implement `IControllerActivator`?

No, Sitecore doesn’t utilise `IControllerActivator`. There’s a simple reason – once Sitecore has determined the type of Controller you would like to create, it hands off the job of creating the controller to the `mvc.createController` Pipeline:

```csharp
IController controller = PipelineService.Get().RunPipeline<CreateControllerArgs, IController>(“mvc.createController”, 
        new CreateControllerArgs(requestContext, controllerName), 
        (Func<CreateControllerArgs, IController>) (args => args.Result));
```

That’s it for `IControllerActivator`, happy hacking!
