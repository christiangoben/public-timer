import { useState, useEffect } from 'react'
import { useRouter } from "next/router";
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import { ShareIcon } from '@heroicons/react/24/solid'
import { add, parseISO} from 'date-fns'
import { toast } from "react-toastify";

const Home = () => {
    const session = useSession()
    const supabase = useSupabaseClient()
    const [createdDateTime, setCreatedDateTime] = useState(null)
    const [minutes, setMinutes] = useState(null)
    const [seconds, setSeconds] = useState(null)
    const [minutesLeft, setMinutesLeft] = useState(null)
    const [secondsLeft, setSecondsLeft] = useState(null)
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

    var myfunc;

    function shareLink(){
        console.log('did it');
        navigator.clipboard.writeText(window.location.toString());
        toast('🔗  Link Copied', {
            position: "top-right",
            autoClose: 500,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
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
                setMinutes(data.minValue)
                setSeconds(data.secValue)
                setTimerName(data.name)
                setTimerDescription(data.description)

                const timerCreated = parseISO(data.created_at, [0]);
                const timerDoneAt = add(timerCreated, {
                    minutes: data.minValue,
                    seconds: data.secValue,
                });

                setTimerCompletedAt(timerDoneAt.getTime());
            }
        } catch (error) {
            alert('Error loading timer data!')
            console.log(error)
        } finally {
            if (timerCompletedAt) {
                var myfunc = setInterval(function () {
                    updateTimer();
                }, 1000);
            }
        }
    }

    return (
        <>
            <nav
                className="relative flex w-full flex-wrap items-center justify-between lg:py-4">
                <div className="flex w-full flex-wrap items-center justify-between px-3">
                    <div>
                        <h2 className="text-3xl font-extrabold primary">{timerName}</h2>
                    </div>
                </div>
            </nav>
            <div className="flex justify-center items-center mt-5">
                <h2 id="timerCard" className="text-3xl font-bold orby primary hidden">{minutesLeft > 9 ? minutesLeft : '0' + minutesLeft} : {secondsLeft > 9 ? secondsLeft : '0' + secondsLeft}</h2>
            </div>

            <div className="flex justify-center items-center mt-5">
                <p>{timerDescription}</p>
            </div>
            <div className="flex justify-center items-center mt-5">
                <h2 id='timerDone' className="text-3xl font-extrabold hidden dark:text-white">Timer Done!</h2>
            </div>
            <div className="flex justify-center items-center mt-5">
                <div>
                    <button
                        className="button primary block"
                        onClick={() => shareLink()}
                    >
                        <ShareIcon className="h-6 w-6" />
                    </button>
                </div>
            </div>

            <div className="flex justify-center items-center mt-10">
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