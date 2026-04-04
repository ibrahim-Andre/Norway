import { NavLink } from "react-router-dom";
import { FaMoneyBillWave } from "react-icons/fa";


const DriverSidebar = () => {
  return (
  
    <aside className="w-64 bg-white shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-10 text-gray-800">
        Driver Panel
      </h2>

      <nav className="flex flex-col gap-4">
        <NavLink
          to="/driver"
          className="text-gray-600 hover:text-blue-600 font-medium"
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/driver/profile"
          className="text-gray-600 hover:text-blue-600 font-medium"
        >
          Profile
        </NavLink>
		
          <NavLink to="/driver/earnings">
            <FaMoneyBillWave />
            <span>Kazançlar</span>
          </NavLink>
        

        <NavLink
          to="/driver/vehicles"
          className="text-gray-600 hover:text-blue-600 font-medium"
        >
          Vehicles
        </NavLink>
		
		
      </nav>
    </aside>
  );
};

export default DriverSidebar;
