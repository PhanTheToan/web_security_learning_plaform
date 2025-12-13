"use client";

import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { useEffect } from "react";

// Define the User type according to the API documentation
type User = {
  id?: number;
  username: string;
  password?: string;
  fullName: string;
  address: string;
  dateOfBirth: string;
  email: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  eStatus?: "Active" | "Inactive";
  roles?: string[];
  roleIds: number[];
};

interface UserFormProps {
  initialData?: User | null;
}

export function UserForm({ initialData }: UserFormProps) {
  const router = useRouter();
  const { register, handleSubmit, control, setValue, formState: { errors, isSubmitting } } = useForm<User>({
    defaultValues: {
      ...initialData,
      dateOfBirth: initialData?.dateOfBirth ? new Date(initialData.dateOfBirth).toISOString().split('T')[0] : '',
      roleIds: initialData?.roles?.includes("ROLE_ADMIN") ? [2] : [1],
    },
  });

  useEffect(() => {
    if (initialData?.roles) {
      setValue('roleIds', initialData.roles.includes("ROLE_ADMIN") ? [2] : [1]);
    }
  }, [initialData, setValue]);

  const onSubmit = async (data: User) => {
    const apiUrl = initialData
      ? `${process.env.NEXT_PUBLIC_API_URL}/admin/users/${initialData.id}`
      : `${process.env.NEXT_PUBLIC_API_URL}/admin/users?roleId=1`; // Default to ROLE_USER for creation
    const method = initialData ? "PUT" : "POST";

    // Ensure roleIds is an array of numbers
    const payload = {
      ...data,
      roleIds: Array.isArray(data.roleIds) ? data.roleIds : [parseInt(String(data.roleIds), 10)]
    };
    
    try {
      const res = await fetch(apiUrl, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error(`Failed to save user. Status: ${res.status}`);
      }

      router.push('/admin/users');
      router.refresh();
    } catch (error) {
      console.error("Failed to save user", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card className="bg-gradient-to-br from-[#ffffff]/8 via-[#9747ff]/5 to-[#5a5bed]/8 backdrop-blur-sm border border-[#ffffff]/10 rounded-xl">
        <CardHeader><CardTitle className="text-white">User Details</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Username */}
          <div className="space-y-2">
            <label htmlFor="username" className="text-white/80">Username</label>
            <Input id="username" {...register("username", { required: "Username is required" })} className="border-[#ffffff]/20 rounded-xl bg-[#ffffff]/5 text-white" />
            {errors.username && <p className="text-red-400 text-sm">{errors.username.message}</p>}
          </div>

          {/* Password */}
          {!initialData && (
            <div className="space-y-2">
              <label htmlFor="password"  className="text-white/80">Password</label>
              <Input id="password" type="password" {...register("password", { required: "Password is required" })} className="border-[#ffffff]/20 rounded-xl bg-[#ffffff]/5 text-white" />
              {errors.password && <p className="text-red-400 text-sm">{errors.password.message}</p>}
            </div>
          )}

          {/* Full Name */}
          <div className="space-y-2">
            <label htmlFor="fullName" className="text-white/80">Full Name</label>
            <Input id="fullName" {...register("fullName", { required: "Full name is required" })} className="border-[#ffffff]/20 rounded-xl bg-[#ffffff]/5 text-white" />
            {errors.fullName && <p className="text-red-400 text-sm">{errors.fullName.message}</p>}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label htmlFor="email" className="text-white/80">Email</label>
            <Input id="email" type="email" {...register("email", { required: "Email is required" })} className="border-[#ffffff]/20 rounded-xl bg-[#ffffff]/5 text-white" />
            {errors.email && <p className="text-red-400 text-sm">{errors.email.message}</p>}
          </div>

          {/* Address */}
          <div className="space-y-2">
            <label htmlFor="address" className="text-white/80">Address</label>
            <Input id="address" {...register("address")} className="border-[#ffffff]/20 rounded-xl bg-[#ffffff]/5 text-white" />
          </div>

          {/* Date of Birth */}
          <div className="space-y-2">
            <label htmlFor="dateOfBirth" className="text-white/80">Date of Birth</label>
            <Input id="dateOfBirth" type="date" {...register("dateOfBirth")} className="border-[#ffffff]/20 rounded-xl bg-[#ffffff]/5 text-white" />
          </div>

          {/* Gender */}
          <div className="space-y-2">
            <label htmlFor="gender" className="text-white/80">Gender</label>
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger className="border-[#ffffff]/20 rounded-xl bg-[#ffffff]/5 text-white"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-card/95 backdrop-blur-sm border-[#ffffff]/20 rounded-xl text-white">
                    <SelectItem value="MALE" className="text-white">Male</SelectItem>
                    <SelectItem value="FEMALE" className="text-white">Female</SelectItem>
                    <SelectItem value="OTHER" className="text-white">Other</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* Roles */}
          <div className="space-y-2">
            <label htmlFor="roleIds" className="text-white/80">Role</label>
            <Controller
              name="roleIds"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={(value) => field.onChange([parseInt(value, 10)])}
                  defaultValue={field.value?.[0]?.toString()}
                >
                  <SelectTrigger className="border-[#ffffff]/20 rounded-xl bg-[#ffffff]/5 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card/95 backdrop-blur-sm border-[#ffffff]/20 rounded-xl text-white">
                    <SelectItem value="1" className="text-white">User</SelectItem>
                    <SelectItem value="2" className="text-white">Admin</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* Status */}
          {initialData && (
            <div className="space-y-2">
              <label htmlFor="eStatus" className="text-white/80">Status</label>
              <Controller
                name="eStatus"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className="border-[#ffffff]/20 rounded-xl bg-[#ffffff]/5 text-white"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-card/95 backdrop-blur-sm border-[#ffffff]/20 rounded-xl text-white">
                      <SelectItem value="Active" className="text-white">Active</SelectItem>
                      <SelectItem value="Inactive" className="text-white">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          )}
        </CardContent>
        <CardFooter className="flex items-center justify-end gap-4 border-t border-[#ffffff]/20 pt-6">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-gradient-to-br from-[#9747ff]/20 to-[#5a5bed]/10 hover:from-[#9747ff]/30 hover:to-[#821db6]/20 text-white border border-[#9747ff]/40 hover:border-[#9747ff]/60 transition-all duration-300 hover:scale-105 rounded-xl"
          >
            {isSubmitting ? 'Saving...' : (initialData ? 'Update User' : 'Create User')}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
