import { Auth } from '@supabase/auth-ui-react'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import { useState, useEffect } from 'react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import Link from 'next/link';
import { addMinutes, format } from 'date-fns';
import NavbarComponent from "@/components/NavbarComponent";

const Home = () => {
    const session = useSession()
    const supabase = useSupabaseClient()
    const [countdownName, setCountdownName] = useState(null)
    const [countdownDescription, setCountdownDescription] = useState(null)
    const [timestampValue, setTimestampValue] = useState('');

    useEffect(() => {
        const currentDate = new Date();
        const futureDate = addMinutes(currentDate, 30);
        const formattedDate = format(futureDate, 'yyyy-MM-dd HH:mm');
        setTimestampValue(formattedDate);
    }, []);

    const handleInputChange = (e) => {
        setTimestampValue(e.target.value);
    };

    async function createCountdown() {
        try {
            if (timestampValue, countdownName) {
                document.getElementById("missingField").classList.add("hidden");
                const countdown = {
                    name: countdownName,
                    description: countdownDescription ? countdownDescription : "",
                    complete_date: timestampValue
                }

                let { data, error } = await supabase.from('countdown').insert(countdown).select().single();

                window.location = '/countdown/' + data.id;
                if (error) throw error
            }
            else {
                document.getElementById("missingField").classList.remove("hidden");
            }
        } catch (error) {
            alert('Error creating a countdown, what have you done to my baby!')
            console.log(error)
        }
    }

    return (
        <>
            <NavbarComponent title={"TimeSync"} />

            {!session ? (
                <>
                    <div className="flex justify-center items-center mt-5 px-4">
                        <h2 className="text-2xl dark:text-white mx-auto">
                            Sign in for me pal, then we'll get started.
                        </h2>
                    </div>
                </>
            ) : (
                <>
                    <div className="flex justify-center items-center mt-5 px-4">
                        <h2 className="text-2xl dark:text-white mx-auto">
                            Create a countdown, then share the excitement!
                        </h2>
                    </div>

                    <div className="flex justify-center items-center mt-5">
                        <div className="relative">
                            <input
                                type='text'
                                onChange={(e) => setCountdownName(e.target.value)}
                                id="countdownName"
                                className="px-2.5 pb-2.5 pt-4 w-80 text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-orange focus:outline-none focus:ring-0 focus:border-orange peer"
                                placeholder=" "
                            />
                            <label htmlFor="countdownName" className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-3 z-10 origin-[0]  px-2 peer-focus:px-2 peer-focus:text-orange peer-focus:dark:text-orange peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-3 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">Name</label>
                        </div>
                    </div>

                    <div className="flex justify-center items-center mt-5">
                        <div className="relative">
                            <textarea
                                onChange={(e) => setCountdownDescription(e.target.value)}
                                id="countdownDescription"
                                rows={2}
                                className="px-2.5 pb-2.5 pt-4 w-80 text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-orange focus:outline-none focus:ring-0 focus:border-orange peer"
                                placeholder=" "
                            />
                            <label htmlFor="countdownDescription" className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0]  px-2 peer-focus:px-2 peer-focus:text-orange peer-focus:dark:text-orange peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-3 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">Details</label>
                        </div>
                    </div>

                    <div className="flex justify-center items-center mt-5">
                        <div className="relative">
                            <input
                                type="datetime-local"
                                value={timestampValue}
                                onChange={handleInputChange}
                                className="px-2.5 pb-2.5 pt-4 w-80 text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-orange focus:outline-none focus:ring-0 focus:border-orange peer"
                                placeholder=" "
                            />
                            <label htmlFor="completeDate" className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-3 z-10 origin-[0]  px-2 peer-focus:px-2 peer-focus:text-orange peer-focus:dark:text-orange peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-3 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">Countdown Date & Time</label>
                        </div>
                    </div>


                    <div className="flex justify-center items-center mt-5">
                        <div>
                            <button
                                className="button primary block"
                                onClick={() => createCountdown()}
                            >
                                Create Countdown
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-center items-center mt-5">
                        <div>
                            <h1 id='missingField' className='hidden'>You're missing a field, do better &#128512;</h1>
                        </div>
                    </div>
                </>
            )}
        </>
    )
}

export default Home