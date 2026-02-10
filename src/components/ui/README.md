# UI Components Documentation

## Overview

This directory contains reusable UI components built with React and Tailwind CSS. All components follow a consistent design system and are fully responsive.

## Components

### Button

A versatile button component with multiple variants, sizes, and states.

**Props:**
- `variant`: `'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'` (default: `'primary'`)
- `size`: `'sm' | 'md' | 'lg'` (default: `'md'`)
- `loading`: `boolean` - Shows a loading spinner
- `disabled`: `boolean` - Disables the button
- `className`: `string` - Additional CSS classes
- All standard button HTML attributes

**Usage:**
```jsx
import Button from '@/components/ui/Button'

<Button variant="primary" size="md">Click me</Button>
<Button variant="outline" loading={isLoading}>Submit</Button>
<Button variant="danger" disabled>Delete</Button>
```

---

### Card

A container component with optional header, content, and footer sections.

**Components:**
- `Card` - Main container
- `CardHeader` - Header section
- `CardTitle` - Title text
- `CardDescription` - Subtitle/description text
- `CardContent` - Main content area
- `CardFooter` - Footer section (with border-top)

**Props:**
- `className`: `string` - Additional CSS classes
- All standard div HTML attributes

**Usage:**
```jsx
import Card, { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card'

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Your content here</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

---

### Input

A form input component with label, error, and helper text support.

**Props:**
- `label`: `string` - Input label
- `error`: `string` - Error message to display
- `helperText`: `string` - Helper text below input
- `required`: `boolean` - Shows required asterisk
- `className`: `string` - Additional CSS classes
- All standard input HTML attributes

**Usage:**
```jsx
import Input from '@/components/ui/Input'

<Input 
  label="Email"
  type="email"
  placeholder="seu@email.com"
  required
  helperText="We'll never share your email"
/>

<Input 
  label="Username"
  error="Username already taken"
/>
```

---

### Modal

A modal/dialog component with backdrop, header, and content areas.

**Props:**
- `open`: `boolean` - Controls modal visibility
- `onClose`: `function` - Called when modal should close
- `title`: `string` - Modal title
- `description`: `string` - Modal description/subtitle
- `size`: `'sm' | 'md' | 'lg' | 'xl' | 'full'` (default: `'md'`)
- `className`: `string` - Additional CSS classes
- `children`: React nodes - Modal content

**Features:**
- Prevents body scroll when open
- Closes on ESC key press
- Closes on backdrop click
- Smooth slide-up animation

**Usage:**
```jsx
import Modal from '@/components/ui/Modal'

const [open, setOpen] = useState(false)

<Modal
  open={open}
  onClose={() => setOpen(false)}
  title="Confirm Action"
  description="Are you sure you want to continue?"
  size="md"
>
  <div className="space-y-4">
    <p>Modal content here</p>
    <div className="flex gap-2">
      <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
      <Button onClick={handleConfirm}>Confirm</Button>
    </div>
  </div>
</Modal>
```

---

### Badge

A small label component for displaying status, categories, or counts.

**Props:**
- `variant`: `'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger'` (default: `'default'`)
- `size`: `'sm' | 'md' | 'lg'` (default: `'md'`)
- `className`: `string` - Additional CSS classes
- `children`: React nodes - Badge content

**Usage:**
```jsx
import Badge from '@/components/ui/Badge'

<Badge variant="success">Active</Badge>
<Badge variant="danger" size="sm">Error</Badge>
<Badge variant="primary">New</Badge>
```

---

## Importing Components

### Individual Imports
```jsx
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Modal from '@/components/ui/Modal'
import Badge from '@/components/ui/Badge'
```

### Named Imports (from index)
```jsx
import { Button, Card, CardHeader, CardTitle, Input, Badge, Modal } from '@/components/ui'
```

---

## Responsive Design

All components are built with mobile-first responsive design using Tailwind CSS breakpoints:

- `sm`: 640px (Mobile landscape)
- `md`: 768px (Tablet)
- `lg`: 1024px (Desktop)
- `xl`: 1280px (Large desktop)
- `2xl`: 1536px (Extra large)

**Example responsive grid:**
```jsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
  {/* Cards will stack on mobile, 2 cols on tablet, 3 on desktop, 4 on large screens */}
</div>
```

---

## Accessibility

All components follow basic accessibility guidelines:

- **Keyboard Navigation**: All interactive elements are keyboard accessible
- **Focus States**: Visible focus rings on all focusable elements
- **ARIA Labels**: Use appropriate labels for screen readers
- **Semantic HTML**: Using proper HTML5 elements

**Example:**
```jsx
<Button aria-label="Close modal">
  <X className="w-4 h-4" />
</Button>
```

---

## Customization

All components accept a `className` prop for additional styling. The `cn()` utility function (from `@/lib/utils`) merges classes intelligently, handling Tailwind conflicts.

**Example:**
```jsx
<Button className="w-full mt-4">Full width button</Button>
<Card className="border-2 border-primary-500">Custom border</Card>
```

---

## Testing

A comprehensive test page is available at `/app/test-ui` showcasing all components in various states and configurations. Use this page to:

- Verify responsive behavior at different screen sizes
- Test component variants and states
- See component usage examples
- Test accessibility features

---

## Color System

The design system uses a consistent color palette defined in `tailwind.config.js`:

**Primary Color** (Indigo):
- Used for primary actions and brand elements
- Shades: 50-950

**Secondary Color** (Purple):
- Used for secondary actions and accents
- Shades: 50-950

**Status Colors**:
- Success: Green (#10b981)
- Warning: Amber (#f59e0b)
- Error/Danger: Red (#ef4444)

---

## Best Practices

1. **Consistency**: Always use these UI components instead of creating custom ones
2. **Responsive**: Test components at different screen sizes
3. **Accessibility**: Always provide labels and aria-attributes when needed
4. **Props**: Use TypeScript or PropTypes for type safety (future enhancement)
5. **Composition**: Combine components to create complex UIs

---

## Future Enhancements

- [ ] Add TypeScript definitions
- [ ] Add unit tests with React Testing Library
- [ ] Add dark mode support
- [ ] Add animation variants
- [ ] Add more components (Tabs, Dropdown, Tooltip, etc.)
- [ ] Add Storybook for component documentation
