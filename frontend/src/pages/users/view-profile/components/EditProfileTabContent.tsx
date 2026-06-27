import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useUser } from '@/context/UserContext';

interface ProfileData {
  name: string;
  email: string;
}

const EditProfileTabContent = () => {
  const { user, updateUser } = useUser();
  const [formData, setFormData] = useState<ProfileData>({
    name: '',
    email: '',
  });
  const [loading, setLoading] = useState(false);

  // Load user data on mount
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      updateUser(formData);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-x-6">
          <div className="col-span-12 sm:col-span-6">
            <div className="mb-5">
              <Label htmlFor="name" className="inline-block font-semibold text-neutral-600 dark:text-neutral-200 text-sm mb-2">
                Full Name <span className="text-red-600">*</span>
              </Label>
              <Input 
                name="name" 
                type="text" 
                id="name" 
                placeholder="Enter Full Name" 
                value={formData.name}
                onChange={handleChange}
                required 
              />
            </div>
          </div>
          <div className="col-span-12 sm:col-span-6">
            <div className="mb-5">
              <Label htmlFor="email" className="inline-block font-semibold text-neutral-600 dark:text-neutral-200 text-sm mb-2">
                Email <span className="text-red-600">*</span>
              </Label>
              <Input 
                name="email" 
                type="email" 
                id="email" 
                placeholder="Enter email address" 
                value={formData.email}
                onChange={handleChange}
                required 
              />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center gap-3 mt-6">
          <Button 
            type="reset" 
            variant="outline" 
            className="h-[48px] border border-red-600 bg-transparent hover:bg-red-600/20 text-red-600 text-base px-14 py-[11px] rounded-lg"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={loading}
            className="h-[48px] text-base px-14 py-3 rounded-lg"
          >
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditProfileTabContent;
