'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/store/auth';
import { useApi } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
type Project = {
  id: string;
  name: string;
};
export default function DashboardPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [newName, setNewName] = useState('');
    const api = useApi();
    const router = useRouter();
    const token = useAuth((s) => s.token);
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        setHydrated(true);
    }, []);

    useEffect(() => {
        if (hydrated && !token) {
            router.push('/login');
        }
        if (hydrated && token) {
            fetchProjects();
        }
    }, [hydrated, token]);

    if (!hydrated)
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
            </div>
        );
    const fetchProjects = async () => {
        const res = await api.get('/projects');
        setProjects(res.data);
    };

    const handleCreate = async () => {
        if (!newName.trim()) return;
        await api.post('/projects', { name: newName });
        setNewName('');
        fetchProjects();
    };

    return (
        <div className="max-w-3xl mx-auto mt-10 space-y-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>

        <div className="flex gap-2">
            <Input
            placeholder="Nama Project"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            />
            <Button onClick={handleCreate}>Tambah</Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {projects.map((project) => (
            <Card
                key={project.id}
                onClick={() => router.push(`/projects/${project.id}`)}
                className="hover:shadow-lg transition cursor-pointer"
            >
                <CardContent className="p-4">
                <h3 className="text-lg font-semibold text-blue-600">{project.name}</h3>
                <p className="text-sm text-gray-500">Klik untuk buka task</p>
                </CardContent>
            </Card>
            ))}
        </div>
        </div>
    );
}
