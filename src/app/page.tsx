
import { DatabaseChecker } from "@/components/DatabaseChecker";

export default function HomePage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Database Status</h1>
      <DatabaseChecker />
    </div>
  );
}
