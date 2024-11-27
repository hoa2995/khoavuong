let buildings = ['A', 'B', 'C']; // Initialize with existing buildings

let rooms = [
  // Building A
  {
    id: 1,
    number: "101",
    building: "A",
    maxOccupants: 4,
    currentOccupants: 0,
    price: 1500000,
    status: "available"
  },
  {
    id: 2,
    number: "102",
    building: "A", 
    maxOccupants: 4,
    currentOccupants: 0,
    price: 1500000,
    status: "available"
  },
  {
    id: 3,
    number: "103",
    building: "A",
    maxOccupants: 4,
    currentOccupants: 0,
    price: 1500000,
    status: "available"
  },
  // Building B
  {
    id: 4,
    number: "201",
    building: "B",
    maxOccupants: 6,
    currentOccupants: 0,
    price: 1200000,
    status: "available"
  },
  {
    id: 5,
    number: "202",
    building: "B",
    maxOccupants: 6,
    currentOccupants: 0,
    price: 1200000,
    status: "available"
  },
  {
    id: 6,
    number: "203",
    building: "B",
    maxOccupants: 6,
    currentOccupants: 0,
    price: 1200000,
    status: "available"
  },
  // Building C
  {
    id: 7,
    number: "301",
    building: "C",
    maxOccupants: 8,
    currentOccupants: 0,
    price: 1000000,
    status: "available"
  },
  {
    id: 8,
    number: "302",
    building: "C",
    maxOccupants: 8,
    currentOccupants: 0,
    price: 1000000,
    status: "available"
  },
  {
    id: 9,
    number: "303",
    building: "C",
    maxOccupants: 8,
    currentOccupants: 0,
    price: 1000000,
    status: "available"
  }
];

let registrations = [];
let selectedRoomId = null;
let selectedRoomForEdit = null;

function renderRoomsByBuilding(roomsToShow = rooms) {
  const roomGrid = document.getElementById('roomGrid');
  const registrationsList = document.getElementById('registrationsList');
  
  roomGrid.style.display = 'flex'; // Changed to flex for vertical layout
  registrationsList.style.display = 'none';
  
  roomGrid.innerHTML = '';
  
  buildings.forEach(building => {
    const buildingSection = document.createElement('div');
    buildingSection.className = 'building-section';
    
    const buildingHeader = document.createElement('h2');
    buildingHeader.innerHTML = `Tòa ${building}`;
    
    const buildingRooms = document.createElement('div');
    buildingRooms.className = 'building-rooms';
    buildingRooms.id = `building-${building}-rooms`;
    
    const roomsInBuilding = roomsToShow.filter(room => room.building === building);
    
    if (roomsInBuilding.length === 0) {
      buildingRooms.innerHTML = '<p class="no-rooms">Chưa có phòng trong tòa này</p>';
    } else {
      roomsInBuilding.forEach(room => {
        const roomCard = document.createElement('div');
        roomCard.className = 'room-card';
        roomCard.innerHTML = `
          <span class="room-status ${room.status}">${getStatusText(room.status)}</span>
          <h3><span class="room-number" onclick="showStudentList(${room.id})">Phòng ${room.number}</span></h3>
          <p>Tòa: ${room.building}</p>
          <p>Sức chứa: ${room.currentOccupants}/${room.maxOccupants} sinh viên</p>
          <p>Giá: ${formatPrice(room.price)} VND/học kỳ</p>
          <button onclick="openRegisterModal(${room.id})" ${room.status !== 'available' ? 'disabled' : ''}>
            ${room.status === 'available' ? 'Đăng ký' : 'Không khả dụng'}
          </button>
          <button class="edit-status-btn" onclick="openEditStatus(${room.id})">
            Chỉnh sửa trạng thái
          </button>
        `;
        buildingRooms.appendChild(roomCard);
      });
    }
    
    buildingSection.appendChild(buildingHeader);
    buildingSection.appendChild(buildingRooms);
    roomGrid.appendChild(buildingSection);
  });
}

function openAddBuilding() {
  document.getElementById('addBuildingModal').style.display = 'block';
}

function closeAddBuilding() {
  document.getElementById('addBuildingModal').style.display = 'none';
  document.getElementById('addBuildingForm').reset();
}

