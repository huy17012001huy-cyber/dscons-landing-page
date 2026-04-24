# Landing Page Settings Module Plan

## Overview
This plan outlines the implementation of a comprehensive "Settings" and "Statistics" module for the Landing Page Admin Dashboard. It centralizes system configurations, tracking metrics, and exit-intent popup management.

## Project Type
WEB

## Success Criteria
- [ ] Admin can view and manage basic account credentials and roles.
- [ ] Admin can configure the API Key used for the AI comparison feature.
- [ ] Admin can customize the Exit-Intent Popup (text content, enable/disable email field).
- [ ] Admin can view a tracking dashboard showing page views (real-time/daily).
- [ ] Admin can embed and view a third-party heatmap (Hotjar/Clarity) via iframe within the CMS.

## Tech Stack
- Frontend: React, Tailwind CSS, Framer Motion, Lucide Icons
- Data Management: Existing state management & API utility (`src/lib/api.ts`)
- Analytics/Embeds: Standard `<iframe>` integration for Clarity/Hotjar.

## Missing Information / Socratic Gate (Open Questions)
✅ **Answers confirmed:**
1. **Admin Accounts:** Will use a real database (Supabase/Postgres) for authentication and role management.
2. **Tracking Data:** No existing analytics backend. We need to build a simple custom tracking endpoint to record page views.
3. **Exit-Intent Email Collection:** The collected emails will be sent via API to a Make/n8n webhook.

---

## Task Breakdown

### Phase 1: Database & Backend Prep
- **Task 1: Extend Configuration Schema**
  - **Agent**: `backend-specialist`
  - **Action**: Add fields to the backend configuration/database to store: `api_key`, `exit_popup_config` (json), and `admin_roles`.
  - **Verify**: API returns the new configuration fields correctly.

- **Task 2: Implement Exit-Intent & Tracking Endpoints (If custom)**
  - **Agent**: `backend-specialist`
  - **Action**: Create API endpoints to save collected emails from the popup, and endpoints to log page views (if not using external GA).
  - **Verify**: Can POST email to endpoint successfully.

### Phase 2: Settings UI Implementation
- **Task 3: Create Settings Tab in Dashboard**
  - **Agent**: `frontend-specialist`
  - **Action**: Add a new "Cài đặt & Thống kê" tab to `Dashboard.tsx` navigation.
  - **Verify**: Clicking the tab shows a blank/placeholder settings view.

- **Task 4: Admin Management & API Key Forms**
  - **Agent**: `frontend-specialist`
  - **Action**: Build UI forms for Admin Account (Read-only view of current user role/password change) and API Key input for the Comparison AI.
  - **Verify**: Saving the form updates the settings backend.

- **Task 5: Exit-Intent Popup Config UI**
  - **Agent**: `frontend-specialist`
  - **Action**: Build forms to edit popup title, description, and toggle for "Email Collection Field".
  - **Verify**: State updates correctly and saves to backend.

### Phase 3: Analytics Dashboard Implementation
- **Task 6: Statistics UI (Page Views)**
  - **Agent**: `frontend-specialist`
  - **Action**: Create a stats card showing Daily/Real-time page views.
  - **Verify**: Data renders correctly from the tracking API.

- **Task 7: Heatmap Iframe Integration**
  - **Agent**: `frontend-specialist`
  - **Action**: Add an input for the Hotjar/Clarity embed URL and render the `<iframe>` below the statistics.
  - **Verify**: Iframe loads the correct external URL securely.

### Phase 4: Public Landing Page Integration
- **Task 8: Implement Exit-Intent Popup on Landing Page**
  - **Agent**: `frontend-specialist`
  - **Action**: Create the `ExitPopup.tsx` component that triggers when the user's mouse leaves the viewport. Bind it to the settings configured in Task 5.
  - **Verify**: Popup appears only once per session when the cursor leaves the page top.

## Phase X: Verification
- [ ] **Lint**: Run ESLint and TypeScript checks.
- [ ] **Security**: Ensure API keys are NOT exposed to the public landing page bundle.
- [ ] **Build**: Next.js/Vite build succeeds.
- [ ] **UX Check**: Iframe is responsive and popup doesn't annoy mobile users.
