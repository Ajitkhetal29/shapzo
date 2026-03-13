

export type MenuItem = { label: string; href: string };

const getMenuItemsByDepartment = (department: string, _role?: string): MenuItem[] => {
  const d = department?.toLowerCase() || "";

  if (d === "admin") {
    return [
      { label: "Dashboard", href: "/dashboards/admin" },
      { label: "Users", href: "/users" },
      { label: "Warehouses", href: "/warehouse" },
      { label: "Vendors", href: "/vendor" },
      { label: "General", href: "/genral" },
      { label: "Support", href: "/support" },
      { label: "Products", href: "/products" },
      { label: "Orders", href: "/orders" },
    ];
  }

  if (d === "delivery") {
    return [
     
    ];
  }

  if (d === "support") {
    return [
 
    ];
  }

  if (d === "vendor") {
    return [
   
    ];
  }

  return [];
};

export const getDepartmentCode = (department: unknown): string => {
  if (!department) return "";
  if (typeof department === "string") return department.toLowerCase();
  const d = department as { code?: string; name?: string };
  return (d.code || d.name || "").toLowerCase();
};

export const getDepartmentName = (department: unknown): string => {
  if (!department) return "";
  if (typeof department === "string") return department;
  const d = department as { name?: string; code?: string };
  return d.name || d.code || "";
};

export const getRoleName = (role: unknown): string => {
  if (!role) return "";
  if (typeof role === "string") return role;
  const r = role as { name?: string; code?: string };
  return r.name || r.code || "";
};

export const getDashboardPath = (departmentCode: string): string =>
  departmentCode ? `/dashboards/${departmentCode}` : "/login";

export default getMenuItemsByDepartment;