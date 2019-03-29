---
id: version-0.2.0-overview
title: Overview
sidebar_label: Overview
original_id: overview
---

Pipe is the unit of code that enables all the extensibility of PipeHub.

## Code
Bellow a sample code with all the possibilities of a Pipe.

```golang
type Client struct{
    config map[string]interface{}
}

func (Client) Close(ctx context.Context) error {
    return nil
}

func (Client) Default(next http.Handler) http.Handler {
    fn := func(w http.ResponseWriter, r *http.Request) {
        next.ServeHTTP(w, r)
    }
    return http.HandlerFunc(fn)
}

func (Client) Panic(next http.Handler) http.Handler {
    fn := func(w http.ResponseWriter, r *http.Request) {
        next.ServeHTTP(w, r)
    }
    return http.HandlerFunc(fn)
}

func (Client) NotFound(w http.ResponseWriter, r *http.Request) {
    http.NotFound(w, r)
}

func NewClient(config map[string]interface{}) (Client, error) {
    return Client{
        config: config,
    }, nil
}
```

Let's get into more details:

### NewClient
```golang
func NewClient(config map[string]interface{}) (Client, error) {
    return Client{
        config: config,
    }, nil
}
```

PipeHub expects a `NewClient` function that returns any struct that implements this interface:

```golang
type pipeInstance interface {
    Close(ctx context.Context) error
}
```

Use the `NewClient` function to do all the initialization needed by your package like database connections. The parameter is a `map[string]interface{}` that contains the raw value present at the configuration. Imagine this configuration:

```
pipe "github.com/pipehub/sample" {
  version = "v0.9.0"
  alias   = "base"

  config {
    host = "https://www.google.com"
  }
}
```

The config value at the `NewClient` function will be:

```golang
map[string]interface{} {
    "host": "https://www.google.com",
}
```

If you want to dynamic the map values into a struct, you could use [mapstructure](https://github.com/mitchellh/mapstructure) package.

### Close
```golang
func (Client) Close(ctx context.Context) error {
    return nil
}
```

`Close` enable the possibility to gracefully close the pipe and its resources.

### Panic
```golang
func (Client) Panic(next http.Handler) http.Handler {
    fn := func(w http.ResponseWriter, r *http.Request) {
        next.ServeHTTP(w, r)
    }
    return http.HandlerFunc(fn)
}
```

It's possible to register a custom panic function to handle any kind of panic caught by PipeHub.

### NotFound
Is also possible to register a function to handle not found endpoints. If you're trying to access a host that doesn't have any kind of pipe associated, this function, if present, gonna be invoked.

```golang
func (Client) NotFound(w http.ResponseWriter, r *http.Request) {
    http.NotFound(w, r)
}
```

### Pipe
This is the most important function in a Pipe. All the traffic pass through this function.

```golang
func (Client) Default(next http.Handler) http.Handler {
    fn := func(w http.ResponseWriter, r *http.Request) {
    next.ServeHTTP(w, r)
    }
    return http.HandlerFunc(fn)
}
```

## Execution Flow
![Execution Flow](/docs/assets/execution-flow.png)

**Step 1:** The client does a request at PipeHub.

**Step 2:** The request is redirected to the Pipe configured to handle the request.

**Step 3:** Pipe has 3 options now:
  * Change the request and return the execution flow to PipeHub
  * Do an early return and return the execution flow to PipeHub preventing the step 4 of happening
  * Return the execution flow to the PipeHub without any modification

**Step 4:** PipeHub send the request to the origin server.

**Step 5:** PipeHub send the response from `step 4` into the Pipe again.

**Step 7:** Pipe has 2 options now:
  * Change the response and return the execution flow to PipeHub
  * Return the execution flow to the PipeHub without any modification

**Step 7:** PipeHub send the response to the client.