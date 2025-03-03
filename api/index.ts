import axios from "axios";


const toccaAPI = axios.create({
    baseURL : process.env.API_URL,
    timeout: 60_000,
    headers: {
        "Content-Type": "application/json",
        // "X-API-Key": getEnvVar("API_KEY")
    }
})

export default toccaAPI;