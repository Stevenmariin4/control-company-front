export interface MenuItem {
    label: string;
    link?: string; // Make it optional for items with children
    icon?: string;
    children?: MenuItem[];
    expanded?: boolean;
    order: number
  }