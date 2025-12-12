## Typography

No default typography styles. Use utility classes for text styling.

**Headings**: h1-h4 with `scroll-m-20`, `font-extrabold`/`font-semibold`, and size classes (`text-4xl`, `text-3xl`, etc.)

**Paragraphs**: Standard `<p>` with `leading-7 [&:not(:first-child)]:mt-6` for spacing. Variants: Lead (`text-xl`), Large (`text-lg font-semibold`), Small (`text-sm`), Muted (`text-muted-foreground text-sm`)

**Blocks**: 
- Blockquote: `border-s-2 ps-6 italic`
- List: `list-disc ms-6 [&>li]:mt-2`
- Table: Wrap in `overflow-y-auto` div, use `border`, `px-4 py-2`, `even:bg-muted`, conditional alignment with `[&[align=center]]:text-center`
- Inline code: `bg-muted rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold`
