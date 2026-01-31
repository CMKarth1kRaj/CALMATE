
import React from 'react';

type IconProps = {
    className?: string;
};

export const HomeIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
);

export const LogIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
);

export const CameraIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

export const PlannerIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
);

export const ProfileIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

export const ArrowRightIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
);

export const StreakIcon: React.FC<IconProps> = ({ className }) => (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
        <path d="M17.66 11.5c-.21 0-.41-.01-.61-.03l.31 1.76c.03.18-.04.35-.19.46-.11.08-.24.12-.37.12-.1 0-.21-.03-.3-.08a.498.498 0 01-.19-.51l-.31-1.78c-.7.21-1.42.34-2.14.34-2.76 0-5-2.24-5-5 0-1.12.37-2.16 1-3.01.07-.1.17-.18.28-.22.11-.05.23-.05.34-.01.11.04.2.13.25.24s.05.24.01.35c-.17.41-.26.86-.26 1.32 0 1.93 1.57 3.5 3.5 3.5.34 0 .68-.05 1-.15l-.27-1.54a.498.498 0 01.3-.56c.14-.05.3-.02.42.07.12.09.18.25.15.4l.27 1.54c.2-.04.41-.06.61-.06 1.1 0 2 .9 2 2s-.9 2-2 2zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8 0-.29.02-.58.05-.86l1.37.79c.14.08.31.08.45 0l4.33-2.5c.14-.08.22-.22.22-.37V4.05c0-.15-.08-.29-.22-.37s-.31-.08-.45 0l-4.33 2.5a.51.51 0 00-.22.37V8.5s0-.01.01-.01c.01-.14.07-.27.18-.35.1-.08.24-.12.37-.12.1 0 .19.03.28.08.13.08.21.22.21.37v2.32c0 .15-.08.29-.21.37s-1.07.62-1.07.62c0-.1.02-.19.05-.29.08-.28.24-.54.46-.74s.5-.33.82-.4c.32-.07.66-.05.98.05.31.1.58.3.79.56.2.26.33.56.36.88.03.32-.05.63-.22.9-.17.27-.41.47-.71.59-.3.12-.62.14-.94.07l-.31-1.76c-.03-.18.04-.35.19-.46.11-.08.24-.12.37-.12.1 0 .21.03.3.08l.19.51c.02.13-.01.27-.1.37-.09.1-.21.14-.34.13z" />
    </svg>
);

export const ProteinIcon: React.FC<IconProps> = ({ className }) => (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
        <path d="M7 2v11h3v9l7-12h-4l4-8z" />
    </svg>
);

export const CarbsIcon: React.FC<IconProps> = ({ className }) => (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
        <path d="M17 8C17 10.76 14.76 13 12 13C9.24 13 7 10.76 7 8C7 5.24 9.24 3 12 3C14.76 3 17 5.24 17 8ZM12 15C16.42 15 20 18.58 20 23H4C4 18.58 7.58 15 12 15Z" />
    </svg>
);

export const FatsIcon: React.FC<IconProps> = ({ className }) => (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
        <path d="M12 21.5C12 21.5 19 16.5 19 11.5C19 7.63 15.87 4.5 12 4.5C8.13 4.5 5 7.63 5 11.5C5 16.5 12 21.5 12 21.5ZM12 2C17.25 2 21.5 6.25 21.5 11.5C21.5 17.5 12 23 12 23C12 23 2.5 17.5 2.5 11.5C2.5 6.25 6.75 2 12 2Z" />
    </svg>
);
