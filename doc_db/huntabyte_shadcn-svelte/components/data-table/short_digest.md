# Data Table

TanStack Table v8 integration for building custom data tables.

## Installation

```bash
npm i @tanstack/table-core
npx shadcn-svelte@latest add table data-table -y -o
```

## Basic Setup

Define columns and create a reusable component:

```ts
import type { ColumnDef } from "@tanstack/table-core";

export type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};

export const columns: ColumnDef<Payment>[] = [
  { accessorKey: "status", header: "Status" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "amount", header: "Amount" },
];
```

```svelte
<script lang="ts" generics="TData, TValue">
  import { type ColumnDef, getCoreRowModel } from "@tanstack/table-core";
  import { createSvelteTable, FlexRender } from "$lib/components/ui/data-table/index.js";
  import * as Table from "$lib/components/ui/table/index.js";

  type DataTableProps<TData, TValue> = {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
  };

  let { data, columns }: DataTableProps<TData, TValue> = $props();

  const table = createSvelteTable({
    get data() { return data; },
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
</script>

<div class="rounded-md border">
  <Table.Root>
    <Table.Header>
      {#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
        <Table.Row>
          {#each headerGroup.headers as header (header.id)}
            <Table.Head colspan={header.colSpan}>
              {#if !header.isPlaceholder}
                <FlexRender content={header.column.columnDef.header} context={header.getContext()} />
              {/if}
            </Table.Head>
          {/each}
        </Table.Row>
      {/each}
    </Table.Header>
    <Table.Body>
      {#each table.getRowModel().rows as row (row.id)}
        <Table.Row data-state={row.getIsSelected() && "selected"}>
          {#each row.getVisibleCells() as cell (cell.id)}
            <Table.Cell>
              <FlexRender content={cell.column.columnDef.cell} context={cell.getContext()} />
            </Table.Cell>
          {/each}
        </Table.Row>
      {:else}
        <Table.Row>
          <Table.Cell colspan={columns.length} class="h-24 text-center">No results.</Table.Cell>
        </Table.Row>
      {/each}
    </Table.Body>
  </Table.Root>
</div>
```

## Features

**Cell Formatting**: Use `createRawSnippet` and `renderSnippet` for custom rendering:

```ts
{
  accessorKey: "amount",
  header: () => renderSnippet(createRawSnippet(() => ({
    render: () => `<div class="text-end">Amount</div>`,
  }))),
  cell: ({ row }) => {
    const formatter = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
    return renderSnippet(createRawSnippet<[{ amount: number }]>((getAmount) => ({
      render: () => `<div class="text-end font-medium">${formatter.format(getAmount().amount)}</div>`,
    })), { amount: row.original.amount });
  },
}
```

**Row Actions**: Use `renderComponent` to add interactive components:

```ts
{
  id: "actions",
  cell: ({ row }) => renderComponent(DataTableActions, { id: row.original.id }),
}
```

**Pagination**: Add `PaginationState` and `getPaginationRowModel`:

```ts
let pagination = $state<PaginationState>({ pageIndex: 0, pageSize: 10 });
const table = createSvelteTable({
  state: { get pagination() { return pagination; } },
  onPaginationChange: (updater) => {
    pagination = typeof updater === "function" ? updater(pagination) : updater;
  },
  getPaginationRowModel: getPaginationRowModel(),
});
```

```svelte
<Button onclick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>Previous</Button>
<Button onclick={() => table.nextPage()} disabled={!table.getCanNextPage()}>Next</Button>
```

**Sorting**: Add `SortingState` and `getSortedRowModel`, use `column.getToggleSortingHandler()` in header:

```ts
let sorting = $state<SortingState>([]);
const table = createSvelteTable({
  state: { get sorting() { return sorting; } },
  onSortingChange: (updater) => { sorting = typeof updater === "function" ? updater(sorting) : updater; },
  getSortedRowModel: getSortedRowModel(),
});

// In column definition:
{ accessorKey: "email", header: ({ column }) => renderComponent(SortButton, { onclick: column.getToggleSortingHandler() }) }
```

**Filtering**: Add `ColumnFiltersState` and `getFilteredRowModel`:

```ts
let columnFilters = $state<ColumnFiltersState>([]);
const table = createSvelteTable({
  state: { get columnFilters() { return columnFilters; } },
  onColumnFiltersChange: (updater) => { columnFilters = typeof updater === "function" ? updater(columnFilters) : updater; },
  getFilteredRowModel: getFilteredRowModel(),
});
```

```svelte
<Input
  placeholder="Filter emails..."
  value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
  oninput={(e) => table.getColumn("email")?.setFilterValue(e.currentTarget.value)}
/>
```

**Column Visibility**: Add `VisibilityState` and `onColumnVisibilityChange`:

```ts
let columnVisibility = $state<VisibilityState>({});
const table = createSvelteTable({
  state: { get columnVisibility() { return columnVisibility; } },
  onColumnVisibilityChange: (updater) => { columnVisibility = typeof updater === "function" ? updater(columnVisibility) : updater; },
});
```

```svelte
{#each table.getAllColumns().filter((col) => col.getCanHide()) as column (column.id)}
  <DropdownMenu.CheckboxItem
    bind:checked={() => column.getIsVisible(), (v) => column.toggleVisibility(!!v)}
  >
    {column.id}
  </DropdownMenu.CheckboxItem>
{/each}
```

**Row Selection**: Add `RowSelectionState` and `onRowSelectionChange`, use `renderComponent` with checkbox:

```ts
let rowSelection = $state<RowSelectionState>({});
const table = createSvelteTable({
  state: { get rowSelection() { return rowSelection; } },
  onRowSelectionChange: (updater) => { rowSelection = typeof updater === "function" ? updater(rowSelection) : updater; },
});

// In columns:
{
  id: "select",
  header: ({ table }) => renderComponent(Checkbox, {
    checked: table.getIsAllPageRowsSelected(),
    indeterminate: table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected(),
    onCheckedChange: (value) => table.toggleAllPageRowsSelected(!!value),
  }),
  cell: ({ row }) => renderComponent(Checkbox, {
    checked: row.getIsSelected(),
    onCheckedChange: (value) => row.toggleSelected(!!value),
  }),
  enableSorting: false,
  enableHiding: false,
}
```

Display selected count: `{table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.`
