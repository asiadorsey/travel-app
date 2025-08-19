// src/components/Toast.jsx
"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import { useToast, TOAST_TYPES } from "../context/ToastContext.jsx";

const Toast = ({ toast, onRemove }) => {
  const getToastIcon = (type) => {
    switch (type) {
      case TOAST_TYPES.SUCCESS:
        return CheckCircleIcon;
      case TOAST_TYPES.ERROR:
        return XCircleIcon;
      case TOAST_TYPES.WARNING:
        return ExclamationTriangleIcon;
      case TOAST_TYPES.INFO:
        return InformationCircleIcon;
      default:
        return InformationCircleIcon;
    }
  };

  const getToastStyles = (type) => {
    switch (type) {
      case TOAST_TYPES.SUCCESS:
        return {
          icon: "text-green-600",
          bg: "bg-green-50",
          border: "border-green-200",
          text: "text-green-800"
        };
      case TOAST_TYPES.ERROR:
        return {
          icon: "text-red-600",
          bg: "bg-red-50",
          border: "border-red-200",
          text: "text-red-800"
        };
      case TOAST_TYPES.WARNING:
        return {
          icon: "text-yellow-600",
          bg: "bg-yellow-50",
          border: "border-yellow-200",
          text: "text-yellow-800"
        };
      case TOAST_TYPES.INFO:
        return {
          icon: "text-blue-600",
          bg: "bg-blue-50",
          border: "border-blue-200",
          text: "text-blue-800"
        };
      default:
        return {
          icon: "text-gray-600",
          bg: "bg-gray-50",
          border: "border-gray-200",
          text: "text-gray-800"
        };
    }
  };

  const IconComponent = getToastIcon(toast.type);
  const styles = getToastStyles(toast.type);

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.3 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.5 }}
      className={`max-w-sm w-full ${styles.bg} ${styles.border} border rounded-lg shadow-lg overflow-hidden`}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <IconComponent className={`h-6 w-6 ${styles.icon}`} />
          </div>
          <div className="ml-3 w-0 flex-1 pt-0.5">
            <p className={`text-sm font-medium ${styles.text}`}>
              {toast.message}
            </p>
          </div>
          <div className="ml-4 flex flex-shrink-0">
            <button
              onClick={() => onRemove(toast.id)}
              className={`${styles.bg} ${styles.border} rounded-md inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
            >
              <span className="sr-only">Close</span>
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-4">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            toast={toast}
            onRemove={removeToast}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;
