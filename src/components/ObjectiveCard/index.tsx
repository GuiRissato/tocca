import ResultCard from "../ResultCard";
import AddButton from "../AddButton";

interface ObjectiveCardProps {
  objective: string;
  results: string[];
}
export default function ObjectiveCard(props: Readonly<ObjectiveCardProps>) {
  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-sm w-64">
      <h3 className="text-xl font-semibold mb-2">{props.objective}</h3>
      <p className="text-gray-500 text-sm mb-4">Description</p>
      <div>
        <h4 className="text-gray-700 font-medium mb-2">Key Results</h4>
        <div className="space-y-2">
          {props.results.map((result, index) => (
            <ResultCard key={index} result={result} />
          ))}
        </div>
        <AddButton label="Add Key Result" onClick={function (): void {
          throw new Error("Function not implemented.");
        } } />
      </div>
    </div>
  );
}