---
id: load_sitecore_yaml_into_terraform
title: Loading Sitecore 10 Kubernetes specifications from Terraform for turbocharged CI/CD
---

`Feb 2021`

Since the advent of **Sitecore 10**, more and more of us are shifting our deployments toward **Docker** and **Kubernetes**. Not only can running containers reduce costs, but we can now take advantage of a rich ecosystem of DevOps tools to automate the heavy lifting involved in deployments. 

:::info
In this blog post, we look at different ways to integrate Sitecore Kubernetes manifests and Terraform
:::

### Introducing Terraform

Many organisations have embraced Infrastructure as Code (IAC) - tracking cloud (and less frequently, on-prem) infrastructure assets in version control and putting in place an automated, testable and auditable change workflow. 

[Terraform](https://www.terraform.io/) is the leading IAC tool which provides a description language for your infrastructure, and a powerful CLI to drive creation and management of your cloud services, networks, security policies, serverless functions and just about everything else. All of the main cloud vendors (Azure, AWS, Google Cloud) are supported, and engineers can create custom providers to ensure their service provider is covered. 

### Terraform and Sitecore Kubernetes

Sitecore provides [official Kubernetes manifests](https://github.com/Sitecore/container-deployment/releases) - that is - descriptions of workloads to run within your cluster. These workloads correspond to the server roles you're familiar with - `Content Delivery`, `Content Management`, `Solr`, and so on. 

Terraform can be used to deploy these workloads to your cluster - which is great if you're already invested in Terraform and have existing deployment pipelines you wish to extend to cover your Sitecore deployments. 

Kubernetes manifests are in `.yaml` format - but Terraform uses the [Hashicorp Configuration Language (HCL)](https://www.terraform.io/docs/language/syntax/configuration.html) - so, how can we get Terraform to read our Sitecore Kubernetes `.yaml` files?

### Three ways to read the Sitecore Kubernetes manifests from your Terraform configurations

Let's work with the `cd.yaml` manifest ([you can download this from Sitecore](https://github.com/Sitecore/container-deployment/releases), along with manifests for other roles)

```yaml title="sitecore-kubernetes-manifests/cd.yaml"
apiVersion: v1
kind: Service
metadata:
  name: cd
spec:
  selector:
    app: cd
  ports:
  - protocol: TCP
    port: 80
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: cd
  labels:
    app: cd
spec:
  replicas: 1
  selector:
    matchLabels:
      app: cd
  template:
    metadata:
      labels:
        app: cd
    spec:
      nodeSelector:
        kubernetes.io/os: windows
      containers:
      - name: sitecore-xm1-cd
        image: scr.sitecore.com/sxp/sitecore-xm1-cd:10.0-ltsc2019
        ports:
        - containerPort: 80
        env:
        - name: Sitecore_InstanceName
          valueFrom:
            fieldRef:
              fieldPath: metadata.name
        - name: Database_Server
          valueFrom:
            secretKeyRef:
              name: sitecore-database
              key: sitecore-databaseservername.txt
        - name: Core_Database_Username
          valueFrom:
            secretKeyRef:
              name: sitecore-database
              key: sitecore-core-database-username.txt
        - name: Core_Database_Password
          valueFrom:
            secretKeyRef:
              name: sitecore-database
              key: sitecore-core-database-password.txt
        - name: Web_Database_Username
          valueFrom:
            secretKeyRef:
              name: sitecore-database
              key: sitecore-web-database-username.txt
        - name: Web_Database_Password
          valueFrom:
            secretKeyRef:
              name: sitecore-database
              key: sitecore-web-database-password.txt
        - name: Forms_Database_Username
          valueFrom:
            secretKeyRef:
              name: sitecore-database
              key: sitecore-forms-database-username.txt
        - name: Forms_Database_Password
          valueFrom:
            secretKeyRef:
              name: sitecore-database
              key: sitecore-forms-database-password.txt
        - name: Sitecore_License
          valueFrom:
            secretKeyRef:
              name: sitecore-license
              key: sitecore-license.txt
        - name: Sitecore_ConnectionStrings_Security
          value: Data Source=$(Database_Server);Initial Catalog=Sitecore.Core;User ID=$(Core_Database_Username);Password=$(Core_Database_Password);
        - name: Sitecore_ConnectionStrings_Web
          value: Data Source=$(Database_Server);Initial Catalog=Sitecore.Web;User ID=$(Web_Database_Username);Password=$(Web_Database_Password);
        - name: Sitecore_ConnectionStrings_ExperienceForms
          value: Data Source=$(Database_Server);Initial Catalog=Sitecore.ExperienceForms;User ID=$(Forms_Database_Username);Password=$(Forms_Database_Password);
        - name: Sitecore_ConnectionStrings_Solr.Search
          valueFrom:
            secretKeyRef:
              name: sitecore-solr
              key: sitecore-solr-connection-string.txt
        - name: Sitecore_ConnectionStrings_Redis.Sessions
          value: redis:6379,ssl=False,abortConnect=False
        - name: SOLR_CORE_PREFIX_NAME
          valueFrom:
            secretKeyRef:
              name: sitecore-solr
              key: sitecore-solr-core-prefix-name.txt
        livenessProbe:
          httpGet:
            path: /healthz/live
            port: 80
            httpHeaders:
            - name: X-Kubernetes-Probe
              value: Liveness
          timeoutSeconds: 300
          periodSeconds: 30
          failureThreshold: 3
        startupProbe:
          httpGet:
            path: /healthz/ready
            port: 80
            httpHeaders:
            - name: X-Kubernetes-Probe
              value: Startup
          timeoutSeconds: 300
          periodSeconds: 30
          failureThreshold: 10
      imagePullSecrets:
      - name: sitecore-docker-registry
```

### #1 - tfk8s

[tfk8s](https://github.com/jrhouston/tfk8s) is a tool which converts Kubernetes `.yaml` manifests into HCL, ready for use in Terraform. 

1. The tool is written in Go, so you will need to [install Go](https://golang.org/dl/) first. 
2. Clone `https://github.com/jrhouston/tfk8s` and run make install
3. Now, you can run the tool to get a deployable Terraform configuration: 

```
tfk8s -f cd.yaml -o cd.tf
```


### #2 - The kubectl Terraform provider

As we know from manually deploying Sitecore to Kubernetes, the `kubectl` tool is indispensable. Luckily, we can execute `kubectl` commands in our Terraform jobs by using the [Terraform kubectl provider](https://github.com/gavinbunney/terraform-provider-kubectl). 

```yaml title="sitecore-kubernetes-manifests/main.tf"
terraform {
  required_providers {
    kubectl = {
      source  = "gavinbunney/kubectl"
      version = ">= 1.7.0"
    }
  }
}
provider "kubectl" {}
```

Once imported, you can embed manifest code directly in your Terraform configuration: 

```yaml title="sitecore-kubernetes-manifests/main.tf"
resource "kubectl_manifest" "sitecore_cd" {
    yaml_body = <<YAML
apiVersion: apps/v1
kind: Deployment
metadata:
  name: cd
  labels:
    app: cd
spec:
  replicas: 1
  selector:
    matchLabels:
      app: cd
  template:
    metadata:
      labels:
        app: cd
    spec:
      nodeSelector:
        kubernetes.io/os: windows
      containers:
      - name: sitecore-xm1-cd
        image: scr.sitecore.com/sxp/sitecore-xm1-cd:10.0-ltsc2019
    ...
YAML
}
```

### #3 - The kubectl Terraform provider with multiple files

The above approach of directly embedding your manifest in Terraform configuration is a bit clumsy and for even an `XM1` topology, we have 6+ separate manifest files. 

To ensure our Terraform configuration stays lean and easy to manage, we can leave our manifest code as `.yaml` files, and just reference those files from Terraform. 

This approach is by far my favourite and feels cleanest. It again uses the excellent [Terraform kubectl provider](https://github.com/gavinbunney/terraform-provider-kubectl). 

```yaml title="sitecore-kubernetes-manifests/main.tf"
terraform {
  required_providers {
    kubectl = {
      source  = "gavinbunney/kubectl"
      version = ">= 1.7.0"
    }
  }
}
provider "kubectl" {}
```

For the `XM1` external manifests, we use the following configuration: 

```yaml title="sitecore-kubernetes-manifests/main.tf"
data "kubectl_path_documents" "external" {
    pattern = "external/*.yaml"
}

resource "kubectl_manifest" "external" {
    count     = length(data.kubectl_path_documents.external.documents)
    yaml_body = element(data.kubectl_path_documents.external.documents, count.index)
}
```

Here, `kubectl_path_documents.external` creates a list of files, looking in the external subdirectory for any `.yaml` files. 

`kubectl_manifest.external` creates a manifest resource, by loading and merging all of the `.yaml` files in the `external/` subdirectory. 

We can follow the same approach for the other Sitecore manifests: 

```yaml title="sitecore-kubernetes-manifests/main.tf"
data "kubectl_path_documents" "init" {
    pattern = "init/*.yaml"
}

resource "kubectl_manifest" "init" {
    count     = length(data.kubectl_path_documents.init.documents)
    yaml_body = element(data.kubectl_path_documents.init.documents, count.index)
}

data "kubectl_path_documents" "sitecore" {
    pattern = "./*.yaml"
}

resource "kubectl_manifest" "sitecore" {
    count     = length(data.kubectl_path_documents.sitecore.documents)
    yaml_body = element(data.kubectl_path_documents.sitecore.documents, count.index)
}

data "kubectl_path_documents" "ingress" {
    pattern = "ingress-nginx/ingress.yaml"
}

resource "kubectl_manifest" "ingress" {
    count     = length(data.kubectl_path_documents.ingress.documents)
    yaml_body = element(data.kubectl_path_documents.ingress.documents, count.index)
}
```

Have fun and let me know if you're working with Sitecore and Terraform. I'm on Sitecore Chat Slack!