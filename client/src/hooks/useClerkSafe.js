// Safe Clerk hooks that work in preview mode (without valid Clerk key)

const hasClerk = typeof window !== 'undefined' && 
    import.meta.env.VITE_CLERK_PUBLISHABLE_KEY && 
    import.meta.env.VITE_CLERK_PUBLISHABLE_KEY.startsWith('pk_') &&
    import.meta.env.VITE_CLERK_PUBLISHABLE_KEY.length > 20;

// Placeholder user for preview mode
const previewUser = {
    id: 'preview-user',
    firstName: 'Preview',
    lastName: 'User',
    fullName: 'Preview User',
    imageUrl: 'https://ui-avatars.com/api/?name=Preview+User&background=E62B6A&color=fff',
    publicMetadata: { role: 'educator' }
};

export const useUserSafe = () => {
    if (hasClerk) {
        try {
            const { useUser } = require('@clerk/clerk-react');
            return useUser();
        } catch (e) {
            // Fall through to preview mode
        }
    }
    
    // Preview mode
    return {
        user: previewUser,
        isLoaded: true,
        isSignedIn: true
    };
};

export const useClerkSafe = () => {
    if (hasClerk) {
        try {
            const { useClerk } = require('@clerk/clerk-react');
            return useClerk();
        } catch (e) {
            // Fall through to preview mode
        }
    }
    
    // Preview mode - mock Clerk methods
    return {
        signOut: () => Promise.resolve(),
        openSignIn: () => console.log('Sign in clicked (preview mode)'),
        openSignUp: () => console.log('Sign up clicked (preview mode)'),
    };
};

// Mock UserButton component for preview mode
export const UserButtonSafe = (props) => {
    if (hasClerk) {
        try {
            const { UserButton } = require('@clerk/clerk-react');
            return <UserButton {...props} />;
        } catch (e) {
            // Fall through to preview mode
        }
    }
    
    // Preview mode - show avatar
    return (
        <div className="w-8 h-8 rounded-full bg-sofluent-pink flex items-center justify-center text-white text-sm font-medium cursor-pointer">
            P
        </div>
    );
};

export default { useUserSafe, useClerkSafe, UserButtonSafe };
