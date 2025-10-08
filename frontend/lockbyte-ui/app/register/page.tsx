'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, User, ArrowRight, Calendar, Users } from "lucide-react";
import Link from "next/link";
import { SignUpData } from '@/types/auth';

export default function RegisterPage() {
  const { signup } = useAuth();
  const [formData, setFormData] = useState<SignUpData>({
    username: '',
    password: '',
    fullName: '',
    email: '',
    gender: 'MALE',
    dateOfBirth: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value as SignUpData[keyof SignUpData] }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const response = await signup(formData);
      setSuccess(response.message);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#252d47] flex flex-col">
      <Header />
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="bg-gradient-to-br from-[#ffffff]/8 via-[#9747ff]/5 to-[#5a5bed]/8 backdrop-blur-sm rounded-2xl p-8 border border-[#ffffff]/10 shadow-[0_0_40px_rgba(151,71,255,0.15)]">
            <div className="text-center mb-8">
              <h1 className="text-[#ffffff] text-3xl font-bold mb-2">Create Account</h1>
              <p className="text-[#ffffff]/70">Start protecting your business today</p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="username" className="text-[#ffffff] text-sm font-medium">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9747ff]" />
                  <Input id="username" type="text" placeholder="phantoan" required onChange={handleChange} value={formData.username} className="pl-11 bg-[#ffffff]/5 border-[#ffffff]/10 text-[#ffffff] placeholder:text-[#ffffff]/40 focus:border-[#9747ff] focus:ring-[#9747ff]/20 rounded-lg h-12" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-[#ffffff] text-sm font-medium">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9747ff]" />
                  <Input id="fullName" type="text" placeholder="Phan_Toan_admin" required onChange={handleChange} value={formData.fullName} className="pl-11 bg-[#ffffff]/5 border-[#ffffff]/10 text-[#ffffff] placeholder:text-[#ffffff]/40 focus:border-[#9747ff] focus:ring-[#9747ff]/20 rounded-lg h-12" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#ffffff] text-sm font-medium">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9747ff]" />
                  <Input id="email" type="email" placeholder="phantoan3009@gmail.com" required onChange={handleChange} value={formData.email} className="pl-11 bg-[#ffffff]/5 border-[#ffffff]/10 text-[#ffffff] placeholder:text-[#ffffff]/40 focus:border-[#9747ff] focus:ring-[#9747ff]/20 rounded-lg h-12" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-[#ffffff] text-sm font-medium">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9747ff]" />
                  <Input id="password" type="password" placeholder="••••••••" required onChange={handleChange} value={formData.password} className="pl-11 bg-[#ffffff]/5 border-[#ffffff]/10 text-[#ffffff] placeholder:text-[#ffffff]/40 focus:border-[#9747ff] focus:ring-[#9747ff]/20 rounded-lg h-12" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth" className="text-[#ffffff] text-sm font-medium">Date of Birth</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9747ff]" />
                    <Input id="dateOfBirth" type="date" required onChange={handleChange} value={formData.dateOfBirth} className="pl-11 bg-[#ffffff]/5 border-[#ffffff]/10 text-[#ffffff] placeholder:text-[#ffffff]/40 focus:border-[#9747ff] focus:ring-[#9747ff]/20 rounded-lg h-12" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender" className="text-[#ffffff] text-sm font-medium">Gender</Label>
                  <div className="relative">
                     <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9747ff]" />
                    <select id="gender" onChange={handleChange} value={formData.gender} className="w-full pl-11 bg-[#ffffff]/5 border-[#ffffff]/10 text-[#ffffff] placeholder:text-[#ffffff]/40 focus:border-[#9747ff] focus:ring-[#9747ff]/20 rounded-lg h-12 appearance-none">
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              {error && <p className="text-red-500 text-sm text-center">{error}</p>}
              {success && <p className="text-green-500 text-sm text-center">{success}</p>}

              <Button type="submit" className="w-full bg-gradient-to-r from-[#9747ff] via-[#5a5bed] to-[#821db6] hover:from-[#821db6] hover:via-[#9747ff] hover:to-[#5a5bed] text-[#ffffff] h-12 text-base rounded-full transition-all duration-500 shadow-[0_0_30px_rgba(151,71,255,0.4)] hover:shadow-[0_0_40px_rgba(151,71,255,0.6)] hover:scale-[1.02]">
                Create Account
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </form>

            <p className="text-center text-[#ffffff]/70 text-sm mt-6">
              Already have an account?{" "}
              <Link href="/login" className="text-[#9747ff] hover:text-[#5a5bed] font-medium transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}