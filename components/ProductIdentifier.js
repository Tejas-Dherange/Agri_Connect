'use client';
import { useState, useRef } from 'react';
import Image from 'next/image';
import { Loader2, Volume2 } from 'lucide-react';

const SUPPORTED_LANGUAGES = {
  english: 'en-US',
  hindi: 'hi-IN',
  marathi: 'mr-IN'
};

export default function ProductIdentifier() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const fileInputRef = useRef(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    setSelectedImage(file);
    setPreviewUrl(URL.createObjectURL(file));
    setError('');
  };

  const identifyProduct = async () => {
    if (!selectedImage) {
      setError('Please select an image first');
      return;
    }

    setLoading(true);
    setError('');
    setProduct(null);

    try {
      const formData = new FormData();
      formData.append('image', selectedImage);

      const response = await fetch('/api/product-identify', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('API access denied. Please check your API configuration.');
        } else if (response.status === 404) {
          throw new Error('No information found for this product. Please try a different image.');
        } else {
          throw new Error(data.error || 'Failed to identify product');
        }
      }

      if (!data.product) {
        throw new Error('No product information received');
      }

      setProduct(data.product);
    } catch (err) {
      console.error('Error identifying product:', err);
      setError(err.message);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  const speakText = (text) => {
    if (!text) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = SUPPORTED_LANGUAGES[selectedLanguage];
    utterance.rate = 0.9;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const getTranslatedContent = (field) => {
    if (!product) return '';
    if (selectedLanguage === 'english') return product[field];
    return product.translations?.[selectedLanguage]?.[field] || product[field];
  };

  const InfoCard = ({ title, field }) => (
    <div className="bg-gray-100 p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-semibold">{title}</h4>
        <button onClick={() => speakText(getTranslatedContent(field))} className="text-blue-600 hover:text-blue-800">
          <Volume2 size={20} />
        </button>
      </div>
      <p className="text-gray-700">{getTranslatedContent(field)}</p>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <h2 className="text-3xl font-bold text-center text-gray-800">🌿 Product Identifier</h2>

      {/* Upload Section */}
      <div className="flex flex-col items-center space-y-4">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition"
        >
          Upload Product Image
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
        {previewUrl && (
          <div className="relative w-64 h-64 border rounded-lg overflow-hidden shadow">
            <Image
              src={previewUrl}
              alt="Preview"
              fill
              className="object-contain"
            />
          </div>
        )}
        {selectedImage && (
          <button
            onClick={identifyProduct}
            disabled={loading}
            className="px-6 py-3 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition disabled:opacity-50"
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="animate-spin" size={18} />
                <span>Identifying...</span>
              </div>
            ) : (
              'Identify Product'
            )}
          </button>
        )}
        {error && <p className="text-red-600 mt-2">{error}</p>}
      </div>

      {/* Product Info */}
      {product && (
        <div className="bg-white rounded-xl shadow-md p-6 space-y-6 border">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-semibold capitalize">{product.name}</h3>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="px-3 py-2 border rounded-md bg-gray-100 font-medium"
            >
              {Object.keys(SUPPORTED_LANGUAGES).map(lang => (
                <option key={lang} value={lang}>
                  {lang.charAt(0).toUpperCase() + lang.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {product.predictions?.length > 1 && (
            <div className="text-sm text-gray-600">
              <p>🔍 Other possible matches:</p>
              <ul className="list-disc list-inside ml-4">
                {product.predictions.slice(1).map((pred, index) => (
                  <li key={index} className="capitalize">
                    {pred.label} ({Math.round(pred.score * 100)}% confidence)
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            <InfoCard title="Usage Instructions" field="usage" />
            <InfoCard title="Dosage Information" field="dosage" />
            <InfoCard title="Safety Guidelines" field="safetyInfo" />
            <InfoCard title="Benefits" field="benefits" />
            <InfoCard title="Application Timing" field="timing" />
            <InfoCard title="Precautions" field="precautions" />
          </div>

          <div className="mt-6">
            <h4 className="font-medium text-lg mb-3">⚠️ Important Notes:</h4>
            <div className="bg-yellow-100 border-l-4 border-yellow-400 p-4 rounded-md">
              <ul className="list-disc list-inside space-y-2 text-yellow-800">
                <li>Read and follow label instructions carefully.</li>
                <li>Wear gloves and masks while handling chemicals.</li>
                <li>Store safely away from sunlight, kids and animals.</li>
                <li>Use only recommended quantities for crops.</li>
                <li>Consult agricultural experts if unsure.</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
