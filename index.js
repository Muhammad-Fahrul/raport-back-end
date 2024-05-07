import app from './application/web.js';
import connectDB from './config/db.js';

const PORT = 3000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
