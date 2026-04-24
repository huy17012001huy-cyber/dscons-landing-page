# PLAN-comparison-table-ui: Refactor Comparison Table UI

Refactor the AI Comparison section to use a cleaner, more professional, and minimalist tabular interface inspired by modern design standards.

## 1. Analysis & Inspiration
- **Target Aesthetic:** Clean, tabular, high-contrast, professional.
- **Inspiration:** Minimalist pricing/comparison tables (e.g., Stripe, SaaS comparison charts).
- **Core Elements:** 
  - Clear header row with plan/entity names.
  - Sidebar for criteria labels.
  - Integrated but subtle AI analysis result.
  - High-quality SVG checkmarks/icons.

## 2. Design System (UI-UX-Pro-Max)
- **Primary Color:** `#0D9488` (Teal) or existing DSCons Primary (`#33AAEF`).
- **Typography:** Jost (Body), Bodoni Moda (Heading/Display).
- **Style:** Micro-interactions, subtle borders, high-quality spacing.
- **Anti-patterns to avoid:** Clutter, excessive shadows, inconsistent column widths.

## 3. Implementation Steps

### Phase 1: Preparation
- [ ] Backup current `src/components/landing/CourseComparison.tsx`.
- [ ] Define the new structure for the table component.

### Phase 2: Refactoring `CourseComparison.tsx`
- [ ] **Simplify `ComparisonModal`:**
  - Remove excessive gradients and heavy borders.
  - Use a clean, rounded card structure.
  - Implement a true "Comparison Table" layout (Criteria | Entity A | Entity B).
- [ ] **Styling the Table:**
  - Standardize column widths (e.g., 40% | 30% | 30%).
  - Use alternating row colors for readability.
  - Implement professional SVG icons for checkmarks/crosses.
- [ ] **AI Verdict Integration:**
  - Redesign the "AI Assistant" section to be more integrated into the table flow.
  - Use a cleaner, less "alert-like" box for the final verdict.

### Phase 3: Integration & Polish
- [ ] Ensure full responsiveness (mobile view should transform into a stacked or swipeable list).
- [ ] Add smooth transitions (Framer Motion) for opening/closing and AI result appearance.
- [ ] Verify accessibility (contrast, aria labels).

## 4. Verification Checklist
- [ ] Table is clean and easy to read.
- [ ] Column widths are consistent.
- [ ] AI analysis still works and populates correctly.
- [ ] Mobile view is usable and looks good.
- [ ] Dark mode and Light mode are both supported and readable.

## 5. Timeline
- Phase 1 & 2: 1 hour
- Phase 3 & Testing: 30 minutes
