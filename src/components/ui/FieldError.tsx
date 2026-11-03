interface FieldErrorProps {
  id: string;
  message?: string;
}

export default function FieldError({ id, message }: FieldErrorProps) {
  if (!message) return null;

  return (
    <p id={id} role="alert" className="animate-fade-in text-sm font-medium text-red-200">
      {message}
    </p>
  );
}
