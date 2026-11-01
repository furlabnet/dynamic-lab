import React from 'react'

import {
  Align,
  AspectRatio,
  Badge,
  Box,
  Button,
  Center,
  Column,
  Columns,
  Container,
  Grid,
  GridItem,
  Heading,
  Hide,
  HStack,
  List,
  ListItem,
  ProfileAvatar,
  ScrollArea,
  Section,
  Show,
  SidebarLayout,
  Spacer,
  Stack,
  Text,
  VStack,
  ZStack,
  ZStackItem,
} from '@furlab/dynamic-lab'

import { Heart, MessageCircle, Play } from 'lucide-react'

export function Stacks() {
  return (
    <VStack gap={4}>
      <HStack gap={3}>
        <ProfileAvatar initials="RF" />
        <VStack gap={0}>
          <Text size="sm" weight="semibold">
            Rook Fernsby
          </Text>
          <Text size="xs" tone="muted">
            Posted 2 hours ago
          </Text>
        </VStack>
        <Spacer />
        <Button size="sm" variant="secondary">
          Follow
        </Button>
      </HStack>
      <Box surface="muted" p={4}>
        <Text size="sm">
          VStack puts things in a column, HStack in a row. Spacer pushes the button to the end.
        </Text>
      </Box>
      <HStack gap={2}>
        <Button size="sm" variant="ghost" leftIcon={<Heart className="size-4" />}>
          128
        </Button>
        <Button size="sm" variant="ghost" leftIcon={<MessageCircle className="size-4" />}>
          14
        </Button>
      </HStack>
    </VStack>
  )
}

export function ResponsiveStack() {
  return (
    <Stack direction={{ base: 'column', md: 'row' }} gap={{ base: 3, md: 6 }} align="stretch">
      <Box surface="outline" p={4} className="flex-1">
        <Text size="sm">Stacked on phones…</Text>
      </Box>
      <Box surface="outline" p={4} className="flex-1">
        <Text size="sm">…side by side from md up.</Text>
      </Box>
      <Box surface="outline" p={4} className="flex-1">
        <Text size="sm">Gap grows too.</Text>
      </Box>
    </Stack>
  )
}

export function ZStacks() {
  return (
    <ZStack className="max-w-sm overflow-hidden rounded-[var(--radius-2xl)]">
      <AspectRatio ratio={16 / 9}>
        <div className="size-full bg-[linear-gradient(135deg,var(--glow-a),var(--glow-b))]" />
      </AspectRatio>
      <ZStackItem position="top-right" inset="0.75rem">
        <Badge variant="solid">New chapter</Badge>
      </ZStackItem>
      <ZStackItem position="center">
        <Center className="size-14 rounded-full bg-black/40 text-white backdrop-blur-sm">
          <Play className="size-6" />
        </Center>
      </ZStackItem>
      <ZStackItem position="bottom-left" inset="0.75rem">
        <Text size="sm" weight="semibold" className="text-white drop-shadow">
          The lighthouse keeper · Ep. 4
        </Text>
      </ZStackItem>
    </ZStack>
  )
}

export function Alignment() {
  return (
    <VStack gap={3}>
      {(['left', 'center', 'right', 'between'] as const).map((x) => (
        <Align key={x} x={x} className="rounded-[var(--radius-lg)] border border-dashed p-3">
          <Button size="sm" variant="secondary">
            {x}
          </Button>
          <Button size="sm">Save</Button>
        </Align>
      ))}
      <Center className="h-24 rounded-[var(--radius-lg)] border border-dashed">
        <Text size="sm" tone="muted">
          Center, both ways
        </Text>
      </Center>
    </VStack>
  )
}

