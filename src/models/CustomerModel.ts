export interface CustomerModel {
  id: string; // ID của khách hàng
  roomId: string; // ID của phòng liên kết
  depositorName: string; // Họ và tên người đặt cọc
  depositorPhone: string; // Số điện thoại người đặt cọc
  depositorCCCD: string; // Hình ảnh CCCD/CMND của người đặt cọc
  depositorImage: string; // Hình ảnh của người đặt cọc
  depositorNote: string; // Nội dung ghi chú của người đặt cọc
  createdAt: number; // Thời gian tạo
}
