import '../../app/globals.css'
import Navbar from "../../components/Navbar";
import OKRGrid from "../../components/OKRGrid";

export default function OKRPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto p-6">
        <header className="mb-8">
          <select
            className="p-2 border rounded shadow-sm"
            defaultValue="2023"
          >
            <option value="2021">2021</option>
            <option value="2022">2022</option>
            <option value="2023">2023</option>
          </select>
        </header>
        <OKRGrid />
      </div>
    </div>
  );
}
