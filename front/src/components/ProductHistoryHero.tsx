'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/hooks/useTranslation';

interface Product {
  year: string;
  name: string;
  description: string;
  images: string[];
}

interface YearData {
  [key: string]: Product[];
}

// Helper function to get the correct decade folder
const getDecadeFolder = (year: string): string => {
  switch (year) {
    case '1950s': return '1950-1960s';
    case '1970s': return '1970s';
    case '1980s': return '1980s';
    case '1990s': return '1990s';
    case '2000s': return '2000s';
    case '2010s': return '2010s';
    case '2020s': return '2020s';
    default: return '1970s';
  }
};

const productData: YearData = {
  '1950s': [
    {
      year: '1955',
      name: 'HDH Passenger Bus (41 Seats)',
      description: '130 horsepower / Gasoline',
      images: ['img-product-1960-1.jpg']
    },
    {
      year: '1963',
      name: 'MS60 Micro Bus (16 Seats)',
      description: '75 horsepower / Gasoline',
      images: ['img-product-1960-2.jpg']
    },
    {
      year: '1964',
      name: 'MS60 Micro Bus (20 Seats)',
      description: '75 horsepower / Gasoline',
      images: ['img-product-1960-3.jpg']
    },
    {
      year: '1965',
      name: 'D64 Passenger Bus (37 Seats)',
      description: '130 horsepower / Gasoline',
      images: ['img-product-1960-4.jpg']
    },
    {
      year: '1965',
      name: 'A60 Urban Bus (70 Seats)',
      description: '130 horsepower / Gasoline',
      images: ['img-product-1960-5.jpg']
    },
    {
      year: '1966',
      name: 'R66 Brunei Export Model Bus',
      description: '150 horsepower / Diesel',
      images: ['img-product-1960-6.jpg']
    },
    {
      year: '1966',
      name: 'A66 Passenger Bus (41 Seats)',
      description: '130 horsepower / Gasoline',
      images: ['img-product-1960-7.jpg']
    },
    {
      year: '1966',
      name: 'MS62 Micro Bus (18 Seats)',
      description: '90 horsepower / Gasoline',
      images: ['img-product-1960-8.jpg']
    },
    {
      year: '1967',
      name: 'CC662 Passenger Bus (39 Seats)',
      description: '130 horsepower / Gasoline',
      images: ['img-product-1960-9.jpg']
    },
    {
      year: '1967',
      name: 'V67 Vietnam Export Model Bus',
      description: '150 horsepower / Diesel',
      images: ['img-product-1960-10.jpg']
    },
    {
      year: '1968',
      name: 'CF66 Passenger Bus (55 Seats)',
      description: '130 horsepower / Gasoline',
      images: ['img-product-1960-11.jpg']
    },
    {
      year: '1968',
      name: 'Post Office Bus (5 Seats)',
      description: '130 horsepower / Gasoline',
      images: ['img-product-1960-12.jpg']
    },
    {
      year: '1968',
      name: 'Bank Bus (6 Seats)',
      description: '130 horsepower / Gasoline',
      images: ['img-product-1960-13.jpg']
    },
    {
      year: '1968',
      name: 'Air Cargo Bus (6 Seats)',
      description: '130 horsepower / Gasoline',
      images: ['img-product-1960-14.jpg']
    },
    {
      year: '1969',
      name: 'Sewage Truck (6 Ton)',
      description: '135 horsepower / Diesel',
      images: ['img-product-1960-15.jpg']
    },
    {
      year: '1969',
      name: 'FB100LK Passenger Bus (51 Seats)',
      description: '145 horsepower / Gasoline',
      images: ['img-product-1960-16.jpg']
    },
    {
      year: '1969',
      name: 'Civilian Jeep',
      description: 'Joint Venture with Kaiser Corporation (USA)',
      images: ['img-product-1960-17.jpg']
    }
  ],
  '1970s': [
    {
      year: '1970',
      name: 'Garbage Truck (6 Ton)',
      description: '135 horsepower / Diesel',
      images: ['img-product-1970-1.jpg']
    },
    {
      year: '1970',
      name: 'Surgical Bus (6 Seats)',
      description: '155 horsepower / Gasoline',
      images: ['img-product-1970-2.jpg']
    },
    {
      year: '1970',
      name: 'Blood Donation Bus (6 Seats)',
      description: '155 horsepower / Gasoline',
      images: ['img-product-1970-3.jpg']
    },
    {
      year: '1970',
      name: 'DB102LC Passenger Bus (38 Seats)',
      description: '130 horsepower / Diesel',
      images: ['img-product-1970-4.jpg']
    },
    {
      year: '1971',
      name: 'FB100LK Passenger Bus (51 Seats)',
      description: '145 horsepower / Gasoline',
      images: ['img-product-1970-5.jpg']
    },
    {
      year: '1971',
      name: 'FB100LK Passenger Bus (51 Seats)',
      description: '145 horsepower / Gasoline',
      images: ['img-product-1970-6.jpg']
    },
    {
      year: '1971',
      name: 'FB100LK Passenger Bus (51 Seats)',
      description: '145 horsepower / Gasoline',
      images: ['img-product-1970-7.jpg']
    },
    {
      year: '1971',
      name: 'FB100LK Passenger Bus (51 Seats)',
      description: '145 horsepower / Gasoline',
      images: ['img-product-1970-8.jpg']
    },
    {
      year: '1972',
      name: 'FB100LK Passenger Bus (51 Seats)',
      description: '145 horsepower / Gasoline',
      images: ['img-product-1970-9.jpg']
    },
    {
      year: '1972',
      name: 'FB100LK Passenger Bus (51 Seats)',
      description: '145 horsepower / Gasoline',
      images: ['img-product-1970-10.jpg']
    },
    {
      year: '1972',
      name: 'FB100LK Passenger Bus (51 Seats)',
      description: '145 horsepower / Gasoline',
      images: ['img-product-1970-11.jpg']
    },
    {
      year: '1972',
      name: 'FB100LK Passenger Bus (51 Seats)',
      description: '145 horsepower / Gasoline',
      images: ['img-product-1970-12.jpg']
    },
    {
      year: '1973',
      name: 'FB100LK Passenger Bus (51 Seats)',
      description: '145 horsepower / Gasoline',
      images: ['img-product-1970-13.jpg']
    },
    {
      year: '1973',
      name: 'FB100LK Passenger Bus (51 Seats)',
      description: '145 horsepower / Gasoline',
      images: ['img-product-1970-14.jpg']
    },
    {
      year: '1973',
      name: 'FB100LK Passenger Bus (51 Seats)',
      description: '145 horsepower / Gasoline',
      images: ['img-product-1970-15.jpg']
    },
    {
      year: '1973',
      name: 'FB100LK Passenger Bus (51 Seats)',
      description: '145 horsepower / Gasoline',
      images: ['img-product-1970-16.jpg']
    },
    {
      year: '1974',
      name: 'FB100LK Passenger Bus (51 Seats)',
      description: '145 horsepower / Gasoline',
      images: ['img-product-1970-17.jpg']
    },
    {
      year: '1974',
      name: 'FB100LK Passenger Bus (51 Seats)',
      description: '145 horsepower / Gasoline',
      images: ['img-product-1970-18.jpg']
    },
    {
      year: '1974',
      name: 'FB100LK Passenger Bus (51 Seats)',
      description: '145 horsepower / Gasoline',
      images: ['img-product-1970-19.jpg']
    },
    {
      year: '1974',
      name: 'FB100LK Passenger Bus (51 Seats)',
      description: '145 horsepower / Gasoline',
      images: ['img-product-1970-20.jpg']
    },
    {
      year: '1975',
      name: 'FB100LK Passenger Bus (51 Seats)',
      description: '145 horsepower / Gasoline',
      images: ['img-product-1970-21.jpg']
    },
    {
      year: '1975',
      name: 'FB100LK Passenger Bus (51 Seats)',
      description: '145 horsepower / Gasoline',
      images: ['img-product-1970-22.jpg']
    },
    {
      year: '1975',
      name: 'FB100LK Passenger Bus (51 Seats)',
      description: '145 horsepower / Gasoline',
      images: ['img-product-1970-23.jpg']
    },
    {
      year: '1975',
      name: 'FB100LK Passenger Bus (51 Seats)',
      description: '145 horsepower / Gasoline',
      images: ['img-product-1970-24.jpg']
    },
    {
      year: '1976',
      name: 'FB100LK Passenger Bus (51 Seats)',
      description: '145 horsepower / Gasoline',
      images: ['img-product-1970-25.jpg']
    },
    {
      year: '1976',
      name: 'FB100LK Passenger Bus (51 Seats)',
      description: '145 horsepower / Gasoline',
      images: ['img-product-1970-26.jpg']
    },
    {
      year: '1976',
      name: 'FB100LK Passenger Bus (51 Seats)',
      description: '145 horsepower / Gasoline',
      images: ['img-product-1970-27.jpg']
    },
    {
      year: '1976',
      name: 'FB100LK Passenger Bus (51 Seats)',
      description: '145 horsepower / Gasoline',
      images: ['img-product-1970-28.jpg']
    },
    {
      year: '1977',
      name: 'FB100LK Passenger Bus (51 Seats)',
      description: '145 horsepower / Gasoline',
      images: ['img-product-1970-29.jpg']
    },
    {
      year: '1977',
      name: 'FB100LK Passenger Bus (51 Seats)',
      description: '145 horsepower / Gasoline',
      images: ['img-product-1970-30.jpg']
    },
    {
      year: '1977',
      name: 'FB100LK Passenger Bus (51 Seats)',
      description: '145 horsepower / Gasoline',
      images: ['img-product-1970-31.jpg']
    },
    {
      year: '1971',
      name: 'Garbage Truck (4 Ton)',
      description: '135 horsepower / Diesel',
      images: ['img-product-1970-5.jpg']
    },
    {
      year: '1972',
      name: 'Light Bus (25 Seats)',
      description: '106 horsepower / Gasoline',
      images: ['img-product-1970-6.jpg']
    },
    {
      year: '1972',
      name: 'Tanker Truck (3 Ton)',
      description: '180 horsepower / Diesel',
      images: ['img-product-1970-7.jpg']
    },
    {
      year: '1974',
      name: 'Jeep CJ5 (2/3/4/12 Seats)',
      description: 'Canvas Top/Hard top/Wagon/Van',
      images: ['img-product-1970-8.jpg']
    },
    {
      year: '1974',
      name: 'Jeep CJ5P (Pickup)',
      description: 'Joint Venture with AMC Corporation (USA)',
      images: ['img-product-1970-9.jpg']
    },
    {
      year: '1975',
      name: 'AU400 Mixer Truck',
      description: '135 horsepower / Diesel',
      images: ['img-product-1970-10.jpg']
    },
    {
      year: '1975',
      name: 'Tanker Truck (10,000 litres)',
      description: '160 horsepower / Diesel',
      images: ['img-product-1970-11.jpg']
    },
    {
      year: '1976',
      name: 'Fire Truck with Pump (4,000 litres)',
      description: '160 horsepower / Diesel',
      images: ['img-product-1970-12.jpg']
    },
    {
      year: '1976',
      name: 'Chemical Fire Truck (3,000 litres)',
      description: '160 horsepower / Diesel',
      images: ['img-product-1970-13.jpg']
    },
    {
      year: '1976',
      name: 'AU600 Mixer Truck',
      description: '160 horsepower / Diesel',
      images: ['img-product-1970-14.jpg']
    },
    {
      year: '1977',
      name: 'CW50PH Bulk Truck',
      description: '240 horsepower / Diesel',
      images: ['img-product-1970-15.jpg']
    },
    {
      year: '1977',
      name: 'Mini Fire Truck (1,000 litres)',
      description: '85 horsepower / Diesel',
      images: ['img-product-1970-16.jpg']
    },
    {
      year: '1978',
      name: 'Fire Truck with Ladder (16M)',
      description: '135 horsepower / Diesel',
      images: ['img-product-1970-17.jpg']
    },
    {
      year: '1978',
      name: 'Fire Truck with Ladder (16M)',
      description: '160 horsepower / Diesel',
      images: ['img-product-1970-18.jpg']
    },
    {
      year: '1978',
      name: 'Water Tank Pump Truck (4,000 litres)',
      description: '135 horsepower / Diesel',
      images: ['img-product-1970-19.jpg']
    },
    {
      year: '1978',
      name: 'Chemical Fire Truck (3,000 litres)',
      description: '135 horsepower / Diesel',
      images: ['img-product-1970-20.jpg']
    },
    {
      year: '1978',
      name: 'CK50CT Trailer Truck (32 Ton)',
      description: '300 horsepower / Diesel',
      images: ['img-product-1970-21.jpg']
    },
    {
      year: '1978',
      name: 'TW50HT Trailer Truck (42 Ton)',
      description: '300 horsepower / Diesel',
      images: ['img-product-1970-22.jpg']
    },
    {
      year: '1978',
      name: 'CW50GT Trailer Truck (53 Ton)',
      description: '300 horsepower / Diesel',
      images: ['img-product-1970-23.jpg']
    },
    {
      year: '1978',
      name: 'TZ50HT Trailer Truck (55 Ton)',
      description: '300 horsepower / Diesel',
      images: ['img-product-1970-24.jpg']
    },
    {
      year: '1978',
      name: 'CW50HM Mixer Truck',
      description: '300 horsepower / Diesel',
      images: ['img-product-1970-25.jpg']
    },
    {
      year: '1978',
      name: 'Garbage Truck (6 Ton)',
      description: '185 horsepower / Diesel',
      images: ['img-product-1970-26.jpg']
    },
    {
      year: '1978',
      name: 'Tanker Truck (16,000 litres)',
      description: '280 horsepower / Diesel',
      images: ['img-product-1970-27.jpg']
    },
    {
      year: '1978',
      name: 'House Trailer',
      description: 'Saudi Arabia Export Model',
      images: ['img-product-1970-28.jpg']
    },
    {
      year: '1979',
      name: 'CW50PHL Bulk Truck',
      description: '300 horsepower / Diesel',
      images: ['img-product-1970-29.jpg']
    },
    {
      year: '1979',
      name: 'Sugar Tanker Truck',
      description: '300 horsepower / Diesel',
      images: ['img-product-1970-30.jpg']
    },
    {
      year: '1979',
      name: 'HA20 Urban Bus (84 Seats)',
      description: '185 horsepower / Diesel',
      images: ['img-product-1970-31.jpg']
    }
  ],
  '1980s': [
    {
      year: '1980',
      name: 'HA20L Passenger Bus (47 Seats)',
      description: '185 horsepower / Diesel',
      images: ['img-product-1980-1.jpg']
    },
    {
      year: '1981',
      name: 'GOHWA CJ5 Patrol Taxi',
      description: '6 Seats Hard top',
      images: ['img-product-1980-2.jpg']
    },
    {
      year: '1981',
      name: 'GOHWA CJ5 Snow Flow',
      description: 'Special Snow Removal Vehicle',
      images: ['img-product-1980-3.jpg']
    },
    {
      year: '1983',
      name: 'GOHWA Korando (Korean can do)',
      description: '1982. 7. 7 Registration of the Korando trademark',
      images: ['img-product-1980-4.jpg']
    },
    {
      year: '1985',
      name: 'KORANDO 9 (KH-9WD, 2,238cc)',
      description: '9 Seats / C223 Diesel',
      images: ['img-product-1980-5.jpg']
    },
    {
      year: '1985',
      name: 'Korando 4 (KH-7D)',
      description: '4 Seats / C223 Diesel',
      images: ['img-product-1980-6.jpg']
    },
    {
      year: '1985',
      name: 'Korando 5 (KH-7HD)',
      description: '5 Seats / C223 Diesel',
      images: ['img-product-1980-7.jpg']
    },
    {
      year: '1985',
      name: 'Korando 6 (KH-7PD)',
      description: '5 Seats / C223 Diesel',
      images: ['img-product-1980-8.jpg']
    },
    {
      year: '1985',
      name: 'Korando VAN (KH-7VD)',
      description: '3 Seats / 400kg / C223 Diesel',
      images: ['img-product-1980-9.jpg']
    },
    {
      year: '1985',
      name: 'Korando 9 Ambulance (KH-9AG)',
      description: '5 Seats Hard top / C223 Diesel',
      images: ['img-product-1980-10.jpg']
    },
    {
      year: '1987',
      name: 'NEW KORANDO 4 (KH-7D2)',
      description: '4 Seats / C223 Diesel',
      images: ['img-product-1980-11.jpg']
    },
    {
      year: '1987',
      name: 'NEW Korando 5 (KH-7HD2)',
      description: '5 Seats / C223 Diesel',
      images: ['img-product-1980-12.jpg']
    },
    {
      year: '1987',
      name: 'NEW Korando 6 (KH-7PD2)',
      description: '6 Seats / C223 Diesel',
      images: ['img-product-1980-13.jpg']
    },
    {
      year: '1987',
      name: 'NEW Korando 9 (KH-9WD2)',
      description: '9 Seats / C223 Diesel',
      images: ['img-product-1980-14.jpg']
    },
    {
      year: '1987',
      name: 'KORANDO 9 Ambulance (KH-7VD2)',
      description: '3 Seats / 300kg / C223 Diesel',
      images: ['img-product-1980-15.jpg']
    },
    {
      year: '1988',
      name: 'KORANDO Family',
      description: '5 Seats / C223 Diesel',
      images: ['img-product-1980-16.jpg']
    }
  ],
  '1990s': [
    {
      year: '1990',
      name: 'Korando Family 1990',
      description: '5 Seats / D23 Diesel',
      images: ['img-product-1990-1.jpg']
    },
    {
      year: '1990',
      name: 'Korando Deluxe',
      description: '4/5/6/9 Seats / DC23 Diesel',
      images: ['img-product-1990-2.jpg']
    },
    {
      year: '1991',
      name: 'Korando RV (2,498cc)',
      description: '5 Seats / XD3P Diesel',
      images: ['img-product-1990-3.jpg']
    },
    {
      year: '1991',
      name: 'Korando Family R / RS Series',
      description: '2.2Diesel / 2.5Diesel / 2.6Gasoline',
      images: ['img-product-1990-4.jpg']
    },
    {
      year: '1992',
      name: 'KALLISTA (2,498cc)',
      description: '2.0 DOHC / 2.9 EFI',
      images: ['img-product-1990-5.jpg']
    },
    {
      year: '1992',
      name: 'Korando Family 1993',
      description: '2.2Diesel / 2.5Diesel / 2.6Gasoline',
      images: ['img-product-1990-6.jpg']
    },
    {
      year: '1993',
      name: 'Korando 1993',
      description: '4/5/6/9 Seats / DC23 Diesel',
      images: ['img-product-1990-7.jpg']
    },
    {
      year: '1993',
      name: 'MUSSO',
      description: '601 Diesel / 602EL Diesel',
      images: ['img-product-1990-8.jpg']
    },
    {
      year: '1994',
      name: 'Korando New Family',
      description: '6 Seats / 601 Diesel',
      images: ['img-product-1990-9.jpg']
    },
    {
      year: '1995',
      name: 'ISTANA',
      description: '6/12/15 Seats / OM661, OM662 Diesel',
      images: ['img-product-1990-10.jpg']
    },
    {
      year: '1995',
      name: 'Korando New Family9',
      description: '9 Seats / 601 Diesel',
      images: ['img-product-1990-11.jpg']
    },
    {
      year: '1996',
      name: 'MUSSO IL3200',
      description: '3.2 DOHC / 500 Limited',
      images: ['img-product-1990-12.jpg']
    },
    {
      year: '1996',
      name: 'NEW Korando',
      description: 'Hard top/ Soft top / Van(Diesel)',
      images: ['img-product-1990-13.jpg']
    },
    {
      year: '1996',
      name: 'MUSSO 1997',
      description: 'Gasoline E20, E23',
      images: ['img-product-1990-14.jpg']
    },
    {
      year: '1997',
      name: 'NEW Korando Van',
      description: 'Diesel OM661',
      images: ['img-product-1990-15.jpg']
    },
    {
      year: '1997',
      name: 'CHAIRMAN / CHAIRMAN Limousine',
      description: 'Gasoline 3.2',
      images: ['img-product-1990-16.jpg']
    },
    {
      year: '1998',
      name: 'NEW MUSSO',
      description: 'Diesel 2.3, Gasoline 2.9, Diesel 2.9, Gasoline 3.2',
      images: ['img-product-1990-17.jpg']
    }
  ],
  '2000s': [
    {
      year: '2001',
      name: 'CHAIRMAN / CHAIRMAN Limousine',
      description: 'Gasoline 2.3 / 2.8 / 3.2',
      images: ['img-product-2000-1.jpg']
    },
    {
      year: '2001',
      name: 'REXTON',
      description: 'Diesel 2.9',
      images: ['img-product-2000-2.jpg']
    },
    {
      year: '2001',
      name: 'MUSSO SPORTS',
      description: 'Diesel 2.3, Diesel 2.9',
      images: ['img-product-2000-3.jpg']
    },
    {
      year: '2003',
      name: 'NEW CHAIRMAN / NEW CHAIRMAN Limousine',
      description: 'Gasoline 2.3 / 2.8 / 3.2',
      images: ['img-product-2000-4.jpg']
    },
    {
      year: '2003',
      name: 'NEW REXTON',
      description: 'Diesel 2.7',
      images: ['img-product-2000-5.jpg']
    },
    {
      year: '2004',
      name: 'RODIUS',
      description: 'Diesel 2.7',
      images: ['img-product-2000-6.jpg']
    },
    {
      year: '2004',
      name: 'Korando 2005',
      description: 'Diesel 2.9',
      images: ['img-product-2000-7.jpg']
    },
    {
      year: '2005',
      name: 'KYRON',
      description: 'Diesel 2.7',
      images: ['img-product-2000-8.jpg']
    },
    {
      year: '2005',
      name: 'ACTYON',
      description: 'Diesel 2.0',
      images: ['img-product-2000-9.jpg']
    },
    {
      year: '2006',
      name: 'REXTON 2',
      description: 'Diesel 2.7',
      images: ['img-product-2000-10.jpg']
    },
    {
      year: '2006',
      name: 'ACTYON SPORTS',
      description: 'Diesel 2.0',
      images: ['img-product-2000-11.jpg']
    },
    {
      year: '2007',
      name: 'KYRON',
      description: 'Diesel 2.0 / 2.7',
      images: ['img-product-2000-12.jpg']
    },
    {
      year: '2007',
      name: 'NEW RODIUS',
      description: 'Diesel 2.7',
      images: ['img-product-2000-13.jpg']
    },
    {
      year: '2008',
      name: 'NEW CHAIRMAN',
      description: 'Gasoline 2.8 / 3.2 / 3.6',
      images: ['img-product-2000-14.jpg']
    },
    {
      year: '2008',
      name: 'CHAIRMAN W',
      description: 'Gasoline 5.0',
      images: ['img-product-2000-15.jpg']
    }
  ],
  '2010s': [
    {
      year: '2011',
      name: 'Korando C',
      description: 'Diesel 2.0',
      images: ['img-product-2010-1.jpg']
    },
    {
      year: '2012',
      name: 'Korando SPORTS',
      description: 'Diesel 2.0',
      images: ['img-product-2010-2.jpg']
    },
    {
      year: '2012',
      name: 'REXTON W',
      description: 'Diesel 2.0',
      images: ['img-product-2010-3.jpg']
    },
    {
      year: '2013',
      name: 'Korando TURISMO',
      description: 'Diesel 2.0',
      images: ['img-product-2010-4.jpg']
    },
    {
      year: '2013',
      name: 'NEW Korando C',
      description: 'Diesel 2.0',
      images: ['img-product-2010-5.jpg']
    },
    {
      year: '2015',
      name: 'TIVOLI',
      description: 'Diesel 1.6 / Gasoline 1.6',
      images: ['img-product-2010-6.jpg']
    },
    {
      year: '2015',
      name: 'New Power REXTON W',
      description: 'Diesel 2.2',
      images: ['img-product-2010-7.jpg']
    },
    {
      year: '2016',
      name: 'TIVOLI Air',
      description: 'Diesel 1.6 / Gasoline 1.6',
      images: ['img-product-2010-8.jpg']
    },
    {
      year: '2017',
      name: 'New Style KORANDO C',
      description: 'Diesel 2.2',
      images: ['img-product-2010-9.jpg']
    },
    {
      year: '2017',
      name: 'TIVOLI Armor',
      description: 'Diesel 1.6 / Gasoline 1.6',
      images: ['img-product-2010-10.jpg']
    },
    {
      year: '2017',
      name: 'G4 REXTON',
      description: 'Diesel 2.2',
      images: ['img-product-2010-11.jpg']
    },
    {
      year: '2018',
      name: 'REXTON SPORTS',
      description: 'Diesel 2.2',
      images: ['img-product-2010-12.jpg']
    },
    {
      year: '2018',
      name: 'Korando TURISMO',
      description: 'Diesel 2.2',
      images: ['img-product-2010-13.jpg']
    },
    {
      year: '2019',
      name: 'Viewtiful Korando',
      description: 'Diesel 1.6',
      images: ['img-product-2010-14.jpg']
    },
    {
      year: '2019',
      name: 'REXTON SPORTS KHAN',
      description: 'Diesel 2.2 (KHAN Included)',
      images: ['img-product-2010-15.jpg']
    },
    {
      year: '2019',
      name: 'VERY NEW TIVOLI',
      description: 'Diesel 1.6 / Gasoline 1.5',
      images: ['img-product-2010-16.jpg']
    }
  ],
  '2020s': [
    {
      year: '2020',
      name: 'ALL NEW REXTON',
      description: 'Diesel 2.2',
      images: ['img-product-2020-1.jpg']
    },
    {
      year: '2021',
      name: 'THE NEW REXTON SPORTS',
      description: 'Diesel 2.2 (KHAN Included)',
      images: ['img-product-2020-2.jpg']
    },
    {
      year: '2022',
      name: 'Korando EMOTION',
      description: 'Electrified',
      images: ['img-product-2020-3.jpg']
    },
    {
      year: '2022',
      name: 'TORRES',
      description: 'V4 Gasoline 1.5',
      images: ['img-product-2020-4.jpg']
    },
    {
      year: '2023',
      name: 'REXTON NEW ARENA',
      description: 'Diesel 2.2',
      images: ['img-product-2020-5.jpg']
    },
    {
      year: '2023',
      name: 'REXTON SPORTS CULMEN',
      description: 'Diesel 2.2 (KHAN Included)',
      images: ['img-product-2020-6.jpg']
    },
    {
      year: '2023',
      name: 'TORRES EVX',
      description: 'Electrified',
      images: ['img-product-2020-7.jpg']
    },
    {
      year: '2024',
      name: 'ACTYON',
      description: 'Gasoline 1.5',
      images: ['img-product-2020-8.jpg']
    },
    {
      year: '2025',
      name: 'MUSSO EV',
      description: 'Electrified',
      images: ['img-product-2020-9.jpg']
    },
    {
      year: '2025',
      name: 'TORRES HYBRID',
      description: 'Motor 130kW / GDI Engine 150ps',
      images: ['img-product-2020-10.jpg']
    },
    {
      year: '2025',
      name: 'ACTYON HYBRID',
      description: 'Motor 130kW / GDI Engine 150ps',
      images: ['img-product-2020-11.jpg']
    }
  ]
};

