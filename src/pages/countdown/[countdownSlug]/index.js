import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from "next/router";
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { parseISO, set, addMinutes, intervalToDuration } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { toast } from "react-toastify";
import ReactCanvasConfetti from 'react-canvas-confetti';
import NavbarComponent from "@/components/NavbarComponent";

const Countdown = () => {
    const supabase = useSupabaseClient();
    const [countdownName, setCountdownName] = useState('');
    const [countdownDescription, setCountdownDescription] = useState('');
    const [countdownCompletedAt, setCountdownCompletedAt] = useState(null);
    const [countdownExpired, setCountdownExpired] = useState(false);
    const [countdownInterval, setCountdownInterval] = useState(null);
    const [monthsLeft, setMonthsLeft] = useState(0);
    const [daysLeft, setDaysLeft] = useState(0);
    const [hoursLeft, setHoursLeft] = useState(0);
    const [minutesLeft, setMinutesLeft] = useState(0);
    const [secondsLeft, setSecondsLeft] = useState(0);
    const router = useRouter();
    const { countdownSlug } = router.query;

    useEffect(() => {
        if (countdownSlug) {
            getCountdown();
        }
    }, [countdownSlug]);

    const canvasStyles = {
        position: 'fixed',
        pointerEvents: 'none',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
        zIndex: 1,
    };

    function shareLink() {
        navigator.clipboard.writeText(window.location.toString());
        toast('Link Copied - Let that sync in!', {
            position: 'top-right',
            autoClose: 1000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            icon: '🔗',
            theme: 'dark',
        });
    }

    useEffect(() => {
        if (countdownExpired) {
            // Countdown has expired, handle it
            // e.g., show confetti, display message, etc.
            setTimeout(fire, 1000);
            setTimeout(fire, 2000);
            setTimeout(fire, 3000);
        }
    }, [countdownExpired]);

    async function getCountdown() {
        try {
            const { data, error, status } = await supabase
                .from('countdown')
                .select()
                .eq('id', countdownSlug)
                .single();

            if (error && status !== 406) {
                throw error;
            }

            if (data.created_at) {
                setCountdownName(data.name);
                setCountdownDescription(data.description);

                const completedAtUTC = parseISO(data.complete_date);

                // Get user's timezone offset in minutes
                const timezoneOffsetMinutes = new Date().getTimezoneOffset();

                // Adjust the completedAt time by the timezone offset
                const completedAtAdjusted = addMinutes(completedAtUTC, timezoneOffsetMinutes);

                // Convert the adjusted completedAt time to the user's local timezone
                const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
                const countdownCompletedAtLocal = utcToZonedTime(completedAtAdjusted, userTimezone);

                setCountdownCompletedAt(countdownCompletedAtLocal);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (countdownCompletedAt) {
            const now = new Date();
            const timeLeft = countdownCompletedAt - now;

            if (timeLeft <= 0) {
                setCountdownExpired(true);
                return;
            }

            const interval = setInterval(() => {
                const currentTime = new Date();
                const remainingTime = countdownCompletedAt - currentTime;

                if (remainingTime <= 0) {
                    setCountdownExpired(true);
                    clearInterval(interval);
                } else {
                    const duration = intervalToDuration({ start: currentTime, end: countdownCompletedAt });
                    setMonthsLeft(duration.months);
                    setDaysLeft(duration.days);
                    setHoursLeft(duration.hours);
                    setMinutesLeft(duration.minutes);
                    setSecondsLeft(duration.seconds);

                    const secondsContainer = document.getElementById('secondsContainer');
                    secondsContainer.classList.remove('hidden');
                }
            }, 1000);

            setCountdownInterval(interval);
        }

        return () => {
            clearInterval(countdownInterval);
        };
    }, [countdownCompletedAt]);

    const confettiRef = useRef(null);

    const getInstance = (instance) => {
        confettiRef.current = instance;
    };

    const fire = () => {
        confettiRef.current &&
            confettiRef.current({
                particleCount: 100,
                spread: 70,
                startVelocity: 40,
                decay: 0.9,
            });
    };

    return (
        <>
            <ReactCanvasConfetti refConfetti={getInstance} style={canvasStyles} />

            <NavbarComponent title={countdownName} />

            <div id="countdownCard" className="flex justify-center items-center z-10 mt-5">
                <div className="text-3xl font-bold orby primary">
                    <div className="flex flex-wrap justify-center">
                        <div className="countdown-item">
                            {monthsLeft > 0 && (
                                <>
                                    <span className="mr-1">{monthsLeft > 9 ? monthsLeft : `0${monthsLeft}`}</span>
                                    <span className="text-sm mr-1">months</span>
                                </>
                            )}
                        </div>
                        <div className="countdown-item">
                            {daysLeft > 0 && (
                                <>
                                    <span className="mr-1">{daysLeft > 9 ? daysLeft : `0${daysLeft}`}</span>
                                    <span className="text-sm mr-1">days</span>
                                </>
                            )}
                        </div>
                        <div className="countdown-item">
                            {hoursLeft > 0 && (
                                <>
                                    <span className="mr-1">{hoursLeft > 9 ? hoursLeft : `0${hoursLeft}`}</span>
                                    <span className="text-sm mr-1">hours</span>
                                </>
                            )}
                        </div>
                        <div className="countdown-item">
                            {minutesLeft > 0 && (
                                <>
                                    <span className="mr-1">{minutesLeft > 9 ? minutesLeft : `0${minutesLeft}`}</span>
                                    <span className="text-sm mr-1">minutes</span>
                                </>
                            )}
                        </div>
                        <div id="secondsContainer" className="countdown-item hidden">
                            {secondsLeft >= 0 && (
                                <>
                                    <span className="mr-1">{secondsLeft > 9 ? secondsLeft : `0${secondsLeft}`}</span>
                                    <span className="text-sm mr-1">seconds</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>


            <div className="flex justify-center items-center z-10 mt-5">
                <p>{countdownDescription}</p>
            </div>

            {countdownExpired && (
                <div className="flex justify-center items-center z-10 mt-5">
                    <h2 id="countdownDone" className="text-3xl font-extrabold hidden dark:text-white">
                        Countdown Done!
                    </h2>
                </div>
            )}

            <div className="flex justify-center items-center z-10 mt-5">
                <div>
                    <button className="button primary block" onClick={shareLink}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="#1C1C1C"
                            className="w-6 h-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75"
                            />
                        </svg>
                    </button>
                </div>
            </div>

            <div className="flex justify-center items-center z-10 mt-10">
                <div>
                    <button className="button primary block" onClick={() => (window.location = '/')}>
                        New Countdown
                    </button>
                </div>
            </div>
        </>
    );
};

export async function getServerSideProps(context) {
    const { query } = context;
    const { countdownSlug } = query;

    return {
        props: {
            countdownSlug,
        },
    };
}

export default Countdown;