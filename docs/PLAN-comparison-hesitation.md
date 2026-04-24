# Project Plan: Comparison Hesitation Field

## 1. Context & Objectives
**Goal:** Enhance the AI Course Comparison module by adding a new input field to capture the user's biggest hesitation when choosing between DSCons and another center. The AI should analyze this hesitation before delivering its final conclusion.

**Current State:**
- The modal currently collects the user's "Nhu cầu" (Need/Goal) at the beginning.
- The AI uses this need to filter and compare data, providing a final summary.

**New Requirements:**
- **UI Update:** Add a new textarea/input field at the end of the comparison setup (or right before submitting): "Nếu bạn đang phân vân với trung tâm khác thì điều gì khiến bạn khó lựa chọn nhất để đăng ký 2 trung tâm DSCons hoặc Trung tâm còn lại?"
- **AI Logic Update:** Send this new `hesitation` data to the Gemini AI prompt.
- **AI Prompt Update:** Instruct the AI to explicitly analyze this hesitation point *before* giving the final conclusion, ensuring the answer directly addresses the user's specific concern.

## 2. Socratic Questions (Pending User Confirmation)
Before implementation, we need to clarify:
1. **Location of the field:** Should this new "Hesitation" field appear at the very beginning (alongside "Nhu cầu") or at the end of the form just before they click the final submit button?
2. **Database:** Should we also save this "Hesitation" data into the `competitor_queries` table so Admin can view it in the history?
3. **Required vs Optional:** Is this new field mandatory or optional for the user to fill out?

## 3. Implementation Steps

### Phase 1: Database & API Updates (If saving is required)
- Update `supabase_setup_competitor_queries.sql` to include a `hesitation` column (if not using JSONB).
- Update `src/lib/api.ts` -> `saveCompetitorQuery` to accept and save the new `hesitation` field.

### Phase 2: UI Updates (Course Comparison Component)
- **File:** `src/components/landing/CourseComparison.tsx`
- Add state: `const [hesitation, setHesitation] = useState("")`
- Render the new `Textarea` or `Input` in the appropriate step of the modal.

### Phase 3: AI Prompt Engineering
- **File:** `src/lib/gemini.ts`
- Modify the system prompt to include the `hesitation` variable.
- Instruct Gemini: "Sau khi so sánh các tiêu chí, TRƯỚC KHI kết luận, hãy dành một phần để phân tích điểm phân vân của học viên: [hesitation]. Đưa ra lập luận khách quan để giải quyết điểm phân vân này."

### Phase 4: Admin Dashboard Updates (Optional)
- **File:** `src/pages/admin/Dashboard.tsx`
- Update the "Lịch sử Học viên Tra Cứu" to display the `hesitation` field alongside the `student_need`.
- Include it in the Excel Export.

## 4. Verification
- [ ] User can enter hesitation.
- [ ] AI explicitly addresses the hesitation in its response.
- [ ] Data is saved correctly (if requested).
- [ ] UI looks consistent with existing design.
