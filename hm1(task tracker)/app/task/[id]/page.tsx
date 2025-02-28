import TaskDetailClient from '@/components/TaskDetailClient';

interface Task {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
  priority?: 'High' | 'Medium' | 'Low';
}

export async function generateStaticParams() {
  const res = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=10');
  const tasks = await res.json();
  
  return tasks.map((task: Task) => ({
    id: task.id.toString(),
  }));
}

export default async function TaskDetailPage({ params }: { params: { id: string } }) {
  let initialTask = null;
  let initialError = null;
  
  try {
    const res = await fetch(`https://jsonplaceholder.typicode.com/todos/${params.id}`, { next: { revalidate: 3600 } });
    
    if (!res.ok) {
      if (res.status === 404) {
        initialError = 'Task not found';
      } else {
        initialError = 'Failed to fetch task';
      }
    } else {
      const data = await res.json();
      
      const priorities: Array<'High' | 'Medium' | 'Low'> = ['High', 'Medium', 'Low'];
      initialTask = {
        ...data,
        priority: priorities[Math.floor(Math.random() * priorities.length)]
      };
    }
  } catch (err) {
    initialError = err instanceof Error ? err.message : 'An error occurred';
  }
  
  return <TaskDetailClient params={params} initialTask={initialTask} initialError={initialError} />;
}