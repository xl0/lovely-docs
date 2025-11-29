## MDX Components Reference

**Installation**: `<Npm>package-name</Npm>`

**Navigation**: `<AnchorCards cards={{ label: "#anchor" }} />`

**Callouts**: `<Callout type={"warning"}>text</Callout>` or with emoji

**Code Display**:
- `<CodeTabs items={["file1.ts", "file2.ts"]}><CodeTab>code</CodeTab></CodeTabs>`
- `<Section>` for paired code blocks
- `<Tabs items={['PostgreSQL', 'MySQL', 'SQLite']}><Tab><Section>code</Section></Tab></Tabs>`

**Support Status**: `<IsSupportedChipGroup chips={{ PostgreSQL: true, MySQL: false }} />`

**References**: `<SimpleLinkCards cards={{ "label": "/path" }} />`

**Instructions**: `<Steps>#### Step title\ncode/text</Steps>`

**Videos**: `<YoutubeCards cards={[{ id: "videoId", title: "...", description: "...", time: "..." }]} />`

**Code Features**: `copy`, `/pattern/number` (highlight), `filename`, `collapsable`