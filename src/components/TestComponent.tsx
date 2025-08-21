interface TestComponentProps {
  message: string;
  count: number;
}

export default function TestComponent({ message, count }: TestComponentProps) {
  return (
    <div className="p-4 bg-blue-100 rounded-lg">
      <h2 className="text-xl font-bold">{message}</h2>
      <p className="text-gray-600">Count: {count}</p>
    </div>
  );
}
