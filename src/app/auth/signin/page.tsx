// src/app/auth/signin/page.tsx
"use client";

import { useFirebase } from '@/components/ClientProviders';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function AuthPage() {
    const { signInWithEmail, signUpWithEmail, firebaseError } = useFirebase();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSigningUp, setIsSigningUp] = useState(false);
    const [authError, setAuthError] = useState<string | null>(null);

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setAuthError(null);
        const user = await signInWithEmail(email, password);
        if (user) {
            router.push('/'); // Redirect to homepage on success
        } else {
            setAuthError(firebaseError);
        }
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setAuthError(null);
        const user = await signUpWithEmail(email, password);
        if (user) {
            router.push('/'); // Redirect to homepage on success
        } else {
            setAuthError(firebaseError);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">
                    {isSigningUp ? 'Sign Up' : 'Sign In'}
                </h1>
                {authError && (
                    <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
                        {authError}
                    </div>
                )}
                <form onSubmit={isSigningUp ? handleSignUp : handleSignIn}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email address
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        {isSigningUp ? 'Sign Up' : 'Sign In'}
                    </button>
                </form>
                <div className="mt-6 text-center">
                    <button
                        onClick={() => setIsSigningUp(!isSigningUp)}
                        className="text-sm text-indigo-600 hover:text-indigo-500"
                    >
                        {isSigningUp
                            ? 'Already have an account? Sign In'
                            : 'Don’t have an account? Sign Up'}
                    </button>
                </div>
            </div>
        </div>
    );
}
