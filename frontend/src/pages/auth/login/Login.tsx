import ThemeLogo from "@/components/shared/ThemeLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useIsSubmitting } from "@/context/isSubmittingContext";
import { authAPI } from "@/services/api";
import { Eye, EyeOff, Loader2, Lock, Mail } from 'lucide-react';
import { useState } from "react";

import { toast } from 'sonner';

import {
    Field,
    FieldError,
    FieldGroup
} from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import gedungImage from "@/assets/img/gedungsyntax.jpg";


const formSchema = z.object({
    email: z.string().email("Enter a valid email address."),
    password: z
        .string()
        .min(6, "Password must be at least 6 characters.")
        .max(20, "Password must be at most 20 characters."),
});


const Login = () => {

    const { isSubmitting, setIsSubmitting } = useIsSubmitting();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const handleLogin = async (data: z.infer<typeof formSchema>) => {
        setIsSubmitting(true);
        setIsLoading(true);

        try {
            const response = await authAPI.login(data.email, data.password);
            
            if (response.data.token) {
                localStorage.setItem('auth_token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                toast.success("Login successful!");
                
                // Redirect based on role
                const user = response.data.user;
                if (user.role === 'holding_user') {
                    window.location.href = "/page-speed";
                } else if (user.role === 'pagespeed') {
                    window.location.href = "/page-speed";
                } else if (user.role === 'viewer') {
                    window.location.href = "/domain";
                } else if (user.role === 'ticketing_user' || user.role === 'user_tiket') {
                    window.location.href = "/tickets";
                } else {
                    window.location.href = "/dashboard";
                }
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "Login failed";
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
            setIsLoading(false);
        }
    }

    return (
        <section className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="w-full max-w-6xl mx-auto flex shadow-2xl rounded-3xl overflow-hidden bg-white">
                {/* Left Side - Login Form */}
                <div className="w-full lg:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
                    {/* Logo */}
                    <div className="mb-8">
                        <ThemeLogo />
                    </div>

                    {/* Header */}
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
                        <p className="text-gray-600 text-sm">Please sign in to continue</p>
                    </div>

                    {/* Form */}
                    <form 
                        onSubmit={form.handleSubmit(handleLogin)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                form.handleSubmit(handleLogin)();
                            }
                        }}
                        className="space-y-5"
                    >
                        {/* Email Field */}
                        <FieldGroup>
                            <Controller
                                name="email"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid} className={cn('gap-2')}>
                                        <label className="text-sm font-medium text-gray-700">Email Address</label>
                                        <div className="icon-field relative group">
                                            <Mail className="absolute start-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#1A971A] transition-colors" />
                                            <Input
                                                {...field}
                                                type="email"
                                                aria-invalid={fieldState.invalid}
                                                disabled={isSubmitting}
                                                placeholder="andikakgo506@gmail.com"
                                                name="email"
                                                autoComplete="off"
                                                className="ps-10 pe-4 h-12 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-[#1A971A] focus:bg-white hover:bg-white transition-all duration-200"
                                            />
                                        </div>
                                        {fieldState.invalid && (
                                            <div className="bg-red-50 text-red-600 text-xs px-3 py-2 rounded-md mt-1 border border-red-200">
                                                <FieldError errors={[fieldState.error]} />
                                            </div>
                                        )}
                                    </Field>
                                )}
                            />
                        </FieldGroup>

                        {/* Password Field */}
                        <FieldGroup>
                            <Controller
                                name="password"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid} className={cn('gap-2')}>
                                        <label className="text-sm font-medium text-gray-700">Password</label>
                                        <div className="icon-field relative group">
                                            <Lock className="absolute start-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#1A971A] transition-colors" />
                                            <Input
                                                {...field}
                                                type={showPassword ? 'text' : 'password'}
                                                aria-invalid={fieldState.invalid}
                                                disabled={isSubmitting}
                                                placeholder="••••••••"
                                                name="password"
                                                autoComplete="off"
                                                className="ps-10 pe-12 h-12 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-[#1A971A] focus:bg-white hover:bg-white transition-all duration-200"
                                            />
                                            <Button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 !p-0 bg-transparent hover:bg-transparent text-gray-400 hover:text-gray-600 h-[unset] transition-colors"
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="w-4 h-4" />
                                                ) : (
                                                    <Eye className="w-4 h-4" />
                                                )}
                                            </Button>
                                        </div>
                                        {fieldState.invalid && (
                                            <div className="bg-red-50 text-red-600 text-xs px-3 py-2 rounded-md mt-1 border border-red-200">
                                                <FieldError errors={[fieldState.error]} />
                                            </div>
                                        )}
                                    </Field>
                                )}
                            />
                        </FieldGroup>

                        {/* Sign In Button */}
                        <Button
                            type="submit"
                            className="w-full rounded-lg h-12 text-base font-semibold mt-6 bg-[#1A971A] hover:bg-[#158515] text-white transition-all duration-200 shadow-sm hover:shadow-md"
                            disabled={isSubmitting}
                        >
                            {isLoading && <Loader2 className="animate-spin h-5 w-5 mr-2" />}
                            {isLoading ? "Signing in..." : "Sign In"}
                        </Button>
                    </form>

                    {/* Footer */}
                    <div className="mt-8 text-center text-sm text-gray-600">
                        <p>
                            Don't have an account?{" "}
                            <span className="text-[#1A971A] font-semibold cursor-pointer hover:text-[#158515] transition-colors hover:underline">
                                Contact administrator
                            </span>
                        </p>
                    </div>

                    {/* Copyright */}
                    <div className="mt-8 text-xs text-center text-gray-500">
                        © 2026 SYNTAX Corporation Indonesia
                    </div>
                </div>

                {/* Right Side - Image */}
                <div className="hidden lg:block lg:w-1/2 relative">
                    <img 
                        src={gedungImage} 
                        alt="SYNTAX Building" 
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-[#1A971A]/10 to-transparent"></div>
                </div>
            </div>
        </section>
    );
};

export default Login;
