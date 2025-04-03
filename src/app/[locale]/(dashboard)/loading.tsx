export default function Loading() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-6 p-6 md:p-10">
      <h1 className="text-2xl font-bold animate-pulse">Loading Tasks...</h1>
      <p className="text-gray-500 animate-pulse">Loading...</p>
    </div>
  );
}
