import { MikroORM } from '@mikro-orm/core';
import config from '../mikro-orm.config';
import { DatabaseManager } from './database-manager';

async function getMikroOrmConnection() {
  return MikroORM.init(config);
}

async function dbRefresh() {
  const orm = await getMikroOrmConnection();
  const databaseMaker = new DatabaseManager();
  await databaseMaker.refresh(orm.em);
  await orm.close(true);
}

console.log('[db-refresh] Start');
dbRefresh()
  .then(() => {
    console.log('[db-refresh] Complete');
  })
  .catch((e) => {
    console.error(e);
  });
