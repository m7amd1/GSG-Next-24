import Link from 'next/link';
import Image from 'next/image';
import TaskItem from '@/components/TaskItem';

interface Task {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
  priority?: 'High' | 'Medium' | 'Low';
}

const addPriorityToTasks = (tasks: Task[]): Task[] => {
  const priorities: Array<'High' | 'Medium' | 'Low'> = ['High', 'Medium', 'Low'];
  
  return tasks.map(task => ({
    ...task,
    priority: priorities[Math.floor(Math.random() * priorities.length)]
  }));
};

export default async function Home() {
  const res = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=5', { next: { revalidate: 3600 } });
  
  if (!res.ok) {
    throw new Error('Failed to fetch tasks');
  }
  
  const tasks: Task[] = await res.json();
  const tasksWithPriority = addPriorityToTasks(tasks);
  
  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Task Tracker</h1>
          <p className="text-gray-600">Manage your tasks efficiently</p>
        </header>
        
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Tasks</h2>
            
            <div className="space-y-4">
              {tasksWithPriority.map((task) => (
                <TaskItem key={task.id} task={task} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}