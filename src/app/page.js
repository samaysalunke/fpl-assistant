import TeamIdInput from '../components/TeamIdInput';

export default function Home() {
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-4">Welcome to FPL Assistant</h1>
      <TeamIdInput />
    </div>
  );
}