
const ShopMeasurementsFormQuestion = {
  id: 'shop_measurements_form',
  title_mr: 'शॉप मोजमाप फॉर्म',
  title_en: 'Shop Measurements Form',
  fields: [
    {
      id: 'shop_shutter_size',
      question_mr: 'शॉप शटर साइज काय आहे?',
      question_en: 'What is the shop shutter size?',
      type: 'measurement',
      subfields: [
        { id: 'length', label_mr: 'लांबी (फूट)', label_en: 'Length (ft)', value: 10 },
            { id: 'height', label_mr: 'उंची (फूट)', label_en: 'Height (ft)', value: 1 },
            { id: 'total_sqft', label_mr: 'एकूण चौरस फूट', label_en: 'Total sq ft', value: 90 }
      ]
    },
    {
      id: 'flooring_size',
      question_mr: 'फ्लोरिंग साइज घेणे',
      question_en: 'Flooring Size',
      type: 'measurement',
      subfields: [
        { id: 'length', label_mr: 'लांबी (फूट)', label_en: 'Length (ft)', value: 10 },
            { id: 'height', label_mr: 'उंची (फूट)', label_en: 'Height (ft)', value: 1 },
            { id: 'total_sqft', label_mr: 'एकूण चौरस फूट', label_en: 'Total sq ft', value: 90 },
        {
          id: 'left_wall',
          label_mr: 'डाव्या बाजूची भिंत',
          label_en: 'Left Wall',
          type: 'measurement',
          subfields: [
            { id: 'length', label_mr: 'लांबी (फूट)', label_en: 'Length (ft)', value: 15 },
            { id: 'height', label_mr: 'उंची (फूट)', label_en: 'Height (ft)', value: 1 },
            { id: 'total_sqft', label_mr: 'एकूण चौरस फूट', label_en: 'Total sq ft', value: 90 }
          ]
        },
        {
          id: 'right_wall',
          label_mr: 'उजव्या बाजूची भिंत',
          label_en: 'Right Wall',
          type: 'measurement',
          subfields: [
            { id: 'length', label_mr: 'लांबी (फूट)', label_en: 'Length (ft)', value: 15 },
            { id: 'height', label_mr: 'उंची (फूट)', label_en: 'Height (ft)', value: 1 },
            { id: 'total_sqft', label_mr: 'एकूण चौरस फूट', label_en: 'Total sq ft', value: 200 }
          ]
        },
        {
          id: 'back_wall',
          label_mr: 'पाठीमागील भिंत',
          label_en: 'Back Wall',
          type: 'measurement',
          subfields: [
            { id: 'length', label_mr: 'लांबी (फूट)', label_en: 'Length (ft)', value: 15 },
            { id: 'height', label_mr: 'उंची (फूट)', label_en: 'Height (ft)', value: 1 },
            { id: 'total_sqft', label_mr: 'एकूण चौरस फूट', label_en: 'Total sq ft', value: 50 }
          ]
        },
        {
          id: 'wall_heights',
          label_mr: 'भिंतींची उंची',
          label_en: 'Wall Heights',
          type: 'measurement',
          subfields: [
            { id: 'length', label_mr: 'लांबी (फूट)', label_en: 'Length (ft)', value: 15 },
            { id: 'height', label_mr: 'उंची (फूट)', label_en: 'Height (ft)', value: 1 },
            { id: 'total_sqft', label_mr: 'एकूण चौरस फूट', label_en: 'Total sq ft', value: 50 }
          ]
        },
        {
          id: 'wall_total_sqft',
          label_mr: 'भिंतींचे एकूण चौरस फूट',
          label_en: 'Wall Total sq ft',
          type: 'measurement',
          subfields: [
             { id: 'length', label_mr: 'लांबी (फूट)', label_en: 'Length (ft)', value: 15 },
            { id: 'height', label_mr: 'उंची (फूट)', label_en: 'Height (ft)', value: 1 },
            { id: 'total_sqft', label_mr: 'एकूण चौरस फूट', label_en: 'Total sq ft', value: 50 }
          ]
        }
      ]
    },
    {
      id: 'pop_size',
      question_mr: 'शॉप pop साइज घेणे',
      question_en: 'Shop POP Size',
      type: 'measurement',
      subfields: [
        { id: 'length', label_mr: 'लांबी (फूट)', label_en: 'Length (ft)', value: 15 },
            { id: 'height', label_mr: 'उंची (फूट)', label_en: 'Height (ft)', value: 1 },
            { id: 'total_sqft', label_mr: 'एकूण चौरस फूट', label_en: 'Total sq ft', value: 50 }
      ]
    },
    {
      id: 'ceiling_size',
      question_mr: 'शॉप सीव्हिलिंग',
      question_en: 'Shop Ceiling',
      type: 'measurement',
      subfields: [
         { id: 'length', label_mr: 'लांबी (फूट)', label_en: 'Length (ft)', value: 15 },
            { id: 'height', label_mr: 'उंची (फूट)', label_en: 'Height (ft)', value: 1 },
            { id: 'total_sqft', label_mr: 'एकूण चौरस फूट', label_en: 'Total sq ft', value: 50 }
      ]
    },
    {
      id: 'shutter_size_2',
      question_mr: 'शॉप शटर',
      question_en: 'Shop Shutter',
      type: 'measurement',
      subfields: [
         { id: 'length', label_mr: 'लांबी (फूट)', label_en: 'Length (ft)', value: 15 },
            { id: 'height', label_mr: 'उंची (फूट)', label_en: 'Height (ft)', value: 1 },
            { id: 'total_sqft', label_mr: 'एकूण चौरस फूट', label_en: 'Total sq ft', value: 50 }
      ]
    },
    {
      id: ' Extra Color Work',
      question_mr: 'एक्स्ट्रा कलर वर्क',
      question_en: 'Extra Electrical',
      type: 'measurement',
      subfields: [
        { id: 'length', label_mr: 'लांबी (फूट)', label_en: 'Length (ft)', value: 1 },
        { id: 'height', label_mr: 'उंची (फूट)', label_en: 'Height (ft)', value: 1 },
        { id: 'total_sqft', label_mr: 'एकूण चौरस फूट', label_en: 'Total sq ft', value: 1 }
      ]
    },
    {
      id: 'main_board_letter_size',
      question_mr: 'मेन बोर्ड लेटर साइज घेणे',
      question_en: 'Main Board Letter Size',
      type: 'measurement',
      subfields: [
      { id: 'length', label_mr: 'लांबी (फूट)', label_en: 'Length (ft)', value: 10 },
            { id: 'height', label_mr: 'उंची (फूट)', label_en: 'Height (ft)', value: 1 },
            { id: 'total_sqft', label_mr: 'एकूण चौरस फूट', label_en: 'Total sq ft', value: 90 }
      ]
    },
    {
      id: 'main_board_acp_panel',
      question_mr: 'मेन बोर्ड acp पॅनल साइझ (board)',
      question_en: 'Main Board ACP Panel Size (board)',
      type: 'measurement',
      subfields: [
        { id: 'length', label_mr: 'लांबी (फूट)', label_en: 'Length (ft)', value: 5 },
        {
          id: 'heights',
          label_mr: 'उंची',
          label_en: 'Heights',
          type: 'measurement',
          subfields: [
            { id: 'height_1', label_mr: '', label_en: 'He', value: 1 },
          
          ]
        },
        {
          id: 'total_sqft',
          label_mr: 'एकूण चौरस फूट',
          label_en: 'Total sq ft',
          type: 'measurement',
          subfields: [
           
            { id: 'total_sqft_6', label_mr: '', label_en: ' ', value: 50 }
          ]
        }
      ]
    },
    {
      id: 'ceiling_details',
      question_mr: 'ceiling',
      question_en: 'Ceiling Details',
      type: 'measurement',
      subfields: [
        { id: 'length', label_mr: 'लांबी (फूट)', label_en: 'Length (ft)', value: 1 },
        { id: 'top_side_length', label_mr: 'वरची बाजू लांबी (फूट)', label_en: 'Top Side Length (ft)', value: 1 },
        { id: 'left_right_sides_length', label_mr: 'डावी आणि उजवी बाजू लांबी (फूट)', label_en: 'Left and Right Two Sides Length (ft)', value: 1 },
        { id: 'canopy_length', label_mr: 'कॅनोपी लांबी (फूट)', label_en: 'Canopy Length (ft)', value: 1 },
        { id: 'back_side_length', label_mr: 'मागची बाजू लांबी (फूट)', label_en: 'Back Side Length (ft)', value: 1 },
        { id: 'shop_partition_length', label_mr: 'शॉप पार्टिशन लांबी (फूट)', label_en: 'Shop Partition Length (ft)', value: 1 },
        {
          id: 'heights',
          label_mr: 'उंची',
          label_en: 'Heights',
          type: 'measurement',
          subfields: [
           
            { id: 'height_6', label_mr: '', label_en: '', value: 1 }
          ]
        },
        {
          id: 'total_sqft',
          label_mr: 'एकूण चौरस फूट',
          label_en: 'Total sq ft',
          type: 'measurement',
          subfields: [
            
            { id: 'total_sqft_6', label_mr: '', label_en: '', value: 1 }
          ]
        }
      ]
    },
    {
      id: 'potmala_partition',
      question_mr: 'potmala partition',
      question_en: 'Potmala Partition',
      type: 'measurement',
      subfields: [
        { id: 'length', label_mr: 'लांबी (फूट)', label_en: 'Length (ft)', value: 1 },
        { id: 'height', label_mr: 'उंची (फूट)', label_en: 'Height (ft)', value: 1 },
        { id: 'total_sqft', label_mr: 'एकूण चौरस फूट', label_en: 'Total sq ft', value: 1 }
      ]
    },
    {
      id: 'other_partition',
      question_mr: 'other partition',
      question_en: 'Other Partition',
      type: 'measurement',
      subfields: [
        { id: 'length', label_mr: 'लांबी (फूट)', label_en: 'Length (ft)', value: 1 },
        { id: 'height', label_mr: 'उंची (फूट)', label_en: 'Height (ft)', value: 1 },
        { id: 'total_sqft', label_mr: 'एकूण चौरस फूट', label_en: 'Total sq ft', value: 1 }
      ]
    },
    {
      id: 'shutter_patta',
      question_mr: 'shutter patta',
      question_en: 'Shutter Patta',
      type: 'measurement',
      subfields: [
        { id: 'length', label_mr: 'लांबी (फूट)', label_en: 'Length (ft)', value: 1 },
        { id: 'height', label_mr: 'उंची (फूट)', label_en: 'Height (ft)', value: 1 },
        { id: 'total_sqft', label_mr: 'एकूण चौरस फूट', label_en: 'Total sq ft', value: 1 }
      ]
    }
  ],
  submit_button_mr: 'सबमिट करा',
  submit_button_en: 'Submit',
  navigation_buttons: {
    back_mr: 'मागे',
    back_en: 'Back',
    next_mr: 'पुढे',
    next_en: 'Next'
  },
  submission_message_mr: `
सर आपले खूप खूप धन्यवाद की आपण वरील पूर्ण माहिती आम्हाला दिली आहे आम्ही तुम्हाला प्रोजेक्ट साठी लागणार.
  `,
  submission_message_en: `
Thank you very much, sir, for providing us with all the above information. We will use it for your project.
  `
};
export default ShopMeasurementsFormQuestion;