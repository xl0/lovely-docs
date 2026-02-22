## VolumeService

Service for managing Daytona Volumes - shared storage volumes for Sandboxes.

Volumes can be mounted to Sandboxes with an optional subpath parameter to mount only a specific S3 prefix within the volume. When no subpath is specified, the entire volume is mounted.

### Constructor

```ts
new VolumeService(volumesApi: VolumesApi): VolumeService
```

### Methods

#### create(name: string): Promise<Volume>

Creates a new Volume with the specified name.

```ts
const daytona = new Daytona();
const volume = await daytona.volume.create("my-data-volume");
console.log(`Created volume ${volume.name} with ID ${volume.id}`);
```

#### delete(volume: Volume): Promise<void>

Deletes a Volume.

```ts
const volume = await daytona.volume.get("volume-name");
await daytona.volume.delete(volume);
```

#### get(name: string, create?: boolean): Promise<Volume>

Gets a Volume by name. Optional `create` parameter (default: false) creates the Volume if it doesn't exist.

```ts
const volume = await daytona.volume.get("volume-name", true);
console.log(`Volume ${volume.name} is in state ${volume.state}`);
```

#### list(): Promise<Volume[]>

Lists all available Volumes.

```ts
const volumes = await daytona.volume.list();
volumes.forEach(vol => console.log(`${vol.name} (${vol.id})`));
```

## Volume Type

```ts
type Volume = VolumeDto & {
  __brand: "Volume";
};
```

Represents a Daytona Volume - a shared storage volume for Sandboxes.