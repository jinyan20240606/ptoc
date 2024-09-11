// pages/api/draw/page.js

import { NextApiRequest, NextApiResponse } from 'next';
import { streamGenerateCode } from '@/server/events/generateCode';

// https://developer.mozilla.org/docs/Web/API/ReadableStream#convert_async_iterator_to_stream
export const runtime = 'edge';

export default async function handler(req: Request) {
    if (req.method === 'POST') {
        try {
            const { data } = await req.json();
            const buffer: any[] = [];
            // 创建读写流：把大模型的返的流chunk同步写进这个读写流返回给前端
            // 这种流式返回不是SSE那种方式
            const stream = new ReadableStream({
                // 读写流api的start 回调函数
                start(controller) {
                    // 初始化时可以进行的操作，例如设置计数器
                    streamGenerateCode(data, controller).finally(() => {
                        controller.close();
                    });
                },
            });

            return new Response(stream);
        } catch (error) {
            console.log(error);
        }
    }
}
