/* ═══════════════════════════════════════════════════════════════════
   CATEGORY DATA
   Edit this file to add/change photos and client info per category.

   Per-photo fields:
     src       — local path; will load this first if the file exists
     fallback  — Unsplash URL shown until you upload the real photo
     client    — who commissioned the work (or "Personal work" / "Studio")
     project   — short description of the brief or output
     year      — optional, displayed in the caption
     aspect    — 'portrait' | 'landscape' | 'square' (controls grid display)
   ═══════════════════════════════════════════════════════════════════ */

window.CATEGORY_DATA = {

  lifestyle: {
    num: '01',
    name: 'Lifestyle',
    title: 'Quiet hours, ordinary light.',
    blurb: 'Interiors, mornings, hands, and the unhurried hours between things.',
    count: '24 prints',
    photos: [
      { src: 'assets/img/lifestyle/01.jpg', fallback: 'https://images.unsplash.com/photo-1490723286627-4b66e6b2882a?w=1400&q=85&auto=format&fit=crop',
        client: 'Editorial commission', project: 'Morning light series',  year: '2024', aspect: 'portrait' },
      { src: 'assets/img/lifestyle/02.jpg', fallback: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=1400&q=85&auto=format&fit=crop',
        client: 'Personal work',         project: 'Interior study',         year: '2024', aspect: 'landscape' },
      { src: 'assets/img/lifestyle/03.jpg', fallback: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1400&q=85&auto=format&fit=crop',
        client: 'Studio session',        project: 'Golden hour',            year: '2023', aspect: 'square' },
      { src: 'assets/img/lifestyle/04.jpg', fallback: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1400&q=85&auto=format&fit=crop',
        client: 'Brand campaign',        project: 'Slow living',            year: '2024', aspect: 'portrait' },
      { src: 'assets/img/lifestyle/05.jpg', fallback: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1400&q=85&auto=format&fit=crop',
        client: 'Editorial commission',  project: 'Coffee culture',         year: '2023', aspect: 'landscape' },
      { src: 'assets/img/lifestyle/06.jpg', fallback: 'https://images.unsplash.com/photo-1493106819501-66d381c466f1?w=1400&q=85&auto=format&fit=crop',
        client: 'Personal work',         project: 'Desk diaries',           year: '2024', aspect: 'square' },
      { src: 'assets/img/lifestyle/07.jpg', fallback: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1400&q=85&auto=format&fit=crop',
        client: 'Studio session',        project: 'Living room',            year: '2023', aspect: 'portrait' },
      { src: 'assets/img/lifestyle/08.jpg', fallback: 'https://images.unsplash.com/photo-1522444690501-e21b3c9d2bf3?w=1400&q=85&auto=format&fit=crop',
        client: 'Brand campaign',        project: 'Light through linen',    year: '2024', aspect: 'landscape' },
    ],
  },

  people: {
    num: '02',
    name: 'People',
    title: 'Faces, held still.',
    blurb: 'Editorial portraits — actors, founders, artists, strangers — composed against considered light.',
    count: '31 prints',
    photos: [
      { src: 'assets/img/people/01.jpg', fallback: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=1400&q=85&auto=format&fit=crop',
        client: 'Editorial commission', project: 'Portrait series',     year: '2024', aspect: 'portrait' },
      { src: 'assets/img/people/02.jpg', fallback: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=1400&q=85&auto=format&fit=crop',
        client: 'Magazine feature',     project: 'Founder portraits',   year: '2024', aspect: 'portrait' },
      { src: 'assets/img/people/03.jpg', fallback: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1400&q=85&auto=format&fit=crop',
        client: 'Personal work',        project: 'Strangers, on the street', year: '2023', aspect: 'square' },
      { src: 'assets/img/people/04.jpg', fallback: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=1400&q=85&auto=format&fit=crop',
        client: 'Studio session',       project: 'Actor headshots',     year: '2024', aspect: 'portrait' },
      { src: 'assets/img/people/05.jpg', fallback: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1400&q=85&auto=format&fit=crop',
        client: 'Editorial commission', project: 'Off-duty',            year: '2023', aspect: 'portrait' },
      { src: 'assets/img/people/06.jpg', fallback: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=1400&q=85&auto=format&fit=crop',
        client: 'Brand campaign',       project: 'Faces of the brand',  year: '2024', aspect: 'landscape' },
      { src: 'assets/img/people/07.jpg', fallback: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=1400&q=85&auto=format&fit=crop',
        client: 'Magazine feature',     project: 'Artist at work',      year: '2023', aspect: 'square' },
      { src: 'assets/img/people/08.jpg', fallback: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=1400&q=85&auto=format&fit=crop',
        client: 'Personal work',        project: 'Studio visits',       year: '2024', aspect: 'portrait' },
    ],
  },

  products: {
    num: '03',
    name: 'Products',
    title: 'Objects, made luminous.',
    blurb: 'Still life and packaging for fragrance, jewellery, electronics and small-batch goods. Light as the brief.',
    count: '18 prints',
    photos: [
      { src: 'assets/img/products/01.jpg', fallback: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=1400&q=85&auto=format&fit=crop',
        client: 'Fragrance brand',      project: 'Hero shot',           year: '2024', aspect: 'square' },
      { src: 'assets/img/products/02.jpg', fallback: 'https://images.unsplash.com/photo-1606316585923-bdd0c0d11a08?w=1400&q=85&auto=format&fit=crop',
        client: 'Skincare label',       project: 'Pack shots',          year: '2024', aspect: 'portrait' },
      { src: 'assets/img/products/03.jpg', fallback: 'https://images.unsplash.com/photo-1604502820492-bba12c0d4e94?w=1400&q=85&auto=format&fit=crop',
        client: 'Studio session',       project: 'Still life study',    year: '2023', aspect: 'square' },
      { src: 'assets/img/products/04.jpg', fallback: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=1400&q=85&auto=format&fit=crop',
        client: 'Watchmaker',           project: 'Catalogue',           year: '2024', aspect: 'portrait' },
      { src: 'assets/img/products/05.jpg', fallback: 'https://images.unsplash.com/photo-1620552069005-43e8b6a3c0a8?w=1400&q=85&auto=format&fit=crop',
        client: 'Cosmetics brand',      project: 'Editorial campaign',  year: '2023', aspect: 'landscape' },
      { src: 'assets/img/products/06.jpg', fallback: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1400&q=85&auto=format&fit=crop',
        client: 'Tech product',         project: 'Industrial design',   year: '2024', aspect: 'square' },
    ],
  },

  automotive: {
    num: '04',
    name: 'Automotive',
    title: 'Geometry in motion.',
    blurb: 'Campaign work for manufacturers and aftermarket houses. Reflective bodies, weighted air, open roads.',
    count: '22 prints',
    photos: [
      { src: 'assets/img/automotive/01.jpg', fallback: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1400&q=85&auto=format&fit=crop',
        client: 'Manufacturer',         project: 'Hero campaign',       year: '2024', aspect: 'landscape' },
      { src: 'assets/img/automotive/02.jpg', fallback: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1400&q=85&auto=format&fit=crop',
        client: 'Aftermarket house',    project: 'Studio shoot',        year: '2023', aspect: 'portrait' },
      { src: 'assets/img/automotive/03.jpg', fallback: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1400&q=85&auto=format&fit=crop',
        client: 'Dealer commission',    project: 'On location',         year: '2024', aspect: 'landscape' },
      { src: 'assets/img/automotive/04.jpg', fallback: 'https://images.unsplash.com/photo-1571607388263-1044f9ea01dd?w=1400&q=85&auto=format&fit=crop',
        client: 'Brand campaign',       project: 'Interior detail',     year: '2024', aspect: 'square' },
      { src: 'assets/img/automotive/05.jpg', fallback: 'https://images.unsplash.com/photo-1542362567-b07e54358753?w=1400&q=85&auto=format&fit=crop',
        client: 'Personal work',        project: 'Night drive',         year: '2023', aspect: 'landscape' },
      { src: 'assets/img/automotive/06.jpg', fallback: 'https://images.unsplash.com/photo-1520031441872-265e4ff70366?w=1400&q=85&auto=format&fit=crop',
        client: 'Magazine feature',     project: 'Classic feature',     year: '2024', aspect: 'portrait' },
    ],
  },

  commercial: {
    num: '05',
    name: 'Commercial',
    title: 'Campaigns with a point of view.',
    blurb: 'Long-form collaborations with fashion houses, agencies, and creative directors who refuse the obvious.',
    count: '27 prints',
    photos: [
      { src: 'assets/img/commercial/01.jpg', fallback: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1400&q=85&auto=format&fit=crop',
        client: 'Fashion house',        project: 'Campaign',            year: '2024', aspect: 'portrait' },
      { src: 'assets/img/commercial/02.jpg', fallback: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1400&q=85&auto=format&fit=crop',
        client: 'Editorial commission', project: 'Cover story',         year: '2024', aspect: 'portrait' },
      { src: 'assets/img/commercial/03.jpg', fallback: 'https://images.unsplash.com/photo-1518049362265-d5b2a6b00b37?w=1400&q=85&auto=format&fit=crop',
        client: 'Creative director',    project: 'Lookbook',            year: '2023', aspect: 'landscape' },
      { src: 'assets/img/commercial/04.jpg', fallback: 'https://images.unsplash.com/photo-1488161628813-04466f872be2?w=1400&q=85&auto=format&fit=crop',
        client: 'Agency partnership',   project: 'Brand film stills',   year: '2024', aspect: 'square' },
      { src: 'assets/img/commercial/05.jpg', fallback: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1400&q=85&auto=format&fit=crop',
        client: 'Fashion house',        project: 'Capsule collection',  year: '2023', aspect: 'portrait' },
      { src: 'assets/img/commercial/06.jpg', fallback: 'https://images.unsplash.com/photo-1485518882345-15568b007407?w=1400&q=85&auto=format&fit=crop',
        client: 'Magazine feature',     project: 'Editorial spread',    year: '2024', aspect: 'landscape' },
    ],
  },

  food: {
    num: '06',
    name: 'Food & Drink',
    title: 'Plates, poured and lit.',
    blurb: 'Menus, cookbooks, and label work for chefs and distillers — texture on the table.',
    count: '19 prints',
    photos: [
      { src: 'assets/img/food/01.jpg', fallback: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1400&q=85&auto=format&fit=crop',
        client: 'Restaurant',           project: 'Menu refresh',        year: '2024', aspect: 'landscape' },
      { src: 'assets/img/food/02.jpg', fallback: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1400&q=85&auto=format&fit=crop',
        client: 'Cookbook',             project: 'Editorial shoot',     year: '2024', aspect: 'square' },
      { src: 'assets/img/food/03.jpg', fallback: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1400&q=85&auto=format&fit=crop',
        client: 'Chef portrait',        project: 'Plated series',       year: '2023', aspect: 'portrait' },
      { src: 'assets/img/food/04.jpg', fallback: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=1400&q=85&auto=format&fit=crop',
        client: 'Bakery',               project: 'Brand identity',      year: '2024', aspect: 'square' },
      { src: 'assets/img/food/05.jpg', fallback: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1400&q=85&auto=format&fit=crop',
        client: 'Distillery',           project: 'Label work',          year: '2023', aspect: 'portrait' },
      { src: 'assets/img/food/06.jpg', fallback: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=1400&q=85&auto=format&fit=crop',
        client: 'Restaurant',           project: 'Tasting menu',        year: '2024', aspect: 'landscape' },
    ],
  },

  hospitality: {
    num: '07',
    name: 'Restaurants & Hotels',
    title: 'Rooms that hold the light.',
    blurb: 'Hospitality stories for boutique hotels, dining rooms and atmosphere-led brands worldwide.',
    count: '26 prints',
    photos: [
      { src: 'assets/img/hospitality/01.jpg', fallback: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=1400&q=85&auto=format&fit=crop',
        client: 'Boutique hotel',       project: 'Brand imagery',       year: '2024', aspect: 'landscape' },
      { src: 'assets/img/hospitality/02.jpg', fallback: 'https://images.unsplash.com/photo-1551776235-dde6d482980b?w=1400&q=85&auto=format&fit=crop',
        client: 'Resort',               project: 'Property story',      year: '2023', aspect: 'portrait' },
      { src: 'assets/img/hospitality/03.jpg', fallback: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1400&q=85&auto=format&fit=crop',
        client: 'Fine dining',          project: 'Dining room series',  year: '2024', aspect: 'square' },
      { src: 'assets/img/hospitality/04.jpg', fallback: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1400&q=85&auto=format&fit=crop',
        client: 'Resort',               project: 'Pool & lobby',        year: '2024', aspect: 'landscape' },
      { src: 'assets/img/hospitality/05.jpg', fallback: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1400&q=85&auto=format&fit=crop',
        client: 'Boutique hotel',       project: 'Guest room',          year: '2023', aspect: 'portrait' },
      { src: 'assets/img/hospitality/06.jpg', fallback: 'https://images.unsplash.com/photo-1455587734955-081b22074882?w=1400&q=85&auto=format&fit=crop',
        client: 'Cafe',                 project: 'Counter culture',     year: '2024', aspect: 'square' },
    ],
  },

  travel: {
    num: '08',
    name: 'Travel',
    title: 'Elsewhere, on assignment.',
    blurb: 'Field work from coastal Italy, the High Atlas, Japan in the off-season, and stops in between.',
    count: '34 prints',
    photos: [
      { src: 'assets/img/travel/01.jpg', fallback: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1400&q=85&auto=format&fit=crop',
        client: 'Travel magazine',      project: 'Coastline',           year: '2024', aspect: 'landscape' },
      { src: 'assets/img/travel/02.jpg', fallback: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1400&q=85&auto=format&fit=crop',
        client: 'Personal work',        project: 'Mountain pass',       year: '2023', aspect: 'portrait' },
      { src: 'assets/img/travel/03.jpg', fallback: 'https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=1400&q=85&auto=format&fit=crop',
        client: 'Editorial commission', project: 'Italy in spring',     year: '2024', aspect: 'square' },
      { src: 'assets/img/travel/04.jpg', fallback: 'https://images.unsplash.com/photo-1517824806704-9040b037703b?w=1400&q=85&auto=format&fit=crop',
        client: 'Travel magazine',      project: 'Japan in winter',     year: '2024', aspect: 'portrait' },
      { src: 'assets/img/travel/05.jpg', fallback: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1400&q=85&auto=format&fit=crop',
        client: 'Personal work',        project: 'High Atlas',          year: '2023', aspect: 'landscape' },
      { src: 'assets/img/travel/06.jpg', fallback: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1400&q=85&auto=format&fit=crop',
        client: 'Hotel commission',     project: 'Property scout',      year: '2024', aspect: 'square' },
    ],
  },

  artwork: {
    num: '09',
    name: 'Artwork',
    title: 'Limited editions.',
    blurb: 'Self-initiated prints, occasional exhibitions, and one-off works. Available on request.',
    count: '12 prints',
    photos: [
      { src: 'assets/img/artwork/01.jpg', fallback: 'https://images.unsplash.com/photo-1549887534-1541e9326642?w=1400&q=85&auto=format&fit=crop',
        client: 'Personal work',        project: 'Edition of 12',       year: '2024', aspect: 'square' },
      { src: 'assets/img/artwork/02.jpg', fallback: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=1400&q=85&auto=format&fit=crop',
        client: 'Personal work',        project: 'Abstract studies',    year: '2024', aspect: 'portrait' },
      { src: 'assets/img/artwork/03.jpg', fallback: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=1400&q=85&auto=format&fit=crop',
        client: 'Group show',           project: 'Untitled, in colour', year: '2023', aspect: 'square' },
      { src: 'assets/img/artwork/04.jpg', fallback: 'https://images.unsplash.com/photo-1578321272125-4e4c4c3643c5?w=1400&q=85&auto=format&fit=crop',
        client: 'Personal work',        project: 'On loan',             year: '2024', aspect: 'landscape' },
      { src: 'assets/img/artwork/05.jpg', fallback: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=1400&q=85&auto=format&fit=crop',
        client: 'Edition of 8',         project: 'Sold out',            year: '2023', aspect: 'portrait' },
    ],
  },

};

/* Ordered category sequence — drives Next/Prev navigation on category pages */
window.CATEGORY_ORDER = ['lifestyle', 'people', 'products', 'automotive', 'commercial', 'food', 'hospitality', 'travel', 'artwork'];
