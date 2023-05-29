import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from "next/router";
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import { ShareIcon } from '@heroicons/react/24/solid'
import { add, parseISO } from 'date-fns'
import { toast } from "react-toastify";
import ReactCanvasConfetti from 'react-canvas-confetti';
import Confetti from 'react-canvas-confetti';
import ReactConfetti from 'react-confetti';
import NavbarComponent from "@/components/NavbarComponent";

const Home = () => {
    const supabase = useSupabaseClient()
    const [minutesLeft, setMinutesLeft] = useState(null)
    const [secondsLeft, setSecondsLeft] = useState(null)
    const [createdDateTime, setCreatedDateTime] = useState(null)
    const [minutes, setMinutes] = useState(null)
    const [seconds, setSeconds] = useState(null)
    const [timerName, setTimerName] = useState(null)
    const [timerDescription, setTimerDescription] = useState(null)
    const [timerCompletedAt, setTimerCompletedAt] = useState(null)
    const router = useRouter();
    const { timerSlug } = router.query;

    useEffect(() => {
        if (timerSlug) {
            getTimer();
        }
    })

    const canvasStyles = {
        position: "fixed",
        pointerEvents: "none",
        width: "100%",
        height: "100%",
        top: 0,
        left: 0,
        zIndex: 1
    };

    var myfunc;

    function shareLink() {
        navigator.clipboard.writeText(window.location.toString());
        toast('Link Copied - Let that sync in!', {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            icon: "🔗",
            theme: "dark",
        });
    }

    function updateTimer() {
        document.getElementById("timerCard").classList.remove("hidden");
        var now = new Date().getTime();
        var timeleft = timerCompletedAt - now;
        var minutes = Math.floor(timeleft / 60000);
        var seconds = ((timeleft % 60000) / 1000).toFixed(0) == 60 ? 59 : ((timeleft % 60000) / 1000).toFixed(0);

        if (timeleft < 0) {
            clearInterval(myfunc);
            setMinutesLeft(0);
            setSecondsLeft(0);
            document.getElementById("timerDone").classList.remove("hidden");
            document.title = 'Timer Done!';
            setTimeout(() => { fire() }, 1000);
            setTimeout(() => { fire() }, 2000);
            setTimeout(() => { fire() }, 3000);
        } else {
            clearInterval(myfunc);
            setMinutesLeft(minutes);
            setSecondsLeft(seconds);
            let minString = minutes > 9 ? minutes : '0' + minutes;
            let secString = seconds > 9 ? seconds : '0' + seconds;
            document.title = minString + " : " + secString;
        }
    }

    async function getTimer() {
        try {
            let { data, error, status } = await supabase
                .from('timer')
                .select()
                .eq('id', timerSlug)
                .single()

            if (error && status !== 406) {
                throw error
            }

            if (data.created_at) {
                setCreatedDateTime(data.created_at)
                setMinutes(data.minutes)
                setSeconds(0)
                setTimerName(data.name)
                setTimerDescription(data.description)

                const timerCreated = parseISO(data.created_at, [0]);
                const timerDoneAt = add(timerCreated, {
                    minutes: data.minutes,
                    seconds: 0,
                });

                setTimerCompletedAt(timerDoneAt.getTime());
            }
        } catch (error) {
            alert('Error loading timer data!')
            console.log(error)
        } finally {
            if (timerCompletedAt) {
                myfunc = setInterval(function () {
                    updateTimer();
                }, 1000);
            }
        }
    }

    const refAnimationInstance = useRef(null);

    const getInstance = useCallback((instance) => {
        refAnimationInstance.current = instance;
    }, []);

    const makeShot = useCallback((particleRatio, opts) => {
        refAnimationInstance.current &&
            refAnimationInstance.current({
                ...opts,
                origin: { y: 0.7 },
                particleCount: Math.floor(200 * particleRatio)
            });
    }, []);

    const fire = useCallback(() => {
        makeShot(0.25, {
            spread: 26,
            startVelocity: 55
        });

        makeShot(0.2, {
            spread: 60
        });

        makeShot(0.35, {
            spread: 100,
            decay: 0.91,
            scalar: 0.8
        });

        makeShot(0.1, {
            spread: 120,
            startVelocity: 25,
            decay: 0.92,
            scalar: 1.2
        });

        makeShot(0.1, {
            spread: 120,
            startVelocity: 45
        });
    }, [makeShot]);

    return (
        <>
            <ReactCanvasConfetti refConfetti={getInstance} style={canvasStyles} />
            
            <NavbarComponent title={timerName} />

            <div className="flex justify-center items-center z-10 mt-5">
                <h2 id="timerCard" className="text-3xl font-bold orby primary hidden">{minutesLeft > 9 ? minutesLeft : '0' + minutesLeft} : {secondsLeft > 9 ? secondsLeft : '0' + secondsLeft}</h2>
            </div>

            <div className="flex justify-center items-center z-10 mt-5">
                <p>{timerDescription}</p>
            </div>
            <div className="flex justify-center items-center z-10 mt-5">
                <h2 id='timerDone' className="text-3xl font-extrabold hidden dark:text-white">Timer Done!</h2>
            </div>
            <div className="flex justify-center items-center z-10 mt-5">
                <div>
                    <button
                        className="button primary block"
                        onClick={() => shareLink()}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#1C1C1C" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
                        </svg>

                    </button>
                </div>
            </div>

            <div className="flex justify-center items-center z-10 mt-10">
                <div>
                    <button
                        className="button primary block"
                        onClick={() => window.location = '/'}
                    >
                        New Timer
                    </button>
                </div>
            </div>
        </>
    )
}

export default Home