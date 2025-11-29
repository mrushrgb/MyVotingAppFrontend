# Reusable Components Documentation

## Overview
This project includes a comprehensive set of reusable UI components designed specifically for the Cloud-Based Voting System. These components follow modern React patterns and provide consistent styling, accessibility features, and responsive design.

## Quick Start

```javascript
import { Button, Card, Modal, FormInput, LoadingSpinner } from '../components/shared';
```

## Components

### 1. Button Component

A flexible button component with multiple variants, sizes, and states.

#### Usage
```javascript
import { Button, PrimaryButton, SecondaryButton } from '../components/shared';

// Basic usage
<Button variant="primary" onClick={handleClick}>
    Click me
</Button>

// With icon
<Button variant="success" icon="fas fa-check" iconPosition="left">
    Verified
</Button>

// Loading state
<Button variant="primary" loading={isLoading}>
    Submit
</Button>

// Themed shortcuts
<PrimaryButton icon="fas fa-vote">Vote Now</PrimaryButton>
<SecondaryButton size="lg">Cancel</SecondaryButton>
```

#### Props
- `variant`: `primary | secondary | success | danger | warning | info | outline-primary | ghost`
- `size`: `sm | md | lg | xl`
- `disabled`: boolean
- `loading`: boolean
- `icon`: Font Awesome class name
- `iconPosition`: `left | right`
- `onClick`: Function
- `type`: `button | submit | reset`

### 2. Card Component

Flexible card component with glass morphism design and multiple variants.

#### Usage
```javascript
import { Card, GlassCard } from '../components/shared';

// Basic card
<Card variant="glass" hover>
    <Card.Header>
        <Card.Title>Election Status</Card.Title>
    </Card.Header>
    <Card.Body>
        <Card.Text>Your voting status information</Card.Text>
    </Card.Body>
    <Card.Footer>
        <Button variant="primary">View Details</Button>
    </Card.Footer>
</Card>

// Card with icon
<Card variant="primary" onClick={handleClick}>
    <Card.Icon icon="fas fa-vote" color="primary" size="lg" />
    <Card.Title>Cast Your Vote</Card.Title>
    <Card.Text>Participate in the election</Card.Text>
</Card>

// Themed shortcut
<GlassCard hover>
    <Card.Body>Content here</Card.Body>
</GlassCard>
```

#### Props
- `variant`: `default | glass | solid | primary | success | warning | danger | info`
- `size`: `sm | md | lg | xl`
- `hover`: boolean - adds hover effects
- `shadow`: boolean - adds drop shadow
- `borderRadius`: `sm | md | lg | xl | 2xl`
- `onClick`: Function - makes card clickable

#### Sub-components
- `Card.Header`: Card header section
- `Card.Body`: Main content area
- `Card.Footer`: Footer section
- `Card.Title`: Styled heading (h1-h6)
- `Card.Text`: Styled paragraph text
- `Card.Icon`: Icon with color variants

### 3. Modal Component

Accessible modal dialog with backdrop and keyboard navigation.

#### Usage
```javascript
import { Modal, ConfirmModal } from '../components/shared';

// Basic modal
<Modal 
    isOpen={showModal} 
    onClose={() => setShowModal(false)}
    title="Voter Registration"
    size="lg"
>
    <Modal.Body>
        <p>Modal content here</p>
    </Modal.Body>
    <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button variant="primary" onClick={onSave}>Save</Button>
    </Modal.Footer>
</Modal>

// Confirmation modal shortcut
<ConfirmModal
    isOpen={showConfirm}
    onClose={() => setShowConfirm(false)}
    onConfirm={handleDelete}
    title="Confirm Deletion"
    message="Are you sure you want to delete this item?"
/>
```

#### Props
- `isOpen`: boolean - controls modal visibility
- `onClose`: Function - called when modal should close
- `title`: string - modal title
- `size`: `sm | md | lg | xl | full`
- `centered`: boolean - centers modal vertically
- `backdrop`: boolean - allows backdrop click to close
- `keyboard`: boolean - allows escape key to close

### 4. FormInput Component

Comprehensive form input with validation, icons, and accessibility features.

