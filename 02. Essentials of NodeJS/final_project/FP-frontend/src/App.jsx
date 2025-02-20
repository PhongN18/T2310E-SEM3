import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import UserList from "./components/UserList";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Login from "./pages/Login";
function App() {
    return (
    <Router>
		<Routes>
			<Route path="/" element={<Home />} />
			<Route path="/login" element={<Login />} />
			<Route path="/dashboard" element={<Dashboard />} />
			<Route path="/users" element={<UserList />} />
		</Routes>
    </Router>
    );
}
export default App;