import os

css_path = r'e:\ANTIGRAVITY\DSCons_Landing Page_Zoom\src\index.css'

with open(css_path, 'r', encoding='utf-8') as f:
    css_content = f.read()

gradients = [
    ('cyber-blue', '#1A2980', '#26D0CE'),
    ('neon-tech', '#00C9FF', '#92FE9D'),
    ('digital-ocean', '#43E97B', '#38F9D7'),
    ('deep-space', '#4facfe', '#00f2fe'),
    ('matrix-code', '#0ba360', '#3cba92'),
    ('luxury-gold', '#F6D365', '#FDA085'),
    ('royal-amber', '#f6d365', '#ffb347'),
    ('sunset-glow', '#FF512F', '#F09819'),
    ('hot-flame', '#ff0844', '#ffb199'),
    ('rich-success', '#f7971e', '#ffd200'),
    ('creative-plum', '#667eea', '#764ba2'),
    ('neon-purp', '#fbc2eb', '#a6c1ee'),
    ('vivid-pink', '#ff0844', '#ffb199'),
    ('magic-dust', '#a18cd1', '#fbc2eb'),
    ('unicorn', '#C33764', '#1D2671'),
    ('cool-gray', '#8e9eab', '#eef2f3'),
    ('silver-dark', '#4CA1AF', '#C4E0E5'),
    ('ocean-pearl', '#89f7fe', '#66a6ff'),
    ('forest-fog', '#5C258D', '#4389A2'),
    ('midnight', '#232526', '#414345')
]

additions = []
for name, c1, c2 in gradients:
    additions.append(f"""  .text-gradient-{name} {{
    @apply bg-clip-text text-transparent;
    background-image: linear-gradient(135deg, {c1} 0%, {c2} 100%);
    background-size: 200% auto;
    animation: shine 4s linear infinite;
  }}""")

new_css_block = '\n\n'.join(additions)

if "text-gradient-cyber-blue" not in css_content:
    new_content = css_content.replace('.shadow-btn-pro {', new_css_block + '\n\n  .shadow-btn-pro {')
    with open(css_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Added CSS gradients successfully.")
else:
    print("Gradients already exist.")
