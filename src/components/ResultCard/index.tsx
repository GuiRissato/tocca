interface ResultCardProps {
    result: string;
}
export default function ResultCard(props: Readonly<ResultCardProps>) {
    return (
      <div className="bg-white p-2 rounded shadow-sm border border-gray-200">
        <p className="text-gray-700 text-sm">{props.result}</p>
      </div>
    );
  }