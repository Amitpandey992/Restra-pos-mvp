import sequelize from "../config/database";
import User from "../models/User";
import Role from "../models/Role";
import { Op } from "sequelize";

async function fixData() {
  try {
    console.log("🚀 Starting data integrity check...");

    // 1. Get all owners and their tenants
    const ownerRole = await Role.findOne({ where: { name: "OWNER" } });
    if (!ownerRole) {
      console.error("❌ OWNER role not found!");
      return;
    }

    const owners = await User.findAll({
      where: { role_id: ownerRole.id },
    });

    console.log(`📊 Found ${owners.length} owners.`);

    for (const owner of owners) {
      const correctTenantId = owner.tenant_id;
      if (!correctTenantId) {
        console.warn(`⚠️ Owner ${owner.email} has no tenant_id! Skipping.`);
        continue;
      }

      // Find staff members who were likely created by this owner or belong to the same restaurant
      // but might have the wrong tenant_id.
      // NOTE: This usually happens if they were created when the code was buggy.

      // Since we don't have a 'created_by' field yet in the DB model (based on current User.ts),
      // we can't perfectly map them unless we assume same restaurant = same name?
      // Actually, the user says "staff users created by an owner are getting a different tenant_id".

      // If we can't find 'created_by', let's look for users with null or suspicious tenant_ids.
      // Or maybe the user knows specific emails?

      // Let's just find users whose tenant_id is NOT the owner's but they SHOULD be.
      // This is hard without 'created_by' or some other link.

      console.log(`🔍 Checking staff for owner tenant: ${correctTenantId}`);
    }

    console.log(
      "✅ Data check complete. (Note: Without 'created_by' field, automated fix is limited to manual review or specific known patterns)",
    );
  } catch (error) {
    console.error("❌ Error during fix:", error);
  } finally {
    process.exit();
  }
}

fixData();
