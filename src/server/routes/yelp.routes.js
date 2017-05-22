const routes = require('express').Router();
const apiKeys = require('../config/config.example.js');
const rp = require('request-promise');

// GET /api/yelp
// Description: get one or more businesses from yelp with query params
// id: id of the business or
// location: address | zipcode | city or
// longitude & latitude
//
// Examples: 
// eg. localhost:3000/api/yelp?id=kabab-paradise-lake-hiawatha
// eg. localhost:3000/api/yelp?longitude=-74.0059&latitude=42
//
// Addition Query Params:
// terms =  'food,park,restaurant'
// 
// Add these in the client side
// For food, food,restaurants,pizza,italian, etc...
// For places, active, parks, museums, bowling, etc...

routes.get('/api/yelp', (req, res) => {
	if(!apiKeys.yelpAccessToken) res.send('yelp access token not set!');

	const id = req.query.id || null;
	const location = id ? null : req.query.location || null;
	const longitude = location ? null : req.query.longitude || null;
	const latitude = location ? null : req.query.latitude || null;
	const terms = req.query.terms || null;

	const options = {
	    uri: id ? `https://api.yelp.com/v3/businesses/${id}`
	    		: 'https://api.yelp.com/v3/businesses/search',
	    qs: {
	        location: location,
	        longitude: longitude,
	        latitude: latitude,
	        limit: 20,
	        term: terms,
	        sort_by: 'distance',
	        radius: 10000
	    },
	    headers: {
	        'User-Agent': 'Request-Promise',
	        'Authorization': 'Bearer ' + apiKeys.yelpAccessToken
	    },
	    json: true
	};

	rp.get(options)
		.then((body) => res.send(body))
		.catch((error) => res.status(500).send(error));
});

module.exports = routes;


// giving id will return example body
/* {
  "id": "kabab-paradise-lake-hiawatha",
  "name": "Kabab Paradise",
  "image_url": "https://s3-media3.fl.yelpcdn.com/bphoto/OgNFZ1EZ5V-hQqJDzr-QkQ/o.jpg",
  "is_claimed": true,
  "is_closed": false,
  "url": "https://www.yelp.com/biz/kabab-paradise-lake-hiawatha?adjust_creative=L4HJ9NBEvQlkp2ma417WJA&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_lookup&utm_source=L4HJ9NBEvQlkp2ma417WJA",
  "phone": "+19733347900",
  "display_phone": "(973) 334-7900",
  "review_count": 427,
  "categories": [
    {
      "alias": "afghani",
      "title": "Afghan"
    },
    {
      "alias": "halal",
      "title": "Halal"
    }
  ],
  "rating": 4.5,
  "location": {
    "address1": "76 N Beverwyck Rd",
    "address2": "",
    "address3": "",
    "city": "Lake Hiawatha",
    "zip_code": "07034",
    "country": "US",
    "state": "NJ",
    "display_address": [
      "76 N Beverwyck Rd",
      "Lake Hiawatha, NJ 07034"
    ],
    "cross_streets": ""
  },
  "coordinates": {
    "latitude": 40.8809432983398,
    "longitude": -74.3819046020508
  },
  "photos": [
    "https://s3-media3.fl.yelpcdn.com/bphoto/OgNFZ1EZ5V-hQqJDzr-QkQ/o.jpg",
    "https://s3-media1.fl.yelpcdn.com/bphoto/0Jjh7E0ZPG7_sOHjkJPOww/o.jpg",
    "https://s3-media2.fl.yelpcdn.com/bphoto/NE1kltpIs0b3eWhQL5-kJQ/o.jpg"
  ],
  "price": "$$",
  "hours": [
    {
      "open": [
        {
          "is_overnight": false,
          "start": "1100",
          "end": "2200",
          "day": 0
        },
        {
          "is_overnight": false,
          "start": "1100",
          "end": "2200",
          "day": 1
        },
        {
          "is_overnight": false,
          "start": "1100",
          "end": "2200",
          "day": 2
        },
        {
          "is_overnight": false,
          "start": "1100",
          "end": "2200",
          "day": 3
        },
        {
          "is_overnight": false,
          "start": "1100",
          "end": "2300",
          "day": 4
        },
        {
          "is_overnight": false,
          "start": "1100",
          "end": "2300",
          "day": 5
        },
        {
          "is_overnight": false,
          "start": "1300",
          "end": "2100",
          "day": 6
        }
      ],
      "hours_type": "REGULAR",
      "is_open_now": true
    }
  ],
  "transactions": []
}
*/

