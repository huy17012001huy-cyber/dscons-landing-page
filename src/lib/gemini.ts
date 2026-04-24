import { getSectionData } from "./api";

/**
 * Gọi Gemini API để thực hiện so sánh đối thủ
 * @param competitorName Tên trung tâm đối thủ
 */
export async function analyzeCompetitor(studentData: any, studentNeed: string = "", retryCount: number = 0): Promise<{ aiData: any }> {
  try {
    // 1. Lấy API Key từ hệ thống
    const settings = await getSectionData("settings");
    const apiKey = settings?.published_content?.api_key || settings?.draft_content?.api_key;

    if (!apiKey) {
      throw new Error("Vui lòng cấu hình Gemini API Key trong phần Cài đặt hệ thống.");
    }

    // 2. Xác định kịch bản phân tích
    const hasCompetitorData = studentData.some((item: any) => 
      item.competitor && 
      item.competitor !== "Chưa có thông tin" && 
      item.competitor.trim() !== ""
    );

    // 3. Chuẩn bị Prompt
    const prompt = `
Bạn là một CHUYÊN GIA ĐỘC LẬP VỀ KIỂM ĐỊNH CHẤT LƯỢNG ĐÀO TẠO Revit MEP và BIM. 
Nhiệm vụ của bạn là đánh giá khách quan dựa trên dữ liệu học viên vừa nhập và nhu cầu cụ thể của họ.

ĐẶC BIỆT LƯU Ý - NHU CẦU CỦA HỌC VIÊN:
"${studentNeed || 'Học viên không nhập yêu cầu cụ thể, hãy phân tích dựa trên các tiêu chí chuẩn chuyên môn.'}"

KỊCH BẢN PHÂN TÍCH:
${!hasCompetitorData ? 
`HƯỚNG 1: Học viên chỉ quan tâm tới DSCons và muốn biết khóa học có phù hợp với nhu cầu của mình hay không.
- Bạn hãy tập trung phân tích sâu vào các ĐIỂM MẠNH của DSCons dựa trên dữ liệu tiêu chí dưới đây.
- Đối chiếu từng thế mạnh của DSCons với "Nhu cầu của học viên" để chứng minh sự phù hợp tối ưu.
- Nếu học viên có nhu cầu đặc thù (vd: học nhanh, thực hành dự án), hãy chỉ rõ DSCons đáp ứng điều đó như thế nào.` : 
`HƯỚNG 2: Học viên đang phân vân giữa DSCons và một "Trung tâm khác".
- Bạn hãy thực hiện so sánh khách quan, công tâm giữa hai bên.
- Dựa trên "Nhu cầu của học viên" để đánh giá xem bên nào có lợi thế hơn trong việc giúp học viên đạt được mục tiêu cá nhân.
- Chỉ ra những điểm "Trung tâm khác" còn thiếu minh bạch hoặc không có thông tin rõ ràng so với DSCons.`
}

Dữ liệu đối chiếu (Bao gồm DSCons và Trung tâm khác):
${JSON.stringify(studentData, null, 2)}

YÊU CẦU PHÂN TÍCH CHI TIẾT:
1. Bạn PHẢI bám sát "NHU CẦU CỦA HỌC VIÊN" ở trên để đưa ra các phân tích và đánh giá mang tính cá nhân hóa cao.
2. Khẳng định bạn là chuyên gia đánh giá công tâm, kết quả 100% phục vụ quyền lợi người học. Gọi là "Trung tâm khác", tuyệt đối không dùng "Trung tâm đối thủ".
3. Khéo léo biến những "điểm yếu" của DSCons (nếu có) thành ĐIỂM MẠNH có lợi cho học viên (VD: học 3 tiếng/buổi giúp tập trung cường độ cao, nhanh ra nghề).
4. Nếu thông tin trung tâm khác bị trống, hãy cảnh báo rủi ro của việc thiếu minh bạch và khuyến nghị học viên cần tìm hiểu kỹ.
5. LƯU Ý QUAN TRỌNG: Nếu ở cột "Trung tâm khác" học viên chỉ điền "Có", "Tương tự", "Giống" (hoặc các từ đồng nghĩa), bạn PHẢI NGẦM HIỂU là trung tâm đó ĐANG CÓ CHÍNH XÁC NHỮNG TÍNH NĂNG/QUYỀN LỢI GIỐNG HỆT NHƯ CỘT DSCons. Hãy đánh giá chúng ngang bằng nhau một cách khách quan thay vì chê là "ghi thiếu chi tiết".
6. Quy tắc HTML: Trường "intro" chỉ được dùng văn bản thuần và tối đa thẻ <strong>...</strong> để nhấn mạnh. Không trả về thẻ HTML bị thiếu thẻ đóng, thẻ bị escape thành text, Markdown, hoặc HTML ngoài các field được yêu cầu.
7. Các field "dscons", "other", "evaluation" và "conclusionPoints" có thể dùng HTML tối thiểu như <ul>, <li>, <strong>, <em>, <p>, <br>. JSON phải hợp lệ và không escape thẻ HTML thủ công thành chữ hiển thị.

TRẢ VỀ KẾT QUẢ DƯỚI DẠNG JSON THEO ĐÚNG CẤU TRÚC SAU (Tuyệt đối không Markdown, không bọc HTML bên ngoài, chỉ trả về JSON hợp lệ):
{
  "intro": "Đoạn văn mở đầu (Phải đề cập đến nhu cầu của học viên, chỉ dùng <strong>...</strong> nếu cần nhấn mạnh)...",
  "table": [
    {
      "criteria": "Tên nhóm nội dung",
      "dscons": "<ul><li>Liệt kê chính xác dữ liệu gốc của DSCons dưới dạng gạch đầu dòng ngắn gọn</li></ul>",
      "other": "<ul><li>Liệt kê chính xác dữ liệu gốc của TT khác dưới dạng gạch đầu dòng</li></ul>",
      "evaluation": "Đánh giá chuyên môn. BẮT BUỘC để icon (✅, ❌, ⚠️) ở đầu mỗi ý, tiếp theo là thẻ <strong> để nhấn mạnh tiêu đề. VD: '✅ <strong>Học phí:</strong> ...'"
    }
  ],
  "conclusionTitle": "Kết Luận Chuyên Môn & Khuyến Nghị",
  "conclusionPoints": [
    "Điểm kết luận 1",
    "Khuyến nghị TÓM LẠI: Phải đưa ra ĐÁNH GIÁ CHỐT HẠ LÀ NÊN CHỌN ĐƠN VỊ NÀO. Vd: 'Với những phân tích trên, DSCons là sự lựa chọn an toàn và hiệu quả hơn hẳn vì...'"
  ]
}
`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, topK: 1, topP: 1, maxOutputTokens: 8192, responseMimeType: "application/json" }
      })
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    const text = data.candidates[0].content.parts[0].text;
    let cleanedText = text.trim();
    
    // Bỏ qua các thẻ markdown code block (nếu có)
    const jsonMatch = cleanedText.match(/(\{[\s\S]*\})|(\[[\s\S]*\])/);
    if (jsonMatch) {
      cleanedText = jsonMatch[0];
    }
    // Hàm đệ quy để replace string an toàn không làm hỏng cấu trúc JSON
    const formatText = (obj: any): any => {
      if (typeof obj === 'string') {
        return obj.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      }
      if (Array.isArray(obj)) {
        return obj.map(formatText);
      }
      if (typeof obj === 'object' && obj !== null) {
        const newObj: any = {};
        for (const key in obj) {
          newObj[key] = formatText(obj[key]);
        }
        return newObj;
      }
      return obj;
    };

    try {
      // 1. Parse JSON nguyên gốc
      let aiResult = JSON.parse(cleanedText);
      
      // 2. Format đệ quy an toàn
      aiResult = formatText(aiResult);
      
      return { aiData: aiResult };
    } catch (parseError: any) {
      console.error("Lỗi parse JSON từ AI:", cleanedText, "Lỗi chi tiết:", parseError.message || parseError);
      
      // Thử lại nếu lỗi parse (tối đa 2 lần)
      if (retryCount < 2) {
        console.warn(`Lỗi API trả về thiếu dữ liệu. Tự động thử lại lần ${retryCount + 1}...`);
        return await analyzeCompetitor(studentData, studentNeed, retryCount + 1);
      }
      
      throw new Error("AI lỗi định dạng: " + (parseError.message || "Unknown error") + " - Đã thử lại 2 lần nhưng không thành công. Vui lòng F12 xem Console!");
    }
  } catch (error: any) {
    throw error;
  }
}
