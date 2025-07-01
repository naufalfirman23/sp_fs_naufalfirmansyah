'use client';

import { useEffect, useState } from 'react';
import { useApi } from '@/lib/api';
import TaskChart from '@/components/ui/TaskChart';
import { useParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import  Download1  from '@/components/ui/icon';
import { saveAs } from 'file-saver';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type Task = {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'done';
};

export default function ProjectBoard() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'todo' | 'in-progress' | 'done'>('todo');
  const [tasks, setTasks] = useState<Task[]>([]);

  const { id: projectId } = useParams();
  const api = useApi();

  const statuses = ['todo', 'in-progress', 'done'] as const;

  const fetchTasks = async () => {
    const res = await api.get(`/projects/${projectId}/tasks`);
    setTasks(res.data);
  };

  const handleCreateTask = async () => {
    if (!title.trim()) return;
    await api.post(`/projects/${projectId}/tasks`, {
      title,
      description,
      status,
    });
    setTitle('');
    setDescription('');
    setStatus('todo');
    setOpen(false);
    fetchTasks();
  };

  const handleDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination || source.droppableId === destination.droppableId) return;
    const newStatus = destination.droppableId as Task['status'];
    await api.put(`/projects/${projectId}/tasks/${draggableId}`, {
      status: newStatus,
    });
    fetchTasks();
  };

  useEffect(() => {
    if (projectId) fetchTasks();

  }, [projectId]);

  const handleExport = async () => {
    const res = await api.get(`/projects/${projectId}/export`);
    const blob = new Blob([JSON.stringify(res.data, null, 2)], { type: 'application/json' });
    saveAs(blob, `project-${projectId}.json`);
  };

  const statusCount = {
    todo: tasks.filter((t) => t.status === 'todo').length,
    inProgress: tasks.filter((t) => t.status === 'in-progress').length,
    done: tasks.filter((t) => t.status === 'done').length,
  };

  return (
    <div className="space-y-4">
      <Button variant="outline" className="mb-10" onClick={() => window.history.back()}>
      &larr; Back
      </Button>
      <h1 className="text-2xl font-bold text-blue-700">Board Project</h1>
      <div className="flex items-center justify-between">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>+ Tambah Task</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Task Baru</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Judul"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <Textarea
                placeholder="Deskripsi"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <Select value={status} onValueChange={(val) => setStatus(val as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">Todo</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
              <Button className="w-full" onClick={handleCreateTask}>
                Simpan Task
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        <Button variant="outline" className='bg-green-800 text-white' onClick={handleExport}>
          <Download1 className="mr-2 " />
          Export JSON
        </Button>
      </div>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {statuses.map((status) => (
            <Droppable droppableId={status} key={status}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="space-y-3 bg-gray-50 p-2 rounded-md min-h-[200px]"
                >
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold capitalize">
                      {status.replace('-', ' ')}
                    </h2>
                    <Badge variant="outline">
                      {tasks.filter((t) => t.status === status).length}
                    </Badge>
                  </div>
                  {tasks
                    .filter((task) => task.status === status)
                    .map((task, index) => (
                      <Draggable draggableId={task.id} index={index} key={task.id}>
                        {(provided) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-white"
                          >
                            <CardContent className="p-4">
                              <h3 className="font-semibold text-sm">{task.title}</h3>
                              <p className="text-xs text-gray-500">{task.description}</p>
                            </CardContent>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
      <div className="bg-white mb-10 p-4 rounded-md shadow-sm">
        <h2 className="text-lg font-semibold mb-2">Statistik Task</h2>
        <TaskChart data={statusCount} />
      </div>
    </div>
  );
}
