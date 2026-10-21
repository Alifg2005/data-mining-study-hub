// Fails the build if the production bundle contains private source references.
// The lecture materials live in the gitignored source_materials/ folder; only readable
// source titles and page/slide numbers may reach the deployed site.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const DIST = 'dist';
const FORBIDDEN = [/source_materials/i, /\.(pptx?|docx?)\b/i, /_Note\.pdf/i];

const files = [];
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full);
    else files.push(full);
  }
};
walk(DIST);

const problems = [];
for (const file of files) {
  if (/\.(pdf|pptx?|docx?)$/i.test(file)) problems.push(`${file}: source document file in the bundle`);
  if (!/\.(js|css|html|json|txt|svg|map)$/i.test(file)) continue;
  const text = readFileSync(file, 'utf8');
  for (const pattern of FORBIDDEN) {
    const match = text.match(pattern);
    if (match) problems.push(`${file}: contains "${match[0]}"`);
  }
}

if (problems.length > 0) {
  console.error(`Bundle privacy check failed:\n- ${problems.join('\n- ')}`);
  process.exit(1);
}
console.log(`Bundle privacy check passed (${files.length} files scanned).`);
