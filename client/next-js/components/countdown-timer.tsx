import React, { useState, useEffect } from 'react';

interface ICountdownTimer {
    date: number;
}

export const CountdownTimer = ({ date }: ICountdownTimer) => {
    const targetDate = new Date(date); // 15 октября 2024

    const calculateTimeLeft = () => {
        const now = new Date();
        const difference: number = targetDate.getTime() - now.getTime();

        if (difference <= 0) {
            return {
                days: 0,
                hours: 0,
                minutes: 0,
                seconds: 0,
            };
        }

        return {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / (1000 * 60)) % 60),
            seconds: Math.floor((difference / 1000) % 60),
        };
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer); // очистка интервала при размонтировании
    }, []);

    return (
        <div style={{ fontFamily: 'sans-serif', textAlign: 'center' }}>
            <span>{targetDate.toLocaleString()}</span>
            <br />
            <span>
                Left: {timeLeft.days}d : {timeLeft.hours}h : {timeLeft.minutes}m : {timeLeft.seconds}s
            </span>
        </div>
    );
};
