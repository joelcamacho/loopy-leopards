const routes = require('express').Router();
const apiKeys = require('../config/config.js');
const rp = require('request-promise');

// GET /api/yelp
// Description: get one or more businesses from eventbrite with query params
// q: q is a keyword for search
// locationAddress: address | zipcode | city or state
// locationLongitude & locationlatitude
//
// Examples: 
// eg. https://www.eventbriteapi.com/v3/events/search/?token=ALPXUSBHYYOPXWXOSA54
// eg. https://www.eventbriteapi.com/v3/events/search/?token=ALPXUSBHYYOPXWXOSA54&location.address=Manhattan&location.within=5mi

routes.post('/api/eventbrite', (req, res) => {
  const q = req.query.q || undefined
  const locationAddress = req.query.location || undefined
  const locationLongitude = locationAddress ? undefined : req.query.longitude || undefined
  const locationLatitude = locationAddress ? undefined : req.query.latitude || undefined
  const locationWithin = req.query.within || undefined

  const options = {
      uri: 'https://www.eventbriteapi.com/v3/events/search/?',
      qs: {
          token: apiKeys.eventbriteAccessToken,
          q: q,
          "location.address": locationAddress,
          "location.latitude": locationLatitude,
          "location.longitude": locationLongitude,
          "location.within": locationWithin
      }
  };

  rp.get(options)
    .then((body) => {
      body = JSON.parse(body);
      
      body.events = body.events.map(event => {
        event.description.html = null;
        return event;
      });

      res.send(body) 
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send(error);
    });
});

module.exports = routes;


