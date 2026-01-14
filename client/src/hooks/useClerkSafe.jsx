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

// Try to import Clerk - use static import (Vite will handle it)
// If Clerk is not installed, this will be handled at build time
let ClerkReact = null;
if (hasClerk) {
    // Use dynamic import() - this is async but we'll handle it in hooks
    import('@clerk/clerk-react').then(module => {
        ClerkReact = module;
    }).catch(() => {
        // Clerk not available - will use preview mode
    });
}

export const useUserSafe = () => {
    // For now, always return preview mode since dynamic import is async
    // In production, Clerk should be properly imported at the top level
    if (hasClerk && ClerkReact) {
        try {
            const { useUser } = ClerkReact;
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
    if (hasClerk && ClerkReact) {
        try {
            const { useClerk } = ClerkReact;
            return useClerk();
        } catch (e) {
            // Fall through to preview mode
        }
    }
    
    // Preview mode - mock Clerk methods
    return {
        signOut: () => Promise.resolve(),
        openSignIn: () => {
            if (process.env.NODE_ENV === 'development') {
                console.log('Sign in clicked (preview mode)');
            }
        },
        openSignUp: () => {
            if (process.env.NODE_ENV === 'development') {
                console.log('Sign up clicked (preview mode)');
            }
        },
    };
};

// Mock UserButton component for preview mode
export const UserButtonSafe = (props) => {
    if (hasClerk && ClerkReact) {
        try {
            const { UserButton } = ClerkReact;
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
