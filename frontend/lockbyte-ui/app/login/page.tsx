import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, Mail, Lock, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-[#252d47] flex items-center justify-center px-6 py-12">
            <div className="w-full max-w-md">
                {/* Logo */}
                <Link href="/" className="flex items-center justify-center gap-2 mb-8 hover:opacity-80 transition-opacity">
                    <Shield className="w-8 h-8 text-[#9747ff]" />
                    <span className="text-[#ffffff] font-bold text-2xl">LockByte</span>
                </Link>

                {/* Login Card */}
                <div className="bg-gradient-to-br from-[#ffffff]/8 via-[#9747ff]/5 to-[#5a5bed]/8 backdrop-blur-sm rounded-2xl p-8 border border-[#ffffff]/10 shadow-[0_0_40px_rgba(151,71,255,0.15)]">
                    <div className="text-center mb-8">
                        <h1 className="text-[#ffffff] text-3xl font-bold mb-2">Welcome Back</h1>
                        <p className="text-[#ffffff]/70">Sign in to your account to continue</p>
                    </div>

                    <form className="space-y-6">
                        {/* Email Field */}
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-[#ffffff] text-sm font-medium">
                                Email Address
                            </Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9747ff]" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    className="pl-11 bg-[#ffffff]/5 border-[#ffffff]/10 text-[#ffffff] placeholder:text-[#ffffff]/40 focus:border-[#9747ff] focus:ring-[#9747ff]/20 rounded-lg h-12"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
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
                                    className="pl-11 bg-[#ffffff]/5 border-[#ffffff]/10 text-[#ffffff] placeholder:text-[#ffffff]/40 focus:border-[#9747ff] focus:ring-[#9747ff]/20 rounded-lg h-12"
                                />
                            </div>
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center">
                            <input
                                id="remember"
                                type="checkbox"
                                className="w-4 h-4 rounded border-[#ffffff]/20 bg-[#ffffff]/5 text-[#9747ff] focus:ring-[#9747ff]/20"
                            />
                            <label htmlFor="remember" className="ml-2 text-[#ffffff]/70 text-sm">
                                Remember me for 30 days
                            </label>
                        </div>

                        {/* Submit Button */}
                        <Button className="w-full bg-gradient-to-r from-[#9747ff] via-[#5a5bed] to-[#821db6] hover:from-[#821db6] hover:via-[#9747ff] hover:to-[#5a5bed] text-[#ffffff] h-12 text-base rounded-full transition-all duration-500 shadow-[0_0_30px_rgba(151,71,255,0.4)] hover:shadow-[0_0_40px_rgba(151,71,255,0.6)] hover:scale-[1.02]">
                            Sign In
                            <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-[#ffffff]/10"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-[#252d47] text-[#ffffff]/50">Or continue with</span>
                        </div>
                    </div>

                    {/* Social Login */}
                    <div className="grid grid-cols-2 gap-4">
                        <Button
                            variant="outline"
                            className="border-[#ffffff]/20 text-[#ffffff] hover:bg-[#ffffff]/10 bg-transparent rounded-lg h-12"
                        >
                            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                <path
                                    fill="currentColor"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                />
                            </svg>
                            Google
                        </Button>
                        <Button
                            variant="outline"
                            className="border-[#ffffff]/20 text-[#ffffff] hover:bg-[#ffffff]/10 bg-transparent rounded-lg h-12"
                        >
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                            </svg>
                            GitHub
                        </Button>
                    </div>

                    {/* Sign Up Link */}
                    <p className="text-center text-[#ffffff]/70 text-sm mt-8">
                        Don't have an account?{" "}
                        <Link href="/register" className="text-[#9747ff] hover:text-[#5a5bed] font-medium transition-colors">
                            Sign up for free
                        </Link>
                    </p>
                </div>

                {/* Footer */}
                <p className="text-center text-[#ffffff]/50 text-xs mt-8">
                    Protected by enterprise-grade security. Your data is encrypted and secure.
                </p>
            </div>
        </div>
    )
}
