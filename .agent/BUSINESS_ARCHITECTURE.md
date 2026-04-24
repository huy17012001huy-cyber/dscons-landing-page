# Business Agent System — 501 Skills

> Hệ thống AI Agent chuyên biệt cho kinh doanh, marketing và vận hành doanh nghiệp

---

## 📋 Tổng quan

Business Agent System là hệ thống agent modular gồm:

- **21 Specialist Agents** — Các vai trò AI chuyên biệt theo lĩnh vực kinh doanh
- **501 Skills** — Các module kiến thức/quy trình theo từng chuyên môn
- **10 Workflows** — Quy trình slash-command cho các tình huống phức tạp

---

## 🏗️ Cấu trúc thư mục

```plaintext
.agent-business/
├── ARCHITECTURE.md          # File này
├── agents/                  # 21 Agent chuyên biệt
│   ├── orchestrator.md
│   ├── 01-content-writer.md
│   ├── 02-email-automation.md
│   ├── 03-social-media.md
│   ├── 04-seo-search.md
│   ├── 05-ads-paid-media.md
│   ├── 06-sales-funnel.md
│   ├── 07-brand-design.md
│   ├── 08-finance-pricing.md
│   ├── 09-legal-compliance.md
│   ├── 10-operations-system.md
│   ├── 11-hr-team.md
│   ├── 12-customer-consulting.md
│   ├── 13-education-training.md
│   ├── 14-events-speaking.md
│   ├── 15-growth-retention.md
│   ├── 16-analytics-data.md
│   ├── 17-ecommerce-product.md
│   ├── 18-industry-specialist.md
│   ├── 19-ai-technology.md
│   └── 20-nonprofit-community.md
└── workflows/               # 10 Slash Commands
    ├── launch-product.md
    ├── content-campaign.md
    ├── build-funnel.md
    ├── brand-identity.md
    ├── hire-onboard.md
    ├── email-sequence.md
    ├── event-launch.md
    ├── growth-sprint.md
    ├── business-audit.md
    └── create-course.md
```

---

## 🤖 Agents (21)

| # | Agent | Lĩnh vực | Skills |
|---|-------|----------|--------|
| 00 | `orchestrator` | Điều phối đa-agent | Tất cả |
| 01 | `content-writer` | Viết bài, nội dung, copy | 56 |
| 02 | `email-automation` | Email, chuỗi email, automation | 42 |
| 03 | `social-media` | Mạng xã hội, cộng đồng | 38 |
| 04 | `seo-search` | SEO, từ khóa, tìm kiếm | 20 |
| 05 | `ads-paid-media` | Quảng cáo, paid media | 22 |
| 06 | `sales-funnel` | Bán hàng, phễu, proposal | 30 |
| 07 | `brand-design` | Thương hiệu, thiết kế | 24 |
| 08 | `finance-pricing` | Tài chính, định giá | 28 |
| 09 | `legal-compliance` | Pháp lý, hợp đồng | 30 |
| 10 | `operations-system` | Vận hành, SOP, hệ thống | 30 |
| 11 | `hr-team` | Nhân sự, tuyển dụng | 28 |
| 12 | `customer-consulting` | Khách hàng, tư vấn | 18 |
| 13 | `education-training` | Khóa học, đào tạo | 20 |
| 14 | `events-speaking` | Sự kiện, ra mắt, diễn thuyết | 24 |
| 15 | `growth-retention` | Tăng trưởng, giữ chân KH | 24 |
| 16 | `analytics-data` | Phân tích, dữ liệu, báo cáo | 22 |
| 17 | `ecommerce-product` | TMĐT, sản phẩm, marketplace | 24 |
| 18 | `industry-specialist` | Chuyên ngành (SaaS, nhà hàng...) | 15 |
| 19 | `ai-technology` | AI, tự động hóa, công nghệ | 4 |
| 20 | `nonprofit-community` | Phi lợi nhuận, cộng đồng | 2 |

---

## 🔄 Workflows (10)

