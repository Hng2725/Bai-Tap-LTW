import {
  Currency,
  OrderStatus,
  PaymentMethod,
  type ApiResponse,
  type CreateOrderInput,
  type Customer,
  type CustomerSummary,
  type Money,
  type Order,
  type OrderItem,
  type OrderSummary,
  type PaginatedResult,
  type Product,
  type ProductSummary,
  type UpdateOrderInput,
} from "./order-types";

const product: Product = {
  id: 101,
  name: "Bàn phím cơ",
  description: "Bàn phím dùng switch cơ học",
  price: { amount: 1_500_000, currency: Currency.VND },
  stockQuantity: 20,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const productSummary: ProductSummary = {
  id: product.id,
  name: product.name,
  price: product.price,
};

const customer: Customer = {
  id: "CUS-001",
  fullName: "Nguyễn Văn An",
  email: "an@example.com",
  phone: "0901234567",
  address: {
    street: "1 Nguyễn Huệ",
    ward: "Bến Nghé",
    city: "Hà Nội",
    country: "Việt Nam",
  },
  createdAt: new Date(),
  updatedAt: new Date(),
};

const customerSummary: CustomerSummary = {
  id: customer.id,
  fullName: customer.fullName,
  email: customer.email,
};

const item: OrderItem<ProductSummary> = {
  product: productSummary,
  quantity: 2,
  unitPrice: product.price,
  subtotal: { amount: 3_000_000, currency: Currency.VND },
};

const order: Order<string, CustomerSummary> = {
  id: "ORD-001",
  customer: customerSummary,
  items: [item],
  status: OrderStatus.Pending,
  paymentMethod: PaymentMethod.CashOnDelivery,
  shippingAddress: customer.address,
  totalAmount: item.subtotal,
  note: "Giao trong giờ hành chính",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const createOrderInput: CreateOrderInput<string> = {
  customer: customerSummary,
  items: [item],
  paymentMethod: PaymentMethod.CashOnDelivery,
  shippingAddress: customer.address,
  note: order.note,
};

const updateOrderInput: UpdateOrderInput = {
  status: OrderStatus.Confirmed,
};

const orderSummary: OrderSummary = {
  id: order.id,
  customer: order.customer,
  status: order.status,
  totalAmount: order.totalAmount,
  createdAt: order.createdAt,
};

const response: ApiResponse<Order> = {
  success: true,
  data: order,
};

const page: PaginatedResult<OrderSummary> = {
  items: [orderSummary],
  page: 1,
  pageSize: 10,
  totalItems: 1,
};

const money: Money = page.items[0].totalAmount;
void createOrderInput;
void updateOrderInput;
void response;
void money;
