import React from 'react';

export const MMUnityLogo = ({ className = "w-32 h-32" }: { className?: string }) => {
    return (
        <div className={className}>
            <svg
                viewBox="0 0 200 200"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full"
            >
                <defs>
                    <linearGradient id="mmunity_gradient" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#2DD4BF" /> {/* Teal-400 */}
                        <stop offset="50%" stopColor="#60A5FA" /> {/* Blue-400 */}
                        <stop offset="100%" stopColor="#A78BFA" /> {/* Violet-400 */}
                    </linearGradient>
                </defs>

                {/* Abstract Brain/Heart Connection Shape */}
                <path
                    d="M100 180C100 180 40 150 40 90C40 60 65 35 95 35C115 35 130 50 140 65C150 50 165 35 185 35C215 35 240 60 240 90C240 150 180 180 180 180"
                    stroke="url(#mmunity_gradient)"
                    strokeWidth="15"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    transform="translate(-40 -10) scale(0.9)"
                    fill="none"
                />
                <path
                    d="M100 60C100 60 100 120 100 120"
                    stroke="url(#mmunity_gradient)"
                    strokeWidth="15"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.5"
                />

                <circle cx="100" cy="100" r="85" stroke="url(#mmunity_gradient)" strokeWidth="8" opacity="0.2" />
            </svg>
        </div>
    );
};
