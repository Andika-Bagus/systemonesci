import { Camera } from 'lucide-react';
import { useUser } from '@/context/UserContext';

const ViewProfileSidebar = () => {
  const { user, updateUser } = useUser();

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const avatar = event.target?.result as string;
        updateUser({ avatar });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="border border-slate-200 dark:border-slate-600 rounded-2xl overflow-hidden bg-white dark:bg-[#273142] p-6">
      <div className="text-center border-b border-slate-200 dark:border-slate-600 pb-6 mb-6">
        <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mx-auto mb-4 shadow-lg group cursor-pointer">
          {user?.avatar ? (
            <img src={user.avatar} alt="avatar" className="w-full h-full rounded-full object-cover" />
          ) : (
            <span className="text-white text-3xl font-bold">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </span>
          )}
          <label className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
            <Camera className="w-6 h-6 text-white" />
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </label>
        </div>
        <h6 className="mb-2 text-lg font-semibold">{user?.name || 'User Name'}</h6>
        <span className="text-neutral-500 dark:text-neutral-300 text-sm">{user?.email || 'email@example.com'}</span>
      </div>
      <div>
        <h6 className="text-base font-semibold mb-4">Info</h6>
        <ul className="space-y-3">
          <li className="flex justify-between">
            <span className="text-neutral-600 dark:text-neutral-200 font-medium">Name</span>
            <span className="text-neutral-500 dark:text-neutral-300">{user?.name || '-'}</span>
          </li>
          <li className="flex justify-between">
            <span className="text-neutral-600 dark:text-neutral-200 font-medium">Email</span>
            <span className="text-neutral-500 dark:text-neutral-300 text-sm">{user?.email || '-'}</span>
          </li>
          <li className="flex justify-between">
            <span className="text-neutral-600 dark:text-neutral-200 font-medium">Role</span>
            <span className="text-neutral-500 dark:text-neutral-300 capitalize">{user?.role || '-'}</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ViewProfileSidebar;
