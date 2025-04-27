# SymjaCheerpJ

The `SymjaRepl` supports the usage of the [Symja Computer Algebra library](https://github.com/axkr/symja_android_library) in a [CheerpJ (version >= 4.0)](https://cheerpj.com) browser environment.

## Getting started

- Copy this repository to a new folder in your local file system
- Export the `symja-fat.jar` file within Eclipse from the [SymjaRepl repository](https://github.com/axkr/SymjaRepl)
- Copy `symja-fat.jar` to the new folder
- You can now serve this local folder as a web page on a simple HTTP server, such as the http-server utility, with the command:

```
npx http-server -p 8080
```

Open the following URL in your web browser:

```
http://localhost:8080/index.html
```

**Note:** Opening the web page directly from the disk (for example, by double-clicking on it) is not supported.

