#!/usr/bin/env node
// CommonJS stub to dynamically import the ESM entrypoint
(async () => {
  try {
    await import('./build/index.js');
  } catch (e) {
    console.error('Failed to launch ESM entrypoint:', e);
    process.exit(1);
  }
})();

