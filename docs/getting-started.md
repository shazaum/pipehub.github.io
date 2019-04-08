---
id: introduction
title: Getting Started
sidebar_label: Getting Started
---

A programmable proxy server.  
Please, don't use it in production **yet**! It's nowhere near stable and changing too much.

## Why?
Software development is getting harder and harder, on a typical medium/large solution there are lot's of servers at the request path: API Gateways, Load balancers, Cache servers, Proxies, and Firewalls, just to name a few. These generate latency and require much more engineering and monitoring to do it right.

The core idea of this project is to do more with less. pipehub being a programmable proxy, users can extend and customize it as needed. Features found in other servers can be added with Go packages instead of actual external services.

## How?
The code is extended with a thing called `pipe`. It's a plain old Go code that is injected at compile time at the application. Being a Go project gives much higher flexibility because it can really be anything.

Bellow a configuration sample:
```hcl
server {
  http {
    port = 80
  }
}

host {
  endpoint = "google"
  origin   = "https://www.google.com"
  handler  = "base.Default"
}

pipe "github.com/pipehub/sample" {
  version = "v0.7.0"
  alias   = "base"
}
```

The pipe points to the place where the Go code is, it should be a `go gettable` project. A pipe is a generic processor that can be used on multiple hosts. A host track the endpoint the proxy gonna listen, where the origin is, and which handler gonna be used to process the requests.

A real example of a pipe can be found [here](https://github.com/pipehub/sample).

## How to run it?
First, create a config file:
```bash
cp cmd/pipehub/pipehub.sample.hcl cmd/pipehub/pipehub.hcl
# edit cmd/pipehub/pipehub.hcl
```

Generate the binary:
```bash
make generate
```

Execute it:
```bash
./cmd/pipehub/pipehub start -c ./cmd/pipehub/pipehub.hcl
```

It's also possible to build from a docker image, just need to pass the config and a directory where the binary gonna be writed:
```bash
docker run --rm -v $(pwd)/pipehub.hcl:/pipehub.hcl -v $(pwd):/pipehub/output pipehub/build:0.1.0
```

By default, it generates a linux amd64 based binary, but this can be changed with this arguments:
```bash
docker run --rm -e GOOS=darwin -e GOARCH=amd64 -v $(pwd)/pipehub.hcl:/pipehub.hcl -v $(pwd):/pipehub/output pipehub/build:0.1.0
```

All the possible `GOOS` and `GOARCH` can be found [here](https://golang.org/doc/install/source#environment).
