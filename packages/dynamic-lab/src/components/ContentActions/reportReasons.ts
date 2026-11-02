export const DEFAULT_REPORT_REASONS = [
  { value: 'rating', label: 'Wrong age rating', description: 'The content is rated too low.' },
  {
    value: 'tags',
    label: 'Missing or wrong tags',
    description: 'Tags hide what the work contains.',
  },
  {
    value: 'theft',
    label: 'Stolen or uncredited work',
    description: "It's someone else's art or writing.",
  },
  { value: 'spam', label: 'Spam or advertising' },
  { value: 'other', label: 'Something else' },
]
