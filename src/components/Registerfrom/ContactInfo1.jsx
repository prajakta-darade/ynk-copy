import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubmitFormMutation } from '../../store/formApi';

function ContactInfo1() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    branch: '',
  });
  const [language, setLanguage] = useState('en');
  const [submitForm, { isLoading, error }] = useSubmitFormMutation();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const data = new FormData();
    data.append('formId', 'register');
    data.append('language', language);
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    try {
      await submitForm(data).unwrap();
      alert(language === 'en' ? 'Registration successful!' : 'नोंदणी यशस्वी!');
      navigate('/terms-and-conditions');
    } catch (err) {
      alert('Registration failed: ' + (err?.data?.message || 'Unknown error'));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#dbeeff] p-6 rounded-xl border border-blue-200">
        <div className="bg-white flex justify-between items-center mb-4 px-3 py-2 rounded">
          <div className="flex items-center space-x-3">
            <h1 className="text-xl font-bold">YNK</h1>
          </div>
          <button
            onClick={() => setLanguage(language === 'en' ? 'mr' : 'en')}
            className="text-sm text-gray-600 underline"
          >
            {language === 'mr' ? 'English' : 'मराठी'}
          </button>
        </div>
        <h2 className="text-xl font-bold text-center mb-4">
          {language === 'en' ? 'Register' : 'नोंदणी'}
        </h2>
        <div className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder={language === 'en' ? 'Name' : 'नाव'}
            value={formData.name}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            name="mobile"
            placeholder={language === 'en' ? 'Mobile' : 'मोबाइल'}
            value={formData.mobile}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            name="branch"
            placeholder={language === 'en' ? 'Branch' : 'शाखा'}
            value={formData.branch}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className={`w-full py-2 rounded text-white ${isLoading ? 'bg-gray-400' : 'bg-green-600'}`}
          >
            {isLoading ? 'Submitting...' : (language === 'en' ? 'Register' : 'नोंदणी करा')}
          </button>
          {error && <p className="text-red-500">{error?.data?.message || 'Error'}</p>}
        </div>
      </div>
    </div>
  );
}

export default ContactInfo1;