#### Usage
```javascript
import { FormInput } from '../components/shared';

<FormInput
    type="email"
    label="Email Address"
    placeholder="Enter your email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    icon="fas fa-envelope"
    required
    error={errors.email}
    helpText="We'll never share your email"
/>
```

#### Props
- `type`: Standard HTML input types
- `label`: string - input label
- `placeholder`: string
- `value`: string
- `onChange`: Function
- `error`: string - error message
- `success`: string - success message
- `disabled`: boolean
- `required`: boolean
- `size`: `sm | md | lg`
- `variant`: `default | solid | outline`
- `icon`: Font Awesome class name
- `iconPosition`: `left | right`
- `helpText`: string - help text below input

### 5. LoadingSpinner Component

Multiple spinner variants for loading states.

#### Usage
```javascript
import { LoadingSpinner, PulseSpinner, BarSpinner, RingSpinner } from '../components/shared';

// Default spinner
<LoadingSpinner size="lg" variant="primary" text="Loading..." />

// Full screen overlay
<LoadingSpinner fullScreen size="xl" text="Processing..." />

// Alternative styles
<PulseSpinner size="md" variant="success" />
<BarSpinner size="lg" variant="warning" />
<RingSpinner size="md" variant="info" />
```

#### Props
- `size`: `sm | md | lg | xl`
- `variant`: `primary | secondary | success | danger | warning | info | white`
- `text`: string - optional loading text
- `overlay`: boolean - creates positioned overlay
- `fullScreen`: boolean - creates full screen overlay

## Styling Guidelines

### Color Variants
- **Primary**: Blue gradient (`#667eea` to `#764ba2`)
- **Secondary**: Gray gradient
- **Success**: Green gradient
- **Danger**: Red gradient
- **Warning**: Yellow/Orange gradient
- **Info**: Cyan/Purple gradient

### Size Scale
- **sm**: Small - mobile-friendly minimum sizes
- **md**: Medium - default size for desktop
- **lg**: Large - prominent elements
- **xl**: Extra Large - hero elements

### Glass Morphism Theme
All components support a modern glass morphism design with:
- Semi-transparent backgrounds
- Backdrop blur effects
- Subtle borders and shadows
- Smooth hover transitions

## Accessibility Features

All components include:
- Proper ARIA labels and roles
- Keyboard navigation support
- Focus indicators
- Screen reader compatibility
- High contrast mode support
- Reduced motion support

## Advanced Usage

### Higher-Order Components

```javascript
import { withLoading } from '../components/shared';

const MyComponent = ({ data }) => <div>{data}</div>;
const MyComponentWithLoading = withLoading(MyComponent);

// Usage
<MyComponentWithLoading loading={isLoading} data={data} />
```

### Custom Theming

```javascript
// Override CSS custom properties for theming
:root {
    --primary-color: #your-color;
    --glass-bg: rgba(255, 255, 255, 0.1);
    --border-radius: 12px;
}
```

### Composition Patterns

```javascript
// Compose components for complex UI patterns
const VotingCard = ({ candidate, onVote }) => (
    <GlassCard hover>
        <Card.Icon icon="fas fa-user" color="primary" />
        <Card.Title>{candidate.name}</Card.Title>
        <Card.Text>{candidate.party}</Card.Text>
        <PrimaryButton onClick={() => onVote(candidate.id)} icon="fas fa-vote">
            Vote for {candidate.name}
        </PrimaryButton>
    </GlassCard>
);
```

## Best Practices

1. **Consistent Sizing**: Use the same size scale across related components
2. **Color Semantics**: Use color variants consistently (success for positive actions, danger for destructive actions)
3. **Accessibility**: Always provide proper labels and ARIA attributes
4. **Loading States**: Use loading spinners for async operations
5. **Error Handling**: Display clear error messages in forms
6. **Responsive Design**: Test components on different screen sizes
7. **Performance**: Use React.memo() for expensive components

## Migration Guide

To convert existing components to use the reusable system:

1. Replace hardcoded buttons with `<Button>` component
2. Wrap content in `<Card>` components for consistent styling
3. Use `<FormInput>` for all form fields
4. Replace custom modals with `<Modal>` component
5. Add loading states with `<LoadingSpinner>`

## Examples

See `ReusableComponentsDemo.js` and `ImprovedVoterDashboard.js` for comprehensive examples of component usage in the voting system context.
