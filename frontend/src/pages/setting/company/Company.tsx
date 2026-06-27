import LazyWrapper from "@/components/LazyWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import Breadcrumb from "@/layouts/Breadcrumb";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const Company = () => {
    const [settings, setSettings] = useState({
        appName: 'Website Monitoring System',
        sessionTimeout: '30',
        theme: 'light',
        language: 'id',
        apiVersion: 'v1',
        maxWebsites: '100',
    });

    // Load settings from localStorage on mount
    useEffect(() => {
        const savedSettings = localStorage.getItem('appSettings');
        if (savedSettings) {
            const parsed = JSON.parse(savedSettings);
            setSettings(parsed);
            applyTheme(parsed.theme);
        }
    }, []);

    const applyTheme = (theme: string) => {
        const html = document.documentElement;
        if (theme === 'dark') {
            html.classList.add('dark');
        } else if (theme === 'light') {
            html.classList.remove('dark');
        } else if (theme === 'auto') {
            // Auto detect based on system preference
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                html.classList.add('dark');
            } else {
                html.classList.remove('dark');
            }
        }
    };

    const handleChange = (field: string, value: string) => {
        setSettings(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = () => {
        localStorage.setItem('appSettings', JSON.stringify(settings));
        applyTheme(settings.theme);
        toast.success("Pengaturan berhasil disimpan");
    };

    const handleReset = () => {
        const defaultSettings = {
            appName: 'Website Monitoring System',
            sessionTimeout: '30',
            theme: 'light',
            language: 'id',
            apiVersion: 'v1',
            maxWebsites: '100',
        };
        setSettings(defaultSettings);
        localStorage.setItem('appSettings', JSON.stringify(defaultSettings));
        applyTheme('light');
        toast.info("Pengaturan direset ke default");
    };

    return (
        <>
            <Breadcrumb title="Application Settings" text="Settings" />

            <LazyWrapper>
                <div>
                    <div className="card h-full rounded-lg border-0 p-6">
                        <div className="card-body p-0">
                            <form>
                                <div className="grid md:grid-cols-2 gap-x-5">
                                    <div className="mb-5">
                                        <Label htmlFor="appName" className="text-sm font-semibold mb-2 block text-neutral-900 dark:text-white">Application Name <span className="text-red-600">*</span></Label>
                                        <Input 
                                            type="text" 
                                            className="border border-neutral-300 px-5 dark:border-slate-500 focus:border-primary dark:focus:border-primary focus-visible:border-primary h-12 rounded-lg !shadow-none !ring-0" 
                                            id="appName" 
                                            name="appName" 
                                            placeholder="Enter application name"
                                            value={settings.appName}
                                            onChange={(e) => handleChange('appName', e.target.value)}
                                        />
                                    </div>
                                    <div className="mb-5">
                                        <Label htmlFor="sessionTimeout" className="text-sm font-semibold mb-2 block text-neutral-900 dark:text-white">Session Timeout (minutes) <span className="text-red-600">*</span></Label>
                                        <Input 
                                            type="number" 
                                            className="border border-neutral-300 px-5 dark:border-slate-500 focus:border-primary dark:focus:border-primary focus-visible:border-primary h-12 rounded-lg !shadow-none !ring-0" 
                                            id="sessionTimeout" 
                                            name="sessionTimeout" 
                                            placeholder="Enter session timeout"
                                            value={settings.sessionTimeout}
                                            onChange={(e) => handleChange('sessionTimeout', e.target.value)}
                                        />
                                    </div>
                                    <div className="mb-5">
                                        <Label htmlFor="theme" className="text-sm font-semibold mb-2 block text-neutral-900 dark:text-white">Theme <span className="text-red-600">*</span></Label>
                                        <Select value={settings.theme} onValueChange={(value) => handleChange('theme', value)}>
                                            <SelectTrigger id='theme' className="border border-neutral-300 px-5 dark:border-slate-500 focus:border-primary dark:focus:border-primary focus-visible:border-primary h-12 !rounded-lg !shadow-none !ring-0 !h-[48px] !w-full">
                                                <SelectValue placeholder="Select Theme" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="light">Light</SelectItem>
                                                <SelectItem value="dark">Dark</SelectItem>
                                                <SelectItem value="auto">Auto</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="mb-5">
                                        <Label htmlFor="language" className="text-sm font-semibold mb-2 block text-neutral-900 dark:text-white">Language <span className="text-red-600">*</span></Label>
                                        <Select value={settings.language} onValueChange={(value) => handleChange('language', value)}>
                                            <SelectTrigger id='language' className="border border-neutral-300 px-5 dark:border-slate-500 focus:border-primary dark:focus:border-primary focus-visible:border-primary h-12 !rounded-lg !shadow-none !ring-0 !h-[48px] !w-full">
                                                <SelectValue placeholder="Select Language" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="id">Indonesian</SelectItem>
                                                <SelectItem value="en">English</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="mb-5">
                                        <Label htmlFor="apiVersion" className="text-sm font-semibold mb-2 block text-neutral-900 dark:text-white">API Version</Label>
                                        <Input 
                                            type="text" 
                                            className="border border-neutral-300 px-5 dark:border-slate-500 focus:border-primary dark:focus:border-primary focus-visible:border-primary h-12 rounded-lg !shadow-none !ring-0" 
                                            id="apiVersion" 
                                            name="apiVersion" 
                                            placeholder="API Version"
                                            value={settings.apiVersion}
                                            onChange={(e) => handleChange('apiVersion', e.target.value)}
                                            disabled
                                        />
                                    </div>
                                    <div className="mb-5">
                                        <Label htmlFor="maxWebsites" className="text-sm font-semibold mb-2 block text-neutral-900 dark:text-white">Max Websites</Label>
                                        <Input 
                                            type="number" 
                                            className="border border-neutral-300 px-5 dark:border-slate-500 focus:border-primary dark:focus:border-primary focus-visible:border-primary h-12 rounded-lg !shadow-none !ring-0" 
                                            id="maxWebsites" 
                                            name="maxWebsites" 
                                            placeholder="Max websites"
                                            value={settings.maxWebsites}
                                            onChange={(e) => handleChange('maxWebsites', e.target.value)}
                                        />
                                    </div>
                                    <div className="col-span-2 flex items-center justify-center gap-3 mt-6">
                                        <Button 
                                            type="button" 
                                            onClick={handleReset}
                                            className="h-[48px] border border-red-600 bg-transparent hover:bg-red-600/20 dark:hover:bg-red-600/20 text-red-600 text-base px-14 py-[11px] rounded-lg"
                                        >
                                            Reset
                                        </Button>
                                        <Button 
                                            type="button"
                                            onClick={handleSave}
                                            className="h-[48px] text-base px-14 py-3 rounded-lg"
                                        >
                                            Save Changes
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </LazyWrapper>
        </>
    );
};

export default Company;