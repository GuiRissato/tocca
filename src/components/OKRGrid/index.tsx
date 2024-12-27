// components/OKRGrid.js
import OKRCard from "../OKRCard";
import AddOKRButton from "../AddOKRButton";

export default function OKRGrid() {
  const okrs = [
    { title: "OKR 1º Trimestre", progress: 72 },
    { title: "OKR 2º Trimestre", progress: 72 },
    { title: "OKR 3º Trimestre", progress: 72 },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {okrs.map((okr, index) => (
        <OKRCard key={index} title={okr.title} progress={okr.progress} />
      ))}
      <AddOKRButton />
    </div>
  );
}
