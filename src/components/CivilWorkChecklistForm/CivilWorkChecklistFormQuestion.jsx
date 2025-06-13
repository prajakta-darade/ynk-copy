const equipmentConfig = {
  title_mr: 'सिव्हिल वर्क तपासणी यादी',
  title_en: 'Civil Work Checklist',
  submit_button_mr: 'सबमिट करा',
  submit_button_en: 'Submit',
  next_button_mr: 'पुढे',
  next_button_en: 'Next',
  back_button_mr: 'मागे',
  back_button_en: 'Back',
};

const questions = [
  { key: 'cctv_understood', question_mr: 'तुम्हाला वरील कामाची माहिती समजली का?', question_en: 'Do you understand the above work information?' },
  { key: 'internet_understood', question_mr: 'तुम्हाला वरील कामाची माहिती समजली का?', question_en: 'Do you understand the above work information?' },
  { key: 'speaker_understood', question_mr: 'तुम्हाला वरील कामाची माहिती समजली का?', question_en: 'Do you understand the above work information?' },
  { key: 'painting_understood', question_mr: 'तुम्हाला वरील कामाची माहिती समजली का?', question_en: 'Do you understand the above work information?' },
  { key: 'plumber_understood', question_mr: 'तुम्हाला वरील कामाची माहिती समजली का?', question_en: 'Do you understand the above work information?' },
  { key: 'electrician_switch_socket_understood', question_mr: 'तुम्हाला वरील कामाची माहिती समजली का?', question_en: 'Do you understand the above work information?' },
  { key: 'electrician_material_understood', question_mr: 'तुम्हाला वरील कामाची माहिती समजली का?', question_en: 'Do you understand the above work information?' },
  { key: 'electrician_wire_understood', question_mr: 'तुम्हाला वरील कामाची माहिती समजली का?', question_en: 'Do you understand the above work information?' },
  { key: 'pop_tiles_understood', question_mr: 'तुम्हाला वरील कामाची माहिती समजली का?', question_en: 'Do you understand the above work information?' },
  { key: 'gas_piping_understood', question_mr: 'तुम्हाला वरील कामाची माहिती समजली का?', question_en: 'Do you understand the above work information?' },
];

const tableData1 = [
  { item: 'CCTV', company: 'CP+ Only', specification: '1 Megapixel', qty: '-', },
  { item: 'Camera', company: 'CP+ Only', specification: 'Dome', qty: '3',  },
  { item: 'Camera', company: 'CP+ Only', specification: 'Bullet', qty: '1',  },
  { item: 'DVR', company: 'CP+ Only', specification: '4 Channel', qty: '1', },
  { item: 'Hard Disk', company: 'CP+ Only', specification: '500GB', qty: '1', },
  { item: 'SMPS (5 AMP)', company: 'CP+ Only', specification: '-', qty: '1', },
  { item: '2U Rack', company: 'CP+ Only', specification: '-', qty: '1',},
  { item: 'BNC', company: 'CP+ Only', specification: '-', qty: '8', },
  { item: 'DC Connector', company: '-', specification: '-', qty: '4',  },
  { item: 'CAT 6 Patch Cord', company: '-', specification: '-', qty: '1',},
];

const tableData2 = [
  { item: 'Internet', company: 'Any Local Brand', specification: 'Above 40 Mbps', qty: '1 Year',},
];

const tableData3 = [
  { item: 'Speaker + Amplifier', company: 'Any Local Brand', specification: 'Base-1, Speaker-4', qty: '1',  },
];

const tableData4 = [
  { item: 'Shutter', company: 'Asian', specification: 'Grey-0616 (Oil Paint)', qty: 'As Per Shop', },
  { item: 'Ceiling', company: 'Asian', specification: 'Grey-0616 (Oil Paint)', qty: 'As Per Shop',  },
  { item: 'Outside Wall', company: 'Asian', specification: 'Grey-0616 (Oil Paint)', qty: 'As Per Shop', },
  { item: 'Shutter Logo', company: 'Asian', specification: '36 inch x 36 inch Round (As Per Board Name Logo)', qty: '1', },
];

