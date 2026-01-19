import { Plus } from 'lucide-react';

interface FloatingButtonProps {
    onClick: () => void;
    className?: string;
}

export default function FloatingButton({ onClick, className }: FloatingButtonProps) {
    return (
        <button
            onClick={onClick}
            className={`p-4 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 ${className}`}
            aria-label="Add New Task"
            type='button'
        >
            <Plus className='w-6 h-6' />
        </button>
    )
}