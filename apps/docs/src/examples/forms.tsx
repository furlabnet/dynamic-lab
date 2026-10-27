import React, { useState } from 'react'
import { Search } from 'lucide-react'
import {
  Checkbox,
  DragHandle,
  FileInput,
  ImageUploader,
  MarkdownEditor,
  RadioGroup,
  RadioGroupItem,
  Select,
  SortableList,
  Switch,
  TagInput,
  TextField,
  type TagItem,
  type UploadedImage,
} from '@furlab/dynamic-lab'

export function TextFields() {
  const [title, setTitle] = useState('')
  return (
    <div className="grid max-w-md gap-4">
      <TextField
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Name your story"
        helperText={`${title.length}/60`}
        error={title.length > 60 ? 'Keep it under 60 characters' : undefined}
      />
      <TextField
        label="Search"
        placeholder="Search tags…"
        startIcon={<Search className="size-4" />}
      />
      <TextField label="Summary" isTextarea rows={3} placeholder="A sentence or two for the card" />
    </div>
  )
}

export function SelectExample() {
  return (
    <div className="max-w-xs">
      <Select
        label="Visibility"
        defaultValue="public"
        options={[
          { value: 'public', label: 'Public' },
          { value: 'unlisted', label: 'Unlisted' },
          { value: 'private', label: 'Only me' },
        ]}
      />
    </div>
  )
}

export function Toggles() {
  const [rows, setRows] = useState([
    { id: 'a', label: 'Comments', checked: true },
    { id: 'b', label: 'Followers', checked: false },
  ])
  const all = rows.every((r) => r.checked)
  const some = rows.some((r) => r.checked)
  return (
    <div className="flex flex-col gap-4">
      <Switch
        defaultChecked
        label="Allow comments"
        description="Readers can reply to this story."
      />
      <Switch disabled label="Disabled" />
      <Checkbox
        label="Email me about everything"
        checked={all}
        indeterminate={some && !all}
        onCheckedChange={() => setRows(rows.map((r) => ({ ...r, checked: !all })))}
      />
      <div className="flex flex-col gap-2 pl-7">
        {rows.map((r) => (
          <Checkbox
            key={r.id}
            label={r.label}
            checked={r.checked}
            onCheckedChange={(checked) =>
              setRows(rows.map((x) => (x.id === r.id ? { ...x, checked } : x)))
            }
          />
        ))}
      </div>
    </div>
  )
}

export function Radios() {
  return (
    <div className="flex flex-col gap-6">
      <RadioGroup label="Who can see this?" defaultValue="everyone">
        <RadioGroupItem value="everyone" label="Everyone" />
        <RadioGroupItem
          value="followers"
          label="Followers"
          description="People who follow your Lab"
        />
        <RadioGroupItem value="me" label="Only me" />
      </RadioGroup>
      <RadioGroup
        label="Registration"
        defaultValue="invite"
        orientation="horizontal"
        variant="card">
        <RadioGroupItem value="open" label="Open" description="Anyone can sign up" />
        <RadioGroupItem value="invite" label="Invite only" description="Staff send invites" />
      </RadioGroup>
    </div>
  )
}

export function Files() {
  return (
    <div className="grid max-w-lg gap-5">
      <FileInput label="Cover image" accept="image/*" />
      <FileInput
        variant="dropzone"
        multiple
        accept=".png,.jpg,.webp"
        helperText="PNG, JPG or WebP."
      />
    </div>
  )
}

export function Images() {
  const [images, setImages] = useState<UploadedImage[]>([
    { id: '1', src: 'https://picsum.photos/seed/docs-1/600/800' },
    { id: '2', src: 'https://picsum.photos/seed/docs-2/600/800' },
    { id: '3', src: 'https://picsum.photos/seed/docs-3/600/800' },
  ])
  return (
    <ImageUploader
      label="Pages"
      value={images}
      onChange={setImages}
      aspect="page"
      numbered
      noun="page"
    />
  )
}

export function Tags() {
  const [tags, setTags] = useState<TagItem[]>([
    { name: 'jordan_vance', category: 'artist' },
    { name: 'red_fox', category: 'species' },
  ])
  const suggestions: TagItem[] = [
    { name: 'winter', category: 'general', count: 2210 },
    { name: 'forest', category: 'general', count: 3400 },
    { name: 'wolf', category: 'species', count: 6100 },
    { name: 'traditional_media', category: 'meta', count: 640 },
  ]
  return (
    <TagInput label="Tags" value={tags} onChange={setTags} suggestions={suggestions} minTags={5} />
  )
}

export function Markdown() {
  const [text, setText] = useState(
    '## The first letter\n\nDear stranger at the end of the pier, I don’t know your **name**.\n\n---\n\n> The tide was a better postman.'
  )
  return <MarkdownEditor label="Chapter" value={text} onChange={setText} rows={8} />
}

export function Sortable() {
  const [items, setItems] = useState([
    { id: 'c1', title: 'The first letter' },
    { id: 'c2', title: 'A reply, in pencil' },
    { id: 'c3', title: 'Weather' },
  ])
  return (
    <SortableList
      items={items}
      getKey={(i) => i.id}
      getLabel={(i) => i.title}
      onReorder={setItems}
      renderItem={(item, api) => (
        <div className="ui-panel flex items-center gap-3 p-3!">
          <DragHandle {...api.handleProps} />
          <span className="w-5 text-sm font-bold text-[var(--muted-foreground)]">
            {api.index + 1}
          </span>
          <span className="font-medium">{item.title}</span>
        </div>
      )}
    />
  )
}
