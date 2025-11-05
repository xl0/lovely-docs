## Main Functions

**compile(source, options)** - Converts `.svelte` source code into a JavaScript module exporting a component. Returns `CompileResult` with `js`, `css`, `warnings`, `metadata`, and `ast` properties.

**compileModule(source, options)** - Compiles JavaScript source code containing runes into a JavaScript module. Always operates in runes mode.

**parse(source, options)** - Parses a component and returns its abstract syntax tree. Supports both modern and legacy AST formats via the `modern` option.

**preprocess(source, preprocessor, options)** - Applies preprocessor hooks to transform component source code. Accepts single or array of preprocessors. Returns a Promise.

**migrate(source, options)** - Performs best-effort migration of Svelte code to use runes, event attributes, and render tags. May throw on complex code.

**VERSION** - Current version string from package.json.

## Key Compile Options

- `name` - Sets the resulting JavaScript class name
- `customElement` - Generate custom element constructor instead of regular component
- `generate` - Target output: `'client'`, `'server'`, or `false`
- `dev` - Add runtime checks and debugging code
- `runes` - Force runes mode (`true`), disable it (`false`), or infer (`undefined`)
- `css` - `'injected'` (default) or `'external'` for CSS handling
- `namespace` - Element namespace: `'html'`, `'svg'`, `'mathml'`
- `preserveComments` - Keep HTML comments in output
- `preserveWhitespace` - Keep whitespace as typed
- `fragments` - Fragment cloning strategy: `'html'` (faster) or `'tree'` (CSP-compatible)
- `hmr` - Enable hot module reloading
- `modernAst` - Return modern AST format

## AST Structure

The AST namespace provides comprehensive type definitions for all Svelte template nodes including:
- Elements: `RegularElement`, `Component`, `SvelteComponent`, `SvelteElement`, `SlotElement`, etc.
- Blocks: `EachBlock`, `IfBlock`, `AwaitBlock`, `KeyBlock`, `SnippetBlock`
- Directives: `BindDirective`, `OnDirective`, `ClassDirective`, `StyleDirective`, `TransitionDirective`, `UseDirective`, `AnimateDirective`, `LetDirective`
- Tags: `ExpressionTag`, `HtmlTag`, `ConstTag`, `DebugTag`, `RenderTag`, `AttachTag`
- Root structure with `fragment`, `instance` script, `module` script, `css`, and `comments`

## Preprocessor System

Preprocessors are functions that transform code before compilation. A `PreprocessorGroup` can include:
- `markup` - Transform entire component markup
- `script` - Transform script tag content
- `style` - Transform style tag content

Each receives `content`, `attributes`, `markup`, and `filename`. Returns `Processed` with `code`, optional `map`, `dependencies`, and `attributes`.