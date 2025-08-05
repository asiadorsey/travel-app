// src/app/auth/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // For redirection
import MainLayout from '@/components/MainLayout';
import SignUpForm from '@/components/SignUpForm';
import LoginForm from '@/components/LoginForm'; // Assuming you renamed SignInForm to LoginForm
import { useFirebase } from '@/components/ClientProviders'; // To check auth status

const AuthPage: React.FC = () => {
    const [isSignUp, setIsSignUp] = useState(true); // State to toggle between sign-up and sign-in forms
    const router = useRouter();
    const { currentUser, isAuthReady } = useFirebase(); // Get current user and auth readiness

    // Effect to redirect if user is already logged in
    useEffect(() => {
        // Only redirect if auth is ready and a user is logged in
        if (isAuthReady && currentUser) {
            router.push('/'); // Redirect to homepage
        }
    }, [currentUser, isAuthReady, router]); // Dependencies for the effect

    // Callback function for successful authentication (signup or signin)
    const handleAuthSuccess = () => {
        router.push('/'); // Redirect to homepage after successful auth
    };

    // Show a loading state while Firebase authentication is initializing
    if (!isAuthReady) {
        return (
            <MainLayout>
                <div className="flex items-center justify-center min-h-[calc(100vh-200px)] text-talea-dark-slate-gray text-lg font-medium">
                    Loading authentication...
                </div>
            </MainLayout>
        );
    }

    // Render the authentication forms if no user is currently logged in
    // The useEffect above will prevent this from rendering if a user is authenticated
    return (
        <MainLayout>
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
                {isSignUp ? (
                    // Render SignUpForm if isSignUp is true
                    <SignUpForm onSuccess={handleAuthSuccess} onSwitchToSignIn={() => setIsSignUp(false)} />
                ) : (
                    // Render LoginForm if isSignUp is false
                    <LoginForm onSuccess={handleAuthSuccess} onSwitchToSignUp={() => setIsSignUp(true)} />
                )}
            </div>
        </MainLayout>
    );
};

export default AuthPage; // Export the AuthPage component