// giving location or longitude and latitude will return example body
/* {
  "businesses": [
    {
      "id": "kabab-paradise-lake-hiawatha",
      "name": "Kabab Paradise",
      "image_url": "https://s3-media3.fl.yelpcdn.com/bphoto/OgNFZ1EZ5V-hQqJDzr-QkQ/o.jpg",
      "is_closed": false,
      "url": "https://www.yelp.com/biz/kabab-paradise-lake-hiawatha?adjust_creative=L4HJ9NBEvQlkp2ma417WJA&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=L4HJ9NBEvQlkp2ma417WJA",
      "review_count": 427,
      "categories": [
        {
          "alias": "afghani",
          "title": "Afghan"
        },
        {
          "alias": "halal",
          "title": "Halal"
        }
      ],
      "rating": 4.5,
      "coordinates": {
        "latitude": 40.8809432983398,
        "longitude": -74.3819046020508
      },
      "transactions": [],
      "price": "$$",
      "location": {
        "address1": "76 N Beverwyck Rd",
        "address2": "",
        "address3": "",
        "city": "Lake Hiawatha",
        "zip_code": "07034",
        "country": "US",
        "state": "NJ",
        "display_address": [
          "76 N Beverwyck Rd",
          "Lake Hiawatha, NJ 07034"
        ]
      },
      "phone": "+19733347900",
      "display_phone": "(973) 334-7900",
      "distance": 601.5967678522
    },
    {
      "id": "bollywood-grill-parsippany",
      "name": "Bollywood Grill",
      "image_url": "https://s3-media1.fl.yelpcdn.com/bphoto/ju9XG9yqkmMihs8-lWNyZg/o.jpg",
      "is_closed": false,
      "url": "https://www.yelp.com/biz/bollywood-grill-parsippany?adjust_creative=L4HJ9NBEvQlkp2ma417WJA&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=L4HJ9NBEvQlkp2ma417WJA",
      "review_count": 142,
      "categories": [
        {
          "alias": "indpak",
          "title": "Indian"
        },
        {
          "alias": "hotdogs",
          "title": "Fast Food"
        },
        {
          "alias": "sandwiches",
          "title": "Sandwiches"
        }
      ],
      "rating": 4.5,
      "coordinates": {
        "latitude": 40.876295,
        "longitude": -74.3814138
      },
      "transactions": [],
      "price": "$$",
      "location": {
        "address1": "435 N Beverwyck Rd",
        "address2": "",
        "address3": "",
        "city": "Parsippany",
        "zip_code": "07054",
        "country": "US",
        "state": "NJ",
        "display_address": [
          "435 N Beverwyck Rd",
          "Parsippany, NJ 07054"
        ]
      },
      "phone": "+19732571444",
      "display_phone": "(973) 257-1444",
      "distance": 524.1041661336
    },
    {
      "id": "maddys-mexican-grill-lake-hiawatha",
      "name": "Maddy's Mexican Grill",
      "image_url": "https://s3-media2.fl.yelpcdn.com/bphoto/2Vgz8mkIGdfuJK2QYe1p9w/o.jpg",
      "is_closed": false,
      "url": "https://www.yelp.com/biz/maddys-mexican-grill-lake-hiawatha?adjust_creative=L4HJ9NBEvQlkp2ma417WJA&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=L4HJ9NBEvQlkp2ma417WJA",
      "review_count": 165,
      "categories": [
        {
          "alias": "mexican",
          "title": "Mexican"
        }
      ],
      "rating": 4,
      "coordinates": {
        "latitude": 40.87938,
        "longitude": -74.38212
      },
      "transactions": [
        "delivery",
        "pickup"
      ],
      "price": "$$",
      "location": {
        "address1": "52 N Beverwyck Rd",
        "address2": "Ste B",
        "address3": "",
        "city": "Lake Hiawatha",
        "zip_code": "07034",
        "country": "US",
        "state": "NJ",
        "display_address": [
          "52 N Beverwyck Rd",
          "Ste B",
          "Lake Hiawatha, NJ 07034"
        ]
      },
      "phone": "+19737946700",
      "display_phone": "(973) 794-6700",
      "distance": 557.861134798
    },
    {
      "id": "bosphorus-restaurant-lake-hiawatha",
      "name": "Bosphorus Restaurant",
      "image_url": "https://s3-media3.fl.yelpcdn.com/bphoto/EW2oK8Ap4gnGbpNPhDC1Qw/o.jpg",
      "is_closed": false,
      "url": "https://www.yelp.com/biz/bosphorus-restaurant-lake-hiawatha?adjust_creative=L4HJ9NBEvQlkp2ma417WJA&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=L4HJ9NBEvQlkp2ma417WJA",
      "review_count": 77,
      "categories": [
        {
          "alias": "turkish",
          "title": "Turkish"
        },
        {
          "alias": "mideastern",
          "title": "Middle Eastern"
        }
      ],
      "rating": 4,
      "coordinates": {
        "latitude": 40.878129,
        "longitude": -74.382289
      },
      "transactions": [
        "delivery",
        "pickup"
      ],
      "price": "$$",
      "location": {
        "address1": "32 N Beverwyck Rd",
        "address2": "",
        "address3": "",
        "city": "Lake Hiawatha",
        "zip_code": "07034",
        "country": "US",
        "state": "NJ",
        "display_address": [
          "32 N Beverwyck Rd",
          "Lake Hiawatha, NJ 07034"
        ]
      },
      "phone": "+19733359690",
      "display_phone": "(973) 335-9690",
      "distance": 551.723916708
    },
    {
      "id": "the-cakeover-lake-hiawatha",
      "name": "The CakeOver",
      "image_url": "https://s3-media2.fl.yelpcdn.com/bphoto/CP5r4JySYO-CULKJf6QPbw/o.jpg",
      "is_closed": false,
      "url": "https://www.yelp.com/biz/the-cakeover-lake-hiawatha?adjust_creative=L4HJ9NBEvQlkp2ma417WJA&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=L4HJ9NBEvQlkp2ma417WJA",
      "review_count": 26,
      "categories": [
        {
          "alias": "bakeries",
          "title": "Bakeries"
        },
        {
          "alias": "gluten_free",
          "title": "Gluten-Free"
        }
      ],
      "rating": 4.5,
      "coordinates": {
        "latitude": 40.8819389,
        "longitude": -74.3824081
      },
      "transactions": [],
      "price": "$",
      "location": {
        "address1": "79 N Beverwyck Rd",
        "address2": null,
        "address3": "",
        "city": "Lake Hiawatha",
        "zip_code": "07034",
        "country": "US",
        "state": "NJ",
        "display_address": [
          "79 N Beverwyck Rd",
          "Lake Hiawatha, NJ 07034"
        ]
      },
      "phone": "+19735515540",
      "display_phone": "(973) 551-5540",
      "distance": 694.85748977
    },
    {
      "id": "churrasco-grill-lake-hiawatha",
      "name": "Churrasco Grill",
      "image_url": "https://s3-media1.fl.yelpcdn.com/bphoto/z601jhFhpGmhSsn1YPou-A/o.jpg",
      "is_closed": false,
      "url": "https://www.yelp.com/biz/churrasco-grill-lake-hiawatha?adjust_creative=L4HJ9NBEvQlkp2ma417WJA&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=L4HJ9NBEvQlkp2ma417WJA",
      "review_count": 67,
      "categories": [
        {
          "alias": "newamerican",
          "title": "American (New)"
        },
        {
          "alias": "peruvian",
          "title": "Peruvian"
        },
        {
          "alias": "argentine",
          "title": "Argentine"
        }
      ],
      "rating": 4,
      "coordinates": {
        "latitude": 40.8846244812012,
        "longitude": -74.3817977905273
      },
      "transactions": [],
      "price": "$$",
      "location": {
        "address1": "137 N Beverwyck Rd",
        "address2": "",
        "address3": "",
        "city": "Lake Hiawatha",
        "zip_code": "07034",
        "country": "US",
        "state": "NJ",
        "display_address": [
          "137 N Beverwyck Rd",
          "Lake Hiawatha, NJ 07034"
        ]
      },
      "phone": "+19732631590",
      "display_phone": "(973) 263-1590",
      "distance": 876.6353395819999
    },
    {
      "id": "real-thai-lake-hiawatha",
      "name": "Real Thai",
      "image_url": "https://s3-media4.fl.yelpcdn.com/bphoto/1Y3KF5t8_fGcul6NgNeG8w/o.jpg",
      "is_closed": false,
      "url": "https://www.yelp.com/biz/real-thai-lake-hiawatha?adjust_creative=L4HJ9NBEvQlkp2ma417WJA&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=L4HJ9NBEvQlkp2ma417WJA",
      "review_count": 35,
      "categories": [
        {
          "alias": "thai",
          "title": "Thai"
        },
        {
          "alias": "desserts",
          "title": "Desserts"
        },
        {
          "alias": "noodles",
          "title": "Noodles"
        }
      ],
      "rating": 4.5,
      "coordinates": {
        "latitude": 40.87923,
        "longitude": -74.3826799
      },
      "transactions": [],
      "price": "$$",
      "location": {
        "address1": "33 N Beverwyck Rd",
        "address2": "",
        "address3": null,
        "city": "Lake Hiawatha",
        "zip_code": "07034",
        "country": "US",
        "state": "NJ",
        "display_address": [
          "33 N Beverwyck Rd",
          "Lake Hiawatha, NJ 07034"
        ]
      },
      "phone": "+19732654776",
      "display_phone": "(973) 265-4776",
      "distance": 573.8174834035999
    },
    {
      "id": "drem-salon-lake-hiawatha",
      "name": "Drem Salon",
      "image_url": "https://s3-media1.fl.yelpcdn.com/bphoto/YllQFshUW9BO4AT3uBxTgw/o.jpg",
      "is_closed": false,
      "url": "https://www.yelp.com/biz/drem-salon-lake-hiawatha?adjust_creative=L4HJ9NBEvQlkp2ma417WJA&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=L4HJ9NBEvQlkp2ma417WJA",
      "review_count": 34,
      "categories": [
        {
          "alias": "hair",
          "title": "Hair Salons"
        },
        {
          "alias": "makeupartists",
          "title": "Makeup Artists"
        }
      ],
      "rating": 5,
      "coordinates": {
        "latitude": 40.88462,
        "longitude": -74.38179
      },
      "transactions": [],
      "price": "$$",
      "location": {
        "address1": "137 N Beverwyck Rd",
        "address2": null,
        "address3": "",
        "city": "Lake Hiawatha",
        "zip_code": "07034",
        "country": "US",
        "state": "NJ",
        "display_address": [
          "137 N Beverwyck Rd",
          "Lake Hiawatha, NJ 07034"
        ]
      },
      "phone": "+19733340006",
      "display_phone": "(973) 334-0006",
      "distance": 860.6531449759999
    },
    {
      "id": "itech-iphone-repair-parsippany-6",
      "name": "iTech iPhone Repair",
      "image_url": "https://s3-media3.fl.yelpcdn.com/bphoto/ksBzlEJcZ9sRxmMkLdu7aQ/o.jpg",
      "is_closed": false,
      "url": "https://www.yelp.com/biz/itech-iphone-repair-parsippany-6?adjust_creative=L4HJ9NBEvQlkp2ma417WJA&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=L4HJ9NBEvQlkp2ma417WJA",
      "review_count": 79,
      "categories": [
        {
          "alias": "mobilephonerepair",
          "title": "Mobile Phone Repair"
        },
        {
          "alias": "electronicsrepair",
          "title": "Electronics Repair"
        }
      ],
      "rating": 5,
      "coordinates": {
        "latitude": 40.87881,
        "longitude": -74.37547
      },
      "transactions": [],
      "location": {
        "address1": "25 Seminole Ave",
        "address2": null,
        "address3": "",
        "city": "Parsippany",
        "zip_code": "07034",
        "country": "US",
        "state": "NJ",
        "display_address": [
          "25 Seminole Ave",
          "Parsippany, NJ 07034"
        ]
      },
      "phone": "+19732029167",
      "display_phone": "(973) 202-9167",
      "distance": 69.6868842902
    },
    {
      "id": "howards-bagel-bakery-lake-hiawatha",
      "name": "Howard's Bagel Bakery",
      "image_url": "https://s3-media4.fl.yelpcdn.com/bphoto/qXGYHjTII5muNhoVQdVpAw/o.jpg",
      "is_closed": false,
      "url": "https://www.yelp.com/biz/howards-bagel-bakery-lake-hiawatha?adjust_creative=L4HJ9NBEvQlkp2ma417WJA&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=L4HJ9NBEvQlkp2ma417WJA",
      "review_count": 22,
      "categories": [
        {
          "alias": "bagels",
          "title": "Bagels"
        },
        {
          "alias": "cafes",
          "title": "Cafes"
        },
        {
          "alias": "sandwiches",
          "title": "Sandwiches"
        }
      ],
      "rating": 4,
      "coordinates": {
        "latitude": 40.8811073303223,
        "longitude": -74.3818893432617
      },
      "transactions": [],
      "price": "$",
      "location": {
        "address1": "82 N Beverwyck Rd",
        "address2": "",
        "address3": "",
        "city": "Lake Hiawatha",
        "zip_code": "07034",
        "country": "US",
        "state": "NJ",
        "display_address": [
          "82 N Beverwyck Rd",
          "Lake Hiawatha, NJ 07034"
        ]
      },
      "phone": "+19737944724",
      "display_phone": "(973) 794-4724",
      "distance": 612.2556197929999
    }
  ],
  "total": 1803,
  "region": {
    "center": {
      "latitude": 40.87821527796068,
      "longitude": -74.37572479248047
    }
  }
}*/
