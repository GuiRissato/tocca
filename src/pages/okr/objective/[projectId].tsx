import '../../../app/globals.css'
import ObjectiveCard from "../../../components/ObjectiveCard";
import AddButton from "../../../components/AddButton";

export default function OKRProject() {
  const objectives = [
    {
      objective: "Objective 1",
      results: ["Key Result 1", "Key Result 2", "Key Result 3"],
    },
    {
      objective: "Objective 2",
      results: ["Key Result 1", "Key Result 2"],
    },
    {
      objective: "Objective 3",
      results: ["Key Result 1", "Key Result 2", "Key Result 3"],
    },
    {
      objective: "Objective 4",
      results: [],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-700">2024</h1>
      </header>
      <div className="flex space-x-4 overflow-x-auto">
        {objectives.map((obj, index) => (
          <ObjectiveCard
            key={index}
            objective={obj.objective}
            results={obj.results}
          />
        ))}
        <div>
          <AddButton label="Add Objective" onClick={function (): void {
                      throw new Error("Function not implemented.");
                  } } />
        </div>
      </div>
    </div>
  );
}