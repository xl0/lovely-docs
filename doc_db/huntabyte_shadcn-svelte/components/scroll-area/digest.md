## Scroll Area

Augments native scroll functionality for custom, cross-browser styling.

## Installation

```bash
npx shadcn-svelte@latest add scroll-area -y -o
```

Use `-y` to skip confirmation prompt and `-o` to overwrite existing files.

## Basic Usage

```svelte
<script lang="ts">
  import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";
</script>

<ScrollArea class="h-[200px] w-[350px] rounded-md border p-4">
  Content that overflows the container will be scrollable.
</ScrollArea>
```

## Orientation Prop

Control scrolling direction with the `orientation` prop:

- `"vertical"` (default): Vertical scrolling only
- `"horizontal"`: Horizontal scrolling only
- `"both"`: Both horizontal and vertical scrolling

### Horizontal Scrolling Example

```svelte
<script lang="ts">
  import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";
  
  const works = [
    { artist: "Ornella Binni", art: "https://images.unsplash.com/photo-1465869185982-5a1a7522cbcb?auto=format&fit=crop&w=300&q=80" },
    { artist: "Tom Byrom", art: "https://images.unsplash.com/photo-1548516173-3cabfa4607e9?auto=format&fit=crop&w=300&q=80" },
    { artist: "Vladimir Malyavko", art: "https://images.unsplash.com/photo-1494337480532-3725c85fd2ab?auto=format&fit=crop&w=300&q=80" }
  ];
</script>

<ScrollArea class="w-96 whitespace-nowrap rounded-md border" orientation="horizontal">
  <div class="flex w-max space-x-4 p-4">
    {#each works as artwork (artwork.artist)}
      <figure class="shrink-0">
        <div class="overflow-hidden rounded-md">
          <img src={artwork.art} alt="Photo by {artwork.artist}" class="aspect-[3/4] h-fit w-fit object-cover" width={300} height={400} />
        </div>
        <figcaption class="text-muted-foreground pt-2 text-xs">
          Photo by <span class="text-foreground font-semibold">{artwork.artist}</span>
        </figcaption>
      </figure>
    {/each}
  </div>
</ScrollArea>
```

### Both Directions Example

```svelte
<ScrollArea class="h-[200px] w-[350px] rounded-md border p-4" orientation="both">
  <div class="w-[400px]">
    Content wider than container with vertical overflow.
  </div>
</ScrollArea>
```

## Styling

Apply Tailwind classes directly to the `ScrollArea` component for sizing, borders, padding, and border-radius.