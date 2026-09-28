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
        <section className="min-h-screen flex items-center justify-center bg-gray-50 overflow-hidden">
            <div className="w-full min-h-screen flex overflow-hidden bg-white">
                {/* Left Side - Image & Branding */}
                <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden text-white">
                    <div className="absolute inset-0 z-0">
                        <img 
                            src={gedungImage} 
                            alt="Campus" 
                            className="w-full h-full object-cover brightness-[0.4]"
                        />
                        <div className="absolute inset-0 bg-green-950/60 mix-blend-multiply"></div>
                        <div className="absolute inset-0 bg-black/30"></div> {/* Extra darkening for text pop */}
                    </div>
                    
                    {/* Top Badge */}
                    <div className="relative z-10">
                        <div className="inline-flex bg-white/95 backdrop-blur-md p-2.5 rounded-xl shadow-xl">
                            <div className="w-36">
                                <ThemeLogo />
                            </div>
                        </div>
                    </div>

                    {/* Bottom Typography */}
                    <div className="relative z-10 max-w-xl mb-8">
                        <h3 className="text-green-400 font-bold tracking-widest text-xs mb-4">PORTAL MONITORING TERPADU</h3>
                        <h1 className="text-5xl font-extrabold leading-tight mb-6 text-white drop-shadow-xl">
                            Mengelola aset digital dengan aman dan terpercaya.
                        </h1>
                        <p className="text-lg text-gray-100 drop-shadow-md">
                            Satu pintu untuk monitoring server, keamanan website, dan layanan IT di SYNTAX CORPORATION INDONESIA
                        </p>
                    </div>
                </div>

                {/* Right Side - Login Form */}
                <div className="w-full lg:w-1/2 p-8 sm:p-12 lg:p-24 flex flex-col justify-center items-center bg-[#f8fafc] relative">
                    <div className="w-full max-w-md z-10">
                        {/* Logo */}
                        <div className="mb-8 flex justify-center lg:justify-start">
                            <div className="w-48">
                                <ThemeLogo />
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="flex bg-white rounded-full p-1.5 mb-6 shadow-sm border border-gray-100 w-full">
                            <button type="button" className="flex-1 py-3 text-sm font-bold rounded-full bg-[#1A971A] text-white shadow-sm transition-all">
                                Masuk
                            </button>
                            <button type="button" className="flex-1 py-3 text-sm font-semibold rounded-full text-gray-500 hover:text-gray-800 transition-all">
                                Lupa
                            </button>
                        </div>

                        {/* Form Card */}
                        <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-gray-50">
                            <div className="mb-8">
                                <h3 className="text-green-600 font-bold text-[11px] tracking-widest uppercase mb-1.5">SYSTEMONE SCI</h3>
                                <h2 className="text-3xl font-extrabold text-[#113b19] tracking-tight">Akses SystemOne</h2>
                            </div>
                            <form 
                                onSubmit={form.handleSubmit(handleLogin)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        form.handleSubmit(handleLogin)();
                                    }
                                }}
                                className="space-y-6"
                            >
                                {/* Username Field */}
                                <FieldGroup>
                                    <Controller
                                        name="email"
                                        control={form.control}
                                        render={({ field, fieldState }) => (
                                            <Field data-invalid={fieldState.invalid} className={cn('gap-2')}>
                                                <label className="text-sm font-bold text-gray-800">Email Address</label>
                                                <div className="relative group">
                                                    <Input
                                                        {...field}
                                                        type="email"
                                                        aria-invalid={fieldState.invalid}
                                                        disabled={isSubmitting}
                                                        placeholder="admin@syntax.co.id"
                                                        className="h-12 rounded-lg bg-green-50/50 border-transparent text-gray-900 font-medium placeholder:text-gray-500 placeholder:font-normal focus:border-[#1A971A] focus:ring-1 focus:ring-[#1A971A] focus:bg-white hover:bg-white transition-all duration-200"
                                                    />
                                                </div>
                                                {fieldState.invalid && (
                                                    <div className="text-red-600 text-xs mt-1 font-medium">
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
                                                <label className="text-sm font-bold text-gray-800">Password</label>
                                                <div className="relative group">
                                                    <Input
                                                        {...field}
                                                        type={showPassword ? 'text' : 'password'}
                                                        aria-invalid={fieldState.invalid}
                                                        disabled={isSubmitting}
                                                        placeholder="••••••••••••"
                                                        className="h-12 rounded-lg bg-green-50/50 border-transparent text-gray-900 font-medium placeholder:text-gray-500 focus:border-[#1A971A] focus:ring-1 focus:ring-[#1A971A] focus:bg-white hover:bg-white transition-all duration-200 pr-12 tracking-widest"
                                                    />
                                                    <Button
                                                        type="button"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 !p-0 bg-transparent hover:bg-transparent text-gray-400 hover:text-gray-600 h-[unset] transition-colors"
                                                    >
                                                        {showPassword ? (
                                                            <EyeOff className="w-5 h-5" />
                                                        ) : (
                                                            <Eye className="w-5 h-5" />
                                                        )}
                                                    </Button>
                                                </div>
                                                {fieldState.invalid && (
                                                    <div className="text-red-600 text-xs mt-1 font-medium">
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
                                    className="w-full rounded-xl h-12 text-sm font-bold mt-2 bg-[#1A971A] hover:bg-[#158515] text-white transition-all duration-200 shadow-md flex items-center justify-center gap-2"
                                    disabled={isSubmitting}
                                >
                                    {isLoading ? <Loader2 className="animate-spin h-4 w-4" /> : <Lock className="h-4 w-4" />}
                                    Sign In
                                </Button>

                            </form>
                        </div>
                    </div>
                    
                    <div className="absolute bottom-6 text-[11px] text-gray-400 font-semibold tracking-wide">
                        v1.18.2
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Login;