const tableData5 = [
  { item: 'Water Tank', company: 'Any Brand', specification: '1000 Litre', qty: '2', work: 'As Per Shop Layout' },
  { item: 'Sink Inlet', company: 'Paras, Prince, Plasto, or Any Brand', specification: '0.5 inch UPVC Pipe', qty: '-', work: 'As Per Shop, 43 inch Height From Floor' },
  { item: 'Sink Outlet', company: 'Paras, Prince, Plasto, or Any Brand', specification: '2.5 inch PVC Pipe', qty: '-', work: 'As Per Underground Drainage Line' },
  { item: 'Water Tap (Sink)', company: 'Paras, Prince, Plasto, or Any Brand', specification: 'Stainless Steel', qty: '1', work: '' },
  { item: 'Steamer Inlet', company: 'Paras, Prince, Plasto, or Any Brand', specification: '0.5 inch CPVC Pipe (Attach NRV Valve)', qty: '-', work: 'As Per Shop, 18 inch Height From Floor' },
  { item: 'Steamer Outlet', company: 'Paras, Prince, Plasto, or Any Brand', specification: '2.5 inch CPVC Pipe', qty: '-', work: 'As Per Underground Drainage Line' },
  { item: 'Steamer Tap', company: 'Paras, Prince, Plasto, or Any Brand', specification: 'Stainless Steel', qty: '1', work: '' },
];

const tableData6 = [
  { item: 'Meter', company: 'Any', specification: '3kg w/5kg w', qty: '1', work: '-' },
  { item: 'Shop Earthing', company: '-', specification: 'compulsory', qty: '1', work: '-' },
  { item: 'MCB Box', company: 'Anchor, Legrand (Colour-White)', specification: 'As per Shop Load', qty: '1', work: '-' },
  { item: 'All Points Control Board', company: 'Anchor, Legrand (Colour-White)', specification: '12 Model / 18 Model', qty: '2', work: '-' },
  { item: 'Fridge Elec-Point', company: 'Anchor, Legrand (Colour-White)', specification: '3 Model Board(16Amp)', qty: '2', work: 'As per Layout' },
  { item: 'Fryer Elec-Point', company: 'Anchor, Legrand (Colour-White)', specification: 'LCB Board (16Amp)', qty: '1', work: 'As per Layout' },
  { item: 'Heater Elec-Point', company: 'Anchor, Legrand (Colour-White)', specification: 'MCB Board (16Amp)', qty: '1', work: 'As per Layout' },
  { item: 'Work Table Elec-Point', company: 'Anchor, Legrand (Colour-White)', specification: '12 Model Board (16Amp)', qty: '4', work: 'As per Layout' },
  { item: 'Bill Machine + Printer', company: 'Anchor, Legrand (Colour-White)', specification: '8 Model Board (5Amp)', qty: '2', work: 'As per Layout' },
  { item: 'Speaker Amplifier + Wall Fan', company: 'Anchor, Legrand (Colour-White)', specification: '5Amp', qty: '2', work: 'As per Layout' },
  { item: 'Exhaust', company: 'Anchor, Legrand (Colour-White)', specification: '5Amp', qty: '1', work: 'As per Layout' },
  { item: 'CCTV', company: 'Anchor, Legrand (Colour-White)', specification: '5Amp', qty: '4', work: 'As per Layout' },
  { item: 'Menu Frame', company: 'Anchor, Legrand (Colour-White)', specification: '5Amp', qty: '2', work: 'As per Layout' },
  { item: 'Name Board', company: 'Anchor, Legrand (Colour-White)', specification: '16AMP Out Off Shop', qty: '5', work: '-' },
];

const tableData8 = [
  { item: 'Wall Fan', company: 'Crompton', specification: 'White Colour 16 inch', qty: '2', work: '' },
  { item: 'Exhaust Fan', company: 'Eco', specification: '15 inch Fan', qty: '1', work: '' },
  { item: '22W Board Ceiling Light', company: 'Any Brand Company', specification: 'Warm White Square', qty: 'As per Layout', work: '' },
  { item: '15W Shop Ceiling Light', company: 'Any Brand Company', specification: 'Warm White Square (Service Area)', qty: 'As per Layout', work: '' },
  { item: '15W Shop Ceiling Light', company: 'Any Brand Company', specification: 'Full White Square (Kitchen Area)', qty: 'As per Layout', work: '' },
  { item: '10W', company: 'Any Brand Company', specification: 'Warm White Round', qty: 'As per Layout', work: '' },
];

