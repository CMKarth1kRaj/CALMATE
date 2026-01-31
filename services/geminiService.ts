
import { GoogleGenAI, Type } from "@google/genai";
import { FoodItem, UserProfile } from '../types';

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || "YOUR_API_KEY_HERE" });

const mealAnalysisSchema = {
  type: Type.OBJECT,
  properties: {
    items: {
      type: Type.ARRAY,
      description: "An array of food items identified in the image.",
      items: {
        type: Type.OBJECT,
        properties: {
          name: {
            type: Type.STRING,
            description: "The name of the food item.",
          },
          quantity: {
            type: Type.STRING,
            description: "Estimated quantity of the food item (e.g., '1 cup', '100g').",
          },
          calories: {
            type: Type.NUMBER,
            description: "Estimated calories for the quantity.",
          },
          protein: {
            type: Type.NUMBER,
            description: "Estimated protein in grams.",
          },
          carbs: {
            type: Type.NUMBER,
            description: "Estimated carbohydrates in grams.",
          },
          fat: {
            type: Type.NUMBER,
            description: "Estimated fat in grams.",
          },
        },
        required: ["name", "quantity", "calories", "protein", "carbs", "fat"],
      },
    },
    totalCalories: {
      type: Type.NUMBER,
      description: "The sum of calories for all identified food items.",
    },
  },
  required: ["items", "totalCalories"],
};

interface MealAnalysisResponse {
  items: FoodItem[];
  totalCalories: number;
}

export const analyzeMealFromImage = async (base64Image: string): Promise<MealAnalysisResponse> => {
  try {
    const imagePart = {
      inlineData: {
        mimeType: 'image/jpeg',
        data: base64Image,
      },
    };

    const textPart = {
      text: `
                You are a nutrition expert for the CALMATE app. Analyze this image of a meal.
                Identify each distinct food item and estimate its quantity.
                Provide a detailed nutritional breakdown for each item including calories, protein, carbohydrates, and fats.
                Sum up the total calories.
                Return the response strictly as a JSON object matching the provided schema. Be accurate and concise.
            `,
    };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [imagePart, textPart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: mealAnalysisSchema,
      }
    });

    const jsonStr = response.text.trim();
    const data = JSON.parse(jsonStr) as MealAnalysisResponse;
    return data;

  } catch (error) {
    console.error("Error analyzing meal with Gemini API:", error);
    throw new Error("Failed to analyze meal. Please try again.");
  }
};

const mealPlanSchema = {
  type: Type.OBJECT,
  properties: {
    plan: {
      type: Type.ARRAY,
      description: "An array of meals for one day.",
      items: {
        type: Type.OBJECT,
        properties: {
          mealType: { type: Type.STRING, description: "e.g., Breakfast, Lunch, Dinner, Snack" },
          dish: { type: Type.STRING, description: "Name of the dish." },
          calories: { type: Type.NUMBER, description: "Estimated calories for the dish." },
        },
        required: ["mealType", "dish", "calories"],
      },
    },
    totalCalories: {
      type: Type.NUMBER,
      description: "The sum of calories for the entire meal plan.",
    }
  },
  required: ["plan", "totalCalories"],
};

export interface MealPlanItem {
  mealType: string;
  dish: string;
  calories: number;
}

interface MealPlanResponse {
  plan: MealPlanItem[];
  totalCalories: number;
}

export const generateMealPlan = async (profile: UserProfile): Promise<MealPlanResponse> => {
  try {
    const prompt = `
            You are an expert nutritionist for the CALMATE app.
            Generate a one-day meal plan for a user with the following profile:
            - Goal: ${profile.goal.replace('_', ' ')}
            - Daily Calorie Target: ${profile.dailyCalorieTarget} kcal
            - They are ${profile.age} years old, ${profile.gender.toLowerCase()}, weigh ${profile.weight}kg and are ${profile.height}cm tall.

            Create a simple, balanced plan with 4 meals: Breakfast, Lunch, Dinner, and a Snack.
            The total calories should be close to their target.
            Return the response strictly as a JSON object matching the provided schema.
            Be creative with the dishes but keep them relatively common and easy to prepare.
        `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: mealPlanSchema,
      }
    });

    const jsonStr = response.text.trim();
    const data = JSON.parse(jsonStr) as MealPlanResponse;
    return data;

  } catch (error) {
    console.error("Error generating meal plan with Gemini API:", error);
    throw new Error("Failed to generate a meal plan. Please try again.");
  }
};
