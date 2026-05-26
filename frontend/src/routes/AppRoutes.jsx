import {Route, Routes} from "react-router-dom";
import Dashboard from "../Dashboard";
import QuestionDetail from "../QuestionDetails";

const AppRoutes = () => {

  return (
    <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/:question/:id" element={<QuestionDetail />} />
    </Routes>
  )
}

export default AppRoutes