export const APP_NAME = "BachatZone";
export const APP_DESCRIPTION = "Modern committee savings management platform";

export const COMMITTEE_FREQUENCIES = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
] as const;

export const COMMITTEE_VISIBILITIES = [
  { value: "private", label: "Private" },
  { value: "public", label: "Public" },
  { value: "invite-only", label: "Invite Only" },
] as const;

export const COMMITTEE_STATUSES = [
  { value: "draft", label: "Draft", color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300" },
  { value: "active", label: "Active", color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300" },
  { value: "completed", label: "Completed", color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300" },
  { value: "archived", label: "Archived", color: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400" },
] as const;

export const PAYMENT_STATUSES = [
  { value: "pending", label: "Pending", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300" },
  { value: "approved", label: "Approved", color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300" },
  { value: "rejected", label: "Rejected", color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300" },
  { value: "late", label: "Late", color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300" },
  { value: "overdue", label: "Overdue", color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300" },
] as const;

export const PAYMENT_METHODS = [
  { value: "bank-transfer", label: "Bank Transfer" },
  { value: "easypaisa", label: "EasyPaisa" },
  { value: "jazzcash", label: "JazzCash" },
  { value: "cash", label: "Cash" },
  { value: "mobile-wallet", label: "Mobile Wallet" },
  { value: "cheque", label: "Cheque" },
  { value: "online", label: "Online Payment" },
  { value: "other", label: "Other" },
] as const;

export const CURRENCIES = [
  { value: "PKR", label: "PKR - Pakistani Rupee", symbol: "Rs" },
  { value: "INR", label: "INR - Indian Rupee", symbol: "₹" },
  { value: "BDT", label: "BDT - Bangladeshi Taka", symbol: "৳" },
  { value: "AED", label: "AED - UAE Dirham", symbol: "د.إ" },
  { value: "SAR", label: "SAR - Saudi Riyal", symbol: "﷼" },
  { value: "USD", label: "USD - US Dollar", symbol: "$" },
  { value: "GBP", label: "GBP - British Pound", symbol: "£" },
  { value: "NGN", label: "NGN - Nigerian Naira", symbol: "₦" },
  { value: "KES", label: "KES - Kenyan Shilling", symbol: "KSh" },
  { value: "ZAR", label: "ZAR - South African Rand", symbol: "R" },
] as const;

export const COUNTRIES = [
  "Pakistan", "India", "Bangladesh", "Nepal",
  "UAE", "Saudi Arabia", "Qatar", "Bahrain", "Kuwait", "Oman",
  "Nigeria", "Kenya", "South Africa", "Ghana",
  "United Kingdom", "United States", "Canada",
] as const;

export const NAV_ITEMS = {
  // Mobile bottom nav. Profile is intentionally absent — the top bar's avatar
  // menu already owns it, and 4 tabs keeps the pill from crowding.
  main: [
    { href: "/dashboard", label: "Home", icon: "Home" },
    { href: "/committees", label: "Circles", icon: "Users" },
    { href: "/payments", label: "Payments", icon: "CreditCard" },
    { href: "/members", label: "Members", icon: "UsersRound" },
  ],
  sidebar: [
    { href: "/dashboard", label: "Dashboard", icon: "LayoutDashboard" },
    { href: "/committees", label: "Circles", icon: "Users" },
    { href: "/payments", label: "Payments", icon: "CreditCard" },
    { href: "/members", label: "Members", icon: "UsersRound" },
    { href: "/notifications", label: "Notifications", icon: "Bell" },
    { href: "/profile", label: "Profile", icon: "UserCircle" },
    { href: "/settings", label: "Settings", icon: "Settings" },
  ],
  admin: [
    { href: "/admin", label: "Dashboard", icon: "LayoutDashboard" },
    { href: "/admin/users", label: "Users", icon: "Users" },
    { href: "/admin/committees", label: "Committees", icon: "Building" },
    { href: "/admin/support", label: "Support", icon: "LifeBuoy" },
  ],
} as const;

export const QUICK_ACTIONS = [
  { label: "Pay", href: "/payments", icon: "Wallet" },
  { label: "Members", href: "/members", icon: "UsersRound" },
  { label: "Create", href: "/committees/new", icon: "Plus" },
  { label: "Invite", href: "/committees", icon: "UserPlus" },
  { label: "History", href: "/payments", icon: "History" },
] as const;
