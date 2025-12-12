# Components

Comprehensive collection of 60+ reusable UI components built on Bits UI, Embla Carousel, LayerChart, and other libraries. Each component is installable via CLI and composable with subcomponents.

## Installation Pattern

All components install via:
```bash
npx shadcn-svelte@latest add <component> -y -o
```
Flags: `-y` skips confirmation, `-o` overwrites existing files.

## Core Components

**Accordion** - Vertically stacked interactive headings with single/multiple open items. Root/Item/Trigger/Content subcomponents. WAI-ARIA accessible.

**Alert** - Callout component with Root/Title/Description. Supports default and destructive variants.

**Alert Dialog** - Modal dialog interrupting user with important content. Root/Trigger/Content/Header/Title/Description/Footer/Cancel/Action subcomponents.

**Avatar** - Image element with fallback text. Root/Image/Fallback. Supports custom styling and grouped avatars with negative spacing.

**Badge** - Small label component with variants (default, secondary, destructive, outline). Use `badgeVariants` helper to style links as badges.

**Breadcrumb** - Hierarchical navigation path. Root/List/Item/Link/Page/Separator/Ellipsis. Supports custom separators, dropdowns, ellipsis collapse, and responsive desktop/mobile variants via MediaQuery and Drawer/DropdownMenu composition.

**Button** - Clickable action element with variants (primary, secondary, destructive, outline, ghost, link). Supports `href` prop for links, icons, and loading state via Spinner. Use `buttonVariants` helper to style elements as buttons.

**Button Group** - Container grouping related buttons with consistent styling. Supports vertical orientation, separators, nesting. Composable with Input, Select, DropdownMenu, Popover, InputGroup.

**Calendar** - Date selection component with single/range selection, dropdown month/year navigation, popover integration, natural language parsing support (chrono-node), and date constraints (minValue/maxValue).

**Card** - Container with Root/Header/Title/Description/Action/Content/Footer subcomponents. Flexible layout for displaying grouped content.

**Carousel** - Embla-based image carousel with sizing, spacing, vertical/horizontal orientation, options, API for state tracking, events, and plugin support (autoplay).

**Chart** - LayerChart-based customizable charts with composition design, CSS variable theming, and tooltip support. Define data and config separately, build charts using LayerChart components directly.

**Checkbox** - Toggle control with checked/disabled states, data-attribute styling, and sveltekit-superforms integration.

**Collapsible** - Expandable/collapsible panel with Root/Trigger/Content subcomponents.

**Combobox** - Searchable dropdown built from Popover + Command. Supports icons, form integration, keyboard navigation with refocus pattern. Example: status selector with icons, dropdown menu with combobox submenu, form integration with validation.

**Command** - Fast, composable command menu with Root/Input/List/Empty/Group/Item/Separator/Shortcut/Dialog variants. Supports grouped items, shortcuts, disabled state, auto-styled icons.

**Context Menu** - Right-click triggered menu with items, submenus, checkboxes, radio groups, separators, keyboard shortcuts.

**Data Table** - TanStack Table v8 integration with pagination, sorting, filtering, column visibility, row selection. Custom cell rendering via `createRawSnippet`/`renderSnippet`. Row actions via `renderComponent`. Complete example with all features.

**Date Picker** - Popover-based date picker combining Popover and Calendar/RangeCalendar. Supports single/range selection, presets via Select, dropdown month navigation, date constraints, form validation integration.

**Dialog** - Modal overlay with Root/Trigger/Content/Header/Title/Description/Footer subcomponents.

**Drawer** - Slide-out panel built on Vaul Svelte. Root/Trigger/Content/Header/Title/Description/Footer/Close. Responsive Dialog/Drawer switching via MediaQuery for desktop/mobile.

**Dropdown Menu** - Menu triggered by button with items, groups, checkboxes, radio groups, submenus, shortcuts, disabled states.

**Empty** - Empty state component with customizable media (icon/avatar), title, description, content sections. Supports outline/gradient styling and various content types (buttons, InputGroup, links).

**Field** - Accessible form field wrapper supporting vertical/horizontal/responsive layouts with labels, descriptions, errors, semantic grouping. Examples: input fields, textarea, select, slider, checkbox group, radio group, switch, choice cards, field groups with separators, complex payment form.

**Form** - Composable form components with Zod validation, ARIA attributes, Superforms integration. Field/Control/Label/Description/FieldErrors/Button/Fieldset/Legend subcomponents. Complete SPA and server-side examples.

**Hover Card** - Preview content on hover for sighted users. Root/Trigger/Content. Trigger accepts link attributes (href, target, rel).

**Input** - Form input field supporting email, file, disabled, invalid states, labels, helper text, buttons. Form validation with sveltekit-superforms.

