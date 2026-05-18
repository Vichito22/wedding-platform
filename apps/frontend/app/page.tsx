import HealthCheckButton from "@/app/components/HealthCheckButton";

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white dark:bg-black">
      <div className="flex flex-col items-center gap-6">
        <h1 className="text-4xl font-bold text-black dark:text-white">
          Wedding Platform
        </h1>
        <HealthCheckButton />
      </div>
    </div>
  );
}
