import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const body = await req.json();
        const { city, cropType, soilColor } = body;

        if (!city || !cropType) {
            return NextResponse.json(
                { error: "City and crop type are required." },
                { status: 400 }
            );
        }

        // 1. Fetch weather data from OpenWeatherMap API
        const weatherRes = await fetch(
            `http://api.weatherapi.com/v1/forecast.json?key=${process.env.OPENWEATHER_API_KEY}&q=${city}&days=3&aqi=no&alerts=no`
        );
        const weatherData = await weatherRes.json();

        console.log(weatherData)

        if (!weatherData) {
            return NextResponse.json(
                { error: "Failed to fetch weather data." },
                { status: 500 }
            );
        }

        // 2. Craft prompt for Gemini
        const prompt = `
**IMPORTANT:** Provide clear and actionable irrigation recommendations. Specifically, answer the question: "Should I water today?" and if yes, provide the approximate amount of water (e.g., light, moderate, heavy, or specify in liters/gallons if possible). Directly reference the weather data and soil color (if provided) to justify your recommendations.

You are an agricultural irrigation advisor. I will provide you with weather data in JSON format, the crop type, and optionally, soil color. Based on this information, provide irrigation recommendations.

Instructions:

1. Weather Data: Analyze the provided weather data, paying close attention to temperature, humidity, wind speed, cloud cover, and any rainfall information.
2. Crop Type: Consider the water requirements of the specified crop.
3. Soil Color (if provided): Use soil color as a general indicator of soil properties.
4. Irrigation Recommendations:
    * Answer the question: "Should I water today?" with a clear "yes" or "no."
    * If yes, provide the approximate amount of water (e.g., light, moderate, heavy, or specify in liters/gallons if possible).
    * Explain the reasoning behind your recommendations, directly referencing the weather data, crop type, and soil color (if provided).
5. **Do NOT mention any limitations or uncertainties in your answer.**
6. Format: Provide the output in a concise, easy-to-understand manner.

Data:

\`\`\`json
${JSON.stringify(weatherData, null, 2)}
\`\`\`

Crop Type: ${cropType}
${soilColor ? `Soil Color: ${soilColor}` : ""}
`.trim();



        // 3. Send prompt to Gemini
        const geminiRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GOOGLE_GEMINI_API}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: prompt,
                                },
                            ],
                        },
                    ],
                }),
            }
        );

        const geminiData = await geminiRes.json();

        const outputText =
            geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ||
            "No recommendation generated.";

        return NextResponse.json({ recommendation: outputText });
    } catch (error) {
        console.error("[IRRIGATION_AI_ERROR]", error);
        return NextResponse.json(
            { error: "Failed to fetch irrigation recommendation." },
            { status: 500 }
        );
    }
}