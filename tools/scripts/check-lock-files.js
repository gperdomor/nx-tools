const fs = require('fs');

function checkLockFiles() {
  const errors = [];
  if (fs.existsSync('yarn.lock')) {
    errors.push('Invalid occurence of "yarn.lock" file. Please remove it and use only "package-lock.json"');
  }
  if (fs.existsSync('pnpm-lock.yaml')) {
    errors.push('Invalid occurence of "pnpm-lock.yaml" file. Please remove it and use only "package-lock.json"');
  }
  try {
    const content = fs.readFileSync('package-lock.json', 'utf-8');
    if (content.match(/localhost:487/)) {
      errors.push(
        'The "package-lock.json" has reference to local yarn repository ("localhost:4873"). Please use "registry.npmjs.org" in "package-lock.json"'
      );
    }
  } catch {
    errors.push('The "package-lock.json" does not exist or cannot be read');
  }
  return errors;
}

const invalid = checkLockFiles();
if (invalid.length > 0) {
  invalid.forEach((e) => console.log(e));
  process.exit(1);
} else {
  process.exit(0);
}
