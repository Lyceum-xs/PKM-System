import React from 'react';

const shimmer = 'relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.6s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent';

const BookCardSkeleton: React.FC<{ view?: 'grid' | 'list' }>= ({ view = 'grid' }) => {
  if (view === 'list') {
    return (
      <div className={`card-premium flex items-start space-x-4 h-36 ${shimmer}`}>
        <div className="w-20 h-28 bg-secondary-200 rounded-lg" />
        <div className="flex-1 space-y-3 py-1">
          <div className="h-5 bg-secondary-200 rounded w-2/3" />
          <div className="h-4 bg-secondary-200 rounded w-1/3" />
          <div className="h-4 bg-secondary-200 rounded w-5/6" />
          <div className="flex space-x-2 pt-1">
            <div className="h-5 w-16 bg-secondary-200 rounded-full" />
            <div className="h-5 w-20 bg-secondary-200 rounded-full" />
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className={`card-premium h-64 flex flex-col ${shimmer}`}>
      <div className="h-40 bg-secondary-200 rounded-lg mb-4" />
      <div className="h-5 bg-secondary-200 rounded w-3/4 mb-2" />
      <div className="h-4 bg-secondary-200 rounded w-1/2 mb-3" />
      <div className="flex space-x-2 mt-auto">
        <div className="h-6 w-16 bg-secondary-200 rounded-full" />
        <div className="h-6 w-20 bg-secondary-200 rounded-full" />
      </div>
    </div>
  );
};

export default BookCardSkeleton;
