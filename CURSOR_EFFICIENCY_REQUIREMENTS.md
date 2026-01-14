# Cursor Efficiency Requirements - So Fluent Platform

## 🎯 Three Golden Rules for Code Generation

### Rule #1: ONE `theme.ts` to Rule Them All

**Location:** `client/src/theme/theme.ts`

**Requirement:**
- ALL colors, fonts, and spacing MUST come from `client/src/theme/theme.ts`
- Applied via Tailwind CSS classes
- NO hardcoded color values (e.g., `#E91E63`, `rgb(233, 30, 99)`)
- NO inline styles with colors
- NO CSS files with hardcoded colors

**✅ CORRECT:**
```jsx
<div className="bg-theme-primary text-theme-text">
  <h1 className="font-display text-4xl">Title</h1>
</div>
```

**❌ WRONG:**
```jsx
<div style={{ backgroundColor: '#E91E63', color: '#1A1A1A' }}>
  <h1 style={{ fontFamily: 'Actay-Regular', fontSize: '36px' }}>Title</h1>
</div>
```

**Tailwind Classes Available:**
- Colors: `bg-theme-primary`, `text-theme-text`, `border-theme-accent`
- Fonts: `font-display`, `font-body`, `font-bold`
- Spacing: Use Tailwind spacing scale (`p-4`, `m-8`, `gap-6`)
- All values come from `theme.ts`

---

### Rule #2: Build Components, Not Pages

**Location:** `client/src/components/`

**Requirement:**
- Every UI element MUST be a reusable component
- Components live in `client/src/components/`
- Pages ONLY assemble components - no direct JSX in pages
- Components are organized by feature/domain

**Component Structure:**
```
client/src/components/
├── common/          # Shared components (Button, Card, Input)
├── student/         # Student-specific components
├── admin/           # Admin-specific components
├── auth/            # Authentication components
└── [feature]/       # Feature-specific components
```

**✅ CORRECT:**
```jsx
// client/src/components/common/Button.jsx
export const Button = ({ children, variant, ...props }) => {
  return (
    <button className={`btn btn-${variant}`} {...props}>
      {children}
    </button>
  );
};

// client/src/pages/student/Dashboard.jsx
import { Button } from '../../components/common/Button';
import { CourseCard } from '../../components/student/CourseCard';

export const Dashboard = () => {
  return (
    <div>
      <Button variant="primary">Enroll</Button>
      <CourseCard course={course} />
    </div>
  );
};
```

**❌ WRONG:**
```jsx
// client/src/pages/student/Dashboard.jsx
export const Dashboard = () => {
  return (
    <div>
      <button style={{ backgroundColor: '#E91E63' }}>Enroll</button>
      <div className="course-card">
        {/* Direct JSX in page */}
      </div>
    </div>
  );
};
```

**Component Checklist:**
- [ ] Is this UI element reusable? → Make it a component
- [ ] Is this UI element used in multiple places? → Make it a component
- [ ] Does this have its own state/logic? → Make it a component
- [ ] Is this a simple element (button, input, card)? → Make it a component

---

### Rule #3: DRY (Don't Repeat Yourself)

**Requirement:**
- Never copy-paste JSX or CSS classes
- If you repeat code 2+ times, turn it into a component
- Extract common patterns into reusable components
- Use composition over duplication

**✅ CORRECT:**
```jsx
// Reusable Card component
export const Card = ({ title, children, variant }) => {
  return (
    <div className={`card card-${variant}`}>
      {title && <h3 className="card-title">{title}</h3>}
      <div className="card-content">{children}</div>
    </div>
  );
};

// Use it everywhere
<Card title="Course" variant="primary">Content</Card>
<Card title="Lesson" variant="secondary">Content</Card>
```

**❌ WRONG:**
```jsx
// Copy-pasted JSX
<div className="card card-primary">
  <h3 className="card-title">Course</h3>
  <div className="card-content">Content</div>
</div>

<div className="card card-primary">
  <h3 className="card-title">Lesson</h3>
  <div className="card-content">Content</div>
</div>
```

**DRY Checklist:**
- [ ] Am I copying JSX? → Extract to component
- [ ] Am I repeating CSS classes? → Extract to component
- [ ] Am I duplicating logic? → Extract to hook/utility
- [ ] Can I compose smaller components? → Do it

---

## 📋 Code Generation Checklist

Before generating any code, verify:

- [ ] **Theme Rule:** All colors/fonts/spacing come from `theme.ts`
- [ ] **Component Rule:** All UI elements are components in `components/`
- [ ] **DRY Rule:** No duplicated code - use components/hooks
- [ ] **File Structure:** Components in `components/`, pages in `pages/`
- [ ] **Naming:** Components use PascalCase, files match component name
- [ ] **Exports:** Components are exported as named exports
- [ ] **Props:** Components accept props for customization
- [ ] **Styling:** Only Tailwind classes, no inline styles

---

## 🚫 What NOT to Do

1. **NO hardcoded colors** - Use `theme.ts` values via Tailwind
2. **NO inline styles** - Use Tailwind classes
3. **NO JSX in pages** - Pages only assemble components
4. **NO copy-paste** - Extract to components
5. **NO direct DOM manipulation** - Use React state/props
6. **NO CSS files for simple styling** - Use Tailwind classes

---

## ✅ Example: Generating a New Feature

**Feature:** Course Card Component

**Step 1:** Check `theme.ts` for colors/spacing
```typescript
// theme.ts has:
colors.primary = '#E91E63'
spacing.4 = '1rem'
```

**Step 2:** Create component in `components/`
```jsx
// client/src/components/student/CourseCard.jsx
export const CourseCard = ({ course }) => {
  return (
    <div className="bg-theme-background p-4 rounded-lg shadow-md">
      <h3 className="font-display text-theme-text text-xl">{course.title}</h3>
      <p className="text-theme-textSecondary mt-2">{course.description}</p>
    </div>
  );
};
```

**Step 3:** Use in page
```jsx
// client/src/pages/student/CoursesList.jsx
import { CourseCard } from '../../components/student/CourseCard';

export const CoursesList = ({ courses }) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      {courses.map(course => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
};
```

---

## 📚 Reference Files

- **Theme:** `client/src/theme/theme.ts`
- **Tailwind Config:** `client/tailwind.config.js`
- **Component Examples:** `client/src/components/common/`
- **Page Examples:** `client/src/pages/student/`

---

**Remember:** These rules ensure consistency, maintainability, and scalability. Follow them strictly!
