import DefaultUploadedImage from "@/assets/images/user-grid/user-grid-img13.png";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera } from "lucide-react";
import React, { useRef, useState, useEffect } from "react";
import { toast } from "sonner";

const AvatarUpload = () => {
    const [imagePreview, setImagePreview] = useState<string>(DefaultUploadedImage);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Load saved photo from localStorage on mount
    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            try {
                const user = JSON.parse(userData);
                if (user.photo) {
                    setImagePreview(user.photo);
                }
            } catch (error) {
                console.error('Error loading user photo:', error);
            }
        }
    }, []);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Check file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error('File size must be less than 5MB');
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setImagePreview(base64String);
                
                // Save to localStorage
                const userData = localStorage.getItem('user');
                if (userData) {
                    try {
                        const user = JSON.parse(userData);
                        user.photo = base64String;
                        localStorage.setItem('user', JSON.stringify(user));
                        toast.success('Photo updated successfully!');
                    } catch (error) {
                        console.error('Error saving photo:', error);
                        toast.error('Failed to save photo');
                    }
                }
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="avatar-upload relative inline-block">
            <div className="avatar-edit absolute bottom-0 end-0 me-6 mt-4 z-[1] cursor-pointer">
                <Input
                    type="file"
                    id="imageUpload"
                    accept=".png, .jpg, .jpeg"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    hidden
                />
                <Label
                    htmlFor="imageUpload"
                    className="w-8 h-8 flex justify-center items-center bg-blue-100 dark:bg-primary/25 text-primary dark:text-blue-400 border border-primary hover:bg-blue-100 text-lg rounded-full cursor-pointer"
                >
                    <Camera className="w-4 h-4" />
                </Label>
            </div>

            <div className="avatar-preview relative h-[150px] w-[150px] rounded-full border border-[#487FFF] shadow-md">
                <div
                    id="imagePreview"
                    className="h-full w-full rounded-full bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: `url(${imagePreview})`,
                    }}
                />
            </div>
        </div>
    );
};

export default AvatarUpload;
