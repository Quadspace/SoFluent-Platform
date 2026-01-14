# 📚 Global Architecture Usage Guide

**So Fluent Platform - Component Usage Patterns**

---

## 🎯 QUICK START

### Import Components

```jsx
// Layout components
import { Stack, Grid, Flex } from '../components/layout';
import { StandardPage, StandardSection, StandardContainer } from '../utils/pageConsistency';

// UI components
import { BrandButton, BrandCard, BrandText, Input } from '../components/ui';

// Or import individually
import BrandButton from '../components/common/BrandButton';
import Stack from '../components/layout/Stack';
```

---

## 📦 LAYOUT COMPONENTS

### Stack (Vertical Spacing)

```jsx
import { Stack } from '../components/layout';

// Basic usage
<Stack gap="md">
  <BrandCard>Item 1</BrandCard>
  <BrandCard>Item 2</BrandCard>
</Stack>

// With alignment
<Stack gap="lg" align="center">
  <BrandText size="2xl">Title</BrandText>
  <BrandText>Subtitle</BrandText>
</Stack>

// Gap options: xs, sm, md, lg, xl, 2xl
// Align options: start, center, end, stretch
```

### Grid (Responsive Grid)

```jsx
import { Grid } from '../components/layout';

// 3-column grid (responsive)
<Grid columns={3} gap="lg">
  <BrandCard hover>Feature 1</BrandCard>
  <BrandCard hover>Feature 2</BrandCard>
  <BrandCard hover>Feature 3</BrandCard>
</Grid>

// 2-column grid
<Grid columns={2} gap="md">
  <div>Left</div>
  <div>Right</div>
</Grid>

// Gap options: xs, sm, md, lg, xl, 2xl
// Columns: 1-4 (auto-responsive)
```

### Flex (Flexbox)

```jsx
import { Flex } from '../components/layout';

// Row layout
<Flex direction="row" justify="space-between" align="center" gap="md">
  <BrandText>Title</BrandText>
  <BrandButton>Action</BrandButton>
</Flex>

// Column layout
<Flex direction="column" gap="lg">
  <Input placeholder="Email" />
  <Input placeholder="Password" />
</Flex>

// Options:
// direction: row, column
// justify: flex-start, center, flex-end, space-between, space-around
// align: start, center, end, stretch
// gap: xs, sm, md, lg, xl, 2xl
// wrap: true, false
```

### StandardPage (Page Wrapper)

```jsx
import { StandardPage } from '../utils/pageConsistency';

<StandardPage
  seoTitle="Page Title"
  seoDescription="Page description"
  background="bg-white"
  showNavbar={true}
  showFooter={true}
>
  {/* Page content */}
</StandardPage>
```

### StandardSection (Section Wrapper)

```jsx
import { StandardSection } from '../utils/pageConsistency';

<StandardSection background="bg-gray-50" padding="py-20">
  <h2>Section Title</h2>
  {/* Section content */}
</StandardSection>
```

### StandardContainer (Container Wrapper)

```jsx
import { StandardContainer } from '../utils/pageConsistency';

<StandardContainer maxWidth="max-w-7xl" padding="px-4">
  {/* Content */}
</StandardContainer>
```

---

## 🎨 UI COMPONENTS

### BrandButton

```jsx
import { BrandButton } from '../components/ui';

// Variants
<BrandButton variant="primary">Primary</BrandButton>
<BrandButton variant="secondary">Secondary</BrandButton>
<BrandButton variant="accent">Accent</BrandButton>
<BrandButton variant="ghost">Ghost</BrandButton>
<BrandButton variant="dark">Dark</BrandButton>

// Sizes
<BrandButton size="small">Small</BrandButton>
<BrandButton size="medium">Medium</BrandButton>
<BrandButton size="large">Large</BrandButton>

// States
<BrandButton loading={true}>Loading...</BrandButton>
<BrandButton disabled={true}>Disabled</BrandButton>
<BrandButton fullWidth={true}>Full Width</BrandButton>
```

### BrandCard

```jsx
import { BrandCard } from '../components/ui';

// Variants
<BrandCard variant="default">Default</BrandCard>
<BrandCard variant="dark">Dark</BrandCard>
<BrandCard variant="gradient">Gradient</BrandCard>
<BrandCard variant="outlined">Outlined</BrandCard>

// Hover effect
<BrandCard hover onClick={handleClick}>
  Clickable Card
</BrandCard>
```

### BrandText

```jsx
import { BrandText } from '../components/ui';

// Variants
<BrandText variant="display">Display Text</BrandText>
<BrandText variant="body">Body Text</BrandText>
<BrandText variant="bold">Bold Text</BrandText>

// Sizes
<BrandText size="xs">Extra Small</BrandText>
<BrandText size="sm">Small</BrandText>
<BrandText size="base">Base</BrandText>
<BrandText size="lg">Large</BrandText>
<BrandText size="xl">Extra Large</BrandText>
<BrandText size="2xl">2XL</BrandText>
<BrandText size="3xl">3XL</BrandText>
<BrandText size="4xl">4XL</BrandText>
<BrandText size="5xl">5XL</BrandText>
<BrandText size="6xl">6XL</BrandText>

// Colors
<BrandText color="primary">Primary</BrandText>
<BrandText color="secondary">Secondary</BrandText>
<BrandText color="cherry">Cherry</BrandText>
<BrandText color="gold">Gold</BrandText>
<BrandText color="white">White</BrandText>

// HTML elements
<BrandText as="h1" size="4xl">Heading</BrandText>
<BrandText as="span" size="sm">Span</BrandText>
```

