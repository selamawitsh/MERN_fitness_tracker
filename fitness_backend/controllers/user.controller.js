import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import user from '../models/user.model.js'
import workoutModel from '../models/workout.model.js'


dotenv.config()

 const UserRegister = async (req,res) => {
    try {
        const {email, password, name, img} = req.body;
        if (!email || !password || !name) {
            return res.status(400).json({ message: "All required fields must be filled" });
        }
        const existingUser = await user.findOne({email});
        if (existingUser) {
            return res.status(400).json({message: "User already exists"});
        }

        const hashedPassword = bcrypt.hashSync(password, 10);
        const newUser = new user({
            name: name,
            password:hashedPassword,
            email:email,
            img:img
        });

        await newUser.save()
        const token = jwt.sign({id:newUser._id}, process.env.JWT_SECRET, {expiresIn: '30d'})
        res.status(201).json({message: "User registered successfully"});
        
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({message: "Internal server error"});
        
    }
    
}

const UserLogin = async (req,res) => {
    try {
        const {email, password} = req.body;

        //check if the user exist
        const User = await user.findOne({email});
        if(!User){
            return res.status(404).json({ message: 'user not found' });
        }

        //check the password
        const isMatch = bcrypt.compareSync(password,User.password);
        if(!isMatch){
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        //create a jwt token
        const token = jwt.sign({id:User._id}, process.env.JWT_SECRET, {expiresIn:'30d'})
        res.status(200).json({
            message: 'Login successful',
            token: token,
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error" });
        
    }
    
}

const getUserDashboard = async (req, res) => {
  try {
    const userId = req.user?.id;
    const User = await user.findById(userId);

    if (!User) {
      return res.status(404).json({ message: "User not found" });
    }

    const currentDateFormatted = new Date();

    const startToday = new Date(
      currentDateFormatted.getFullYear(),
      currentDateFormatted.getMonth(),
      currentDateFormatted.getDate()
    );

    const endToday = new Date(
      currentDateFormatted.getFullYear(),
      currentDateFormatted.getMonth(),
      currentDateFormatted.getDate() + 1
    );

    //  Total calories burnt today
    const totalCaloriesBurnt = await workoutModel.aggregate([
      {
        $match: {
          user: User._id,
          date: { $gte: startToday, $lt: endToday },
        },
      },
      {
        $group: {
          _id: null,
          totalCaloriesBurnt: { $sum: "$caloriesBurned" }, //  fixed typo
        },
      },
    ]);

    //  Total number of workouts
    const totalWorkOuts = await workoutModel.countDocuments({ 
      user: userId,
      date: { $gte: startToday, $lt: endToday },
    });

    //  Avg calories per workout
    const avgCaloriesBurntPerWorkout =
      totalCaloriesBurnt.length > 0
        ? totalCaloriesBurnt[0].totalCaloriesBurnt / totalWorkOuts
        : 0;

    //  Calories per category (for pie chart)
    const categoryCalories = await workoutModel.aggregate([
      {
        $match: {
          user: User._id,
          date: { $gte: startToday, $lt: endToday },
        },
      },
      {
        $group: {
          _id: "$category",
          totalCaloriesBurnt: { $sum: "$caloriesBurned" }, //  fixed typo: "scaloriesBurned"
        },
      },
    ]);

    //  Format for pie chart
    const pieChartData = categoryCalories.map((category, index) => ({
      id: index,
      value: category.totalCaloriesBurnt,
      label: category._id,
    }));

    //  Weekly calories tracking
    const weeks = [];
    const caloriesBurnt = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(currentDateFormatted.getTime() - i * 24 * 60 * 60 * 1000);

      weeks.push(`${date.getDate()}th`);

      const startOfDay = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      );

      const endOfDay = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate() + 1
      );

      const weekData = await workoutModel.aggregate([
        {
          $match: {
            user: User._id,
            date: { $gte: startOfDay, $lt: endOfDay },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$date" }
            },
            totalCaloriesBurnt: { $sum: "$caloriesBurned" },
          },
        },
        {
          $sort: { _id: 1 },
        },
      ]);

      //  Push value or 0 if no data
      caloriesBurnt.push(
        weekData.length > 0 ? weekData[0].totalCaloriesBurnt : 0
      );
    }

    //  Final response
    return res.status(200).json({
      totalCaloriesBurnt:
        totalCaloriesBurnt.length > 0
          ? totalCaloriesBurnt[0].totalCaloriesBurnt
          : 0,

      totalWorkOuts: totalWorkOuts,
      avgCaloriesBurntPerWorkout: avgCaloriesBurntPerWorkout,

      totalWeeksCaloriesBurnt: {
        weeks: weeks,
        caloriesBurned: caloriesBurnt,
      },

      pieChartData: pieChartData,
    });

  } catch (error) {
    console.error("Dashboard error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


const getWorkoutByDate = async (req, res) => {
  try {
    const userId = req.user?.id;
    const User = await user.findById(userId);

    // Check if user exists
    if (!User) {
      return res.status(404).json({ message: "User not found" });
    }

    // Use date from query (or default to today)
    const date = req.query.date ? new Date(req.query.date) : new Date();

    // Get start of the day (e.g. 2025-07-11T00:00:00.000Z)
    const startOfDay = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );

    // Get end of the day (next day at midnight)
    const endOfDay = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() + 1
    );

    // Find workouts by user and date
    const todaysWorkouts = await workoutModel.find({
      user: userId, 
      date: { $gte: startOfDay, $lt: endOfDay },
    });

    // Sum up calories
    const totalCaloriesBurnt = todaysWorkouts.reduce(
      (total, workout) => total + (workout.caloriesBurned || 0),
      0
    );

    // Send response
    return res.status(200).json({ todaysWorkouts, totalCaloriesBurnt });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


const addWorkOut = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { workoutString } = req.body;

    if (!workoutString) {
      return res.status(400).json({ message: "Workout string is missing." });
    }

    const eachworkout = workoutString.split(";").map((line) => line.trim());
    const categories = eachworkout.filter((line) => line.startsWith("#"));

    if (categories.length === 0) {
      return res.status(400).json({ message: "No categories found in workout string." });
    }

    const parsedWorkouts = [];
    let currentCategory = "";
    let count = 0;

    for (let line of eachworkout) {
      count++;
      if (line.startsWith("#")) {
        const parts = line.split("\n").map((part) => part.trim());

        if (parts.length < 5) {
          return res.status(400).json({ message: `Workout data missing at line ${count}` });
        }

        currentCategory = parts[0].substring(1).trim(); // remove #
        const workoutDetails = parseWorkoutLine(parts);

        if (!workoutDetails) {
          return res.status(400).json({ message: "Workout format is incorrect." });
        }

        workoutDetails.category = currentCategory;
        parsedWorkouts.push(workoutDetails);
      } else {
        return res.status(400).json({ message: `Invalid line format at line ${count}` });
      }
    }

    for (let workout of parsedWorkouts) {
      workout.caloriesBurned = parseFloat(calculateCaloriesBurnt(workout));
      await workoutModel.create({ ...workout, user: userId });
    }

    return res.status(201).json({
      message: "Workouts added successfully.",
      workouts: parsedWorkouts,
    });

  } catch (error) {
    console.error("Error adding workouts:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const parseWorkoutLine = (parts) => {
  const details = {};

  if (parts.length >= 5) {
    details.workoutName = parts[1].startsWith("-")
      ? parts[1].substring(1).trim()
      : parts[1].trim();

    // Parse sets
    if (parts[2].toLowerCase().includes("sets")) {
      details.sets = parseInt(parts[2].split(":")[1].trim());
    }

    // Parse reps
    if (parts[2].toLowerCase().includes("reps")) {
      details.reps = parseInt(parts[2].split(":")[1].trim());
    } else if (parts[3].toLowerCase().includes("reps")) {
      details.reps = parseInt(parts[3].split(":")[1].trim());
    }

    // Parse weight
    if (parts[3].toLowerCase().includes("weight")) {
      details.weight = parseFloat(parts[3].split(":")[1].trim());
    } else if (parts[4].toLowerCase().includes("weight")) {
      details.weight = parseFloat(parts[4].split(":")[1].trim());
    }

    // Parse duration
    if (parts[4].toLowerCase().includes("duration")) {
      details.duration = parseFloat(parts[4].split(":")[1].trim());
    } else if (parts[5] && parts[5].toLowerCase().includes("duration")) {
      details.duration = parseFloat(parts[5].split(":")[1].trim());
    }

    return details;
  }

  return null; // Not enough data
};

const calculateCaloriesBurnt = (workoutDetails) => {
  const durationInMinutes = parseFloat(workoutDetails.duration);
  const weightInKg = parseFloat(workoutDetails.weight);
  const caloriesBurntPerMinute = 0.1; // you can adjust this based on activity

  return durationInMinutes * caloriesBurntPerMinute * weightInKg;
};






export {UserRegister, UserLogin, getUserDashboard, getWorkoutByDate, addWorkOut }

