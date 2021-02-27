---
id: sitecore_10_production_aws_deploys
title: Production Sitecore 10 AWS EKS deploys - connecting VPCs
---

The next step in readying a Kubernetes-powered AWS EKS Sitecore 10 deployment for deployment is moving the data services (Solr, MS SQL) outside of the Kubernetes cluster. 

While the Kubernetes product (develops a capability)[https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/] for running stateful workloads, it is still best practice to keep Kubernetes for your stateless compute tasks, and run databases outside of the cluster. 

Options on AWS 

There are two *mainstream* options available to host your SQL Server instance on AWS. Both have pros and cons, and we'll quickly summarise here. 

AWS RDS

RDS is a managed database product. A SQL Server instance can be provisioned through the usual channels (AWS Console, AWS CLI) and the infrastructure management (including backups) is taken care of. 

Pros

- Low administration burden, easy scaling, easy multi-AZ setup, automated backups and snapshots

Cons

- AWS does not grant you an administrator account with all abilities. Running the Sitecore 10 Kubernetes mssql-init job against an RDS database will surface many permissions errors.

```
The database settings cannot be modified. You must be a SysAdmin to apply these settings.

Procedure sys.sp_configure, Line 105
User does not have permission to perform this action.

Deployed Sitecore.Experienceforms database
Start creating database 'Sitecore.Master' with azure elastic pool 'pool'
Msg 102, Level 15, State 1, Server, Line 2
Incorrect syntax near '('.

Msg 12824, Level 16, State 1, Server, Line 1
The sp_configure value 'contained database authentication' must be set to 1 in order to alter a contained database.  You may need to use RECONFIGURE to set the value_in_use.
Msg 5069, Level 16, State 1, Server , Line 1
ALTER DATABASE statement failed.

You can only create a user with a password in a contained database.
Msg 15410, Level 11, State 1, Server, Procedure sp_addrolemember, Line 35

The sp_configure value 'contained database authentication' must be set to 1 in order to alter a contained database.  You may need to use RECONFIGURE to set the value_in_use.

You do not have permission to run the RECONFIGURE statement
```

Workarounds exist, but the main path to production deployment is still the import of an existing Sitecore database into RDS - which won't suit all workflows. 

SQL Server on Amazon EC2 instances

Both Windows and Linux instance can now run SQL Server, so this is a great fallback option for when you don't want to re-work installation processes to be compatible with RDS. 

Pros

- Full control, simply a database in the cloud
- Can use existing Sitecore 10 database initialisation methods

Cons

- Administration burden. Backups, scaling, failover - they're all on you. 

A common configuration - separate VPCs

Whichever approach you choose, it is a common security and management practice to run your database workloads in a separate VPC to your EKS cluster. You may want the safety of a different security profile for your database, or monitor the VPCs using separate tooling. 

Connecting an RDS VPC to your Sitecore EKS cluster

1. Install jq to Powershell - we'll use this to view the outputs of our AWS service creation

```
chocolatey install jq
```

```
aws ec2 create-vpc --cidr-block 10.0.0.0/24 | jq '{VpcId:.Vpc.VpcId,CidrBlock:.Vpc.CidrBlock}'
{
  "VpcId": "vpc-0905280971bf101a2",
  "CidrBlock": "10.0.0.0/24"
}
```

```
$Env:RDS_VPC_ID="vpc-0b6fb5c403d053bb3"
```

```
aws ec2 create-subnet --availability-zone "eu-north-1b" --vpc-id $Env:RDS_VPC_ID --cidr-block 10.0.0.0/25 | jq '{SubnetId:.Subnet.SubnetId,AvailabilityZone:.Subnet.AvailabilityZone,CidrBlock:.Subnet.CidrBlock,VpcId:.Subnet.VpcId}'
```

