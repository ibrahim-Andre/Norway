import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

const DriverVehicles = () => {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchVehicles();
    }, []);

    const fetchVehicles = async () => {
        const { data, error } = await supabase
            .from("vehicles")
            .select("*");

        if (!error) setVehicles(data);
        setLoading(false);
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {vehicles.map(vehicle => (
                <div
                    key={vehicle.id}
                    className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
                >
                    <h3 className="text-xl font-semibold mb-2">
                        {vehicle.plate}
                    </h3>

                    <p className="text-gray-600">
                        {vehicle.brand} {vehicle.model}
                    </p>
                </div>
            ))}
        </div>

    );
};


export default DriverVehicles;
