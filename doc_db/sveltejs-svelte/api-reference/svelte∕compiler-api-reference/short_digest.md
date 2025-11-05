## Core Functions

- **compile(source, options)** - Converts `.svelte` to JavaScript module
- **compileModule(source, options)** - Compiles JavaScript with runes
- **parse(source, options)** - Returns component AST
- **preprocess(source, preprocessor)** - Transforms source before compilation
- **migrate(source, options)** - Auto-migrates code to runes
- **VERSION** - Current version string

## Key Options

`compile()` accepts: `name`, `customElement`, `generate` ('client'|'server'|false), `dev`, `runes` (true|false|undefined), `css` ('injected'|'external'), `namespace`, `preserveComments`, `preserveWhitespace`, `fragments` ('html'|'tree'), `hmr`, `modernAst`

## AST Types

Complete type definitions for template nodes: Elements (RegularElement, Component, SvelteComponent, SlotElement), Blocks (EachBlock, IfBlock, AwaitBlock, KeyBlock, SnippetBlock), Directives (Bind, On, Class, Style, Transition, Use, Animate, Let), Tags (Expression, Html, Const, Debug, Render, Attach)

## Preprocessors

Transform code via `PreprocessorGroup` with optional `markup`, `script`, `style` functions. Each receives content, attributes, markup, filename and returns Processed object with code, map, dependencies.