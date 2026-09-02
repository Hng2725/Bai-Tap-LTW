# TypeScript - Quản lý đơn hàng

Ví dụ này thiết kế các kiểu dữ liệu TypeScript cơ bản cho module quản lý
đơn hàng, gồm `Order`, `OrderItem`, `Product` và `Customer`.

## Các file

- `order-types.ts`: chứa toàn bộ `interface`, `enum`, generic và Utility Types.
- `order-types.type-test.ts`: tạo dữ liệu mẫu để kiểm tra cách sử dụng các kiểu.
- `tsconfig.json`: lưu sẵn cấu hình kiểm tra TypeScript.

## Giải thích thiết kế

### Interface và enum

- `Product`, `Customer`, `OrderItem` và `Order` biểu diễn các dữ liệu chính.
- `Money` lưu cả số tiền (`amount`) và loại tiền (`currency`) để tránh nhầm đơn vị.
- `OrderStatus`, `PaymentMethod` và `Currency` là enum, giúp giới hạn các giá trị
  hợp lệ và tránh sử dụng chuỗi tùy ý.

### Generic

- `BaseEntity<TId>` dùng chung các trường `id`, `createdAt`, `updatedAt` và cho
  phép ID là `string`, `number` hoặc kiểu khác.
- `OrderItem<TProduct>` có thể chứa sản phẩm đầy đủ hoặc bản sản phẩm rút gọn.
- `Order<TId, TCustomer, TProduct>` cho phép thay đổi kiểu ID và mức độ chi tiết
  của dữ liệu khách hàng, sản phẩm.
- `ApiResponse<T>` và `PaginatedResult<T>` có thể tái sử dụng cho nhiều loại dữ
  liệu trả về từ API.

#### Generic có nhiều tham số

Trong ví dụ tổng quát `Box<T, K>`, `T` và `K` là hai tham số kiểu độc lập. Dự án
này áp dụng cùng ý tưởng tại `Order`:

```ts
interface Order<TId, TCustomer, TProduct> {
  id: TId;
  customer: TCustomer;
  items: Array<OrderItem<TProduct>>;
}
```

- `TId`: kiểu của mã đơn hàng.
- `TCustomer`: kiểu dữ liệu khách hàng lưu trong đơn.
- `TProduct`: kiểu dữ liệu sản phẩm nằm trong từng `OrderItem`.

Ví dụ `Order<string, CustomerSummary, ProductSummary>` có ID dạng `string` và
dùng các bản rút gọn của khách hàng, sản phẩm. Ngoài ra,
`CreateOrderInput<TCustomerId, TProductId>` là generic có hai tham số, tương
đương dạng `<T, K>` thường gặp trong bài học.

### Utility Types

- `Pick`: tạo `ProductSummary`, `CustomerSummary`, `OrderSummary` từ một số
  thuộc tính cần thiết của kiểu gốc.
- `Omit`: tạo các kiểu `Create...Input` bằng cách bỏ `id`, `createdAt`,
  `updatedAt` và những trường do hệ thống tự sinh.
- `Partial`: tạo các kiểu `Update...Input`, trong đó mọi trường cập nhật đều
  không bắt buộc.

Cách thiết kế này giảm khai báo trùng lặp nhưng vẫn đủ đơn giản để dùng làm ví
dụ học tập.

## Cách kiểm tra

Máy cần cài Node.js và TypeScript. Kiểm tra phiên bản TypeScript:

```powershell
tsc --version
```

Tại thư mục chứa các file, chạy lệnh ngắn sau:

```powershell
npm test
```

Lệnh sẽ kiểm tra toàn bộ kiểu dữ liệu và in ra:

```text
TypeScript check passed
```

Các tùy chọn như `strict` và `noEmit` đã được lưu trong `tsconfig.json`.

Nếu chưa cài TypeScript toàn cục, cài một lần bằng:

```powershell
npm install --global typescript
```

Đây là module khai báo kiểu nên không có màn hình hay kết quả runtime để chạy.
File `order-types.type-test.ts` đóng vai trò ví dụ sử dụng và được kiểm tra bằng
trình biên dịch TypeScript.
