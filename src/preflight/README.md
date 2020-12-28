# Preflight

Every host will have one of the four following states assigned by this host
checker:

- ***PENDING*** </br>
    Used when the HostChecker has not yet processed the host.
- ***INELIGABLE*** </br>
    The host cannot be checked by HostChecker. This occurs when:</br>
    - The SSH Config specifices a `ProxyCommand`, as it's not practical to
          exec a whole process to follow large numbers of hosts.</br>
    - FQDN is malformed. This can occur when a literal hostname is specified in `~/.ssh/config`, but no Hostname is set.</br>
    - The domain requires MDNS resolution (.local)
    - The host FQDN matches the blacklist
    - The host `meta.noCheck` property is truthy
- ***RUNNING*** <br/>
    Assngned when the HostChecker begins processing a host, remains as the
    status until the status resolves.
- ***PASS*** <br/>
    One or more of the following conditions must pass:
    - The host replies to ICMP echo
    - The host ICMP NACKs to a UDP probe
    - FastSSH successfully identifies a running SSH service
    - The host `meta.alive` property is truthy
- ***FAIL*** <br/>
    The host is non-responsive or invalid. This occurs when:  
    - FastSSH detects an invalid (non-SSH) service running on the specified
        port; note that a host can still pass if FastSSH is unable to connect
        at all, this will only force a failure if FastSSH can confirm the
        host is not compatible with the SSH protocol. 
    - The FQDN provided cannot be resolved to an IP address
    - The host does not reply to ICMP and UDP pings.

These states implement a finites state machine, with the following flow. Any
state change not specified below is invalid.

```graphvis
digraph graphname {
    PENDING -> RUNNING;
    PENDING -> INELIGABLE;
    RUNNING -> PASS;
    RUNNING -> FAIL;
}
```