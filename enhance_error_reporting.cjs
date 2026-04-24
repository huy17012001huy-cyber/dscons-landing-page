const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'pages', 'admin', 'Dashboard.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Update handleSaveDraft to show error message
content = content.replace(
    /console\.error\("Save draft error:", e\);\s+toast\.error\("Đã xảy ra lỗi!"\);/,
    `console.error("Save draft error:", e);
      toast.error(e.message || "Đã xảy ra lỗi khi lưu nháp!");`
);

// 2. Update handlePublish to show error message
content = content.replace(
    /console\.error\("Publish error:", e\);\s+toast\.error\("Đã xảy ra lỗi!"\);/,
    `console.error("Publish error:", e);
      toast.error(e.message || "Đã xảy ra lỗi khi xuất bản!");`
);

fs.writeFileSync(filePath, content);
console.log('Added detailed error reporting to Dashboard.tsx.');
