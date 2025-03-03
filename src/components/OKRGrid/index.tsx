// components/OKRGrid.js
import { useEffect, useState } from "react";
import OKRCard from "../OKRCard";

interface OKRGridProps {
  selectedYear: number;
}

export default function OKRGrid(props: Readonly<OKRGridProps>) {
  const [okrs, setOkrs] = useState([]);
  const [user, setUser] = useState(null);


  async function fetchOkrs() {
    try {
       if (user?.company_id != null) {

        const response = await fetch(`/api/okr/2`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        setOkrs(data);
       }
    } catch (error) {
      console.error('Erro ao buscar OKRs:', error);
    }
  }

  useEffect(()=>{
      fetchOkrs()
  },[user])

  useEffect(() =>{
    console.log('okrs', okrs)
  },[okrs])

  const handleAddNewOKR = () => {
    setOkrs((prevOkrs) => [
      ...prevOkrs,
      { title: "Novo Projeto OKR", progress: 0 },
    ]);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      
      {okrs.map((okr, index) => (
        <OKRCard key={index} title={okr?.project_name } progress={okr?.progress} />
      ))}
      <>
      {
        okrs.length < 4 && (
        <div
          onClick={handleAddNewOKR}
          className="w-[466px] h-[76px] bg-[#E4E3E3] rounded-[50px] shadow-md 
                    flex items-center justify-center cursor-pointer
                    transition duration-200 ease-in-out ml-[20%] mt-[10%]"
        >
          <span className="text-2xl font-bold text-gray-700 mr-2">+</span>
          <span className="text-gray-700 font-medium text-xl">Criar um novo Projeto OKR</span>
        </div>)
      }
      
      </>
    </div>
  );
}
