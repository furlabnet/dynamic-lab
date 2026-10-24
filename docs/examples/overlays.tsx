import React, { useState } from 'react'
import { Bell, Copy, Home, Pencil, Plus, Settings, Share2, Trash2 } from 'lucide-react'
import {
  Button,
  Checkbox,
  CommandPalette,
  CommandTrigger,
  Dialog,
  Drawer,
  DropdownMenu,
  Kbd,
  MenuItem,
  MenuLabel,
  MenuSeparator,
  Popover,
  Select,
  Switch,
  TextField,
  useToast,
  type CommandItem,
} from '@furlab/dynamic-lab'

export function DropdownBasic() {
  const [sort, setSort] = useState('newest')
  return (
    <div className="flex flex-wrap gap-3">
      <DropdownMenu align="start" trigger={<Button variant="secondary">Actions</Button>}>
        <MenuItem icon={<Pencil />} trailing={<Kbd>E</Kbd>}>
          Edit
        </MenuItem>
        <MenuItem icon={<Copy />}>Duplicate</MenuItem>
        <MenuItem icon={<Share2 />} subtitle="Anyone with the link">
          Share
        </MenuItem>
        <MenuSeparator />
        <MenuItem danger icon={<Trash2 />}>
          Move to trash
        </MenuItem>
      </DropdownMenu>
      <DropdownMenu align="start" trigger={<Button variant="ghost">Sort: {sort}</Button>}>
        <MenuLabel>Sort by</MenuLabel>
        {['newest', 'oldest', 'title'].map((value) => (
          <MenuItem key={value} selected={sort === value} onClick={() => setSort(value)}>
            {value}
          </MenuItem>
        ))}
      </DropdownMenu>
    </div>
  )
}

export function PopoverForm() {
  return (
    <Popover
      trigger={
        <Button variant="secondary" leftIcon={<Bell className="size-4" />}>
          Notifications
        </Button>
      }
      aria-label="Notification settings"
      className="ui-menu w-72 p-4!">
      {({ close }) => (
        <div className="flex flex-col gap-3">
          <Checkbox defaultChecked label="New comments" />
          <Checkbox label="Weekly digest" />
          <Button size="sm" className="self-end" onClick={close}>
            Save
          </Button>
        </div>
      )}
    </Popover>
  )
}

export function DialogConfirm() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button variant="danger-outline" onClick={() => setOpen(true)}>
        Delete story
      </Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Delete “The lighthouse keeper”?"
        description="It moves to the trash for 45 days, then is deleted for good."
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={() => setOpen(false)}>
              Move to trash
            </Button>
          </>
        }
      />
    </>
  )
}

export function DialogForm() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button onClick={() => setOpen(true)}>Rename</Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Rename story"
        footer={<Button onClick={() => setOpen(false)}>Save</Button>}>
        <TextField label="Title" defaultValue="The lighthouse keeper" autoFocus />
      </Dialog>
    </>
  )
}

export function DrawerSides() {
  const [side, setSide] = useState<'left' | 'right' | 'bottom' | null>(null)
  return (
    <>
      <div className="flex gap-2">
        <Button variant="secondary" onClick={() => setSide('right')}>
          Right
        </Button>
        <Button variant="secondary" onClick={() => setSide('left')}>
          Left
        </Button>
        <Button variant="secondary" onClick={() => setSide('bottom')}>
          Bottom
        </Button>
      </div>
      <Drawer
        open={side !== null}
        side={side ?? 'right'}
        onClose={() => setSide(null)}
        title="Filters"
        footer={<Button onClick={() => setSide(null)}>Apply</Button>}>
        <div className="flex flex-col gap-4">
          <Select label="Category" options={[{ value: 'all', label: 'All categories' }]} />
          <Switch defaultChecked label="Open comments only" />
        </div>
      </Drawer>
    </>
  )
}

export function Toasts() {
  const { toast } = useToast()
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="secondary"
        onClick={() =>
          toast({ title: 'Saved', description: 'Your story is live.', tone: 'success' })
        }>
        Success
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          toast({
            title: 'Upload failed',
            description: 'Files must be under 20 MB.',
            tone: 'destructive',
          })
        }>
        Error
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          toast({
            title: 'Moved to trash',
            description: 'You can restore it for 45 days.',
            action: {
              label: 'Undo',
              onClick: () => toast({ title: 'Restored', description: 'Undo worked.' }),
            },
          })
        }>
        With action
      </Button>
    </div>
  )
}

export function Commands() {
  const [open, setOpen] = useState(false)
  const items: CommandItem[] = [
    {
      id: 'new',
      label: 'New story',
      group: 'Create',
      icon: <Plus />,
      shortcut: ['N'],
      onSelect: () => {},
    },
    { id: 'home', label: 'Go home', group: 'Navigate', icon: <Home />, onSelect: () => {} },
    {
      id: 'settings',
      label: 'Settings',
      group: 'Navigate',
      icon: <Settings />,
      keywords: ['preferences'],
      onSelect: () => {},
    },
  ]
  return (
    <div className="max-w-xs">
      <CommandTrigger onClick={() => setOpen(true)} />
      {/* hotkey={false}: this page already has one palette listening for ⌘K */}
      <CommandPalette open={open} onOpenChange={setOpen} items={items} hotkey={false} />
    </div>
  )
}
