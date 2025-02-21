import { NextResponse } from 'next/server';
import { db } from '@/app/db';
import { todos } from '@/app/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const allTodos = await db.select().from(todos);
    return NextResponse.json(allTodos);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch todos' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { content } = await request.json();
    const newTodo = await db.insert(todos).values({ content }).returning();
    return NextResponse.json(newTodo[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create todo' }, { status: 500 });
  }
} 