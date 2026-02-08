import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LearnSphereAI from './CuteRobotChatbot';
import AIWelcomeScreen from './RobotWelcomeScreen';

const DashboardLayout = () => {
    const { user } = useAuth();
    const [showFullWelcome, setShowFullWelcome] = useState(false);

    useEffect(() => {
        if (!user) return;

        // Use a unique key per user to store welcome status
        const sessionKey = `welcome_seen_${user.id}`;
        const hasSeen = localStorage.getItem(sessionKey);

        if (!hasSeen) {
            setShowFullWelcome(true);
        }
    }, [user]);

    const handleCompleteWelcome = () => {
        if (user) {
            localStorage.setItem(`welcome_seen_${user.id}`, 'true');
        }
        setShowFullWelcome(false);
    };

    if (showFullWelcome) {
        return <AIWelcomeScreen user={user} onComplete={handleCompleteWelcome} />;
    }

    return (
        <>
            <Outlet />
            <LearnSphereAI
                user={user}
            />
        </>
    );
};

export default DashboardLayout;
