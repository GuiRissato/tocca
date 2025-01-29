 import React from 'react';
 import Modal from '../index';
 
 
 
 interface ModalProps {
     open: boolean;
     onClose: (value: boolean) => void;
     // addKeyResult: (value: KeyResult ) => void;
 }
 export default function DelayedTaskModal (props: Readonly<ModalProps>) {
 
   const handleSave = () => {
 
     console.log('Task salvo!');
     props.onClose(false)
   };
 
   return (
     <>
       <Modal
         isOpen={props.open}
         onClose={() => props.onClose(false)}
         title="Motivo do atraso"
         footer={
           <button
             onClick={handleSave}
             className="px-10 py-2 text-black bg-[#D9D894] rounded-full hover:bg-[#D9D894AA]"
           >
             Atualizar
           </button>
         }
       >
         <form>
           <div className="mb-4">
             <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="description">
               Descrição
             </label>
             <textarea
               id="description"
               className="w-full px-4 py-2 border bg-[#D4D4D4] rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
             />
           </div>
         </form>
       </Modal>
     </>
   );
 };
 
 