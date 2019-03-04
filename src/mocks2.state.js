import { reusableState } from "./reuse";

const useObject = (useState, initialState = {}) => {
  const [object, setObject] = useState(initialState);

  return {
    value: object,
    set: setObject,
    update: partial =>
      setObject(prev => ({
        ...prev,
        ...partial
      })),
    setProp: prop => value =>
      setObject(prev => ({
        ...prev,
        [prop]: value
      }))
  };
};

const mocksState = reuseState => {
  const user = useObject(reuseState, {
    fullName: "Adam Klein",
    email: "adam@500tech.com",
    role: "Admin User"
  });

  return {
    mocks,
    setRole: user.setProp("role"),
    setProp: user.update
  };
};

export const useMockState = reusableState(mocksState);
