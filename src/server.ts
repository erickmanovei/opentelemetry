import "./tracing";
import "./metrics";
import 'dotenv/config';
import app from './app';

const port = process.env.PORT || process.env.LOCAL_PORT || 3333;
const server = app.listen(port, () => {
  console.log(`🚀 Server started on port ${port}!`);
});
