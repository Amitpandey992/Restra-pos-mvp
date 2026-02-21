import { Op, FindOptions } from "sequelize";
import { ApiError } from "./ApiError";

/**
 * Creates a Sequelize 'where' clause that enforces tenant isolation.
 * Merges with existing where clauses if provided.
 *
 * @param tenantId - The UUID of the current tenant
 * @param additionalWhere - Any additional filters
 * @returns Object with 'where' clause compatible with Sequelize
 */
export const tenantScope = (
  tenantId: string,
  additionalWhere: any = {},
): any => {
  if (!tenantId) {
    throw new ApiError(500, "Secure Scope Error: Tenant ID is undefined");
  }

  // If specific ID is requested, ensure strict checking
  if (additionalWhere.id && typeof additionalWhere.id === "string") {
    return {
      where: {
        ...additionalWhere,
        tenant_id: tenantId,
      },
    };
  }

  return {
    where: {
      tenant_id: tenantId,
      ...additionalWhere,
    },
  };
};

/**
 * Validates that a foreign resource belongs to the current tenant.
 * Useful when creating relations (e.g. linking a Table to an Order).
 *
 * @param resource - The sequelize instance/record to check
 * @param tenantId - The current tenant ID
 * @param resourceName - Name for error message
 */
export const validateTenantOwnership = (
  resource: any,
  tenantId: string,
  resourceName: string = "Resource",
) => {
  if (!resource) {
    // Resource not found logic should usually be handled before, but if null passed:
    return;
  }

  // Check if resource has tenant_id
  if (resource.tenant_id !== tenantId) {
    console.error(
      `Security Violation: Attempted access to ${resourceName} ${resource.id} of tenant ${resource.tenant_id} by tenant ${tenantId}`,
    );
    // Throw 404 to hide existence of the resource, or 403 if we want to be explicit.
    // Security standard: 404 is safer to prevent enumeration, but 403 is clearer for debugging logs.
    // Let's throw 403 for internal logic, but controller should map to 404 or generic error if needed.
    throw new ApiError(
      403,
      `Access denied: ${resourceName} does not belong to your organization`,
    );
  }
};

/**
 * Wrapper for findByPk that strictly enforces tenant scoping.
 * Since findByPk doesn't accept 'where' directly in the same way findOne does for primary key,
 * we use findOne directly.
 */
export const findOneSecure = async (
  model: any,
  id: string,
  tenantId: string,
  options: any = {},
) => {
  return await model.findOne({
    ...options,
    where: {
      ...options.where,
      id: id,
      tenant_id: tenantId,
    },
  });
};
