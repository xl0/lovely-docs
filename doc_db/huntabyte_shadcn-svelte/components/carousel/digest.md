# Carousel

Image carousel component built on Embla Carousel with motion and swipe support.

## Installation

```bash
npx shadcn-svelte@latest add carousel -y -o
```

Flags: `-y` skips confirmation, `-o` overwrites existing files.

## Basic Usage

```svelte
<script lang="ts">
  import * as Carousel from "$lib/components/ui/carousel/index.js";
  import * as Card from "$lib/components/ui/card/index.js";
</script>

<Carousel.Root class="w-full max-w-xs">
  <Carousel.Content>
    {#each Array(5) as _, i (i)}
      <Carousel.Item>
        <Card.Root>
          <Card.Content class="flex aspect-square items-center justify-center p-6">
            <span class="text-4xl font-semibold">{i + 1}</span>
          </Card.Content>
        </Card.Root>
      </Carousel.Item>
    {/each}
  </Carousel.Content>
  <Carousel.Previous />
  <Carousel.Next />
</Carousel.Root>
```

## Sizing Items

Use `basis` utility classes on `<Carousel.Item />`:

```svelte
<Carousel.Root opts={{ align: "start" }} class="w-full max-w-sm">
  <Carousel.Content>
    {#each Array(5) as _, i (i)}
      <Carousel.Item class="md:basis-1/2 lg:basis-1/3">
        <!-- content -->
      </Carousel.Item>
    {/each}
  </Carousel.Content>
  <Carousel.Previous />
  <Carousel.Next />
</Carousel.Root>
```

## Spacing Between Items

Use `ps-[VALUE]` on items and `-ms-[VALUE]` on content:

```svelte
<Carousel.Root class="w-full max-w-sm">
  <Carousel.Content class="-ms-2 md:-ms-4">
    {#each Array(5) as _, i (i)}
      <Carousel.Item class="ps-2 md:ps-4">
        <!-- content -->
      </Carousel.Item>
    {/each}
  </Carousel.Content>
  <Carousel.Previous />
  <Carousel.Next />
</Carousel.Root>
```

## Orientation

```svelte
<Carousel.Root
  opts={{ align: "start" }}
  orientation="vertical"
  class="w-full max-w-xs"
>
  <Carousel.Content class="-mt-1 h-[200px]">
    {#each Array(5) as _, i (i)}
      <Carousel.Item class="pt-1 md:basis-1/2">
        <!-- content -->
      </Carousel.Item>
    {/each}
  </Carousel.Content>
  <Carousel.Previous />
  <Carousel.Next />
</Carousel.Root>
```

Set `orientation="vertical"` or `orientation="horizontal"` (default).

## Options

Pass Embla Carousel options via `opts` prop:

```svelte
<Carousel.Root opts={{ align: "start", loop: true }}>
  <!-- content -->
</Carousel.Root>
```

See Embla Carousel API docs for all available options.

## API & State Management

Get carousel instance via `setApi` callback:

```svelte
<script lang="ts">
  import type { CarouselAPI } from "$lib/components/ui/carousel/context.js";
  let api = $state<CarouselAPI>();
  const count = $derived(api ? api.scrollSnapList().length : 0);
  let current = $state(0);
  
  $effect(() => {
    if (api) {
      current = api.selectedScrollSnap() + 1;
      api.on("select", () => {
        current = api!.selectedScrollSnap() + 1;
      });
    }
  });
</script>

<Carousel.Root setApi={(emblaApi) => (api = emblaApi)} class="w-full max-w-xs">
  <Carousel.Content>
    {#each Array(5) as _, i (i)}
      <Carousel.Item>
        <Card.Root>
          <Card.Content class="flex aspect-square items-center justify-center p-6">
            <span class="text-4xl font-semibold">{i + 1}</span>
          </Card.Content>
        </Card.Root>
      </Carousel.Item>
    {/each}
  </Carousel.Content>
  <Carousel.Previous />
  <Carousel.Next />
</Carousel.Root>

<div class="py-2 text-center text-sm text-muted-foreground">
  Slide {current} of {count}
</div>
```

Available API methods: `scrollSnapList()`, `selectedScrollSnap()`, `on(event, callback)`.

## Events

Listen to carousel events via API instance:

```svelte
<script lang="ts">
  import type { CarouselAPI } from "$lib/components/ui/carousel/context.js";
  let api = $state<CarouselAPI>();
  
  $effect(() => {
    if (api) {
      api.on("select", () => {
        // handle selection change
      });
    }
  });
</script>

<Carousel.Root setApi={(emblaApi) => (api = emblaApi)}>
  <!-- content -->
</Carousel.Root>
```

## Plugins

Add Embla Carousel plugins via `plugins` prop:

```svelte
<script lang="ts">
  import Autoplay from "embla-carousel-autoplay";
  import * as Carousel from "$lib/components/ui/carousel/index.js";
  
  const plugin = Autoplay({ delay: 2000, stopOnInteraction: true });
</script>

<Carousel.Root
  plugins={[plugin]}
  class="w-full max-w-xs"
  onmouseenter={plugin.stop}
  onmouseleave={plugin.reset}
>
  <Carousel.Content>
    {#each Array(5) as _, i (i)}
      <Carousel.Item>
        <Card.Root>
          <Card.Content class="flex aspect-square items-center justify-center p-6">
            <span class="text-4xl font-semibold">{i + 1}</span>
          </Card.Content>
        </Card.Root>
      </Carousel.Item>
    {/each}
  </Carousel.Content>
  <Carousel.Previous />
  <Carousel.Next />
</Carousel.Root>
```

See Embla Carousel plugin docs for available plugins and options.