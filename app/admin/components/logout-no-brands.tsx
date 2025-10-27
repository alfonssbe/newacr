"use client";

import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

const LogoutButtonNoBrands = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await axios.patch(`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}${process.env.NEXT_PUBLIC_ADMIN_USER_LOGOUT}`);
      router.push(`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/sign-in`);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <Button onClick={handleLogout}>
      Logout
    </Button>
  );
};

export default LogoutButtonNoBrands;