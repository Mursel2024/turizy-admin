// Admin panel üçün əsas JavaScript funksiyaları
document.addEventListener('DOMContentLoaded', function() {
    // Nav linklərinə klik etdikdə aktiv class əlavə et
    const navLinks = document.querySelectorAll('.admin-nav li a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Kontent bölmələrini gizlət/göstər
            const sectionId = this.getAttribute('href').substring(1);
            document.querySelectorAll('.content-section').forEach(section => {
                section.style.display = 'none';
            });
            document.getElementById(sectionId).style.display = 'block';
        });
    });
    
    // Əvvəlcə dashboard göstər
    document.querySelector('.admin-nav li a.active').click();
    
    // Yeni tur əlavə et formu
    document.getElementById('addTourBtn').addEventListener('click', function() {
        // Burada modal və ya yeni səhifə açılacaq
        alert('Yeni tur əlavə etmə formu açılacaq');
    });
    
    // Cədvəldəki düymələr üçün hadisələr
    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', function() {
            const tourId = this.closest('tr').querySelector('td:first-child').textContent;
            alert(`Tur ID ${tourId} redaktə ediləcək`);
        });
    });
    
    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', function() {
            if(confirm('Bu turu silmək istədiyinizə əminsiniz?')) {
                this.closest('tr').remove();
            }
        });
    });
});



document.addEventListener('DOMContentLoaded', () => {
  let deleteTargetRow = null;

  // Modal açma və bağlama funksiyası
  function setupModal(openBtnId, modalId) {
    const openBtn = document.getElementById(openBtnId);
    const modal = document.getElementById(modalId);
    if (!openBtn || !modal) return;

    openBtn.addEventListener('click', () => {
      modal.style.display = 'block';
    });

    modal.querySelectorAll('.close').forEach(btn => {
      btn.addEventListener('click', () => modal.style.display = 'none');
    });

    window.addEventListener('click', (e) => {
      if (e.target === modal) modal.style.display = 'none';
    });
  }

  // Modal ayarlarını quraq
  setupModal('addTourBtn', 'addTourModal');
  setupModal('manageCategoriesBtn', 'categoriesModal');
  setupModal('aiToursBtn', 'aiToursModal');

  // Event delegation ilə edit və delete düymələri üçün klik dinləyicisi
  document.addEventListener('click', (e) => {
    // Edit düyməsi kliklənəndə
    if (e.target.closest('.btn-edit')) {
      e.preventDefault();
      const editModal = document.getElementById('editTourModal');
      editModal.style.display = 'block';

      // Seçilmiş sətiri tap
      const row = e.target.closest('tr');

      // Modaldakı formu doldur
      const inputs = editModal.querySelectorAll('input, textarea, select');
      if (row && inputs.length) {
        // ID
        const id = row.querySelector('td:nth-child(1)').textContent.trim();
        // Ad
        const name = row.querySelector('td:nth-child(3)').textContent.trim();
        // Təsvir
        // Məkan
        const location = row.querySelector('td:nth-child(4)').textContent.trim();
        // gün
        const durationText = row.querySelector('td:nth-child(5)').textContent.trim();
        const duration = durationText.replace(' gün', '');
        // qiymət
        const priceText = row.querySelector('td:nth-child(6)').textContent.trim();
        const price = priceText.replace(' AZN', '');
        // status
        const statusSpan = row.querySelector('td:nth-child(7) .badge');
        const status = statusSpan && statusSpan.classList.contains('active') ? 'active' : 'inactive';
        // kateqoriya - əgər cədvəldə yoxdursa modalda default qoy
        // proqram - burda cədvəldə olmadığı üçün boş qoy

        // İndi modaldakı inputlara dəyərləri verək
        inputs.forEach(input => {
          if (input.placeholder === "Tur Adı") input.value = name;
          else if (input.placeholder === "Məkan") input.value = location;
          else if (input.placeholder === "Müddət (gün)") input.value = duration;
          else if (input.placeholder === "Qiymət") input.value = price;
          else if (input.tagName === "SELECT" && input.options.length > 0) {
            // Status seçimi
            if (input.querySelector('option[value="active"]') && input.querySelector('option[value="inactive"]')) {
              input.value = status;
            }
          }
          // Digər inputlar boş saxlanır (Təsvir, Proqram, Şəkil)
          else if (input.tagName === "TEXTAREA") {
            input.value = ""; // Əgər varsa, serverdən və ya yaddaşdan doldurmaq lazımdır
          }
        });
      }
    }

    // Delete düyməsi kliklənəndə
    else if (e.target.closest('.btn-delete')) {
      e.preventDefault();
      deleteTargetRow = e.target.closest('tr') || e.target.closest('li'); // Tr və ya kateqoriya siyahısı üçün
      document.getElementById('deleteConfirmModal').style.display = 'block';
    }

    // Silmə təsdiq modaldakı İmtina et düyməsi
    else if (e.target.classList.contains('close') && e.target.closest('.modal')) {
      e.target.closest('.modal').style.display = 'none';
    }
  });

  // Sil təsdiq düyməsi
  const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
  if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener('click', () => {
      if (deleteTargetRow) {
        deleteTargetRow.remove();
        deleteTargetRow = null;
      }
      document.getElementById('deleteConfirmModal').style.display = 'none';
    });
  }

  // Kateqoriya əlavə
  const addCategoryBtn = document.getElementById('addCategoryBtn');
  if (addCategoryBtn) {
    addCategoryBtn.addEventListener('click', () => {
      const input = document.getElementById('newCategoryInput');
      const value = input.value.trim();
      if (value) {
        const li = document.createElement('li');
        li.innerHTML = `${value} <button class="btn btn-sm btn-delete">Sil</button>`;
        document.getElementById('categoryList').appendChild(li);
        input.value = '';
      }
    });
  }

  // Yeni tur əlavə etmə formu
  const addTourForm = document.getElementById('addTourForm');
  if (addTourForm) {
    addTourForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const name = this.querySelector('input[placeholder="Tur Adı"]').value;
      const description = this.querySelector('textarea[placeholder="Təsviri"]').value;
      const location = this.querySelector('input[placeholder="Məkan"]').value;
      const duration = this.querySelector('input[placeholder="Müddət (gün)"]').value;
      const price = this.querySelector('input[placeholder="Qiymət"]').value;
      const status = this.querySelectorAll('select')[0].value;
      const category = this.querySelectorAll('select')[1].value;
      const program = this.querySelector('textarea[placeholder="Tur Proqramı (gün-gün)"]').value;

      const tbody = document.querySelector('#tours table.data-table tbody');
      const newRow = document.createElement('tr');

      const newId = tbody.children.length + 1;

      newRow.innerHTML = `
        <td>${newId}</td>
        <td><img src="./images/default-tour.jpg" class="table-image"></td>
        <td>${name}</td>
        <td>${location}</td>
        <td>${duration} gün</td>
        <td>${price} AZN</td>
        <td><span class="badge ${status === 'active' ? 'active' : ''}">${status === 'active' ? 'Aktiv' : 'Qeyri-aktiv'}</span></td>
        <td>
          <button class="btn btn-sm btn-edit"><i class="fas fa-edit"></i></button>
          <button class="btn btn-sm btn-delete"><i class="fas fa-trash"></i></button>
        </td>
      `;

      tbody.appendChild(newRow);
      this.reset();
      document.getElementById('addTourModal').style.display = 'none';
    });
  }
});


