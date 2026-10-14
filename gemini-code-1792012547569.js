// STATE VARIABLES
let selectedAmount = 500000;
let selectedTerm = 3;
const monthlyRate = 0.0567;
let userData = null;
let userBankData = null;
let isContractSigned = false;
let isSignatureDrawn = false;

// 1. LIVE USER COUNTER LOGIC (RANDOM 100-200)
let currentLiveCount = Math.floor(Math.random() * 51) + 120; // Starts around 120-170

function updateLiveCounter() {
    const change = Math.floor(Math.random() * 3) - 1; // -1, 0, or +1
    currentLiveCount += change;
    if (currentLiveCount < 100) currentLiveCount = 105;
    if (currentLiveCount > 200) currentLiveCount = 195;

    const elDesktop = document.getElementById('live-counter');
    const elMobile = document.getElementById('live-counter-mobile');
    if (elDesktop) elDesktop.innerText = currentLiveCount;
    if (elMobile) elMobile.innerText = currentLiveCount;
}

setInterval(updateLiveCounter, 3500);

// 2. MAIN CALCULATOR LOGIC
const amountRange = document.getElementById('amount-range');
const termRange = document.getElementById('term-range');
const amountDisplay = document.getElementById('amount-display');
const termDisplay = document.getElementById('term-display');
const interestDisplay = document.getElementById('interest-display');
const monthlyPaymentDisplay = document.getElementById('monthly-payment-display');
const totalPaymentDisplay = document.getElementById('total-payment-display');

function updateCalculator() {
    if (!amountRange) return;
    selectedAmount = parseInt(amountRange.value);
    selectedTerm = parseInt(termRange.value);

    const monthlyInterest = Math.round(selectedAmount * monthlyRate);
    const totalInterest = monthlyInterest * selectedTerm;
    const totalPayment = selectedAmount + totalInterest;
    const monthlyPayment = Math.round(totalPayment / selectedTerm);

    amountDisplay.innerText = selectedAmount.toLocaleString() + ' ₮';
    termDisplay.innerText = selectedTerm + ' САР';
    interestDisplay.innerText = totalInterest.toLocaleString() + ' ₮';
    monthlyPaymentDisplay.innerText = monthlyPayment.toLocaleString() + ' ₮';
    totalPaymentDisplay.innerText = totalPayment.toLocaleString() + ' ₮';
}

if (amountRange) {
    amountRange.addEventListener('input', updateCalculator);
    termRange.addEventListener('input', updateCalculator);
    updateCalculator();
}

// 3. DASHBOARD CALCULATOR
const dashAmountRange = document.getElementById('dash-amount-range');
const dashTermRange = document.getElementById('dash-term-range');
const dashAmountVal = document.getElementById('dash-amount-val');
const dashTermVal = document.getElementById('dash-term-val');
const dashMonthlyInterestVal = document.getElementById('dash-monthly-interest-val');
const dashMonthlyPaymentVal = document.getElementById('dash-monthly-payment-val');

function updateDashboardCalc() {
    if (!dashAmountRange) return;
    selectedAmount = parseInt(dashAmountRange.value);
    selectedTerm = parseInt(dashTermRange.value);

    const monthlyInterest = Math.round(selectedAmount * monthlyRate);
    const totalInterest = monthlyInterest * selectedTerm;
    const totalPayment = selectedAmount + totalInterest;
    const monthlyPayment = Math.round(totalPayment / selectedTerm);

    dashAmountVal.innerText = selectedAmount.toLocaleString() + ' ₮';
    dashTermVal.innerText = selectedTerm + ' САР';
    dashMonthlyInterestVal.innerText = monthlyInterest.toLocaleString() + ' ₮';
    dashMonthlyPaymentVal.innerText = monthlyPayment.toLocaleString() + ' ₮';
}

if (dashAmountRange) {
    dashAmountRange.addEventListener('input', updateDashboardCalc);
    dashTermRange.addEventListener('input', updateDashboardCalc);
}

