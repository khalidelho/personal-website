// Prints the built /resume page to public/resume.pdf with headless Chrome, so the
// download always matches the web résumé. Run via `npm run resume:pdf`, which builds
// first and rebuilds after (the page shows its download button only when the PDF exists).
// The PDF is gitignored: it carries the .env contact details, which stay out of the repo.
import { createServer } from 'node:http';
import { readFile, writeFile, stat, mkdtemp, rm } from 'node:fs/promises';
import { existsSync, rmSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { join, extname, resolve, sep } from 'node:path';
import { tmpdir } from 'node:os';

const dist = resolve('dist');
const out = resolve('public', 'resume.pdf');
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };

const chrome = [
  process.env.CHROME_PATH,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/google-chrome-stable',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
].find((p) => p && existsSync(p));
if (!chrome) throw new Error('No Chrome found; set CHROME_PATH.');
if (!existsSync(join(dist, 'resume', 'index.html'))) throw new Error('Run `astro build` first.');

// Serve dist/ so the page's absolute /_astro/ asset paths resolve.
const server = createServer(async (req, res) => {
  let path = join(dist, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (!path.startsWith(dist + sep)) return res.writeHead(403).end();
  try {
    if ((await stat(path)).isDirectory()) path = join(path, 'index.html');
    res.writeHead(200, { 'content-type': types[extname(path)] ?? 'application/octet-stream' });
    res.end(await readFile(path));
  } catch {
    res.writeHead(404).end();
  }
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const url = `http://127.0.0.1:${server.address().port}/resume/`;

// A throwaway profile, so this never touches a browser the user has open. Chrome is
// driven over the DevTools protocol (`--print-to-pdf` writes the file but can hang on
// exit) and killed when done.
const profile = await mkdtemp(join(tmpdir(), 'resume-pdf-'));
const proc = spawn(chrome, ['--headless=new', `--user-data-dir=${profile}`, '--remote-debugging-port=0', '--no-first-run', 'about:blank'], {
  stdio: ['ignore', 'ignore', 'pipe'],
});
const deadline = setTimeout(() => {
  console.error('timed out after 60s');
  proc.kill('SIGKILL');
  server.close();
  rmSync(profile, { recursive: true, force: true });
  process.exit(1);
}, 60_000);

try {
  const browserWs = await new Promise((res, rej) => {
    let buf = '';
    proc.stderr.on('data', (d) => {
      const m = (buf += d).match(/DevTools listening on (ws:\/\/\S+)/);
      if (m) res(m[1]);
    });
    proc.on('exit', () => rej(new Error('Chrome exited before DevTools was ready')));
    proc.on('error', rej); // e.g. CHROME_PATH not executable
  });
  const port = new URL(browserWs).port;
  const page = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).find((t) => t.type === 'page');
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((r) => ws.addEventListener('open', r, { once: true }));
  let id = 0;
  const send = (method, params = {}) =>
    new Promise((res, rej) => {
      const my = ++id;
      const h = (e) => {
        const m = JSON.parse(e.data);
        if (m.id !== my) return;
        ws.removeEventListener('message', h);
        m.error ? rej(new Error(`${method}: ${m.error.message}`)) : res(m.result);
      };
      ws.addEventListener('message', h);
      ws.send(JSON.stringify({ id: my, method, params }));
    });
  const ev = async (expression) => (await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true })).result.value;

  await send('Page.enable');
  await send('Page.navigate', { url });
  // wait for the load event and the self-hosted fonts
  for (let i = 0; i < 100 && (await ev('document.readyState')) !== 'complete'; i++) await new Promise((r) => setTimeout(r, 100));
  await ev('document.fonts.ready.then(() => true)');
  const { data } = await send('Page.printToPDF', { preferCSSPageSize: true, printBackground: true, displayHeaderFooter: false });
  await writeFile(out, Buffer.from(data, 'base64'));
  ws.close();
} finally {
  clearTimeout(deadline);
  server.close();
  proc.kill();
  if (proc.pid) await new Promise((r) => (proc.exitCode !== null || proc.signalCode !== null ? r() : proc.once('exit', r)));
  // Chrome's helper processes can still be writing the profile after the main one exits, so
  // retry, and never fail the run over a temp dir once the PDF is written.
  await rm(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 }).catch((e) =>
    console.warn(`could not remove ${profile}: ${e.code}`),
  );
}
console.log(`résumé PDF → ${out}`);
