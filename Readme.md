# SymjaCheerpJ

[![Join our Discord](https://img.shields.io/discord/869895703718166529?color=7289da&label=Join%20our%20Discord&logo=discord&style=for-the-badge)](https://discord.gg/tYknzr2qam)

The `SymjaRepl` supports the usage of the [Symja Computer Algebra library](https://github.com/axkr/symja_android_library) in a [CheerpJ (version > 4.1)](https://cheerpj.com) browser environment.

Currently the nightly builds (>= 20250907_2731) https://cjrtnc.leaningtech.com/20250907_2731/loader.js fixes some important bugs.

## Getting started

- Clone the corresponding [SymjaRepl repository](https://github.com/axkr/SymjaRepl) repository and build the `SymjaREPL` JAR using Maven.
- Open a terminal in the SymjaREPL directory.
- Run the following Maven command to clean and package the project:

```
mvn clean package
```

This process will:
*  Compile the source code.
*  Resolve all dependencies.
*  Use the Maven Shade Plugin to create a minimized, self-contained JAR (`SymjaREPL-3.1.0-SNAPSHOT-shaded.jar`) in the target directory. This JAR contains all dependencies and is optimized for size.

Prepare the JAR for the web environment:
* Now clone the `SymjaCheerpJ` repository to a new folder on your local file system.
* Copy and rename the generated JAR from `SymjaREPL/target/SymjaREPL-3.1.0-SNAPSHOT-shaded.jar` to `symja-shaded.jar` in your project root folder.
* Serve the folder via HTTP
* Use a simple HTTP server, for example:

```
npx http-server -p 8080
```

Open your browser at:

```
http://localhost:8080/index.html
```

**Note:** Opening the web page directly from the disk (for example, by double-clicking on it) is not supported.