// 4. CANVAS SIGNATURE PAD LOGIC
const canvas = document.getElementById('signature-pad');
let ctx = null;
if (canvas) {
    ctx = canvas.getContext('2d');
}
let isDrawing = false;

function resizeCanvas() {
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#020617';
}

function startDrawing(e) {
    isDrawing = true;
    isSignatureDrawn = true;
    ctx.beginPath();
    const pos = getPos(e);
    ctx.moveTo(pos.x, pos.y);
}

function draw(e) {
    if (!isDrawing) return;
    const pos = getPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
}

function stopDrawing() {
    isDrawing = false;
}

function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    let clientX = e.clientX;
    let clientY = e.clientY;
    if (e.touches && e.touches[0]) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    }
    return {
        x: clientX - rect.left,
        y: clientY - rect.top
    };
}

function clearSignature() {
    if (!canvas) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    isSignatureDrawn = false;
}

if (canvas) {
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('touchstart', startDrawing);
    canvas.addEventListener('touchmove', draw);
    canvas.addEventListener('touchend', stopDrawing);
}

// 5. AUTH & MODALS LOGIC
function openAuthModal(mode) {
    document.getElementById('auth-modal').classList.remove('hidden');
    toggleModalMode(mode);
}

function closeAuthModal() {
    document.getElementById('auth-modal').classList.add('hidden');
}

function toggleModalMode(mode) {
    if (mode === 'login') {
        document.getElementById('login-form').classList.remove('hidden');
        document.getElementById('signup-form').classList.add('hidden');
        document.getElementById('modal-title').innerText = 'СИСТЕМД НЭВТРЭХ';
        document.getElementById('modal-subtitle').innerText = 'БҮРТГЭЛТЭЙ УТАСНЫ ДУГААР БОЛОН НУУЦ ҮГЭЭ ОРУУЛНА УУ.';
    } else {
        document.getElementById('login-form').classList.add('hidden');
        document.getElementById('signup-form').classList.remove('hidden');
        document.getElementById('modal-title').innerText = 'ШИНЭ БҮРТГЭЛ ҮҮСГЭХ';
        document.getElementById('modal-subtitle').innerText = 'УТАСНЫ ДУГААР БОЛОН РЕГИСТРИЙН ДУГААРАА ОРУУЛЖ ЗЭЭЛИЙН ЭРХЭЭ ТОГТООЛГОНО УУ.';
        goToStep(1);
    }
}

function goToStep(step) {
    if (step === 1) {
        document.getElementById('step-1-container').classList.remove('hidden');
        document.getElementById('step-2-container').classList.add('hidden');
        document.getElementById('step-1-badge').className = 'w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center text-xs font-black shadow-md';
        document.getElementById('step-2-badge').className = 'w-8 h-8 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-xs font-black';
    } else if (step === 2) {
        const phone = document.getElementById('reg-phone').value.trim();
        const register = document.getElementById('reg-register').value.trim();
        const lastname = document.getElementById('reg-lastname').value.trim();
        const firstname = document.getElementById('reg-firstname').value.trim();
        const email = document.getElementById('reg-email').value.trim().toLowerCase();
        const password = document.getElementById('reg-password').value.trim();

        if (!phone || !register || !lastname || !firstname || !email || !password) {
            alert('БҮХ ТАЛБАРЫГ БҮРЭН БӨГЛӨНӨ ҮҮ!');
            return;
        }

        // STRICT GMAIL VALIDATION
        if (!email.endsWith('@gmail.com')) {
            alert('И-МЭЙЛ ХАЯГ ЗААВАЛ @gmail.com БАЙХ ЕСТОЙ!');
            return;
        }

        document.getElementById('step-1-container').classList.add('hidden');
        document.getElementById('step-2-container').classList.remove('hidden');
        document.getElementById('step-1-badge').className = 'w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-black shadow-md';
        document.getElementById('step-2-badge').className = 'w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center text-xs font-black shadow-md';
    }
}

