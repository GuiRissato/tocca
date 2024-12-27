interface AddButtonProps {
    label: string;
    onClick: () => void;
  }
export default function AddButton(props: Readonly<AddButtonProps>) {
    const { label, onClick } = props;
    return (
      <button
        className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
        onClick={onClick}
      >
        {label}
      </button>
    );
  }