| Slash Command | Mô tả | Agents tham gia |
|---------------|-------|-----------------|
| `/launch-product` | Ra mắt sản phẩm/dịch vụ hoàn chỉnh | brand, sales, content, email, ads |
| `/content-campaign` | Chiến dịch nội dung đa kênh | content, social, seo, email |
| `/build-funnel` | Xây dựng phễu bán hàng từ đầu | sales, email, ads, analytics |
| `/brand-identity` | Xây dựng thương hiệu từ đầu | brand, content, social |
| `/hire-onboard` | Tuyển dụng & onboarding nhân sự | hr, operations, legal |
| `/email-sequence` | Viết chuỗi email automation | email, content, analytics |
| `/event-launch` | Tổ chức sự kiện / webinar | events, social, email, content |
| `/growth-sprint` | Sprint tăng trưởng 30 ngày | growth, analytics, ads, social |
| `/business-audit` | Kiểm toán toàn diện doanh nghiệp | analytics, finance, operations, hr |
| `/create-course` | Xây dựng khóa học online | education, content, email, ecommerce |

---

## 📂 Skill Directories

Skills nằm trong các thư mục gốc của hệ thống 501 Skills:

```plaintext
SKILL/
├── 1. NOI DUNG & VIET BAI/          (56 skills → Agent 01)
├── 2. EMAIL MARKETING & TU DONG HOA/ (42 skills → Agent 02)
├── 3. MANG XA HOI/                   (38 skills → Agent 03)
├── 4. SEO & TIM KIEM/                (20 skills → Agent 04)
├── 5. QUANG CAO & TRUYEN THONG TRA PHI/ (22 skills → Agent 05)
├── 6. BAN HANG & PHEU CHUYEN DOI/   (30 skills → Agent 06)
├── 7. THUONG HIEU & THIET KE/       (24 skills → Agent 07)
├── 8. TAI CHINH & DINH GIA/         (28 skills → Agent 08)
├── 9. PHAP LY & TUAN THU/           (30 skills → Agent 09)
├── 10. VAN HANH & HE THONG/         (30 skills → Agent 10)
├── 11. NHAN SU & DOI NGU/           (28 skills → Agent 11)
├── 12. KHACH HANG & TU VAN/         (18 skills → Agent 12)
├── 13. KHOA HOC & GIAO DUC/         (20 skills → Agent 13)
├── 14. SU KIEN & DIEN THUYET/       (24 skills → Agent 14)
├── 15. TANG TRUONG & GIU CHAN KHACH HANG/ (24 skills → Agent 15)
├── 16. PHAN TICH & DU LIEU/         (22 skills → Agent 16)
├── 17. THUONG MAI DIEN TU & SAN PHAM/ (24 skills → Agent 17)
├── 18. CHUYEN NGANH/                (15 skills → Agent 18)
├── 19. AI & CONG NGHE/              (4 skills  → Agent 19)
└── 20. PHI LOI NHUAN & CONG DONG/   (2 skills  → Agent 20)
```

---

## 🎯 Skill Loading Protocol

```
Yêu cầu người dùng
        ↓
Orchestrator phân tích → Chọn Agent phù hợp
        ↓
Agent đọc danh sách skills của mình
        ↓
Load skill .md tương ứng từ thư mục skill
        ↓
Thực thi theo quy trình trong skill file
```

---

## 🔗 Bảng tra nhanh — Theo tình huống

| Tình huống | Agent chính | Agents hỗ trợ |
|-----------|-------------|---------------|
| Viết bài blog/landing page | `content-writer` | `seo-search` |
| Chạy quảng cáo Facebook/Google | `ads-paid-media` | `analytics-data`, `content-writer` |
| Ra mắt sản phẩm mới | `sales-funnel` | `brand-design`, `email-automation`, `ads-paid-media` |
| Xây kênh mạng xã hội | `social-media` | `content-writer`, `brand-design` |
| Tuyển dụng nhân sự | `hr-team` | `legal-compliance`, `operations-system` |
| Phân tích kinh doanh | `analytics-data` | `finance-pricing`, `operations-system` |
| Xây dựng thương hiệu | `brand-design` | `content-writer`, `social-media` |
| Tổ chức sự kiện | `events-speaking` | `social-media`, `email-automation` |
| Tăng trưởng doanh thu | `growth-retention` | `analytics-data`, `ads-paid-media`, `email-automation` |
| Xây dựng khóa học | `education-training` | `content-writer`, `ecommerce-product` |

---

## 📊 Thống kê

| Chỉ số | Giá trị |
|--------|---------|
| **Tổng số Agents** | 21 (1 orchestrator + 20 chuyên biệt) |
| **Tổng số Skills** | 501 |
| **Tổng số Workflows** | 10 |
| **Lĩnh vực bao phủ** | Toàn bộ hoạt động doanh nghiệp |