// giving id will return example body
/* 
{
  "pagination": {
    "object_count": 53053,
    "page_number": 1,
    "page_size": 50,
    "page_count": 200
  },
  "events": [
    {
      "name": {
        "text": "ELLEVEN45 - LADIES FREE ALL NIGHT",
        "html": "ELLEVEN45 - LADIES FREE ALL NIGHT"
      },
      "description": {
        "text": "\r\n #4PlayFridays \r\nHOSTED BY \"MA$E\"\r\nRSVP at \r\nwww.1145OnFriday.eventbrite.com\r\nThe sexiest place to party on a FRIDAY night in #Atlanta. \r\n21 and up to Party\r\nSections and Info call 770-299-3166  \r\nMake Sure to Follow @CirocBoyManny on instagram for updates and upcoming events.*\r\n \r\nDOORS open AT 10PM\r\n\r\nELLEVEN45 LOUNGE\r\n2110 Peachtree Rd. NW.\r\nAtlanta, GA. 30309",
        "html": "<P STYLE=\"text-align: center;\"><BR></P>\r\n<P STYLE=\"text-align: center;\"><SPAN STYLE=\"font-family: 'arial black', 'avant garde'; font-size: x-large;\"><STRONG STYLE=\"line-height: 1.6em;\"><SPAN STYLE=\"line-height: 1.6em;\"> #4PlayFridays </SPAN></STRONG></SPAN></P>\r\n<P STYLE=\"text-align: center;\"><SPAN STYLE=\"font-family: 'arial black', 'avant garde'; font-size: x-large;\"><STRONG STYLE=\"line-height: 1.6em;\"><SPAN STYLE=\"line-height: 1.6em;\">HOSTED BY \"MA$E\"</SPAN></STRONG></SPAN></P>\r\n<P STYLE=\"text-align: center;\"><SPAN STYLE=\"color: #ff0000;\"><SPAN STYLE=\"font-family: 'arial black', 'avant garde'; font-size: x-large;\"><STRONG STYLE=\"line-height: 1.6em;\"><SPAN STYLE=\"line-height: 1.6em;\">RSVP at </SPAN></STRONG></SPAN></SPAN></P>\r\n<P STYLE=\"text-align: center;\"><SPAN STYLE=\"color: #ff0000;\"><SPAN STYLE=\"font-family: 'arial black', 'avant garde'; font-size: x-large;\"><STRONG STYLE=\"line-height: 1.6em;\"><SPAN STYLE=\"line-height: 1.6em;\">www.1145OnFriday.eventbrite.com</SPAN></STRONG></SPAN></SPAN></P>\r\n<P STYLE=\"text-align: center;\"><SPAN STYLE=\"font-size: x-large;\">The sexiest place to party on a FRIDAY night in #Atlanta. </SPAN></P>\r\n<P STYLE=\"text-align: center;\"><SPAN STYLE=\"font-family: 'arial black', 'avant garde'; font-size: x-large; color: #ff0000;\"><STRONG>21 and up to Party</STRONG></SPAN></P>\r\n<P STYLE=\"text-align: center;\"><SPAN STYLE=\"font-size: x-large;\"><STRONG STYLE=\"line-height: 1.6em;\">Sections and Info call 770-299-3166 </STRONG></SPAN> </P>\r\n<P STYLE=\"text-align: center;\"><SPAN STYLE=\"font-size: x-large;\"><STRONG>Make Sure to Follow @CirocBoyManny on instagram for updates and upcoming events.*</STRONG></SPAN></P>\r\n<P STYLE=\"text-align: center;\"> </P>\r\n<P STYLE=\"text-align: center;\"><SPAN STYLE=\"font-family: 'arial black', 'avant garde'; font-size: x-large;\"><STRONG>DOORS open AT 10PM</STRONG></SPAN></P>\r\n<P STYLE=\"text-align: center;\"><SPAN STYLE=\"font-family: 'arial black', 'avant garde'; font-size: x-large;\"><STRONG><BR></STRONG></SPAN></P>\r\n<P STYLE=\"text-align: center;\"><SPAN STYLE=\"font-family: 'arial black', 'avant garde'; font-size: x-large;\"><STRONG>ELLEVEN45 LOUNGE</STRONG></SPAN></P>\r\n<P STYLE=\"text-align: center;\"><SPAN STYLE=\"font-family: 'arial black', 'avant garde'; font-size: x-large;\"><STRONG>2110 Peachtree Rd. NW.</STRONG></SPAN></P>\r\n<P STYLE=\"text-align: center;\"><SPAN STYLE=\"font-family: 'arial black', 'avant garde'; font-size: x-large;\"><STRONG>Atlanta, GA. 30309</STRONG></SPAN></P>"
      },
      "id": "9430929163",
      "url": "https://www.eventbrite.com/e/elleven45-ladies-free-all-night-tickets-9430929163?aff=ebapi",
      "vanity_url": "https://1145onfriday.eventbrite.com",
      "start": {
        "timezone": "America/New_York",
        "local": "2017-05-19T22:00:00",
        "utc": "2017-05-20T02:00:00Z"
      },
      "end": {
        "timezone": "America/New_York",
        "local": "2017-05-20T03:00:00",
        "utc": "2017-05-20T07:00:00Z"
      },
      "created": "2013-11-19T23:57:54Z",
      "changed": "2017-05-20T02:03:57Z",
      "capacity": 399999,
      "capacity_is_custom": true,
      "status": "started",
      "currency": "USD",
      "listed": true,
      "shareable": true,
      "online_event": false,
      "tx_time_limit": 480,
      "hide_start_date": false,
      "hide_end_date": false,
      "locale": "en_US",
      "is_locked": false,
      "privacy_setting": "unlocked",
      "is_series": false,
      "is_series_parent": false,
      "is_reserved_seating": false,
      "source": "create_2.0",
      "is_free": true,
      "version": "3.0.0",
      "logo_id": "31300941",
      "organizer_id": "4497001187",
      "venue_id": "14739406",
      "category_id": "110",
      "subcategory_id": "10004",
      "format_id": "11",
      "resource_uri": "https://www.eventbriteapi.com/v3/events/9430929163/",
      "logo": {
        "crop_mask": {
          "top_left": {
            "x": 0,
            "y": 316
          },
          "width": 1500,
          "height": 750
        },
        "original": {
          "url": "https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F31300941%2F68193446877%2F1%2Foriginal.jpg?s=43f9ca320387406bbc27abe8aa4af6c9",
          "width": 3840,
          "height": 2160
        },
        "id": "31300941",
        "url": "https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F31300941%2F68193446877%2F1%2Foriginal.jpg?h=200&w=450&rect=0%2C316%2C1500%2C750&s=63f0881f7b9b5e7f6ea9ace55749a0a9",
        "aspect_ratio": "2",
        "edge_color": "#6a5125",
        "edge_color_set": true
      }
    },
    {
      "name": {
        "text": "KRAVE SATURDAYS IS BACK - LADIES FREE ALL NIGHT",
        "html": "KRAVE SATURDAYS IS BACK - LADIES FREE ALL NIGHT"
      },
      "description": {
        "text": " \r\nKRAVE SATURDAYS\r\n \r\nTRUTH NIGHTCLUB\r\n (Formerly Krave, Enigma, & Throne) \r\n1100 Crescent Ave.\r\nAtlanta, Ga. 30309\r\n \r\nLADIES FREE ALL NIGHT / GUYS UNTIL MIDNIGHT \r\n \r\nRSVP AT www.TruthOnSaturday.eventbrite.com \r\n \r\nGREAT MUSIC - GREAT FOOD - HOOKAH -  PREMIUM DRINK SPECIALS - & MORE....\r\n  to book your Bottle Service Experience\r\nPLEASE TXT 770-299-3166\r\n DOORS FOR THIS EVENT OPEN AT 10PM\r\nMake sure to Follow @CirocBoyManny on INSTAGRAM & SNAPCHAT for updates and future events.\r\n",
        "html": "<P STYLE=\"text-align: center;\"> </P>\r\n<P STYLE=\"text-align: center;\"><SPAN STYLE=\"text-decoration: underline; font-size: xx-large;\"><STRONG><SPAN STYLE=\"font-family: Helvetica, sans-serif;\">KRAVE SATURDAYS</SPAN></STRONG></SPAN></P>\r\n<P STYLE=\"text-align: center;\"> </P>\r\n<P STYLE=\"text-align: center;\"><SPAN STYLE=\"font-size: x-large;\"><STRONG><SPAN STYLE=\"font-family: Helvetica, sans-serif;\">TRUTH NIGHTCLUB</SPAN></STRONG></SPAN></P>\r\n<P STYLE=\"text-align: center;\"><SPAN STYLE=\"font-size: x-large;\"><STRONG><SPAN STYLE=\"font-family: Helvetica, sans-serif;\"> (Formerly Krave, Enigma, &amp; Throne) </SPAN></STRONG></SPAN></P>\r\n<P STYLE=\"text-align: center;\"><SPAN STYLE=\"font-size: x-large;\"><STRONG><SPAN STYLE=\"font-family: Helvetica, sans-serif;\">1100 Crescent Ave.</SPAN></STRONG></SPAN></P>\r\n<P STYLE=\"text-align: center;\"><SPAN STYLE=\"font-size: x-large;\"><STRONG><SPAN STYLE=\"font-family: Helvetica, sans-serif;\">Atlanta, Ga. 30309</SPAN></STRONG></SPAN></P>\r\n<P STYLE=\"text-align: center;\"><SPAN STYLE=\"font-size: x-large; color: #ff0000;\"> </SPAN></P>\r\n<P STYLE=\"text-align: center;\"><SPAN STYLE=\"font-size: x-large; color: #ff0000;\">LADIES FREE ALL NIGHT / GUYS UNTIL MIDNIGHT</SPAN> </P>\r\n<P STYLE=\"text-align: center;\"><STRONG> </STRONG></P>\r\n<P STYLE=\"text-align: center;\"><SPAN STYLE=\"font-size: x-large;\"><STRONG>RSVP AT www.TruthOnSaturday.eventbrite.com</STRONG> </SPAN></P>\r\n<P STYLE=\"text-align: center;\"> </P>\r\n<P STYLE=\"text-align: center;\"><SPAN STYLE=\"font-family: Helvetica, sans-serif; font-size: x-large;\">GREAT MUSIC - GREAT FOOD - HOOKAH -  PREMIUM DRINK SPECIALS - &amp; MORE....</SPAN></P>\r\n<P STYLE=\"text-align: center;\"><SPAN STYLE=\"font-size: x-large;\"><SPAN STYLE=\"font-family: Helvetica, sans-serif;\"> </SPAN><SPAN STYLE=\"font-family: Helvetica, sans-serif; line-height: 1.6em;\"> to book your Bottle Service Experience</SPAN></SPAN></P>\r\n<P STYLE=\"text-align: center;\"><SPAN STYLE=\"font-family: Helvetica, sans-serif; font-size: x-large;\">PLEASE TXT</SPAN><SPAN STYLE=\"font-family: Helvetica, sans-serif; font-size: x-large;\"> 770-299-3166</SPAN></P>\r\n<P STYLE=\"text-align: center;\"><SPAN STYLE=\"font-size: x-large;\"><B><SPAN STYLE=\"font-family: Helvetica, sans-serif; color: #666666; letter-spacing: 0.4pt;\"> DOORS FOR THIS EVENT OPEN AT 10PM</SPAN></B></SPAN></P>\r\n<P STYLE=\"line-height: 19.2pt; text-align: center;\"><SPAN STYLE=\"font-size: x-large;\"><STRONG><SPAN STYLE=\"font-family: Helvetica, sans-serif; color: #666666; letter-spacing: 0.4pt;\">Make sure to Follow @CirocBoyManny on INSTAGRAM &amp; SNAPCHAT for updates and future events.</SPAN></STRONG></SPAN></P>\r\n<P STYLE=\"text-align: center;\"><BR><BR></P>"
      },
      "id": "10609472217",
      "url": "https://www.eventbrite.com/e/krave-saturdays-is-back-ladies-free-all-night-tickets-10609472217?aff=ebapi",
      "vanity_url": "https://truthonsaturday.eventbrite.com",
      "start": {
        "timezone": "America/New_York",
        "local": "2017-05-20T22:00:00",
        "utc": "2017-05-21T02:00:00Z"
      },
      "end": {
        "timezone": "America/New_York",
        "local": "2017-05-21T03:00:00",
        "utc": "2017-05-21T07:00:00Z"
      },
      "created": "2014-02-12T22:49:12Z",
      "changed": "2017-05-17T23:20:53Z",
      "capacity": 731081,
      "capacity_is_custom": true,
      "status": "live",
      "currency": "USD",
      "listed": true,
      "shareable": true,
      "online_event": false,
      "tx_time_limit": 480,
      "hide_start_date": true,
      "hide_end_date": false,
      "locale": "en_US",
      "is_locked": false,
      "privacy_setting": "unlocked",
      "is_series": false,
      "is_series_parent": false,
      "is_reserved_seating": false,
      "source": "create_2.0",
      "is_free": false,
      "version": "3.0.0",
      "logo_id": "31308710",
      "organizer_id": "11254450519",
      "venue_id": "19572974",
      "category_id": "110",
      "subcategory_id": "10001",
      "format_id": "11",
      "resource_uri": "https://www.eventbriteapi.com/v3/events/10609472217/",
      "logo": {
        "crop_mask": {
          "top_left": {
            "x": 0,
            "y": 74
          },
          "width": 640,
          "height": 320
        },
        "original": {
          "url": "https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F31308710%2F68193446877%2F1%2Foriginal.jpg?s=3bfb818d45f39f3757f29c78d01db611",
          "width": 640,
          "height": 643
        },
        "id": "31308710",
        "url": "https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F31308710%2F68193446877%2F1%2Foriginal.jpg?h=200&w=450&rect=0%2C74%2C640%2C320&s=85a78b6e5533a309c0196eecbebcc9a5",
        "aspect_ratio": "2",
        "edge_color": "#61605e",
        "edge_color_set": true
      }
    },
    {
      "name": {
        "text": "Free Galleries Ticket",
        "html": "Free Galleries Ticket"
      },
      "description": {
        "text": "Your FREE Galleries Ticket will allow you unlimited access on the day of your visit to all the displays open in our Permanent Galleries and the Wharf 7 Heritage Centre. You can also access our popular Cabinet of Curiosities  when programmed (suitable for all ages) and our Mini Mariners Play Space  - designed especially for children under age 5.\r\nTo access everything the mueum has to offer including special exhibitions and our fleet of vessels please purchase a Big Ticket.\r\nTicket is valid any day and for 12 months from date of purchase. \r\nMore information\r\nSee our Plan Your Visit page for everything you need to know about a trip to the museum.\r\nDownload our Visitor App now, before you come to the museum.Take it for a test drive today and discover just how much there is to discover - for free.http://www.anmm.gov.au/visit/app\r\nBecome a Maritime Museum Member and receive FREE or discounted entry to all our events and exhibitions, as well as many other benefits.\r\nReceive our e-newsletters for the latest news including special offers, advance bookings, sneak previews and more.\r\nConnect with us on Facebook, Twitter and Instagram for updates and to join the conversation.\r\n",
        "html": "<P><SPAN STYLE=\"font-family: arial,helvetica,sans-serif; font-size: medium;\"><STRONG>Your FREE Galleries Ticket </STRONG>will allow you <STRONG>unlimited access on the day of your visit</STRONG> to all the displays open in our <A HREF=\"http://www.anmm.gov.au/whats-on/exhibitions\" TARGET=\"_blank\" REL=\"noopener noreferrer nofollow\">Permanent Galleries</A> and the <A HREF=\"http://www.anmm.gov.au/whats-on/exhibitions/permanent/wharf-7-heritage-centre\" TARGET=\"_blank\" REL=\"noopener noreferrer nofollow\">Wharf 7 Heritage Centre</A>. You can also access our popular <A HREF=\"http://www.anmm.gov.au/whats-on/calendar/cabinet-of-curiosities\" TARGET=\"_blank\" REL=\"noopener noreferrer nofollow\">Cabinet of Curiosities</A>  when programmed (suitable for all ages) and our <A HREF=\"http://www.anmm.gov.au/whats-on/exhibitions/permanent/mini-mariners-play\" TARGET=\"_blank\" REL=\"noopener noreferrer nofollow\">Mini Mariners Play Space </A> - designed especially for children under age 5.</SPAN><BR></P>\r\n<P><SPAN STYLE=\"font-family: arial,helvetica,sans-serif; font-size: medium;\">To access everything the mueum has to offer including special exhibitions and our fleet of vessels please purchase a <STRONG><A HREF=\"https://anmmbigticket.eventbrite.com.au\">Big Ticket</A></STRONG>.</SPAN></P>\r\n<P><SPAN STYLE=\"font-family: arial,helvetica,sans-serif; font-size: medium;\"><STRONG>Ticket is valid any day and for 12 months from date of purchase. <BR></STRONG></SPAN></P>\r\n<P><SPAN STYLE=\"font-size: medium;\"><STRONG>More information</STRONG></SPAN></P>\r\n<P><SPAN STYLE=\"font-size: medium;\">See our <A HREF=\"http://www.anmm.gov.au/Visit/Plan-Your-Visit\" REL=\"nofollow\">Plan Your Visit page</A> for everything you need to know about a trip to the museum.</SPAN></P>\r\n<P><SPAN STYLE=\"font-family: helvetica; font-size: medium;\"><A HREF=\"http://www.anmm.gov.au/visit/app\" REL=\"nofollow\"><STRONG>Download our Visitor App now</STRONG></A>, before you come to the museum.<BR>Take it for a test drive today and discover just how much there is to discover - for free.<BR><A HREF=\"http://www.anmm.gov.au/visit/app\" REL=\"nofollow\">http://www.anmm.gov.au/visit/app</A></SPAN></P>\r\n<P><SPAN STYLE=\"font-size: medium;\"><A HREF=\"http://www.anmm.gov.au/Get-Involved/Membership\" REL=\"nofollow\">Become a Maritime Museum Member</A> and receive FREE or discounted entry to all our events and exhibitions, as well as many other benefits.</SPAN></P>\r\n<P><SPAN STYLE=\"font-size: medium;\"><A HREF=\"http://www.anmm.gov.au/get-involved/share-and-connect\" REL=\"nofollow\">Receive our e-newsletters</A> for the latest news including special offers, advance bookings, sneak previews and more.</SPAN></P>\r\n<P><SPAN STYLE=\"font-size: medium;\">Connect with us on <A HREF=\"http://www.facebook.com/anmmuseum\" REL=\"nofollow\">Facebook</A>, <A HREF=\"http://twitter.com/anmmuseum\" REL=\"nofollow\">Twitter</A> and <A HREF=\"http://instagram.com/anmmuseum\" REL=\"nofollow\">Instagram</A> for updates and to join the conversation.</SPAN></P>\r\n<P><BR></P>"
      },
      "id": "19411800217",
      "url": "https://www.eventbrite.com.au/e/free-galleries-ticket-tickets-19411800217?aff=ebapi",
      "start": {
        "timezone": "Australia/Sydney",
        "local": "2015-11-08T01:00:00",
        "utc": "2015-11-07T14:00:00Z"
      },
      "end": {
        "timezone": "Australia/Sydney",
        "local": "2018-12-31T23:30:00",
        "utc": "2018-12-31T12:30:00Z"
      },
      "created": "2015-11-04T21:21:24Z",
      "changed": "2017-02-07T21:42:53Z",
      "capacity": 80000,
      "capacity_is_custom": true,
      "status": "started",
      "currency": "AUD",
      "listed": true,
      "shareable": true,
      "online_event": false,
      "tx_time_limit": 480,
      "hide_start_date": true,
      "hide_end_date": true,
      "locale": "en_AU",
      "is_locked": false,
      "privacy_setting": "unlocked",
      "is_series": false,
      "is_series_parent": false,
      "is_reserved_seating": false,
      "source": "create_2.0",
      "is_free": true,
      "version": "3.0.0",
      "logo_id": "16579431",
      "organizer_id": "8233922802",
      "venue_id": "10708140",
      "category_id": "104",
      "subcategory_id": null,
      "format_id": "17",
      "resource_uri": "https://www.eventbriteapi.com/v3/events/19411800217/",
      "logo": {
        "crop_mask": {
          "top_left": {
            "x": 0,
            "y": 145
          },
          "width": 1024,
          "height": 512
        },
        "original": {
          "url": "https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F16579431%2F145182189853%2F1%2Foriginal.jpg?s=1e0dad5ec9b6b0bf86d48945bc23b5bd",
          "width": null,
          "height": null
        },
        "id": "16579431",
        "url": "https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F16579431%2F145182189853%2F1%2Foriginal.jpg?h=200&w=450&rect=0%2C145%2C1024%2C512&s=d2a8fc3870f947df2804ca40c8443c24",
        "aspect_ratio": "2",
        "edge_color": "#75889a",
        "edge_color_set": true
      }
    },
    {
      "name": {
        "text": "SATURDAY NIGHT ROOFTOP PARTY AT HUDSON TERRACE ",
        "html": "SATURDAY NIGHT ROOFTOP PARTY AT HUDSON TERRACE "
      },
      "description": {
        "text": "For BOTTLE SERVICE please email us at info@iclubnyc.com  (Add details) \r\n \r\nSATURDAY NIGHT ROOFTOP PARTY  \r\n at\r\nHUDSON TERRACE  \r\n2 LEVEL ROOFTOP NIGHTCLUB LOUNGE  \r\n621 West 46th Street \r\nMusic by : DJ DUBBS in the  Vip Red Room \r\ndoors open at 11pm\r\n2 floors\r\n2 djs \r\nFOR BOTTLE SERVICE B'DAY PARTY OR ANY EVENT Please  send us an email to info@iclubnyc.com\r\n\r\nGirls free & Gents $20 \r\n 21 and over with proper ID /FINAL ENTRENCE IS UPTO THE DOORMAN Discretion\r\n Must show tickets or SAY ICLUBNYC LIST  AT THE DOOR TO GET RIGHT IN \r\nSTRICT DRESS CODE POLICY: -Gentlemen: Shoes, Button down shirts, and jeans are acceptable. No baggy attire, Sneakers, Boots, or Hats are allowed. -Ladies: Heels are suggested.\r\n\r\n \r\nCLICK BELOW\r\nYACHT CRUISES SUNDAY MAY 28TH MEMORIAL WEEKEND \r\n",
        "html": "<H2 STYLE=\"text-align: left;\"><SPAN STYLE=\"font-size: small;\">For BOTTLE SERVICE please email us at <A HREF=\"mailto:info@iclubnyc.com\" REL=\"nofollow\">info@iclubnyc.com</A>  (Add details) <BR></SPAN></H2>\r\n<P> </P>\r\n<P><SPAN STYLE=\"color: #3366ff;\"><SPAN STYLE=\"color: #000000;\"><STRONG><SPAN STYLE=\"font-size: large;\"><STRONG STYLE=\"font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 13px;\"><SPAN STYLE=\"font-size: large;\">SATURDAY NIGHT </SPAN></STRONG>ROOFTOP PARTY  </SPAN></STRONG></SPAN></SPAN></P>\r\n<P><SPAN STYLE=\"color: #3366ff;\"><SPAN STYLE=\"color: #000000;\"><STRONG><SPAN STYLE=\"font-size: large;\"> at</SPAN></STRONG></SPAN></SPAN></P>\r\n<H3><SPAN STYLE=\"color: #000000; font-size: x-large;\"><SPAN STYLE=\"color: #993300;\">HUDSON TERRACE </SPAN> </SPAN></H3>\r\n<H3><SPAN STYLE=\"color: #000000;\">2 LEVEL ROOFTOP NIGHTCLUB LOUNGE  </SPAN></H3>\r\n<P><SPAN STYLE=\"color: #993300;\">621 West 46th Street </SPAN></P>\r\n<P>Music by : DJ DUBBS in the  Vip Red Room </P>\r\n<P><SPAN STYLE=\"letter-spacing: 0.5px;\">doors open at 11pm</SPAN></P>\r\n<P><SPAN STYLE=\"letter-spacing: 0.5px;\">2 floors</SPAN></P>\r\n<P>2 djs </P>\r\n<H3><SPAN STYLE=\"font-size: small; font-family: arial,helvetica,sans-serif;\"><STRONG><SPAN STYLE=\"color: #0000ff;\"><SPAN STYLE=\"color: #000000;\">FOR BOTTLE SERVICE B'DAY PARTY OR ANY EVENT </SPAN></SPAN></STRONG></SPAN><SPAN STYLE=\"font-size: small; font-family: arial,helvetica,sans-serif;\"><STRONG><SPAN STYLE=\"color: #0000ff;\"><SPAN STYLE=\"color: #000000;\">Please  send us an email to </SPAN></SPAN></STRONG></SPAN><A HREF=\"mailto:info@iclubnyc.com\" REL=\"nofollow\">info@iclubnyc.com</A></H3>\r\n<P STYLE=\"margin: 0px; font-size: 12px; line-height: normal; font-family: Helvetica;\"><BR></P>\r\n<P STYLE=\"margin: 0px; font-size: 12px; line-height: normal; font-family: Helvetica;\"><SPAN STYLE=\"font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 13px;\">Girls free &amp; Gents $20 <BR></SPAN></P>\r\n<P><STRONG> 21 and over with proper ID /FINAL ENTRENCE IS UPTO THE DOORMAN Discretion</STRONG></P>\r\n<P><STRONG> <SPAN STYLE=\"font-size: large;\">Must show tickets or SAY <SPAN STYLE=\"color: #ff0000;\">ICLUBNYC LIST </SPAN> AT THE DOOR TO GET RIGHT IN </SPAN></STRONG></P>\r\n<H3><SPAN STYLE=\"font-size: small; font-family: arial,helvetica,sans-serif;\"><STRONG><SPAN STYLE=\"color: #ff0000;\">STRICT DRESS CODE POLICY</SPAN>: -Gentlemen: Shoes, Button down shirts, and jeans are acceptable. No baggy attire, Sneakers, Boots, or Hats are allowed. -Ladies: Heels are suggested.</STRONG></SPAN></H3>\r\n<P><IMG ALT=\"\" SRC=\"https://cdn.evbuc.com/eventlogos/24082266/hudson.png\" HEIGHT=\"400\" WIDTH=\"600\"></P>\r\n<P> </P>\r\n<P>CLICK BELOW</P>\r\n<P><A HREF=\"https://www.eventbrite.com/e/memorial-day-weekend-yacht-cruise-tickets-34586761936\" TARGET=\"_blank\" REL=\"noopener noreferrer\"><STRONG>YACHT CRUISES SUNDAY MAY 28TH MEMORIAL WEEKEND </STRONG></A></P>\r\n<P><A HREF=\"https://www.eventbrite.com/e/memorial-day-weekend-yacht-cruise-tickets-34586761936\"><IMG ALT=\"\" SRC=\"https://cdn.evbuc.com/eventlogos/24082266/image13.png\"></IMG></A></P>"
      },
      "id": "17434703668",
      "url": "https://www.eventbrite.com/e/saturday-night-rooftop-party-at-hudson-terrace-tickets-17434703668?aff=ebapi",
      "start": {
        "timezone": "America/New_York",
        "local": "2017-05-20T23:00:00",
        "utc": "2017-05-21T03:00:00Z"
      },
      "end": {
        "timezone": "America/New_York",
        "local": "2017-05-21T04:00:00",
        "utc": "2017-05-21T08:00:00Z"
      },
      "created": "2015-06-17T22:55:40Z",
      "changed": "2017-05-15T20:42:24Z",
      "capacity": 52000,
      "capacity_is_custom": true,
      "status": "live",
      "currency": "USD",
      "listed": true,
      "shareable": true,
      "online_event": false,
      "tx_time_limit": 480,
      "hide_start_date": false,
      "hide_end_date": false,
      "locale": "en_US",
      "is_locked": false,
      "privacy_setting": "unlocked",
      "is_series": false,
      "is_series_parent": false,
      "is_reserved_seating": false,
      "source": "create_2.0",
      "is_free": true,
      "version": "3.0.0",
      "logo_id": "31328134",
      "organizer_id": "1717273352",
      "venue_id": "19628080",
      "category_id": "103",
      "subcategory_id": "3018",
      "format_id": "11",
      "resource_uri": "https://www.eventbriteapi.com/v3/events/17434703668/",
      "logo": {
        "crop_mask": {
          "top_left": {
            "x": 0,
            "y": 42
          },
          "width": 1162,
          "height": 581
        },
        "original": {
          "url": "https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F31328134%2F24250841862%2F1%2Foriginal.jpg?s=de1d1dcaa84dcc52a793187abd15679a",
          "width": 1197,
          "height": 1106
        },
        "id": "31328134",
        "url": "https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F31328134%2F24250841862%2F1%2Foriginal.jpg?h=200&w=450&rect=0%2C42%2C1162%2C581&s=739258c618283cc96874311308bfc131",
        "aspect_ratio": "2",
        "edge_color": "#352727",
        "edge_color_set": true
      }
    },
    {
      "name": {
        "text": "Big Tigger Hosts Suite Life Fridays At Suite Lounge - Free Til Midnight with RSVP",
        "html": "Big Tigger Hosts Suite Life Fridays At Suite Lounge - Free Til Midnight with RSVP"
      },
      "description": {
        "text": "\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\nSUITE LIFE FRIDAYS\r\nHOSTED BY \r\nBIG TIGGER\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n",
        "html": "<TABLE ID=\"madmimi_wrapper\" CLASS=\"borderless\" STYLE=\"color: #000000; font-family: Times; border-spacing: 0px; border-radius: 5px; margin: 0px auto; border-style: none; border-width: 0px; width: 590px; background-image: none;\">\r\n<TBODY>\r\n<TR>\r\n<TD ID=\"madmimi_body_td\" STYLE=\"border-radius: 5px 5px 0px 0px; margin: 0px; padding: 0px; background-color: #000000;\">\r\n<TABLE ID=\"subtle_wrapper\" CLASS=\"borderless\" STYLE=\"border-spacing: 0px; border-radius: 5px; margin: 0px; border-style: none; border-width: 0px; width: 590px;\">\r\n<TBODY>\r\n<TR>\r\n<TD STYLE=\"margin: 0px; padding: 0px;\">\r\n<TABLE ID=\"madmimi_header\" STYLE=\"border-collapse: collapse; border-spacing: 0px; border-radius: 5px 5px 0px 0px; margin: 0px; padding: 0px; border-style: none; border-width: 0px; width: 590px; background-image: none;\">\r\n<TBODY>\r\n<TR>\r\n<TD ID=\"madmimi_header_content\" STYLE=\"border-radius: 5px 5px 0px 0px; margin: 0px; padding: 0px;\"><IMG STYLE=\"border-radius: 4px 4px 0px 0px;\" ALT=\"FuriousLogo copy\" SRC=\"https://cascade.madmimi.com/promotion_images/1197/8294/original/FuriousLogo_copy.png?1473957906\" HEIGHT=\"208\" WIDTH=\"590\"></TD>\r\n</TR>\r\n</TBODY>\r\n</TABLE>\r\n</TD>\r\n</TR>\r\n<TR>\r\n<TD STYLE=\"margin: 0px; padding: 0px;\">\r\n<TABLE ID=\"madmimi_body\" STYLE=\"border-collapse: collapse; border-spacing: 0px; margin: 0px; padding: 0px; border-style: none; border-width: 0px; width: 590px; background-image: none;\">\r\n<TBODY>\r\n<TR>\r\n<TD ID=\"madmimi_body_content\" STYLE=\"max-width: 100%; margin: 0px; padding: 25px 30px 20px;\">\r\n<DIV CLASS=\"module text\" STYLE=\"clear: both; page-break-inside: avoid; margin: 0px; padding: 0px;\">\r\n<TABLE STYLE=\"border-collapse: collapse; border-spacing: 0px; margin: auto; border-style: none; border-width: 0px; width: 100%;\">\r\n<TBODY>\r\n<TR>\r\n<TD STYLE=\"clear: both; margin: 0px; padding: 0px;\">\r\n<DIV CLASS=\"madmimi-text-container\" STYLE=\"margin: 0px; padding: 0px;\">\r\n<P STYLE=\"line-height: 1.5em; color: #3a352a; font-family: sans-serif; font-size: 12px; text-align: center; unicode-bidi: embed; vertical-align: baseline; margin: 0px 0px 1.3em; padding: 0px;\"><SPAN STYLE=\"font-weight: bold; font-stretch: normal; font-size: 60px; line-height: normal; font-family: Arial; color: white;\">SUITE LIFE FRIDAYS</SPAN></P>\r\n<P STYLE=\"line-height: 1.5em; color: #3a352a; font-family: sans-serif; font-size: 12px; text-align: center; unicode-bidi: embed; vertical-align: baseline; margin: 0px 0px 1.3em; padding: 0px;\"><SPAN STYLE=\"font-weight: bold; font-stretch: normal; font-size: 60px; line-height: normal; font-family: Arial; color: red;\">HOSTED BY </SPAN></P>\r\n<P STYLE=\"line-height: 1.5em; color: #3a352a; font-family: sans-serif; font-size: 12px; text-align: center; unicode-bidi: embed; vertical-align: baseline; margin: 0px 0px 1.3em; padding: 0px;\"><SPAN STYLE=\"font-weight: bold; font-stretch: normal; font-size: 60px; line-height: normal; font-family: Arial; color: red;\">BIG TIGGER</SPAN></P>\r\n</DIV>\r\n</TD>\r\n</TR>\r\n</TBODY>\r\n</TABLE>\r\n</DIV>\r\n<DIV CLASS=\"module large-image-container image\" STYLE=\"clear: both; page-break-inside: avoid; margin: 0px; padding: 10px 0px 5px;\"><IMG ALT=\"\" SRC=\"https://cdn.evbuc.com/eventlogos/25222555/img20160106092440.jpg\" HEIGHT=\"600\" WIDTH=\"600\"></DIV>\r\n<DIV CLASS=\"module large-image-container image\" STYLE=\"clear: both; page-break-inside: avoid; margin: 0px; padding: 10px 0px 5px;\"><BR></DIV>\r\n</TD>\r\n</TR>\r\n</TBODY>\r\n</TABLE>\r\n</TD>\r\n</TR>\r\n</TBODY>\r\n</TABLE>\r\n</TD>\r\n</TR>\r\n</TBODY>\r\n</TABLE>"
      },
      "id": "22601901897",
      "url": "https://www.eventbrite.com/e/big-tigger-hosts-suite-life-fridays-at-suite-lounge-free-til-midnight-with-rsvp-tickets-22601901897?aff=ebapi",
      "vanity_url": "https://slfatsuitelounge.eventbrite.com",
      "start": {
        "timezone": "America/New_York",
        "local": "2017-05-19T22:00:00",
        "utc": "2017-05-20T02:00:00Z"
      },
      "end": {
        "timezone": "America/New_York",
        "local": "2017-05-20T03:00:00",
        "utc": "2017-05-20T07:00:00Z"
      },
      "created": "2016-03-05T09:02:55Z",
      "changed": "2017-05-19T17:40:17Z",
      "capacity": 160310,
      "capacity_is_custom": true,
      "status": "live",
      "currency": "USD",
      "listed": true,
      "shareable": true,
      "online_event": false,
      "tx_time_limit": 480,
      "hide_start_date": false,
      "hide_end_date": false,
      "locale": "en_US",
      "is_locked": false,
      "privacy_setting": "unlocked",
      "is_series": false,
      "is_series_parent": false,
      "is_reserved_seating": false,
      "source": "create_2.0",
      "is_free": false,
      "version": "3.0.0",
      "logo_id": "30676000",
      "organizer_id": "1964406257",
      "venue_id": "12760774",
      "category_id": "103",
      "subcategory_id": "3008",
      "format_id": "11",
      "resource_uri": "https://www.eventbriteapi.com/v3/events/22601901897/",
      "logo": {
        "crop_mask": {
          "top_left": {
            "x": 0,
            "y": 0
          },
          "width": 648,
          "height": 324
        },
        "original": {
          "url": "https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F30676000%2F25399112885%2F1%2Foriginal.jpg?s=aad7d5822407c610ad5a604bc9a55a98",
          "width": 648,
          "height": 324
        },
        "id": "30676000",
        "url": "https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F30676000%2F25399112885%2F1%2Foriginal.jpg?h=200&w=450&rect=0%2C0%2C648%2C324&s=6fe7e9025d71d5b765bee20c8046a650",
        "aspect_ratio": "2",
        "edge_color": "#1f1e1f",
        "edge_color_set": true
      }
    }]
}
*/