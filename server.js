import "dotenv/config";
import app from "./src/app.js";
const PORT = process.env.PORT || 4000;

console.log('[APP] Server running on http://localhost:4000');
// Your logs will be tagged with [APP] for easy filtering

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
