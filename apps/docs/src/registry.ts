import type React from 'react'

import * as actions from './examples/actions'
import * as content from './examples/content'
import * as data from './examples/data'
import * as feedback from './examples/feedback'
import * as forms from './examples/forms'
import * as layout from './examples/layout'
import * as navigation from './examples/navigation'
import * as overlays from './examples/overlays'
import * as platform from './examples/platform'
import * as primitives from './examples/primitives'
import * as social from './examples/social'
import * as surfaces from './examples/surfaces'

export interface PropDoc {
  name: string
  type: string
  default?: string
  description: string
}

export interface ExampleDoc {
  title: string
  description?: string
  /** Example file (without extension) and exported function name, used to show the source. */
  file: string
  name: string
  render: React.ComponentType
  /** `frame` renders full-page layouts inside a fixed-height box. */
  preview?: 'inline' | 'frame'
}

export interface ComponentDoc {
  id: string
  name: string
  group: string
  summary: string
  /** Names to import from the package. */
  imports: string[]
  examples: ExampleDoc[]
  /** Props tables, one per component when an entry covers several. */
  props?: Array<{ component: string; rows: PropDoc[] }>
}

const p = (name: string, type: string, def: string | undefined, description: string): PropDoc => ({
  name,
  type,
  default: def,
  description,
})

const CONTROLLED = (valueType: string, what: string): PropDoc[] => [
  p('value', valueType, undefined, `Controlled ${what}.`),
  p('defaultValue', valueType, undefined, `Initial ${what} when uncontrolled.`),
  p(
    'onValueChange',
    `(value: ${valueType}) => void`,
    undefined,
    `Called when the ${what} changes.`
  ),
]

const OPEN: PropDoc[] = [
  p('open', 'boolean', undefined, 'Controlled open state.'),
  p('defaultOpen', 'boolean', 'false', 'Initial open state when uncontrolled.'),
  p('onOpenChange', '(open: boolean) => void', undefined, 'Called when it opens or closes.'),
]

function ex<M extends Record<string, unknown>>(
  file: string,
  mod: M,
  name: keyof M & string,
  title: string,
  extra?: Partial<ExampleDoc>
): ExampleDoc {
  return { file, name, title, render: mod[name] as React.ComponentType, ...extra }
}

export const GROUPS = [
  'Actions',
  'Overlays',
  'Navigation',
  'Forms',
  'Feedback',
  'Data display',
  'Content',
  'Layout',
  'Theming',
] as const

