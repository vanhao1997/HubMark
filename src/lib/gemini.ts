import { GoogleGenAI } from '@google/genai';
import * as cheerio from 'cheerio';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * Lấy nội dung text từ web và sử dụng Gemini 1.5 Flash để tóm tắt
 */
export async function fetchAndSummarize(url: string) {
    try {
        // 1. Fetch data from URL
        const response = await fetch(url, {
            headers: {
                'User-Agent':
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 HubMark/1.0',
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch url: ${response.statusText}`);
        }

        const html = await response.text();

        // 2. Load into cheerio and clean up
        const $ = cheerio.load(html);

        // Xóa các elements rác không mang ý nghĩa nội dung
        $('script, style, noscript, nav, footer, header, iframe, svg, img').remove();

        // Lấy plain text
        const title = $('title').text().trim() || 'Untitled Bookmark';
        let content = $('body').text();

        // Xóa khoảng trắng thừa
        content = content.replace(/\s+/g, ' ').trim();

        // Giới hạn chữ (khoảng 3000-5000 ký tự đầu tiên là đủ để tóm tắt nội dung)
        if (content.length > 5000) {
            content = content.substring(0, 5000);
        }

        // 3. Gọi Gemini
        const prompt = `Bạn là một trợ lý thông minh giúp tóm tắt nội dung trang web để người dùng lưu trữ.
Vui lòng tóm tắt ngắn gọn, đi thẳng vào vấn đề (khoảng 3-5 câu) nội dung chính của văn bản sau.
Nếu văn bản bằng tiếng Anh, hãy tóm tắt bằng tiếng Việt hoặc giữ nguyên tiếng Anh tùy nội dung gốc, ưu tiên tiếng Việt dễ hiểu.

TIÊU ĐỀ: ${title}
NỘI DUNG VĂN BẢN:
${content}

TÓM TẮT:`;

        const chatResponse = await ai.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: prompt,
        });

        const summary = chatResponse.text()?.trim() || 'Không thể tạo bản tóm tắt phân tích AI.';

        return {
            title,
            summary,
        };
    } catch (error) {
        console.error('Error in fetchAndSummarize:', error);
        return {
            title: url,
            summary: 'Lỗi không thể bóc tách nội dung hoặc gọi AI cho trang web này.',
        };
    }
}
