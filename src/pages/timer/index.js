import { Auth } from '@supabase/auth-ui-react'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import { useState, useEffect } from 'react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import Link from 'next/link';
import NavbarComponent from "@/components/NavbarComponent";

const Home = () => {
    const session = useSession()
    const supabase = useSupabaseClient()
    const [minutes, setMinutes] = useState(null)
    const [timerName, setTimerName] = useState(null)
    const [timerDescription, setTimerDescription] = useState(null)

    async function createTimer() {
        try {
            if (minutes, timerName) {
                document.getElementById("missingField").classList.add("hidden");
                const timer = {
                    minutes: minutes,
                    name: timerName,
                    description: timerDescription ? timerDescription : ""
                }

                let { data, error } = await supabase.from('timer').insert(timer).select().single();

                window.location = '/timer/' + data.id;
                if (error) throw error
            }
            else {
                document.getElementById("missingField").classList.remove("hidden");
            }
        } catch (error) {
            alert('Error creating timer, what have you done to my baby!')
            console.log(error)
        }
    }

    return (
        <>
            <NavbarComponent title={"TimeSync"} />

            <div className="flex justify-center items-center mt-5 px-4">
                <h2 className="text-2xl dark:text-white mx-auto">
                    Create a timer, then sync up with friends!
                </h2>
            </div>

            <div className="flex justify-center items-center mt-5">
                <div className="relative">
                    <input
                        type='text'
                        onChange={(e) => setTimerName(e.target.value)}
                        id="timerName"
                        className="px-2.5 pb-2.5 pt-4 w-80 text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-orange focus:outline-none focus:ring-0 focus:border-orange peer"
                        placeholder=" "
                    />
                    <label htmlFor="timerName" className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-3 z-10 origin-[0]  px-2 peer-focus:px-2 peer-focus:text-orange peer-focus:dark:text-orange peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-3 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">Name</label>
                </div>
            </div>
            <div className="flex justify-center items-center mt-5">
                <div className="relative">
                    <input
                        type='number'
                        onChange={(e) => (e.target.value > 0 && e.target.value < 100) ? setMinutes(e.target.value) : e.target.value = ''}
                        id="minutes"
                        className="px-2.5 pb-2.5 pt-4 w-50 text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-orange focus:outline-none focus:ring-0 focus:border-orange peer"
                        placeholder=" "
                    />
                    <label htmlFor="timerMinutes" className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-3 z-10 origin-[0]  px-2 peer-focus:px-2 peer-focus:text-orange peer-focus:dark:text-orange peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-3 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">Minutes</label>
                </div>
            </div>
            <div className="flex justify-center items-center mt-5">
                <div className="relative">
                    <textarea
                        onChange={(e) => setTimerDescription(e.target.value)}
                        id="timerDescription"
                        rows={2}
                        className="px-2.5 pb-2.5 pt-4 w-80 text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-orange focus:outline-none focus:ring-0 focus:border-orange peer"
                        placeholder=" "
                    />
                    <label htmlFor="timerDescription" className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0]  px-2 peer-focus:px-2 peer-focus:text-orange peer-focus:dark:text-orange peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-3 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">Details</label>
                </div>
            </div>

            <div className="flex justify-center items-center mt-5">
                <div>
                    <button
                        className="button primary block"
                        onClick={() => createTimer()}
                    >
                        Create Timer
                    </button>
                </div>
            </div>

            <div className="flex justify-center items-center mt-5">
                <div>
                    <h1 id='missingField' className='hidden'>You're missing a field, do better &#128512;</h1>
                </div>
            </div>
        </>
    )
}

export default Home