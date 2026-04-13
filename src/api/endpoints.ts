export const USERS_ENDPOINTS = {
  USER: '/user',
  USERS: '/users',
  USER_BY_ID: (id: string) => `/user/${id}`,
  ACTIVATE_USER_BY_ID: (id: string) => `/user/${id}/activate`,
  LOGIN: '/user/login',
  ME: '/user/me'
} as const

export const ROLES_ENDPOINTS = {
  ROLES: '/roles',
  ROLE: '/role',
  ROLE_BY_ID: (id: number) => `/role/${id}`,
  ACTIVATE_ROLE_BY_ID: (id: number) => `/role/${id}/activate`,
  ROLE_PERMISSIONS_BY_ID: (id: number) => `/role/${id}/permissions`
} as const

export const PERMISSIONS_ENDPOINTS = {
  PERMISSIONS: '/permissions'
} as const

export const CUSTOMERS_ENDPOINTS = {
  CUSTOMERS: '/customers',
  CUSTOMER: '/customer',
  CUSTOMER_BY_ID: (id: number) => `/customer/${id}`,
  ACTIVATE_CUSTOMER_BY_ID: (id: number) => `/customer/${id}/activate`,
} as const

export const SUPPLIERS_ENDPOINTS = {
  SUPPLIERS: '/suppliers',
  SUPPLIER: '/supplier',
  SUPPLIER_BY_ID: (id: number) => `/supplier/${id}`,
  ACTIVATE_SUPPLIER_BY_ID: (id: number) => `/supplier/${id}/activate`
} as const

export const RAW_MATERIALS_ENDPOINTS = {
  RAW_MATERIALS: '/raw-materials',
  RAW_MATERIAL: '/raw-material',
  RAW_MATERIAL_BY_ID: (id: number) => `/raw-material/${id}`,
  ACTIVATE_RAW_MATERIAL_BY_ID: (id: number) => `/raw-material/${id}/activate`
} as const

export const PACKAGING_MATERIALS_ENDPOINTS = {
  PACKAGING_MATERIALS: '/packaging-materials',
  PACKAGING_MATERIAL: '/packaging-material',
  PACKAGING_MATERIAL_BY_ID: (id: number) => `/packaging-material/${id}`,
  ACTIVATE_PACKAGING_MATERIAL_BY_ID: (id: number) => `/packaging-material/${id}/activate`
} as const

export const PRODUCTS_ENDPOINTS = {
  PRODUCTS: '/products',
  PRODUCT: '/product',
  PRODUCT_BY_ID: (id: number) => `/product/${id}`,
  ACTIVATE_PRODUCT_BY_ID: (id: number) => `/product/${id}/activate`
} as const

export const BATCHS_ENDPOINTS = {
  BATCHS: '/batchs',
  BATCH: '/batch',
  BATCH_BY_ID: (id: number) => `/batch/${id}`,
} as const

export const BATCH_ANALYSIS_ENDPOINTS = {
  BATCH_ANALYSES: '/batchs-analysis',
  BATCH_ANALYSIS: '/batch-analysis',
  BATCH_ANALYSIS_BY_ID: (id: number) => `/batch-analysis/${id}`,
  BATCH_ANALYSIS_BY_BATCH_ID: (batchId: number) => `/batch-analysis/${batchId}`,
} as const

export const PRODUCT_RECIPES_ENDPOINTS = {
  PRODUCT_RECIPES: '/product-recipes',
  PRODUCT_RECIPE_BY_PRODUCT_ID: (productId: number) => `/product-recipes/${productId}`,
  PRODUCT_RECIPE: '/product-recipe',
  PRODUCT_RECIPE_BY_ID: (id: number) => `/product-recipe/${id}`,
  ACTIVATE_PRODUCT_RECIPE_BY_ID: (id: number) => `/product-recipe/${id}/activate`,
} as const

export const PRODUCT_PACKAGE_MATERIALS_ENDPOINTS = {
  PRODUCT_PACKAGE_MATERIALS_BY_PRODUCT_ID: (productId: number) => `/product-package-materials/${productId}`,
  PRODUCT_PACKAGE_MATERIAL: '/product-package-material',
  PRODUCT_PACKAGE_MATERIAL_BY_ID: (id: number) => `/product-package-material/${id}`,
} as const

export const CUSTOMER_ORDERS_ENDPOINTS = {
  CUSTOMER_ORDERS: '/customer-orders',
  CUSTOMER_ORDER: '/customer-order',
  CUSTOMER_ORDER_BY_ID: (id: number) => `/customer-order/${id}`,
  ACTIVATE_CUSTOMER_ORDER_BY_ID: (id: number) => `/customer-order/${id}/activate`,
  CUSTOMER_ORDER_STATUSES: '/customer-order-statuses',
  CUSTOMER_ORDER_ITEM: (orderId: number) => `/customer-order/${orderId}/item`,
  CUSTOMER_ORDER_ITEM_BY_ID: (orderId: number, itemId: number) => `/customer-order/${orderId}/item/${itemId}`,
} as const

export const PRODUCT_ORDERS_ENDPOINTS = {
  PRODUCT_ORDERS: '/product-orders',
  PRODUCT_ORDER: '/product-order',
  PRODUCT_ORDER_BY_ID: (id: number) => `/product-order/${id}`,
  ACTIVATE_PRODUCT_ORDER_BY_ID: (id: number) => `/product-order/${id}/activate`,
  PRODUCT_ORDER_STATUSES: '/product-order-statuses',
  PRODUCT_ORDER_ITEM: (orderId: number) => `/product-order/${orderId}/item`,
  PRODUCT_ORDER_ITEM_BY_ID: (orderId: number, itemId: number) => `/product-order/${orderId}/item/${itemId}`,
} as const