export const COMPONENTS: ComponentDoc[] = [
  /* ---------------------------------------------------------- Actions */
  {
    id: 'button',
    name: 'Button',
    group: 'Actions',
    summary:
      'Buttons for actions, in seven variants (glass for use over images and gradients) and three sizes, with icons and a loading state. IconButton is the square, icon-only version and needs an aria-label.',
    imports: ['Button', 'IconButton'],
    examples: [
      ex('actions', actions, 'ButtonVariants', 'Variants'),
      ex('actions', actions, 'ButtonStates', 'Sizes, icons and loading'),
      ex('actions', actions, 'IconButtons', 'Icon buttons'),
    ],
    props: [
      {
        component: 'Button',
        rows: [
          p(
            'variant',
            "'primary' | 'secondary' | 'outline' | 'ghost' | 'glass' | 'danger' | 'danger-outline'",
            "'primary'",
            'Visual weight. Use one primary per area.'
          ),
          p(
            'size',
            "'sm' | 'md' | 'lg' | 'icon'",
            "'md'",
            'Height and padding. md meets the 44px touch target.'
          ),
          p('loading', 'boolean', 'false', 'Shows a spinner and disables the button.'),
          p('leftIcon / rightIcon', 'ReactNode', undefined, 'Icons before or after the label.'),
          p('…button attributes', 'ButtonHTMLAttributes', undefined, 'type defaults to "button".'),
        ],
      },
      {
        component: 'IconButton',
        rows: [
          p('icon', 'ReactNode', undefined, 'The icon. Required.'),
          p(
            'aria-label',
            'string',
            undefined,
            'What the button does. Required, since there is no visible text.'
          ),
          p('variant', 'Same as Button', "'secondary'", 'Visual weight.'),
        ],
      },
    ],
  },
  {
    id: 'tooltip',
    name: 'Tooltip',
    group: 'Actions',
    summary:
      'A short label shown on hover and focus. Use it to name icon buttons, not for essential information.',
    imports: ['Tooltip'],
    examples: [ex('actions', actions, 'TooltipSides', 'Sides')],
    props: [
      {
        component: 'Tooltip',
        rows: [
          p('content', 'ReactNode', undefined, 'The tooltip text.'),
          p('side', "'top' | 'bottom' | 'left' | 'right'", "'top'", 'Where it appears.'),
          p('delayDuration', 'number', '200', 'Hover delay in ms. Focus shows it immediately.'),
          p('children', 'ReactElement', undefined, 'The element it describes.'),
        ],
      },
    ],
  },

  /* --------------------------------------------------------- Overlays */
  {
    id: 'hover-card',
    name: 'HoverCard',
    group: 'Overlays',
    summary:
      "A preview on hover or keyboard focus, such as a creator's profile on their name. It only supplements the link, so touch screens just follow it. ProfilePreview is the standard content.",
    imports: ['HoverCard', 'ProfilePreview'],
    examples: [ex('social', social, 'HoverCardExample', 'Creator preview')],
    props: [
      {
        component: 'HoverCard',
        rows: [
          p('children', 'ReactElement', undefined, 'The trigger, ideally a link.'),
          p('content', 'ReactNode', undefined, 'What the card shows.'),
          p('openDelay / closeDelay', 'number', '450 / 200', 'Milliseconds.'),
          p(
            'side / align',
            "'top' | 'bottom' / 'start' | 'center' | 'end'",
            "'bottom' / 'start'",
            'Placement.'
          ),
        ],
      },
      {
        component: 'ProfilePreview',
        rows: [
          p('name / handle / avatar / initials / banner', '', undefined, 'Who.'),
          p('bio / stats / action', '', undefined, 'Details and a follow button.'),
        ],
      },
    ],
  },
  {
    id: 'dropdown-menu',
    name: 'DropdownMenu',
    group: 'Overlays',
    summary:
      'A menu that opens from a trigger. Arrow keys move between items, Escape and outside clicks close it, and items close it when chosen. Rendered in a portal, so it is never clipped.',
    imports: ['DropdownMenu', 'MenuItem', 'MenuLabel', 'MenuSeparator', 'Menu'],
    examples: [ex('overlays', overlays, 'DropdownBasic', 'Actions and a single-choice menu')],
    props: [
      {
        component: 'DropdownMenu',
        rows: [
          p(
            'trigger',
            'ReactElement',
            undefined,
            'The button that opens it. It receives aria-expanded and onClick.'
          ),
          p('align', "'start' | 'center' | 'end'", "'end'", 'Horizontal alignment to the trigger.'),
          p('side', "'top' | 'bottom'", "'bottom'", 'Preferred side; flips when there is no room.'),
          ...OPEN,
        ],
      },
      {
        component: 'MenuItem',
        rows: [
          p('icon', 'ReactNode', undefined, 'Leading icon.'),
          p('subtitle', 'ReactNode', undefined, 'Second line in muted text.'),
          p('trailing', 'ReactNode', undefined, 'Trailing content such as a Kbd shortcut.'),
          p('selected', 'boolean', undefined, 'Makes it a radio item with a check mark.'),
          p('danger', 'boolean', 'false', 'Destructive styling.'),
          p('href', 'string', undefined, 'Renders a link instead of a button.'),
          p('keepOpen', 'boolean', 'false', 'Keep the menu open after choosing.'),
        ],
      },
    ],
  },
  {
    id: 'popover',
    name: 'Popover',
    group: 'Overlays',
    summary:
      'A floating panel anchored to a trigger, for small forms and settings. Positioned against the trigger in a portal, flips above when there is no room below, and follows scrolling.',
    imports: ['Popover'],
    examples: [ex('overlays', overlays, 'PopoverForm', 'Settings with a close callback')],
    props: [
      {
        component: 'Popover',
        rows: [
          p('trigger', 'ReactElement', undefined, 'The element that toggles it.'),
          p(
            'children',
            'ReactNode | ({ close }) => ReactNode',
            undefined,
            'Content, or a function that receives close().'
          ),
          p('side', "'top' | 'bottom'", "'bottom'", 'Preferred side.'),
          p('align', "'start' | 'center' | 'end'", "'start'", 'Horizontal alignment.'),
          p('role', "'dialog' | 'menu' | 'listbox'", "'dialog'", 'ARIA role of the panel.'),
          p('className', 'string', undefined, 'Classes for the panel, e.g. "ui-menu w-72 p-4!".'),
          ...OPEN,
        ],
      },
    ],
  },
  {
    id: 'dialog',
    name: 'Dialog',
    group: 'Overlays',
    summary:
      'A modal for confirmations and short forms. Locks page scroll, closes on Escape and backdrop click, and renders above everything in a portal.',
    imports: ['Dialog'],
    examples: [
      ex('overlays', overlays, 'DialogConfirm', 'Confirmation'),
      ex('overlays', overlays, 'DialogForm', 'With a form'),
    ],
    props: [
      {
        component: 'Dialog',
        rows: [
          p('open', 'boolean', undefined, 'Whether it is shown.'),
          p(
            'onClose',
            '() => void',
            undefined,
            'Called on Escape, backdrop click or the close button.'
          ),
          p('title / description', 'string', undefined, 'Heading and supporting text.'),
          p('footer', 'ReactNode', undefined, 'Actions, right-aligned.'),
          p('maxWidth', "'sm' | 'md' | 'lg' | 'xl'", "'md'", 'Width of the dialog.'),
        ],
      },
    ],
  },
  {
    id: 'drawer',
    name: 'Drawer',
    group: 'Overlays',
    summary: 'A panel that slides in from an edge, for filters, details and secondary tasks.',
    imports: ['Drawer'],
    examples: [ex('overlays', overlays, 'DrawerSides', 'Right, left and bottom')],
    props: [
      {
        component: 'Drawer',
        rows: [
          p('open / onClose', 'boolean / () => void', undefined, 'Visibility and close handler.'),
          p('side', "'left' | 'right' | 'top' | 'bottom'", "'right'", 'Edge it slides from.'),
          p(
            'title / description / footer',
            'string / string / ReactNode',
            undefined,
            'Header and actions.'
          ),
        ],
      },
    ],
  },
  {
    id: 'toast',
    name: 'Toast',
    group: 'Overlays',
    summary:
      'Short confirmations in the corner. Wrap the app in ToastProvider, then call toast() from useToast().',
    imports: ['ToastProvider', 'useToast'],
    examples: [ex('overlays', overlays, 'Toasts', 'Tones and actions')],
    props: [
      {
        component: 'toast(options)',
        rows: [
          p('title', 'string', undefined, 'Bold first line.'),
          p('description', 'string', undefined, 'Required body text.'),
          p(
            'tone',
            "'default' | 'success' | 'warning' | 'destructive' | 'info'",
            "'default'",
            'Icon and colour.'
          ),
          p(
            'duration',
            'number',
            '4000',
            'Milliseconds before it hides. 0 keeps it until dismissed.'
          ),
          p('action', '{ label: string; onClick(): void }', undefined, 'A button, e.g. Undo.'),
        ],
      },
    ],
  },
  {
    id: 'command-palette',
    name: 'CommandPalette',
    group: 'Overlays',
    summary:
      'A ⌘K / Ctrl K quick-jump dialog: type to filter, arrow keys to move, Enter to run. CommandTrigger is the search-styled button that opens it.',
    imports: ['CommandPalette', 'CommandTrigger', 'type CommandItem'],
    examples: [ex('overlays', overlays, 'Commands', 'Grouped commands')],
    props: [
      {
        component: 'CommandPalette',
        rows: [
          p('open / onOpenChange', 'boolean / (open) => void', undefined, 'Controlled visibility.'),
          p(
            'items',
            'CommandItem[]',
            undefined,
            '{ id, label, group?, description?, icon?, keywords?, shortcut?, onSelect }.'
          ),
          p('placeholder', 'string', "'Jump to a page or action…'", 'Search field placeholder.'),
          p(
            'hotkey',
            'boolean',
            'true',
            'Register ⌘K / Ctrl K to toggle. Turn off if another palette owns it.'
          ),
        ],
      },
    ],
  },

  /* ------------------------------------------------------- Navigation */
  {
    id: 'carousel',
    name: 'Carousel',
    group: 'Navigation',
    summary:
      'A sideways-scrolling row (a shelf of works, featured items) on native scroll snapping. Swipes on touch, arrows on desktop, optional page dots. Items per view are responsive and can be fractional for a peek.',
    imports: ['Carousel'],
    examples: [ex('social', social, 'CarouselExample', 'A shelf of comics')],
    props: [
      {
        component: 'Carousel',
        rows: [
          p('title / action', 'ReactNode', undefined, 'Shelf heading and a link beside it.'),
          p('perView', 'Responsive<number>', '{ base: 1.2, sm: 2.2, lg: 4 }', 'Items across.'),
          p('gap', 'number | string', '4', 'Space between items.'),
          p('arrows', 'boolean', 'true', 'Previous / next buttons (hidden on touch).'),
          p('dots', 'boolean', 'false', 'Page dots.'),
          p('label', 'string', undefined, 'Accessible name without a title.'),
        ],
      },
    ],
  },
  {
    id: 'app-switcher',
    name: 'AppSwitcher',
    group: 'Navigation',
    summary: 'Grid button that switches between related apps (the public site and Backstage).',
    imports: ['AppSwitcher', 'type AppItem'],
    examples: [ex('navigation', navigation, 'AppSwitcherExample', 'Controlled')],
    props: [
      {
        component: 'AppSwitcher',
        rows: [
          p(
            'apps',
            'AppItem[]',
            'Dynamic Lab and Backstage',
            '{ id, name, description?, icon?, href?, onClick? }.'
          ),
          ...CONTROLLED('string', 'current app id'),
          p('align', "'start' | 'end'", "'end'", 'Menu alignment.'),
        ],
      },
    ],
  },
  {
    id: 'user-menu',
    name: 'UserMenu',
    group: 'Navigation',
    summary: 'Avatar and name that open the account menu. Children are MenuItems.',
    imports: ['UserMenu'],
    examples: [ex('navigation', navigation, 'UserMenuExample', 'Account menu')],
    props: [
      {
        component: 'UserMenu',
        rows: [
          p('name / email', 'string', undefined, 'Shown on the trigger and in the menu header.'),
          p(
            'avatarSrc / initials',
            'string',
            undefined,
            'Avatar image, or initials (derived from name by default).'
          ),
          p('meta', 'ReactNode', undefined, 'Extra line in the header, e.g. a role Badge.'),
          p('compact', 'boolean', 'false', 'Avatar only.'),
        ],
      },
    ],
  },
  {
    id: 'sidebar-nav',
    name: 'SidebarNav',
    group: 'Navigation',
    summary:
      'Grouped vertical navigation with an active rail and badges. With collapsible it folds into a single button below the lg breakpoint.',
    imports: ['SidebarNav', 'SidebarNavGroup', 'SidebarNavItem'],
    examples: [ex('navigation', navigation, 'SidebarExample', 'Collapsible on small screens')],
    props: [
      {
        component: 'SidebarNav',
        rows: [
          p('title', 'ReactNode', undefined, 'Heading at the top.'),
          p(
            'collapsible',
            'boolean',
            'false',
            'Fold behind a button below lg; always open from lg up.'
          ),
          p('currentLabel', 'ReactNode', undefined, 'Active page, shown on the collapsed button.'),
          p(
            'variant',
            "'card' | 'plain'",
            "'card'",
            'Glass card, or plain inside an AdminSidebar.'
          ),
        ],
      },
      {
        component: 'SidebarNavItem',
        rows: [
          p('active', 'boolean', 'false', 'Marks the current page (aria-current).'),
          p('icon', 'ReactNode', undefined, 'Leading icon.'),
          p('badge', 'string | number', undefined, 'Count on the right.'),
          p(
            'href',
            'string',
            undefined,
            'Renders a link; without it, a button for client-side routing.'
          ),
        ],
      },
    ],
  },
  {
    id: 'pill-nav',
    name: 'PillNav',
    group: 'Navigation',
    summary: 'Segmented pill links for sections within a page.',
    imports: ['PillNav', 'PillNavLink'],
    examples: [ex('navigation', navigation, 'PillNavExample', 'Sections')],
    props: [
      {
        component: 'PillNavLink',
        rows: [
          p('active', 'boolean', 'false', 'Current section.'),
          p('icon', 'ReactNode', undefined, 'Leading icon.'),
          p('href', 'string', undefined, 'Link, or a button without it.'),
        ],
      },
    ],
  },
  {
    id: 'tabs',
    name: 'Tabs',
    group: 'Navigation',
    summary: 'Switch between views. Pill tabs for panels, line tabs for page sections.',
    imports: ['Tabs', 'TabsList', 'TabsTrigger', 'TabsContent'],
    examples: [ex('navigation', navigation, 'TabsExample', 'Pill and line')],
    props: [
      {
        component: 'Tabs',
        rows: [
          ...CONTROLLED('string', 'active tab'),
          p('variant', "'pill' | 'line'", "'pill'", 'Visual style.'),
        ],
      },
    ],
  },
  {
    id: 'breadcrumb',
    name: 'Breadcrumb',
    group: 'Navigation',
    summary: 'Where the current page sits in the hierarchy.',
    imports: [
      'Breadcrumb',
      'BreadcrumbList',
      'BreadcrumbItem',
      'BreadcrumbLink',
      'BreadcrumbEllipsis',
      'BreadcrumbPage',
      'BreadcrumbSeparator',
    ],
    examples: [ex('navigation', navigation, 'BreadcrumbExample', 'Three levels')],
  },
  {
    id: 'pagination',
    name: 'Pagination',
    group: 'Navigation',
    summary: 'Page controls for long lists and tables.',
    imports: [
      'Pagination',
      'PaginationContent',
      'PaginationItem',
      'PaginationLink',
      'PaginationPrevious',
      'PaginationNext',
      'PaginationEllipsis',
    ],
    examples: [ex('navigation', navigation, 'PaginationExample', 'With ellipsis')],
    props: [
      {
        component: 'PaginationLink',
        rows: [
          p('isActive', 'boolean', 'false', 'Current page.'),
          p('disabled', 'boolean', 'false', 'Not clickable.'),
        ],
      },
    ],
  },
  {
    id: 'segmented-control',
    name: 'SegmentedControl',
    group: 'Navigation',
    summary: 'A single-choice toggle group for views and modes, with arrow-key navigation.',
    imports: ['SegmentedControl'],
    examples: [ex('navigation', navigation, 'SegmentedExample', 'With icons and small')],
    props: [
      {
        component: 'SegmentedControl',
        rows: [
          p('options', '{ value, label, icon?, disabled? }[]', undefined, 'The choices.'),
          ...CONTROLLED('string', 'selected option'),
          p('size', "'sm' | 'md'", "'md'", 'Height.'),
          p('fullWidth', 'boolean', 'false', 'Stretch with equal segments.'),
        ],
      },
    ],
  },

  {
    id: 'bottom-nav',
    name: 'BottomNav',
    group: 'Navigation',
    summary:
      'The tab bar along the bottom of the screen on phones, with active state and badges. Fixed and safe-area aware; hidden from md up by default.',
    imports: ['BottomNav', 'BottomNavItem'],
    examples: [ex('platform', platform, 'BottomNavExample', 'Five tabs')],
    props: [
      {
        component: 'BottomNav',
        rows: [
          p('label', 'string', "'Main'", 'Accessible name.'),
          p('mobileOnly', 'boolean', 'true', 'Hide from md up.'),
        ],
      },
      {
        component: 'BottomNavItem',
        rows: [
          p('icon / label', 'ReactNode', undefined, 'Required.'),
          p('active', 'boolean', 'false', 'Sets aria-current="page".'),
          p('badge', 'number | boolean', undefined, 'Count or dot.'),
        ],
      },
    ],
  },
  /* ------------------------------------------------------------ Forms */
  {
    id: 'filter-chip',
    name: 'FilterChip',
    group: 'Forms',
    summary:
      'A toggleable filter with an optional count and icon, for narrowing lists. It is a toggle button (aria-pressed).',
    imports: ['FilterChip'],
    examples: [ex('forms', forms, 'FilterChips', 'Toggle filters')],
    props: [
      {
        component: 'FilterChip',
        rows: [
          p('active', 'boolean', 'false', 'Selected state.'),
          p('count', 'number | string', undefined, 'Count after the label.'),
          p('icon', 'ReactNode', undefined, 'Icon before the label.'),
          p('onDismiss', '() => void', undefined, 'Shows a remove button.'),
          p('…button attributes', 'ButtonHTMLAttributes', undefined, 'onClick toggles it.'),
        ],
      },
    ],
  },
  {
    id: 'combobox',
    name: 'Combobox',
    group: 'Forms',
    summary:
      'A text field with a filtered list: species, tags, creators. Type to filter, arrows and Enter to pick. Supports groups, multiple picks as chips, a maximum, creating new options, and server-side search.',
    imports: ['Combobox'],
    examples: [ex('social', social, 'ComboboxExample', 'Single, and multiple with create')],
    props: [
      {
        component: 'Combobox',
        rows: [
          p(
            'options',
            'Array<{ value, label, description?, icon?, group?, disabled? }>',
            undefined,
            'Required.'
          ),
          p(
            'value / defaultValue / onValueChange',
            'string | null, or string[] with multiple',
            undefined,
            'Selection.'
          ),
          p('multiple', 'boolean', 'false', 'Pick several; they show as chips.'),
          p('max', 'number', undefined, 'Most picks, with multiple.'),
          p('onCreate', '(label: string) => void', undefined, 'Offer to create the typed text.'),
          p(
            'inputValue / onInputChange',
            'string',
            undefined,
            'The typed text, for loading options from a server.'
          ),
          p(
            'filter',
            'false | (option, query) => boolean',
            'label + description',
            'false when options are already filtered.'
          ),
          p('loading / emptyText', 'boolean / ReactNode', undefined, 'States in the list.'),
          p('label / placeholder / error / disabled', '', undefined, 'Field basics.'),
        ],
      },
    ],
  },
  {
    id: 'date-picker',
    name: 'Calendar & DatePicker',
    group: 'Forms',
    summary:
      'A month grid for picking a day or a range, with event dots, min/max and disabled days, and a field that opens it. Locale-aware names and first day of the week; full keyboard support.',
    imports: ['Calendar', 'DatePicker', 'toDateKey'],
    examples: [ex('social', social, 'CalendarExample', 'Events, single and range')],
    props: [
      {
        component: 'Calendar',
        rows: [
          p('mode', "'single' | 'range'", "'single'", 'What is picked.'),
          p(
            'value / defaultValue / onValueChange',
            'Date | null, or { from, to }',
            undefined,
            'Selection.'
          ),
          p('minDate / maxDate', 'Date', undefined, 'Limits.'),
          p('isDateDisabled', '(date) => boolean', undefined, 'Unpickable days.'),
          p(
            'events',
            'Record<"YYYY-MM-DD", number>',
            undefined,
            'Days with a dot. Build keys with toDateKey.'
          ),
          p('eventLabel', 'string', "'events'", 'What events counts, for screen readers.'),
          p(
            'locale / weekStartsOn',
            'string / 0–6',
            'browser / locale',
            'Names and first weekday.'
          ),
        ],
      },
      {
        component: 'DatePicker',
        rows: [
          p('…Calendar props', '', undefined, 'Passed to the calendar.'),
          p('label / placeholder', 'ReactNode / string', undefined, 'Field text.'),
          p('clearable', 'boolean', 'true', 'Clear button.'),
          p(
            'dateStyle',
            "'short' | 'medium' | 'long' | 'full'",
            "'medium'",
            'Format in the field.'
          ),
        ],
      },
    ],
  },
  {
    id: 'image-cropper',
    name: 'ImageCropper',
    group: 'Forms',
    summary:
      'Frame part of an image by dragging, pinching or scrolling, for avatars and banners. cropImage turns the result into a Blob for upload.',
    imports: ['ImageCropper', 'cropImage'],
    examples: [ex('social', social, 'ImageCropperExample', 'Round avatar')],
    props: [
      {
        component: 'ImageCropper',
        rows: [
          p('src', 'string', undefined, 'Image or object URL. Required.'),
          p('aspect', 'number', '1', 'Width / height of the crop.'),
          p('shape', "'rect' | 'circle'", "'rect'", 'Guide shape.'),
          p('maxZoom', 'number', '4', 'Largest zoom.'),
          p('onCropChange', '(area: CropArea) => void', undefined, 'The area in image pixels.'),
          p('hideZoom', 'boolean', 'false', 'Hide the slider.'),
        ],
      },
      {
        component: 'cropImage(src, area, options?)',
        rows: [
          p('options.width', 'number', 'area width', 'Output width.'),
          p('options.type / quality', 'string / number', "'image/png'", 'Output format.'),
        ],
      },
    ],
  },
  {
    id: 'text-field',
    name: 'TextField',
    group: 'Forms',
    summary:
      'Labelled text input or textarea with helper text and errors. Input and Textarea are the bare controls.',
    imports: ['TextField', 'Input', 'Textarea'],
    examples: [ex('forms', forms, 'TextFields', 'Label, counter, icon and textarea')],
    props: [
      {
        component: 'TextField',
        rows: [
          p('label', 'string', undefined, 'Visible label, linked to the input.'),
          p('helperText', 'string', undefined, 'Muted text under the field.'),
          p(
            'error',
            'string',
            undefined,
            'Error message; replaces helperText and sets aria-invalid.'
          ),
          p('isTextarea / rows', 'boolean / number', 'false / 3', 'Render a textarea.'),
          p('startIcon / endIcon', 'ReactNode', undefined, 'Icons inside the input.'),
        ],
      },
    ],
  },
  {
    id: 'select',
    name: 'Select',
    group: 'Forms',
    summary:
      'A native select with the library styling, so it works with every keyboard and screen reader.',
    imports: ['Select'],
    examples: [ex('forms', forms, 'SelectExample', 'With label')],
    props: [
      {
        component: 'Select',
        rows: [
          p('options', '{ value, label }[]', undefined, 'Options; or pass <option> children.'),
          p('label', 'string', undefined, 'Visible label.'),
          p(
            'containerClassName',
            'string',
            undefined,
            'Classes for the wrapper (it is full width by default).'
          ),
        ],
      },
    ],
  },
  {
    id: 'switch-checkbox',
    name: 'Switch & Checkbox',
    group: 'Forms',
    summary:
      'Toggles for settings (Switch) and multi-select (Checkbox). Both work controlled or uncontrolled; Checkbox supports an indeterminate state for "select all".',
    imports: ['Switch', 'Checkbox'],
    examples: [ex('forms', forms, 'Toggles', 'Switches and select-all')],
    props: [
      {
        component: 'Switch',
        rows: [
          p('checked / defaultChecked', 'boolean', undefined, 'Controlled or initial state.'),
          p('onCheckedChange', '(checked: boolean) => void', undefined, 'Called on toggle.'),
          p('label / description', 'string', undefined, 'Text beside the switch.'),
        ],
      },
      {
        component: 'Checkbox',
        rows: [
          p('checked / defaultChecked', 'boolean', undefined, 'Controlled or initial state.'),
          p(
            'onCheckedChange',
            '(checked: boolean) => void',
            undefined,
            'Called on toggle (onChange also works).'
          ),
          p('indeterminate', 'boolean', 'false', 'Shows a dash, for partially selected groups.'),
          p('label / description', 'ReactNode / string', undefined, 'Text beside the box.'),
        ],
      },
    ],
  },
  {
    id: 'radio-group',
    name: 'RadioGroup',
    group: 'Forms',
    summary: 'One choice from a short list, as plain radios or selectable cards.',
    imports: ['RadioGroup', 'RadioGroupItem'],
    examples: [ex('forms', forms, 'Radios', 'Default and cards')],
    props: [
      {
        component: 'RadioGroup',
        rows: [
          ...CONTROLLED('string', 'selection'),
          p('label', 'string', undefined, 'Group label.'),
          p('orientation', "'vertical' | 'horizontal'", "'vertical'", 'Layout.'),
          p('variant', "'default' | 'card'", "'default'", 'Card draws tiles.'),
        ],
      },
      {
        component: 'RadioGroupItem',
        rows: [
          p('value', 'string', undefined, 'Value when chosen.'),
          p('label / description', 'ReactNode', undefined, 'Text.'),
          p('disabled', 'boolean', 'false', 'Not selectable.'),
        ],
      },
    ],
  },
  {
    id: 'file-input',
    name: 'FileInput',
    group: 'Forms',
    summary: 'A styled native file picker, or a drag-and-drop zone that lists the chosen files.',
    imports: ['FileInput'],
    examples: [ex('forms', forms, 'Files', 'Inline and dropzone')],
    props: [
      {
        component: 'FileInput',
        rows: [
          p('variant', "'inline' | 'dropzone'", "'inline'", 'Native picker or drop target.'),
          p('onFilesChange', '(files: File[]) => void', undefined, 'Called with the selection.'),
          p('multiple / accept', 'boolean / string', undefined, 'Native input options.'),
          p('label / helperText / error', 'string', undefined, 'Text around the field.'),
        ],
      },
    ],
  },
  {
    id: 'image-uploader',
    name: 'ImageUploader',
    group: 'Forms',
    summary:
      'Pick several images with previews, reorder them (drag, or arrow keys on the handle) and remove them. Previews use object URLs; upload the files yourself on save.',
    imports: ['ImageUploader', 'type UploadedImage'],
    examples: [ex('forms', forms, 'Images', 'Numbered comic pages')],
    props: [
      {
        component: 'ImageUploader',
        rows: [
          p(
            'value / onChange',
            'UploadedImage[] / (images) => void',
            undefined,
            '{ id, src, name?, size? }.'
          ),
          p('aspect', "'page' | 'portrait' | 'square' | 'video'", "'portrait'", 'Tile shape.'),
          p('numbered', 'boolean', 'false', 'Number each tile.'),
          p('firstLabel', 'string', undefined, 'Badge on the first image, e.g. "Cover".'),
          p('multiple / max', 'boolean / number', 'true', 'Allow several, up to max.'),
          p('noun', 'string', "'image'", 'Word used in labels ("page", "screenshot").'),
        ],
      },
    ],
  },
  {
    id: 'tag-input',
    name: 'TagInput',
    group: 'Forms',
    summary:
      'Booru-style tag entry. Enter, comma or Tab adds a tag, pasted lists split, and prefixes such as artist: or species: file tags under a category.',
    imports: ['TagInput', 'parseTag', 'type TagItem'],
    examples: [ex('forms', forms, 'Tags', 'With suggestions')],
    props: [
      {
        component: 'TagInput',
        rows: [
          p(
            'value / onChange',
            'TagItem[] / (tags) => void',
            undefined,
            '{ name, category?, count? }.'
          ),
          p('suggestions', 'TagItem[]', '[]', 'Autocomplete candidates, sorted by count.'),
          p(
            'minTags / maxTags',
            'number',
            undefined,
            'Reminder below the minimum; input disabled at the maximum.'
          ),
          p('defaultCategory', 'TagCategory', "'general'", 'Category for tags without a prefix.'),
        ],
      },
    ],
  },
  {
    id: 'markdown-editor',
    name: 'MarkdownEditor',
    group: 'Forms',
    summary:
      'A Markdown textarea with a formatting toolbar (⌘/Ctrl B, I, K), Write/Preview tabs and a word count. renderMarkdown outputs React nodes, never raw HTML.',
    imports: ['MarkdownEditor', 'renderMarkdown', 'countWords'],
    examples: [ex('forms', forms, 'Markdown', 'Chapter body')],
    props: [
      {
        component: 'MarkdownEditor',
        rows: [
          p('value / onChange', 'string / (value) => void', undefined, 'Controlled text.'),
          p('rows', 'number', '12', 'Textarea height.'),
          p(
            'previewStyle / previewClassName',
            'CSSProperties / string',
            undefined,
            'Match the reader typography in preview.'
          ),
          p('showWordCount', 'boolean', 'true', 'Word count under the editor.'),
        ],
      },
    ],
  },
  {
    id: 'sortable-list',
    name: 'SortableList',
    group: 'Forms',
    summary:
      'Reorderable items. Dragging starts only from the handle so inputs stay usable; focusing the handle and pressing arrow keys moves an item, and moves are announced.',
    imports: ['SortableList', 'DragHandle'],
    examples: [ex('forms', forms, 'Sortable', 'Chapters')],
    props: [
      {
        component: 'SortableList',
        rows: [
          p(
            'items / onReorder',
            'T[] / (items: T[]) => void',
            undefined,
            'Items and the new order.'
          ),
          p('getKey', '(item: T) => string', undefined, 'Stable key.'),
          p(
            'renderItem',
            '(item, api) => ReactNode',
            undefined,
            'api has index, handleProps, moveUp, moveDown.'
          ),
          p('getLabel', '(item, index) => string', undefined, 'Name used in announcements.'),
          p('layout', "'list' | 'grid'", "'list'", 'Grid uses left/right keys too.'),
        ],
      },
    ],
  },

  {
    id: 'slider',
    name: 'Slider',
    group: 'Forms',
    summary:
      'Pick a number from a range: reader font size, zoom, volume. A styled native range input with a label and value.',
    imports: ['Slider'],
    examples: [ex('platform', platform, 'Sliders', 'Reader font size')],
    props: [
      {
        component: 'Slider',
        rows: [
          ...CONTROLLED('number', 'value'),
          p('min / max / step', 'number', '0 / 100 / 1', 'Range.'),
          p('label', 'ReactNode', undefined, 'Visible label.'),
          p('showValue', 'boolean | (value) => ReactNode', 'false', 'Show (and format) the value.'),
          p('marks', '[ReactNode, ReactNode]', undefined, 'Text under each end.'),
        ],
      },
    ],
  },
  /* --------------------------------------------------------- Feedback */
  {
    id: 'status-badge',
    name: 'StatusBadge',
    group: 'Feedback',
    summary: 'Workflow state with a coloured dot (draft, in review, published…).',
    imports: ['StatusBadge'],
    examples: [ex('feedback', feedback, 'StatusBadges', 'Tones')],
    props: [
      {
        component: 'StatusBadge',
        rows: [
          p(
            'tone',
            "'neutral' | 'warning' | 'success' | 'danger' | 'info'",
            "'neutral'",
            'Colour.'
          ),
          p('pulse', 'boolean', 'false', 'Animated dot for live states.'),
          p('showDot', 'boolean', 'true', 'Hide the dot.'),
        ],
      },
    ],
  },
  {
    id: 'badge',
    name: 'Badge',
    group: 'Feedback',
    summary: 'A compact label for roles, product names, counts and categories.',
    imports: ['Badge'],
    examples: [ex('feedback', feedback, 'Badges', 'Variants')],
    props: [
      {
        component: 'Badge',
        rows: [
          p(
            'variant',
            "'primary' | 'solid' | 'neutral' | 'outline' | 'success' | 'warning' | 'danger'",
            "'primary'",
            'Colour.'
          ),
          p('size', "'sm' | 'md'", "'md'", 'Size.'),
          p('icon', 'ReactNode', undefined, 'Leading icon.'),
        ],
      },
    ],
  },
  {
    id: 'notice-panel',
    name: 'NoticePanel',
    group: 'Feedback',
    summary: 'An inline message about the page or a recent action, optionally dismissible.',
    imports: ['NoticePanel'],
    examples: [ex('feedback', feedback, 'Notices', 'Tones and dismiss')],
    props: [
      {
        component: 'NoticePanel',
        rows: [
          p('tone', "'info' | 'success' | 'warning' | 'destructive'", "'info'", 'Colour and icon.'),
          p('title', 'string', undefined, 'Bold first line.'),
          p('onDismiss', '() => void', undefined, 'Shows a close button.'),
        ],
      },
    ],
  },
  {
    id: 'site-banner',
    name: 'SiteBanner',
    group: 'Feedback',
    summary: 'A full-width strip above the site chrome for site-wide announcements.',
    imports: ['SiteBanner'],
    examples: [ex('feedback', feedback, 'Banner', 'Warning and primary')],
    props: [
      {
        component: 'SiteBanner',
        rows: [
          p('tone', "'warning' | 'info' | 'primary' | 'danger'", "'warning'", 'Colour.'),
          p('icon / action', 'ReactNode', undefined, 'Leading icon and trailing button.'),
          p('onDismiss', '() => void', undefined, 'Close button.'),
        ],
      },
    ],
  },
  {
    id: 'progress',
    name: 'Progress & Spinner',
    group: 'Feedback',
    summary: 'Determinate and indeterminate progress bars, and a spinner for short waits.',
    imports: ['Progress', 'Spinner'],
    examples: [ex('feedback', feedback, 'ProgressExample', 'Upload, processing, loading')],
    props: [
      {
        component: 'Progress',
        rows: [
          p('value', 'number', undefined, '0–100; omit for indeterminate.'),
          p('label / showValue', 'string / boolean', undefined, 'Text above the bar.'),
          p('tone', "'primary' | 'success' | 'warning' | 'danger'", "'primary'", 'Colour.'),
          p('size', "'sm' | 'md'", "'md'", 'Height.'),
        ],
      },
      {
        component: 'Spinner',
        rows: [
          p('size', "'sm' | 'md' | 'lg'", "'md'", 'Size.'),
          p(
            'label / showLabel',
            'string / boolean',
            "'Loading' / false",
            'Accessible label, optionally visible.'
          ),
        ],
      },
    ],
  },
  {
    id: 'skeleton',
    name: 'Skeleton',
    group: 'Feedback',
    summary: 'Shimmering placeholders while content loads.',
    imports: ['Skeleton', 'SkeletonText', 'SkeletonAvatar', 'SkeletonCard'],
    examples: [ex('feedback', feedback, 'Skeletons', 'Profile placeholder')],
  },
  {
    id: 'empty-state',
    name: 'EmptyState',
    group: 'Feedback',
    summary: 'What to show when a list or search has nothing in it, with a way forward.',
    imports: ['EmptyState'],
    examples: [ex('feedback', feedback, 'Empty', 'No results')],
    props: [
      {
        component: 'EmptyState',
        rows: [
          p('icon', 'ReactNode', 'Folder icon', 'Hero icon.'),
          p('title / description', 'string', undefined, 'Text.'),
          p('action', 'ReactNode', undefined, 'Button.'),
          p('variant', "'panel' | 'card' | 'plain'", "'panel'", 'Frame.'),
        ],
      },
    ],
  },
  {
    id: 'age-rating',
    name: 'AgeRating & AgeGate',
    group: 'Feedback',
    summary:
      'General / Teen / Mature badges, and a gate that blurs content above the viewer’s allowed rating until they choose to reveal it.',
    imports: ['AgeRating', 'AgeGate', 'AGE_RATING_INFO'],
    examples: [
      ex('feedback', feedback, 'Ratings', 'Badges'),
      ex('feedback', feedback, 'Gate', 'Gated artwork'),
    ],
    props: [
      {
        component: 'AgeRating',
        rows: [
          p('rating', "'general' | 'suggestive' | 'mature'", undefined, 'The rating.'),
          p('variant', "'badge' | 'full'", "'badge'", 'Full adds the description.'),
        ],
      },
      {
        component: 'AgeGate',
        rows: [
          p('rating', 'AgeRatingValue', undefined, 'Rating of the content.'),
          p(
            'allowed',
            'AgeRatingValue[]',
            "['general', 'suggestive']",
            'Ratings shown without the gate.'
          ),
        ],
      },
    ],
  },
  {
    id: 'kbd',
    name: 'Kbd',
    group: 'Feedback',
    summary: 'Keyboard keys and shortcuts.',
    imports: ['Kbd'],
    examples: [ex('feedback', feedback, 'Keys', 'Inline shortcuts')],
    props: [
      {
        component: 'Kbd',
        rows: [
          p('keys', 'string[]', undefined, 'Several keys, e.g. ["⌘", "K"]; or pass children.'),
        ],
      },
    ],
  },

  /* ----------------------------------------------------- Data display */
  {
    id: 'charts',
    name: 'Sparkline, BarChart & StatTile',
    group: 'Data display',
    summary:
      'Simple single-series charts for creator analytics, in the primary colour. Hover or focus for values; screen readers get a summary or a hidden table.',
    imports: ['Sparkline', 'BarChart', 'StatTile'],
    examples: [ex('social', social, 'ChartsExample', 'Creator dashboard')],
    props: [
      {
        component: 'Sparkline',
        rows: [
          p('values', 'number[]', undefined, 'Required.'),
          p('label', 'string', undefined, 'What it measures. Required.'),
          p('labels', 'string[]', undefined, 'Per-point labels for the tooltip.'),
          p('area / endDot / interactive', 'boolean', 'true', 'Wash, last-value dot, tooltip.'),
          p('format / height', '(v) => string / number', 'toLocaleString / 40', ''),
        ],
      },
      {
        component: 'BarChart',
        rows: [
          p('data', 'Array<{ label, value }>', undefined, 'Required.'),
          p('label', 'string', undefined, 'Accessible name and table caption. Required.'),
          p('highlight', 'number', undefined, 'Index labelled at its cap; others a lighter step.'),
          p('height / format / showAllLabels / locale', '', undefined, ''),
        ],
      },
      {
        component: 'StatTile',
        rows: [
          p('label / value', 'string / number', undefined, 'Required.'),
          p('delta / deltaLabel', 'number / string', undefined, '0.12 = +12%.'),
          p('upIsGood', 'boolean', 'true', 'Colour of the delta.'),
          p('trend', 'number[]', undefined, 'Sparkline.'),
        ],
      },
    ],
  },
  {
    id: 'typography',
    name: 'Heading, Text & Link',
    group: 'Data display',
    summary:
      'Type with the theme built in. Heading separates its look (size) from its outline level; Text has sizes, tones, line clamping and mono; Link marks external links. VisuallyHidden and SkipLink are for screen readers.',
    imports: ['Heading', 'Text', 'Link', 'VisuallyHidden', 'SkipLink'],
    examples: [ex('platform', platform, 'TypographyExample', 'Sizes and tones')],
    props: [
      {
        component: 'Heading',
        rows: [
          p('level', '1 | 2 | 3 | 4 | 5 | 6', '2', 'The h1–h6 element.'),
          p('size', "'display' | '2xl' | 'xl' | 'lg' | 'md' | 'sm'", 'from level', 'Visual size.'),
          p(
            'tone',
            "'default' | 'muted' | 'primary' | 'success' | 'warning' | 'danger' | 'inherit'",
            "'default'",
            'Colour.'
          ),
        ],
      },
      {
        component: 'Text',
        rows: [
          p('as', "'p' | 'span' | 'div' | 'label' | 'small' | 'strong' | 'em'", "'p'", 'Element.'),
          p('size', "'xs' | 'sm' | 'md' | 'lg'", "'md'", 'Font size.'),
          p('weight', "'normal' | 'medium' | 'semibold' | 'bold'", undefined, 'Font weight.'),
          p('tone', 'Same as Heading', "'inherit'", 'Colour.'),
          p(
            'truncate / lines',
            'boolean / number',
            undefined,
            'One-line ellipsis, or clamp to n lines.'
          ),
          p('mono', 'boolean', 'false', 'Monospaced.'),
        ],
      },
      {
        component: 'Link',
        rows: [
          p('variant', "'default' | 'subtle'", "'default'", 'subtle keeps the surrounding colour.'),
          p('external', 'boolean', 'auto', 'New tab, icon and rel. Detected from http(s) hrefs.'),
        ],
      },
    ],
  },
  {
    id: 'list',
    name: 'List',
    group: 'Data display',
    summary:
      'Rows of related items, such as notifications, followers or settings, with leading media, a title and description, and trailing content. Rows can be links or buttons.',
    imports: ['List', 'ListItem'],
    examples: [ex('platform', platform, 'Lists', 'Notifications and settings')],
    props: [
      {
        component: 'List',
        rows: [
          p(
            'variant',
            "'plain' | 'divided' | 'inset'",
            "'divided'",
            'inset draws a card with dividers.'
          ),
          p('dense', 'boolean', 'false', 'Tighter rows.'),
          p('label', 'ReactNode', undefined, 'Heading above the list.'),
        ],
      },
      {
        component: 'ListItem',
        rows: [
          p('title', 'ReactNode', undefined, 'Required.'),
          p(
            'description / leading / trailing',
            'ReactNode',
            undefined,
            'Optional parts of the row.'
          ),
          p('href / onClick', 'string / handler', undefined, 'Makes the row a link or a button.'),
          p('selected / disabled', 'boolean', 'false', 'States.'),
          p('chevron', 'boolean', 'true for links', 'Show a chevron on interactive rows.'),
        ],
      },
    ],
  },
  {
    id: 'avatar-group',
    name: 'AvatarGroup',
    group: 'Data display',
    summary: 'Overlapping avatars for collaborators, followers and Lab members, with a +N counter.',
    imports: ['AvatarGroup'],
    examples: [ex('platform', platform, 'AvatarGroups', 'Max and total')],
    props: [
      {
        component: 'AvatarGroup',
        rows: [
          p(
            'avatars',
            'Array<{ src?, alt?, initials? }>',
            undefined,
            'The people to show. alt is read out.'
          ),
          p('max', 'number', '4', 'Avatars before the counter.'),
          p('total', 'number', 'avatars.length', 'Full count when only some are loaded.'),
          p('size', 'ProfileAvatar size', "'md'", 'Avatar size.'),
        ],
      },
    ],
  },
  {
    id: 'indicator',
    name: 'Indicator',
    group: 'Data display',
    summary:
      'A dot or count on the corner of an icon button or avatar, for unread messages, new activity or presence.',
    imports: ['Indicator'],
    examples: [ex('platform', platform, 'Indicators', 'Counts and a dot')],
    props: [
      {
        component: 'Indicator',
        rows: [
          p('count', 'number', undefined, 'Leave out for a dot. 0 hides it unless showZero.'),
          p('max', 'number', '99', 'Above this shows as "99+".'),
          p('tone', "'danger' | 'primary' | 'success' | 'neutral'", "'danger'", 'Colour.'),
          p(
            'placement',
            "'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'",
            "'top-right'",
            'Corner.'
          ),
          p('label', 'string', undefined, 'Read out by screen readers.'),
        ],
      },
    ],
  },
  {
    id: 'stepper',
    name: 'Stepper',
    group: 'Data display',
    summary:
      'Progress through a multi-step flow such as publishing or onboarding. Finished steps can be clickable; horizontal steppers stack on phones.',
    imports: ['Stepper'],
    examples: [ex('platform', platform, 'Steppers', 'Publishing flow and an error')],
    props: [
      {
        component: 'Stepper',
        rows: [
          p('steps', 'Array<{ label, description?, error? }>', undefined, 'Required.'),
          p('current', 'number', undefined, 'Index of the current step. Required.'),
          p('orientation', "'horizontal' | 'vertical'", "'horizontal'", 'Layout.'),
          p('onStepClick', '(index: number) => void', undefined, 'Makes finished steps clickable.'),
        ],
      },
    ],
  },
  {
    id: 'table',
    name: 'Table',
    group: 'Data display',
    summary: 'Data tables with hover, selection and horizontal scrolling. Denser in Backstage.',
    imports: [
      'Table',
      'TableHeader',
      'TableBody',
      'TableRow',
      'TableHead',
      'TableCell',
      'TableFooter',
      'TableCaption',
    ],
    examples: [ex('data', data, 'TableExample', 'Selectable rows')],
    props: [
      { component: 'TableRow', rows: [p('selected', 'boolean', 'false', 'Highlights the row.')] },
    ],
  },
  {
    id: 'metric-card',
    name: 'MetricCard',
    group: 'Data display',
    summary:
      'A number with a label and an optional change, for dashboards. Becomes a link with href.',
    imports: ['MetricCard'],
    examples: [ex('data', data, 'Metrics', 'With deltas')],
    props: [
      {
        component: 'MetricCard',
        rows: [
          p('label / value', 'string / string | number', undefined, 'The metric.'),
          p('delta', "{ value, direction: 'up' | 'down' }", undefined, 'Change badge.'),
          p('subtext', 'string', undefined, 'Line under the value.'),
          p('href', 'string', undefined, 'Makes it a link.'),
        ],
      },
    ],
  },
  {
    id: 'content-card',
    name: 'ContentCard',
    group: 'Data display',
    summary:
      'A browsable card for a creation: cover, rating, type, title, byline, tags and counts. Mature covers can be blurred while the details stay readable.',
    imports: ['ContentCard'],
    examples: [ex('data', data, 'Cards', 'Story, gated artwork and a page')],
    props: [
      {
        component: 'ContentCard',
        rows: [
          p('title / type / byline', 'ReactNode / string / ReactNode', undefined, 'Text.'),
          p(
            'cover',
            'string | ReactNode',
            undefined,
            'Image URL or a node; falls back to an icon.'
          ),
          p('rating', 'AgeRatingValue', undefined, 'Badge on the cover.'),
          p('blurCover', 'boolean', 'false', 'Blur the cover (title and stats stay visible).'),
          p('coverMeta', 'ReactNode', undefined, 'Fact on the cover, e.g. "24 pages".'),
          p('stats', '{ icon, value, label }[]', undefined, 'Counts under the title.'),
          p('tags / saved / bylineAvatar', 'string[] / boolean / string', undefined, 'Extras.'),
          p('href / onClick', 'string / () => void', undefined, 'Makes it interactive.'),
        ],
      },
    ],
  },
  {
    id: 'profile-avatar',
    name: 'ProfileAvatar',
    group: 'Data display',
    summary: 'User or Lab picture with initials fallback and a presence dot.',
    imports: ['ProfileAvatar'],
    examples: [ex('data', data, 'Avatars', 'Sizes, status and square')],
    props: [
      {
        component: 'ProfileAvatar',
        rows: [
          p('src / initials', 'string', undefined, 'Image, or initials when there is none.'),
          p('size', "'sm' | 'md' | 'lg' | 'xl' | '2xl'", "'md'", 'Size.'),
          p('shape', "'circle' | 'square'", "'circle'", 'Square for Labs.'),
          p('status', "'online' | 'offline' | 'busy' | 'away'", undefined, 'Presence dot.'),
        ],
      },
    ],
  },
  {
    id: 'workflow-timeline',
    name: 'WorkflowTimeline',
    group: 'Data display',
    summary: 'A vertical history of steps, e.g. a submission moving through review.',
    imports: ['WorkflowTimeline', 'WorkflowTimelineItem'],
    examples: [ex('data', data, 'Timeline', 'Review history')],
    props: [
      {
        component: 'WorkflowTimelineItem',
        rows: [
          p('title / time', 'string', undefined, 'Text.'),
          p('status', 'ReactNode', undefined, 'Badge on the right.'),
          p('completed / active', 'boolean', 'false', 'Marker style.'),
        ],
      },
    ],
  },
  {
    id: 'accordion',
    name: 'Accordion',
    group: 'Data display',
    summary: 'Expandable sections, one or several open at a time.',
    imports: ['Accordion', 'AccordionItem', 'AccordionTrigger', 'AccordionContent', 'Collapsible'],
    examples: [
      ex('data', data, 'AccordionExample', 'Single'),
      ex('data', data, 'CollapsibleExample', 'Collapsible: one section, your own trigger'),
    ],
    props: [
      {
        component: 'Accordion',
        rows: [
          p('type', "'single' | 'multiple'", "'single'", 'How many can be open.'),
          p('value / defaultValue / onValueChange', 'string | string[]', undefined, 'Open items.'),
        ],
      },
      {
        component: 'Collapsible',
        rows: [
          p(
            'trigger',
            'ReactNode',
            undefined,
            'What toggles it. A <button> gets the handler and aria-expanded; anything else is wrapped in one.'
          ),
          p('open / defaultOpen / onOpenChange', 'boolean', undefined, 'Open state.'),
        ],
      },
    ],
  },
  {
    id: 'description-list',
    name: 'DescriptionList',
    group: 'Data display',
    summary: 'Label / value pairs for metadata.',
    imports: ['DescriptionList'],
    examples: [ex('data', data, 'Details', 'Game details')],
    props: [
      {
        component: 'DescriptionList',
        rows: [
          p('items', '{ label, value, icon? }[]', undefined, 'Rows.'),
          p('layout', "'rows' | 'stacked'", "'rows'", 'Side by side or stacked.'),
        ],
      },
    ],
  },
  {
    id: 'tag-list',
    name: 'Tag & TagList',
    group: 'Data display',
    summary:
      'e621-style tags, coloured by category (artist, copyright, character, species, general, lore, meta), optionally grouped like a booru sidebar.',
    imports: ['Tag', 'TagList', 'TAG_CATEGORY_LABELS', 'type TagItem', 'type TagCategory'],
    examples: [ex('data', data, 'Tags', 'Grouped')],
    props: [
      {
        component: 'TagList',
        rows: [
          p('tags', 'TagItem[]', undefined, '{ name, category?, count?, href? }.'),
          p('grouped', 'boolean', 'false', 'Sections per category.'),
          p('onTagClick', '(tag) => void', undefined, 'Makes tags clickable.'),
        ],
      },
    ],
  },
  {
    id: 'media-gallery',
    name: 'MediaGallery & Lightbox',
    group: 'Data display',
    summary: 'Thumbnail grid that opens a full-screen, keyboard-navigable viewer.',
    imports: ['MediaGallery', 'Lightbox', 'type MediaItem'],
    examples: [ex('data', data, 'Gallery', 'Screenshots')],
    props: [
      {
        component: 'MediaGallery',
        rows: [
          p('items', '{ src, fullSrc?, alt?, caption? }[]', undefined, 'Images.'),
          p('columns', '2 | 3 | 4', '3', 'Columns from md up.'),
          p('aspect', "'video' | 'square' | 'portrait'", "'video'", 'Thumbnail shape.'),
        ],
      },
    ],
  },
  {
    id: 'local-date-time',
    name: 'LocalDateTime',
    group: 'Data display',
    summary: 'A date formatted in the viewer’s locale, in a <time> element.',
    imports: ['LocalDateTime'],
    examples: [ex('data', data, 'Dates', 'Short and long')],
  },
  {
    id: 'comment-thread',
    name: 'CommentThread',
    group: 'Data display',
    summary:
      'Comments with likes, one level of replies, a composer (⌘/Ctrl Enter to post) and a closed state.',
    imports: ['CommentThread', 'CommentComposer', 'type CommentData'],
    examples: [ex('data', data, 'Comments', 'Post, reply and like')],
    props: [
      {
        component: 'CommentThread',
        rows: [
          p(
            'comments',
            'CommentData[]',
            undefined,
            '{ id, author, body, createdAt, likes?, liked?, replies? }.'
          ),
          p('onAdd', '(body, parentId?) => void', undefined, 'New comment or reply.'),
          p('onLike', '(id) => void', undefined, 'Toggle like.'),
          p('user', 'CommentAuthor', undefined, 'Signed-in user beside the composer.'),
          p('closed', 'boolean', 'false', 'Show comments but disable posting.'),
        ],
      },
    ],
  },

  /* ---------------------------------------------------------- Content */
  {
    id: 'messages',
    name: 'Messages',
    group: 'Content',
    summary:
      'The parts of a chat: an inbox row, a thread that keeps to the newest message, bubbles that group runs from one person, date dividers, and a composer that grows and sends on Enter.',
    imports: [
      'MessageThread',
      'MessageBubble',
      'MessageDivider',
      'MessageComposer',
      'ConversationItem',
    ],
    examples: [ex('social', social, 'MessagesExample', 'Commission chat')],
    props: [
      {
        component: 'MessageBubble',
        rows: [
          p('own', 'boolean', 'false', 'The viewer’s message (right, primary).'),
          p('author / avatar / initials', '', undefined, 'Sender.'),
          p(
            'time / status',
            "ReactNode / 'sending' | 'sent' | 'read'",
            undefined,
            'Meta under the last bubble.'
          ),
          p(
            'grouping',
            "'single' | 'first' | 'middle' | 'last'",
            "'single'",
            'Position in a run from one sender.'
          ),
          p('attachments', 'ReactNode', undefined, 'Images or files.'),
        ],
      },
      {
        component: 'MessageComposer',
        rows: [
          p('onSend', '(text: string) => void', undefined, 'Required.'),
          p('onAttach', '() => void', undefined, 'Shows an attach button.'),
          p('maxRows', 'number', '6', 'Growth before scrolling.'),
        ],
      },
      {
        component: 'ConversationItem',
        rows: [
          p('name / preview / time', '', undefined, 'Row text.'),
          p('unread / online / active', 'number / boolean / boolean', undefined, 'States.'),
        ],
      },
    ],
  },
  {
    id: 'tier-card',
    name: 'TierCard',
    group: 'Content',
    summary:
      'A commission type or supporter tier: price, features, open/closed/sold-out status, slots left and a call to action.',
    imports: ['TierCard'],
    examples: [ex('social', social, 'TierCards', 'Commission menu')],
    props: [
      {
        component: 'TierCard',
        rows: [
          p('name / price / period / description', 'ReactNode', undefined, 'The offer.'),
          p(
            'features',
            'Array<string | { label, included? }>',
            undefined,
            'included: false crosses it out.'
          ),
          p(
            'status',
            "'open' | 'limited' | 'waitlist' | 'closed' | 'sold-out'",
            undefined,
            'Status pill.'
          ),
          p('slotsLeft / slotsTotal', 'number', undefined, 'Slot meter.'),
          p('highlight', 'ReactNode', undefined, 'Banner such as “Most popular”.'),
          p('image / action / footnote', '', undefined, 'Sample art, the button and small print.'),
        ],
      },
    ],
  },
  {
    id: 'reactions',
    name: 'LikeButton & reactions',
    group: 'Content',
    summary:
      'A like toggle with a count and a small burst, and reaction chips (icons with counts) with a picker. Counts are compact in the reader’s locale (1.2K).',
    imports: ['LikeButton', 'ReactionBar', 'ReactionPicker', 'formatCount'],
    examples: [ex('social', social, 'Likes', 'Likes and reactions')],
    props: [
      {
        component: 'LikeButton',
        rows: [
          p('liked / defaultLiked / onLikedChange', 'boolean', undefined, 'State.'),
          p('count', 'number', undefined, 'Count before the viewer’s like.'),
          p('icon', 'ReactNode', 'heart', 'e.g. a star or paw.'),
          p('label', 'string', "'Like'", 'Accessible name.'),
        ],
      },
      {
        component: 'ReactionBar',
        rows: [
          p('reactions', 'Array<{ id, count, reacted?, label? }>', undefined, 'Required.'),
          p('onToggle', '(id: string) => void', undefined, 'Required.'),
          p(
            'choices',
            'Array<{ id, label, icon }>',
            '10 defaults',
            'Reactions in the picker; icon is a lucide-react icon.'
          ),
          p('readOnly', 'boolean', 'false', 'No toggling or picker.'),
        ],
      },
    ],
  },
  {
    id: 'character-sheet',
    name: 'CharacterSheet & ColorSwatch',
    group: 'Content',
    summary:
      'A reference sheet for a character or fursona: art, species, pronouns, palette (click a swatch to copy it), facts, notes for artists and tags.',
    imports: ['CharacterSheet', 'ColorSwatch', 'SwatchList'],
    examples: [ex('social', social, 'CharacterSheetExample', 'Fursona ref')],
    props: [
      {
        component: 'CharacterSheet',
        rows: [
          p('name / species / pronouns', 'ReactNode', undefined, 'Header.'),
          p(
            'image / imageAlt / credit',
            'string / string / ReactNode',
            undefined,
            'Reference art.'
          ),
          p('swatches', 'Array<{ color, name? }>', undefined, 'Palette.'),
          p('details', 'Array<{ label, value }>', undefined, 'Facts.'),
          p('bio / notes / tags / actions', '', undefined, 'Everything else.'),
        ],
      },
      {
        component: 'ColorSwatch',
        rows: [
          p('color / name', 'string', undefined, 'Required colour.'),
          p('size', "'sm' | 'md' | 'lg'", "'md'", 'Chip size.'),
          p('copyable', 'boolean', 'true', 'Click to copy.'),
        ],
      },
    ],
  },
  {
    id: 'content-actions',
    name: 'ContentActions',
    group: 'Content',
    summary:
      'Save (with count), Share (copies the link) and Report (a dialog with reasons) for any creation.',
    imports: ['ContentActions', 'DEFAULT_REPORT_REASONS'],
    examples: [ex('content', content, 'Actions', 'Save, share, report')],
    props: [
      {
        component: 'ContentActions',
        rows: [
          p('saved / defaultSaved / onSavedChange', 'boolean', undefined, 'Save state.'),
          p('saveCount', 'number', undefined, 'Saves by others; the viewer’s own save adds one.'),
          p('shareUrl', 'string', 'location.href', 'Link copied by Share.'),
          p('onReport', '({ reason, details }) => void', undefined, 'Shows Report when set.'),
          p(
            'reportReasons',
            '{ value, label, description? }[]',
            'DEFAULT_REPORT_REASONS',
            'Reasons offered.'
          ),
        ],
      },
    ],
  },
  {
    id: 'comic-reader',
    name: 'ComicReader',
    group: 'Content',
    summary:
      'Multi-page comics. Book mode turns pages with arrow keys, swipes or a tap on either half, with two-page spreads, thumbnails and right-to-left reading; scroll mode is a vertical strip. Full screen expands the reader over the whole viewport (Escape exits), so it works on phones too.',
    imports: ['ComicReader', 'type ComicPage'],
    examples: [ex('content', content, 'Comic', 'Book mode with spreads')],
    props: [
      {
        component: 'ComicReader',
        rows: [
          p('pages', '{ src, alt? }[]', undefined, 'Pages in reading order.'),
          p('mode / defaultMode / onModeChange', "'book' | 'scroll'", "'book'", 'Reading mode.'),
          p('defaultSpread', 'boolean', 'false', 'Two pages at once in book mode (cover alone).'),
          p('direction', "'ltr' | 'rtl'", "'ltr'", 'rtl for manga.'),
          p('onPageChange', '(page: number) => void', undefined, 'Zero-based current page.'),
        ],
      },
    ],
  },
  {
    id: 'story-reader',
    name: 'Story reader',
    group: 'Content',
    summary:
      'Pieces for long-form reading: a sticky progress bar with time left, reader settings (size, font, spacing, width) saved to localStorage, and chapter navigation.',
    imports: [
      'ReadingProgress',
      'useReadingProgress',
      'ReaderSettings',
      'useReaderPrefs',
      'readerStyle',
      'ChapterNav',
    ],
    examples: [ex('content', content, 'Reader', 'Progress, settings and chapters')],
    props: [
      {
        component: 'useReadingProgress(ref, topOffset?)',
        rows: [
          p('ref', 'RefObject<HTMLElement>', undefined, 'The text column.'),
          p('topOffset', 'number', '96', 'Height of sticky chrome above the text.'),
        ],
      },
      {
        component: 'ReadingProgress',
        rows: [
          p('value', 'number', undefined, '0–100.'),
          p('minutes', 'number', undefined, 'Shows “N min left”.'),
          p('label', 'string', undefined, 'Chapter name.'),
        ],
      },
      {
        component: 'ReaderSettings',
        rows: [
          p(
            'value / onChange',
            'ReaderPrefs',
            undefined,
            '{ fontSize, fontFamily, lineHeight, width }.'
          ),
          p('minFontSize / maxFontSize', 'number', '14 / 28', 'Size range.'),
        ],
      },
      {
        component: 'ChapterNav',
        rows: [
          p('chapters', '{ id, title }[]', undefined, 'Chapters.'),
          p('current / onChange', 'number / (index) => void', undefined, 'Current chapter.'),
          p('variant', "'full' | 'compact'", "'full'", 'Labels or icons.'),
        ],
      },
    ],
  },
  {
    id: 'downloads',
    name: 'DownloadList',
    group: 'Content',
    summary:
      'Builds of a downloadable work, one per platform, with the visitor’s platform marked. PlatformBadge shows a single platform.',
    imports: ['DownloadList', 'PlatformBadge', 'detectPlatform', 'PLATFORM_INFO'],
    examples: [ex('content', content, 'Downloads', 'Visual novel builds')],
    props: [
      {
        component: 'DownloadList',
        rows: [
          p(
            'files',
            '{ id, name, platform, size?, version?, href?, note? }[]',
            undefined,
            'Builds.'
          ),
          p('recommended', 'Platform', undefined, 'Highlight, e.g. detectPlatform().'),
          p('onDownload', '(file) => void', undefined, 'Used when a file has no href.'),
        ],
      },
    ],
  },
  {
    id: 'profile-header',
    name: 'ProfileHeader',
    group: 'Content',
    summary:
      'Banner, avatar, name, bio, stats and actions at the top of a creator profile or a Lab portfolio.',
    imports: ['ProfileHeader'],
    examples: [ex('content', content, 'Profile', 'Creator')],
    props: [
      {
        component: 'ProfileHeader',
        rows: [
          p('name / handle / bio', 'string / string / ReactNode', undefined, 'Text.'),
          p(
            'avatarSrc / bannerSrc',
            'string',
            undefined,
            'Images; the banner falls back to a brand tint.'
          ),
          p('variant', "'user' | 'lab'", "'user'", 'Lab uses a square avatar.'),
          p('stats', '{ label, value, href?, onClick? }[]', undefined, 'Counts.'),
          p('badges / meta / actions', 'ReactNode', undefined, 'Extras.'),
        ],
      },
    ],
  },
  {
    id: 'link-hub',
    name: 'LinkHub',
    group: 'Content',
    summary: 'A link-in-bio page: avatar, bio, socials and a stack of big link buttons.',
    imports: ['LinkHub'],
    examples: [ex('content', content, 'Links', 'Creator links')],
    props: [
      {
        component: 'LinkHub',
        rows: [
          p('name / handle / avatarSrc / bio', 'string', undefined, 'Header.'),
          p(
            'links',
            '{ id, label, href, description?, icon?, thumbnailSrc?, featured? }[]',
            undefined,
            'Buttons.'
          ),
          p('socials', '{ label, href, icon }[]', undefined, 'Icon row.'),
          p('footer', 'ReactNode', undefined, 'Credit line.'),
        ],
      },
    ],
  },

  /* ----------------------------------------------------------- Layout */
  {
    id: 'background',
    name: 'Background',
    group: 'Layout',
    summary:
      'The ambient gradient behind a page or section, from theme colours. Pick a preset (brand, aurora, mesh, spotlight) or place your own glows; add dots, a grid or grain; drift it slowly. Glows fade with the transparency setting.',
    imports: ['Background'],
    examples: [
      ex('surfaces', surfaces, 'BackgroundPresets', 'Presets'),
      ex('surfaces', surfaces, 'CustomGlows', 'Custom glows and a grid'),
    ],
    props: [
      {
        component: 'Background',
        rows: [
          p(
            'variant',
            "'brand' | 'aurora' | 'mesh' | 'spotlight' | 'none'",
            "'brand'",
            'Preset glow layout. brand matches each brand’s classic look.'
          ),
          p(
            'glows',
            'Array<{ color, x, y, size?, opacity?, fade? }>',
            undefined,
            'Your own glows. Overrides variant. opacity multiplies the theme glow strength.'
          ),
          p('pattern', "'none' | 'dots' | 'grid' | 'noise'", "'none'", 'Pattern over the glows.'),
          p('patternColor / patternSize', 'string', undefined, 'Pattern ink and spacing.'),
          p('patternFade', 'boolean', 'false', 'Fade the pattern out towards the bottom.'),
          p('intensity', 'number', '1', 'Multiplies glow strength.'),
          p('animate', 'boolean', 'false', 'Slow drift. Off with reduced motion.'),
          p(
            'position',
            "'fixed' | 'absolute'",
            "'fixed'",
            'Behind the viewport, or filling the nearest positioned parent (give it relative isolate).'
          ),
          p('base', 'string', undefined, 'Solid colour underneath.'),
        ],
      },
    ],
  },
  {
    id: 'glass',
    name: 'Glass',
    group: 'Layout',
    summary:
      'A frosted surface you can tune: how clear it is, blur, a primary tint, the rim light and grain. Button has a matching glass variant. Every setting respects the transparency preference.',
    imports: ['Glass'],
    examples: [
      ex('surfaces', surfaces, 'GlassSurfaces', 'Clear, regular and frosted'),
      ex('surfaces', surfaces, 'GlassButtons', 'Glass button and pill'),
    ],
    props: [
      {
        component: 'Glass',
        rows: [
          p('opacity', "'clear' | 'regular' | 'frosted'", "'regular'", 'How see-through it is.'),
          p('blur', "'sm' | 'md' | 'lg' | 'xl'", "'md'", 'Blur strength.'),
          p('tint', "'none' | 'primary'", "'none'", 'Tint with the primary colour.'),
          p('edge', 'boolean', 'true', 'Rim light along the edge.'),
          p('grain', 'boolean', 'false', 'Fine frosted grain.'),
          p('interactive', 'boolean', 'false', 'Lift on hover.'),
          p('radius', "'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full'", "'2xl'", 'Corner radius.'),
          p('as', 'ElementType', "'div'", 'Element to render.'),
        ],
      },
    ],
  },
  {
    id: 'stack',
    name: 'Stack, HStack & VStack',
    group: 'Layout',
    summary:
      'Lay children out in a row or column with even gaps. Most screens are stacks of stacks. Direction and gap are responsive, so a row can become a column on phones. Spacer pushes siblings apart.',
    imports: ['Stack', 'HStack', 'VStack', 'Spacer', 'Box'],
    examples: [
      ex('primitives', primitives, 'Stacks', 'A post header'),
      ex('primitives', primitives, 'ResponsiveStack', 'Column on phones, row on desktop'),
    ],
    props: [
      {
        component: 'Stack',
        rows: [
          p(
            'direction',
            "Responsive<'row' | 'column' | 'row-reverse' | 'column-reverse'>",
            "'column'",
            'Main axis. Responsive: a value or { base, sm, md, lg, xl }.'
          ),
          p(
            'gap',
            'Responsive<number | string>',
            '4',
            'Space between children. A number is a 4px step (4 = 16px); a string is any CSS length.'
          ),
          p(
            'align',
            "'start' | 'center' | 'end' | 'stretch' | 'baseline'",
            undefined,
            'Cross-axis alignment.'
          ),
          p(
            'justify',
            "'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'",
            undefined,
            'Main-axis distribution.'
          ),
          p('wrap', 'boolean', 'false', 'Let children wrap.'),
          p('inline', 'boolean', 'false', 'inline-flex instead of flex.'),
          p('as', 'ElementType', "'div'", 'Element to render, e.g. ul or nav.'),
        ],
      },
      {
        component: 'HStack / VStack',
        rows: [
          p('reverse', 'boolean', 'false', 'Reverse the order.'),
          p('…Stack props', '', undefined, 'HStack centres vertically and defaults to gap 3.'),
        ],
      },
      {
        component: 'Box',
        rows: [
          p(
            'p / px / py',
            'number | string',
            undefined,
            'Padding. A number is a 4px step (4 = 16px); a string is any CSS length.'
          ),
          p(
            'surface',
            "'none' | 'card' | 'panel' | 'glass' | 'muted' | 'outline'",
            "'none'",
            'One of the library surfaces.'
          ),
        ],
      },
    ],
  },
  {
    id: 'zstack',
    name: 'ZStack',
    group: 'Layout',
    summary:
      'Layers children on top of each other in the same space, without absolute positioning. ZStackItem pins a layer to an edge, a corner or the centre. AspectRatio keeps media at a fixed shape.',
    imports: ['ZStack', 'ZStackItem', 'AspectRatio'],
    examples: [ex('primitives', primitives, 'ZStacks', 'Caption and badge over artwork')],
    props: [
      {
        component: 'ZStack',
        rows: [
          p(
            'align',
            "'fill' | 'center' | 'top-left' | 'top' | … | 'bottom-right'",
            "'fill'",
            'Default position of every layer.'
          ),
        ],
      },
      {
        component: 'ZStackItem',
        rows: [
          p('position', 'Same as align', "'fill'", 'Where this layer sits.'),
          p('inset', 'string', undefined, 'Gap from the edges it is pinned to.'),
        ],
      },
      {
        component: 'AspectRatio',
        rows: [p('ratio', 'number', '1', 'Width / height, e.g. 16 / 9.')],
      },
    ],
  },
  {
    id: 'align',
    name: 'Align & Center',
    group: 'Layout',
    summary:
      'Place children left, centre or right (and top, middle or bottom), or spread them out. Center centres on both axes.',
    imports: ['Align', 'Center'],
    examples: [ex('primitives', primitives, 'Alignment', 'Left, center, right, between')],
    props: [
      {
        component: 'Align',
        rows: [
          p(
            'x',
            "'left' | 'center' | 'right' | 'between' | 'around' | 'evenly'",
            "'left'",
            'Horizontal placement. Also sets text-align.'
          ),
          p(
            'y',
            "'top' | 'center' | 'bottom' | 'stretch' | 'baseline'",
            "'center'",
            'Vertical placement.'
          ),
          p('gap', 'number | string', '3', 'Space between children.'),
          p('wrap', 'boolean', 'true', 'Let children wrap.'),
        ],
      },
      {
        component: 'Center',
        rows: [p('inline', 'boolean', 'false', 'inline-flex instead of flex.')],
      },
    ],
  },
  {
    id: 'grid',
    name: 'Grid',
    group: 'Layout',
    summary:
      'Equal columns, either a fixed count per breakpoint or as many as fit with minChildWidth. GridItem spans several columns or the full row.',
    imports: ['Grid', 'GridItem'],
    examples: [ex('primitives', primitives, 'Grids', 'Counts, spans and auto-fit')],
    props: [
      {
        component: 'Grid',
        rows: [
          p(
            'cols',
            'Responsive<number>',
            '1',
            'Number of columns. Responsive: a value or { base, sm, md, lg, xl }.'
          ),
          p(
            'minChildWidth',
            'string',
            undefined,
            'Fit as many columns as there is room for, each at least this wide. Overrides cols.'
          ),
          p('gap', 'Responsive<number | string>', '4', 'Space between cells.'),
          p('rowGap', 'number | string', undefined, 'Row gap, when it differs.'),
          p(
            'alignItems',
            "'start' | 'center' | 'end' | 'stretch'",
            undefined,
            'Vertical alignment in rows.'
          ),
        ],
      },
      {
        component: 'GridItem',
        rows: [
          p('span', "Responsive<number | 'full'>", undefined, 'Columns to span.'),
          p('rowSpan', 'number', undefined, 'Rows to span.'),
        ],
      },
    ],
  },
  {
    id: 'columns',
    name: 'Columns',
    group: 'Layout',
    summary:
      'Side-by-side columns of different widths (fractions, fixed, fill or fit-content) that stack on small screens.',
    imports: ['Columns', 'Column'],
    examples: [
      ex('primitives', primitives, 'ColumnsExample', 'Fractions, content and fixed widths'),
    ],
    props: [
      {
        component: 'Columns',
        rows: [
          p('gap', 'number | string', '6', 'Space between columns.'),
          p(
            'collapseBelow',
            "'sm' | 'md' | 'lg' | 'none'",
            "'md'",
            'Stack the columns below this breakpoint.'
          ),
          p('align', "'start' | 'center' | 'end' | 'stretch'", undefined, 'Vertical alignment.'),
          p('reverseWhenStacked', 'boolean', 'false', 'Show the last column first when stacked.'),
        ],
      },
      {
        component: 'Column',
        rows: [
          p(
            'width',
            "'fill' | 'content' | '1/2' | '1/3' | '2/3' | '1/4' | '3/4' | … | string",
            "'fill'",
            'Column width. Fractions that add up to 1 fill the row exactly.'
          ),
        ],
      },
    ],
  },
  {
    id: 'container',
    name: 'Container & Section',
    group: 'Layout',
    summary:
      'Container centres content at a maximum width with responsive side padding. Section is a band of a page with an optional heading block, inside a Container.',
    imports: ['Container', 'Section'],
    examples: [ex('primitives', primitives, 'ContainerSection', 'A titled section')],
    props: [
      {
        component: 'Container',
        rows: [
          p(
            'size',
            "'sm' | 'md' | 'lg' | 'xl' | 'prose' | 'full'",
            "'xl'",
            'Maximum width. xl is --container-max; prose is --measure.'
          ),
          p('gutter', "'none' | 'sm' | 'md' | 'lg'", "'md'", 'Side padding.'),
        ],
      },
      {
        component: 'Section',
        rows: [
          p('eyebrow / title / description', 'ReactNode', undefined, 'Heading block.'),
          p('actions', 'ReactNode', undefined, 'Shown beside the heading.'),
          p('spacing', "'none' | 'sm' | 'md' | 'lg'", "'md'", 'Vertical padding.'),
          p('container', 'Container size | false', "'xl'", 'false for full bleed.'),
          p('centered', 'boolean', 'false', 'Centre the heading.'),
        ],
      },
    ],
  },
  {
    id: 'sidebar-layout',
    name: 'SidebarLayout',
    group: 'Layout',
    summary:
      'A main column with a sidebar beside it, for browse pages, settings and profiles. Stacks on small screens.',
    imports: ['SidebarLayout'],
    examples: [ex('primitives', primitives, 'SidebarLayoutExample', 'Browse filters')],
    props: [
      {
        component: 'SidebarLayout',
        rows: [
          p('sidebar', 'ReactNode', undefined, 'The side column. Required.'),
          p('side', "'left' | 'right'", "'left'", 'Which side it sits on.'),
          p('sidebarWidth', 'string', "'16rem'", 'Sidebar width.'),
          p('gap', 'number | string', '8', 'Space between the columns.'),
          p(
            'sticky / stickyTop',
            'boolean / string',
            "false / '5rem'",
            'Keep the sidebar in view while scrolling.'
          ),
          p('collapseBelow', "'md' | 'lg'", "'lg'", 'Stack below this breakpoint.'),
          p('sidebarLabel', 'string', undefined, 'Accessible name for the aside.'),
        ],
      },
    ],
  },
  {
    id: 'scroll-area',
    name: 'ScrollArea',
    group: 'Layout',
    summary:
      'A scrolling region with thin, themed scrollbars and optional edge fades. Focusable for keyboard scrolling.',
    imports: ['ScrollArea'],
    examples: [ex('primitives', primitives, 'ScrollAreaExample', 'Chapter list')],
    props: [
      {
        component: 'ScrollArea',
        rows: [
          p('orientation', "'vertical' | 'horizontal' | 'both'", "'vertical'", 'Scroll direction.'),
          p('maxHeight', 'string', undefined, 'Height before it scrolls.'),
          p('fade', 'boolean', 'false', 'Fade content at the scrolling edges.'),
        ],
      },
    ],
  },
  {
    id: 'show-hide',
    name: 'Show & Hide',
    group: 'Layout',
    summary:
      'Show or hide content at some screen sizes, with CSS. The wrapper is display: contents, so layout is unaffected.',
    imports: ['Show', 'Hide'],
    examples: [ex('primitives', primitives, 'Responsive', 'Swap at md')],
    props: [
      {
        component: 'Show / Hide',
        rows: [
          p('above', "'sm' | 'md' | 'lg' | 'xl'", undefined, 'From this breakpoint up.'),
          p('below', "'sm' | 'md' | 'lg' | 'xl'", undefined, 'Below this breakpoint.'),
        ],
      },
    ],
  },
  {
    id: 'panel-card',
    name: 'Panel & Card',
    group: 'Layout',
    summary: 'Panels group dashboard sections; Cards hold a single piece of content.',
    imports: [
      'Panel',
      'Card',
      'CardHeader',
      'CardTitle',
      'CardDescription',
      'CardContent',
      'CardFooter',
    ],
    examples: [ex('layout', layout, 'Panels', 'Side by side')],
    props: [
      {
        component: 'Panel',
        rows: [
          p('title / description', 'string', undefined, 'Header.'),
          p('actions', 'ReactNode', undefined, 'Header buttons.'),
        ],
      },
      {
        component: 'Card',
        rows: [p('variant', "'surface' | 'glass' | 'panel'", "'surface'", 'Surface style.')],
      },
    ],
  },
  {
    id: 'page-header',
    name: 'PageHeading & PageHeader',
    group: 'Layout',
    summary:
      'PageHeading is the large heading for public pages; PageHeader is the compact one for dashboards, with actions.',
    imports: ['PageHeading', 'PageHeader'],
    examples: [ex('layout', layout, 'Headers', 'Both')],
  },
  {
    id: 'toolbar',
    name: 'Toolbar',
    group: 'Layout',
    summary: 'A row of filters and actions above a list.',
    imports: ['Toolbar'],
    examples: [ex('layout', layout, 'ToolbarExample', 'Search and count')],
  },
  {
    id: 'separator',
    name: 'Separator',
    group: 'Layout',
    summary: 'Horizontal or vertical rules, optionally with a label.',
    imports: ['Separator'],
    examples: [ex('layout', layout, 'Separators', 'Plain, labelled, vertical')],
  },
  {
    id: 'form-section',
    name: 'FormSection & EditorActionBar',
    group: 'Layout',
    summary:
      'Two-column form sections, and a sticky bottom bar with save status and the main actions.',
    imports: ['FormSection', 'EditorActionBar'],
    examples: [ex('layout', layout, 'Forms', 'Edit and see the status change')],
    props: [
      {
        component: 'FormSection',
        rows: [
          p('title / description', 'ReactNode', undefined, 'Left column.'),
          p('actions', 'ReactNode', undefined, 'e.g. “Add chapter”.'),
        ],
      },
      {
        component: 'EditorActionBar',
        rows: [
          p('dirty', 'boolean', 'false', 'Unsaved changes indicator.'),
          p('status', 'ReactNode', undefined, 'Custom status text.'),
        ],
      },
    ],
  },
  {
    id: 'site-header',
    name: 'SiteHeader',
    group: 'Layout',
    summary:
      'The public site’s top bar: brand, navigation (a menu button below md) and actions. SiteFooter is its partner.',
    imports: ['SiteHeader', 'SiteNav', 'SiteNavLink', 'SiteFooter'],
    examples: [ex('layout', layout, 'Header', 'Header with nav')],
    props: [
      {
        component: 'SiteHeader',
        rows: [
          p('brand / nav / actions', 'ReactNode', undefined, 'Slots.'),
          p('sticky', 'boolean', 'true', 'Stick to the top while scrolling.'),
        ],
      },
    ],
  },
  {
    id: 'admin-shell',
    name: 'AdminShell',
    group: 'Layout',
    summary:
      'The Backstage console layout: a sidebar that collapses to icons on desktop and slides in on mobile, a topbar and a scrolling main area.',
    imports: ['AdminShell', 'AdminSidebar', 'useAdminShell'],
    examples: [ex('layout', layout, 'Console', 'Console layout', { preview: 'frame' })],
    props: [
      {
        component: 'AdminShell',
        rows: [
          p('sidebar / topbar', 'ReactNode', undefined, 'Slots.'),
          p(
            'collapsed / defaultCollapsed / onCollapsedChange',
            'boolean',
            'false',
            'Icon-only sidebar.'
          ),
        ],
      },
      {
        component: 'AdminSidebar',
        rows: [
          p(
            'header / search / footer',
            'ReactNode',
            undefined,
            'Brand, command trigger and user block.'
          ),
        ],
      },
    ],
  },
  {
    id: 'auth-card',
    name: 'AuthCard',
    group: 'Layout',
    summary: 'A centred card for sign-in and sign-up forms.',
    imports: ['AuthCard'],
    examples: [ex('layout', layout, 'Auth', 'Sign in')],
  },
  {
    id: 'not-found',
    name: 'NotFoundState & MaintenanceNotice',
    group: 'Layout',
    summary: 'Full-page states for missing pages and planned downtime.',
    imports: ['NotFoundState', 'MaintenanceNotice', 'Illustration404'],
    examples: [
      ex('layout', layout, 'NotFound', '404'),
      ex('layout', layout, 'Maintenance', 'Maintenance'),
    ],
  },
  {
    id: 'brand',
    name: 'BrandLockup',
    group: 'Layout',
    summary:
      'The Dynamic Lab mark and name, with an optional product tag. The fox in the mark is called FleskyFox; DynamicLabMark (or FleskyFox) draws it on its own.',
    imports: ['BrandLockup', 'DynamicLabMark', 'FleskyFox'],
    examples: [ex('layout', layout, 'Brand', 'Default and Backstage')],
    props: [
      {
        component: 'BrandLockup',
        rows: [
          p('name', 'string', "'Dynamic Lab'", 'Wordmark.'),
          p('product', 'string', undefined, 'Tag, e.g. “Backstage”.'),
          p('size', "'sm' | 'md'", "'md'", 'sm for sidebars.'),
        ],
      },
    ],
  },

  /* ---------------------------------------------------------- Theming */
  {
    id: 'palette-picker',
    name: 'PalettePicker',
    group: 'Theming',
    summary:
      'Choose a named colour theme. Reads and writes ThemeProvider’s palette. PalettePreview renders any palette in isolation.',
    imports: ['PalettePicker', 'PalettePreview', 'PALETTES'],
    examples: [
      ex('actions', actions, 'Palettes', 'Cards, both modes'),
      ex('actions', actions, 'PalettesCompact', 'Compact, for menus'),
    ],
    props: [
      {
        component: 'PalettePicker',
        rows: [
          p('variant', "'cards' | 'compact'", "'cards'", 'Layout.'),
          p('showBothModes', 'boolean', 'false', 'Preview light and dark (cards).'),
        ],
      },
      {
        component: 'PalettePreview',
        rows: [
          p('palette', 'Palette', undefined, 'Which palette.'),
          p('mode', "'light' | 'dark'", undefined, 'Which version.'),
          p('size', "'mini' | 'full'", "'mini'", 'Thumbnail or mock page.'),
        ],
      },
    ],
  },
  {
    id: 'appearance-settings',
    name: 'AppearanceSettings & ThemeToggle',
    group: 'Theming',
    summary:
      'ThemeToggle flips light and dark; AppearanceSettings is a popover with colour theme, mode and transparency.',
    imports: ['AppearanceSettings', 'ThemeToggle'],
    examples: [ex('actions', actions, 'ThemeToggles', 'Toggles and the popover')],
    props: [
      {
        component: 'ThemeToggle',
        rows: [
          p('variant', "'outline' | 'ghost'", "'outline'", 'Bordered tile or bare icon.'),
          p('showBrandToggle', 'boolean', 'false', 'Add a Dynamic/Backstage switch.'),
        ],
      },
      {
        component: 'AppearanceSettings',
        rows: [
          p('themesHref', 'string', undefined, '“See all themes” link.'),
          p('align / side', "'start' | 'end' / 'top' | 'bottom'", "'end' / 'bottom'", 'Placement.'),
        ],
      },
    ],
  },
  {
    id: 'transparency-control',
    name: 'TransparencyControl',
    group: 'Theming',
    summary:
      'System / Full / Reduced / Off picker for glass transparency, with an explanation of each.',
    imports: ['TransparencyControl'],
    examples: [ex('actions', actions, 'Transparency', 'With help text')],
    props: [
      {
        component: 'TransparencyControl',
        rows: [
          p('showHelp', 'boolean', 'true', 'Explanation under the control.'),
          p('size', "'sm' | 'md'", "'md'", 'Size.'),
        ],
      },
    ],
  },
]

/** Raw source of every example file, keyed by file name (without extension). */
const RAW = import.meta.glob('./examples/*.tsx', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

/** The source of one exported example function, as written in src/examples. */
export function exampleSource(file: string, name: string) {
  const raw = RAW[`./examples/${file}.tsx`] ?? ''
  const start = raw.indexOf(`export function ${name}(`)
  if (start < 0) return ''
  const next = raw.indexOf('\nexport function ', start + 1)
  return raw
    .slice(start, next < 0 ? undefined : next)
    .replace(/^export /, '')
    .trimEnd()
}
