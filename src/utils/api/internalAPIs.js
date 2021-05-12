import axios from "axios";

const getEquipmentData = async () => {
	return await axios({
		url: `${process.env.REACT_APP_BACKEND_URL}/api/dashboard/`,
		method: "GET",
	})
		.then((res) => res.data)
		.catch((err) => console.log(err));
};

export { getEquipmentData };
