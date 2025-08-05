// src/components/SignInForm.tsx
"use client";

import React, { useState } from 'react';
import { useFirebase } from '@/components/ClientProviders'; // Import the useFirebase hook

interface SignInFormProps {
    onSuccess: () => void; // Callback for successful sign-in
    onSwitchToSignUp: () => void; // Callback to switch to sign-up form
}

const SignInForm: React.FC<SignInFormProps> = ({ onSuccess, onSwitchToSignUp }) => {
    const { signInWithEmail, firebaseError } = useFirebase(); // Get the sign-in function and error from context
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError(null); // Clear previous errors
        setLoading(true);

        try {
            const user = await signInWithEmail(email, password);
            if (user) {
                onSuccess(); // Call success callback if user is signed in
            } else {
                // If user is null, an error was already set by useFirebase
                setError(firebaseError || "Sign in failed. Please try again.");
            }
        } catch (e: any) {
            // This catch block is mostly for unexpected errors, useFirebase handles most
            setError(e.message || "An unexpected error occurred during sign in.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto p-8 rounded-xl shadow-lg bg-white border border-talea-dun">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">Sign In</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-talea-mint focus:border-talea-mint shadow-sm"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-talea-mint focus:border-talea-mint shadow-sm"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                {(error || firebaseError) && (
                    <div className="text-red-600 text-sm text-center">
                        {error || firebaseError}
                    </div>
                )}

                <div>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white
                       ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-talea-mint hover:bg-talea-dark-green focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-talea-mint'}`}
                    >
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                </div>
            </form>

            <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                    Don't have an account?{' '}
                    <button
                        type="button"
                        onClick={onSwitchToSignUp}
                        className="font-medium text-talea-mint hover:text-talea-dark-green focus:outline-none"
                    >
                        Sign Up
                    </button>
                </p>
            </div>
        </div>
    );
};

export default SignInForm;
