/**
 * House of Anvera - Database Seed Script
 * Run: node seed.js
 * This creates: admin user, categories, collections, and sample products
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// ─── Connect ───────────────────────────────────────────────
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => { console.error('❌ Error:', err); process.exit(1); });

// ─── Models ────────────────────────────────────────────────
const userSchema = new mongoose.Schema({
  name: String, email: String, password: String,
  role: { type: String, default: 'user' },
  isVerified: { type: Boolean, default: true },
}, { timestamps: true });

const categorySchema = new mongoose.Schema({
  name: String, slug: String, description: String,
  isActive: { type: Boolean, default: true }, sortOrder: Number,
}, { timestamps: true });

const collectionSchema = new mongoose.Schema({
  name: String, slug: String, description: String,
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  name: String, slug: String, description: String,
  shortDescription: String,
  price: Number, discountPrice: Number,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  collection: { type: mongoose.Schema.Types.ObjectId, ref: 'Collection' },
  images: [{ url: String, publicId: String, alt: String }],
  stock: Number, SKU: String,
  material: String, stone: String, weight: String, color: String,
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  reviews: [],
  isFeatured: { type: Boolean, default: false },
  isBestSeller: { type: Boolean, default: false },
  isNewArrival: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  tags: [String],
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);
const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);
const Collection = mongoose.models.Collection || mongoose.model('Collection', collectionSchema);
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

// ─── Seed Data ─────────────────────────────────────────────
const CATEGORIES = [
  { name: 'Necklaces', slug: 'necklaces', description: 'Elegant necklaces for every occasion', sortOrder: 1 },
  { name: 'Earrings', slug: 'earrings', description: 'Stunning earrings from studs to chandeliers', sortOrder: 2 },
  { name: 'Rings', slug: 'rings', description: 'Beautiful rings including engagement and wedding bands', sortOrder: 3 },
  { name: 'Bangles', slug: 'bangles', description: 'Traditional and contemporary bangles', sortOrder: 4 },
  { name: 'Bracelets', slug: 'bracelets', description: 'Delicate and statement bracelets', sortOrder: 5 },
  { name: 'Anklets', slug: 'anklets', description: 'Graceful anklets and payal', sortOrder: 6 },
];

const COLLECTIONS = [
  { name: 'Bridal Collection', slug: 'bridal', description: 'Complete bridal sets for your perfect day', isFeatured: true, isActive: true },
  { name: 'Minimal Edit', slug: 'minimal', description: 'Understated elegance for everyday luxury', isFeatured: true, isActive: true },
  { name: 'Traditional', slug: 'traditional', description: 'Time-honored designs celebrating heritage', isFeatured: true, isActive: true },
  { name: 'Festival Edit', slug: 'festival', description: 'Vibrant pieces for every celebration', isFeatured: false, isActive: true },
];

// High-quality Unsplash jewelry images
const JEWELRY_IMAGES = {
  necklace: [
    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80',
    'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=600&q=80',
    'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80',
  ],
  earring: [
    'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80',
    'https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=600&q=80',
    'https://images.unsplash.com/photo-1589128777073-263566ae5e4d?w=600&q=80',
  ],
  ring: [
    'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80',
    'https://images.unsplash.com/photo-1586104237357-fa18c91b877c?w=600&q=80',
    'https://images.unsplash.com/photo-1616690710400-a16d146927c5?w=600&q=80',
  ],
  bangle: [
    'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=600&q=80',
    'https://images.unsplash.com/photo-1624913503273-5f9c4e980dba?w=600&q=80',
  ],
};

async function seed() {
  try {
    console.log('\n🌱 Starting seed...\n');

    // ── 1. Clear existing data ────────────────────────────────
    await Promise.all([
      Category.deleteMany({}),
      Collection.deleteMany({}),
      Product.deleteMany({}),
    ]);
    console.log('🗑️  Cleared existing categories, collections, products');

    // ── 2. Admin user ─────────────────────────────────────────
    const existingAdmin = await User.findOne({ email: 'admin@houseofanvera.com' });
    if (!existingAdmin) {
      const hashed = await bcrypt.hash('Admin@123', 10);
      await User.create({
        name: 'Admin',
        email: 'admin@houseofanvera.com',
        password: hashed,
        role: 'admin',
        isVerified: true,
      });
      console.log('👤 Admin user created');
      console.log('   Email: admin@houseofanvera.com');
      console.log('   Password: Admin@123');
    } else {
      console.log('👤 Admin already exists — skipped');
    }

    // ── 3. Categories ─────────────────────────────────────────
    const createdCategories = await Category.insertMany(CATEGORIES);
    const catMap = {};
    createdCategories.forEach(c => { catMap[c.slug] = c._id; });
    console.log(`📂 Created ${createdCategories.length} categories`);

    // ── 4. Collections ────────────────────────────────────────
    const createdCollections = await Collection.insertMany(COLLECTIONS);
    const colMap = {};
    createdCollections.forEach(c => { colMap[c.slug] = c._id; });
    console.log(`🗂️  Created ${createdCollections.length} collections`);

    // ── 5. Products ───────────────────────────────────────────
    const products = [
      // NECKLACES
      {
        name: 'Rani Haar Gold Necklace',
        slug: 'rani-haar-gold-necklace',
        shortDescription: 'Handcrafted 22KT gold Rani Haar with kundan work',
        description: 'This exquisite Rani Haar is crafted in 22KT gold with intricate kundan work and meenakari detailing. Perfect for bridal occasions and grand celebrations. Each piece is handcrafted by skilled artisans from Jaipur.',
        price: 85000, discountPrice: 78500,
        category: catMap['necklaces'], collection: colMap['bridal'],
        images: [
          { url: JEWELRY_IMAGES.necklace[0], publicId: 'rani-haar-1', alt: 'Rani Haar Gold Necklace front' },
          { url: JEWELRY_IMAGES.necklace[1], publicId: 'rani-haar-2', alt: 'Rani Haar Gold Necklace detail' },
        ],
        stock: 5, SKU: 'HOA-NK-001',
        material: '22KT Gold', stone: 'Kundan, Ruby', weight: '45g', color: 'Gold',
        isFeatured: true, isBestSeller: true, isNewArrival: false,
        rating: 4.8, numReviews: 12,
        tags: ['bridal', 'gold', 'kundan', 'necklace'],
      },
      {
        name: 'Delicate Pearl Choker',
        slug: 'delicate-pearl-choker',
        shortDescription: 'Sterling silver choker with freshwater pearls',
        description: 'A timeless pearl choker in 925 sterling silver, adorned with lustrous freshwater pearls. Minimal yet striking, perfect for everyday luxury wear.',
        price: 12500, discountPrice: 9999,
        category: catMap['necklaces'], collection: colMap['minimal'],
        images: [
          { url: JEWELRY_IMAGES.necklace[2], publicId: 'pearl-choker-1', alt: 'Pearl Choker front' },
        ],
        stock: 18, SKU: 'HOA-NK-002',
        material: '925 Sterling Silver', stone: 'Freshwater Pearl', weight: '8g', color: 'Silver & White',
        isFeatured: true, isBestSeller: false, isNewArrival: true,
        rating: 4.6, numReviews: 8,
        tags: ['pearl', 'minimal', 'choker', 'silver'],
      },

      // EARRINGS
      {
        name: 'Chandbali Gold Earrings',
        slug: 'chandbali-gold-earrings',
        shortDescription: 'Traditional Chandbali earrings in 18KT gold',
        description: 'Our signature Chandbali earrings are inspired by Mughal-era jewelry, crafted in 18KT gold with hand-set polki diamonds and enamel work. A true heirloom piece.',
        price: 45000, discountPrice: 41000,
        category: catMap['earrings'], collection: colMap['traditional'],
        images: [
          { url: JEWELRY_IMAGES.earring[0], publicId: 'chandbali-1', alt: 'Chandbali Gold Earrings' },
          { url: JEWELRY_IMAGES.earring[1], publicId: 'chandbali-2', alt: 'Chandbali detail' },
        ],
        stock: 8, SKU: 'HOA-ER-001',
        material: '18KT Gold', stone: 'Polki Diamond, Enamel', weight: '12g', color: 'Gold',
        isFeatured: true, isBestSeller: true, isNewArrival: false,
        rating: 4.9, numReviews: 21,
        tags: ['chandbali', 'gold', 'traditional', 'earrings', 'bridal'],
      },
      {
        name: 'Diamond Stud Earrings',
        slug: 'diamond-stud-earrings',
        shortDescription: 'Classic solitaire diamond studs in 18KT white gold',
        description: 'Timeless diamond solitaire studs crafted in 18KT white gold. Each pair features certified F-color, VS1 clarity diamonds. The perfect everyday luxury.',
        price: 55000,
        category: catMap['earrings'], collection: colMap['minimal'],
        images: [
          { url: JEWELRY_IMAGES.earring[2], publicId: 'diamond-studs-1', alt: 'Diamond Stud Earrings' },
        ],
        stock: 12, SKU: 'HOA-ER-002',
        material: '18KT White Gold', stone: 'Diamond', weight: '3g', color: 'White Gold',
        isFeatured: false, isBestSeller: true, isNewArrival: false,
        rating: 5.0, numReviews: 34,
        tags: ['diamond', 'studs', 'white gold', 'classic'],
      },

      // RINGS
      {
        name: 'Floral Diamond Ring',
        slug: 'floral-diamond-ring',
        shortDescription: 'Floral cluster diamond ring in 18KT yellow gold',
        description: 'A breathtaking floral cluster ring featuring 0.5 carat of natural diamonds set in 18KT yellow gold. The intricate petal design makes it a statement piece for any occasion.',
        price: 68000, discountPrice: 62000,
        category: catMap['rings'], collection: colMap['bridal'],
        images: [
          { url: JEWELRY_IMAGES.ring[0], publicId: 'floral-ring-1', alt: 'Floral Diamond Ring' },
          { url: JEWELRY_IMAGES.ring[1], publicId: 'floral-ring-2', alt: 'Floral Diamond Ring angle' },
        ],
        stock: 6, SKU: 'HOA-RG-001',
        material: '18KT Yellow Gold', stone: 'Diamond (0.5ct)', weight: '5g', color: 'Gold',
        isFeatured: true, isBestSeller: false, isNewArrival: true,
        rating: 4.7, numReviews: 9,
        tags: ['diamond', 'ring', 'floral', 'engagement'],
      },
      {
        name: 'Emerald Cocktail Ring',
        slug: 'emerald-cocktail-ring',
        shortDescription: 'Bold emerald statement ring with diamond halo',
        description: 'Make an entrance with this striking cocktail ring featuring a 2ct natural Colombian emerald surrounded by a sparkling diamond halo, set in 18KT gold.',
        price: 125000, discountPrice: 115000,
        category: catMap['rings'],
        images: [
          { url: JEWELRY_IMAGES.ring[2], publicId: 'emerald-ring-1', alt: 'Emerald Cocktail Ring' },
        ],
        stock: 3, SKU: 'HOA-RG-002',
        material: '18KT Gold', stone: 'Emerald, Diamond', weight: '7g', color: 'Gold & Green',
        isFeatured: true, isBestSeller: false, isNewArrival: true,
        rating: 4.8, numReviews: 5,
        tags: ['emerald', 'ring', 'cocktail', 'luxury'],
      },

      // BANGLES
      {
        name: 'Antique Gold Bangle Set',
        slug: 'antique-gold-bangle-set',
        shortDescription: 'Set of 4 antique finish gold bangles',
        description: 'A stunning set of 4 hand-hammered gold bangles with antique finish and intricate filigree work. Inspired by traditional South Indian craftsmanship.',
        price: 35000, discountPrice: 32000,
        category: catMap['bangles'], collection: colMap['traditional'],
        images: [
          { url: JEWELRY_IMAGES.bangle[0], publicId: 'antique-bangle-1', alt: 'Antique Gold Bangle Set' },
        ],
        stock: 10, SKU: 'HOA-BG-001',
        material: '22KT Gold', stone: 'None', weight: '30g (set)', color: 'Antique Gold',
        isFeatured: false, isBestSeller: true, isNewArrival: false,
        rating: 4.5, numReviews: 16,
        tags: ['bangles', 'gold', 'antique', 'traditional', 'set'],
      },
      {
        name: 'Kundan Bangle',
        slug: 'kundan-bangle',
        shortDescription: 'Handcrafted kundan bangle with meenakari back',
        description: 'A regal kundan bangle with colorful meenakari work on the reverse. Crafted in 22KT gold by master artisans from Jaipur. Perfect for bridal wear.',
        price: 42000,
        category: catMap['bangles'], collection: colMap['bridal'],
        images: [
          { url: JEWELRY_IMAGES.bangle[1], publicId: 'kundan-bangle-1', alt: 'Kundan Bangle' },
        ],
        stock: 7, SKU: 'HOA-BG-002',
        material: '22KT Gold', stone: 'Kundan', weight: '25g', color: 'Gold & Multi',
        isFeatured: false, isBestSeller: false, isNewArrival: true,
        rating: 4.6, numReviews: 7,
        tags: ['kundan', 'bangle', 'bridal', 'meenakari'],
      },
    ];

    const created = await Product.insertMany(products);
    console.log(`💎 Created ${created.length} products`);

    console.log('\n✅ Seed complete!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔐 Admin Login:');
    console.log('   URL: http://localhost:3000/login');
    console.log('   Email: admin@houseofanvera.com');
    console.log('   Password: Admin@123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🛍️  Shop: http://localhost:3000/shop');
    console.log('⚙️  Admin: http://localhost:3000/admin');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (err) {
    console.error('❌ Seed error:', err);
  } finally {
    mongoose.connection.close();
  }
}

seed();
