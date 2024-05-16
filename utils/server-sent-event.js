const express = require('express');

const server = express();
server.get('/', (req, res) => {
  res.type('text/event-stream');
  res.writeHead(200, {
    connection: 'keep-alive',
    'cache-control': 'no-cache',
  });

  let count = 0;
  const intervalId = setInterval(() => {
    count += 1;
    const data = { message: 'Hello World' };
    res.write(`data: ${JSON.stringify(data)}\n\n`);

    if (count === 10) {
      clearInterval(intervalId);
      res.end();
    }
  }, 1000);

  req.on('close', () => {
    clearInterval(intervalId);
    res.end();
    console.log('client disconnected');
  });
});

const port = 8888;
server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

async function readOnClient() {
  const res = await fetch('/');
  const stream = res.body;
  const reader = stream.getReader();
  const readData = async () => {
    const { value, done } = await reader.read();
    if (done) {
      console.log('done reading');
      return;
    }

    const strValue = new TextDecoder().decode(value);
    console.log('get chunk: ', [strValue]);
    // recursion
    readData();
  };
  readData();
}
