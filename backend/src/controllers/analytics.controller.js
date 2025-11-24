import mongoose from 'mongoose';
import Token from '../models/token.model.js';  // Adjust the path as needed
import Feedback from '../models/feedback.model.js';  // Adjust the path as needed
import Department from '../models/department.model.js';



export const getTokenAnalytics = async (req, res) => {
    try {
      const { businessId, departmentId } = req.params;
      
      if (!mongoose.Types.ObjectId.isValid(businessId) || !mongoose.Types.ObjectId.isValid(departmentId)) {
        return res.status(400).json({ error: 'Invalid businessId or departmentId' });
      }
      const department = await Department.findById(departmentId);

      if (!department) {
        return res.status(404).json({ error: "Department not found" });
      }

      const avgProcessingTime = department.averageProcessingTime;
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()); 
      
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6); 
  
      const totalTokens = await Token.countDocuments({
        businessId: new mongoose.Types.ObjectId(businessId),
        departmentId: new mongoose.Types.ObjectId(departmentId)
      });
  
      const dailyTokens = await Token.aggregate([
        {
          $match: {
            businessId: new mongoose.Types.ObjectId(businessId),
            departmentId: new mongoose.Types.ObjectId(departmentId),
            createdAt: {
              $gte: sevenDaysAgo,
              $lte: new Date(today.getTime() + 86400000 - 1) 
            }
          }
        },
        {
          $project: {
            localDate: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$createdAt",
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
              }
            }
          }
        },
        {
          $group: {
            _id: "$localDate",
            count: { $sum: 1 }
          }
        }
      ]);
  
      const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const tokenData = [];
  
      for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - (6 - i));

        const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        const dayName = weekdays[date.getDay()];
        const formattedDate = `${dayName} ${date.getDate()}/${date.getMonth() + 1}`;
  
        const foundDay = dailyTokens.find(d => d._id === dateStr);
        
        tokenData.push({
          day: formattedDate,
          date: dateStr,
          tokens: foundDay ? foundDay.count : 0
        });
      }
  
      res.status(200).json({
        totalTokens,
        tokenData,
        avgProcessingTime
      });
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  };

export const getFeedbackAnalytics = async (req, res) => {
  const { businessId, departmentId } = req.params;

  if (
    !mongoose.Types.ObjectId.isValid(businessId) ||
    !mongoose.Types.ObjectId.isValid(departmentId)
  ) {
    return res.status(400).json({ error: 'Invalid businessId or departmentId' });
  }

  try {
    const filter = {
      businessId: new mongoose.Types.ObjectId(businessId),
      departmentId: new mongoose.Types.ObjectId(departmentId),
    };

    const totalFeedbacks = await Feedback.countDocuments(filter);

    const feedbackData = await Feedback.aggregate([
      { $match: filter },
      {
        $group: {
          _id: "$rating",
          count: { $sum: 1 },
        },
      },
    ]);

    const feedbackMap = {
      1: "⭐",
      2: "⭐⭐",
      3: "⭐⭐⭐",
      4: "⭐⭐⭐⭐",
      5: "⭐⭐⭐⭐⭐",
    };

    const feedbackChart = Object.entries(feedbackMap).map(([key, label]) => {
      const item = feedbackData.find((f) => f._id === +key);
      return {
        rating: label,
        count: item ? item.count : 0,
      };
    });

    res.json({ totalFeedbacks, feedbackChart });
  } catch (err) {
    console.error("Feedback analytics error", err);
    res.status(500).json({ error: 'Server error' });
  }
};
