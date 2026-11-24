const { buildSync } = require('esbuild');
const { renderToStaticMarkup } = require('react-dom/server');
const React = require('react');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const scratch = fs.mkdtempSync(path.join(require('node:os').tmpdir(), 'leonida-build-'));
try {
  const output = path.join(scratch, 'site.cjs');
  buildSync({ absWorkingDir: root, entryPoints: ['src/Site.tsx'], outfile: output,
    bundle: true, platform: 'node', format: 'cjs', jsx: 'automatic',
    nodePaths: require.resolve.paths('react'), logLevel: 'silent' });
  const { Site } = require(output);
  fs.writeFileSync(path.join(root, 'index.html'), '<!doctype html>\n' + renderToStaticMarkup(React.createElement(Site)) + '\n');
  buildSync({ absWorkingDir: root, entryPoints: ['src/preview.ts'], bundle: true,
    outfile: 'runtime/preview.js', target: 'es2020', format: 'iife' });
} finally {
  fs.rmSync(scratch, { recursive: true, force: true });
}
