export const buildPrompt = ({
  race_date,
  race_distance,
  experience_level,
  runs_per_week
}) => {
  console.log("building prompt")
  const currentDate = new Date(Date.now());
  const raceDate = new Date(race_date);
  const weeksUntilRace = Math.ceil((raceDate - currentDate) / (1000 * 60 * 60 * 24 * 7)); // Calculate weeks until race

  const getMaximumWeeklyMileage = () => {
    if (race_distance >= 26.2) {
      if (experience_level === 'Advanced') {
        return 4 * race_distance
      }
      if (experience_level === 'Intermediate') {
        return 1.5 * race_distance
      }
      if (experience_level === 'Beginner') {
        return race_distance
      }
    }
    if (race_distance >= 13.1) {
      if (experience_level === 'Advanced') {
        return 3 * race_distance
      }
      if (experience_level === 'Intermediate') {
        return 2.5 * race_distance
      }
      if (experience_level === 'Beginner') {
        return 2 * race_distance
      }
    }
    if (race_distance >= 6.2) {
      if (experience_level === 'Advanced') {
        return 5 * race_distance
      }
      if (experience_level === 'Intermediate') {
        return 4.5 * race_distance
      }
      if (experience_level === 'Beginner') {
        return 4 * race_distance
      }
    }
    if (race_distance < 6.2) {
      if (experience_level === 'Advanced') {
        return 35
      }
      if (experience_level === 'Intermediate') {
        return 25
      }
      if (experience_level === 'Beginner') {
        return 20
      }
    }
  }

  return `
      You are a running coach creating a structured training plan. Your response must be a valid JSON object following the exact structure specified below.
      
      **User Inputs:**
      - Current Date: ${currentDate}
      - Race Date: ${raceDate}
      - Distance: ${race_distance} miles
      - Experience Level: ${experience_level}
      - Runs per Week: ${runs_per_week}
      - Weeks Until Race: ${weeksUntilRace}
  
      **Training Plan Guidelines:**
      1. Weekly mileage should not exceed 110% of the previous week. This is mandatory.
      2. For any given week, the total mileage should not exceed ${getMaximumWeeklyMileage()}. This is mandatory.
      3. In the week that occurs 2-3 weeks before the race, a user must have at least one long run equal to or greater than ${race_distance * 0.8} miles. This is mandatory.
      4. Do not recommend any runs that are more than ${race_distance * 1.1} miles. This is mandatory.
      5. Make sure to include "Race Day" -  where the distance is ${race_distance} miles - in the final week. This is mandatory.
      6. Make sure to calculate "Total Mileage" correctly for each week. Total mileage is the sum of all run distances for that week. This is mandatory.

      
      **Required Response Format:**
      Respond with a JSON object that strictly follows this structure (ignoring newline special charactesr). The JSON object should NOT have any comments or unparseable characters:
      {
        "weeks": [
          {
            "weekNumber": "<number>",
            "totalMileage": "<number>",
            "runs": [
              {
                "day": "<string>",
                "type": "<string>",
                "distance": "<number>",
                "description": "<string>"
              }
            ]
          }
        ]
      }

      Each run must include exactly these fields: "day", "type", "distance", and "description".
      Valid run types are: "Easy Run", "Long Run", "Tempo Run", "Speed Work", "Recovery Run", "Race".
      Days must be one of: "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday".
      
      Provide the training plan for ${weeksUntilRace} weeks in this exact JSON format.
    `;
}