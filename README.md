# LTWNC - Bài tập tuần 3 - Redux Toolkit

## Kiến trúc thư mục (Feature-based)
Dự án được tổ chức theo chuẩn Feature-based để dễ dàng quản lý state với Redux Toolkit:
- `src/app/store.ts`: Nơi cấu hình Redux store, kết hợp các reducers từ các features.
- `src/app/hooks.ts`: Khai báo typed hooks `useAppDispatch` và `useAppSelector` để sử dụng trong toàn bộ component, đảm bảo Type Safety.
- `src/features/cart/`: Chứa `cartSlice.ts` quản lý state của giỏ hàng (thêm, sửa, xoá số lượng) và component hiển thị giỏ hàng `Cart.tsx`.
- `src/features/products/`: Chứa `productsSlice.ts` quản lý state danh sách sản phẩm, gọi API bằng `createAsyncThunk` giả lập fetch từ Fake Store API, và component `Products.tsx`.

## Các chức năng chính
1. **Module Sản phẩm (`productsSlice`)**:
   - Sử dụng `createAsyncThunk` để gọi API (`https://fakestoreapi.com/products?limit=5`).
   - Xử lý các trạng thái `pending`, `fulfilled`, `rejected` trong `extraReducers`.

2. **Module Giỏ hàng (`cartSlice`)**:
   - Hỗ trợ thêm sản phẩm (nếu sản phẩm đã có trong giỏ hàng sẽ tự tăng số lượng thay vì tạo item mới).
   - Xoá sản phẩm khỏi giỏ hàng.
   - Cập nhật số lượng sản phẩm (bằng ô input số lượng).

3. **Toàn bộ dự án sử dụng Typed Hooks**:
   - Thay vì dùng `useDispatch` và `useSelector` mặc định, dự án gọi qua `useAppDispatch` và `useAppSelector` đã được cấu hình Type trong `app/hooks.ts`. Điều này giúp VSCode gợi ý code cực kỳ chuẩn xác và báo lỗi nếu gõ sai state.