function addBuilding(event) {
  event.preventDefault();
  const buildingName = document.getElementById('buildingName').value.toUpperCase();
  
  if (buildings.includes(buildingName)) {
    alert('Tòa nhà này đã tồn tại!');
    return;
  }
  
  buildings.push(buildingName);
  buildings.sort(); // Sort buildings alphabetically
  
  // Update building select options
  updateBuildingSelect();
  
  closeAddBuilding();
  alert('Đã thêm tòa nhà mới thành công!');
}

function updateBuildingSelect() {
  const buildingSelect = document.getElementById('roomType');
  buildingSelect.innerHTML = buildings.map(building => 
    `<option value="${building}">Tòa ${building}</option>`
  ).join('');
}

function searchRooms() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  const filteredRooms = rooms.filter(room => 
    room.number.toLowerCase().includes(searchTerm) ||
    room.building.toLowerCase().includes(searchTerm)
  );
  renderRoomsByBuilding(filteredRooms);
}

function getStatusText(status) {
  switch(status) {
    case 'available': return 'Còn trống';
    case 'occupied': return 'Đã đủ người';
    case 'maintenance': return 'Đang bảo trì';
    case 'repairs': return 'Đang sửa chữa';
    case 'cleaning': return 'Đang dọn dẹp';
    case 'damaged': return 'Hỏng đồ đạc';
    default: return status;
  }
}

function formatPrice(price) {
  return new Intl.NumberFormat('vi-VN').format(price);
}

function filterRooms(status) {
  if (status === 'all') {
    renderRoomsByBuilding();
  } else {
    const filteredRooms = rooms.filter(room => room.status === status);
    renderRoomsByBuilding(filteredRooms);
  }
}

function toggleRoomStatus(roomId) {
  const room = rooms.find(r => r.id === roomId);
  if (room) {
    if (room.status === 'available') {
      room.currentOccupants++;
      if (room.currentOccupants >= room.maxOccupants) {
        room.status = 'occupied';
      }
    } else if (room.status === 'occupied') {
      room.currentOccupants = 0;
      room.status = 'available';
    }
    renderRoomsByBuilding();
  }
}

function openAddRoom() {
  document.getElementById('addRoomModal').style.display = 'block';
}

function closeAddRoom() {
  document.getElementById('addRoomModal').style.display = 'none';
}

function addRoom(event) {
  event.preventDefault();
  
  const newRoom = {
    id: rooms.length + 1,
    number: document.getElementById('roomNumber').value,
    building: document.getElementById('roomType').value,
    maxOccupants: Number(document.getElementById('maxOccupants').value),
    currentOccupants: 0,
    price: Number(document.getElementById('roomPrice').value),
    status: 'available'
  };
  
  rooms.push(newRoom);
  renderRoomsByBuilding();
  closeAddRoom();
  document.getElementById('addRoomForm').reset();
}

function openRegisterModal(roomId) {
  const room = rooms.find(r => r.id === roomId);
  if (room && room.status === 'available') {
    selectedRoomId = roomId;
    document.getElementById('registerModal').style.display = 'block';
  } else {
    alert('Phòng này hiện không khả dụng để đăng ký!');
  }
}

function closeRegisterModal() {
  document.getElementById('registerModal').style.display = 'none';
  document.getElementById('registerForm').reset();
  selectedRoomId = null;
}

function submitRegistration(event) {
  event.preventDefault();
  
  const room = rooms.find(r => r.id === selectedRoomId);
  if (!room) return;

  const registration = {
    id: registrations.length + 1,
    roomId: selectedRoomId,
    studentName: document.getElementById('studentName').value,
    studentId: document.getElementById('studentId').value,
    studentPhone: document.getElementById('studentPhone').value,
    studentEmail: document.getElementById('studentEmail').value,
    studentFaculty: document.getElementById('studentFaculty').value,
    registrationDate: new Date()
  };

  registrations.push(registration);
  room.currentOccupants++;
  
  if (room.currentOccupants >= room.maxOccupants) {
    room.status = 'occupied';
  }

  alert('Đăng ký phòng thành công!');
  closeRegisterModal();
  renderRoomsByBuilding();
}

