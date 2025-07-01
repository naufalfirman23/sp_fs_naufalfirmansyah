'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useAuth } from '@/store/auth';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircleIcon } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);
  const setToken = useAuth((s) => s.setToken);
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:3001/api/auth/login', {
        email, password
      });
      setToken(res.data.token);
      router.push('/dashboard');
    } catch {
      setLoginError(true);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-[360px]">
        <CardContent className="space-y-4 mt-6">
          <h2 className="text-xl font-semibold">Login</h2>
          {loginError && (
            <Alert variant="destructive">
              <AlertCircleIcon />
              <AlertTitle>Gagal Login!</AlertTitle>
              <AlertDescription>
                <p>Periksa kembali Email dan Password anda.</p>
              </AlertDescription>
            </Alert>
          )}
          <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Button className="w-full" onClick={handleLogin}>Masuk</Button>
          <p className="text-sm text-center">
            Belum punya akun? <a href="/register" className="text-blue-600">Daftar</a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
