---
id: version-0.1.0-overview
title: Overview
sidebar_label: Overview
original_id: overview
---

Handler is the unit of code that enables all the extensibility of PipeHub.

## Code
Bellow a sample code with all the possibilities of a Handler.

```golang
type Client struct{}

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

func NewClient() (Client, error) {
    return Client{}, nil
}
```

Let's get into more details:

### NewClient
```golang
func NewClient() (Client, error) {
    return Client{}, nil
}
```

PipeHub expects a `NewClient` function that returns any struct that implements this interface:

```golang
type pipeInstance interface {
    Close(ctx context.Context) error
}
```

Use the `NewClient` function to do all the initialization needed by your package like database connections.

### Close
```golang
func (Client) Close(ctx context.Context) error {
    return nil
}
```

`Close` enable the possibility to gracefully close the handler and its resources.

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
Is also possible to register a function to handle not found endpoints. If you're trying to access a host that doesn't have any kind of handler associated, this function, if present, gonna be invoked.

```golang
func (Client) NotFound(w http.ResponseWriter, r *http.Request) {
    http.NotFound(w, r)
}
```

### Handler
This is the most important function in a Handler. All the traffic pass through this function.

```golang
func (Client) Default(next http.Handler) http.Handler {
    fn := func(w http.ResponseWriter, r *http.Request) {
    next.ServeHTTP(w, r)
    }
    return http.HandlerFunc(fn)
}
```

## Execution Flow
![Execution Flow](/docs/assets/0.1.0/execution-flow.png)

**Step 1:** The client does a request at PipeHub.

**Step 2:** The request is redirected to the Handler configured to handle the request.

**Step 3:** Handler has 3 options now:
  * Change the request and return the execution flow to PipeHub
  * Do an early return and return the execution flow to PipeHub preventing the step 4 of happening
  * Return the execution flow to the PipeHub without any modification

**Step 4:** PipeHub send the request to the origin server.

**Step 5:** PipeHub send the response from `step 4` into the Handler again.

**Step 7:** Handler has 2 options now:
  * Change the response and return the execution flow to PipeHub
  * Return the execution flow to the PipeHub without any modification

**Step 7:** PipeHub send the response to the client.