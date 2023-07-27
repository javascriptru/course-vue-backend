import * as fs from 'fs';
import path from 'path';
import { EntityManager, Transaction } from '@mikro-orm/core';
import { getDataToSeed } from './seed-data';
import { InternalServerErrorException } from '@nestjs/common';

export class DatabaseManager {
  private dropSchemaPath = path.join(__dirname, '../../data/drop-schema.sql');
  private createSchemaPath = path.join(
    __dirname,
    '../../data/create-schema.sql',
  );

  private readonly dropSchemaQuery;
  private readonly createSchemaQuery;

  constructor() {
    this.dropSchemaQuery = fs.readFileSync(this.dropSchemaPath, 'utf-8');
    this.createSchemaQuery = fs.readFileSync(this.createSchemaPath, 'utf-8');
  }

  private async execute(em: EntityManager, sql: string, ctx?: Transaction) {
    const lines = sql.split('\n').filter((i) => i.trim());

    for (const line of lines) {
      await em.getConnection().execute(line, [], 'run', ctx);
    }
  }

  dropSchema(em: EntityManager, ctx?: Transaction): Promise<void> {
    return this.execute(em, this.dropSchemaQuery, ctx);
  }

  seed(em: EntityManager): Promise<void> {
    const meetups = getDataToSeed();
    return em.persistAndFlush(meetups);
  }

  createSchema(em: EntityManager, ctx?: Transaction): Promise<void> {
    return this.execute(em, this.createSchemaQuery, ctx);
  }

  async refresh(em: EntityManager) {
    return em.fork().transactional(async (_em) => {
      const ctx: Transaction = _em.getTransactionContext();
      await this.dropSchema(_em, ctx);
      await this.createSchema(_em, ctx);
      await this.seed(_em);
      _em.clear();
      return true;
    });
  }
}
