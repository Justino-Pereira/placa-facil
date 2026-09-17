document.addEventListener('DOMContentLoaded', () => {

    // 1. ALTERNADOR DE TEMA (DARK / LIGHT)
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn ? themeToggleBtn.querySelector('i') : null;

    if (localStorage.getItem('placafacil-theme') === 'light') {
        document.body.classList.add('light-theme');
        if (themeIcon) themeIcon.classList.replace('fa-moon', 'fa-sun');
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('light-theme');
            const isLight = document.body.classList.contains('light-theme');

            if (isLight) {
                if (themeIcon) themeIcon.classList.replace('fa-moon', 'fa-sun');
                localStorage.setItem('placafacil-theme', 'light');
            } else {
                if (themeIcon) themeIcon.classList.replace('fa-sun', 'fa-moon');
                localStorage.setItem('placafacil-theme', 'dark');
            }
        });
    }

    // 2. CONTROLADOR DO CARROSSEL DE IMAGENS (LOOP INFINITO)
    const track = document.getElementById('carousel-track');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const dots = document.querySelectorAll('.dot');
    let currentIndex = 0;
    const totalSlides = dots.length;

    function updateCarousel(index) {
        // Lógica para Loop Infinito
        if (index < 0) {
            currentIndex = totalSlides - 1;
        } else if (index >= totalSlides) {
            currentIndex = 0;
        } else {
            currentIndex = index;
        }
        
        if (track) {
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
        }

        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    }

    if (nextBtn) nextBtn.addEventListener('click', () => updateCarousel(currentIndex + 1));
    if (prevBtn) prevBtn.addEventListener('click', () => updateCarousel(currentIndex - 1));

    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            const index = parseInt(e.target.getAttribute('data-index'));
            updateCarousel(index);
        });
    });

    // Rotação Automática Contínua a cada 4 segundos
    setInterval(() => {
        updateCarousel(currentIndex + 1);
    }, 4000);

    // 3. SIMULADOR DE CUSTOS DE MANUTENÇÃO
    const vehicleRadios = document.querySelectorAll('input[name="vehicle_type"]');
    const serviceCheckboxes = document.querySelectorAll('.service-option');
    const totalAmountElement = document.getElementById('total-amount');

    function calculateTotal() {
        let baseTotal = 0;
        let vehicleMultiplier = 1.0;

        vehicleRadios.forEach(radio => {
            if (radio.checked) {
                vehicleMultiplier = parseFloat(radio.value);
            }
        });

        serviceCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                baseTotal += parseInt(checkbox.value);
            }
        });

        const finalTotal = Math.round(baseTotal * vehicleMultiplier);

        if (totalAmountElement) {
            const formattedTotal = finalTotal.toLocaleString('pt-PT', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
            totalAmountElement.textContent = formattedTotal;
        }
    }

    vehicleRadios.forEach(radio => radio.addEventListener('change', calculateTotal));
    serviceCheckboxes.forEach(box => box.addEventListener('change', calculateTotal));
    calculateTotal();

    // 4. REGISTO DE AGENDAMENTO & ATUALIZAÇÃO DO PAINEL DA OFICINA
    const bookingForm = document.getElementById('booking-form');
    const toast = document.getElementById('toast');
    const agendamentosLista = document.getElementById('agendamentos-lista');

    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const cliente = document.getElementById('cliente').value;
            const matricula = document.getElementById('matricula').value;
            const data = document.getElementById('data_agendamento').value;

            if (agendamentosLista) {
                const novaLinha = document.createElement('tr');
                novaLinha.innerHTML = `
                    <td>${cliente}</td>
                    <td>${matricula}</td>
                    <td>${data}</td>
                    <td><span class="status-badge status-pending">Pendente</span></td>
                `;
                agendamentosLista.appendChild(novaLinha);
            }

            if (toast) {
                const toastMessage = document.getElementById('toast-message');
                if (toastMessage) {
                    toastMessage.textContent = `Agendamento registado para ${matricula}!`;
                }
                toast.classList.add('show');

                setTimeout(() => {
                    toast.classList.remove('show');
                }, 4000);
            }

            bookingForm.reset();
            calculateTotal();
        });
    }

}); 