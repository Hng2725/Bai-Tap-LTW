/** Các loại tiền tệ được hệ thống hỗ trợ. */
export enum Currency {
  VND = "VND",
  USD = "USD",
  EUR = "EUR",
}

/** Trạng thái xử lý của đơn hàng. */
export enum OrderStatus {
  Pending = "PENDING",
  Confirmed = "CONFIRMED",
  Shipping = "SHIPPING",
  Completed = "COMPLETED",
  Cancelled = "CANCELLED",
}

/** Phương thức khách hàng dùng để thanh toán. */
export enum PaymentMethod {
  CashOnDelivery = "CASH_ON_DELIVERY",
  BankTransfer = "BANK_TRANSFER",
  CreditCard = "CREDIT_CARD",
  EWallet = "E_WALLET",
}

/**
 * Kiểu generic dùng chung cho các đối tượng có mã định danh và thời gian lưu.
 * TId cho phép mỗi đối tượng dùng kiểu ID phù hợp, ví dụ number hoặc string.
 */
export interface BaseEntity<TId = string> {
  id: TId;
  createdAt: Date;
  updatedAt: Date;
}

export interface Money {
  amount: number;
  currency: Currency;
}

export interface Address {
  street: string;
  ward?: string;
  district?: string;
  city: string;
  country: string;
  postalCode?: string;
}

export interface Product<TId = number> extends BaseEntity<TId> {
  name: string;
  description?: string;
  price: Money;
  stockQuantity: number;
}

export interface Customer<TId = string> extends BaseEntity<TId> {
  fullName: string;
  email: string;
  phone: string;
  address: Address;
}

/**
 * TProduct có thể là Product đầy đủ hoặc ProductSummary khi chỉ cần dữ liệu
 * cần thiết để hiển thị trong đơn hàng.
 */
export interface OrderItem<TProduct = ProductSummary> {
  product: TProduct;
  quantity: number;
  unitPrice: Money;
  subtotal: Money;
}

/**
 * Order tái sử dụng generic cho kiểu ID, dữ liệu khách hàng và dữ liệu sản phẩm.
 */
export interface Order<
  TId = string,
  TCustomer = CustomerSummary,
  TProduct = ProductSummary,
> extends BaseEntity<TId> {
  customer: TCustomer;
  items: Array<OrderItem<TProduct>>;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  shippingAddress: Address;
  totalAmount: Money;
  note?: string;
}

// Pick tạo các kiểu rút gọn, tránh khai báo lại những thuộc tính đã có.
export type ProductSummary<TId = number> = Pick<
  Product<TId>,
  "id" | "name" | "price"
>;

export type CustomerSummary<TId = string> = Pick<
  Customer<TId>,
  "id" | "fullName" | "email"
>;

export type OrderSummary<
  TId = string,
  TCustomer = CustomerSummary,
> = Pick<
  Order<TId, TCustomer>,
  "id" | "customer" | "status" | "totalAmount" | "createdAt"
>;

// Omit loại bỏ các trường do hệ thống tự sinh khi tạo mới.
export type CreateProductInput<TId = number> = Omit<
  Product<TId>,
  keyof BaseEntity<TId>
>;

export type CreateCustomerInput<TId = string> = Omit<
  Customer<TId>,
  keyof BaseEntity<TId>
>;

export type CreateOrderInput<
  TCustomerId = string,
  TProductId = number,
> = Omit<
  Order<
    string,
    CustomerSummary<TCustomerId>,
    ProductSummary<TProductId>
  >,
  keyof BaseEntity<string> | "status" | "totalAmount"
>;

// Partial biến mọi trường có thể chỉnh sửa thành không bắt buộc.
export type UpdateProductInput<TId = number> = Partial<
  CreateProductInput<TId>
>;

export type UpdateCustomerInput<TId = string> = Partial<
  CreateCustomerInput<TId>
>;

export type UpdateOrderInput = Partial<
  Pick<
    Order,
    "status" | "paymentMethod" | "shippingAddress" | "note"
  >
>;

/** Kiểu generic thống nhất dữ liệu trả về từ API. */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

/** Kiểu generic dùng cho mọi danh sách có phân trang. */
export interface PaginatedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
}