// LOCALSTORAGE SIGNUP
function handleCompleteRegistration() {
    const phone = document.getElementById('reg-phone').value.trim();
    const password = document.getElementById('reg-password').value.trim();

    const newUserData = {
        phone: phone,
        password: password,
        register: document.getElementById('reg-register').value.toUpperCase(),
        lastname: document.getElementById('reg-lastname').value.toUpperCase(),
        firstname: document.getElementById('reg-firstname').value.toUpperCase(),
        email: document.getElementById('reg-email').value.toUpperCase(),
        jobStatus: document.getElementById('reg-job-status').value,
        company: document.getElementById('reg-company').value.toUpperCase() || '-',
        address: document.getElementById('reg-address').value.toUpperCase() || '-'
    };

    localStorage.setItem(`mongolpay_user_${phone}`, JSON.stringify(newUserData));
    localStorage.setItem('mongolpay_active_session', phone);

    userData = newUserData;
    closeAuthModal();
    renderDashboard();
    alert('БҮРТГЭЛ АМЖИЛТТАЙ ҮҮСГЭГДЛЭЭ!');
}

// LOCALSTORAGE LOGIN
function handleLogin() {
    const phone = document.getElementById('login-phone').value.trim();
    const password = document.getElementById('login-password').value.trim();

    if (!phone || !password) {
        alert('УТАСНЫ ДУГААР БОЛОН НУУЦ ҮГЭЭ ОРУУЛНА УУ!');
        return;
    }

    const storedUser = localStorage.getItem(`mongolpay_user_${phone}`);
    if (!storedUser) {
        alert('БҮРТГЭЛГҮЙ УТАСНЫ ДУГААР БАЙНА!');
        return;
    }

    const parsedUser = JSON.parse(storedUser);
    if (parsedUser.password !== password) {
        alert('НУУЦ ҮГ БУРУУ БАЙНА!');
        return;
    }

    userData = parsedUser;
    localStorage.setItem('mongolpay_active_session', phone);

    closeAuthModal();
    renderDashboard();
}

// 6. DASHBOARD & DROPDOWN PROFILE MENU
function renderDashboard() {
    document.getElementById('main-view').classList.add('hidden');
    document.getElementById('dashboard-view').classList.remove('hidden');

    // NAV BAR DROPDOWN PROFILE BUTTON
    document.getElementById('nav-actions').innerHTML = `
        <div class="relative inline-block text-left">
            <button onclick="toggleProfileDropdown()" class="flex items-center gap-3 px-4 py-2 bg-slate-100 hover:bg-slate-200 border-2 border-slate-300 rounded-2xl transition shadow-md">
                <div class="w-8 h-8 rounded-xl bg-slate-950 text-white font-black flex items-center justify-center text-sm shadow-sm">
                    ${userData.firstname.charAt(0)}
                </div>
                <div class="text-left hidden sm:block">
                    <span class="block text-xs black-title">${userData.firstname}</span>
                    <span class="block text-[9px] text-brand-600 font-black">МИНИЙ ПРОФАЙЛ</span>
                </div>
                <i class="fa-solid fa-chevron-down text-xs text-slate-500"></i>
            </button>

            <!-- DROPDOWN MENU -->
            <div id="profile-dropdown" class="hidden absolute right-0 mt-2 w-56 bg-white border-2 border-slate-200 rounded-2xl shadow-2xl z-50 p-2 space-y-1">
                <button onclick="switchTab('dashboard'); closeProfileDropdown();" class="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-100 text-xs font-black text-slate-800 flex items-center gap-2.5">
                    <i class="fa-solid fa-gauge-high text-brand-600"></i> ХЯНАХ САМБАР
                </button>
                <button onclick="openEditProfileModal(); closeProfileDropdown();" class="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-100 text-xs font-black text-slate-800 flex items-center gap-2.5">
                    <i class="fa-solid fa-id-card text-brand-600"></i> МЭДЭЭЛЭЛ ЗАСАХ
                </button>
                <div class="border-t border-slate-200 my-1"></div>
                <button onclick="logout()" class="w-full text-left px-3 py-2.5 rounded-xl hover:bg-red-50 text-xs font-black text-red-600 flex items-center gap-2.5">
                    <i class="fa-solid fa-right-from-bracket"></i> СИСТЕМЭЭС ГАРАХ
                </button>
            </div>
        </div>
    `;

    document.getElementById('dash-fullname').innerText = `${userData.lastname} ${userData.firstname}`;
    document.getElementById('dash-register').innerText = `РД: ${userData.register}`;
    document.getElementById('dash-phone').innerText = userData.phone;
    document.getElementById('dash-email').innerText = userData.email;
    document.getElementById('dash-job').innerText = userData.jobStatus;
    document.getElementById('dash-address').innerText = userData.address;
    document.getElementById('dash-avatar').innerText = userData.firstname.charAt(0);

    updateDashboardCalc();
    updateDashboardState();
}

