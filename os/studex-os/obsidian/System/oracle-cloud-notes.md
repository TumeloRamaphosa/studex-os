# Oracle Cloud Credentials — Aug 28 2026

## Credentials Provided by Tumelo
```
Workspace Key: sk-ws-H.DDMRMHR.5mBj.MEUCIEczrSgcZA1G9aLF3wof1JDyXa5RYG5FaQcpQc1K8Vuu...
Instance:      ws-ck212l55q0j2ll0b.ap-southeast-1.maas.aliyuncs.com
OC User:       ${OCI_USER_OCID}
OC Pass:       3Gg3XLooch3oera72ca1HYMnNkrVn1
```

## Status
- `ap-southeast-1.maas.aliyuncs.com` NOT reachable from this environment (DNS fails)
- NOT reachable from Orgo VMs either (ping fails, curl fails, DNS fails)
- Orgo AI IS built on Oracle Cloud, but MAAS endpoint appears private/VPC-only
- The ws- key format = Orgo workspace-scoped key for Oracle Cloud provisioning
- Oracle Cloud OCI REST API also not reachable from this env (all OCI regions fail)

## What These Credentials Are For
- Oracle Cloud MAAS (Metal as a Service) — bare metal provisioning
- Orgo AI runs on Oracle Cloud Infrastructure (OCI)
- ws- key = workspace-level auth for Orgo Oracle Cloud integration
- LTAI5 prefix = Oracle Cloud Infrastructure native auth (user auth string)

## Saved on Super Agents Command VM
- /root/oracle-cloud-backup/credentials.txt (saved by Hermes)

## Next Steps
- Access Oracle Cloud dashboard directly: https://cloud.oracle.com
- Orgo AI dashboard: https://www.orgo.ai
- VMs may need to be accessed via Oracle Cloud Console, not Orgo API
