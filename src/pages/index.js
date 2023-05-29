import { AiOutlineFieldTime, AiOutlineCalendar } from "react-icons/ai";
import NavbarComponent from "@/components/NavbarComponent";

import Link from 'next/link';

const Home = () => {

  return (
    <>

      <NavbarComponent title={"TimeSync"} />

      <div className="flex flex-col items-center justify-center h-1/4">
        <div className="flex items-center">
          <Link href="/timer" legacyBehavior>
            <a className="flex flex-col items-center mr-4">
              <AiOutlineFieldTime size={24} className="mb-2" />
              <span className="text-lg font-medium" >Timer</span>
            </a>
          </Link>
          <div className="border-l border-gray-400 h-10 mx-4" />
          <Link href="/countdown" legacyBehavior>
            <a className="flex flex-col items-center ml-4">
              <AiOutlineCalendar size={24} className="mb-2" />
              <span className="text-lg font-medium" >Countdown</span>
            </a>
          </Link>
        </div>
      </div>

      <div className="flex flex-col items-center mt-8 p-3">
        <h2 className="text-xl font-semibold mb-2">Button Functions:</h2>
        <p className="text-center mb-3">
          The <strong className="primary">Timer</strong> button allows you to set quick time intervals. (ex. how long until we meet in the parking lot for carpool, when the burgers will be off the grill )<br />
        </p>
        <p className="text-center mb-3">
          The  <strong className="primary">Countdown</strong> button allows you to count down to a specific date or event. (birthdays, due-dates, vacation countdowns, etc.)
        </p>
        <p className="text-center flex items-center">
          <span className="mr-1 text-xl">&#42;</span>
          <span className="px-1">
            To use a <strong className="primary">Countdown</strong>, you'll have to create an account so I can keep track of them for you &#129505;
          </span>          
        </p>

      </div>
    </>
  )
}

export default Home