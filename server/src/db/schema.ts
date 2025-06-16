import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { createId } from '@paralleldrive/cuid2'

export const setor = pgTable('setor', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  descricao: text('descricao').notNull(),
})

export const cargo = pgTable('cargo', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  descricao: text('descricao').notNull(),
  setor: text('setor').notNull().references(() => setor.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade',
  }),
})

export const colaborador = pgTable('colaborador', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  nome: text('nome').notNull(),
  funcao: text('cargo').notNull().references(() => cargo.id),
  createdAt: timestamp('createdAt', { withTimezone: true })
    .notNull()
    .defaultNow(),
})

export const treinamento = pgTable('treinamento', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  nome: text('nome').notNull(),
  validade: timestamp('validade').notNull(),
})

export const cargoTreinamento = pgTable('cargoTreinamento', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  cargo: text('cargo').notNull().references(() => cargo.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade',
  }),
  treinamento: text('treinamento').notNull().references(() => treinamento.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade',
  }),
})

export const treinamentoColaborador = pgTable('treinamentoColaborador', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  colaborador: text('colaborador')
    .notNull()
    .references(() => colaborador.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
  treinamento: text('treinamento')
    .notNull()
    .references(() => treinamento.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
  realizacao: timestamp('realizacao', { withTimezone: true }).notNull(),
})