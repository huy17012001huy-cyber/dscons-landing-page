---
description: Viết chuỗi email automation hoàn chỉnh. Từ welcome series đến sales sequence, nurture campaigns và re-engagement flows.
---

# /email-sequence — Chuỗi Email Automation

## Nhiệm vụ
$ARGUMENTS

---

## DISCOVERY

```
1. Loại sequence: welcome / nurture / sales / re-engagement / onboarding?
2. Audience segment: cold / warm / hot / customers?
3. Số email mong muốn và khoảng cách giữa các email?
4. ESP (Email Service Provider) đang dùng?
5. Mục tiêu cuối của sequence: convert / retain / upsell?
6. Có lead magnet / free offer đang dùng không?
```

---

## SEQUENCE TYPES

### Welcome Series (5-7 emails, 7-14 ngày)
**Agent:** `email-automation`
```
Day 0: Giao hàng + chào mừng
Day 1: Story + social proof
Day 3: Best content / value
Day 5: FAQ / Overcome objections
Day 7: Soft CTA
Day 10: Community / next steps
```

### Sales Sequence (5-7 emails, 7 ngày)
**Agent:** `email-automation` + `content-writer`
```
Email 1: Problem awareness
Email 2: Agitate + story
Email 3: Solution introduce
Email 4: Social proof + case study
Email 5: Objection handle
Email 6: Urgency/scarcity
Email 7: Last call
```

### Nurture Sequence (8-12 emails, 4-6 tuần)
**Agent:** `email-automation` + `content-writer`
```
Tuần 1: Value-first content
Tuần 2: Education + insight
Tuần 3: Case study + proof
Tuần 4: Soft offer introduction
Tuần 5-6: Continued value + CTA
```

### Re-engagement (3-5 emails, 2 tuần)
**Agent:** `email-automation`
```
Email 1: "Bạn có ổn không?" (casual)
Email 2: Best content piece
Email 3: Special offer / incentive
Email 4: Last chance
Email 5: Unsubscribe gracefully (or stay)
```

---

## AGENTS ĐIỀU PHỐI

### Bước 1 — Strategy
**Agent:** `email-automation`
- Xác định sequence type và cấu trúc
- Audience segmentation
- Trigger và timing

### Bước 2 — Copywriting
**Agent:** `content-writer`
- Subject line variants (2-3 mỗi email)
- Email body copy
- CTA text và placement

### Bước 3 — Analytics Setup
**Agent:** `analytics-data`
- Tracking events (open, click, convert)
- A/B test plan cho subject lines
- Success metrics definition

---

## EMAIL CHECKLIST

```
Mỗi email phải có:
□ Subject line < 50 ký tự + preview text
□ Personalization (first name tối thiểu)
□ 1 chủ đề chính, 1 CTA
□ Không quá 300 chữ (trừ newsletter)
□ Mobile-optimized
□ Unsubscribe link
□ Từ địa chỉ thực (không noreply@)
```
