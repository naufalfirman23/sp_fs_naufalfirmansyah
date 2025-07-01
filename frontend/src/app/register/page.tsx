'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleRegister = async () => {
    try {
      await axios.post('http://localhost:3001/api/auth/register', { email, password });
      alert('Berhasil daftar. Silakan login.');
      router.push('/login');
    } catch {
      alert('Pendaftaran gagal. Email mungkin sudah digunakan.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-[360px]">
        <CardContent className="space-y-4 mt-6">
          <h2 className="text-xl font-semibold">Register</h2>
          <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Button className="w-full" onClick={handleRegister}>Daftar</Button>
          <p className="text-sm text-center">
            Sudah punya akun? <a href="/login" className="text-blue-600">Masuk</a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
