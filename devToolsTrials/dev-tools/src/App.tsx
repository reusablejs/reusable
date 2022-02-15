import Counter from "./Counter";
import * as reusable from "./src-true/react-reusable";

const App = () => {
  return (
    <reusable.ReusableProvider>
      <div>hello</div>
      <Counter />
    </reusable.ReusableProvider>
  );
};

export default App;
