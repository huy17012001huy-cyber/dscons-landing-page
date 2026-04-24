const fs = require('fs');
const path = require('path');

const sectionsDir = path.join(__dirname, 'src/components/sections');
const files = fs.readdirSync(sectionsDir).filter(file => file.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(sectionsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  let changed = false;

  // Add import if not exists
  if (!content.includes('usePageContext')) {
    content = content.replace(
      /import \{ getSectionData \} from "@\/lib\/api";/g,
      `import { getSectionData } from "@/lib/api";\nimport { usePageContext } from "@/contexts/PageContext";`
    );
    changed = true;
  }

  // Inject usePageContext hook
  if (!content.includes('const { pageId } = usePageContext();')) {
    content = content.replace(
      /export default function (\w+)\(\s*\{.*\}\s*(:\s*\{.*\}\s*)?\)\s*\{/,
      `export default function $1({ data: previewData }: { data?: any }) {\n  const { pageId } = usePageContext();`
    );
    
    // Some might not have props
    content = content.replace(
      /export default function (\w+)\(\)\s*\{/,
      `export default function $1() {\n  const { pageId } = usePageContext();`
    );
    changed = true;
  }

  // Update getSectionData calls
  const regex = /getSectionData\("([^"]+)"\)/g;
  if (regex.test(content)) {
    content = content.replace(regex, 'getSectionData("$1", pageId)');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
  }
}

// Also update Footer.tsx
const footerPath = path.join(__dirname, 'src/components/landing/Footer.tsx');
if (fs.existsSync(footerPath)) {
  let footerContent = fs.readFileSync(footerPath, 'utf8');
  if (!footerContent.includes('usePageContext')) {
    footerContent = footerContent.replace(
      /import \{ getSectionData \} from "@\/lib\/api";/g,
      `import { getSectionData } from "@/lib/api";\nimport { usePageContext } from "@/contexts/PageContext";`
    );
    footerContent = footerContent.replace(
      /const Footer = \(\{\s*data: serverData\s*\}\s*:\s*\{\s*data\?:\s*any\s*\}\)\s*=>\s*\{/,
      `const Footer = ({ data: serverData }: { data?: any }) => {\n  const { pageId } = usePageContext();`
    );
    footerContent = footerContent.replace(/getSectionData\("([^"]+)"\)/g, 'getSectionData("$1", pageId)');
    fs.writeFileSync(footerPath, footerContent, 'utf8');
    console.log(`Updated Footer.tsx`);
  }
}
