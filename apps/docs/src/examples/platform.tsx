import React, { useState } from 'react'

import {
  AvatarGroup,
  BottomNav,
  BottomNavItem,
  Button,
  Heading,
  HStack,
  IconButton,
  Indicator,
  Link,
  List,
  ListItem,
  ProfileAvatar,
  Slider,
  StatusBadge,
  Stepper,
  Switch,
  Text,
  VStack,
} from '@furlab/dynamic-lab'

import { Bell, Compass, Home, Inbox, Lock, Palette, Plus, User } from 'lucide-react'

export function TypographyExample() {
  return (
    <VStack gap={3}>
      <Heading level={1} size="display">
        Make something strange
      </Heading>
      <Heading level={2}>Heading level 2</Heading>
      <Heading level={3} tone="muted">
        Heading level 3, muted
      </Heading>
      <Text>
        Body text at the default size. Read the <Link href="#/guide/theming">theming guide</Link> or
        visit <Link href="https://gitlab.com/furlab">GitLab</Link>.
      </Text>
      <Text size="sm" tone="muted" lines={2}>
        Text can be clamped to a number of lines, which is handy on cards where descriptions vary in
        length and the grid should stay even. Anything past the second line is cut off with an
        ellipsis so the layout never jumps.
      </Text>
      <Text size="xs" mono tone="primary">
        id: wrk_8f2a91
      </Text>
    </VStack>
  )
}

export function Lists() {
  const [notify, setNotify] = useState(true)
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <List variant="inset" label="Notifications">
        <ListItem
          leading={<ProfileAvatar size="md" initials="MO" />}
          title="Moth commented on Ep. 4"
          description="“That last panel. I wasn't ready.”"
          trailing={
            <Text size="xs" tone="muted">
              2m
            </Text>
          }
          href="#"
          selected
        />
        <ListItem
          leading={<ProfileAvatar size="md" initials="TW" />}
          title="Tidewater followed you"
          trailing={
            <Text size="xs" tone="muted">
              1h
            </Text>
          }
          href="#"
        />
        <ListItem
          leading={<ProfileAvatar size="md" initials="EM" />}
          title="Ember published a new chapter"
          trailing={<StatusBadge tone="success">New</StatusBadge>}
          href="#"
        />
      </List>
      <List variant="inset" label="Settings">
        <ListItem
          leading={<Bell />}
          title="Email notifications"
          description="Comments and new followers"
          trailing={
            <Switch checked={notify} onCheckedChange={setNotify} aria-label="Email notifications" />
          }
        />
        <ListItem leading={<Palette />} title="Appearance" onClick={() => {}} chevron />
        <ListItem
          leading={<Lock />}
          title="Privacy"
          description="Coming soon"
          disabled
          onClick={() => {}}
        />
      </List>
    </div>
  )
}

export function AvatarGroups() {
  const people = ['Rook', 'Moth', 'Ember', 'Tide', 'Lark', 'Fen'].map((n) => ({
    alt: n,
    initials: n.slice(0, 2).toUpperCase(),
  }))
  return (
    <VStack gap={4}>
      <AvatarGroup avatars={people} max={4} />
      <HStack gap={3}>
        <AvatarGroup avatars={people.slice(0, 3)} size="sm" total={1204} />
        <Text size="sm" tone="muted">
          1,204 followers
        </Text>
      </HStack>
    </VStack>
  )
}

export function Indicators() {
  return (
    <HStack gap={6}>
      <Indicator count={3} label="3 unread notifications">
        <IconButton aria-label="Notifications" icon={<Bell className="size-4" />} />
      </Indicator>
      <Indicator count={120} tone="primary" label="120 messages">
        <IconButton aria-label="Inbox" icon={<Inbox className="size-4" />} />
      </Indicator>
      <Indicator tone="success" placement="bottom-right" label="Online">
        <ProfileAvatar initials="RF" />
      </Indicator>
    </HStack>
  )
}

export function Steppers() {
  const [step, setStep] = useState(1)
  const steps = [
    { label: 'Upload', description: 'Pages or text' },
    { label: 'Details', description: 'Title, tags, rating' },
    { label: 'Review' },
    { label: 'Publish' },
  ]
  return (
    <VStack gap={6}>
      <Stepper steps={steps} current={step} onStepClick={setStep} />
      <HStack>
        <Button
          size="sm"
          variant="secondary"
          disabled={step === 0}
          onClick={() => setStep(step - 1)}>
          Back
        </Button>
        <Button size="sm" disabled={step === steps.length} onClick={() => setStep(step + 1)}>
          Next
        </Button>
      </HStack>
      <Stepper
        orientation="vertical"
        current={2}
        steps={[
          { label: 'Application sent' },
          { label: 'Portfolio check', error: true, description: 'Two links are broken' },
          { label: 'Lab review' },
        ]}
      />
    </VStack>
  )
}

export function Sliders() {
  const [size, setSize] = useState(18)
  return (
    <VStack gap={6} className="max-w-sm">
      <Slider
        label="Reader font size"
        min={14}
        max={26}
        value={size}
        onValueChange={setSize}
        showValue={(v) => `${v}px`}
      />
      <Slider label="Panel zoom" defaultValue={40} marks={['Fit', 'Fill']} />
      <Text style={{ fontSize: size }}>The lighthouse keeper logs ships that never arrive.</Text>
    </VStack>
  )
}

export function BottomNavExample() {
  const [active, setActive] = useState('home')
  const items = [
    { id: 'home', label: 'Home', icon: <Home /> },
    { id: 'explore', label: 'Explore', icon: <Compass /> },
    { id: 'create', label: 'Create', icon: <Plus /> },
    { id: 'inbox', label: 'Inbox', icon: <Inbox />, badge: 4 },
    { id: 'me', label: 'Profile', icon: <User />, badge: true },
  ]
  return (
    // The real thing is fixed to the bottom of the screen; this preview contains it.
    <div className="relative h-40 [transform:translateZ(0)] overflow-hidden rounded-[var(--radius-2xl)] border">
      <Heading level={4} className="p-4">
        Phone preview
      </Heading>
      <BottomNav mobileOnly={false}>
        {items.map((it) => (
          <BottomNavItem
            key={it.id}
            href="#"
            icon={it.icon}
            label={it.label}
            badge={it.badge}
            active={active === it.id}
            onClick={(e) => {
              e.preventDefault()
              setActive(it.id)
            }}
          />
        ))}
      </BottomNav>
    </div>
  )
}
