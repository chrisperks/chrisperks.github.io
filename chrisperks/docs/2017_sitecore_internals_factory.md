---
id: sitecore_mvc_internals_factory
title: Sitecore MVC internals - SitecoreControllerFactory
---

In this post, the first in a series of posts looking into the internals of Sitecore MVC, we’ll be looking at the `SitecoreControllerFactory` class in detail.

### What does SitecoreControllerFactory do?

This class, provided by Sitecore in the `Sitecore.Mvc.Controllers` namespace, is responsible for creating an instance of an MVC controller, used by Sitecore for turning a HTTP request (for say, `/products/12345`) into a HTML response, rendered by the browser.

The concept of a Controller Factory is not specific to Sitecore, and is one of the mechanics of the wider ASP.NET MVC framework. Let’s look at the signature for this class.

```csharp
public class SitecoreControllerFactory : IControllerFactory
```

Here we’re seeing a Sitecore class, `SitecoreControllerFactory`, implement an interface, `IControllerFactory`, which belongs to the wider ASP.NET MVC framework. `IControllerFactory` defines one method we’re interested in here:

```csharp
public interface IControllerFactory
{
    IController CreateController(RequestContext requestContext, string controllerName);
    //..others
}
```

This means that `SitecoreControllerFactory` must implement a method called `CreateController`. Similarly, any non-Sitecore sites you build using ASP.NET MVC will likely use the built-in `DefaultControllerFactory` class that Microsoft provide for you. It’s happening behind the scenes, and unless you needed to do some heavy customisation to your project, you may not have noticed. Before we get back to Sitecore, let’s look at Microsoft’s implementation of `CreateController`, in their vanilla `IControllerFactory` implementation, `DefaultControllerFactory`:

```csharp
public class DefaultControllerFactory : IControllerFactory
{
    //.. snipped
    public virtual IController CreateController(RequestContext requestContext, string controllerName)
    {
      //.. snipped
      Type controllerType = this.GetControllerType(requestContext, controllerName);
      return this.GetControllerInstance(requestContext, controllerType); 
    }
}
```

So, Microsoft’s default `CreateController` implementation returns a `Controller` object. How does this method know which `Controller` you want? Well, we break it up into two steps. First, we pass a controller name (such as ‘Products’) to the method. This name is taken from the route data extracted from our request to `/products/12345`. This controller name is passed to the `GetControllerType` method, which finds the appropriate Controller Type.

Secondly, we pass this Type to another method, `GetControllerInstance`, which handles the actual instantiation of the new Controller object, which we’ll eventually return. `GetControllerInstance` makes use of another MVC feature called `Activators`, which we’ll handle in another blog post.

So why do we need all of these steps, just to instantiate a `Controller` object?

ASP.NET MVC was built with a few design goals in mind – mainly testability and extensibility. One way of achieving these goals was to include wide support for dependency injection. In short – each of these steps can be replaced with our implementation, should we need to. And handily, that brings us back to Sitecore.

### Back to Sitecore

Now we know that ASP.NET MVC makes it easy for us to replace any of the default behaviour for our own, bespoke implementations, we can look at one instance of where Sitecore have done exactly that. Sitecore’s `SitecoreControllerFactory` class implements `IControllerFactory`, and is used in place of Microsoft’s `DefaultControllerFactory`.

Let’s look at `SitecoreControllerFactory’s` `CreateController` method:

```csharp
public virtual IController CreateController(RequestContext requestContext, string controllerName)
{
    //snipped
    IController controllerInstance = this.CreateControllerInstance(requestContext, controllerName);
    this.PrepareController(controllerInstance, controllerName);
    return controllerInstance;
}
```

This method doesn’t do much more than call two other methods – `CreateControllerInstance` and `PrepareController`. The main work we’re interested in here is in `CreateControllerInstance`, so let’s follow along that thread:

```csharp
protected virtual IController CreateControllerInstance(RequestContext requestContext, string controllerName)
{
    if (controllerName.EqualsText(this.SitecoreControllerName))
    return this.CreateSitecoreController(requestContext, controllerName);

    if (TypeHelper.LooksLikeTypeName(controllerName))
    {
        Type type = TypeHelper.GetType(controllerName);
        if (type != (Type)null)
            return TypeHelper.CreateObject(type);
        }

    return this.InnerFactory.CreateController(requestContext, controllerName);
}
```

So, there are three ways in which Sitecore can choose to instantiate a `Controller`! This seems a little more involved than Microsoft’s default implementation, but this is Sitecore, so that seems reasonable. Let’s follow down the path of `CreateSitecoreController`.

```csharp
protected virtual IController CreateSitecoreController(RequestContext requestContext, string controllerName)
{
    IController controller = PipelineService.Get().RunPipeline("mvc.createController", 
        new CreateControllerArgs(requestContext, controllerName), 
        (Func)(args => args.Result));
}
```

Ok! We’re now back firmly in Sitecore territory. Here’s where we branch from the way vanilla ASP.NET MVC does things, and how Sitecore handles things. Just like in standard ASP.NET MVC, we have a request context and a `Controller` name. However, instead of handing it off to `GetControllerInstance` as we did in `DefaultControllerFactory`, we call upon a Sitecore Pipeline, called `mvc.createController`.

This pipeline handles the instantiation of `Controller` objects by pulling some relevant details from Sitecore:

```csharp
string controllerName = ((BaseItem) item).get_Item("__Controller");

string actionName = ((BaseItem) item).get_Item("__Controller Action");
```


Finally, we know which `Controller` should be used for the Sitecore item being requested (remember? `/Products/12345`). To handle the actual instantiation of the item, Sitecore gives us two ways to do this, both called from the `mvc.createController` pipeline:

```csharp
IController CreateControllerUsingFactory()

IController CreateControllerUsingReflection()
```

The difference? Well, we can actually invoke another `IControllerFactory` instance to do the creation work for us. Think of this as Sitecore playing nicely – the `SitecoreControllerFactory` does only what it needs to, retrieving the details of which controller we need; it then relinquishes control of the actual instantiation of that controller to any other `IControllerFactory` you want to use. Sitecore wraps this detail up in a `ControllerSpecification`, however we’ll leave it there for now. This is something we’ll address in another post.

If no `ControllerSpecification` is given, then we can fall back to good old Reflection to create our instance.

I hope you’ve enjoyed this peek into the workings of Sitecore MVC. There’s plenty more to be discovered, so happy digging!