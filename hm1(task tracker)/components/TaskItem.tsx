import Link from 'next/link';
import Image from 'next/image';

interface Task {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
  priority?: 'High' | 'Medium' | 'Low';
}

interface TaskItemProps {
  task: Task;
}

export default function TaskItem({ task }: TaskItemProps) {
  const statusIcon = task.completed 
    ? '/check-circle.svg' 
    : '/clock.svg';
  
  const priorityStyles = {
    High: 'bg-red-100 text-red-800 border-red-200',
    Medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    Low: 'bg-green-100 text-green-800 border-green-200',
  };
  
  const priorityStyle = task.priority ? priorityStyles[task.priority] : '';
  
  return (
    <div className={`border rounded-lg p-4 transition hover:shadow-md ${task.priority ? priorityStyles[task.priority] : 'bg-white'}`}>
      <div className="flex items-start gap-3">
        <div className="relative w-6 h-6 mt-0.5">
          <Image 
            src={statusIcon}
            alt={task.completed ? "Completed" : "Pending"}
            width={24}
            height={24}
          />
        </div>
        
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-medium text-gray-900">{task.title}</h3>
            {task.priority && (
              <span className={`text-xs px-2 py-1 rounded-full ${priorityStyle}`}>
                {task.priority}
              </span>
            )}
          </div>
          
          <p className="text-sm text-gray-600 mt-1">
            Status: <span className={task.completed ? "text-green-600 font-medium" : "text-amber-600 font-medium"}>
              {task.completed ? "Completed" : "Pending"}
            </span>
          </p>
          
          <div className="mt-3">
            <Link 
              href={`/task/${task.id}`}
              className="text-sm font-medium text-blue-600 hover:text-blue-800 transition"
            >
              View Details →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}