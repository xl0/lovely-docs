# Carousel

Embla-based carousel with motion and swipe.

## Install

```bash
npx shadcn-svelte@latest add carousel -y -o
```

## Basic Usage

```svelte
<script lang="ts">
  import * as Carousel from "$lib/components/ui/carousel/index.js";
</script>

<Carousel.Root>
  <Carousel.Content>
    <Carousel.Item>Item 1</Carousel.Item>
    <Carousel.Item>Item 2</Carousel.Item>
    <Carousel.Item>Item 3</Carousel.Item>
  </Carousel.Content>
  <Carousel.Previous />
  <Carousel.Next />
</Carousel.Root>
```

## Sizing & Spacing

```svelte
<!-- Responsive item width -->
<Carousel.Item class="md:basis-1/2 lg:basis-1/3">

<!-- Spacing: use ps-[VALUE] on items, -ms-[VALUE] on content -->
<Carousel.Content class="-ms-4">
  <Carousel.Item class="ps-4">
```

## Orientation

```svelte
<Carousel.Root orientation="vertical" class="h-[200px]">
  <Carousel.Content class="-mt-1">
    <Carousel.Item class="pt-1">
```

## Options & API

```svelte
<Carousel.Root opts={{ align: "start", loop: true }}>

<!-- Get API instance -->
<script lang="ts">
  import type { CarouselAPI } from "$lib/components/ui/carousel/context.js";
  let api = $state<CarouselAPI>();
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

<Carousel.Root setApi={(emblaApi) => (api = emblaApi)}>
  <!-- Slide {current} of {api.scrollSnapList().length} -->
```

## Plugins

```svelte
<script lang="ts">
  import Autoplay from "embla-carousel-autoplay";
  const plugin = Autoplay({ delay: 2000, stopOnInteraction: true });
</script>

<Carousel.Root plugins={[plugin]} onmouseenter={plugin.stop} onmouseleave={plugin.reset}>
```