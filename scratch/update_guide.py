import os

file_path = r'c:\Users\Admin\.gemini\antigravity\brain\afac7d8d-aaeb-434e-a07a-b5a9b9254aa8\guide-gradient.md.resolved'

full_content = r"""# Hướng dẫn sử dụng Mã màu Gradient (Pro Max)

Để giúp Landing Page trở nên sinh động và chuyên nghiệp hơn, bạn có thể sử dụng các ký hiệu đặc biệt dưới đây để tô màu Gradient cho bất kỳ đoạn văn bản nào trong Admin CMS.

### 🎨 Bảng mã màu Gradient (20 Màu)

| Ký hiệu | Tên Hiệu Ứng | Ví dụ | Hiển thị Thực tế |
| :--- | :--- | :--- | :--- |
| `**...**` | Cyber Blue | `Màu **Cyber Blue**` | <span style="background: linear-gradient(to right, #00f2fe, #4facfe); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: bold; padding: 2px;">Văn bản Cyber Blue</span> |
| `!!...!!` | Luxury Gold | `Màu !!Luxury Gold!!` | <span style="background: linear-gradient(to right, #ffdf00, #d4af37); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: bold; padding: 2px;">Văn bản Luxury Gold</span> |
| `~~...~~` | Digital Ocean | `Màu ~~Digital Ocean~~` | <span style="background: linear-gradient(to right, #4facfe, #00f2fe); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: bold; padding: 2px;">Văn bản Digital Ocean</span> |
| `[[...]]` | Creative Plum | `Màu [[Creative Plum]]` | <span style="background: linear-gradient(to right, #e0c3fc, #8ec5fc); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: bold; padding: 2px;">Văn bản Creative Plum</span> |
| `{{...}}` | Neon Tech | `Màu {{Neon Tech}}` | <span style="background: linear-gradient(to right, #00ff87, #60efff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: bold; padding: 2px;">Văn bản Neon Tech</span> |
| `++...++` | Deep Space | `Màu ++Deep Space++` | <span style="background: linear-gradient(to right, #434343, #000000); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: bold; padding: 2px;">Văn bản Deep Space</span> |
| `==...==` | Matrix Code | `Màu ==Matrix Code==` | <span style="background: linear-gradient(to right, #0ba360, #3cba92); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: bold; padding: 2px;">Văn bản Matrix Code</span> |
| `^^...^^` | Royal Amber | `Màu ^^Royal Amber^^` | <span style="background: linear-gradient(to right, #f6d365, #fda085); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: bold; padding: 2px;">Văn bản Royal Amber</span> |
| `--...--` | Sunset Glow | `Màu --Sunset Glow--` | <span style="background: linear-gradient(to right, #ff512f, #dd2476); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: bold; padding: 2px;">Văn bản Sunset Glow</span> |
| `%%...%%` | Hot Flame | `Màu %%Hot Flame%%` | <span style="background: linear-gradient(to right, #ff9a9e, #fecfef); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: bold; padding: 2px;">Văn bản Hot Flame</span> |
| `$$...$$` | Rich Success | `Màu $$Rich Success$$` | <span style="background: linear-gradient(to right, #11998e, #38ef7d); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: bold; padding: 2px;">Văn bản Rich Success</span> |
| `@@...@@` | Neon Purple | `Màu @@Neon Purple@@` | <span style="background: linear-gradient(to right, #bc4e9c, #f80759); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: bold; padding: 2px;">Văn bản Neon Purple</span> |
| `&&...&&` | Vivid Pink | `Màu &&Vivid Pink&&` | <span style="background: linear-gradient(to right, #ff0844, #ffb199); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: bold; padding: 2px;">Văn bản Vivid Pink</span> |
| `>>...>>` | Magic Dust | `Màu >>Magic Dust>>` | <span style="background: linear-gradient(to right, #fdcbf1, #e6dee9); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: bold; padding: 2px;">Văn bản Magic Dust</span> |
| `<<...<<` | Unicorn | `Màu <<Unicorn<<` | <span style="background: linear-gradient(to right, #a18cd1, #fbc2eb); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: bold; padding: 2px;">Văn bản Unicorn</span> |
| `??...??` | Cool Gray | `Màu ??Cool Gray??` | <span style="background: linear-gradient(to right, #e0e0e0, #8f94fb); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: bold; padding: 2px;">Văn bản Cool Gray</span> |
| `::...::` | Silver Dark | `Màu ::Silver Dark::` | <span style="background: linear-gradient(to right, #434343, #000000); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: bold; padding: 2px;">Văn bản Silver Dark</span> |
| `;;...;;` | Ocean Pearl | `Màu ;;Ocean Pearl;;` | <span style="background: linear-gradient(to right, #2af598, #009efd); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: bold; padding: 2px;">Văn bản Ocean Pearl</span> |
| `,,...,,` | Forest Fog | `Màu ,,Forest Fog,,` | <span style="background: linear-gradient(to right, #5a3f37, #2c7744); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: bold; padding: 2px;">Văn bản Forest Fog</span> |
| `vv...vv` | Midnight | `Màu vvMidnightvv` | <span style="background: linear-gradient(to right, #141e30, #243b55); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: bold; padding: 2px;">Văn bản Midnight</span> |

*(Lưu ý: Không được để khoảng trắng ngay giữa ký hiệu và chữ, ví dụ `** Revit**` là sai, phải là `**Revit**` mới đúng)*

---

## 3. Cách lấy bộ Icon (Lucide React)

Trang quản trị có trang bị các ô nhập tên Icon (VD: ở phần Lộ trình học, Tiêu chí so sánh...). Hệ thống sử dụng bộ thư viện biểu tượng **Lucide React**.

### Các bước lấy tên Icon:
1. Bạn hãy truy cập vào trang web: **[lucide.dev/icons](https://lucide.dev/icons)**
2. Tìm kiếm từ khóa biểu tượng (Ví dụ: `laptop`, `check`, `star`...).
3. Nhìn tên tiếng Anh của nó (Ví dụ: `CheckCircle`, `TrendingUp`) và nhập **chính xác tên này** (viết hoa các chữ cái đầu) vào ô input ở trang Admin.

> [!TIP]
> **Các Icon xịn sò hay dùng cho Landing Page:**
> - `CheckCircle` (Dấu tick tròn - Dùng cho tính năng)
> - `Star` (Ngôi sao - Dùng cho Review)
> - `Zap` (Tia sét - Tốc độ, Hiệu suất)
> - `ShieldCheck` (Cái khiên - Uy tín, bảo hành)
> - `TrendingUp` (Mũi tên lên - Sự thăng tiến)
> - `Package` (Hộp quà - Quà tặng Bonus)
> - `PlayCircle` (Nút Play video)

---

## 4. Bảng biểu tượng (Emoji) Pro Max - Copy nhanh

Dưới đây là kho biểu tượng khổng lồ cho Landing Page. Bạn chỉ cần bôi đen và Copy.

### ✨ Nhóm Thu hút & Nổi bật
`🔥` `✨` `🚀` `🎯` `💎` `⭐` `🌟` `⚡` `💥` `🚩` `📍` `🔔` `📢` `✅` `✔️` `💯` `🔥` `👑` `🔝` `🎇` `🧨` `🌈` `☀️` `🔮` `🧿` `🏆` `🥇` `🎖️` `🎊` `🎉` `🦾`

### 🎁 Nhóm Quà tặng & Ưu đãi
`🎁` `🧧` `💰` `💵` `🏷️` `🛍️` `🛒` `📦` `💳` `💎` `📈` `📉` `💼` `🤝` `📣` `💵` `💴` `💶` `💷` `💸` `💰` `🪙` `🏦` `🏮` `🧧` `🪅`

### 📚 Nhóm Học tập & Công việc
`💻` `🖥️` `📱` `🎬` `🎥` `📚` `📖` `📝` `✏️` `🎓` `💡` `🛠️` `⚙️` `🧠` `🏢` `📑` `📅` `📋` `🔍` `🖌️` `📐` `📏` `📎` `✒️` `🧪` `⚖️` `🧱` `🧬` `🔭` `🔬`

### ⏱️ Nhóm Thời gian & Tốc độ
`📅` `📆` `⏰` `⌛` `⏳` `🚩` `🏁` `☀️` `🌙` `🔥` `🌊` `🕰️` `⏱️` `⏲️` `⏲️` `🏎️` `🚄` `💨` `⚡` `⏩` `⏭️` `🔋` `🔌` `🛰️`

### 💬 Nhóm Liên hệ & Xã hội
`📞` `☎️` `✉️` `📧` `🌐` `💬` `🗨️` `👤` `👥` `👉` `👇` `➡️` `🔗` `🏠` `🤝` `🗣️` `👥` `🫂` `📱` `💻` `📩` `📮` `📡` `📢` `📣` `📻`

### 👍 Nhóm Cảm xúc & Hành động
`😊` `😍` `😎` `🤩` `🥳` `😂` `😇` `🧐` `🤫` `🤔` `👍` `👌` `✌️` `🤞` `👏` `🙌` `🤝` `💪` `☝️` `👈` `👉` `👇` `👆` `❤️` `💖` `🔥` `🎉` `🤝` `🫂` `🤙` `👊` `🤛` `🤜`

### 🔴 Nhóm Trạng thái & Hình khối
`🔴` `🟠` `🟡` `🟢` `🔵` `🟣` `⚫` `⚪` `🟤` `🟥` `🟧` `🟨` `🟩` `🟦` `🟪` `⬛` `⬜` `🟫` `🔸` `🔹` `🔺` `🔻` `💠` `🌀` `♾️` `✅` `❎` `⚠️` `🚫` `🛑` `⛔`

### ✈️ Nhóm Du lịch & Đời sống
`✈️` `🚗` `🚲` `🏠` `🏢` `🏖️` `🏔️` `🗺️` `🚩` `☕` `🥤` `🍰` `🍕` `🍔` `🥂` `🍻` `🍎` `⚽` `🎮` `🎨` `🎵` `🎭` `🍿` `🎡` `🏨` `🏩` `🏨` `🗺️` `🏔️`

---
*Chúc bạn tạo được những nội dung ấn tượng nhất!*
"""

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(full_content)

print("File updated with HUGE emoji list.")
