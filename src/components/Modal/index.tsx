import React, { ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode; 
  size?: 'small' | 'medium' | 'large';
}

export default function Modal({ isOpen, onClose, title, children, footer, size = 'medium' }: Readonly<ModalProps>){
  if (!isOpen) return null;

  const sizeClasses = {
    small: 'max-w-sm',
    medium: 'max-w-md',
    large: 'max-w-lg',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className={`w-full p-6 bg-[#E4E3E3] rounded-2xl shadow-xl ${sizeClasses[size]} relative`}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-black hover:text-gray-700 focus:outline-none"
        >
          <X size={20} />
        </button>
        <h2 className="flex width-full mb-4 text-2xl font-semibold text-[#3D3D3D] align-middle justify-center">{title}</h2>
        <div className="mb-4">{children}</div>
        {footer && <div className=" flex mt-4 width-full justify-end">{footer}</div>}
      </div>
    </div>
  );
};
