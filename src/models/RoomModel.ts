export interface RoomModel {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  price: number;
  location: Location;
  imageUrl: string;
  amenities: string[];
  time: number; // Timestamp
  verificationDocument: string; // URL của CMND/CCCD
  landCertificate: string; // URL của giấy chứng nhận quyền sử dụng đất
  status: 'available' | 'rented'; // Tình trạng phòng trọ
  isApproved: boolean; // Trạng thái duyệt bài đăng
  ownerName: string; // Họ và tên chủ trọ
  ownerPhone: string; // Số điện thoại chủ trọ
  ownerBankAccount: string; // Số tài khoản của chủ trọ
  isDeposited: boolean; // Trạng thái phòng đã được đặt cọc
}

export interface Location {
  address: string;
  city: string;
  district: string;
  ward: string;
  title: string;
}
