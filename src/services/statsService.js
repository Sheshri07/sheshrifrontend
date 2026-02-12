import { API } from "../utils/api";

export const getDashboardStats = async () => {
    try {
        const { data } = await API.get("/stats");
        return data;
    } catch (error) {
        throw error;
    }
};
