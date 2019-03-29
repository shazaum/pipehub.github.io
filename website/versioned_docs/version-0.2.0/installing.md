---
id: version-0.1.0-installing
title: Installing
sidebar_label: Installing
original_id: installing
---

## How it's done?
At the root of the PipeHub project, there is a file called `pipe.go`, and it looks exactly like this:

```golang
// +build !pipe

package pipehub

func (*pipeManager) fetchPipes() error {
  return nil
}
```

PipeHub uses this function to fetch its pipes. Also, note the built tag on top of the snippet. A normal build doesn't include the dynamic pipes, just the code needed to initialize the pipes.

To add a pipe, first, the config file should be changed with something like this:
```
pipe "github.com/pipehub/sample" {
  version = "v0.9.0"
  alias   = "base"
}
```

Then, run the command `make generate`, this gonna do three things:
* Update the `go.mod` file with the pipe that should be included at the project.
* Generate a `pipe_dynamic.go` file with the initialization of the pipe. This file is only built with the tag `pipe`.
* Generate the final binary using the tag `pipe`.

After that, you gonna have a single binary with the PipeHub server and all required pipes.