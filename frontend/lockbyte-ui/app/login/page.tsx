'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Footer } from "@/components/footer"
export default function LoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    try {
      await login(username, password);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="bg-gradient-to-br from-[#ffffff]/8 via-[#9747ff]/5 to-[#5a5bed]/8 backdrop-blur-sm rounded-2xl p-8 border border-[#ffffff]/10 shadow-[0_0_40px_rgba(151,71,255,0.15)]">
            <div className="text-center mb-8">
              <h1 className="text-[#ffffff] text-3xl font-bold mb-2">Welcome Back</h1>
              <p className="text-[#ffffff]/70">Sign in to your account to continue</p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="username" className="text-[#ffffff] text-sm font-medium">
                  Username
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9747ff]" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="username"
                    required
                    value={username}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                    className="pl-11 bg-[#ffffff]/5 border-[#ffffff]/10 text-[#ffffff] placeholder:text-[#ffffff]/40 focus:border-[#9747ff] focus:ring-[#9747ff]/20 rounded h-12"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-[#ffffff] text-sm font-medium">
                    Password
                  </Label>
                  <Link href="#" className="text-[#9747ff] text-sm hover:text-[#5a5bed] transition-colors">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9747ff]" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    value={password}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                    className="pl-11 bg-[#ffffff]/5 border-[#ffffff]/10 text-[#ffffff] placeholder:text-[#ffffff]/40 focus:border-[#9747ff] focus:ring-[#9747ff]/20 rounded h-12"
                  />
                </div>
              </div>

              {error && <p className="text-red-500 text-sm text-center">{error}</p>}

              <Button type="submit" className="w-full bg-gradient-to-r from-[#9747ff] via-[#5a5bed] to-[#821db6] hover:from-[#821db6] hover:via-[#9747ff] hover:to-[#5a5bed] text-[#ffffff] h-12 text-base rounded-full transition-all duration-500 shadow-[0_0_30px_rgba(151,71,255,0.4)] hover:shadow-[0_0_40px_rgba(151,71,255,0.6)] hover:scale-[1.02]">
                Sign In
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </form>

            <p className="text-center text-[#ffffff]/70 text-sm mt-8">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-[#9747ff] hover:text-[#5a5bed] font-medium transition-colors">
                Sign up for free
              </Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}