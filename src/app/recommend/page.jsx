"use client";

import React, { useState, useRef } from "react";

const SelfieUpload = ({ onUpload, selfieUrl, isAnalyzing, skinTone }) => {
  const fileInputRef = useRef(null);

  const handleChangeClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="border-2 border-dashed border-gray-300 p-6 text-center rounded-lg">
      {selfieUrl ? (
        <div>
          <img
            src={selfieUrl}
            alt="Selfie"
            className="mx-auto mb-4"
            style={{ width: "200px", height: "200px", objectFit: "cover" }}
          />
          {isAnalyzing ? (
            <p className="text-gray-500">Analyzing...</p>
          ) : (
            <p className="text-gray-700">
              Detected skin tone:{" "}
              <span className="font-medium">{skinTone}</span>
            </p>
          )}
          <button
            onClick={handleChangeClick}
            className="mt-2 text-blue-500 hover:text-blue-600"
          >
            Change Selfie
          </button>
        </div>
      ) : (
        <div>
          <p className="text-gray-500 mb-2">
            Drag and drop your selfie here or click to select
          </p>
          <input
            type="file"
            accept="image/*"
            onChange={onUpload}
            className="hidden"
            id="file-upload"
            ref={fileInputRef}
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer text-blue-500 hover:text-blue-600"
          >
            Select File
          </label>
        </div>
      )}
    </div>
  );
};

const WeatherSelector = ({ weathers, selectedWeather, onSelect }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {weathers.map((weather) => (
        <button
          key={weather}
          onClick={() => onSelect(weather)}
          className={`px-4 py-2 rounded-lg font-medium ${
            selectedWeather === weather
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          {weather}
        </button>
      ))}
    </div>
  );
};

const ProductList = ({ products }) => {
  if (products.length === 0) {
    return (
      <p className="text-gray-500">
        Please upload a selfie and select the weather to see recommendations.
      </p>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <div key={product.id} className="border rounded-lg shadow-md p-4">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-48 object-cover mb-3 rounded"
          />
          <h3 className="text-lg font-semibold">{product.name}</h3>
          <p className="text-gray-600">{product.description}</p>
        </div>
      ))}
    </div>
  );
};

const RecommendationPage = () => {
  const [selfieUrl, setSelfieUrl] = useState(null);
  const [skinTone, setSkinTone] = useState(null);
  const [selectedWeather, setSelectedWeather] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const weathers = ["Sunny", "Cloudy", "Rainy", "Snowy"];

  const mockProducts = [
    {
      id: 1,
      name: "Sunscreen SPF 50",
      description: "Protects against UV rays.",
      imageUrl: "https://via.placeholder.com/150?text=Sunscreen",
      skinTones: ["Light", "Medium"],
      weathers: ["Sunny"],
    },
    {
      id: 2,
      name: "Moisturizer",
      description: "Hydrates the skin.",
      imageUrl: "https://via.placeholder.com/150?text=Moisturizer",
      skinTones: ["Medium", "Dark"],
      weathers: ["Cloudy", "Rainy"],
    },
    {
      id: 3,
      name: "Lip Balm",
      description: "Prevents chapped lips.",
      imageUrl: "https://via.placeholder.com/150?text=Lip+Balm",
      skinTones: ["Light", "Dark"],
      weathers: ["Snowy"],
    },
  ];

  const getMockSkinTone = () => {
    const tones = ["Light", "Medium", "Dark"];
    return tones[Math.floor(Math.random() * tones.length)];
  };

  const handleUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setIsAnalyzing(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelfieUrl(reader.result);
        setTimeout(() => {
          const tone = getMockSkinTone();
          setSkinTone(tone);
          setIsAnalyzing(false);
        }, 1000);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleWeatherSelect = (weather) => {
    setSelectedWeather(weather);
  };

  const recommendedProducts =
    skinTone && selectedWeather
      ? mockProducts.filter(
          (product) =>
            product.skinTones.includes(skinTone) &&
            product.weathers.includes(selectedWeather)
        )
      : [];

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Get Your Personalized Recommendations
      </h1>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Upload Your Selfie</h2>
        <SelfieUpload
          onUpload={handleUpload}
          selfieUrl={selfieUrl}
          isAnalyzing={isAnalyzing}
          skinTone={skinTone}
        />
      </div>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Select Current Weather</h2>
        <WeatherSelector
          weathers={weathers}
          selectedWeather={selectedWeather}
          onSelect={handleWeatherSelect}
        />
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-2">Recommended Products</h2>
        <ProductList products={recommendedProducts} />
      </div>
    </div>
  );
};

export default RecommendationPage;
