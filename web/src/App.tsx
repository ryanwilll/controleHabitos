import { Habit } from "./components/Habit";
import "./styles/global.css";
function App() {
  return (
    <div>
      <Habit completed={3} />
      <Habit completed={2} />
      <Habit completed={10} />
      <Habit completed={32} />
      <Habit completed={6} />
    </div>
  );
}

export default App;
