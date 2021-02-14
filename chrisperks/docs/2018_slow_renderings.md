---
id: slow_renderings
title: Hundreds of renderings? Your first-page-load could be sloooow
---

#### In this post

Having many subfolders of MVC views could impact page-load time.

#### Helix-style Feature folders
In a Helix-style solution, it’s common to group your MVC views by feature:

```csharp
 /Views/Navigation/Nav.cshtml
 /Views/Navigation/Secondary/SecondaryNav.cshtml
 /Views/News/Headlines.cshtml
 /Views/News/Ticker/NewsTicker.cshtml
```

Large solutions may see 50, 60, 70+ MVC views making up a single page. If these views are in separate subfolders, we’ve noticed a performance penalty.

#### Just Helix-style solutions?

No, definitely not. Any solution with many views in many subfolders. Sitecore or no-Sitecore.

#### When will this affect me?

Each time you deploy to a new folder (ie, D:\Web\Octopus-1.2.3.4\), a new Temporary ASP.NET Files folder is populated with JIT-compiled versions of your .cshtml files. Typically you can see slow first-page-load times after a new deployment.

#### The technical details

Shout out: Oleg Volkov’s blog details what is going on here: https://ogvolkov.wordpress.com/2017/02/28/slow-asp-net-mvc-website-startup-in-case-of-many-view-folders/. Thanks, Oleg!

The System.Web.Compilation.BuildManager class (https://referencesource.microsoft.com/#System.Web/Compilation/BuildManager.cs,1662) contains a method, CompileWebFile(..), which JIT compiles your .cshtml files. In a handy performance boost, CompileWebFile(..) will batch this compilation, working on an entire directory at a time. This means that having 100 views in a single directory will compile a lot faster than having 100 views in 100 directories.

#### How much slower?

We did some strikingly unscientific testing by including 400 Partial Views on a page.

##### 400 Views in 1 Folder

```csharp
 @Html.Partial("~/Views/A/001.cshtml")
 @Html.Partial("~/Views/A/002.cshtml")
 ...
 @Html.Partial("~/Views/A/400.cshtml")
```

- Create new directory, deploy to this directory
- IIS Reset
- First page load: 58s

##### 400 Views in 40 Folders

```csharp
 @Html.Partial("~/Views/B/1/001.cshtml")
 @Html.Partial("~/Views/B/1/002.cshtml")
 ...
 @Html.Partial("~/Views/E/10/010.cshtml")
```

- Create new directory, deploy to this directory
- IIS Reset
- First page load: 3m26s

#### What’s the solution?

We went with MVC View precompilation (using https://github.com/StackExchange/StackExchange.Precompilation) because moving all .cshtml files to a single directory wasn’t a viable option. This brings the compilation time back down for us, and first-page-load after a deployment is now under 1 minute (previously 7+!).