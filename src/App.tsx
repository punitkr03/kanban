import React from "react";
import Kanban from "./components/Kanban";
import { Toaster } from "sonner";

function App() {
  return (
    <React.Fragment>
      <Toaster richColors />
      <Kanban />
    </React.Fragment>
  );
}

export default App;