```
aws ec2 create-subnet --availability-zone "eu-north-1a" --vpc-id $Env:RDS_VPC_ID --cidr-block 10.0.0.128/25 | jq '{SubnetId:.Subnet.SubnetId,AvailabilityZone:.Subnet.AvailabilityZone,CidrBlock:.Subnet.CidrBlock,VpcId:.Subnet.VpcId}'
```

```
aws ec2 describe-route-tables --filters Name=vpc-id,Values=$Env:RDS_VPC_ID | jq '.RouteTables[0].RouteTableId'
```

```
$Env:RDS_ROUTE_TABLE_ID="rtb-0ff833750c0039dbf"                                                             
```

```
aws ec2 associate-route-table --route-table-id rtb-0ff833750c0039dbf --subnet-id subnet-0fe72fea5487d0daf
```

```
aws rds create-db-subnet-group --db-subnet-group-name  "DemoDBSubnetGroup" --db-subnet-group-description "Demo DB Subnet Group" --subnet-ids "subnet-0fe72fea5487d0daf" "subnet-0f3201b8ea9fb1147" | jq '{DBSubnetGroupName:.DBSubnetGroup.DBSubnetGroupName,VpcId:.DBSubnetGroup.VpcId,Subnets:.DBSubnetGroup.Subnets[].SubnetIdentifier}'
```

```
aws ec2 create-security-group --group-name DemoRDSSecurityGroup --description "Demo RDS security group" --vpc-id $Env:RDS_VPC_ID
```

```
$Env:RDS_VPC_SECURITY_GROUP_ID="sg-045d5de71c4b7ff17"
```

```
aws rds create-db-instance `
   --db-instance-identifier demordsmssqldbdbinstance `
   --allocated-storage 20 `
   --db-instance-class db.t3.small `
   --engine sqlserver-ex `
   --engine-version "15.00.4073.23.v1" `
   --master-username admin `
   --storage-type standard `
   --master-user-password zXQQVXvcg2CTf2bH `
   --no-publicly-accessible `
   --vpc-security-group-ids $Env:RDS_VPC_SECURITY_GROUP_ID `
   --db-subnet-group-name "demodbsubnetgroup" `
   --availability-zone eu-north-1b `
   --port 1433 | jq '{DBInstanceIdentifier:.DBInstance.DBInstanceIdentifier,Engine:.DBInstance.Engine,DBName:.DBInstance.DBName,VpcSecurityGroups:.DBInstance.VpcSecurityGroups,EngineVersion:.DBInstance.EngineVersion,PubliclyAccessible:.DBInstance.PubliclyAccessible}'
```

```
# sql-service.yaml 
apiVersion: v1
kind: Service
metadata:
  labels:
    app: sql-service
  name: sql-service
spec:
  externalName: demordsmssqldbdbinstance.ccysvgfv15nu.eu-north-1.rds.amazonaws.com
  selector:
    app: sql-service
  type: ExternalName
status:
  loadBalancer: {}
```

```
kubectl apply -f .\sql-service.yaml
```

```
$Env:VPC_PEERING_CONNECTION_ID="pcx-05626fc86f371fd76"
```

```
aws ec2 describe-route-tables --filters Name="tag:aws:cloudformation:logical-id",Values="PublicRouteTable" | jq '.RouteTables[0].RouteTableId'
```

```
$Env:EKS_ROUTE_TABLE_ID="rtb-0bf8ca168c87e02c9"
```

```
aws ec2 create-route --route-table-id $Env:EKS_ROUTE_TABLE_ID --destination-cidr-block 10.0.0.0/24 --vpc-peering-connection-id $Env:VPC_PEERING_CONNECTION_ID
```

```
aws ec2 create-route --route-table-id $Env:RDS_ROUTE_TABLE_ID --destination-cidr-block 192.168.0.0/16 --vpc-peering-connection-id $Env:VPC_PEERING_CONNECTION_ID
```

```
aws ec2 authorize-security-group-ingress --group-id $Env:RDS_VPC_SECURITY_GROUP_ID --protocol tcp --port 1433 --cidr 192.168.0.0/16
```