const years = ['1950s', '1970s', '1980s', '1990s', '2000s', '2010s', '2020s'];

export default function ProductHistoryHero() {
  const { t } = useTranslation();
  const [activeYear, setActiveYear] = useState('1970s');
  const [isLoading, setIsLoading] = useState(true);
  const [isTimelineFixed, setIsTimelineFixed] = useState(true);
  const footerRef = useRef<HTMLDivElement>(null);

  // Function to translate product descriptions
  const translateDescription = (description: string): string => {
    let translatedDescription = description;
    
    // Replace technical terms with translated versions
    translatedDescription = translatedDescription.replace(/horsepower/g, t('heritage1954.productHistory.technicalTerms.horsepower'));
    translatedDescription = translatedDescription.replace(/Diesel/g, t('heritage1954.productHistory.technicalTerms.diesel'));
    translatedDescription = translatedDescription.replace(/Gasoline/g, t('heritage1954.productHistory.technicalTerms.gasoline'));
    translatedDescription = translatedDescription.replace(/Seats/g, t('heritage1954.productHistory.technicalTerms.seats'));
    translatedDescription = translatedDescription.replace(/Ton/g, t('heritage1954.productHistory.technicalTerms.ton'));
    translatedDescription = translatedDescription.replace(/litres/g, t('heritage1954.productHistory.technicalTerms.litres'));
    translatedDescription = translatedDescription.replace(/kg/g, t('heritage1954.productHistory.technicalTerms.kg'));
    translatedDescription = translatedDescription.replace(/cc/g, t('heritage1954.productHistory.technicalTerms.cc'));
    translatedDescription = translatedDescription.replace(/DOHC/g, t('heritage1954.productHistory.technicalTerms.dohc'));
    translatedDescription = translatedDescription.replace(/EFI/g, t('heritage1954.productHistory.technicalTerms.efi'));
    translatedDescription = translatedDescription.replace(/GDI/g, t('heritage1954.productHistory.technicalTerms.gdi'));
    translatedDescription = translatedDescription.replace(/kW/g, t('heritage1954.productHistory.technicalTerms.kw'));
    translatedDescription = translatedDescription.replace(/ps/g, t('heritage1954.productHistory.technicalTerms.ps'));
    translatedDescription = translatedDescription.replace(/Electrified/g, t('heritage1954.productHistory.technicalTerms.electrified'));
    
    return translatedDescription;
  };

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (footerRef.current) {
        const footerRect = footerRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        // If footer is visible in viewport, make timeline non-fixed
        if (footerRect.top <= viewportHeight) {
          setIsTimelineFixed(false);
        } else {
          setIsTimelineFixed(true);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const currentProducts = productData[activeYear] || [];

  return (
    <div className="relative bg-black">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/HERITAGE%201954/brand-heritage-bg.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Professional Timeline Sidebar */}
      <motion.div 
        className={`${isTimelineFixed ? 'fixed top-0 left-0' : 'absolute top-0 left-0'} w-2/5 md:w-80 h-full bg-black/50 backdrop-blur-xl z-30 transition-all duration-700 ease-in-out`}
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="h-full flex flex-col">
          {/* Professional Header */}
          <motion.div 
            className="px-3 md:px-8 pt-6 md:pt-12 pb-4 md:pb-8 border-b border-white/10"
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="text-center">
              <motion.h1 
                className="text-2xl font-light text-white/90 mb-1 tracking-wider"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                {t('heritage1954.productHistory.heritage')}
              </motion.h1>
              <motion.div 
                className="flex justify-center"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src="https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/HERITAGE%201954/producthistory/img-heritage-product-title.png"
                  alt="1954"
                  className="mx-auto max-w-full h-auto"
                  style={{ maxHeight: '80px' }}
                  onError={(e) => {
                    console.error('Product title image failed to load:', e);
                    e.currentTarget.style.display = 'none';
                  }}
                  onLoad={() => {
                    console.log('Product title image loaded successfully');
                  }}
                />
              </motion.div>
              <div className="w-16 h-px bg-kgm-amber mx-auto mt-4"></div>
          </div>
          </motion.div>

          {/* Timeline Navigation - Matching Image Design */}
          <div className="flex-1 px-3 md:px-8 py-4 md:py-8 relative">
            {/* Dotted Timeline Line */}
             <motion.div 
               className="absolute top-4 md:top-8 bottom-4 md:bottom-8 w-px timeline-line"
               style={{
                 left: '35px', // 12px (px-3) + 7px + 5px = 24px
                 background: 'repeating-linear-gradient(to bottom, white 0px, white 2px, transparent 2px, transparent 6px)',
                 backgroundSize: '1px 6px'
               }}
               initial={{ scaleY: 0 }}
               animate={{ scaleY: 1 }}
               transition={{ duration: 1.2, delay: 0.5 }}
             />
            
             {/* Timeline Navigation */}
             <div className="space-y-5 relative">
              {years.map((year, index) => (
                <motion.div 
                  key={year} 
                  className="relative group cursor-pointer flex items-center"
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.08 }}
                  style={{ paddingLeft: '20px' }}
                >
                   {/* Timeline Marker - Ring style for active year */}
                     <motion.div 
                       className={`absolute w-3 h-3 md:w-4 md:h-4 rounded-full border-2 transition-all duration-500 md:!-ml-6 ${
                         activeYear === year 
                           ? 'border-[#c4a96c] bg-transparent' 
                           : 'border-transparent bg-transparent'
                       }`}
                       style={{ 
                         marginLeft: '-28px',
                         padding: '3px'
                       }}
                     initial={{ scale: 0, opacity: 0 }}
                     animate={{ 
                       scale: activeYear === year ? 1 : 0,
                       opacity: activeYear === year ? 1 : 0
                     }}
                     transition={{ 
                       duration: 0.5,
                       ease: "easeInOut"
                     }}
                   />
                  
                   {/* Year Button */}
                   <motion.button
                     onClick={() => setActiveYear(year)}
                     className={`text-left transition-all duration-300 ${
                       activeYear === year
                         ? 'text-[#c4a96c]'
                         : year === '1950s' ? 'text-[#c4a96c]' : 'text-gray-400 group-hover:text-white'
                     }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                     <div 
                       className="font-serif tracking-wide uppercase md:text-2xl md:font-bold"
                       style={{ 
                         fontSize: activeYear === year ? '1.4rem' : '1.1rem',
                         fontWeight: 'bold',
                         color: year === '1950s' ? '#c4a96c' : activeYear === year ? '#c4a96c' : '#808080'
                       }}
                     >
                       {year === '1950s' ? '1950~1960s' : year}
                     </div>
                  </motion.button>
                </motion.div>
              ))}
          </div>
        </div>

          {/* Professional Footer */}
          <motion.div 
            className="px-3 md:px-8 py-3 md:py-6 border-t border-white/10"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="text-center text-white/40 text-xs tracking-wider">
              {t('heritage1954.productHistory.productHistory')}
      </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Content */}
      <div className="relative z-10 min-h-screen">
        <div className="flex min-h-screen">

          {/* Enhanced Right Content Area */}
          <motion.div 
            className="w-3/5 md:w-2/3 ml-auto pl-2 md:pl-8"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="min-h-screen overflow-y-auto">
              {isLoading ? (
                <motion.div 
                  className="flex items-center justify-center h-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.div 
                    className="animate-spin rounded-full h-16 w-16 border-4 border-kgm-amber border-t-transparent"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                </motion.div>
              ) : (
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={activeYear}
                    className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 md:gap-6 md:p-6 lg:grid-cols-3 lg:gap-8 lg:p-8"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                  >
                  {currentProducts.map((product, index) => (
                      <motion.div
                      key={`${product.year}-${index}`}
                        className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 w-full"
                        style={{ 
                          minHeight: '350px',
                          maxHeight: '400px',
                          width: '100%',
                          maxWidth: '100%'
                        }}
                        initial={{ opacity: 0, y: 30, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ 
                          duration: 0.6, 
                          delay: index * 0.1,
                          ease: "easeOut"
                        }}
                        whileHover={{ 
                          y: -10,
                          scale: 1.02,
                          transition: { duration: 0.3 }
                        }}
                      >
                        {/* Image Container - Solid White Background */}
                        <motion.div 
                          className="aspect-[4/3] mb-0 relative overflow-hidden rounded-t-xl bg-white flex items-center justify-center"
                          style={{ 
                            minHeight: '160px',
                            maxHeight: '200px',
                            width: '100%'
                          }}
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="w-full h-full flex items-center justify-center p-2">
                            <motion.img
                            src={`https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/HERITAGE%201954/producthistory/${getDecadeFolder(activeYear)}/${product.images[0]}?v=${Date.now()}`}
                            alt={product.name}
                              className="max-w-full max-h-full object-contain transition-all duration-500"
                              style={{
                                width: 'auto',
                                height: 'auto',
                                maxWidth: '100%',
                                maxHeight: '100%'
                              }}
                              whileHover={{ scale: 1.02 }}
                              transition={{ duration: 0.3 }}
                          onError={(e) => {
                            console.log('Image failed to load:', e.currentTarget.src);
                            console.log('Expected path:', `https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/HERITAGE%201954/producthistory/${getDecadeFolder(activeYear)}/${product.images[0]}`);
                            const parent = e.currentTarget.parentElement;
                            if (parent) {
                              parent.innerHTML = `
                                  <div class="w-full h-full flex items-center justify-center text-6xl text-gray-400">
                                  🚗
                                </div>
                              `;
                            }
                          }}
                          onLoad={() => {
                            console.log('Image loaded successfully:', `https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/HERITAGE%201954/producthistory/${getDecadeFolder(activeYear)}/${product.images[0]}`);
                          }}
                        />
                          </div>
                        </motion.div>
                        
                        {/* Content - Light Gray Background */}
                        <motion.div 
                          className="bg-gray-100 p-4 rounded-b-xl space-y-2 flex-1 flex flex-col justify-between"
                          style={{ 
                            minHeight: '120px',
                            maxHeight: '140px'
                          }}
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                        >
                          <div className="space-y-2">
                            <motion.p 
                              className="text-lg font-bold text-gray-900"
                            >
                              {product.year}
                            </motion.p>
                            <motion.p 
                              className="text-sm font-semibold text-gray-800 leading-tight"
                            >
                              {product.name}
                            </motion.p>
                          </div>
                          <motion.p 
                            className="text-xs text-gray-600 leading-relaxed"
                          >
                            {translateDescription(product.description)}
                          </motion.p>
                        </motion.div>
                      </motion.div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer Detection Element */}
      <div ref={footerRef} className="absolute bottom-0 left-0 w-full h-1 pointer-events-none"></div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes bounce {
          0%, 20%, 53%, 80%, 100% {
            transform: translate3d(0,0,0);
          }
          40%, 43% {
            transform: translate3d(0, -8px, 0);
          }
          70% {
            transform: translate3d(0, -4px, 0);
          }
          90% {
            transform: translate3d(0, -2px, 0);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
        
        @keyframes glow {
          0%, 100% {
            box-shadow: 0 0 5px rgba(251, 191, 36, 0.5);
          }
          50% {
            box-shadow: 0 0 20px rgba(251, 191, 36, 0.8), 0 0 30px rgba(251, 191, 36, 0.6);
          }
        }
        
        .animate-bounce {
          animation: bounce 2s infinite;
        }
        
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }
        
        .timeline-line {
          left: 21px; /* 16px (1rem) + 5px = 21px on mobile */
        }
        
        @media (min-width: 768px) {
          .timeline-line {
            left: 29px; /* 24px (1.5rem) + 5px = 29px on desktop */
          }
        }
      `}</style>
    </div>
  );
}

