import sequelize from "../config/database";
import Tenant from "../models/Tenant";
import Plan from "../models/Plan";
import Role from "../models/Role";
import User from "../models/User";
import Table from "../models/Table";
import MenuItem from "../models/MenuItem";
import Ingredient from "../models/Ingredient";
import Recipe from "../models/Recipe";
import RecipeItem from "../models/RecipeItem";

// Initialize models
import "../models";

async function seed() {
  try {
    await sequelize.authenticate();
    console.log("Database connected.");

    // Sync database (force: true to clear data)
    await sequelize.sync({ force: true });
    console.log("Database synced.");

    // 1. Create Plans
    const basicPlan = await Plan.create({
      name: "Basic",
      price: 399,
      duration_days: 30,
      features: { tables: 10, items: 50 },
      is_active: true,
    });

    // 2. Create Roles
    const ownerRole = await Role.create({
      name: "OWNER",
      description: "Restaurant Owner",
      permissions: ["READ_ALL", "WRITE_ALL"],
    });

    await Role.create({
      name: "SUPER_ADMIN",
      description: "Platform Admin",
      permissions: ["MANAGE_TENANTS"],
    });

    const cashierRole = await Role.create({
      name: "CASHIER",
      description: "Handles Billing & Orders",
      permissions: ["MANAGE_ORDERS", "READ_MENU", "MANAGE_PAYMENTS"],
    });

    const waiterRole = await Role.create({
      name: "WAITER",
      description: "Takes Orders & Assigns Tables",
      permissions: ["CREATE_ORDERS", "READ_MENU", "MANAGE_TABLES"],
    });

    // 3. Create Tenant
    const tenant = await Tenant.create({
      name: "Tasty Bytes",
      plan_id: basicPlan.id,
      subscription_end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      is_active: true,
      settings: {},
    });

    // 4. Create Owner User
    const owner = await User.create({
      full_name: "John Doe",
      email: "owner@tastybytes.com",
      password: "password123",
      role_id: ownerRole.id,
      tenant_id: tenant.id,
      is_active: true,
      is_verified: true,
    } as any);

    // 4b. Create Super Admin User
    const superAdminRole = await Role.findOne({ where: { name: "SUPER_ADMIN" } });
    if (superAdminRole) {
      await User.create({
        full_name: "Super Admin",
        email: "superadmin@gmail.com",
        password: "superadmin@123",
        role_id: superAdminRole.id,
        tenant_id: null,
        is_active: true,
        is_verified: true,
      } as any);
    }

    // 5. Create Tables
    await Table.bulkCreate([
      {
        tenant_id: tenant.id,
        name: "Table 1",
        capacity: 2,
        status: "available",
      },
      {
        tenant_id: tenant.id,
        name: "Table 2 (Window)",
        capacity: 4,
        status: "occupied",
      },
      {
        tenant_id: tenant.id,
        name: "Table 3",
        capacity: 6,
        status: "available",
      },
      {
        tenant_id: tenant.id,
        name: "Table 4",
        capacity: 4,
        status: "reserved",
      },
    ]);

    // 6. Create Menu Items
    const menuItems = await MenuItem.bulkCreate([
      {
        tenant_id: tenant.id,
        name: "Paneer Tikka",
        description: "Spicy cottage cheese skewers",
        price: 12.99,
        category: "starters",
        type: "veg",
        status: "available",
        image_url:
          "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=500&h=500&fit=crop",
      },
      {
        tenant_id: tenant.id,
        name: "Classic Burger",
        description: "Juicy beef patty with cheese",
        price: 14.5,
        category: "main_course",
        type: "non-veg",
        status: "available",
        image_url:
          "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&h=500&fit=crop",
      },
      {
        tenant_id: tenant.id,
        name: "Mojito",
        description: "Fresh mint and lime",
        price: 8.0,
        category: "drinks",
        type: "drink",
        status: "available",
        image_url:
          "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=500&h=500&fit=crop",
      },
    ]);

    const ingredients = await Ingredient.bulkCreate([
      {
        tenant_id: tenant.id,
        name: "Paneer (Cottage Cheese)",
        unit: "kg",
        purchase_unit: "kg",
        recipe_unit: "g",
        conversion_factor: 1000,
        cost_per_unit: 5.0,
        current_stock: 10000.0, // 10 kg
        min_stock_level: 2000.0,
      },
      {
        tenant_id: tenant.id,
        name: "Spices Mix",
        unit: "kg",
        purchase_unit: "kg",
        recipe_unit: "g",
        conversion_factor: 1000,
        cost_per_unit: 10.0,
        current_stock: 5000.0, // 5 kg
        min_stock_level: 1000.0,
      },
      {
        tenant_id: tenant.id,
        name: "Burger Bun",
        unit: "pcs",
        purchase_unit: "pack",
        recipe_unit: "pcs",
        conversion_factor: 6, // 6 pieces per pack
        cost_per_unit: 3.0,
        current_stock: 100.0,
        min_stock_level: 20.0,
      },
      {
        tenant_id: tenant.id,
        name: "Beef Patty",
        unit: "pcs",
        purchase_unit: "box",
        recipe_unit: "pcs",
        conversion_factor: 10,
        cost_per_unit: 20.0,
        current_stock: 50.0,
        min_stock_level: 10.0,
      },
      {
        tenant_id: tenant.id,
        name: "Cheddar Cheese",
        unit: "slice",
        purchase_unit: "pack",
        recipe_unit: "slice",
        conversion_factor: 50,
        cost_per_unit: 15.0,
        current_stock: 100.0,
        min_stock_level: 10.0,
      },
      {
        tenant_id: tenant.id,
        name: "Fresh Mint",
        unit: "kg",
        purchase_unit: "kg",
        recipe_unit: "g",
        conversion_factor: 1000,
        cost_per_unit: 8.0,
        current_stock: 2000.0,
        min_stock_level: 500.0,
      },
      {
        tenant_id: tenant.id,
        name: "Lime",
        unit: "pcs",
        purchase_unit: "kg",
        recipe_unit: "pcs",
        conversion_factor: 20, // ~20 limes per kg
        cost_per_unit: 4.0,
        current_stock: 50.0,
        min_stock_level: 10.0,
      },
      {
        tenant_id: tenant.id,
        name: "Soda Water",
        unit: "l",
        purchase_unit: "bottle",
        recipe_unit: "ml",
        conversion_factor: 1000,
        cost_per_unit: 1.0,
        current_stock: 24000.0,
        min_stock_level: 5000.0,
      },
    ]);

    // Helper map
    const iMap = ingredients.reduce((acc: any, curr) => {
      acc[curr.name] = curr.id;
      return acc;
    }, {});
    const mMap = menuItems.reduce((acc: any, curr) => {
      acc[curr.name] = curr.id;
      return acc;
    }, {});

    // 8. Create Recipes
    const paneerRecipe = await Recipe.create({
      tenant_id: tenant.id,
      menu_item_id: mMap["Paneer Tikka"],
      name: "Standard Paneer Tikka",
    });
    await RecipeItem.bulkCreate([
      {
        recipe_id: paneerRecipe.id,
        ingredient_id: iMap["Paneer (Cottage Cheese)"],
        quantity: 0.2,
      }, // 200g
      {
        recipe_id: paneerRecipe.id,
        ingredient_id: iMap["Spices Mix"],
        quantity: 0.01,
      }, // 10g
    ]);

    const burgerRecipe = await Recipe.create({
      tenant_id: tenant.id,
      menu_item_id: mMap["Classic Burger"],
      name: "Classic Burger Recipe",
    });
    await RecipeItem.bulkCreate([
      {
        recipe_id: burgerRecipe.id,
        ingredient_id: iMap["Burger Bun"],
        quantity: 1,
      },
      {
        recipe_id: burgerRecipe.id,
        ingredient_id: iMap["Beef Patty"],
        quantity: 1,
      },
      {
        recipe_id: burgerRecipe.id,
        ingredient_id: iMap["Cheddar Cheese"],
        quantity: 1,
      },
    ]);

    const mojitoRecipe = await Recipe.create({
      tenant_id: tenant.id,
      menu_item_id: mMap["Mojito"],
      name: "Fresh Mojito",
    });
    await RecipeItem.bulkCreate([
      {
        recipe_id: mojitoRecipe.id,
        ingredient_id: iMap["Fresh Mint"],
        quantity: 0.01,
      },
      { recipe_id: mojitoRecipe.id, ingredient_id: iMap["Lime"], quantity: 1 },
      {
        recipe_id: mojitoRecipe.id,
        ingredient_id: iMap["Soda Water"],
        quantity: 0.2,
      },
    ]);

    console.log("Seeding complete!");
    console.log("Owner Login: owner@tastybytes.com / password123");
    console.log("Super Admin Login: superadmin@gmail.com / superadmin@123");
  } catch (error) {
    console.error("Seeding failed:", error);
  } finally {
    process.exit();
  }
}

seed();
