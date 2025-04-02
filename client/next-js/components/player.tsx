"use client";

import AudioPlayer from "react-h5-audio-player";

import "react-h5-audio-player/lib/styles.css";
import {AudioHTMLAttributes, useEffect, useRef} from "react";


export const Player = () => {
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        // Try to play after user interaction
        const handleInteraction = () => {
            audio.play().catch((err) => {
                console.log("Autoplay failed:", err);
            });
            window.removeEventListener("click", handleInteraction);
        };

        // Try autoplay (might fail) TODO return it
        audio.play().catch((e) => {
            console.log('1 ', e)
            // Wait for user interaction
            window.addEventListener("click", handleInteraction);
        });
    }, []);

    return (
        <audio ref={audioRef} controls>
            <source src="/gods.mp3" type="audio/mpeg"/>
            <track
                default
                kind="captions"
                srcLang="en"/>
            Your browser does not support the audio element.
        </audio>
    )
}