'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { FcGoogle } from 'react-icons/fc'
import { X } from 'lucide-react'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mounted, setMounted] = useState(false)
  const [isLogin, setIsLogin] = useState(true)

  useEffect(() => {
    setMounted(true)
  }, [])
  useEffect(() => {
    if (isOpen) {
      setIsLogin(true)
    }
  }, [isOpen])

  if (!mounted || !isOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-[999] flex items-center justify-center">
      {/* Overlay */}
      <div onClick={onClose} className="absolute inset-0 bg-black/50 " />

      <div className="relative w-full max-w-md rounded-3xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] p-8 mx-4">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 dark:hover:text-white transition"
        >
          <X size={20} />
        </button>

        {/* Title */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">
            {isLogin ? 'Welcome back' : 'Create account'}
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            {isLogin ? 'Login to continue' : 'Start your journey with us'}
          </p>
        </div>

        {/* Google */}
        {isLogin && (
          <button className="w-full flex items-center justify-center gap-3 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl py-3 text-sm font-medium hover:shadow-md transition-all duration-200">
            <FcGoogle size={20} />
            Continue with Google
          </button>
        )}

        {isLogin && (
          <div className="my-6 flex items-center gap-3 text-gray-400 text-xs">
            <div className="flex-1 h-px bg-gray-200 dark:bg-zinc-700" />
            OR
            <div className="flex-1 h-px bg-gray-200 dark:bg-zinc-700" />
          </div>
        )}

        {/* Form */}
        <form className="flex flex-col gap-5">
          {!isLogin && <FloatingInput label="Full Name" type="text" />}

          <FloatingInput label="Email" type="email" />

          {!isLogin && <FloatingInput label="Phone (08xxxxxxxxxx)" type="tel" />}

          <FloatingInput label="Password" type="password" />

          <button
            type="submit"
            className="mt-2 w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-white text-sm font-medium transition-all shadow-lg shadow-purple-500/20"
          >
            {isLogin ? 'Login' : 'Create Account'}
          </button>
        </form>

        {/* Switch */}
        <p className="text-sm text-center text-gray-500 dark:text-gray-400 mt-8">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-purple-600 font-medium hover:underline"
          >
            {isLogin ? 'Sign up' : 'Login'}
          </button>
        </p>
      </div>
    </div>,
    document.body
  )
}

function FloatingInput({ label, type }: { label: string; type: string }) {
  return (
    <div className="relative">
      <input
        type={type}
        placeholder=" "
        className="peer w-full px-4 pt-5 pb-2 rounded-xl bg-gray-100 dark:bg-zinc-800 border border-transparent focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none text-sm transition-all"
      />
      <label
        className="absolute left-4 top-2 text-xs text-gray-500 dark:text-gray-400 transition-all
        peer-placeholder-shown:top-4
        peer-placeholder-shown:text-sm
        peer-placeholder-shown:text-gray-400
        peer-focus:top-2
        peer-focus:text-xs
        peer-focus:text-purple-600"
      >
        {label}
      </label>
    </div>
  )
}
