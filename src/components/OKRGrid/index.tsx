import { useState } from "react";
import OKRCard from "../OKRCard";
import ProjectOKRCreateModal from "../Modal/OkrProject/create"; // Ajuste o caminho se necessário
import toccaAPI from "../../../api";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { fetchOkrs } from "@/pages/okr";

  interface OKRGridProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    okrs: any[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setOkrs: React.Dispatch<React.SetStateAction<any[]>>; 
  }


export default function OKRGrid({ okrs, setOkrs }: Readonly<OKRGridProps>) {
  const [openModal, setOpenModal] = useState(false);
  const user = useSelector((state: RootState) => state.user);

  const handleCreateOKR = async (name: string, description: string) => {
    try {
      const response = await fetch("/api/okr/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ company_id: user.companyId, project_name: name, description }),
      });

      const data = await response.json();

      fetchOkrs(user, setOkrs);
    } catch (error) {
      console.error("Erro ao criar OKR Project:", error);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {okrs.map((okr: { name: string; description: string }, index: number) => (
          <OKRCard key={index} data={okr} />
        ))}

        {okrs.length < 4 && (
          <div
            onClick={() => setOpenModal(true)}
            className="w-[466px] h-[76px] bg-[#E4E3E3] rounded-[50px] shadow-md
                       flex items-center justify-center cursor-pointer
                       transition duration-200 ease-in-out ml-[20%] mt-[10%]"
          >
            <span className="text-2xl font-bold text-gray-700 mr-2">+</span>
            <span className="text-gray-700 font-medium text-xl">
              Criar um novo Projeto OKR
            </span>
          </div>
        )}
      </div>

      <ProjectOKRCreateModal
        open={openModal}
        onClose={(value: boolean) => setOpenModal(value)}
        addProjectOkr={(title: string, desc: string) => handleCreateOKR(title, desc)}
      />
    </>
  );
}