const formConfig = {
  id: 'shop_setup_checklist',
  title_mr: 'दुकान सेटअप तपासणी यादी',
  title_en: 'Shop Setup Checklist',
  submission_message_mr: 'तुमचा फॉर्म यशस्वीपणे सबमिट झाला आहे!\nआम्ही लवकरच तुमच्याशी संपर्क साधू.',
  submission_message_en: 'Your form has been successfully submitted!\nWe will contact you soon.',
  fields: [
    {
      "id": "shop_possession",
      "question_mr": "शॉप चा ताबा आपल्याकडे आला आहे का,आपल्याला मिळाला आहे का?",
      "question_en": "Has the possession of the shop been received?",
      "type": "yesno",
      "required": true,
      "followup": {
        "yes": {
          "message_mr": "शॉप ताबा मिळाला आहे.",
          "message_en": "Shop possession has been received."
        },
        "no": {
          "message_mr": "नाही भेटला अजून.",
          "message_en": "Shop possession has not yet been received.",
          "fields": [
            {
              "id": "possession_days",
              "question_mr": "किती दिवसामध्ये ताबा भेटणार आहे ?",
              "question_en": "In how many days will possession be received?",
              "type": "radio",
              "required": true,
              "options": [
                { "value": "2-4_days", "label_mr": "2-4 दिवस", "label_en": "2-4 days" },
                { "value": "one_week", "label_mr": "एक आठवडा", "label_en": "One week" },
                { "value": "one_month", "label_mr": "एक महिना", "label_en": "One month" }
              ]
            },
            {
              "id": "call_again_date",
              "question_mr": "पुन्हा फोन किती तारखेला करू?",
              "question_en": "On which date should I call again?",
              "type": "radio",
              "required": true,
              "options": [
                {
                  "value": "specific_date",
                  "label_mr": "या तारखेला फोन करा",
                  "label_en": "Call on this date",
                  "followup": {
                    "fields": [
                      {
                        "id": "call_date",
                        "question_mr": "तारीख प्रविष्ट करा (YYYY-MM-DD)",
                        "question_en": "Enter date (YYYY-MM-DD)",
                        "type": "text",
                        "required": true,
                        "placeholder_mr": "उदा. 2025-06-10",
                        "placeholder_en": "e.g., 2025-06-10"
                      }
                    ]
                  }
                },
                {
                  "value": "after_possession",
                  "label_mr": " खाली झाल्यानंतर मी तुम्हाला फोन करतो.",
                  "label_en": "I’ll call you after possession."
                }
              ]
            }
          ]
        }
      }
    },
    {
      id: 'shop_vacant',
      question_mr: 'शॉप पूर्णपणे मोकळे आहे का?',
      question_en: 'Is the shop completely vacant?',
      type: 'yesno',
      required: true,
      followup: {
        yes: {
          message_mr: 'शॉप मोकळे आहे.',
          message_en: 'The shop is vacant.',
          fields: [
            {
              id: 'shop_photo',
              question_mr: 'शॉप संपूर्ण फोटो पाठवा',
              question_en: 'Send a complete photo of the shop',
              type: 'file',
              required: true,
            },
            {
              id: 'shop_video',
              question_mr: 'शॉप व्हिडिओ पाठवा',
              question_en: 'Send a video of the shop',
              type: 'file',
              required: true,
            },
          ],
        },
        no: {
          message_mr: 'शॉप नाही खाली झाले अजून.',
          message_en: 'The shop is not yet vacant.',
          fields: [
            {
              id: 'vacate_responsible',
              question_mr: ' कोण खाली करणार आहे?',
              question_en: 'Who will vacate the shop?',
              type: 'radio',
              required: true,
              options: [
                { value: 'shop_owner', label_mr: 'दुकान मालक', label_en: 'Shop owner' },
                { value: 'franchisee', label_mr: 'फ्रँचायझी धारक', label_en: 'Franchisee' },
                { value: 'other', label_mr: 'इतर', label_en: 'Other' },
              ],
            },
            {
              id: 'vacate_days',
              question_mr: 'किती दिवस लागतील खाली होण्यासाठी',
              question_en: 'How many days will it take to vacate?',
              type: 'radio',
              required: true,
              options: [
                { value: '2-4_days', label_mr: '2-4 दिवस', label_en: '2-4 days' },
                { value: 'one_week', label_mr: 'एक आठवडा', label_en: 'One week' },
                { value: 'one_month', label_mr: 'एक महिना', label_en: 'One month' },
              ],
            },
            {
              id: 'call_again_vacate',
              question_mr: 'पुन्हा फोन कधी करू?',
              question_en: 'When should we call again?',
              type: 'radio',
              required: true,
              options: [
                {
                  value: 'specific_date',
                  label_mr: 'या तारखेला फोन करा',
                  label_en: 'Call on this date',
                  followup: {
                    fields: [
                      {
                        id: 'vacate_call_date',
                        question_mr: 'तारीख प्रविष्ट करा (YYYY-MM-DD)',
                        question_en: 'Enter date (YYYY-MM-DD)',
                        type: 'text',
                        required: true,
                        placeholder_mr: 'उदा. 2025-06-10',
                        placeholder_en: 'e.g., 2025-06-10',
                      },
                    ],
                  },
                },
                {
                  value: 'after_vacant',
                  label_mr: ' खाली झाल्यानंतर मी तुम्हाला फोन करतो.',
                  label_en: 'I’ll call you after it’s vacant.',
                },
              ],
            },
          ],
        },
      },
    },
    {
      id: 'shutter_size',
      question_mr: 'शॉप चा शटर किती फूट आहे?',
      question_en: 'What is the size of the shop shutter?',
      type: 'radio',
      required: true,
      options: [
        { value: '6ft', label_mr: '6 फूट', label_en: '6 ft.' },
        { value: '8ft', label_mr: '8 फूट', label_en: '8 ft.' },
        { value: '10ft', label_mr: '10 फूट', label_en: '10 ft.' },
        { value: '12ft', label_mr: '12 फूट', label_en: '12 ft.' },
      ],
    },
    {
      id: 'electrical_supply',
      question_mr: 'शॉप वीज पुरवठा आहे का?',
      question_en: 'Does the shop have electrical supply?',
      type: 'yesno',
      required: true,
      followup: {
        yes: {
          message_mr: 'शॉप वीज पुरवठा आहे.',
          message_en: 'The shop has electrical supply.',
          fields: [
            {
              id: 'light_photo',
              question_mr: 'शॉप लाइट चालू असल्याचा फोटो पाठवा',
              question_en: 'Send a photo of the lights on in the shop',
              type: 'file',
              required: true,
            },
            {
              id: 'meter_box_photo',
              question_mr: 'मीटर बॉक्सचा फोटो पाठवा',
              question_en: 'Send a photo of the meter box',
              type: 'file',
              required: true,
            },
            {
              id: 'mcb_box_photo',
              question_mr: 'MCB बॉक्सचा फोटो पाठवा',
              question_en: 'Send a photo of the MCB box',
              type: 'file',
              required: true,
            },
          ],
        },
        no: {
          message_mr: 'शॉप वीज पुरवठा नाही.',
          message_en: 'The shop does not have electrical supply.',
          fields: [
            {
              id: 'electrical_responsible',
              question_mr: 'वीज पुरवठा कोण घेऊन देणार आहे?',
              question_en: 'Who will provide the electrical supply?',
              type: 'radio',
              required: true,
              options: [
                { value: 'shop_owner', label_mr: 'दुकान मालक', label_en: 'Shop owner' },
                { value: 'franchisee', label_mr: 'फ्रँचायझी धारक', label_en: 'Franchisee' },
                { value: 'other', label_mr: 'इतर', label_en: 'Other' },
              ],
            },
          ],
        },
      },
    },
    {
      id: 'drainage_connectivity',
      question_mr: 'शॉप ड्रेनेज कनेक्टिव्हिटी आहे का?',
      question_en: 'Does the shop have drainage connectivity?',
      type: 'yesno',
      required: true,
      followup: {
        yes: {
          message_mr: 'शॉप ड्रेनेज कनेक्टिव्हिटी आहे.',
          message_en: 'The shop has drainage connectivity.',
          fields: [
            {
              id: 'drainage_photo',
              question_mr: 'ड्रेनेज चालू असल्याचा फोटो पाठवा',
              question_en: 'Send a photo of the drainage working in the shop',
              type: 'file',
              required: true,
            },
          ],
        },
        no: {
          message_mr: 'शॉप ड्रेनेज कनेक्टिव्हिटी नाही.',
          message_en: 'The shop does not have drainage connectivity.',
          fields: [
            {
              id: 'drainage_responsible',
              question_mr: 'ड्रेनेज कनेक्टिव्हिटी कोण घेऊन देणार आहे?',
              question_en: 'Who will provide the drainage connectivity?',
              type: 'radio',
              required: true,
              options: [
                { value: 'shop_owner', label_mr: 'दुकान मालक', label_en: 'Shop owner' },
                { value: 'franchisee', label_mr: 'फ्रँचायझी धारक', label_en: 'Franchisee' },
                { value: 'other', label_mr: 'इतर', label_en: 'Other' },
              ],
            },
          ],
        },
      },
    },
    {
      id: 'water_connectivity',
      question_mr: 'शॉप पाण्याची कनेक्टिव्हिटी आहे का?',
      question_en: 'Does the shop have water connectivity?',
      type: 'yesno',
      required: true,
      followup: {
        yes: {
          message_mr: 'शॉप पाण्याची कनेक्टिव्हिटी आहे.',
          message_en: 'The shop has water connectivity.',
          fields: [
            {
              id: 'water_photo',
              question_mr: 'पाण्याची कनेक्टिव्हिटी दर्शवणारा फोटो पाठवा',
              question_en: 'Send a photo of the water connectivity',
              type: 'file',
              required: true,
            },
            {
              id: 'water_video',
              question_mr: 'नळाला पाणी चालू असल्याचा व्हिडिओ पाठवा',
              question_en: 'Send a video of water running from the tap in the shop',
              type: 'file',
              required: true,
            },
          ],
        },
        no: {
          message_mr: 'शॉप पाण्याची कनेक्टिव्हिटी नाही.',
          message_en: 'The shop does not have water connectivity.',
          fields: [
            {
              id: 'water_responsible',
              question_mr: 'पाण्याची कनेक्टिव्हिटी कोण घेऊन देणार आहे?',
              question_en: 'Who will provide the water connectivity?',
              type: 'radio',
              required: true,
              options: [
                { value: 'shop_owner', label_mr: 'दुकान मालक', label_en: 'Shop owner' },
                { value: 'franchisee', label_mr: 'फ्रँचायझी धारक', label_en: 'Franchisee' },
                { value: 'other', label_mr: 'इतर', label_en: 'Other' },
              ],
            },
          ],
        },
      },
    },
    {
      id: 'earthing_connectivity',
      question_mr: 'शॉप अर्थिंग कनेक्टिव्हिटी आहे का?',
      question_en: 'Does the shop have earthing connectivity?',
      type: 'yesno',
      required: true,
      followup: {
        yes: {
          message_mr: 'शॉप अर्थिंग कनेक्टिव्हिटी आहे.',
          message_en: 'The shop has earthing connectivity.',
          fields: [
            {
              id: 'earthing_photo',
              question_mr: 'अर्थिंगचा फोटो पाठवा',
              question_en: 'Send a photo of the earthing connectivity',
              type: 'file',
              required: true,
            },
            {
              id: 'earthing_mcb_box',
              question_mr: 'MCB बॉक्सचा फोटो पाठवा',
              question_en: 'Send a photo of the MCB box',
              type: 'file',
              required: true,
            },
          ],
        },
        no: {
          message_mr: 'शॉप अर्थिंग कनेक्टिव्हिटी नाही.',
          message_en: 'The shop does not have earthing connectivity.',
          fields: [
            {
              id: 'earthing_responsible',
              question_mr: 'अर्थिंग कनेक्टिव्हिटी कोण घेऊन देणार आहे?',
              question_en: 'Who will provide the earthing connectivity?',
              type: 'radio',
              required: true,
              options: [
                { value: 'shop_owner', label_mr: 'दुकान मालक', label_en: 'Shop owner' },
                { value: 'franchisee', label_mr: 'फ्रँचायझी धारक', label_en: 'Franchisee' },
                { value: 'other', label_mr: 'इतर', label_en: 'Other' },
              ],
            },
          ],
        },
      },
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

// Validation messages (unchanged)
const validationMessages = {
  en: {
    answerRequired: 'Please provide an answer to the question.',
    followupRequired: 'Please provide a value for the follow-up question.',
    imageRequired: 'Please upload at least one image or video.',
    checkboxRequired: 'Please select at least one option.',
    inputRequired: 'Please specify details for "Other".',
    submitError: 'Failed to submit the form. Please try again.',
    submitSuccess: 'Form submitted successfully!',
    invalidDateFormat: 'Please enter a valid date (YYYY-MM-DD)',
    invalidDate: 'Please enter a valid date',
    pastDate: 'Date cannot be in the past',
  },
  mr: {
    answerRequired: 'कृपया प्रश्नाचे उत्तर द्या.',
    followupRequired: 'कृपया फॉलो-अप प्रश्नासाठी मूल्य प्रदान करा.',
    imageRequired: 'कृपया किमान एक प्रतिमा किंवा व्हिडिओ अपलोड करा.',
    checkboxRequired: 'कृपया किमान एक पर्याय निवडा.',
    inputRequired: 'कृपया "इतर" साठी तपशील निर्दिष्ट करा.',
    submitError: 'फॉर्म सबमिट करण्यात अयशस्वी. कृपया पुन्हा प्रयत्न करा.',
    submitSuccess: 'फॉर्म यशस्वीपणे सबमिट झाला!',
    invalidDateFormat: 'कृपया वैध तारीख प्रविष्ट करा (YYYY-MM-DD)',
    invalidDate: 'कृपया वैध तारीख प्रविष्ट करा',
    pastDate: 'तारीख भूतकाळातील असू शकत नाही',
  },
};


const ShopSetupChecklistFormQuestion =
{
  formConfig,
  validationMessages
}


export default ShopSetupChecklistFormQuestion;