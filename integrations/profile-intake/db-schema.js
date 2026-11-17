import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
export const profiles = sqliteTable('profiles', {
 id:text('id').primaryKey(), person:text('person').notNull(), payload:text('payload').notNull(), published:integer('published').notNull().default(0), createdAt:text('created_at').notNull()
});