function toggleProfileDropdown() {
    const dropdown = document.getElementById('profile-dropdown');
    if (dropdown) dropdown.classList.toggle('hidden');
}

function closeProfileDropdown() {
    const dropdown = document.getElementById('profile-dropdown');
    if (dropdown) dropdown.classList.add('hidden');
}

function updateDashboardState() {
    const actionBtn = document.getElementById('main-action-btn');
    const statusTitle = document.getElementById('dash-loan-status-title');
    const contractBadge = document.getElementById('dash-contract-badge');
    const approvedBanner = document.getElementById('approved-limit-banner');

    if (!isContractSigned) {
        approvedBanner.classList.add('hidden');
        statusTitle.innerText = "ГЭРЭЭ БАЙГУУЛАХ ШААРДЛАГАТАЙ";
        contractBadge.innerText = "ГЭРЭЭ ХҮЛЭЭГДЭЖ БАЙНА";
        contractBadge.className = "px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-900 border-2 border-amber-300 text-xs font-black";
        actionBtn.innerHTML = `<span>ГЭРЭЭ БАЙГУУЛАХ</span><i class="fa-solid fa-file-contract text-lg"></i>`;
        actionBtn.setAttribute('onclick', 'openContractModal()');
    } else {
        approvedBanner.classList.remove('hidden');
        statusTitle.innerText = "ЗЭЭЛ АВАХ БОЛОМЖТОЙ";
        contractBadge.innerText = "ГЭРЭЭ БАЙГУУЛАГДСАН";
        contractBadge.className = "px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-900 border-2 border-emerald-300 text-xs font-black";
        actionBtn.innerHTML = `<span>ЗЭЭЛ АВАХ</span><i class="fa-solid fa-arrow-right text-lg"></i>`;
        actionBtn.setAttribute('onclick', 'openBankAccountModal()');
    }
}

// EDIT PROFILE MODAL
function openEditProfileModal() {
    if (!userData) return;
    document.getElementById('edit-register').value = userData.register;
    document.getElementById('edit-email').value = userData.email;
    document.getElementById('edit-address').value = userData.address;
    document.getElementById('edit-profile-modal').classList.remove('hidden');
}

function closeEditProfileModal() {
    document.getElementById('edit-profile-modal').classList.add('hidden');
}

function saveProfileChanges() {
    const newEmail = document.getElementById('edit-email').value.toUpperCase().trim();
    if (!newEmail.endsWith('@GMAIL.COM')) {
        alert('И-МЭЙЛ ХАЯГ ЗААВАЛ @gmail.com БАЙХ ЕСТОЙ!');
        return;
    }

    userData.email = newEmail;
    userData.address = document.getElementById('edit-address').value.toUpperCase().trim();

    localStorage.setItem(`mongolpay_user_${userData.phone}`, JSON.stringify(userData));
    renderDashboard();
    closeEditProfileModal();
    alert('ХУВИЙН МЭДЭЭЛЭЛ АМЖИЛТТАЙ ШИНЭЧЛЭГДЛЭЭ!');
}

// CONTRACT MODAL
function openContractModal() {
    document.getElementById('contract-modal').classList.remove('hidden');
    setTimeout(resizeCanvas, 100);
}

