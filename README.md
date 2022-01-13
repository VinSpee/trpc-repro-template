# Bug Reproduction

I'm seeing some odd behavior when accesssing tRPC queries via SSR.

## Steps to reproduce

1. navigate to /post/[id]
2. view the log in the _server console_
3. observe that the query is simultaneously **loading** and **error**.
