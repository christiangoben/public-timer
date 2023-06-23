import { useEffect, useState } from 'react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { format, isAfter, parseISO } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import NavbarComponent from '@/components/NavbarComponent';

const CountdownHome = () => {
    const supabase = useSupabaseClient();
    const session = useSession();
    const [countdowns, setCountdowns] = useState([]);
    const [userTimeZone, setUserTimeZone] = useState('');

    useEffect(() => {
        if (session) {
            getUserCountdowns();
        }
    }, [session]);

    async function getUserCountdowns() {
        try {
            const fetchUserTimeZone = async () => {
                const { timeZone } = Intl.DateTimeFormat().resolvedOptions();
                setUserTimeZone(timeZone);
            };

            fetchUserTimeZone();

            const { data, error, status } = await supabase
                .from('countdown')
                .select()
                .eq('created_by_id', session.user.email);

            if (error && status !== 406) {
                throw error;
            }

            if (data) {
                const currentDateTime = new Date();
                const sortedCountdowns = data
                    .filter((countdown) => {
                        const completeDate = parseISO(countdown.complete_date);
                        const zonedCompleteDate = utcToZonedTime(completeDate, userTimeZone);
                        return isAfter(zonedCompleteDate, currentDateTime);
                    })
                    .sort((a, b) => {
                        const completeDateA = parseISO(a.complete_date);
                        const completeDateB = parseISO(b.complete_date);
                        const zonedCompleteDateA = utcToZonedTime(completeDateA, userTimeZone);
                        const zonedCompleteDateB = utcToZonedTime(completeDateB, userTimeZone);
                        return zonedCompleteDateA - zonedCompleteDateB;
                    });

                setCountdowns(sortedCountdowns);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <NavbarComponent title={'TimeSync'} />

            {!session ? (
                <>
                    <div className="flex justify-center items-center mt-5 px-4">
                        <h2 className="text-2xl dark:text-white mx-auto">
                            Sign in for me pal, then we'll get started.
                        </h2>
                    </div>
                </>
            ) : (
                <div className="w-96 mx-auto text-center mt-40">
                    <a href="/countdown/create" className="button primary block mb-4">
                        New Countdown
                    </a>

                    <hr className="my-4" />

                    {countdowns.map((countdown) => (
                        <a
                            key={countdown.id}
                            href={`/countdown/${countdown.id}`}
                            className="button secondary block mb-4 whitespace-nowrap overflow-hidden overflow-ellipsis"
                        >
                            {countdown.name}
                        </a>

                    ))}
                </div>
            )}
        </>
    );
};

export default CountdownHome;