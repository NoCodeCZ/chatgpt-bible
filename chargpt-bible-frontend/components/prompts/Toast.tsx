'use client';

interface ToastProps {
  message: string;
}

export default function Toast({ message }: ToastProps) {
  return (
    <div className="fixed bottom-8 right-8 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in z-50">
      <p className="font-medium">{message}</p>
    </div>
  );
}
