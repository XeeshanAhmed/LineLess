import mongoose from 'mongoose';
import Token from '../models/token.model.js';  // Adjust the path as needed
import Feedback from '../models/feedback.model.js';  // Adjust the path as needed
import Department from '../models/department.model.js';

// Controller for token analytics
// export const getTokenAnalytics = async (req, res) => {
//     try {
//       const { businessId, departmentId } = req.params;
      
//       if (!mongoose.Types.ObjectId.isValid(businessId) || !mongoose.Types.ObjectId.isValid(departmentId)) {
//         return res.status(400).json({ error: 'Invalid businessId or departmentId' });
//       }
  
//       const today = new Date();
//       today.setHours(0, 0, 0, 0); // Start of today
  
//       const sevenDaysAgo = new Date(today);
//       sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6); // 7 days total (6 days ago + today)
  
//       // 1. Get total token count
//       const totalTokens = await Token.countDocuments({
//         businessId: new mongoose.Types.ObjectId(businessId),
//         departmentId: new mongoose.Types.ObjectId(departmentId)
//       });
  
//       // 2. Get daily counts for last 7 days
//       const dailyTokens = await Token.aggregate([
//         {
//           $match: {
//             businessId: new mongoose.Types.ObjectId(businessId),
//             departmentId: new mongoose.Types.ObjectId(departmentId),
//             createdAt: {
//               $gte: sevenDaysAgo,
//               $lte: new Date(today.getTime() + 86400000 - 1) // End of today
//             }
//           }
//         },
//         {
//           $group: {
//             _id: {
//               $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
//             },
//             count: { $sum: 1 }
//           }
//         }
//       ]);
  
//       // 3. Generate all dates in the range with proper labels
//       const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
//       const tokenData = [];
  
//       for (let i = 0; i < 7; i++) {
//         const date = new Date(today);
//         date.setDate(today.getDate() - (6 - i)); // From oldest to newest
        
//         const dateStr = date.toISOString().split('T')[0];
//         const dayName = weekdays[date.getDay()];
//         const formattedDate = `${dayName} ${date.getDate()}/${date.getMonth() + 1}`;
  
//         const foundDay = dailyTokens.find(d => d._id === dateStr);
        
//         tokenData.push({
//           day: formattedDate,
//           date: dateStr,
//           tokens: foundDay ? foundDay.count : 0
//         });
//       }
  
//       res.status(200).json({
//         totalTokens,
//         tokenData
//       });
  
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ error: 'Server error' });
//     }
//   };
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

      const avgProcessingTime = department.avgProcessingTime;
      // Get current date in local timezone
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // Local midnight
      
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6); // 7 days total (6 days ago + today)
  
      // 1. Get total token count
      const totalTokens = await Token.countDocuments({
        businessId: new mongoose.Types.ObjectId(businessId),
        departmentId: new mongoose.Types.ObjectId(departmentId)
      });
  
      // 2. Get daily counts for last 7 days (using local time)
      const dailyTokens = await Token.aggregate([
        {
          $match: {
            businessId: new mongoose.Types.ObjectId(businessId),
            departmentId: new mongoose.Types.ObjectId(departmentId),
            createdAt: {
              $gte: sevenDaysAgo,
              $lte: new Date(today.getTime() + 86400000 - 1) // End of today
            }
          }
        },
        {
          $project: {
            // Convert to local date string without timezone offset
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
  
      // 3. Generate all dates in the range with proper labels
      const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const tokenData = [];
  
      for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - (6 - i)); // From oldest to newest
        
        // Format date string without timezone issues
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
