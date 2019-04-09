---
id: version-0.2.0-introduction
title: Getting Started
sidebar_label: Getting Started
original_id: introduction
---

A programmable proxy server.
Please, don't use it in production **yet**! It's nowhere near stable and changing too much.

## Why
Software development is getting harder and harder, on a typical medium/large solution there are lot's of servers at the data path: API Gateways, Load balancers, Cache servers, Proxies, and Firewalls, just to name a few. These servers generate latency and require much more engineering and monitoring to do it right.

The core idea of this project is to do more with less. PipeHub being a programmable proxy allow users to extend and customize it as needed. Features found in other servers can be added with Go packages.

If your requirement is covered by built-in features present on other servers like Nginx and Caddy, you're better of with then. PipeHub shines when you need to add logic that traverses the responsibility of multiple servers like by an HTTP query string, you can choose the server that gonna receive the request and the response can be cached or not. Also is very useful to do deep customizations that are not allowed by other servers, mainly because they are config based. And the best of all, it's done at the same server.

## How
The code is extended with a thing called `pipe`. It's a plain old Go code that is injected at compile time at the application.

Bellow a configuration sample:
```hcl
core {
  graceful-shutdown = "10s"

  http {
    server {
      listen {
        port = 80
      }

      action {
        not-found = "base.NotFound"
        panic     = "base.Panic"
      }
    }
  }
}

http "google" {
  handler = "base.Default"
}

pipe "github.com/pipehub/sample" {
  version = "v0.9.0"
  alias   = "base"

  config {
    host = "https://www.google.com"
  }
}
```

The pipe points to the place where the Go code is, it should be a `go gettable` project. A pipe is a generic processor that can be used on multiple hosts. A host track the endpoint the proxy gonna listen, where the origin is, and which pipe gonna be used to process the requests.

A real example of a pipe can be found [here](https://github.com/pipehub/sample).

## Running
First, you need to define a host at `/etc/hosts` so PipeHub can get the request. If you're using the config example, you should define: `google 127.0.0.1`.

### From source
> Please, note that this project is at constant evolution, the master branch may be broken or the provided examples may be different. For a more accurate documentation access https://pipehub.io/docs/next/introduction.
>
> If you want a stable build, take a look at the Docker section.

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

### From Docker
It's also possible to build from a docker image, just need to pass the config and a directory where the binary gonna be written:
```bash
docker run --rm -v $(pwd)/pipehub.hcl:/pipehub.hcl -v $(pwd):/pipehub/output pipehub/build:0.2.0
```

By default, it generates a linux amd64 based binary, but this can be changed with this arguments:
```bash
docker run --rm -e GOOS=darwin -e GOARCH=amd64 -v $(pwd)/pipehub.hcl:/pipehub.hcl -v $(pwd):/pipehub/output pipehub/build:0.2.0
```

All the possible `GOOS` and `GOARCH` can be found [here](https://golang.org/doc/install/source#environment).

Execute it:
```bash
pipehub start -c pipehub.hcl
```

---
The result doing the request should be this:
![Request](/docs/assets/execution/insomnia.png)

At the terminal you should get something like this:
![Response](/docs/assets/execution/terminal.png)

The `github.com/pipehub/sample` pipe only count the time a request took to be processed.
