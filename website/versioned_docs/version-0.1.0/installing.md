---
id: version-0.1.0-installing
title: Installing
sidebar_label: Installing
original_id: installing
---

## How it's done?
At the root of the PipeHub project, there is a file called `handler.go`, and it looks exactly like this:

```golang
// +build !handler

package pipehub

func fetchHandlers() ([]handler, error) {
    return nil, nil
}
```

PipeHub uses this function to fetch its handlers. Also, note the built tag on top of the snippet. A normal build doesn't include the dynamic handlers, just the code needed to initialize the handlers.

To add a handler, first, the config file should be changed with something like this:
```
handler {
  path    = "github.com/pipehub/handler"
  version = "v0.8.1"
  alias   = "base"
}
```

Then, run the command `make generate`, this gonna do three things:
* Update the `go.mod` file with the handler that should be included at the project.
* Generate a `handler_dynamic.go` file with the initialization of the handler. This file is only built with the tag `handler`.
* Generate the final binary using the tag `handler`.

After that, you gonna have a single binary with the PipeHub server and all required handlers.