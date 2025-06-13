const formConfig= {
  id: 'form_information',
  title_mr: 'आंतर विभागीय कार्य',
  title_en: 'Internal Department Work',
  fields: [
    {
      id: 'developer_quotation',
      question_mr: 'डेवलपर टीमने सेल्स डिपार्टमेंटला कोटेशन पाठवले का?',
      question_en: 'Did the developer team send the quotation to the sales department?',
      type: 'yesOther',
    },
    {
      id: 'sales_to_owner_quotation',
      question_mr: 'सेल्स डिपार्टमेंटला ओनरला कोटेशन पाठवले का?',
      question_en: 'Did the sales department send the quotation to the owner?',
      type: 'yesno',
    },
    {
      id: 'owner_received_quotation',
      question_mr: 'ओनरला कोटेशन मिळाले का?',
      question_en: 'Did the owner receive the quotation?',
      type: 'yesno',
    },
    {
      id: 'owner_checked_quotation',
      question_mr: 'ओनर ने पूर्ण कोटेशन चेक केले का?',
      question_en: 'Did the owner check the complete quotation?',
      type: 'yesno',
    },
    {
      id: 'quotation_finalized',
      question_mr: 'ओनर सोबत सेल्स डिपार्टमेंटचे कोटेशन फायनल झाले का?',
      question_en: 'Has the quotation from the sales department been finalized with the owner?',
      type: 'yesno',
    },
    {
      id: 'sample_layout_ready',
      question_mr: 'शॉपचे सॅम्पल लेआउट तयार आहे का?',
      question_en: 'Is the shop sample layout ready?',
      type: 'yesno',
    },
    {
      id: 'layout_discussed_finalized',
      question_mr: 'लेआउट ओनरसोबत चर्चा करून फायनल केले का?',
      question_en: 'Was the layout discussed and finalized with the owner?',
      type: 'yesno',
    },
    {
      id: 'engineer_assigned',
      question_mr: 'लेआउट फायनल झाल्यानंतर त्या साईटसाठी इंजिनिअर असाइन केले का?',
      question_en: 'Was an engineer assigned to the site after layout finalization?',
      type: 'yesno',
    },
    {
      id: 'engineer_got_owner_info',
      question_mr: '   ओनर माहिती ला इंजिनिअर मिळाले का?',
      question_en: 'Did the engineer get the owner’s information?',
      type: 'yesno',
    },
    {
      id: 'shop_measurement_taken',
      question_mr: 'पूर्ण शॉपचे मोजमाप घेतले आहे का?',
      question_en: 'Has the complete shop measurement been taken?',
      type: 'yesno',
    },
  ],
  submit_button_mr: 'सबमिट करा',
  submit_button_en: 'Submit',
  navigation_buttons: {
    back_mr: 'मागे',
    back_en: 'Back',
    next_mr: 'पुढे',
    next_en: 'Next',
  },
};

 const validationMessages = {
    en: {
      answerRequired: "Please provide an answer to the question.",
      followupRequired: "Please provide a value for the follow-up question.",
      imageRequired: "Please upload at least one image or video.",
      checkboxRequired: "Please select at least one option.",
      inputRequired: 'Please specify details for "Other".',
      submitError: "Failed to submit the form. Please try again.",
      submitSuccess: "Form submitted successfully!",
      invalidDateFormat: "Please enter a valid date (YYYY-MM-DD)",
      invalidDate: "Please enter a valid date",
      pastDate: "Date cannot be in the past",
    },
    mr: {
      answerRequired: "कृपया प्रश्नाचे उत्तर द्या.",
      followupRequired: "कृपया फॉलो-अप प्रश्नासाठी मूल्य प्रदान करा.",
      imageRequired: "कृपया किमान एक प्रतिमा किंवा व्हिडिओ अपलोड करा.",
      checkboxRequired: "कृपया किमान एक पर्याय निवडा.",
      inputRequired: 'कृपया "इतर" साठी तपशील निर्दिष्ट करा.',
      submitError: "फॉर्म सबमिट करण्यात अयशस्वी. कृपया पुन्हा प्रयत्न करा.",
      submitSuccess: "फॉर्म यशस्वीपणे सबमिट झाला!",
      invalidDateFormat: "कृपया वैध तारीख प्रविष्ट करा (YYYY-MM-DD)",
      invalidDate: "कृपया वैध तारीख प्रविष्ट करा",
      pastDate: "तारीख भूतकाळातील असू शकत नाही",
    },
  };

  const InternalDeprmentWorkingQuestion = {
  formConfig,
  validationMessages,
 
  };

export default InternalDeprmentWorkingQuestion;

