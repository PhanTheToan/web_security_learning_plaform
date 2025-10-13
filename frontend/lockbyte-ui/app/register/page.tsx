'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, User, ArrowRight, Calendar as CalendarIcon, Users, Check } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Calendar } from "@/components/ui/calendar";
import Link from "next/link";
import { SignUpData } from '@/types/auth';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

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
  const [isGenderPopoverOpen, setGenderPopoverOpen] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData((prev) => ({
        ...prev,
        dateOfBirth: format(date, 'yyyy-MM-dd'),
      }));
    }
  };

  const handleGenderChange = (gender: 'MALE' | 'FEMALE' | 'OTHER') => {
    setFormData((prev) => ({ ...prev, gender }));
    setGenderPopoverOpen(false);
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

  const genderOptions = [
    { value: 'MALE', label: 'Male' },
    { value: 'FEMALE', label: 'Female' },
    { value: 'OTHER', label: 'Other' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="bg-gradient-to-br from-[#ffffff]/8 via-[#9747ff]/5 to-[#5a5bed]/8 backdrop-blur-sm rounded-2xl p-8 border border-[#ffffff]/10 shadow-[0_0_40px_rgba(151,71,255,0.15)]">
            <div className="text-center mb-8">
              <h1 className="text-white text-3xl font-bold mb-2">Create Account</h1>
              <p className="text-white/70">Start protecting your business today</p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Username */}
              <div className="space-y-2">
                <Label htmlFor="username" className="text-white text-sm font-medium">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9747ff]" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="username"
                    required
                    onChange={handleChange}
                    value={formData.username}
                    className="pl-11 bg-[#ffffff]/5 border-[#ffffff]/10 text-white placeholder:text-white/40 focus:border-[#9747ff] focus:ring-[#9747ff]/20 h-12 rounded"
                  />
                </div>
              </div>

              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-white text-sm font-medium">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9747ff]" />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Full name"
                    required
                    onChange={handleChange}
                    value={formData.fullName}
                    className="pl-11 bg-[#ffffff]/5 border-[#ffffff]/10 text-white placeholder:text-white/40 focus:border-[#9747ff] focus:ring-[#9747ff]/20 h-12 rounded"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white text-sm font-medium">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9747ff]" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@gmail.com"
                    required
                    onChange={handleChange}
                    value={formData.email}
                    className="pl-11 bg-[#ffffff]/5 border-[#ffffff]/10 text-white placeholder:text-white/40 focus:border-[#9747ff] focus:ring-[#9747ff]/20 h-12 rounded"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white text-sm font-medium">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9747ff]" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    onChange={handleChange}
                    value={formData.password}
                    className="pl-11 bg-[#ffffff]/5 border-[#ffffff]/10 text-white placeholder:text-white/40 focus:border-[#9747ff] focus:ring-[#9747ff]/20 h-12 rounded"
                  />
                </div>
              </div>

              {/* Date + Gender */}
              <div className="grid grid-cols-2 gap-4">
                {/* Date of Birth */}
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth" className="text-white text-sm font-medium">Date of Birth</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal h-12 bg-[#ffffff]/5 border-[#ffffff]/10 hover:bg-[#ffffff]/10 text-white",
                          !formData.dateOfBirth && "text-white/40"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.dateOfBirth
                          ? format(new Date(formData.dateOfBirth), "PPP")
                          : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent sideOffset={8} className="z-50 w-auto p-0 bg-[#2c3554] border-[#ffffff]/20 text-white rounded-xl shadow-lg">
                      <Calendar
                        mode="single"
                        selected={formData.dateOfBirth ? new Date(formData.dateOfBirth) : undefined}
                        onSelect={handleDateChange}
                        captionLayout="dropdown"
                        fromYear={1900}
                        toYear={new Date().getFullYear()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Gender */}
                <div className="space-y-2">
                  <Label htmlFor="gender" className="text-white text-sm font-medium">Gender</Label>
                  <Popover open={isGenderPopoverOpen} onOpenChange={setGenderPopoverOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        role="combobox"
                        aria-expanded={isGenderPopoverOpen}
                        className="w-full justify-between h-12 bg-[#ffffff]/5 border-[#ffffff]/10 hover:bg-[#ffffff]/10 text-white"
                      >
                        {genderOptions.find((g) => g.value === formData.gender)?.label || "Select gender..."}
                        <Users className="ml-2 h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      sideOffset={6}
                      onCloseAutoFocus={(e) => e.preventDefault()}
                      className="z-50 w-[--radix-popover-trigger-width] p-0 bg-[#2c3554] border-[#ffffff]/20 text-white rounded-xl shadow-lg"
                    >
                      <Command>
                        <CommandList>
                          <CommandEmpty>No gender found.</CommandEmpty>
                          <CommandGroup>
                            {genderOptions.map((option) => (
                              <CommandItem
                                key={option.value}
                                value={option.value}
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => handleGenderChange(option.value as 'MALE' | 'FEMALE' | 'OTHER')}
                                className="hover:bg-[#9747ff]/10 rounded-lg cursor-pointer"
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    formData.gender === option.value ? "opacity-100 text-[#9747ff]" : "opacity-0"
                                  )}
                                />
                                {option.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {error && <p className="text-red-500 text-sm text-center">{error}</p>}
              {success && <p className="text-green-500 text-sm text-center">{success}</p>}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[#9747ff] via-[#5a5bed] to-[#821db6] hover:from-[#821db6] hover:via-[#9747ff] hover:to-[#5a5bed] text-white h-12 text-base rounded-full transition-all duration-500 shadow-[0_0_30px_rgba(151,71,255,0.4)] hover:shadow-[0_0_40px_rgba(151,71,255,0.6)] hover:scale-[1.02]"
              >
                Create Account
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </form>

            <p className="text-center text-white/70 text-sm mt-6">
              Already have an account?{" "}
              <Link href="/login" className="text-[#9747ff] hover:text-[#5a5bed] font-medium transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
