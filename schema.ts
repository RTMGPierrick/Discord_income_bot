import { pgTable, text, serial, integer, boolean, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const earnings = pgTable("earnings", {
  id: serial("id").primaryKey(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  source: text("source").notNull(), // 'tip', 'command', 'auto'
  userId: text("user_id"),
  description: text("description").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const botActivity = pgTable("bot_activity", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // 'command', 'income_event', 'user_join', etc.
  command: text("command"),
  userId: text("user_id"),
  guildId: text("guild_id"),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const botStats = pgTable("bot_stats", {
  id: serial("id").primaryKey(),
  isOnline: boolean("is_online").notNull().default(true),
  uptime: integer("uptime").notNull().default(0), // in seconds
  totalUsers: integer("total_users").notNull().default(0),
  totalGuilds: integer("total_guilds").notNull().default(0),
  lastUpdate: timestamp("last_update").notNull().defaultNow(),
});

export const incomeConfig = pgTable("income_config", {
  id: serial("id").primaryKey(),
  sourceName: text("source_name").notNull(), // 'tips', 'commands', 'auto'
  enabled: boolean("enabled").notNull().default(true),
  minRate: decimal("min_rate", { precision: 10, scale: 2 }).notNull(),
  maxRate: decimal("max_rate", { precision: 10, scale: 2 }).notNull(),
});

export const insertEarningSchema = createInsertSchema(earnings).omit({
  id: true,
  timestamp: true,
});

export const insertBotActivitySchema = createInsertSchema(botActivity).omit({
  id: true,
  timestamp: true,
});

export const insertBotStatsSchema = createInsertSchema(botStats).omit({
  id: true,
  lastUpdate: true,
});

export const insertIncomeConfigSchema = createInsertSchema(incomeConfig).omit({
  id: true,
});

export type Earning = typeof earnings.$inferSelect;
export type InsertEarning = z.infer<typeof insertEarningSchema>;
export type BotActivity = typeof botActivity.$inferSelect;
export type InsertBotActivity = z.infer<typeof insertBotActivitySchema>;
export type BotStats = typeof botStats.$inferSelect;
export type InsertBotStats = z.infer<typeof insertBotStatsSchema>;
export type IncomeConfig = typeof incomeConfig.$inferSelect;
export type InsertIncomeConfig = z.infer<typeof insertIncomeConfigSchema>;
