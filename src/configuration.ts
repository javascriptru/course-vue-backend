export const configuration = () => ({
  port: parseInt(process.env.PORT, 10) ?? 3000,
  host: process.env.HOST ?? '127.0.0.1',
  publicUrl: process.env.PUBLIC_URL ?? 'https://course-vue.javascript.ru',
  secret: process.env.SECRET ?? 'secret',
  adminKey: process.env.ADMIN_KEY,
  dbRefreshCron: process.env.DB_REFRESH_CRON,
  clientPath: process.env.CLIENT_PATH,
});
