import OpenAI from "openai";
import { NextRequest } from "next/server";

// 初始化 DeepSeek (兼容 OpenAI SDK)
const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.DEEPSEEK_API_KEY || ''
});

interface TarotCard {
  name: string;
  position: string;
  meaning: string;
}

interface RequestBody {
  question: string;
  cards: TarotCard[];
}

// 在 App Router 中，必须使用具名导出 POST
export async function POST(request: NextRequest) {
  try {
    // 1. 解析前端发来的 JSON 数据
    const { question, cards }: RequestBody = await request.json();

    // 2. 构建提示词 (Prompt)
    const systemPrompt = `你是一位拥有50年经验的神秘塔罗牌大师，语气温柔、神秘且富有哲理。
  用户现在的困惑是：${question}
  
  牌阵【圣三角】结果如下：
  ${cards.map((c, i) => {
    const pos = ['过去', '现在', '未来'][i];
    return `- ${pos}位置: ${c.name} (${c.position})。 牌意: ${c.meaning}`;
  }).join('\n')}
  
  请按照以下结构进行解读：
  1. **整体印象**：用一句诗意的话总结牌面。
  2. **时空分析**：分别解析过去、现在、未来的象征意义。
  3. **最终指引**：给出具体的行动建议或心理指引。
  
  请使用 Markdown 格式输出。`;

    // 3. 创建流式响应 (Stream)
    const encoder = new TextEncoder();
    
    const customStream = new ReadableStream({
      async start(controller) {
        try {
          const completion = await openai.chat.completions.create({
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: "请开始解读。" }
            ],
            model: "deepseek-chat",
            stream: true,
          });

          for await (const chunk of completion) {
            const content = chunk.choices[0]?.delta?.content || "";
            if (content) {
              const text = `data: ${JSON.stringify({ text: content })}\n\n`;
              controller.enqueue(encoder.encode(text));
            }
          }
        } catch (err) {
          console.error("Stream error:", err);
          controller.error(err);
        } finally {
          controller.close();
        }
      },
    });

    // 4. 返回 Response
    return new Response(customStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error("API Error:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}