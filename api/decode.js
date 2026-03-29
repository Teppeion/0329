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
6. 洞察必须是反直觉的真相，不是大家都知道的废话
7. 每个维度字数必须充足，不得少于要求字数

【各维度详细要求】

business（商业逻辑，400字）：
挖掘这个brief背后真正的生意压力。客户为什么现在要做这件事，有什么没说出口的商业动机？这个项目在客户内部是什么级别的优先级，背后的KPI压力是什么？品牌在这个生意周期处于什么位置——防守、进攻还是转型？

competition（竞品威胁扫描，400字）：
谁是真正的威胁？不只是行业内显而易见的竞品，还要挖掘抢夺同一批消费者注意力的跨界威胁。他们的核心打法是什么？我们被打中了哪里？哪个竞品的动作最值得警惕，为什么？

consumer（消费者分析，400字）：
这个消费者的内心世界是什么样的？他们嘴上说的和心里想的有什么差距？在这个品类里，他们的决策逻辑是什么？什么东西能真正打动他们而不是让他们划走？他们在什么场景下最容易被说服？

brandhistory（品牌历史渊源，350字）：
品牌的历史积淀给了我们什么弹药？还是成了我们的包袱？品牌现在在消费者心里的真实认知是什么——不是品牌自己认为的，是消费者实际感知到的。这个历史对当前传播有什么具体的意义？

cases（出街案例搜寻，400字）：
同类问题、同类目标、同类受众下，有哪些值得借鉴的经典案例？每个案例说清楚：它解决了什么核心问题，用了什么具体方法，为什么成功，我们可以借鉴哪个具体的执行手法——不是借鉴"情感营销"这种泛概念。

client（客户方信息，350字）：
从brief中读出客户真正想要什么。他们说出口的诉求背后，隐性期待是什么？他们的内部决策链是怎样的，谁是真正的决策人？什么是绝对不能碰的红线？他们对这次合作最大的担忧是什么？

missing（Brief信息缺失，350字）：
这份brief最致命的信息缺口在哪里？按优先级说——哪些缺失会直接导致创意方向跑偏？如果必须在没有这些信息的情况下推进，应该做什么假设？

breakthrough（破局关键，400字）：
只找1个最核心的杠杆点。不要说3个，只说最重要的那1个，把它说透——它是什么、为什么它是关键、撬动它之后会发生什么连锁反应、怎么在创意上把它激活？

budget（预算分析，350字）：
根据brief信息推断预算量级和分配逻辑。这个钱能买什么不能买什么？如果资源有限，应该重点押注在哪个环节——品牌曝光、内容制作、效果投放还是线下体验？给出具体的资源分配建议。

bluekey（Blue Key策略关键词，350字）：
提炼3-5个策略关键词。每个词必须是有张力的词，不是平淡的形容词。格式：词 + 为什么这个词是关键 + 它解锁了什么创意空间。这些词合在一起，要能勾勒出这个项目的策略骨架。

enhanced（增强版Brief，500字）：
这是第11维，任务是：综合前面10个维度的分析，重新撰写一份完整的策略Brief文档。
结构：背景与挑战 → 真正的目标 → 核心受众与洞察 → 传播任务 → 创意边界与禁区 → 成功标准。
注意：这是一份Brief文档，不包含任何创意方向，创意方向在第12维输出。

ideas（初步创意想法，500字）：
这是第12维，任务是：基于前面所有维度的分析（特别是洞察、破局关键、Blue Key），提出3个差异化的创意大方向。
注意：这不是增强版Brief，是具体的创意方向提案。

每个方向包含：
方向名称：一个有记忆点的名字
核心张力：一句话，必须有冲突感，不能平铺直叙
创意逻辑：这个方向为什么成立，踩中了哪个洞察
执行场景：用户在哪里、看到什么、感受到什么，必须具体
适合渠道：为什么选这个渠道，渠道特性和创意逻辑如何匹配

三个方向要有明显差异，不能是同一个思路的变体。`;

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
          {
            role: 'user',
            content: `请解码以下Brief。严格按照系统提示的铁律和各维度要求输出，每个维度必须达到要求字数，内容要有深度有观点。

特别注意第11维和第12维的区别：
- 第11维 enhanced：重写一份完整的策略Brief文档，不包含创意方向
- 第12维 ideas：基于所有分析给出3个具体创意方向，每个方向有名称、张力、逻辑、场景、渠道

输出纯JSON格式，无任何markdown标记，直接输出JSON对象：
{"business":"...","competition":"...","consumer":"...","brandhistory":"...","cases":"...","client":"...","missing":"...","breakthrough":"...","budget":"...","bluekey":"...","enhanced":"...","ideas":"..."}

Brief内容如下：
${content}`
          }
        ],
        max_tokens: 10000,
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
