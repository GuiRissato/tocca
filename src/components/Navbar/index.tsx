
import Image from 'next/image';
import Link from 'next/link';
import logo from '../../assets/logoTocca.png'
import { DocumentIcon, HomeIcon } from '@heroicons/react/16/solid';
import { LogOut } from 'lucide-react';

export default function Navbar() {
  return (
    <nav
      className="fixed top-0 left-0 w-full h-[60px] bg-[#E7E5D9] flex items-center justify-between px-8 z-50"
    >
      <div className="flex items-center space-x-8 w-[100%]">
        <Image src={logo} alt="TOCCA" width={94} />

        <div className="flex items-center justify-around w-[100%]">
          <Link
            href="/okr"
            className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
          >
            <HomeIcon className="h-6 w-6" />
            <span>Dashboard</span>
          </Link>
          <Link
            href="/report"
            className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
          >
            <DocumentIcon className="h-6 w-6" />
            <span>Relatórios</span>
          </Link>
          {/* <Link
            href="#"
            className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
          >
            <CalendarIcon className="h-6 w-6" />
            <span>OKR</span>
          </Link> */}

          {/* <Link
          href="#"
          className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
        >
          <QuestionMarkCircleIcon className="h-6 w-6" />       
          <span>Ajuda</span>
        </Link> */}
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <Link href="/login" className="text-gray-700 hover:text-gray-900">
          <LogOut className="h-6 w-6" />
        </Link>
      </div>
    </nav>
  );
}