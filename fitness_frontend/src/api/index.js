import axios from 'axios'

// Base API instance
const API = axios.create({
  baseURL: "http://localhost:5000/api",
})

// User registration API call
export const UserSignUp = async (data) => API.post("/user/signup", data)

// User login API call
export const UserSignIn = async (data) => API.post("/user/signin", data)

// Get dashboard details with token in headers
export const getDashBoardDetails = async (token) => 
  API.get("/user/dashboard", {
    headers: { Authorization: `Bearer ${token}` }
  })

// Get workouts for a specific date (date passed as query param)

export const getWorkouts = async (token, date) => 
  API.get(`/user/workout?date=${date}`, {
    headers: { Authorization: `Bearer ${token}` }
  })

// Add a new workout (POST request with data in body)
export const addWorkout = async (token, data) => 
  API.post("/user/workout", data, {
    headers: { Authorization: `Bearer ${token}` }
  })