**Input Group** - Container for adding icons, text, buttons, tooltips, dropdowns, spinners to inputs/textareas. Root/Input/Textarea/Addon/Text/Button. Addon alignment: inline-end (default), block-start, block-end. Examples: icons, text prefixes/suffixes, buttons, tooltips, textarea with labels, dropdowns, button groups, custom inputs via data-slot attribute.

**Input OTP** - Accessible one-time password component with configurable length, pattern validation (REGEXP_ONLY_DIGITS_AND_CHARS), separators, error states, form integration.

**Item** - Flex container for displaying content with title, description, actions. Root/Header/Media/Content/Title/Description/Actions/Footer/Group/Separator. Variants: default, outline, muted. Sizes: default, sm. Media variants: icon, avatar, image. Supports grouping, links via child snippet, dropdown integration.

**Kbd** - Keyboard input display. Root for single keys, Group for multiple keys. Examples: in buttons, tooltips, input groups.

**Label** - Accessible label associated with form controls via `for` attribute.

**Menubar** - Desktop menubar with menus, submenus, separators, shortcuts, checkboxes, radio buttons. Root/Menu/Trigger/Content/Item/Shortcut/Separator/Sub/SubTrigger/SubContent/CheckboxItem/RadioGroup/RadioItem.

**Native Select** - Styled native HTML select with grouping, disabled states, validation, accessibility. Root/Option/OptGroup. Prefer over Select for native behavior and mobile optimization.

**Navigation Menu** - Collection of links for navigating websites. Root/List/Item/Trigger/Content/Link. Supports custom layouts, icons, responsive grids. Use `navigationMenuTriggerStyle()` utility for trigger styling.

**Pagination** - Paginated content navigation with configurable items-per-page, sibling count, previous/next buttons, ellipsis support. Root/Content/Item/PrevButton/NextButton/Link/Ellipsis. Responsive-friendly with snippet-based rendering.

**Popover** - Portal popover triggered by button. Root/Trigger/Content. Displays rich content.

**Progress** - Progress bar indicator with reactive value and max props.

**Radio Group** - Set of radio buttons where only one can be checked. Root/Item. Form integration with sveltekit-superforms.

**Range Calendar** - Date range picker built on Bits UI, uses @internationalized/date.

**Resizable** - Accessible resizable panel groups with horizontal/vertical layouts, keyboard support, nested pane support via PaneForge. PaneGroup/Pane/Handle with direction, defaultSize, withHandle props.

**Scroll Area** - Custom-styled scrollable container with vertical, horizontal, or bidirectional scrolling via `orientation` prop.

**Select** - Dropdown selector with single selection, grouping, disabled items, form integration. Root/Trigger/Content/Group/Label/Item. Dynamic content with $derived for trigger text. Form validation with sveltekit-superforms.

**Separator** - Visual/semantic content divider. Horizontal (default) or vertical via `orientation` prop.

**Sheet** - Dialog-based overlay sliding from screen edges (top/right/bottom/left). Root/Trigger/Content/Header/Title/Description/Footer/Close. Customizable size via CSS classes on Content.

**Sidebar** - Composable, themeable, customizable sidebar with Provider/Root/Header/Content/Footer/Trigger. Supports left/right, sidebar/floating/inset variants, offcanvas/icon/none collapse modes. useSidebar hook for state. Menu with Button/Action/Sub/Badge/Skeleton. Collapsible groups/menus via Collapsible. OKLch CSS variables for theming. Width customization via CSS variables or constants.

**Skeleton** - Placeholder component for loading states. Styled with Tailwind classes for size, shape, spacing.

**Slider** - Range input with single/multiple thumbs, horizontal/vertical orientation, configurable step and max value.

**Sonner** - Toast notification component with success/error variants, descriptions, action buttons. Dark mode support via system preferences or theme prop. Add Toaster to root layout.

**Spinner** - Loading state indicator. Customize size/color with utility classes or replace icon. Integrates with Button, Badge, InputGroup, Empty, Item components.

**Switch** - Toggle control with form integration, disabled/readonly states, sveltekit-superforms support.

**Table** - Responsive table with Root/Caption/Header/Body/Footer/Row/Head/Cell subcomponents. Supports dynamic data rendering, colspan, Tailwind styling.

**Tabs** - Tabbed interface with Root/List/Trigger/Content subcomponents. Activate tabs by matching value props.

**Textarea** - Multi-line text input with disabled state, labels, form validation integration.

**Toggle** - Two-state button with outline/default variants, sm/default/lg sizes, disabled state, icon/text content support.

**Toggle Group** - Set of two-state buttons with single/multiple selection modes, outline variant, sm/lg sizes, disabled state.

**Tooltip** - Hover/focus popup. Root/Trigger/Content. Wrap app in Tooltip.Provider (once in root layout). Supports nested providers with custom `delayDuration`.

**Typography** - Utility-based text styles for headings (h1-h4), paragraphs (standard, lead, large, small, muted), blockquotes, lists, tables, inline code using Tailwind classes.
