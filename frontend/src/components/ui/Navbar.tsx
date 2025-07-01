'use client';

import { useAuth } from '@/store/auth';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

type JwtPayload = {
  email: string;
};

export default function Navbar() {
  const { token, logout } = useAuth();
  const router = useRouter();

  if (!token) return null;

  let email: string = '';
  let initial = '?';

  try {
    const decoded = jwtDecode<JwtPayload>(token);
    email = decoded.email;
    initial = email.charAt(0).toUpperCase();
  } catch (err) {
    console.error('Token invalid');
  }

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <nav className="w-full px-4 py-3 bg-white flex items-center justify-between mb-4">
      <h1
        className="text-lg font-semibold text-black-600 cursor-pointer"
        onClick={() => router.push('/dashboard')}
      >
        Project Manager Seller Pintar
      </h1>

      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar>
              <AvatarFallback>{initial}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => router.push('/profile')}>
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
