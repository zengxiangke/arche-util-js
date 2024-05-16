import { useState } from 'react';

export default function HomePage() {
  const [content, setContent] = useState('');

  const onTest = async () => {
    const res = await fetch(
      'https://open.bigmodel.cn/api/paas/v4/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: 'Bearer <your-api-key>',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'glm-4',
          stream: true,
          messages: [
            {
              role: 'user',
              content: '深圳市简介',
            },
          ],
        }),
      }
    );

    const stream = res.body;
    const reader = stream.getReader();
    const readData = async () => {
      const { value, done } = await reader.read();
      if (done) {
        console.log('done reading');
        return;
      }

      const strValue = new TextDecoder().decode(value);
      strValue
        .split('\n\n')
        .filter((item) => item)
        .forEach((item) => {
          try {
            const msg = JSON.parse(item.replace('data:', '')).choices[0].delta
              .content;
            setContent((old) => old + msg);
            console.log(msg);
          } catch {}
        });

      // recursion
      readData();
    };
    readData();
  };

  return (
    <div>
      <button onClick={onTest}>hello zhipu ai</button>
      <h3>Response to "深圳市简介":</h3>
      <pre>{content}</pre>
    </div>
  );
}
