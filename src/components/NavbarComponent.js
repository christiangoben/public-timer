import Link from 'next/link';
import { Auth } from '@supabase/auth-ui-react'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'

const NavbarComponent = ({ title }) => {

    const session = useSession()
    const supabase = useSupabaseClient()

    return (
        <nav className="relative flex w-full flex-wrap items-center justify-between py-4">
            <div className="flex w-full flex-wrap items-center justify-between px-3">
                <div>
                    <Link href="/" legacyBehavior>
                        <a className="text-3xl font-extrabold primary ml-3">{title}</a>
                    </Link>
                </div>
                <div>
                    {!session ? (
                        <Link href="/login" legacyBehavior>
                            <a className="button primary block">
                                Log In
                            </a>
                        </Link>
                    ) : (
                        <a className="button primary block" onClick={() => supabase.auth.signOut()}>
                            Log Out
                        </a>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default NavbarComponent