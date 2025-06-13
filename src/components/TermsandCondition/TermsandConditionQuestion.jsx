const TermsandConditionQuestion = {
  en: {
    title: 'Terms and Conditions',
    subheader: 'Please read and accept the terms and conditions below.',
    tableHeaders: ['Sr. No.', 'Description', 'Accept'],
    question: 'Do you agree to the terms and conditions?',
    yes: 'Yes',
    no: 'No',
    submit: 'Submit',
    allCheckedError: 'Please accept all terms and conditions.',
    agreementError: 'Please select whether you agree to the terms and conditions.',
    successMessage: 'Thank you! Your agreement has been recorded.',
    submitError: 'Failed to submit the form. Please try again.',
  },
  mr: {
    title: 'नियम आणि अटी',
    subheader: 'कृपया खालील नियम आणि अटी वाचा आणि स्वीकारा.',
    tableHeaders: ['अनु. क्र.', 'वर्णन', 'स्वीकार'],
    question: 'तुम्ही नियम आणि अटींशी सहमत आहात का?',
    yes: 'होय',
    no: 'नाही',
    submit: 'सबमिट करा',
    allCheckedError: 'कृपया सर्व नियम आणि अटी स्वीकारा.',
    agreementError: 'कृपया नियम आणि अटींशी सहमत आहात की नाही ते निवडा.',
    successMessage: 'धन्यवाद! तुमची संमती नोंदवली गेली आहे.',
    submitError: 'फॉर्म सबमिट करण्यात अयशस्वी. कृपया पुन्हा प्रयत्न करा.',
  },
};

const terms = [
  {
    id: 1,
    description_en: 'The validity period of the quotation will be 1 month.',
    description_mr: 'कोटेशनची वैधता कालावधी १ महिना असेल.',
  },
  {
    id: 2,
    description_en: 'GST will be applicable.',
    description_mr: 'जीएसटी लागू असेल.',
  },
  {
    id: 3,
    description_en: 'After 1 month, the quotation may change according to the market price.',
    description_mr: '१ महिन्यानंतर कोटेशन बाजारभावानुसार बदलू शकते.',
  },
  {
    id: 4,
    description_en: 'The prices of branded companies may vary.',
    description_mr: 'ब्रँडेड कंपन्यांच्या किंमती बदलू शकतात.',
  },
  {
    id: 5,
    description_en: 'The validity of the quotation given to the customer will be 20 days.',
    description_mr: 'ग्राहकाला दिलेल्या कोटेशनची वैधता २० दिवस असेल.',
  },
  {
    id: 6,
    description_en: 'If the quotation is not finalized within the given period, the price may change.',
    description_mr: 'जर कोटेशन दिलेल्या कालावधीत अंतिम झाले नाही, तर किंमत बदलू शकते.',
  },
  {
    id: 7,
    description_en: 'The service and warranty of electronic goods will be as per MEG Co. policy.',
    description_mr: 'इलेक्ट्रॉनिक वस्तूंची सेवा व हमी MEG कंपनीच्या धोरणानुसार असेल.',
  },
  {
    id: 8,
    description_en: 'The branch owner should get all civil work done by a local vendor.',
    description_mr: 'शाखेच्या मालकाने सर्व सिव्हिल काम स्थानिक विक्रेत्याकडून करून घ्यावे.',
  },
  {
    id: 9,
    description_en: 'All details about required civil drawings, material brands, and quality will be provided by the company.',
    description_mr: 'आवश्यक सिव्हिल रेखाचित्रे, सामग्री ब्रँड व गुणवत्ता यांची सर्व माहिती कंपनीद्वारे दिली जाईल.',
  },
  {
    id: 10,
    description_en: 'If there is any change in the quotation, the amount may vary.',
    description_mr: 'कोटेशनमध्ये कोणताही बदल झाल्यास रक्कम बदलू शकते.',
  },
];

export { TermsandConditionQuestion, terms };
