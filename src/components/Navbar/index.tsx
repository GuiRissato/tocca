// components/Navbar.js
export default function Navbar() {
    return (
      <nav className="bg-white shadow-md py-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span className="text-yellow-500 font-bold text-lg">TOCCA</span>
            <a href="#" className="text-gray-700 hover:text-gray-900">Dashboard</a>
            <a href="#" className="text-gray-700 hover:text-gray-900">Relatórios</a>
            <a href="#" className="text-gray-700 hover:text-gray-900">OKR</a>
          </div>
          <div>
            <a href="#" className="text-gray-700 hover:text-gray-900">Ajuda</a>
          </div>
        </div>
      </nav>
    );
  }
