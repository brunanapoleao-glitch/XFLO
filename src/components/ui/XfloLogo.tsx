export function XfloWordmark({ className = '' }: { className?: string }) {
  return (
    <img
      src="/xflo-logo.png"
      alt="XFLO"
      width={1072}
      height={1072}
      decoding="async"
      className={`h-11 w-auto ${className}`}
    />
  );
}
