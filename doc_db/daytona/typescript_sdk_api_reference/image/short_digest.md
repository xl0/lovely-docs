## Image

Sandbox image definition with factory methods: `base()`, `debianSlim()`, `fromDockerfile()`.

Configuration methods (chainable): `workdir()`, `env()`, `cmd()`, `entrypoint()`, `runCommands()`, `dockerfileCommands()`, `addLocalDir()`, `addLocalFile()`.

Python package installation: `pipInstall()`, `pipInstallFromRequirements()`, `pipInstallFromPyproject()` with options for index URLs, find-links, and pre-releases.

Accessors: `contextList`, `dockerfile`.