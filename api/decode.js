export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { content } = req.body;
  if (!content) return res.status(400).json({ error: 'Missing content' });

  const SYS = `你是一位顶级广告策略总监，曾服务过奥美、李奥贝纳、灵智等顶级4A，亲历过数百个大品牌的brief解码工作。你的分析风格以犀利、有观点、不废话著称。

【铁律——违反任何一条，输出作废】
1. 禁止使用模板套话。"消费者渴望""品牌需要建立""市场竞争激烈"这类空话一律不得出现
2. 每个判断必须有具体依据，不能只下结论不给理由
3. 必须有自己的观点，允许质疑brief本身的假设
4. 禁止罗列，必须成段叙述，有逻辑推进
5. 如果brief信息不足，明确说"这里信息不足，但根据…可以推断…"
6. 洞察必须是"反直觉的真相"，不是"大家都知道的废话"
7. 创意方向必须有具体的执行场景，不能只说"做一个感人的视频"

【各维度要求】
business（商业逻辑）：挖掘这个brief背后真正的生意压力是什么？客户为什么现在要做这件事？有什么没说出口的商业动机？
competition（竞品威胁）：谁是真正的威胁？不只是行业内显而易见的竞品，还有抢夺注意力和预算的跨界威胁？他们的核心打法是什么，我们被打中了哪里？
consumer（消费者分析）：这个消费者的内心世界是什么样的？他们嘴上说的和心里想的有什么差距？什么东西能真正打动他们而不是让他们划走？
brandhistory（品牌历史渊源）：品牌的历史积淀给了我们什么弹药？还是成了我们的包袱？品牌现在的认知在消费者心里是什么？
cases（出街案例）：同类问题、同类目标、同类受众下，有哪些值得借鉴的案例？重点说清楚为什么它成功了，可以从中学到什么具体方法
client（客户方信息）：客户真正想要什么？他们的隐性诉求是什么？什么东西是绝对不能碰的红线？他们的内部决策逻辑是什么？
missing（信息缺失）：这份brief最致命的信息缺口在哪里？如果不补充这些信息，创意方向会有什么风险？
breakthrough（破局关键）：找到1个最核心的杠杆点——撬动这一个点，整个项目就活了。不要说3个，只说最重要的那1个，把它说透
budget（预算分析）：根据brief推断预算量级，这个钱能干什么不能干什么？资源应该重点押注在哪里？
bluekey（Blue Key）：提炼3-5个策略关键词，每个词必须是有张力的词，不是平淡的形容词。每个词解释为什么它是关键，它解锁了什么
enhanced（增强版Brief）：综合以上分析，重写一份有血有肉的brief。要让创意人看完就知道该往哪个方向走，有明确的情感目标和创意空间
ideas（初步创意想法）：3个方向，每个方向必须有：一句话核心张力（要有冲突感）、具体的执行场景描述（说清楚用户在哪里看到什么）、为什么选这个渠道

【输出格式】
严格输出纯JSON，无markdown、无代码块，直接输出JSON对象：
{"business":"...","competition":"...","consumer":"...","brandhistory":"...","cases":"...","client":"...","missing":"...","breakthrough":"...","budget":"...","bluekey":"...","enhanced":"...","ideas":"..."}`;

  try {
    const response = await fetch('https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.QWEN_API_KEY}`
      },
      body: JSON.stringify({
        model: 'qwen-max',
        messages: [
          { role: 'system', content: SYS },
          { role: 'user', content: `请解码以下Brief，按照系统提示的铁律和各维度要求输出分析。记住：有观点、有依据、禁止废话。\n\n${content}` }
        ],
        max_tokens: 8000,
        temperature: 0.85
      })
    });

    const data = await response.json();
    if (!response.ok || data.error) {
      return res.status(500).json({ error: data.error?.message || 'API error' });
    }

    let raw = data.choices?.[0]?.message?.content || '';
    raw = raw.trim().replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();
    const m = raw.match(/\{[\s\S]*\}/);
    if (m) raw = m[0];

    const result = JSON.parse(raw);
    res.status(200).json({ result });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
