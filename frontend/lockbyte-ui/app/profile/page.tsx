
'use client';

import { useEffect, useState } from 'react';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { getUserProfile, updateUserProfile, changePassword } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { User, Lock, Eye, EyeOff } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

const profileSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  dateOfBirth: z.string().optional(), // 'YYYY-MM-DD' or ''
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
  currentPassword: z.string().optional(),
  newPassword: z
    .string()
    .optional()
    .transform(v => (v?.trim() === '' ? undefined : v)),
  confirmPassword: z.string().optional(),
}).superRefine((data, ctx) => {
  const { newPassword, currentPassword, confirmPassword } = data;

  if (newPassword) {
    if (!currentPassword || currentPassword.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['currentPassword'],
        message: 'Current password is required',
      });
    }
    if (newPassword.length < 8) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['newPassword'],
        message: 'New password must be at least 8 characters',
      });
    }
    if (!confirmPassword || confirmPassword.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['confirmPassword'],
        message: 'Please confirm your new password',
      });
    } else if (confirmPassword !== newPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['confirmPassword'],
        message: 'Passwords do not match',
      });
    }
  }
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const [isFetchingProfile, setIsFetchingProfile] = useState(true);
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  const [showCurrentPwd, setShowCurrentPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    getValues,
    formState: { errors, isSubmitting, dirtyFields },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: '',
      email: '',
      dateOfBirth: '',
      gender: undefined,
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    }
  });

  const newPasswordValue = useWatch({ control, name: 'newPassword' });
  const showConfirmPasswordField = !!newPasswordValue && newPasswordValue.trim() !== '';

  const isDirty = Object.keys(dirtyFields).length > 0;

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push('/login');
    }
  }, [user, isAuthLoading, router]);

  useEffect(() => {
    if (user) {
      setIsFetchingProfile(true);
      getUserProfile()
        .then(profile => {
          reset({
            ...profile,
            dateOfBirth: profile.dateOfBirth ? new Date(profile.dateOfBirth).toISOString().split('T')[0] : '',
          });
        })
        .catch(() => {
          toast({
            title: 'Error',
            description: 'Failed to fetch profile data.',
            variant: 'destructive',
          });
        })
        .finally(() => {
          setIsFetchingProfile(false);
        });
    }
  }, [user, reset]);

  const handleCancelPasswordChange = () => {
    setShowPasswordFields(false);
    const currentValues = getValues();
    reset({
        ...currentValues,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
  };

  const onSubmit = async (data: ProfileFormValues) => {
    const profilePayload: Partial<ProfileFormValues> = {};
    const passwordPayload: Partial<ProfileFormValues> = {};

    if (dirtyFields.fullName) profilePayload.fullName = data.fullName;
    if (dirtyFields.email) profilePayload.email = data.email;
    if (dirtyFields.dateOfBirth) profilePayload.dateOfBirth = data.dateOfBirth;
    if (dirtyFields.gender) profilePayload.gender = data.gender;

    const hasProfileChanges = Object.keys(profilePayload).length > 0;
    const hasPasswordChanges = !!data.newPassword && showPasswordFields;

    let profileSuccess = false;
    let passwordSuccess = false;

    if (hasProfileChanges) {
      try {
        const res = await updateUserProfile(profilePayload);
        toast({ title: 'Success', description: (res as { message?: string }).message || 'Profile updated successfully!' });
        profileSuccess = true;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to update profile.';
        toast({ title: 'Profile Update Error', description: errorMessage, variant: 'destructive' });
      }
    }

    if (hasPasswordChanges) {
      passwordPayload.currentPassword = data.currentPassword;
      passwordPayload.newPassword = data.newPassword;
      passwordPayload.confirmPassword = data.confirmPassword;
      try {
        const res = await changePassword(passwordPayload);
        toast({ title: 'Success', description: res || 'Password changed successfully!' });
        passwordSuccess = true;
        setShowPasswordFields(false);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to change password.';
        toast({ title: 'Password Change Error', description: errorMessage, variant: 'destructive' });
      }
    }

    if ((hasProfileChanges && profileSuccess) || (hasPasswordChanges && passwordSuccess)) {
        getUserProfile().then(profile => {
            reset({
                ...profile,
                dateOfBirth: profile.dateOfBirth ? new Date(profile.dateOfBirth).toISOString().split('T')[0] : '',
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            });
        });
    }
  };

  if (isAuthLoading || !user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  const renderSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-10 w-full" />
        </div>
    </div>
  );

  return (
    <div className="min-h-screen text-white">
      <Header />
      <main className="py-20 md:py-28">
        <div className="container mx-auto px-6 max-w-screen-xl">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
              Welcome, <span className="text-[#9747ff]">{user.fullName || user.username}</span>
            </h1>
            <p className="max-w-2xl text-lg md:text-xl text-white/70 mx-auto">
              Manage your personal information and secure your account.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card className="lg:col-span-2 bg-gradient-to-br from-[#ffffff]/8 via-[#9747ff]/5 to-[#5a5bed]/8 backdrop-blur-sm border border-[#ffffff]/10 rounded-xl">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <User className="w-6 h-6 text-[#9747ff]" />
                    <div>
                      <CardTitle className="text-white">Personal Information</CardTitle>
                      <CardDescription>Update your personal details.</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {isFetchingProfile ? renderSkeleton() : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="fullName" className="text-white/80">Full Name</label>
                        <Input id="fullName" {...register('fullName')} className="border-[#ffffff]/20 rounded-xl bg-[#ffffff]/5 text-white" />
                        {errors.fullName && <p className="text-red-400 text-sm mt-1">{errors.fullName.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-white/80">Email</label>
                        <Input id="email" type="email" {...register('email')} className="border-[#ffffff]/20 rounded-xl bg-[#ffffff]/5 text-white" />
                        {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="dateOfBirth" className="text-white/80">Date of Birth</label>
                        <Input id="dateOfBirth" type="date" {...register('dateOfBirth')} className="border-[#ffffff]/20 rounded-xl bg-[#ffffff]/5 text-white" />
                        {errors.dateOfBirth && <p className="text-red-400 text-sm mt-1">{errors.dateOfBirth.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="gender" className="text-white/80">Gender</label>
                        <Controller
                          name="gender"
                          control={control}
                          render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger className="border-[#ffffff]/20 rounded-xl bg-[#ffffff]/5 text-white"><SelectValue placeholder="Select gender" /></SelectTrigger>
                              <SelectContent className="bg-card/95 backdrop-blur-sm border-[#ffffff]/20 rounded-xl text-white">
                                <SelectItem value="MALE">Male</SelectItem>
                                <SelectItem value="FEMALE">Female</SelectItem>
                                <SelectItem value="OTHER">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        />
                         {errors.gender && <p className="text-red-400 text-sm mt-1">{errors.gender.message}</p>}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {!showPasswordFields ? (
                <div className="lg:col-span-1 flex flex-col justify-center items-center text-center bg-gradient-to-br from-[#ffffff]/8 via-[#9747ff]/5 to-[#5a5bed]/8 backdrop-blur-sm border border-[#ffffff]/10 rounded-xl p-8">
                    <Lock className="w-10 h-10 text-[#9747ff] mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">Account Security</h3>
                    <p className="text-white/70 mb-6">Update your password to keep your account secure.</p>
                    <Button
                        type="button"
                        onClick={() => setShowPasswordFields(true)}
                        className="w-full bg-gradient-to-r from-[#9747ff]/50 to-[#5a5bed]/50 hover:from-[#9747ff]/70 hover:to-[#5a5bed]/70 text-white border border-[#9747ff]/60 rounded-xl"
                    >
                        Change Password
                    </Button>
                </div>
              ) : (
                <Card className="lg:col-span-1 bg-gradient-to-br from-[#ffffff]/8 via-[#9747ff]/5 to-[#5a5bed]/8 backdrop-blur-sm border border-[#ffffff]/10 rounded-xl">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <Lock className="w-6 h-6 text-[#9747ff]" />
                      <div>
                        <CardTitle className="text-white">Change Password</CardTitle>
                        <CardDescription>Update your password.</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2 relative">
                      <label htmlFor="currentPassword" className="text-white/80">Current Password</label>
                      <Input id="currentPassword" type={showCurrentPwd ? 'text' : 'password'} {...register('currentPassword')} className="border-[#ffffff]/20 rounded-xl bg-[#ffffff]/5 text-white pr-10" />
                      <button type="button" onClick={() => setShowCurrentPwd(!showCurrentPwd)} className="absolute right-3 top-9 text-white/70">{showCurrentPwd ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                      {errors.currentPassword && <p className="text-red-400 text-sm mt-1">{errors.currentPassword.message}</p>}
                    </div>
                    <div className="space-y-2 relative">
                      <label htmlFor="newPassword" className="text-white/80">New Password</label>
                      <Input id="newPassword" type={showNewPwd ? 'text' : 'password'} {...register('newPassword')} className="border-[#ffffff]/20 rounded-xl bg-[#ffffff]/5 text-white pr-10" />
                      <button type="button" onClick={() => setShowNewPwd(!showNewPwd)} className="absolute right-3 top-9 text-white/70">{showNewPwd ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                      {errors.newPassword && <p className="text-red-400 text-sm mt-1">{errors.newPassword.message}</p>}
                    </div>
                    {showConfirmPasswordField && (
                      <div className="space-y-2 relative">
                        <label htmlFor="confirmPassword" className="text-white/80">Confirm New Password</label>
                        <Input id="confirmPassword" type={showConfirmPwd ? 'text' : 'password'} {...register('confirmPassword')} className="border-[#ffffff]/20 rounded-xl bg-[#ffffff]/5 text-white pr-10" />
                        <button type="button" onClick={() => setShowConfirmPwd(!showConfirmPwd)} className="absolute right-3 top-9 text-white/70">{showConfirmPwd ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                        {errors.confirmPassword && <p className="text-red-400 text-sm mt-1">{errors.confirmPassword.message}</p>}
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-end">
                      <Button type="button" variant="ghost" onClick={handleCancelPasswordChange} className="text-white/70 hover:bg-white/10">
                          Cancel
                      </Button>
                  </CardFooter>
                </Card>
              )}
            </div>

            <div className={cn(
              "mt-8 flex justify-end",
              "md:static md:mt-8 md:p-0 md:bg-transparent",
              "fixed bottom-0 left-0 right-0 p-4 bg-gray-900/80 backdrop-blur-sm border-t border-white/10 md:border-none"
            )}>
                <Button
                    type="submit"
                    disabled={isSubmitting || !isDirty}
                    className="w-full md:w-auto bg-gradient-to-r from-[#9747ff] via-[#5a5bed] to-[#821db6] hover:from-[#821db6] hover:via-[#9747ff] hover:to-[#5a5bed] text-white px-8 h-12 text-base rounded-full transition-all duration-500 shadow-[0_0_30px_rgba(151,71,255,0.4)] hover:shadow-[0_0_40px_rgba(151,71,255,0.6)] hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
