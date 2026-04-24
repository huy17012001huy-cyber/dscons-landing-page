import os

file_path = 'src/components/landing/ComparisonTable.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    text = f.read()

# Replace Mojibake with correct text
text = text.replace('Báº¢NG SO SÃ NH CHáº¤T LÆ¯á»¢NG KHÃ“A Há»ŒC', 'BẢNG SO SÁNH CHẤT LƯỢNG KHÓA HỌC')
text = text.replace('Trung tÃ¢m khÃ¡c', 'Trung tâm khác')
text = text.replace('Báº®T Ä áº¦U SO SÃ NH Tá»° Ä á»˜NG', '{config.buttonText || "BẮT ĐẦU SO SÁNH TỰ ĐỘNG"}')
text = text.replace('ðŸ“  TIÃŠU CHÃ  SO SÃ NH', '📌 TIÊU CHÍ SO SÁNH')
text = text.replace('TRUNG TÃ‚M KHÃ C', 'TRUNG TÂM KHÁC')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(text)
