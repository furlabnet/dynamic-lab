import React, { useState } from 'react'

import type { BackgroundVariant } from '@furlab/dynamic-lab'
import {
  Background,
  Button,
  Center,
  Glass,
  Grid,
  HStack,
  SegmentedControl,
  Text,
  VStack,
} from '@furlab/dynamic-lab'

import { Heart, Play } from 'lucide-react'

export function BackgroundPresets() {
  const [variant, setVariant] = useState<BackgroundVariant>('aurora')
  return (
    <VStack gap={4}>
      <SegmentedControl
        aria-label="Variant"
        value={variant}
        onValueChange={(v) => setVariant(v as BackgroundVariant)}
        options={[
          { value: 'brand', label: 'Brand' },
          { value: 'aurora', label: 'Aurora' },
          { value: 'mesh', label: 'Mesh' },
          { value: 'spotlight', label: 'Spotlight' },
        ]}
      />
      {/* position="absolute" fills this box; the page version is position="fixed". */}
      <Center className="relative isolate h-64 overflow-hidden rounded-[var(--radius-2xl)] border">
        <Background
          variant={variant}
          position="absolute"
          pattern="dots"
          patternFade
          intensity={2.5}
          animate
        />
        <Text weight="semibold">variant="{variant}"</Text>
      </Center>
    </VStack>
  )
}

export function CustomGlows() {
  return (
    <Center className="relative isolate h-56 overflow-hidden rounded-[var(--radius-2xl)] border">
      <Background
        position="absolute"
        pattern="grid"
        patternSize="32px"
        glows={[
          { color: '#ff7a59', x: '20%', y: '30%', size: '22rem 18rem', opacity: 3 },
          { color: '#ffd166', x: '80%', y: '20%', size: '20rem 16rem', opacity: 2.5 },
          { color: 'var(--primary)', x: '60%', y: '110%', size: '30rem 18rem', opacity: 3 },
        ]}
      />
      <Text weight="semibold">Your own colours and positions</Text>
    </Center>
  )
}

export function GlassSurfaces() {
  return (
    <div className="relative isolate overflow-hidden rounded-[var(--radius-2xl)] border p-6">
      <Background variant="mesh" position="absolute" intensity={4} />
      <Grid cols={{ base: 1, sm: 3 }} gap={4}>
        <Glass opacity="clear" blur="lg" className="p-5">
          <Text weight="semibold">Clear</Text>
          <Text size="sm" tone="muted">
            opacity="clear" blur="lg"
          </Text>
        </Glass>
        <Glass grain interactive className="p-5">
          <Text weight="semibold">Regular, grain</Text>
          <Text size="sm" tone="muted">
            Hover me: interactive
          </Text>
        </Glass>
        <Glass opacity="frosted" tint="primary" className="p-5">
          <Text weight="semibold">Frosted, tinted</Text>
          <Text size="sm" tone="muted">
            tint="primary"
          </Text>
        </Glass>
      </Grid>
    </div>
  )
}

export function GlassButtons() {
  return (
    <div className="relative isolate overflow-hidden rounded-[var(--radius-2xl)] p-8">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(120deg,var(--glow-a),var(--glow-b))]" />
      <HStack gap={3} wrap>
        <Button leftIcon={<Play className="size-4" />}>Start reading</Button>
        <Button variant="glass" className="text-white" leftIcon={<Heart className="size-4" />}>
          Save
        </Button>
        <Glass radius="full" blur="sm" className="px-4 py-2">
          <Text size="sm" weight="semibold" className="text-white">
            Glass pill
          </Text>
        </Glass>
      </HStack>
    </div>
  )
}