export function Grids() {
  return (
    <VStack gap={6}>
      <Grid cols={{ base: 2, md: 4 }} gap={3}>
        {Array.from({ length: 8 }, (_, i) => (
          <Box key={i} surface="muted" p={4}>
            <Text size="sm">Cell {i + 1}</Text>
          </Box>
        ))}
      </Grid>
      <Grid cols={{ base: 1, md: 3 }} gap={3}>
        <GridItem span={{ base: 1, md: 2 }}>
          <Box surface="outline" p={4}>
            <Text size="sm">GridItem span 2</Text>
          </Box>
        </GridItem>
        <Box surface="outline" p={4}>
          <Text size="sm">1</Text>
        </Box>
        <GridItem span="full">
          <Box surface="outline" p={4}>
            <Text size="sm">span full</Text>
          </Box>
        </GridItem>
      </Grid>
      <Grid minChildWidth="10rem" gap={3}>
        {Array.from({ length: 5 }, (_, i) => (
          <Box key={i} surface="card" p={4}>
            <Text size="sm">Fits as many as there is room for</Text>
          </Box>
        ))}
      </Grid>
    </VStack>
  )
}

export function ColumnsExample() {
  return (
    <VStack gap={4}>
      <Columns gap={4}>
        <Column width="2/3">
          <Box surface="muted" p={4}>
            <Text size="sm">2/3</Text>
          </Box>
        </Column>
        <Column width="1/3">
          <Box surface="muted" p={4}>
            <Text size="sm">1/3</Text>
          </Box>
        </Column>
      </Columns>
      <Columns gap={4} align="center">
        <Column width="content">
          <ProfileAvatar size="lg" initials="LK" />
        </Column>
        <Column>
          <Text size="sm">A "content" column fits the avatar; "fill" takes the rest.</Text>
        </Column>
        <Column width="10rem">
          <Box surface="outline" p={3}>
            <Text size="xs">Fixed 10rem</Text>
          </Box>
        </Column>
      </Columns>
    </VStack>
  )
}

export function ContainerSection() {
  return (
    <Box surface="outline" className="overflow-hidden">
      <Section
        spacing="sm"
        eyebrow="Trending"
        title="Fresh this week"
        description="Section adds a heading block and wraps its content in a Container."
        actions={
          <Button size="sm" variant="secondary">
            See all
          </Button>
        }>
        <Grid cols={{ base: 1, sm: 3 }} gap={3}>
          {['Ember', 'Tidewater', 'Moth'].map((t) => (
            <Box key={t} surface="muted" p={4}>
              <Text size="sm" weight="semibold">
                {t}
              </Text>
            </Box>
          ))}
        </Grid>
      </Section>
      <Container size="prose" className="pb-6">
        <Text size="sm" tone="muted">
          Container size="prose" keeps long text at a comfortable reading width.
        </Text>
      </Container>
    </Box>
  )
}

export function SidebarLayoutExample() {
  return (
    <SidebarLayout
      collapseBelow="md"
      sidebarWidth="12rem"
      gap={6}
      sidebarLabel="Filters"
      sidebar={
        <List variant="plain" label="Browse" dense>
          <ListItem title="All works" onClick={() => {}} selected />
          <ListItem title="Comics" onClick={() => {}} />
          <ListItem title="Stories" onClick={() => {}} />
        </List>
      }>
      <Heading level={3}>All works</Heading>
      <Text size="sm" tone="muted" className="mt-1">
        The sidebar sits beside the content from md up, and above it on phones.
      </Text>
    </SidebarLayout>
  )
}

export function ScrollAreaExample() {
  return (
    <ScrollArea
      maxHeight="12rem"
      fade
      aria-label="Chapters"
      className="rounded-[var(--radius-xl)] border">
      <List variant="divided">
        {Array.from({ length: 12 }, (_, i) => (
          <ListItem
            key={i}
            title={`Chapter ${i + 1}`}
            trailing={
              <Text size="xs" tone="muted">
                {12 - i}d
              </Text>
            }
          />
        ))}
      </List>
    </ScrollArea>
  )
}

export function Responsive() {
  return (
    <HStack>
      <Show above="md">
        <Badge>Shown from md up</Badge>
      </Show>
      <Hide above="md">
        <Badge variant="neutral">Shown below md</Badge>
      </Hide>
      <Text size="sm" tone="muted">
        Resize the window to swap them.
      </Text>
    </HStack>
  )
}
