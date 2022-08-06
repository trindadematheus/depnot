# depnot

Remove all dependencies with match name

```bash
> npx depnot [npm | yarn | pnpm] [package-name] [with-dependencies]
```

#### Examples

Uninstall all **eslint** packages from package.json using **yarn**

```bash
> npx depnot yarn eslint
```

Uninstall all **react-native** dependencies and devDependencies from package.json using **npm**

```bash
> npx depnot npm react-native -D
```
