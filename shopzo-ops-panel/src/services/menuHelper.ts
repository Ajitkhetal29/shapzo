type User = {
  department?: { name: string } | string;
  role?: { name: string } | string;
};

const nameOf = (v: { name?: string } | string | undefined) =>
  typeof v === "object" && v ? v.name : v;

const getheaderMenuItems = (user: User | null): { label: string; href: string }[] => {
  const dept = nameOf(user?.department);
  const roleName = nameOf(user?.role);

  if (dept === "Admin") {
    switch (roleName) {
    case "Admin":
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
  }

  if (dept === "delivery") {
    return [];
  }

  if (dept === "support") {
    return [
 
    ];
  }

 
  

  return [];
};



export { getheaderMenuItems };