document.addEventListener('DOMContentLoaded', () => {
  const addBookingBtn = document.getElementById('addBookingBtn');
  const addBookingModal = document.getElementById('addBookingModal');
  const editBookingModal = document.getElementById('editBookingModal');
  const deleteConfirmModal = document.getElementById('deleteConfirmModal');

  let deleteTargetRow = null;
  let editTargetRow = null;

  // Modal açma bağlama funksiyası
  function setupModal(modal, openBtn) {
    openBtn.addEventListener('click', () => {
      modal.style.display = 'block';
    });
    modal.querySelectorAll('.close').forEach(btn => {
      btn.addEventListener('click', () => {
        modal.style.display = 'none';
      });
    });
    window.addEventListener('click', (e) => {
      if (e.target === modal) modal.style.display = 'none';
    });
  }

  setupModal(addBookingModal, addBookingBtn);

  // Yeni rezervasiya əlavə formu
  const addBookingForm = document.getElementById('addBookingForm');
  addBookingForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const tour = document.getElementById('bookingTour').value;
    const customer = document.getElementById('bookingCustomer').value.trim();
    const date = document.getElementById('bookingDate').value;
    const people = document.getElementById('bookingPeople').value;
    const status = document.getElementById('bookingStatus').value;

    if (!tour || !customer || !date || !people) {
      alert('Zəhmət olmasa bütün sahələri doldurun.');
      return;
    }

    const tbody = document.querySelector('#bookingTable tbody');
    const newId = tbody.children.length ? parseInt(tbody.lastElementChild.firstElementChild.textContent) + 1 : 1;

    const newRow = document.createElement('tr');
    newRow.innerHTML = `
      <td>${newId}</td>
      <td>${tour}</td>
      <td>${customer}</td>
      <td>${date}</td>
      <td>${people} nəfər</td>
      <td><span class="badge ${status === 'confirmed' ? 'active' : ''}">${status === 'confirmed' ? 'Təsdiq olunub' : status === 'pending' ? 'Gözləyir' : 'Ləğv olunub'}</span></td>
      <td>
        <button class="btn btn-sm btn-edit"><i class="fas fa-edit"></i></button>
        <button class="btn btn-sm btn-delete"><i class="fas fa-trash"></i></button>
      </td>
    `;
    tbody.appendChild(newRow);

    addBookingModal.style.display = 'none';
    addBookingForm.reset();
    attachRowEvents(newRow);
  });

  // Redaktə modalının açılması üçün funksionallıq
  function attachRowEvents(row) {
    // Redaktə düyməsi
    row.querySelector('.btn-edit').addEventListener('click', () => {
      editTargetRow = row;

      document.getElementById('editBookingId').value = row.children[0].textContent;
      document.getElementById('editBookingTour').value = row.children[1].textContent;
      document.getElementById('editBookingCustomer').value = row.children[2].textContent;
      document.getElementById('editBookingDate').value = row.children[3].textContent;
      document.getElementById('editBookingPeople').value = row.children[4].textContent.replace(' nəfər', '');
      const statusText = row.children[5].textContent.trim();
      let statusVal = 'pending';
      if (statusText === 'Təsdiq olunub') statusVal = 'confirmed';
      else if (statusText === 'Ləğv olunub') statusVal = 'cancelled';

      document.getElementById('editBookingStatus').value = statusVal;

      editBookingModal.style.display = 'block';
    });

    // Sil düyməsi
    row.querySelector('.btn-delete').addEventListener('click', () => {
      deleteTargetRow = row;
      deleteConfirmModal.style.display = 'block';
    });
  }

  // Mövcud cədvəl sətrlərinə funksiyalar əlavə et
  document.querySelectorAll('#bookingTable tbody tr').forEach(row => {
    attachRowEvents(row);
  });

  // Redaktə formunun submit-i
  const editBookingForm = document.getElementById('editBookingForm');
  editBookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!editTargetRow) return;

    editTargetRow.children[1].textContent = document.getElementById('editBookingTour').value;
    editTargetRow.children[2].textContent = document.getElementById('editBookingCustomer').value.trim();
    editTargetRow.children[3].textContent = document.getElementById('editBookingDate').value;
    editTargetRow.children[4].textContent = document.getElementById('editBookingPeople').value + ' nəfər';

    const statusVal = document.getElementById('editBookingStatus').value;
    editTargetRow.children[5].innerHTML = `<span class="badge ${statusVal === 'confirmed' ? 'active' : ''}">${
      statusVal === 'confirmed' ? 'Təsdiq olunub' : statusVal === 'pending' ? 'Gözləyir' : 'Ləğv olunub'
    }</span>`;

    editBookingModal.style.display = 'none';
    editBookingForm.reset();
  });

  // Silmə təsdiqi
  document.getElementById('confirmDeleteBtn').addEventListener('click', () => {
    if (deleteTargetRow) {
      deleteTargetRow.remove();
      deleteTargetRow = null;
    }
    deleteConfirmModal.style.display = 'none';
  });

  // ləğv düyməsi
  deleteConfirmModal.querySelectorAll('.close').forEach(btn => {
    btn.addEventListener('click', () => {
      deleteConfirmModal.style.display = 'none';
      deleteTargetRow = null;
    });
  });
});


document.addEventListener('DOMContentLoaded', () => {
  const sidebarToggle = document.getElementById('sidebarToggle');
  const sidebar = document.querySelector('.sidebar');
  const adminContent = document.querySelector('.admin-content');
  const closeBtn = document.getElementById('sidebarClose');

  // Hamburger düyməsinə klik
  sidebarToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    sidebar.classList.toggle('active');
    adminContent.classList.toggle('overlay');
  });

  // Content sahəsinə klik  sidebar bağlanır
  adminContent.addEventListener('click', () => {
    if (sidebar.classList.contains('active')) {
      sidebar.classList.remove('active');
      adminContent.classList.remove('overlay');
    }
  });

  // Sidebar-dakı X düyməsinə klik  sidebar bağlanır
  closeBtn.addEventListener('click', () => {
    sidebar.classList.remove('active');
    adminContent.classList.remove('overlay');
  });
});
