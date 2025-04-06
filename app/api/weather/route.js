import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const body = await req.json();
        const { city} = body;

        if (!city) {
            return NextResponse.json(
                { error: "City is required." },
                { status: 400 }
            );
        }

        // 1. Fetch weather data from OpenWeatherMap API
        const weatherRes = await fetch(
            `http://api.weatherapi.com/v1/forecast.json?key=${process.env.OPENWEATHER_API_KEY}&q=${city}&days=3&aqi=no&alerts=no`
        );
        const weatherData = await weatherRes.json();


        if (!weatherData) {
            return NextResponse.json(
                { error: "Failed to fetch weather data." },
                { status: 500 }
            );
        }

        return NextResponse.json({weatherData });
    } catch (error) {
        console.error("[IRRIGATION_AI_ERROR]", error);
        return NextResponse.json(
            { error: "Failed to fetch irrigation recommendation." },
            { status: 500 }
        );
    }
} 