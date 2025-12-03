import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: App,
});

function App() {
  return (
    <div>
      <h1>Hola mundo!</h1>
    </div>
  );
}
