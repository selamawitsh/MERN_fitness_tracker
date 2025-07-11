import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import user from '../models/user.model.js'
import Workout from '../models/workout.model.js'
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


export {UserRegister, UserLogin, getUserDashboard }

// "email": "selam@example.com",
//   "password": "securepassword123",