---
id: xconnect_local_machine
title: Enable xConnect on a local developer machine
---

#### In this post
Example configuration files and certificate set-up steps.

#### What I wanted to do

Install xConnect alongside Sitecore XP 9.0.1 on a developer machine, in xp0 configuration. I didn’t have Powershell 5.1 installed, so had to go ahead without SIF. Yes, it was a bit of a nightmare.

#### Prerequisites

- Packages for XP Single from Sitecore Downloads
- DACPAC databases from that package installed
- xConnect IIS site from that package hosted locally (devxc.perks.com)
- Sitecore XP9 hosted locally (dev.perks.com)

#### Generate a server certificate

```csharp
New-SelfSignedCertificate -certstorelocation cert:\LocalMachine\My -dnsname *.perks.com
```

#### Generate a client certificate

```csharp
New-SelfSignedCertificate -certstorelocation cert:\LocalMachine\My -dnsname devxc.perks.com
```

#### Note down the thumbprint for later:

```csharp
Thumbprint                                Subject
----------                                -------
7E8DAE07DA298A9681D867F4B65BF4241C064A92  CN=devxc.perks.com
```

#### Export and Import

Export the client and server certificates (using Certificate Manager) and re-import them to the following locations:

- LocalMachine > Trusted Root Certification Authorities

Assign the *.perks.com certificate
Assign the *.perks.com server certificate to the IIS sites dev.perks.com and devxc.perks.com

Ensure devxc.perks.com has Require SSL [ON] and Client certificates [Accept]

#### Add certificate details to Sitecore XP Connectionstrings.config

```xml
<add name="xconnect.collection.certificate" connectionString="StoreName=My;StoreLocation=LocalMachine;FindType=FindByThumbprint;FindValue=7E8DAE07DA298A9681D867F4B65BF4241C064A92;AllowInvalidClientCertificates=true" />
<add name="xdb.referencedata.client.certificate" connectionString="StoreName=My;StoreLocation=LocalMachine;FindType=FindByThumbprint;FindValue=7E8DAE07DA298A9681D867F4B65BF4241C064A92;AllowInvalidClientCertificates=true" />
<add name="xdb.marketingautomation.reporting.client.certificate" connectionString="StoreName=My;StoreLocation=LocalMachine;FindType=FindByThumbprint;FindValue=7E8DAE07DA298A9681D867F4B65BF4241C064A92;AllowInvalidClientCertificates=true" />
<add name="xdb.marketingautomation.operations.client.certificate" connectionString="StoreName=My;StoreLocation=LocalMachine;FindType=FindByThumbprint;FindValue=7E8DAE07DA298A9681D867F4B65BF4241C064A92;AllowInvalidClientCertificates=true" />
```

#### Add certificate details to xConnect Connectionstrings.config

```xml
<add name="xconnect.collection.certificate" connectionString="StoreName=My;StoreLocation=LocalMachine;FindType=FindByThumbprint;FindValue=7E8DAE07DA298A9681D867F4B65BF4241C064A92;AllowInvalidClientCertificates=true" />
<add name="xdb.referencedata.client.certificate" connectionString="StoreName=My;StoreLocation=LocalMachine;FindType=FindByThumbprint;FindValue=7E8DAE07DA298A9681D867F4B65BF4241C064A92;AllowInvalidClientCertificates=true" />

#### Modify xConnect AppSettings.config

<add key="AllowInvalidClientCertificates" value="true" />
<add key="validateCertificateThumbprint" value="7E8DAE07DA298A9681D867F4B65BF4241C064A92" />
```

#### Restart! Restart!

Restart IIS, your machine, switch your house lights on and off a few times. Open a window.

#### Troubleshooting
Export and Import the certificates into:

- Current User > Personal
- Current User > Trusted Root Certification Authorities

Use Certificate Manager to grant Read permissions to your certificates.

Remove any non-self-signed certificates from your Local Machine > Trusted Root Certification Authorities store. Beware doing this on your work PC, as some corporate certificates may be changed.

#### Associated error messages

```csharp
FATAL [Experience Analytics]: Failed to synchronize segments. Message: Ensure definition type did not complete successfully. StatusCode: 401, ReasonPhrase: 'Invalid certificate', Version: 1.1, Content: System.Net.Http.StreamContent, Headers:
```

```csharp
Exception: System.InvalidOperationException
Message: The certificate was not found.
Source: Sitecore.Xdb.Common.Web
   at Sitecore.Xdb.Common.Web.CertificateWebRequestHandlerModifier.Process(HttpClientHandler handler)
```

```csharp
ERROR Exception when executing agent aggregation/aggregator
Exception: Sitecore.XConnect.XdbCollectionUnavailableException
Message: The HTTP response was not successful: Forbidden
Source: Sitecore.Xdb.Common.Web
```

#### Next steps
Please don’t use any of these steps in production! I’m only hacking around to get things running locally.

For further reading, check out:

- https://sitecore.stackexchange.com/questions/9413/xconnect-webapps-on-azure-paas-not-working 
- https://getfishtank.ca/en/blog/sitecore-9-xconnect-status-403-forbidden-certificate-error
- https://kamsar.net/index.php/2017/10/All-about-xConnect-Security/ 

#### Feedback

Comment here or find @perksc on Twitter. Feedback and corrections happily received.