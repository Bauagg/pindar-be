import "dotenv/config";
import app from "./src/app.js";

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`[APP] Server running on http://localhost:${PORT}`);
}).on('error', (err) => {
  console.error(`[APP] Server error: ${err.message}`);
});

// You can also add more tagged logs throughout your application:
// For errors:
console.error('[APP] Error message');

// For info:
console.log('[APP] Info message');

// For warnings:
console.warn('[APP] Warning message');

// For debug:
console.debug('[APP] Debug message');
