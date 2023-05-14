# ensu

ensu (Env Npm Script Utility) is a relatively lightweight package to simplify working with environment variables inside of package.json scripts.

### What is this?

This is a package that aims to simplify package.json scripts. It aims to turn stuff like this:

```json
{
  "start-dev": "nodemon src/some-file.js",
  "start-test": "node src/some-file.js",
  "start-prod": "forever src/some-file.js"
}
```

into this:

```json
{
  "start": "ensu switch",
  "start:development": "nodemon src/some-file.js",
  "start:test": "node src/some-file.js",
  "start:production": "forever src/some-file.js"
}
```

This makes it much easier to run the right command, as you only need to run 1 command for multiple environments.

Don't like the multiple lines? You can also do stuff like this:

```json
{
  "start": "ensu if NODE_ENV development && nodemon src/some-file.js || node src/some-file.js"
}
```

Other environment variables are also supported with the `--env-var` option (or `-e`), as well as loading environment variables from dotenv.<br>
_The dotenv file needs to be in main project directory for ensu to detect it, otherwise you need to specify the (relative) path with `--env-file` or `-f`._

```json
{
  "start": "ensu if ANIMAL cat && echo \"meow\" || echo \"hiss\""
}
```

### Why?

I stumbled across [if-env](https://github.com/ericclemmons/if-env), however it didn't work with dotenv. I then found [per-env](https://github.com/ericclemmons/per-env), which didnt allow the usage of dotenv files either. After some more digging I found [by-node-env](https://www.npmjs.com/package/by-node-env) - which allows you to use dotenv, except it [expands out to 72 dependencies](https://npm.anvaka.com/#/view/2d/by-node-env).

I built this package with the goal of keeping it lightweight; This package has 1 required dependency, and branches out to 1. _(dotenv is an optional peer dependency)_
