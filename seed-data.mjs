import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

async function seedData() {
  console.log("Seeding initial data...");

  // Seed categories (bilingual)
  const categoryData = [
    { nameEn: "Vehicles", nameAr: "المركبات", slugEn: "vehicles", slugAr: "vehicles-ar" },
    { nameEn: "Heavy Machinery", nameAr: "الآلات الثقيلة", slugEn: "heavy-machinery", slugAr: "heavy-machinery-ar" },
    { nameEn: "Construction Equipment", nameAr: "معدات البناء", slugEn: "construction-equipment", slugAr: "construction-equipment-ar" },
    { nameEn: "Agricultural Equipment", nameAr: "المعدات الزراعية", slugEn: "agricultural-equipment", slugAr: "agricultural-equipment-ar" },
    { nameEn: "Industrial Equipment", nameAr: "المعدات الصناعية", slugEn: "industrial-equipment", slugAr: "industrial-equipment-ar" },
    { nameEn: "Tools & Equipment", nameAr: "الأدوات والمعدات", slugEn: "tools-equipment", slugAr: "tools-equipment-ar" },
  ];

  try {
    for (const cat of categoryData) {
      await connection.execute(
        "INSERT INTO categories (nameEn, nameAr, slugEn, slugAr) VALUES (?, ?, ?, ?)",
        [cat.nameEn, cat.nameAr, cat.slugEn, cat.slugAr]
      );
    }
    console.log("✓ Categories seeded");
  } catch (error) {
    console.log("Categories already exist or error:", error.message);
  }

  // Seed locations
  const locationData = [
    { city: "Riyadh", country: "Saudi Arabia", latitude: "24.7136", longitude: "46.6753" },
    { city: "Jeddah", country: "Saudi Arabia", latitude: "21.5433", longitude: "39.1728" },
    { city: "Dubai", country: "UAE", latitude: "25.2048", longitude: "55.2708" },
    { city: "Abu Dhabi", country: "UAE", latitude: "24.4539", longitude: "54.3773" },
    { city: "Cairo", country: "Egypt", latitude: "30.0444", longitude: "31.2357" },
    { city: "Doha", country: "Qatar", latitude: "25.2854", longitude: "51.5310" },
  ];

  try {
    for (const loc of locationData) {
      await connection.execute(
        "INSERT INTO locations (city, country, latitude, longitude) VALUES (?, ?, ?, ?)",
        [loc.city, loc.country, loc.latitude, loc.longitude]
      );
    }
    console.log("✓ Locations seeded");
  } catch (error) {
    console.log("Locations already exist or error:", error.message);
  }

  console.log("Seed data complete!");
  await connection.end();
  process.exit(0);
}

seedData().catch(error => {
  console.error("Seed failed:", error);
  process.exit(1);
});