### Input

```jsx
import { Input } from '../components/ui';

// Basic usage
<Input
  type="text"
  placeholder="Enter text"
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>

// States
<Input error={true} placeholder="Error state" />
<Input success={true} placeholder="Success state" />
<Input disabled={true} placeholder="Disabled" />

// Sizes
<Input size="small" placeholder="Small" />
<Input size="medium" placeholder="Medium" />
<Input size="large" placeholder="Large" />

// Full width (default)
<Input fullWidth={true} placeholder="Full width" />
```

---

## 🎨 THEME TOKENS

### Colors

```jsx
// ✅ GOOD - Use theme tokens
className="bg-sofluent-cherry"
className="text-sofluent-gold"
className="border-sofluent-dark"
className="from-sofluent-cherry to-sofluent-cherry-dark"

// ❌ BAD - Hardcoded colors
className="bg-[#E91E63]"
className="text-[#D4AF37]"
className="from-[#E91E63] to-[#C2185B]"
```

### Spacing

```jsx
// ✅ GOOD - Use Tailwind spacing
className="p-4" // 16px
className="m-6" // 24px
className="gap-8" // 32px

// Or use Stack/Grid/Flex components
<Stack gap="lg">...</Stack>
<Grid gap="md">...</Grid>
<Flex gap="xl">...</Flex>

// ❌ BAD - Hardcoded spacing
style={{ padding: '24px' }}
style={{ margin: '16px' }}
```

---

## 📋 BEST PRACTICES

### ✅ DO THIS

1. **Always use theme tokens:**
   ```jsx
   className="bg-sofluent-cherry text-white"
   ```

2. **Always use reusable components:**
   ```jsx
   <BrandButton variant="primary">Click</BrandButton>
   ```

3. **Always use layout components:**
   ```jsx
   <Stack gap="lg">
     <BrandCard>Content</BrandCard>
   </Stack>
   ```

4. **Always use StandardPage:**
   ```jsx
   <StandardPage seoTitle="Page Title">
     {/* Content */}
   </StandardPage>
   ```

### ❌ DON'T DO THIS

1. **Never hardcode colors:**
   ```jsx
   className="bg-[#E91E63]" // ❌
   ```

2. **Never use raw HTML elements:**
   ```jsx
   <button className="...">Click</button> // ❌
   <div className="card">...</div> // ❌
   ```

3. **Never hardcode spacing:**
   ```jsx
   style={{ padding: '24px' }} // ❌
   ```

4. **Never skip StandardPage:**
   ```jsx
   <div>...</div> // ❌ Missing SEO, layout, etc.
   ```

---

## 🎯 COMPLETE EXAMPLE

```jsx
import { StandardPage } from '../utils/pageConsistency';
import { Stack, Grid } from '../components/layout';
import { BrandButton, BrandCard, BrandText, Input } from '../components/ui';

const MyPage = () => {
  return (
    <StandardPage
      seoTitle="My Page"
      seoDescription="Page description"
      background="bg-white"
    >
      <StandardContainer>
        {/* Hero Section */}
        <Stack gap="xl" align="center" className="py-20">
          <BrandText as="h1" size="5xl" color="cherry">
            Welcome
          </BrandText>
          <BrandText size="lg" color="secondary">
            Get started today
          </BrandText>
          <BrandButton variant="primary" size="large">
            Start Now
          </BrandButton>
        </Stack>

        {/* Features Grid */}
        <Grid columns={3} gap="lg" className="py-12">
          <BrandCard hover>
            <BrandText size="xl" weight="bold">Feature 1</BrandText>
            <BrandText>Description</BrandText>
          </BrandCard>
          <BrandCard hover>
            <BrandText size="xl" weight="bold">Feature 2</BrandText>
            <BrandText>Description</BrandText>
          </BrandCard>
          <BrandCard hover>
            <BrandText size="xl" weight="bold">Feature 3</BrandText>
            <BrandText>Description</BrandText>
          </BrandCard>
        </Grid>

        {/* Form Section */}
        <Stack gap="md" className="py-12">
          <Input placeholder="Email" type="email" />
          <Input placeholder="Password" type="password" />
          <BrandButton variant="primary" fullWidth>
            Submit
          </BrandButton>
        </Stack>
      </StandardContainer>
    </StandardPage>
  );
};

export default MyPage;
```

---

## 🚀 QUICK REFERENCE

### Component Imports
```jsx
// Layout
import { Stack, Grid, Flex } from '../components/layout';
import { StandardPage, StandardSection, StandardContainer } from '../utils/pageConsistency';

// UI
import { BrandButton, BrandCard, BrandText, Input } from '../components/ui';
```

### Theme Colors
- `sofluent-cherry` - Primary pink/magenta
- `sofluent-cherry-dark` - Dark pink
- `sofluent-cherry-light` - Light pink
- `sofluent-gold` - Accent gold
- `sofluent-gold-dark` - Dark gold
- `sofluent-gold-light` - Light gold
- `sofluent-dark` - Dark background
- `sofluent-black` - Black background
- `sofluent-white` - White
- `sofluent-gris` - Gray

### Spacing Scale
- `xs` - 4px
- `sm` - 8px
- `md` - 16px
- `lg` - 24px
- `xl` - 32px
- `2xl` - 48px

---

**Remember:** Use components and theme tokens for global fixes! 🎯