function closeContractModal() {
    document.getElementById('contract-modal').classList.add('hidden');
}

function signContract() {
    if (!isSignatureDrawn) {
        alert('ГЭРЭЭГ БАТАЛГААЖУУЛАХЫН ТУЛД ЦАХИМ ГАРЫН ҮСГЭЭ ЗУРНА УУ!');
        return;
    }

    isContractSigned = true;
    closeContractModal();
    updateDashboardState();
    alert('ГЭРЭЭ АМЖИЛТТАЙ БАЙГУУЛАГДАЖ, БОЛОМЖИТ ЗЭЭЛИЙН ЭРХ 1,000,000 ₮ НЭЭГДЛЭЭ!');
}

// BANK ACCOUNT MODAL
function openBankAccountModal() {
    document.getElementById('bank-account-modal').classList.remove('hidden');
}

function closeBankAccountModal() {
    document.getElementById('bank-account-modal').classList.add('hidden');
}

function submitBankAccount() {
    const bankName = document.getElementById('user-bank-name').value;
    const bankAcc = document.getElementById('user-bank-account').value.trim();

    if (!bankAcc) {
        alert('ДАНСНЫ ДУГААРАА ОРУУЛНА УУ!');
        return;
    }

    userBankData = { bankName, bankAcc };
    document.getElementById('dash-bank-name').innerText = bankName;
    document.getElementById('dash-bank-acc').innerText = bankAcc;

    closeBankAccountModal();
    openAdvancePaymentModal();
}

// ADVANCE PAYMENT MODAL
function openAdvancePaymentModal() {
    const monthlyInterest = Math.round(selectedAmount * monthlyRate);
    const totalInterest = monthlyInterest * selectedTerm;
    document.getElementById('pay-total-interest').innerText = totalInterest.toLocaleString() + ' ₮';
    
    const randomCode = Math.floor(100000 + Math.random() * 900000);
    document.getElementById('pay-tx-code').innerText = randomCode;

    document.getElementById('advance-payment-modal').classList.remove('hidden');
}

function closeAdvancePaymentModal() {
    document.getElementById('advance-payment-modal').classList.add('hidden');
}

function startPaymentCountdown() {
    document.getElementById('pay-spinner').classList.remove('hidden');
    document.getElementById('countdown-container').classList.remove('hidden');

    let timeLeft = 3;
    const timerDisplay = document.getElementById('timer-display');

    const countdownInterval = setInterval(() => {
        timerDisplay.innerText = `00:0${timeLeft}`;
        
        if (timeLeft <= 0) {
            clearInterval(countdownInterval);
            timerDisplay.innerText = "БАТАЛГААЖЛАА!";
            setTimeout(() => {
                closeAdvancePaymentModal();
                alert('УРЬДЧИЛСАН ХҮҮ АМЖИЛТТАЙ ТӨЛӨГДӨЖ, ТАНИЙ ЗЭЭЛ ТАНИЙ ДАНС РУУ ШИЛЖЛЭЭ!');
            }, 500);
        }
        timeLeft--;
    }, 1000);
}

function switchTab(tab) {
    if (tab === 'home') {
        document.getElementById('main-view').classList.remove('hidden');
        document.getElementById('dashboard-view').classList.add('hidden');
    } else if (tab === 'dashboard' && userData) {
        document.getElementById('main-view').classList.add('hidden');
        document.getElementById('dashboard-view').classList.remove('hidden');
    }
}

function logout() {
    localStorage.removeItem('mongolpay_active_session');
    userData = null;
    isContractSigned = false;
    isSignatureDrawn = false;
    location.reload();
}

// AUTO RESTORE SESSION
window.addEventListener('DOMContentLoaded', () => {
    const activeSessionPhone = localStorage.getItem('mongolpay_active_session');
    if (activeSessionPhone) {
        const stored = localStorage.getItem(`mongolpay_user_${activeSessionPhone}`);
        if (stored) {
            userData = JSON.parse(stored);
            renderDashboard();
        }
    }
});