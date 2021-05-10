import axios from "axios";

const getEquipmentData = async (max, last) => {
	return await axios({
		url: `${process.env.REACT_APP_BACKEND_URL}/api/dashboard/${max}/${last}`,
		method: "GET",
	})
		.then((res) => res.data)
		.catch((err) => console.log(err));
};

export { getEquipmentData };
