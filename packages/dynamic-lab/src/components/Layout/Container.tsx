import React from 'react'

import type { VariantProps } from 'class-variance-authority'

import { cva } from 'class-variance-authority'

import type { LayoutBaseProps } from '../../lib/layout'
import { cn } from '../../lib/utils'

export const containerVariants = cva('mx-auto w-full', {
  variants: {
    size: {
      sm: 'max-w-[40rem]',
      md: 'max-w-[48rem]',
      lg: 'max-w-[64rem]',
      xl: 'max-w-[var(--container-max)]',
      prose: 'max-w-[var(--measure)]',
      full: 'max-w-none',
    },
    gutter: {
      none: '',
      sm: 'px-3 sm:px-4',
      md: 'px-4 sm:px-6 lg:px-8',
      lg: 'px-5 sm:px-8 lg:px-12',
    },
  },
  defaultVariants: {
    size: 'xl',
    gutter: 'md',
  },
})

export interface ContainerProps extends LayoutBaseProps, VariantProps<typeof containerVariants> {}

/** Centres page content at a readable maximum width, with side padding that grows on larger screens. */
export const Container = React.forwardRef<HTMLElement, ContainerProps>(
  ({ as: Comp = 'div', className, size, gutter, ...props }, ref) => (
    <Comp ref={ref} className={cn(containerVariants({ size, gutter }), className)} {...props} />
  )
)

Container.displayName = 'Container'

const sectionSpacing = {
  none: '',
  sm: 'py-6 sm:py-8',
  md: 'py-10 sm:py-14',
  lg: 'py-14 sm:py-20',
}

export interface SectionProps extends Omit<LayoutBaseProps, 'title'> {
  /** Small label above the title. */
  eyebrow?: React.ReactNode
  title?: React.ReactNode
  description?: React.ReactNode
  /** Buttons or links on the right of the heading. */
  actions?: React.ReactNode
  /** Vertical padding. */
  spacing?: keyof typeof sectionSpacing
  /** Wrap the content in a Container of this size. Pass false for full bleed. */
  container?: ContainerProps['size'] | false
  /** Centre the heading, for landing pages. */
  centered?: boolean
}

/** A titled band of a page: optional heading block, then content, inside a Container. */
export const Section = React.forwardRef<HTMLElement, SectionProps>(
  (
    {
      as: Comp = 'section',
      className,
      eyebrow,
      title,
      description,
      actions,
      spacing = 'md',
      container = 'xl',
      centered = false,
      children,
      ...props
    },
    ref
  ) => {
    const titleId = React.useId()
    const hasHeader = Boolean(eyebrow || title || description || actions)

    const inner = (
      <>
        {hasHeader && (
          <div
            className={cn(
              'mb-8 flex flex-wrap gap-4',
              centered ? 'flex-col items-center text-center' : 'items-end justify-between'
            )}>
            <div className={cn('flex max-w-2xl flex-col gap-2', centered && 'items-center')}>
              {eyebrow && <span className="page-eyebrow">{eyebrow}</span>}
              {title && (
                <h2 id={titleId} className="section-title">
                  {title}
                </h2>
              )}
              {description && (
                <p className="leading-relaxed text-[var(--muted-foreground)]">{description}</p>
              )}
            </div>
            {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
          </div>
        )}
        {children}
      </>
    )

    return (
      <Comp
        ref={ref}
        aria-labelledby={title ? titleId : undefined}
        className={cn(sectionSpacing[spacing], className)}
        {...props}>
        {container === false ? inner : <Container size={container}>{inner}</Container>}
      </Comp>
    )
  }
)

Section.displayName = 'Section'