const tableData7 = [
  { item: 'Meter', company: 'Polycab, RR Kabel, KEI', specification: '4mm', qty: 'As per Shop', work: 'As per Layout' },
  { item: 'Shop Earthing', company: 'Polycab, RR Kabel, KEI', specification: '2.5mm', qty: 'As per Shop', work: 'As per Layout' },
  { item: 'Power Points (MCB/LCB)', company: 'Polycab, RR Kabel, KEI', specification: '2.5mm', qty: 'As per Shop', work: 'As per Layout' },
  { item: 'Power Points 16Amp', company: 'Polycab, RR Kabel, KEI', specification: '2.5mm', qty: 'As per Shop', work: 'As per Layout' },
  { item: 'Half Points 5Amp', company: 'Polycab, RR Kabel, KEI', specification: '1.5mm', qty: 'As per Shop', work: 'As per Layout' },
  { item: 'Name Board 16Amp', company: 'Polycab, RR Kabel, KEI', specification: '2.5mm', qty: 'As per Shop', work: 'As per Layout' },
  { item: 'All Ceiling Light', company: 'Polycab, RR Kabel, KEI', specification: '1mm', qty: 'As per Shop', work: 'As per Layout' },
  { item: 'Speaker Amplifier', company: 'Polycab, RR Kabel, KEI', specification: '-', qty: 'As per Shop', work: 'As per Layout' },
  { item: 'CCTV', company: 'Polycab, RR Kabel, KEI', specification: '4+1', qty: 'As per Shop', work: 'As per Layout' },
];

const tableData9 = [
  { item: 'POP Tiles', company: 'Any Reputed Brand', specification: '2x2 ft, White', qty: 'As Per Shop', work: 'As Per Shop Layout' },
  { item: 'Adhesive', company: 'Any Reputed Brand', specification: 'Tile Adhesive', qty: 'As Per Shop', work: 'As Per Shop Layout' },
  { item: 'Grout', company: 'Any Reputed Brand', specification: 'White', qty: 'As Per Shop', work: 'As Per Shop Layout' },
];

const tableData10 = [
  { item: 'Gas Piping', company: 'Any Reputed Brand', specification: '0.5 inch Copper Pipe', qty: 'As Per Shop', work: 'As Per Kitchen Layout' },
  { item: 'Regulator', company: 'Any Reputed Brand', specification: 'Standard', qty: '1', work: 'As Per Kitchen Layout' },
  { item: 'Gas Valve', company: 'Any Reputed Brand', specification: 'Brass', qty: '2', work: 'As Per Kitchen Layout' },
];

const config = {
  en: {
    title1: 'CCTV Installation',
    title2: 'Internet Setup',
    title3: 'Speaker and Amplifier Setup',
    title4: 'Painting Work',
    title5: 'Plumber Labour Work',
    title6: 'Electrician Work - Switch + Socket',
    title7: 'Electrician Work - Electrical Material',
    title8: 'Electrician Work - Wire',
    title9: 'POP Tiles Work',
    title10: 'Gas Piping',
    tableHeaders: ['Item', 'Company', 'Specification', 'Qty', 'Work'],
  },
  mr: {
    title1: 'सीसीटीव्ही स्थापना',
    title2: 'इंटरनेट सेटअप',
    title3: 'स्पीकर आणि ॲम्प्लिफायर सेटअप',
    title4: 'पेंटिंग काम',
    title5: 'प्लंबर काम',
    title6: 'इलेक्ट्रिशियन काम - स्विच + सॉकेट',
    title7: 'इलेक्ट्रिशियन काम - इलेक्ट्रिकल मटेरियल',
    title8: 'इलेक्ट्रिशियन काम - वायर',
    title9: 'पीओपी टाइल्स काम',
    title10: 'गॅस पाइपिंग',
    tableHeaders: ['आयटम', 'कंपनी', 'विशिष्टता', 'प्रमाण', 'काम'],
  },
};

const CivilWorkChecklistFormQuestion = {
  equipmentConfig,
  questions,
  tableData1,
  tableData2,
  tableData3,
  tableData4,
  tableData5,
  tableData6,
  tableData7,
  tableData8,
  tableData9,
  tableData10,
  config,
};

export default CivilWorkChecklistFormQuestion;