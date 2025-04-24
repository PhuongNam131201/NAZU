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
}

export interface Location {
  address: string;
  city: string;
  district: string;
  ward: string;
  title: string;
}
