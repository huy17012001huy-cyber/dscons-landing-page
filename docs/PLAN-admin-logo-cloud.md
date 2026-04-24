# Project Plan: Admin Logo Cloud Integration

## 1. Goal
Replace the current `LogoCloud` in the Pain Points section with a new `Logos3` component (which uses Embla Carousel for auto-scrolling) and make it editable via the Admin panel (text and logos) with live preview.

## 2. Context & Constraints
- **Framework:** React, TypeScript, Tailwind CSS, shadcn/ui.
- **Data Source:** Supabase `cms_sections` (specifically the `pain-points` section).
- **Target Section:** `PainPoints.tsx` and the corresponding Admin editor.
- **New Component:** `Logos3.tsx` with its dependencies (`embla-carousel-react`, `embla-carousel-auto-scroll`, etc.).

## 3. Tasks Breakdown

### Phase 1: Setup & Dependencies
- [ ] Install required NPM packages: `embla-carousel-react`, `embla-carousel-auto-scroll`. (Note: `lucide-react`, `@radix-ui/react-slot`, `class-variance-authority` are likely already installed).
- [ ] Create `src/components/ui/carousel.tsx` (shadcn carousel).
- [ ] Create `src/components/blocks/logos3.tsx`.

### Phase 2: Schema & Data Update
- [ ] Update `src/data/landingContent.ts` to include default `techLogos` data inside the `painPoints` object.
- [ ] Update TypeScript interfaces (if any) to support the new `techLogos` array.

### Phase 3: Admin Panel Integration
- [ ] Modify the Admin `PainPoints` editor component (likely in `src/pages/admin/` or similar).
- [ ] Add input fields for the `techLogos` heading.
- [ ] Add an array editor (add/remove/edit) for the `techLogos` items (image URL, description).
- [ ] Ensure the live preview reflects these changes.

### Phase 4: Landing Page Integration
- [ ] Update `src/components/sections/PainPoints.tsx` to use the new `Logos3` component, feeding it data from the database/state.
- [ ] Verify responsive behavior and auto-scroll functionality.

## 4. Socratic Questions for User
Before implementing, we need to clarify:
1. **Logo Image Uploading:** Do you want the Admin panel to support uploading image files for the logos, or just pasting image URLs (like `https://svgl.app/...`)?
2. **Data Structure:** The current `pain-points` section in the database doesn't have a `techLogos` field. Adding it means old data won't have it. Should we fall back to the default logos if the database field is empty?
3. **Carousel Component:** The provided `Carousel` component relies on shadcn's `Button` component. We should verify if `src/components/ui/button.tsx` already exists in your project. If it does, we can skip creating it, correct?

## 5. Verification
- Verify `npm run dev` builds successfully.
- Verify Admin panel can add/remove logos.
- Verify Landing page displays the scrolling carousel correctly.
