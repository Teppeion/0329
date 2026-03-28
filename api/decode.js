export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { content } = req.body;
  if (!content) return res.status(400).json({ error: 'Missing content' });

  const SYS = `你是资深广告创意策略总监，20年4A经验。严格输出纯JSON，无markdown、无代码块，直接输出JSON对象：
{"business":"商业逻辑300字","competition":"竞品威胁扫描300字","consumer":"消费者分析300字","brandhistory":"品牌历史渊源250字","cases":"出街案例搜寻300字","client":"客户方信息250字","missing":"Brief信息缺失250字","breakthrough":"破局关键300字","budget":"预算分析250字","bluekey":"Blue Key：3-5个策略关键词，每词50字内解释","enhanced":"增强版Brief400字","ideas":"初步创意想法：3个方向，含核心张力、执行逻辑、适合渠道"}`;

  try {
    const response = await fetch('https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.QWEN_API_KEY}`
      },
      body: JSON.stringify({
        model: 'qwen-plus',
        messages: [
          { role: 'system', content: SYS },
          { role: 'user', content: '解码此Brief：\n\n' + content }
        ],
        max_tokens: 6000
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
