# Lovely Docs

[![](https://alexey.work/badge/)](https://alexey.work?ref=ld-md)

## Why Lovely Docs?

AI coding tools work best when given access to up-to-date documentation.

Lovely Docs places the documentation inside a folder ( lovely-docs/ by default) in your project. The documentation is available in both condensed and fulltext forms - noise is removed from pages, and content summaries are created for each directory.

```bash
npx -y lovely-docs@latest init
npx -y lovely-docs@latest add sveltejs_svelte
```

or `npx -y lovely-docs@latest add` and select from the list or `--all`

You can view the pre-processed docs here: [https://lovely-docs.github.io/human](https://lovely-docs.github.io/human)


There is also an MCP server that you can use
```
npx -y lovely-docs@latest mcp --help
```

or use `https://lovely-docs.up.railway.app/mcp`.

But I find that a local folder works best.

## Project Structure

- **`website/`**: The [https://lovely-docs.github.io](https://lovely-docs.github.io) website
- **`doc_db/`**: The database of processed documentation files.
- **`lovely-docs/`** The lovely-docs cli tool
- **`preprocessor/`**: Converts raw docs into lovely docs.

## Contributing

### New documents

Check out the notebooks in `preprocessor/nbs`

The ones that start with 0 have the core functions, they are exported to `preprocessor/nbs/lovely_docs` using `nbdev`

The othet notebooks do the pre-processing using `lovely_docs` inplace (no need to pip install).
If you want to add documentation, look at the exising notebooks, create a new one, run it manually and include the new files in `doc_db` in your commit.

Some documentation requires building (see `preprocessor/nbs/12_huntabyte-bitsui.ipynb`), some does not. You are free to manipulate the raw docuimentation before feeding it to the llm as you see fit.

### preprocessor core

If you want to make changes to the pre-processor core, run `nbdev_export` to export the changes to `preprocessor/lovely_docs/`. Run `nbdev_prepare` before commit to clean up the notebook metadata.

Make sure you restart the downstream notebooks after you make chnges to the core, because modules are not hot-reloaded.


### CLI and Website

The website is written in SvelteKit. Make sure you `bun run check` and `bun run build` before committing. The later will build a static website with all the pages pre-rendered.

The CLI is just a node package, make sure you test your changes.

### Greptile

[Greptile](https://www.greptile.com/) was very kind to offer free service. The reviews are almost always on point, make sure you read them when you make a PR.