function cancelRegistration(registrationId) {
  const registration = registrations.find(r => r.id === registrationId);
  if (!registration) return;
  
  const room = rooms.find(r => r.id === registration.roomId);
  if (!room) return;
  
  // Update room status
  room.currentOccupants--;
  if (room.currentOccupants < room.maxOccupants) {
    room.status = 'available';
  }
  
  // Remove registration
  registrations = registrations.filter(r => r.id !== registrationId);
  
  // Update UI
  renderRoomsByBuilding();
  showRegistrations();
  alert('Đã hủy đăng ký thành công!');
}

function showRegistrations() {
  const registrationsList = document.getElementById('registrationsList');
  const registrationsContainer = document.getElementById('registrationsContainer');
  const roomGrid = document.getElementById('roomGrid');
  
  registrationsList.style.display = 'block';
  roomGrid.style.display = 'none';
  
  registrationsContainer.innerHTML = registrations.length === 0 ? 
    '<p>Chưa có đăng ký nào</p>' : 
    registrations.map(reg => {
      const room = rooms.find(r => r.id === reg.roomId);
      return `
        <div class="registration-item">
          <div>
            <p><strong>Sinh viên:</strong> ${reg.studentName}</p>
            <p><strong>MSSV:</strong> ${reg.studentId}</p>
            <p><strong>Phòng:</strong> ${room ? room.number : 'N/A'} - Tòa ${room ? room.building : 'N/A'}</p>
            <p><strong>Ngày đăng ký:</strong> ${new Date(reg.registrationDate).toLocaleDateString('vi-VN')}</p>
          </div>
          <button class="cancel-registration" onclick="cancelRegistration(${reg.id})">Hủy đăng ký</button>
        </div>
      `;
    }).join('');
}

// New functions for editing room status
function openEditStatus(roomId) {
  selectedRoomForEdit = roomId;
  const room = rooms.find(r => r.id === roomId);
  if (room) {
    document.getElementById('roomStatus').value = room.status;
    document.getElementById('editStatusModal').style.display = 'block';
  }
}

function closeEditStatus() {
  document.getElementById('editStatusModal').style.display = 'none';
  selectedRoomForEdit = null;
}

function updateRoomStatus(event) {
  event.preventDefault();
  const room = rooms.find(r => r.id === selectedRoomForEdit);
  if (room) {
    const newStatus = document.getElementById('roomStatus').value;
    room.status = newStatus;
    
    // If room becomes unavailable, reset occupants
    if (newStatus !== 'available' && newStatus !== 'occupied') {
      room.currentOccupants = 0;
    }
    
    renderRoomsByBuilding();
    closeEditStatus();
    alert('Đã cập nhật trạng thái phòng thành công!');
  }
}

function showStudentList(roomId) {
  const room = rooms.find(r => r.id === roomId);
  if (!room) return;
  
  const roomRegistrations = registrations.filter(reg => reg.roomId === roomId);
  const container = document.getElementById('studentListContainer');
  const modal = document.getElementById('studentListModal');
  
  container.innerHTML = roomRegistrations.length === 0 ? 
    '<p class="no-students">Chưa có sinh viên trong phòng này</p>' :
    roomRegistrations.map(reg => `
      <div class="student-list-item">
        <p><strong>Họ và tên:</strong> ${reg.studentName}</p>
        <p><strong>MSSV:</strong> ${reg.studentId}</p>
        <p><strong>Số điện thoại:</strong> ${reg.studentPhone}</p>
        <p><strong>Email:</strong> ${reg.studentEmail}</p>
        <p><strong>Khoa:</strong> ${reg.studentFaculty}</p>
      </div>
    `).join('');
  
  modal.style.display = 'block';
}

function closeStudentList() {
  document.getElementById('studentListModal').style.display = 'none';
}

// Initial render
document.addEventListener('DOMContentLoaded', function() {
  updateBuildingSelect();
  renderRoomsByBuilding();
});

// Close modals when clicking outside
window.onclick = function(event) {
  const addModal = document.getElementById('addRoomModal');
  const registerModal = document.getElementById('registerModal');
  const addBuildingModal = document.getElementById('addBuildingModal');
  const editStatusModal = document.getElementById('editStatusModal');
  
  if (event.target === addModal) {
    closeAddRoom();
  }
  if (event.target === registerModal) {
    closeRegisterModal();
  }
  if (event.target === addBuildingModal) {
    closeAddBuilding();
  }
  if (event.target === editStatusModal) {
    closeEditStatus();
  }
  if (event.target === document.getElementById('studentListModal')) {
    closeStudentList();
  }
}