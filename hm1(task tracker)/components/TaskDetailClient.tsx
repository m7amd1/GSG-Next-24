'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Copy, CheckCircle, Clock } from 'lucide-react';

interface Task {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
  priority?: 'High' | 'Medium' | 'Low';
}

interface TaskDetailClientProps {
  params: { id: string };
  initialTask: Task | null;
  initialError: string | null;
}

export default function TaskDetailClient({ params, initialTask, initialError }: TaskDetailClientProps) {
  const [task, setTask] = useState<Task | null>(initialTask);
  const [loading, setLoading] = useState(!initialTask && !initialError);
  const [error, setError] = useState<string | null>(initialError);
  const [copied, setCopied] = useState(false);
  
  useEffect(() => {
    if (initialTask || initialError) {
      return;
    }
    
    const fetchTask = async () => {
      try {
        const res = await fetch(`https://jsonplaceholder.typicode.com/todos/${params.id}`);
        
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error('Task not found');
          }
          throw new Error('Failed to fetch task');
        }
        
        const data = await res.json();
        
        setTask(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTask();
  }, [params.id, initialTask, initialError]);
  
  const copyToClipboard = () => {
    if (task) {
      navigator.clipboard.writeText(task.title)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch(err => {
          console.error('Failed to copy: ', err);
        });
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading task details...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    if (error === 'Task not found') {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
          <div className="text-center max-w-md">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Task Not Found</h1>
            <p className="text-gray-600 mb-6">The task youre looking for doesnt exist or has been removed.</p>
            <Link 
              href="/"
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to Tasks
            </Link>
          </div>
        </div>
      );
    }
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md px-4">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Something went wrong!</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link 
            href="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Tasks
          </Link>
        </div>
      </div>
    );
  }
  
  if (!task) {
    return null;
  }
  
  const priorityStyles = {
    High: 'bg-red-100 text-red-800 border-red-200',
    Medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    Low: 'bg-green-100 text-green-800 border-green-200',
  };
  
  const priorityStyle = task.priority ? priorityStyles[task.priority] : '';
  
  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link 
          href="/"
          className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 mb-6"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Tasks
        </Link>
        
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="relative h-48 bg-gradient-to-r from-blue-500 to-indigo-600">
            <div className="absolute inset-0 flex items-center justify-center">
              <Image
                src={`https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80`}
                alt="Task background"
                fill
                style={{ objectFit: 'cover' }}
                priority
              />
              <div className="absolute inset-0 bg-black opacity-40"></div>
            </div>
            <div className="absolute bottom-0 left-0 p-6">
              <h1 className="text-2xl font-bold text-white">Task Details</h1>
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="bg-gray-100 p-3 rounded-full">
                {task.completed ? (
                  <CheckCircle className="h-8 w-8 text-green-600" />
                ) : (
                  <Clock className="h-8 w-8 text-amber-600" />
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-semibold text-gray-900">{task.title}</h2>
                  <button
                    onClick={copyToClipboard}
                    className="inline-flex items-center text-gray-500 hover:text-gray-700 transition"
                    title="Copy task title"
                  >
                    {copied ? (
                      <span className="text-green-600 text-sm font-medium">Copied!</span>
                    ) : (
                      <Copy className="h-5 w-5" />
                    )}
                  </button>
                </div>
                
                <div className="mt-4 space-y-3">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-500 w-24">Task ID:</span>
                    <span className="text-sm text-gray-900">{task.id}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-500 w-24">Status:</span>
                    <span className={`text-sm ${task.completed ? 'text-green-600' : 'text-amber-600'} font-medium`}>
                      {task.completed ? 'Completed' : 'Pending'}
                    </span>
                  </div>
                  
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-500 w-24">Priority:</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${priorityStyle}`}>
                      {task.priority}
                    </span>
                  </div>
                  
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-500 w-24">User ID:</span>
                    <span className="text-sm text-gray-900">{task.userId}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}