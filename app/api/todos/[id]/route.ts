import { NextResponse } from 'next/server';
import { db } from '@/app/db';
import { todos } from '@/app/db/schema';
import { eq } from 'drizzle-orm';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const todo = await db.select().from(todos).where(eq(todos.id, parseInt(params.id))).limit(1);
    if (!todo.length) {
      return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
    }

    const updatedTodo = await db
      .update(todos)
      .set({ completed: !todo[0].completed })
      .where(eq(todos.id, parseInt(params.id)))
      .returning();

    return NextResponse.json(updatedTodo[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update todo' }, { status: 500 });
  }
} 